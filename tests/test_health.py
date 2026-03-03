import pytest
from httpx import AsyncClient
import asyncio
from app.main import app
from app.core.config import settings


@pytest.mark.asyncio
async def test_read_root():
    """
    Validates that the root / endpoint is accessible.
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "operational"
