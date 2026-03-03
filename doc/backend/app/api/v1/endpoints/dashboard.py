from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api import deps
from app.models.data_source import DataSource
from app.models.insight import Insight
from app.models.user import User

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get summary statistics for the dashboard.
    """
    # 1. Total Data Sources
    total_sources = db.query(DataSource).filter(DataSource.organization_id == current_user.organization_id).count()
    
    # 2. Average Health Score
    avg_health = db.query(func.avg(DataSource.health_score)).filter(DataSource.organization_id == current_user.organization_id).scalar() or 0
    
    # 3. Critical Risks (Health < 50)
    critical_risks = db.query(DataSource).filter(
        DataSource.organization_id == current_user.organization_id,
        DataSource.health_score < 50
    ).count()
    
    # 4. Live Insights
    live_insights = db.query(Insight).filter(
        Insight.organization_id == current_user.organization_id,
        Insight.status == "active"
    ).count()
    
    return {
        "business_health": round(avg_health, 1),
        "data_integrity": f"{round(avg_health, 1)}%",
        "total_sources": total_sources,
        "critical_risks": critical_risks,
        "live_insights": live_insights
    }

import random
from datetime import datetime, timedelta

@router.get("/performance")
def get_performance_data(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get performance time-series data for the dashboard charts.
    """
    avg_health = db.query(func.avg(DataSource.health_score)).filter(
        DataSource.organization_id == current_user.organization_id
    ).scalar() or 75.0

    # Generate 7 days of realistic performance stats
    perf_data = []
    base_revenue = 15000 + (avg_health * 50)
    
    # Use dates instead of static "Day X"
    today = datetime.now()
    
    for i in range(7):
        date = today - timedelta(days=(6-i))
        day_label = date.strftime("%b %d")
        
        # Stochastic Revenue: Base + Trend + Random Noise
        # Noise is higher if health is lower
        volatility = (100 - avg_health) * 2
        jitter = random.uniform(-volatility, volatility)
        
        revenue = base_revenue + (i * 200) + (jitter * 10)
        
        # Churn: Inverse of health + Random jitter
        # If health is low, churn is higher and more erratic
        churn_base = max(1, 12 - (avg_health / 10))
        churn = churn_base + random.uniform(-0.5, 0.5) - (i * 0.1)
        
        perf_data.append({
            "day": day_label,
            "revenue": round(revenue, 2),
            "churn": round(max(0.5, churn), 1),
            "efficiency": round(min(100, avg_health + random.uniform(-2, 2)), 1)
        })
        
    return perf_data
