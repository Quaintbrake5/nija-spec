from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    id: UUID
    email: str
    name: str
    avatarUrl: Optional[str] = None
    createdAt: datetime

class UserResponse(UserBase):
    pass
