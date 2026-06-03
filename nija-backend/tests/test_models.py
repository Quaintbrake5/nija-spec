import pytest
import asyncio
import uuid
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import Base, engine, async_session
from app.models import User, Organization, Project, Specification, Run, Patch, Test
from app.schemas.patch import PatchStatus

@pytest.fixture(scope="session", autouse=True)
async def setup_database():
    """Create database tables before running tests"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def db_session():
    """Provides a clean database session for each test"""
    async with async_session() as session:
        yield session
        await session.rollback()

@pytest.mark.asyncio
async def test_user_creation(db_session: AsyncSession):
    """Test creating a user and verifying fields"""
    user = User(
        email="test@example.com",
        full_name="Test User",
        role="admin"
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)

    assert user.id is not None
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"
    assert user.role == "admin"
    assert user.is_active is True

@pytest.mark.asyncio
async def test_user_unique_email(db_session: AsyncSession):
    """Test that duplicate emails raise an integrity error"""
    user1 = User(email="duplicate@example.com")
    db_session.add(user1)
    await db_session.commit()

    user2 = User(email="duplicate@example.com")
    db_session.add(user2)

    with pytest.raises(Exception): # SQLAlchemy raises IntegrityError
        await db_session.commit()

@pytest.mark.asyncio
async def test_organization_and_ownership(db_session: AsyncSession):
    """Test organization creation and owner relationship"""
    user = User(email="owner@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(
        name="Test Org",
        slug="test-org",
        owner_id=user.id
    )
    db_session.add(org)
    await db_session.commit()
    await db_session.refresh(org)

    assert org.id is not None
    assert org.owner_id == user.id

    # Test reverse relationship
    await db_session.refresh(user)
    assert org in user.owned_organizations

@pytest.mark.asyncio
async def test_project_creation(db_session: AsyncSession):
    """Test project creation and its link to organization"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    project = Project(
        name="Test Project",
        description="Project Desc",
        organization_id=org.id
    )
    db_session.add(project)
    await db_session.commit()
    await db_session.refresh(project)

    assert project.id is not None
    assert project.organization_id == org.id
    assert project.organization.name == "Org"

@pytest.mark.asyncio
async def test_specification_creation(db_session: AsyncSession):
    """Test specification creation and relationships"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    project = Project(name="Project", organization_id=org.id)
    db_session.add(project)
    await db_session.flush()

    spec = Specification(
        title="Test Spec",
        content="Spec Content",
        version="1.1.0",
        organization_id=org.id,
        project_id=project.id
    )
    db_session.add(spec)
    await db_session.commit()
    await db_session.refresh(spec)

    assert spec.id is not None
    assert spec.project_id == project.id
    assert spec.organization_id == org.id
    assert spec.project.name == "Project"
    assert spec.organization.name == "Org"

@pytest.mark.asyncio
async def test_run_creation(db_session: AsyncSession):
    """Test run creation and its link to specification"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    project = Project(name="Project", organization_id=org.id)
    db_session.add(project)
    await db_session.flush()

    spec = Specification(title="Spec", content="Content", organization_id=org.id, project_id=project.id)
    db_session.add(spec)
    await db_session.flush()

    run = Run(
        specification_id=spec.id,
        status="running",
        results={"score": 85}
    )
    db_session.add(run)
    await db_session.commit()
    await db_session.refresh(run)

    assert run.id is not None
    assert run.specification_id == spec.id
    assert run.status == "running"
    assert run.results["score"] == 85

@pytest.mark.asyncio
async def test_patch_creation(db_session: AsyncSession):
    """Test patch creation and its links"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    project = Project(name="Project", organization_id=org.id)
    db_session.add(project)
    await db_session.flush()

    spec = Specification(title="Spec", content="Content", organization_id=org.id, project_id=project.id)
    db_session.add(spec)
    await db_session.flush()

    run = Run(specification_id=spec.id)
    db_session.add(run)
    await db_session.flush()

    patch = Patch(
        id=str(uuid.uuid4()),
        project_id=project.id,
        run_id=run.id,
        breach_id="BREACH-001",
        file_path="src/main.py",
        content="fixed_code = True",
        status=PatchStatus.PENDING
    )
    db_session.add(patch)
    await db_session.commit()
    await db_session.refresh(patch)

    assert patch.id is not None
    assert patch.project_id == project.id
    assert patch.run_id == run.id
    assert patch.status == PatchStatus.PENDING

@pytest.mark.asyncio
async def test_test_creation(db_session: AsyncSession):
    """Test test creation and its link to specification"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    project = Project(name="Project", organization_id=org.id)
    db_session.add(project)
    await db_session.flush()

    spec = Specification(title="Spec", content="Content", organization_id=org.id, project_id=project.id)
    db_session.add(spec)
    await db_session.flush()

    test_case = Test(
        specification_id=spec.id,
        name="Test Security",
        language="python",
        code="def test_security(): assert True"
    )
    db_session.add(test_case)
    await db_session.commit()
    await db_session.refresh(test_case)

    assert test_case.id is not None
    assert test_case.specification_id == spec.id
    assert test_case.name == "Test Security"

@pytest.mark.asyncio
async def test_project_cascade_delete(db_session: AsyncSession):
    """Test that deleting a project deletes its specifications"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    project = Project(name="Project", organization_id=org.id)
    db_session.add(project)
    await db_session.flush()

    spec = Specification(title="Spec", content="Content", organization_id=org.id, project_id=project.id)
    db_session.add(spec)
    await db_session.commit()

    # Delete project
    await db_session.delete(project)
    await db_session.commit()

    # Verify spec is gone
    result = await db_session.execute(select(Specification).where(Specification.id == spec.id))
    assert result.scalar_one_or_none() is None

@pytest.mark.asyncio
async def test_user_organization_membership(db_session: AsyncSession):
    """Test User -> Organization membership relationship"""
    user = User(email="user@example.com")
    db_session.add(user)
    await db_session.flush()

    org = Organization(name="Org", slug="org", owner_id=user.id)
    db_session.add(org)
    await db_session.flush()

    # Join user to organization as a member
    user.organization_id = org.id
    await db_session.commit()
    await db_session.refresh(user)

    assert user.organization_id == org.id
    assert user.organization.name == "Org"

    await db_session.refresh(org)
    assert user in org.users
