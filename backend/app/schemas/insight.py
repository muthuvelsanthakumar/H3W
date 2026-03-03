from typing import Optional, Any
from pydantic import BaseModel
from datetime import datetime

class InsightBase(BaseModel):
    title: str
    description: str
    impact_level: Optional[str] = None
    confidence_score: Optional[float] = None
    category: Optional[str] = "Operations"
    status: Optional[str] = "active"
    ai_root_cause: Optional[str] = None
    visualization_data: Optional[Any] = None

class InsightCreate(InsightBase):
    organization_id: int
    data_source_id: Optional[int] = None

class Insight(InsightBase):
    id: int
    organization_id: int
    data_source_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
