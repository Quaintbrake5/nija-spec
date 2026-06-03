from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any
from app.core.database import get_db
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectAnalyticsResponse

router = APIRouter(tags=["Projects"])

async def get_project_service(db: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(db)

@router.get("/orgs/{org_id}/projects", response_model=List[ProjectResponse])
async def list_projects(org_id: int, service: ProjectService = Depends(get_project_service)):
    """
    List projects for a specific organization.
    """
    return await service.get_projects_by_org(org_id)

@router.post("/orgs/{org_id}/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(org_id: int, project_data: ProjectCreate, service: ProjectService = Depends(get_project_service)):
    """
    Create a project for a specific organization.
    """
    # We override organization_id from the URL to ensure it's consistent
    project_data.organization_id = org_id
    return await service.create_project(project_data)

@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: int, service: ProjectService = Depends(get_project_service)):
    """
    Get project details.
    """
    project = await service.get_project(project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(project_id: int, project_data: ProjectUpdate, service: ProjectService = Depends(get_project_service)):
    """
    Update project details.
    """
    project = await service.update_project(project_id, project_data)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, service: ProjectService = Depends(get_project_service)):
    """
    Delete a project.
    """
    success = await service.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return None

@router.get("/projects/{project_id}/analytics", response_model=ProjectAnalyticsResponse)
async def get_project_analytics(project_id: int, service: ProjectService = Depends(get_project_service)):
    """
    Get project analytics including spec count and compliance status.
    """
    return await service.get_project_analytics(project_id)

@router.get("/projects/{project_id}/specs")
async def list_project_specs(project_id: int, service: ProjectService = Depends(get_project_service)):
    """
    List all specifications associated with a project.
    """
    return await service.get_project_specs(project_id)

@router.post("/projects/{project_id}/specs", status_code=status.HTTP_201_CREATED)
async def create_project_spec(project_id: int, spec_data: Any, service: ProjectService = Depends(get_project_service)):
    """
    Create a new specification for a project.
    """
    # In a real scenario, we'd use SpecificationCreate schema here
    # Since 'Any' is used for spec_data in the current mocks, we'll stick to it or import schema
    return await service.create_project_spec(project_id, spec_data)
