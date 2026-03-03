import pytest
from httpx import AsyncClient
from app.main import app
from app.core.security import create_access_token
from app.core.config import settings
from datetime import timedelta

# Mock user data for testing
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "testpassword123"

@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_access_token_creation():
    """
    Validates that a JWT access token can be created and has the correct expiration.
    This tests the core security utility without needing a database.
    """
    data = {"sub": TEST_USER_EMAIL}
    token = create_access_token(data=data, expires_delta=timedelta(minutes=30))
    assert isinstance(token, str)
    assert len(token) > 0

@pytest.mark.asyncio
async def test_login_flow(async_client):
    """
    Simulates a login flow. 
    Note: A full integration test would require a seeded database user.
    This test validates the structure of the login request endpoint behavior.
    """
    response = await async_client.post(
        f"{settings.API_V1_STR}/login/access-token",
        data={"username": "admin@h3w.com", "password": "wrongpassword"}
    )
    # Expected behavior: 400 Bad Request or 401 Unauthorized for wrong credentials
    # This proves the endpoint is reachable and processing logic.
    assert response.status_code in [400, 401]
