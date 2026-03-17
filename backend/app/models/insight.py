from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from app.db.base_class import Base

class Insight(Base):
    __tablename__ = "insight"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    impact_level = Column(String) # High, Medium, Low
    confidence_score = Column(Float)
    evidence = Column(JSON, nullable=True)
    ai_root_cause = Column(String, nullable=True)
    predictive_outlook = Column(String, nullable=True)
    prescriptive_action = Column(String, nullable=True)
    category = Column(String, default="Operations")
    status = Column(String, default="active") # active, dismissed, resolved
    visualization_data = Column(JSON, nullable=True) # Data for charts

    data_source_id = Column(Integer, ForeignKey("data_source.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
