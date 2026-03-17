from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
import pandas as pd
import io

from app.api import deps
from app.services.data_quality import DataQualityService
from app.models.data_source import DataSource as DataSourceModel
from app.models.user import User
from app.schemas.data_source import DataSource as DataSourceSchema, DataSourceUpdate
from app.core.limiter import limiter

router = APIRouter()

@router.post("/upload")
@limiter.limit("10/minute")
async def upload_data(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Upload a CSV or Excel file for ingestion and quality assessment.
    """
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported.")
    
    MAX_FILE_SIZE = 15 * 1024 * 1024 # 15MB
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 15MB.")
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")
    try:
        if file.filename.endswith('.csv'):
            try:
                df = pd.read_csv(io.BytesIO(contents))
            except UnicodeDecodeError:
                # Fallback for Windows-encoded CSVs (like Superstore)
                df = pd.read_csv(io.BytesIO(contents), encoding='windows-1252')
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing file: {str(e)}\n\n(Hint: Ensure your file is a valid CSV or Excel document)")

    # 1. Assess Data Quality
    quality_report = DataQualityService.assess_quality(df)
    
    # 2. Store Metadata (In production, save file to S3/Supabase Storage)
    data_source = DataSourceModel(
        name=file.filename,
        source_type=file.filename.split('.')[-1],
        health_score=quality_report["health_score"],
        quality_report=quality_report,
        schema_info=df.dtypes.apply(lambda x: str(x)).to_dict(),
        organization_id=current_user.organization_id,
        created_by=current_user.id
    )
    
    db.add(data_source)
    db.commit()
    db.refresh(data_source)
    
    return {
        "id": data_source.id,
        "filename": file.filename,
        "health_score": quality_report["health_score"],
        "quality_report": quality_report
    }

@router.get("/sources", response_model=List[DataSourceSchema])
@limiter.limit("60/minute")
def get_data_sources(
    request: Request,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Get all data sources for the organization.
    """
    sources = db.query(DataSourceModel).filter(
        DataSourceModel.organization_id == current_user.organization_id
    ).offset(skip).limit(limit).all()
    return sources
@router.delete("/{source_id}")
@limiter.limit("5/minute")
def delete_data_source(
    request: Request,
    source_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Delete a data source.
    """
    source = db.query(DataSourceModel).filter(
        DataSourceModel.id == source_id,
        DataSourceModel.organization_id == current_user.organization_id
    ).first()
    
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    db.delete(source)
    db.commit()
    return {"message": "Data source deleted successfully", "id": source_id}
@router.patch("/{source_id}", response_model=DataSourceSchema)
@limiter.limit("5/minute")
def update_data_source(
    request: Request,
    source_id: int,
    obj_in: DataSourceUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update calibration settings for a data source.
    """
    source = db.query(DataSourceModel).filter(
        DataSourceModel.id == source_id,
        DataSourceModel.organization_id == current_user.organization_id
    ).first()
    
    if not source:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    # Update settings
    source.settings = {**source.settings, **obj_in.settings}
    
    # In a real system, we would trigger a re-assessment here if we had the file.
    # For now, we update the metadata.
    db.add(source)
    db.commit()
    db.refresh(source)
    return source
