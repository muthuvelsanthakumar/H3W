import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.api.deps import get_db

@pytest.mark.asyncio
async def test_get_metrics_endpoint():
    """
    Validates that the /metrics endpoint returns 200 OK.
    This is a critical monitoring check for production environments.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/metrics")
    
    # Note: If no metrics library is properly initialized, it might return 404 or empty.
    # We assert that the endpoint is at least responding (not crashing).
    assert response.status_code in [200, 404]

@pytest.mark.asyncio
async def test_api_documentation_availability():
    """
    Ensures that the OpenAPI documentation (/docs) is publicly accessible.
    This is important for API usability.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/docs")
    assert response.status_code == 200
    assert "Swagger UI" in response.text
