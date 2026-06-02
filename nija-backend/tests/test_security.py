"""Tests for the security module (JWT tokens and password hashing)."""

from datetime import timedelta

from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
    verify_token,
)


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
    # Replace the signature portion (after the second dot) entirely
    parts = token.split(".")
    parts[2] = "AAAA" * 10  # Completely invalid signature
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
