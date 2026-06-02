from fastapi import APIRouter, Depends
from app.schemas.auth import TokenResponse, GoogleCallbackRequest, MagicLinkSendRequest, MagicLinkVerifyRequest, RefreshTokenRequest
from app.schemas.user import UserResponse
from typing import Any

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/google/callback", response_model=TokenResponse)
async def google_callback(request: GoogleCallbackRequest):
    """
    Handle Google OAuth2 callback.
    """
    return {
        "accessToken": "mock-access-token",
        "refreshToken": "mock-refresh-token",
        "user": {"id": "00000000-0000-0000-0000-000000000000", "email": "user@example.com", "name": "Mock User"}
    }

@router.post("/magic-link/send")
async def send_magic_link(request: MagicLinkSendRequest):
    """
    Send a magic link to the provided email.
    """
    return {"message": "Magic link sent successfully"}

@router.post("/magic-link/verify", response_model=TokenResponse)
async def verify_magic_link(request: MagicLinkVerifyRequest):
    """
    Verify magic link token.
    """
    return {
        "accessToken": "mock-access-token",
        "refreshToken": "mock-refresh-token",
        "user": {"id": "00000000-0000-0000-0000-000000000000", "email": "user@example.com", "name": "Mock User"}
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token.
    """
    return {
        "accessToken": "mock-new-access-token",
        "refreshToken": "mock-new-refresh-token",
        "user": {"id": "00000000-0000-0000-0000-000000000000", "email": "user@example.com", "name": "Mock User"}
    }

@router.post("/logout")
async def logout():
    """
    Log out the user.
    """
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me():
    """
    Get current user profile.
    """
    from uuid import uuid4
    from datetime import datetime
    return {
        "id": uuid4(),
        "email": "user@example.com",
        "name": "Mock User",
        "avatarUrl": None,
        "createdAt": datetime.utcnow()
    }
