from fastapi import APIRouter
from typing import List, Any

router = APIRouter(tags=["Specifications"])

@router.get("/projects/{project_id}/specs", response_model=List[Any])
async def list_specs(project_id: str):
    """
    List specifications for a project.
    """
    return [{"id": "spec-1", "name": "Mock Spec", "project_id": project_id}]

@router.get("/specs/{spec_id}")
async def get_spec(spec_id: str):
    """
    Get specification details.
    """
    return {"id": spec_id, "name": "Mock Spec"}

@router.post("/specs")
async def create_spec(spec_data: Any):
    """
    Create a new specification.
    """
    return {"id": "spec-1", "name": "Mock Spec"}

@router.put("/specs/{spec_id}")
async def update_spec(spec_id: str, spec_data: Any):
    """
    Update specification details.
    """
    return {"id": spec_id, "name": "Updated Mock Spec"}

@router.get("/specs/diff")
async def get_spec_diff(spec_id_1: str, spec_id_2: str):
    """
    Get difference between two specifications.
    """
    return {"diff": "Mock diff content"}
