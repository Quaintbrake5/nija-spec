import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, verify_token
from app.models.user import User

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def verify_google_token(self, token: str) -> Optional[User]:
        """
        Verify a Google ID token and return the user.
        Creates the user if they don't exist.
        """
        try:
            # Verify the ID token with Google
            id_info = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )

            google_id = id_info.get("sub")
            email = id_info.get("email")
            name = id_info.get("name")
            picture = id_info.get("picture")

            if not google_id or not email:
                return None

            # Check if user exists
            result = await self.db.execute(
                select(User).where((User.google_id == google_id) | (User.email == email))
            )
            user = result.scalar_one_or_none()

            if not user:
                # Create new user
                user = User(
                    email=email,
                    full_name=name,
                    avatar_url=picture,
                    google_id=google_id,
                    is_active=True
                )
                self.db.add(user)
                await self.db.commit()
                await self.db.refresh(user)

            elif not user.google_id:
                # Link Google ID to existing email-based user
                user.google_id = google_id
                await self.db.commit()
                await self.db.refresh(user)

            return user

        except ValueError:
            # Invalid token
            return None

    async def generate_magic_link(self, email: str) -> Optional[str]:
        """
        Generate a magic link token for a user.
        Returns the token string.
        """
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            # Optionally create a user or just return None
            return None

        # Generate a secure random token
        token = secrets.token_urlsafe(32)
        expiry = datetime.now(timezone.utc) + timedelta(hours=1)

        user.magic_token = token
        user.magic_token_expires_at = expiry

        await self.db.commit()
        return token

    async def verify_magic_link(self, token: str) -> Optional[User]:
        """
        Verify a magic link token and return the user.
        Invalidates the token after use.
        """
        result = await self.db.execute(
            select(User).where(User.magic_token == token)
        )
        user = result.scalar_one_or_none()

        if not user:
            return None

        # Check expiry
        if not user.magic_token_expires_at or user.magic_token_expires_at < datetime.now(timezone.utc):
            # Token expired
            user.magic_token = None
            user.magic_token_expires_at = None
            await self.db.commit()
            return None

        # Token is valid, clear it
        user.magic_token = None
        user.magic_token_expires_at = None
        await self.db.commit()

        return user

    async def create_session(self, user: User) -> Tuple[str, str]:
        """
        Create a new user session (access and refresh tokens).
        """
        access_token = create_access_token(data={"sub": user.id, "email": user.email})
        refresh_token = create_refresh_token(data={"sub": user.id})

        return access_token, refresh_token

    async def validate_session(self, token: str) -> Optional[User]:
        """
        Validate a JWT token and return the associated user.
        """
        payload = verify_token(token)
        if not payload or payload.get("type") != "access":
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            return None

        return user

    async def refresh_session(self, refresh_token: str) -> Optional[Tuple[str, str]]:
        """
        Refresh an access token using a refresh token.
        """
        payload = verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            return None

        return await self.create_session(user)
