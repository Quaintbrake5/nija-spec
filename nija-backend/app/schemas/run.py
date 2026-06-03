from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class RunStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class RunCreate(BaseModel):
    specification_id: int
    options: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional configuration for the run (e.g., LLM model, strictness level)"
    )

class RunResults(BaseModel):
    total_breaches: int = Field(default=0, description="Total number of compliance breaches detected")
    remediated_breaches: int = Field(default=0, description="Number of breaches successfully remediated")
    failed_breaches: int = Field(default=0, description="Number of breaches that could not be remediated")
    summary: Optional[str] = Field(None, description="High-level summary of the run results")
    details: List[Dict[str, Any]] = Field(default_factory=list, description="Detailed breakdown of breaches and remediations")

class RunResponse(BaseModel):
    id: int
    specification_id: int
    status: RunStatus
    results: Optional[Any] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error: Optional[str] = None

    class Config:
        from_attributes = True

class RunList(BaseModel):
    id: int
    specification_id: int
    status: RunStatus
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    total_breaches: Optional[int] = None

    class Config:
        from_attributes = True
