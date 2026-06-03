from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatarUrl: Optional[str] = Field(None, description="URL to the user's avatar image")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="User password must be at least 8 characters long")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    avatarUrl: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)

class UserResponse(UserBase):
    id: UUID
    createdAt: datetime

    class Config:
        from_attributes = True

class UserProfile(UserResponse):
    phone: Optional[str] = None
    bio: Optional[str] = None
    address: Optional[str] = None

class UserList(UserBase):
    id: UUID

    class Config:
        from_attributes = True
