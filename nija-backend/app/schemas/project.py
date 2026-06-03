from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="The name of the project")
    description: Optional[str] = Field(None, description="Optional description of the project")

class ProjectCreate(ProjectBase):
    organization_id: int = Field(..., description="The ID of the organization the project belongs to")

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectAnalyticsResponse(BaseModel):
    project_id: int
    total_specs: int
    total_runs: int
    compliance_score: float
    last_run_date: Optional[datetime]
    status: str
