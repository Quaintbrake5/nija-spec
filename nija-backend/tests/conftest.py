import os
import asyncio

# Set DATABASE_URL to SQLite BEFORE any app imports so that
# app.core.database creates an in-memory engine instead of trying PostgreSQL.
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool
from typing import AsyncGenerator

from main import app as fastapi_app
from app.core.config import Settings
from app.core.database import Base, get_db
from app.models.user import User
from app.models.organization import Organization
import app.core.database as db_module

# Override settings for testing
TEST_SETTINGS = Settings(
    DATABASE_URL="sqlite+aiosqlite:///:memory:",
    DEBUG=True,
    APP_ENV="testing"
)

# Create a test engine using StaticPool to share the in-memory database connection
test_engine = create_async_engine(
    TEST_SETTINGS.DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

@pytest_asyncio.fixture(scope="session")
async def setup_database():
    """
    Session-scoped fixture to initialize the database schema once for the entire test session.
    """
    # Override the engine and session in the database module so services use the test DB
    db_module.engine = test_engine
    db_module.async_session = TestSessionLocal

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield test_engine

    await test_engine.dispose()

@pytest_asyncio.fixture
async def db_session(setup_database) -> AsyncGenerator[AsyncSession, None]:
    """
    Fixture to provide a clean database session for each test.
    Rolls back changes after the test to ensure isolation.
    """
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()
        await session.close()

@pytest_asyncio.fixture
async def client(db_session) -> AsyncGenerator[AsyncClient, None]:
    """
    Fixture to provide an AsyncClient for making requests to the FastAPI app.
    Overrides the get_db dependency to use the test session.
    """
    async def override_get_db():
        yield db_session

    # Apply dependency override
    fastapi_app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(transport=ASGITransport(app=fastapi_app), base_url="http://test") as ac:
        yield ac

    # Clear dependency overrides after the test
    fastapi_app.dependency_overrides.clear()

# --- Test Data Utilities ---

@pytest_asyncio.fixture
async def test_org(db_session: AsyncSession):
    """
    Fixture to create a test organization.
    """
    # We need a user to be the owner
    user = User(email="owner@test.com", full_name="Org Owner", role="admin")
    db_session.add(user)
    await db_session.flush()

    org = Organization(
        name="Test Org",
        slug="test-org",
        description="A test organization",
        owner_id=user.id
    )
    db_session.add(org)
    await db_session.flush()
    await db_session.commit()
    return org

@pytest_asyncio.fixture
async def test_user(db_session: AsyncSession, test_org):
    """
    Fixture to create a test user associated with a test organization.
    """
    user = User(
        email="user@test.com",
        full_name="Test User",
        organization_id=test_org.id,
        role="member"
    )
    db_session.add(user)
    await db_session.flush()
    await db_session.commit()
    return user

@pytest_asyncio.fixture
async def auth_headers(test_user):
    """
    Helper to provide mock auth headers.
    In a real scenario, this would generate a JWT token.
    """
    # This is a placeholder. You should implement a function that
    # creates a real JWT token using app.core.security.
    return {"Authorization": f"Bearer mock-token-{test_user.id}"}
