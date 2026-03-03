from fastapi import APIRouter
from app.api.v1.endpoints import login, data, insights, dashboard, settings

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(insights.router, prefix="/insights", tags=["insights"])
api_router.include_router(settings.router, prefix="/settings", tags=["settings"])
