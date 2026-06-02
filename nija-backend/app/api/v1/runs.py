from fastapi import APIRouter
from typing import List, Any

router = APIRouter(tags=["Runs"])

@router.get("/projects/{project_id}/runs", response_model=List[Any])
async def list_runs(project_id: str):
    """
    List all runs for a project.
    """
    return [{"id": "run-1", "status": "completed", "project_id": project_id}]

@router.get("/runs/{run_id}")
async def get_run(run_id: str):
    """
    Get run details.
    """
    return {"id": run_id, "status": "completed"}

@router.post("/runs")
async def create_run(run_data: Any):
    """
    Start a new run.
    """
    return {"id": "run-1", "status": "running"}

@router.post("/runs/{run_id}/cancel")
async def cancel_run(run_id: str):
    """
    Cancel a running run.
    """
    return {"message": "Run cancelled successfully"}

@router.get("/runs/{run_id}/results")
async def get_run_results(run_id: str):
    """
    Get results of a run.
    """
    return {"run_id": run_id, "results": "Mock results"}

@router.get("/runs/{run_id}/artifacts")
async def get_run_artifacts(run_id: str):
    """
    Get artifacts of a run.
    """
    return {"run_id": run_id, "artifacts": ["artifact1.json", "artifact2.txt"]}
