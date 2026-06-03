from fastapi.testclient import TestClient
import pytest
import time
import asyncio
from main import app
from app.core.database import Base, engine

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create database tables before running tests"""
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(create_tables())
    yield

@pytest.fixture
def auth_headers():
    """Fixture to provide mock auth headers if needed"""
    return {"Authorization": "Bearer mock-access-token"}

def test_auth_workflow():
    """Test complete authentication workflow"""
    # Google callback
    resp = client.post("/api/v1/auth/google/callback", json={"code": "mock-code"})
    assert resp.status_code == 200
    data = resp.json()
    assert "accessToken" in data
    assert "refreshToken" in data
    assert data["user"]["email"] == "user@example.com"

    # Magic link send
    resp = client.post("/api/v1/auth/magic-link/send", json={"email": "user@example.com"})
    assert resp.status_code == 200
    assert resp.json()["message"] == "Magic link sent successfully"

    # Magic link verify
    resp = client.post("/api/v1/auth/magic-link/verify", json={"token": "mock-token"})
    assert resp.status_code == 200
    assert "accessToken" in resp.json()

    # Refresh token
    resp = client.post("/api/v1/auth/refresh", json={"refreshToken": "mock-refresh-token"})
    assert resp.status_code == 200
    assert "accessToken" in resp.json()

    # Me endpoint
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 200
    assert "email" in resp.json()

    # Logout
    resp = client.post("/api/v1/auth/logout")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Logged out successfully"

def test_organization_workflow():
    """Test complete organization workflow"""
    # Create Org
    org_payload = {
        "name": "Test Org",
        "email": "test@example.com"
    }
    resp = client.post("/api/v1/orgs", json=org_payload)
    assert resp.status_code == 200
    org_id = resp.json()["id"]
    assert org_id == "org-1" # Mocked return

    # Get Org
    resp = client.get(f"/api/v1/orgs/{org_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == org_id

    # Update Org
    update_payload = {"name": "Updated Test Org"}
    resp = client.put(f"/api/v1/orgs/{org_id}", json=update_payload)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated Mock Org" # Mocked return

    # Delete Org
    resp = client.delete(f"/api/v1/orgs/{org_id}")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Organization deleted successfully"

def test_project_workflow():
    """Test complete project workflow"""
    org_id = 1 # Using int as ProjectService expects int

    # Create Project
    project_payload = {
        "name": "Test Project",
        "description": "Test Project Desc",
        "organization_id": org_id
    }
    resp = client.post(f"/api/v1/orgs/{org_id}/projects", json=project_payload)
    assert resp.status_code == 201
    project_data = resp.json()
    project_id = project_data["id"]

    # Get Project
    resp = client.get(f"/api/v1/projects/{project_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == project_id

    # Update Project
    update_payload = {"name": "Updated Project Name"}
    resp = client.put(f"/api/v1/projects/{project_id}", json=update_payload)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated Project Name"

    # Get Analytics
    resp = client.get(f"/api/v1/projects/{project_id}/analytics")
    assert resp.status_code == 200
    assert "total_specs" in resp.json()

    # List Specs
    resp = client.get(f"/api/v1/projects/{project_id}/specs")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

    # Delete Project
    resp = client.delete(f"/api/v1/projects/{project_id}")
    assert resp.status_code == 204

def test_specification_workflow():
    """Test complete specification workflow"""
    project_id = 1 # Using int as ProjectService expects int

    # List Specs
    resp = client.get(f"/api/v1/projects/{project_id}/specs")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

    # Create Spec
    spec_payload = {
        "title": "Test Spec",
        "content": "Test Content",
        "version": "1.0.0",
        "tags": ["test"]
    }
    resp = client.post("/api/v1/specs", json=spec_payload)
    assert resp.status_code == 200
    spec_id = resp.json()["id"]

    # Get Spec
    resp = client.get(f"/api/v1/specs/{spec_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == spec_id

    # Update Spec
    update_payload = {"title": "Updated Spec", "content": "Updated Content"}
    resp = client.put(f"/api/v1/specs/{spec_id}", json=update_payload)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated Mock Spec"

    # Spec Diff
    resp = client.get(f"/api/v1/specs/diff?spec_id_1={spec_id}&spec_id_2={spec_id}")
    assert resp.status_code == 200
    assert "diff" in resp.json()

def test_run_workflow():
    """Test complete run workflow"""
    project_id = 1 # Using int as ProjectService expects int

    # List Runs
    resp = client.get(f"/api/v1/projects/{project_id}/runs")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

    # Create Run
    import uuid
    run_payload = {
        "specification_id": str(uuid.uuid4()),
        "options": {}
    }
    resp = client.post("/api/v1/runs", json=run_payload)
    assert resp.status_code == 200
    run_id = resp.json()["id"]

    # Get Run
    resp = client.get(f"/api/v1/runs/{run_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == run_id

    # Cancel Run
    resp = client.post(f"/api/v1/runs/{run_id}/cancel")
    assert resp.status_code == 200
    assert resp.json()["message"] == "Run cancelled successfully"

    # Get Results
    resp = client.get(f"/api/v1/runs/{run_id}/results")
    assert resp.status_code == 200
    assert "results" in resp.json()

    # Get Artifacts
    resp = client.get(f"/api/v1/runs/{run_id}/artifacts")
    assert resp.status_code == 200
    assert "artifacts" in resp.json()

def test_error_scenarios():
    """Test error handling for non-existent resources"""
    # Project not found
    resp = client.get("/api/v1/projects/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Project not found"

    # Project update not found
    resp = client.put("/api/v1/projects/999999", json={"name": "Fail"})
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Project not found"

    # Project delete not found
    resp = client.delete("/api/v1/projects/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Project not found"

def test_performance_basic():
    """Basic performance check for endpoints"""
    start_time = time.time()
    resp = client.get("/api/v1/auth/me")
    end_time = time.time()
    duration = end_time - start_time

    assert resp.status_code == 200
    assert duration < 0.5 # Should be very fast for a mock/simple call
