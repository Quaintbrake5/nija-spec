"""Tests for the configuration module."""

from app.core.config import Settings


def test_settings_defaults():
    """Settings should load with correct defaults."""
    s = Settings(
        DATABASE_URL="sqlite+aiosqlite:///./test.db",
        SECRET_KEY="test-secret",
    )
    assert s.APP_NAME == "NijaSpec API"
    assert s.APP_VERSION == "1.0.0"
    assert s.APP_ENV == "development"
    assert s.DEBUG is True
    assert s.HOST == "0.0.0.0"
    assert s.PORT == 8000
    assert s.ACCESS_TOKEN_EXPIRE_MINUTES == 30
    assert s.REFRESH_TOKEN_EXPIRE_DAYS == 7


def test_allowed_origins_parsed():
    """ALLOWED_ORIGINS should be parsed from comma-separated string to list."""
    s = Settings(
        DATABASE_URL="sqlite+aiosqlite:///./test.db",
        SECRET_KEY="test-secret",
        ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000",
    )
    assert isinstance(s.ALLOWED_ORIGINS, list)
    assert len(s.ALLOWED_ORIGINS) == 2
    assert "http://localhost:5173" in s.ALLOWED_ORIGINS
    assert "http://localhost:3000" in s.ALLOWED_ORIGINS


def test_single_origin():
    """Single ALLOWED_ORIGINS value should still be a list."""
    s = Settings(
        DATABASE_URL="sqlite+aiosqlite:///./test.db",
        SECRET_KEY="test-secret",
        ALLOWED_ORIGINS="http://localhost:5173",
    )
    assert isinstance(s.ALLOWED_ORIGINS, list)
    assert len(s.ALLOWED_ORIGINS) == 1
