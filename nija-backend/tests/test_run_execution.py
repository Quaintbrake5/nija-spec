import pytest
import time
import os
from fastapi.testclient import TestClient
from main import app
from app.core.database import Base, engine
import asyncio

# Set dev mode to use ts-node instead of nija-audit
os.environ["NIJA_DEV_MODE"] = "true"

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create database tables before running tests"""
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(create_tables())
    yield

def test_complete_trust_engine_pipeline():
    """
    Test the full Trust Engine pipeline:
    Spec Creation -> Run Execution -> Status Tracking -> Results -> Artifacts
    """
    # 1. Create a Specification
    spec_payload = {
        "title": "Integration Test Spec",
        "content": (
            "# Infrastructure\n- Hosting: AWS\n- Data Residency: Foreign\n\n"
            "# Authentication\n- MFA: Disabled\n- TLS: 1.1\n\n"
            "# Data Lifecycle\n- PII Categories: BVN\n- Retention: None\n"
        ),
        "version": "1.0.0",
        "tags": ["integration-test"]
    }
    spec_resp = client.post("/api/v1/specs", json=spec_payload)
    assert spec_resp.status_code == 200
    spec_id = spec_resp.json()["id"]
    print(f"DEBUG: spec_id = {spec_id} (type: {type(spec_id)})")

    # 2. Create a Run
    run_payload = {
        "specification_id": spec_id,
        "options": {}
    }
    print(f"DEBUG: run_payload = {run_payload}")
    run_resp = client.post("/api/v1/runs", json=run_payload)
    assert run_resp.status_code == 201
    run_id = run_resp.json()["id"]
    assert run_resp.json()["status"] == "pending" or run_resp.json()["status"] == "running"

    # 3. Poll for completion
    max_retries = 20
    completed = False
    for _ in range(max_retries):
        status_resp = client.get(f"/api/v1/runs/{run_id}")
        assert status_resp.status_code == 200
        status = status_resp.json()["status"]

        if status == "completed":
            completed = True
            break
        elif status == "failed":
            # If it failed, let's see why
            print(f"Run failed: {status_resp.json()}")
            break

        time.sleep(2)

    assert completed, "Run did not complete within the expected time"

    # 4. Verify Results
    results_resp = client.get(f"/api/v1/runs/{run_id}/results")
    assert results_resp.status_code == 200
    results = results_resp.json()["results"]
    assert "generate" in results
    assert "verify" in results
    assert results["generate"]["exit_code"] == 0
    assert results["verify"]["exit_code"] == 0

    # 5. Verify Artifacts
    artifacts_resp = client.get(f"/api/v1/runs/{run_id}/artifacts")
    assert artifacts_resp.status_code == 200
    artifacts = artifacts_resp.json()["artifacts"]
    assert len(artifacts) > 0
    assert "compliance_report.json" in artifacts
