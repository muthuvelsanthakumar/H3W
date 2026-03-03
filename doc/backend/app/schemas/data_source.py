from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class DataSourceBase(BaseModel):
    name: str
    source_type: str
    health_score: float = 0.0
    quality_report: Optional[Dict[str, Any]] = None
    schema_info: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = {
        "missing_threshold": 10.0,
        "duplicate_threshold": 5.0,
        "sensitivity": "balanced"
    }

class DataSourceUpdate(BaseModel):
    settings: Dict[str, Any]

class DataSourceCreate(DataSourceBase):
    organization_id: int
    created_by: int

class DataSource(DataSourceBase):
    id: int
    organization_id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
