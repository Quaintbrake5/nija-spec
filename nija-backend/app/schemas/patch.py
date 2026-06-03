from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from enum import Enum

class PatchStatus(str, Enum):
    PENDING = "pending"
    APPLIED = "applied"
    FAILED = "failed"
    REJECTED = "rejected"

class PatchBase(BaseModel):
    breach_id: str
    file_path: str
    content: str
    description: Optional[str] = None

class PatchCreate(PatchBase):
    """Schema for creating a new remediation patch."""
    pass

class PatchResponse(PatchBase):
    """Schema for returning patch details including metadata and status."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: PatchStatus
    created_at: datetime
    updated_at: datetime

class PatchList(BaseModel):
    """Schema for a paginated or summarized list of patches."""
    patches: List[PatchResponse]
    total: int
