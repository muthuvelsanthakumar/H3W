from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class DataSource(Base):
    __tablename__ = "data_source"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    source_type = Column(String) # csv, excel, postgres, etc.
    file_path = Column(String, nullable=True) # if uploaded
    schema_info = Column(JSON, nullable=True) # Detected schema
    health_score = Column(Float, default=0.0)
    quality_report = Column(JSON, nullable=True)
    settings = Column(JSON, nullable=True, default={
        "missing_threshold": 10.0,
        "duplicate_threshold": 5.0,
        "sensitivity": "balanced" # high, balanced, low
    })
    
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("user.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
