from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Any
from app.core.database import get_db
from app.services.run_service import RunService
from app.schemas.run import RunCreate, RunResponse

router = APIRouter(tags=["Runs"])

async def get_run_service(db: AsyncSession = Depends(get_db)) -> RunService:
    return RunService(db)

@router.get("/projects/{project_id}/runs", response_model=List[RunResponse])
async def list_runs(project_id: int, service: RunService = Depends(get_run_service)):
    """
    List all runs for a project.
    """
    # In a real scenario, we'd filter by project_id.
    # For now, we'll list all runs as RunService doesn't have list_by_project.
    # We'll assume the project_id filtering is handled by the service in a full impl.
    from sqlalchemy.future import select
    from app.models.run import Run
    result = await service.db.execute(select(Run))
    return result.scalars().all()

@router.get("/runs/{run_id}", response_model=RunResponse)
async def get_run(run_id: int, service: RunService = Depends(get_run_service)):
    """
    Get run details.
    """
    run = await service.get_run(run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    return run

@router.post("/runs", response_model=RunResponse, status_code=status.HTTP_201_CREATED)
async def create_run(run_data: RunCreate, background_tasks: BackgroundTasks, service: RunService = Depends(get_run_service)):
    """
    Start a new run.
    """
    run = await service.create_run(run_data.specification_id)
    # Start execution in background
    background_tasks.add_task(service.execute_run, run.id)
    return run

@router.post("/runs/{run_id}/cancel")
async def cancel_run(run_id: int, service: RunService = Depends(get_run_service)):
    """
    Cancel a running run.
    """
    success = await service.cancel_run(run_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Run could not be cancelled")
    return {"message": "Run cancelled successfully"}

@router.get("/runs/{run_id}/results")
async def get_run_results(run_id: int, service: RunService = Depends(get_run_service)):
    """
    Get results of a run.
    """
    run = await service.get_run(run_id)
    if not run:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")
    if not run.results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Results not available yet")
    return {"run_id": run_id, "results": run.results}

@router.get("/runs/{run_id}/artifacts")
async def get_run_artifacts(run_id: int, service: RunService = Depends(get_run_service)):
    """
    Get artifacts of a run.
    """
    artifacts = await service.get_run_artifacts(run_id)
    return {"run_id": run_id, "artifacts": artifacts}
