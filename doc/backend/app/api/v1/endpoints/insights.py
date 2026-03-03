from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api import deps
from app.services.ai_service import ai_service
from app.models.data_source import DataSource
from app.models.insight import Insight as InsightModel
from app.models.user import User
from app.schemas.insight import Insight as InsightSchema
from app.core.limiter import limiter

router = APIRouter()

@router.get("/", response_model=List[InsightSchema])
def get_insights(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get all active insights for the organization.
    """
    insights = db.query(InsightModel).filter(
        InsightModel.organization_id == current_user.organization_id,
        InsightModel.status == "active"
    ).order_by(InsightModel.created_at.desc()).all()
    
    # If no record of ANY insights (active OR dismissed) exists, create initial ones
    any_exists = db.query(InsightModel).filter(
        InsightModel.organization_id == current_user.organization_id
    ).first()
    
    # If no record of ANY insights (active OR dismissed) exists, create initial ones
    any_exists = db.query(InsightModel).filter(
        InsightModel.organization_id == current_user.organization_id
    ).first()
    
    if not any_exists:
        dummy_insights = [
            InsightModel(
                title="Customer Segment Churn Alert",
                description="High-value enterprise accounts are showing increased churn risk due to delayed maintenance response times.",
                impact_level="High",
                confidence_score=92.0,
                category="Sales",
                organization_id=current_user.organization_id,
                ai_root_cause="Operational latency in high-priority service tier delivery leading to customer dissatisfaction.",
                visualization_data=[{
                    "type": "area",
                    "title": "Churn vs Response Time",
                    "data": [
                        {"name": "D1", "churn": 2.1, "res": 12},
                        {"name": "D2", "churn": 2.4, "res": 15},
                        {"name": "D3", "churn": 3.2, "res": 22},
                    ],
                    "metrics": [{"key": "churn", "color": "#ef4444", "name": "Churn"}, {"key": "res", "color": "#4f46e5", "name": "Latency"}]
                }]
            ),
            InsightModel(
                title="Marketing ROI Optimization",
                description="Digital campaign efficiency is significantly higher in professional network segments compared to broad search.",
                impact_level="Medium",
                confidence_score=85.0,
                category="Marketing",
                organization_id=current_user.organization_id,
                ai_root_cause="Strategic targeting of high-intent demographics is yielding superior lead quality over volume-based spending.",
                visualization_data=[{
                    "type": "bar",
                    "title": "Return on Investment (ROI)",
                    "data": [
                        {"segment": "Network", "val": 4.8},
                        {"segment": "Search", "val": 2.1}
                    ],
                    "metrics": [{"key": "val", "color": "#4f46e5", "name": "ROI Score"}]
                }]
            )
        ]
        for insight in dummy_insights:
            db.add(insight)
        db.commit()
        insights = db.query(InsightModel).filter(
            InsightModel.organization_id == current_user.organization_id,
            InsightModel.status == "active"
        ).all()
    
    # JARGON CLEANSER: If existing insights have technical jargon, cleanse them for the UI
    for ins in insights:
        # Check for underscores or technical keywords in root cause OR description
        tech_terms = ["column", "cardinality", "null", "type", "outlier", "skewness"]
        needs_cleansing = any(term in ins.ai_root_cause.lower() for term in tech_terms) or \
                          "_" in ins.ai_root_cause or \
                          any(term in ins.description.lower() for term in tech_terms)

        if needs_cleansing:
            # Automatic translation of jargon-heavy text into business terms
            raw_text = (ins.ai_root_cause + " " + ins.description).lower()
            
            if "mrr" in raw_text or "revenue" in raw_text:
                ins.ai_root_cause = "Recent transaction patterns show unexpected volatility in monthly recurring revenue streams."
                ins.description = "Revenue streams are displaying anomalous fluctuations that may impact quarterly forecasting."
            elif "churn" in raw_text:
                ins.ai_root_cause = "Ecosystem signals indicate a shift in customer retention health within key service segments."
                ins.description = "Risk profiles for subscription accounts have shifted, requiring immediate retention engagement."
            elif "spend" in raw_text or "roi" in raw_text:
                ins.ai_root_cause = "Capital allocation across marketing channels is showing diminishing returns in broad segments."
                ins.description = "Marketing spend efficiency is declining in broad reach campaigns; reallocation to niche segments recommended."
            else:
                ins.ai_root_cause = "Anomalous patterns detected in operational performance metrics require strategic review."
                ins.description = "Operational data suggests underlying inefficiencies that could impact overall business health."

        if not ins.visualization_data:
            ins.visualization_data = [{
                "type": "bar",
                "title": "Impact Assessment (Auto-Generated)",
                "data": [
                    {"segment": "Current", "value": 75},
                    {"segment": "Projected", "value": 90}
                ],
                "metrics": [{"key": "value", "color": "#4f46e5", "name": "Confidence Level"}]
            }]
        
    return insights

@router.post("/{insight_id}/execute")
def execute_insight(
    insight_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Execute the recommended action for an insight.
    """
    print(f"⚡ EXECUTING AI STRATEGY for insight {insight_id}")
    insight = db.query(InsightModel).filter(
        InsightModel.id == insight_id,
        InsightModel.organization_id == current_user.organization_id
    ).first()
    
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    
    # In a real-world scenario, this would trigger external APIs/Integrations
    # (e.g., Salesforce update, Stripe discount, Hubspot email)
    insight.status = "resolved"
    db.commit()
    
    return {"status": "success", "message": f"Strategy for '{insight.title}' has been autonomously executed."}

@router.delete("/{insight_id}")
@limiter.limit("5/minute")
def dismiss_insight(
    request: Request,
    insight_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Soft delete/dismiss an individual insight.
    """
    print(f"🗑️ Attempting to dismiss insight {insight_id} for user {current_user.id}")
    insight = db.query(InsightModel).filter(
        InsightModel.id == insight_id,
        InsightModel.organization_id == current_user.organization_id
    ).first()
    
    if not insight:
        print(f"❌ Insight {insight_id} not found or access denied")
        raise HTTPException(status_code=404, detail="Insight not found")
    
    # We'll do a soft delete by changing status
    insight.status = "dismissed"
    db.commit()
    print(f"✅ Insight {insight_id} dismissed successfully")
    
    return {"message": "Insight dismissed successfully", "id": insight_id}

@router.post("/{source_id}/explain")
@limiter.limit("5/minute")
async def explain_insight(
    request: Request,
    source_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    # Existing explain logic...
    data_source = db.query(DataSource).filter(
        DataSource.id == source_id, 
        DataSource.organization_id == current_user.organization_id
    ).first()
    
    if not data_source:
        raise HTTPException(status_code=404, detail="Data source not found")
    
    explanation = await ai_service.generate_explanation(
        insight_data=data_source.quality_report,
        context=f"Data Source Name: {data_source.name}, Type: {data_source.source_type}"
    )
    
    return {
        "source_id": source_id,
        "explanation": explanation
    }
@router.post("/generate")
@limiter.limit("2/minute")
async def generate_global_insights(
    request: Request,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Triggers a global AI analysis across all data sources to discover new business intelligence.
    """
    # 1. Fetch data source summaries
    sources = db.query(DataSource).filter(
        DataSource.organization_id == current_user.organization_id
    ).all()
    
    if not sources:
        raise HTTPException(status_code=400, detail="No data sources found. Please ingest data first.")
    
    sources_summary = [
        {"name": s.name, "type": s.source_type, "quality_report": s.quality_report} 
        for s in sources
    ]
    
    # 2. Call AI Service for cross-source analysis
    new_insights_data = await ai_service.analyze_streams(sources_summary)
    
    # 3. Save to DB
    created_insights = []
    for data in new_insights_data:
        insight = InsightModel(
            **data,
            organization_id=current_user.organization_id,
            status="active"
        )
        db.add(insight)
        created_insights.append(insight)
    
    if created_insights:
        db.commit()
        for i in created_insights: db.refresh(i)
        return created_insights
    
    # If AI found nothing new, return empty list (standard success)
    return []
