from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Optional, List
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="The name of the organization")
    email: EmailStr = Field(..., description="Contact email for the organization")
    tax_id: Optional[str] = Field(None, max_length=50, description="Tax identification number")
    address: Optional[str] = Field(None, max_length=500, description="Physical address of the organization")
    phone: Optional[str] = Field(None, max_length=20, description="Contact phone number")
    website: Optional[HttpUrl] = Field(None, description="Organization website URL")

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    tax_id: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    website: Optional[HttpUrl] = None

class OrganizationResponse(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrganizationList(BaseModel):
    items: List[OrganizationResponse]
    total: int
