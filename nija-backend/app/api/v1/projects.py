from fastapi import APIRouter
from typing import List, Any

router = APIRouter(tags=["Projects"])

@router.get("/orgs/{org_id}/projects", response_model=List[Any])
async def list_projects(org_id: str):
    """
    List projects for a specific organization.
    """
    return [{"id": "proj-1", "name": "Mock Project", "org_id": org_id}]

@router.post("/orgs/{org_id}/projects")
async def create_project(org_id: str, project_data: Any):
    """
    Create a project for a specific organization.
    """
    return {"id": "proj-1", "name": "Mock Project", "org_id": org_id}

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """
    Get project details.
    """
    return {"id": project_id, "name": "Mock Project"}

@router.put("/projects/{project_id}")
async def update_project(project_id: str, project_data: Any):
    """
    Update project details.
    """
    return {"id": project_id, "name": "Updated Mock Project"}

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """
    Delete a project.
    """
    return {"message": "Project deleted successfully"}
