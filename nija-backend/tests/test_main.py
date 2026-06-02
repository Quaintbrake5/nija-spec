from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check() -> None:
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_root_endpoint() -> None:
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "NijaSpec API" in data["message"]

def test_auth_me_endpoint() -> None:
    """Test /api/v1/auth/me endpoint"""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert "name" in data

def test_orgs_endpoint() -> None:
    """Test /api/v1/orgs endpoint"""
    response = client.get("/api/v1/orgs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
