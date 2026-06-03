import asyncio
import uuid
from app.core.config import settings
from app.core.database import async_session, Base
from app.models.user import User
from app.models.organization import Organization
from sqlalchemy import text

async def seed_db():
    async with async_session() as session:
        # Check if data already exists
        result = await session.execute(text("SELECT count(*) FROM users"))
        count = result.scalar()
        if count > 0:
            print("Database already seeded. Skipping...")
            return

        print("Seeding database...")

        # Create admin user
        admin_id = str(uuid.uuid4())
        admin_user = User(
            id=admin_id,
            email="admin@nijaspec.com",
            full_name="NijaSpec Admin",
            is_active=True,
            password_hash="hashed_password_placeholder" # In real usage, use pwd_context.hash("password")
        )
        session.add(admin_user)

        # Create default organization
        default_org = Organization(
            name="NijaSpec Default Org",
            slug="nijaspec-default",
            description="Default organization for NijaSpec",
            owner_id=admin_id
        )
        session.add(default_org)

        # Link user to organization
        admin_user.organization_id = default_org.id # This might be tricky because ID is generated on commit

        # We need to flush to get the organization ID if it's autoincrement
        await session.flush()
        admin_user.organization_id = default_org.id

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
