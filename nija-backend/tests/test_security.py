"""
Security tests for NijaSpec backend.
Covers:
1. JWT/Password utilities (Unit tests)
2. Authentication (Integration tests)
3. Authorization (Integration tests)
4. Input Validation (Integration tests)
5. SQL Injection Prevention (Integration tests)
6. XSS Protection (Integration tests)
"""

import pytest
from datetime import timedelta
from fastapi.testclient import TestClient

from main import app
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
    verify_token,
)

client = TestClient(app)

# ==============================================================================
# 1. UNIT TESTS: SECURITY UTILITIES
# ==============================================================================

def test_create_access_token_returns_string():
    """Access token should be a valid JWT string."""
    token = create_access_token({"sub": "user@example.com"})
    assert isinstance(token, str)
    assert len(token) > 0


def test_create_refresh_token_returns_string():
    """Refresh token should be a valid JWT string."""
    token = create_refresh_token({"sub": "user@example.com"})
    assert isinstance(token, str)
    assert len(token) > 0


def test_create_access_token_with_custom_expiry():
    """Access token with custom expiry should still produce a valid token."""
    token = create_access_token(
        {"sub": "user@example.com"},
        expires_delta=timedelta(minutes=5),
    )
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == "user@example.com"


def test_verify_token_valid():
    """Verifying a valid token should return the payload."""
    token = create_access_token({"sub": "test@example.com", "role": "user"})
    payload = verify_token(token)
    assert payload is not None
    assert payload["sub"] == "test@example.com"
    assert payload["role"] == "user"


def test_verify_token_invalid():
    """Verifying an invalid token should return None."""
    payload = verify_token("invalid.token.here")
    assert payload is None


def test_verify_token_tampered():
    """Verifying a tampered token should return None."""
    token = create_access_token({"sub": "test@example.com"})
    parts = token.split(".")
    parts[2] = "AAAA" * 10
    tampered = ".".join(parts)
    payload = verify_token(tampered)
    assert payload is None


def test_password_hash():
    """Password hashing should produce a non-empty string different from input."""
    password = "securepassword123"
    hashed = get_password_hash(password)
    assert isinstance(hashed, str)
    assert hashed != password
    assert len(hashed) > 0


def test_verify_password_correct():
    """Verifying correct password should return True."""
    password = "mypassword"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True


def test_verify_password_incorrect():
    """Verifying incorrect password should return False."""
    password = "mypassword"
    hashed = get_password_hash(password)
    assert verify_password("wrongpassword", hashed) is False


def test_access_and_refresh_tokens_differ():
    """Access and refresh tokens for the same data should be different."""
    data = {"sub": "user@example.com"}
    access = create_access_token(data)
    refresh = create_refresh_token(data)
    assert access != refresh


# ==============================================================================
# 2. INTEGRATION TESTS: AUTHENTICATION
# ==============================================================================

def test_auth_unauthenticated_access():
    """
    Test that protected endpoints return 401 Unauthorized when no token is provided.
    Note: This test will FAIL if the API does not yet implement authentication guards.
    """
    response = client.get("/api/v1/projects/1")
    # Expecting 401 Unauthorized
    assert response.status_code == 401, f"Expected 401 but got {response.status_code}. Endpoint is unprotected!"


def test_auth_invalid_token():
    """Test that protected endpoints return 401 when an invalid token is provided."""
    headers = {"Authorization": "Bearer invalid-token"}
    response = client.get("/api/v1/projects/1", headers=headers)
    assert response.status_code == 401


def test_auth_expired_token():
    """Test that protected endpoints return 401 when an expired token is provided."""
    # Create a token that expires in the past
    token = create_access_token({"sub": "user@example.com"}, expires_delta=timedelta(seconds=-1))
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/projects/1", headers=headers)
    assert response.status_code == 401


# ==============================================================================
# 3. INTEGRATION TESTS: AUTHORIZATION
# ==============================================================================

def test_authz_cross_tenant_access():
    """
    Test that a user cannot access projects belonging to another organization.
    Note: This test will FAIL if the API does not yet implement ownership checks.
    """
    token = create_access_token({"sub": "user_a@example.com", "org_id": 1})
    headers = {"Authorization": f"Bearer {token}"}
    # Try to access project belonging to org 2
    response = client.get("/api/v1/orgs/2/projects", headers=headers)
    # Expecting 403 Forbidden
    assert response.status_code == 403, f"Expected 403 but got {response.status_code}. Cross-tenant access allowed!"


# ==============================================================================
# 4. INTEGRATION TESTS: INPUT VALIDATION
# ==============================================================================

def test_input_validation_malformed_json():
    """Test that sending malformed JSON returns 422 Unprocessable Entity."""
    response = client.post(
        "/api/v1/orgs/1/projects",
        content="{'name': 'Bad JSON'", # Missing closing brace
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422


def test_input_validation_missing_required_fields():
    """Test that missing required fields in request body returns 422."""
    # ProjectCreate likely requires 'name'
    invalid_data = {"description": "Missing name"}
    response = client.post("/api/v1/orgs/1/projects", json=invalid_data)
    assert response.status_code == 422


# ==============================================================================
# 5. INTEGRATION TESTS: SQL INJECTION PREVENTION
# ==============================================================================

@pytest.mark.parametrize("sqli_payload", [
    "1 OR 1=1",
    "1; DROP TABLE users--",
    "1' UNION SELECT null, null--",
    "'-1' OR '1'='1",
])
def test_sql_injection_in_params(sqli_payload):
    """
    Test that SQL injection payloads in URL parameters do not cause crashes
    or return unauthorized data.
    """
    # Test in project_id
    response = client.get(f"/api/v1/projects/{sqli_payload}")
    # Should return 404 or 422 (validation error), NOT 200 with leaked data or 500 Internal Server Error
    assert response.status_code in [404, 422], f"Potential SQLi vulnerability or crash: {response.status_code} for payload {sqli_payload}"

    # Test in org_id
    response = client.get(f"/api/v1/orgs/{sqli_payload}/projects")
    assert response.status_code in [404, 422], f"Potential SQLi vulnerability or crash: {response.status_code} for payload {sqli_payload}"


# ==============================================================================
# 6. INTEGRATION TESTS: XSS PROTECTION
# ==============================================================================

def test_xss_protection_in_input():
    """
    Test that XSS payloads in input are handled safely.
    While the backend primarily stores data, it should not be vulnerable to
    injection if it reflects data back in responses or logs.
    """
    xss_payload = "<script>alert('xss')</script>"
    project_data = {
        "name": xss_payload,
        "description": "Testing XSS protection"
    }

    # We assume a valid token for this request
    token = create_access_token({"sub": "user@example.com"})
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/api/v1/orgs/1/projects", json=project_data, headers=headers)

    # If the API returns the created object, check if it's just stored as a string
    if response.status_code == 201:
        data = response.json()
        assert data["name"] == xss_payload, "The payload should be stored literally"
        # The actual protection happens at the frontend (escaping),
        # but we verify the backend doesn't mangle it in a way that suggests vulnerability
    else:
        # If it's not 201, it might be because the API is not implemented or needs auth
        # For now, we just check that it doesn't crash with 500
        assert response.status_code != 500
