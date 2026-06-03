import pytest
import asyncio
from sqlalchemy import create_engine, text
from alembic.config import Config
from alembic import command
import os

# Use a separate test database
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_migrations.db"

@pytest.fixture(scope="function")
def db_engine():
    # Clean up any existing test database
    if os.path.exists("test_migrations.db"):
        os.remove("test_migrations.db")

    engine = create_engine(TEST_DATABASE_URL)
    yield engine

    engine.dispose()
    if os.path.exists("test_migrations.db"):
        os.remove("test_migrations.db")

@pytest.fixture(scope="function")
def alembic_config():
    cfg = Config("alembic.ini")
    cfg.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    return cfg

def test_migrations_up_and_down(db_engine, alembic_config):
    # 1. Test Upgrade
    command.upgrade(alembic_config, "head")

    with db_engine.connect() as conn:
        # Verify users table exists
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'"))
        assert result.fetchone() is not None

        # Verify organizations table exists
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'"))
        assert result.fetchone() is not None

        # Verify seed data is present
        user = conn.execute(text("SELECT email FROM users WHERE email = 'admin@nijaspec.io'")).fetchone()
        assert user is not None

        org = conn.execute(text("SELECT name FROM organizations WHERE slug = 'nijaspec'")).fetchone()
        assert org is not None

    # 2. Test Rollback (Down)
    command.downgrade(alembic_config, "base")

    with db_engine.connect() as conn:
        # Verify users table is gone
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'"))
        assert result.fetchone() is None

        # Verify organizations table is gone
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='organizations'"))
        assert result.fetchone() is None

def test_partial_rollback(db_engine, alembic_config):
    # Upgrade to head
    command.upgrade(alembic_config, "head")

    # Rollback one version (from seed to initial)
    # We need the revision ID of the initial migration
    # Instead of hardcoding, we can use -1
    command.downgrade(alembic_config, "-1")

    with db_engine.connect() as conn:
        # Tables should still exist
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'"))
        assert result.fetchone() is not None

        # Seed data should be gone
        user = conn.execute(text("SELECT email FROM users WHERE email = 'admin@nijaspec.io'")).fetchone()
        assert user is None
