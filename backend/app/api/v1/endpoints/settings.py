from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.api import deps
from app.models.organization import Organization
from app.models.user import User
from app.schemas.organization import OrgUpdate

router = APIRouter()

@router.get("/organization")
def get_org_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    # Public access mode (bypassed auth returns first user)
    org = db.query(Organization).first()
    if not org:
        org = Organization(name="Acme Corp", slug="acme-corp", settings={
            "verbosity": "Balanced",
            "conservative": True,
            "realtime": False,
            "notifications": True
        })
        db.add(org)
        db.commit()
        db.refresh(org)
    return org

@router.patch("/organization")
def update_org_settings(
    update_data: OrgUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    org = db.query(Organization).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    if update_data.name is not None:
        org.name = update_data.name
    
    if update_data.settings is not None:
        # Create a new dict to ensure SQLAlchemy detects the change
        current_settings = dict(org.settings or {})
        current_settings.update(update_data.settings)
        org.settings = current_settings
        
    db.add(org)
    db.commit()
    db.refresh(org)
    return org
