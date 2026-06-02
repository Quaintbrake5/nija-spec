from pydantic import BaseModel, EmailStr
from typing import Any

class GoogleCallbackRequest(BaseModel):
    code: str

class MagicLinkSendRequest(BaseModel):
    email: EmailStr

class MagicLinkVerifyRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    user: Any

class RefreshTokenRequest(BaseModel):
    refreshToken: str
