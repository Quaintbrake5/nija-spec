from fastapi import APIRouter
from typing import List, Any
from app.schemas.organization import OrganizationCreate, OrganizationUpdate

router = APIRouter(prefix="/orgs", tags=["Organizations"])

@router.get("", response_model=List[Any])
async def list_orgs():
    """
    List all organizations.
    """
    return [{"id": "org-1", "name": "Mock Org"}]

@router.post("")
async def create_org(org_data: OrganizationCreate):
    """
    Create a new organization.
    """
    return {"id": "org-1", "name": "Mock Org"}

@router.get("/{org_id}")
async def get_org(org_id: str):
    """
    Get organization details.
    """
    return {"id": org_id, "name": "Mock Org"}

@router.put("/{org_id}")
async def update_org(org_id: str, org_data: OrganizationUpdate):
    """
    Update organization details.
    """
    return {"id": org_id, "name": "Updated Mock Org"}

@router.delete("/{org_id}")
async def delete_org(org_id: str):
    """
    Delete an organization.
    """
    return {"message": "Organization deleted successfully"}
