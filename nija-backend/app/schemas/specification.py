from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class SpecificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="The title of the specification")
    content: str = Field(..., min_length=1, description="The markdown content of the specification")
    version: str = Field("1.0.0", pattern=r"^\d+\.\d+\.\d+$", description="Semantic versioning of the specification (e.g., 1.0.0)")
    tags: List[str] = Field(default=[], description="Tags associated with the specification")

    @validator("content")
    def content_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Content cannot be empty or just whitespace")
        return v

class SpecificationCreate(SpecificationBase):
    pass

class SpecificationUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    version: Optional[str] = Field(None, pattern=r"^\d+\.\d+\.\d+$")
    tags: Optional[List[str]] = None

    @validator("content")
    def content_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError("Content cannot be empty or just whitespace")
        return v

class SpecificationResponse(SpecificationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SpecificationList(BaseModel):
    items: List[SpecificationResponse]
    total: int
    page: int
    size: int
