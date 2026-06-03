from fastapi import APIRouter, Depends, Request
from app.schemas.auth import TokenResponse, GoogleCallbackRequest, MagicLinkSendRequest, MagicLinkVerifyRequest, RefreshTokenRequest
from app.schemas.user import UserResponse
from fastapi.responses import RedirectResponse, JSONResponse
from app.core.config import settings
from typing import Any

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.api_route("/google/login", methods=["GET", "HEAD"])
async def google_login(request: Request):
    """
    Initiate Google OAuth2 login flow.
    This endpoint redirects the user to Google's OAuth consent screen.
    """
    # Check if Google OAuth is configured
    if not settings.GOOGLE_CLIENT_ID or settings.GOOGLE_CLIENT_ID == "your-google-client-id":
        # Check if the client wants JSON response (API call) or redirect (browser navigation)
        accept_header = request.headers.get("accept", "")
        if "application/json" in accept_header:
            # Return JSON response for API calls
            return JSONResponse(
                status_code=200,
                content={
                    "message": "Google OAuth is not configured. Using mock authentication.",
                    "mock": True,
                    "instructions": "To enable Google OAuth, set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file"
                }
            )
        else:
            # Return a simple HTML page with a message for browser navigation
            return JSONResponse(
                status_code=200,
                content={
                    "message": "Google OAuth is not configured for this environment.",
                    "mock": True,
                    "instructions": "Please use email/password login or set up Google OAuth credentials in the backend .env file"
                }
            )

    # In a real implementation, this would redirect to Google's OAuth URL
    google_oauth_url = f"https://accounts.google.com/o/oauth2/auth?client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:8001/api/v1/auth/google/callback&response_type=code&scope=openid%20email%20profile"
    return RedirectResponse(url=google_oauth_url)

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
