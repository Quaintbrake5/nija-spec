from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete, func
from fastapi import HTTPException, status
from app.models import Project, Specification
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectAnalyticsResponse
from typing import List, Optional
from datetime import datetime

class ProjectService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_projects_by_org(self, org_id: int) -> List[Project]:
        result = await self.db.execute(select(Project).filter(Project.organization_id == org_id))
        return result.scalars().all()

    async def create_project(self, project_data: ProjectCreate) -> Project:
        db_project = Project(**project_data.model_dump())
        self.db.add(db_project)
        await self.db.commit()
        await self.db.refresh(db_project)
        return db_project

    async def get_project(self, project_id: int) -> Optional[Project]:
        result = await self.db.execute(select(Project).filter(Project.id == project_id))
        return result.scalars().first()

    async def update_project(self, project_id: int, project_data: ProjectUpdate) -> Optional[Project]:
        db_project = await self.get_project(project_id)
        if not db_project:
            return None

        for key, value in project_data.model_dump(exclude_unset=True).items():
            setattr(db_project, key, value)

        await self.db.commit()
        await self.db.refresh(db_project)
        return db_project

    async def delete_project(self, project_id: int) -> bool:
        db_project = await self.get_project(project_id)
        if not db_project:
            return False

        await self.db.delete(db_project)
        await self.db.commit()
        return True

    async def get_project_analytics(self, project_id: int) -> ProjectAnalyticsResponse:
        project = await self.get_project(project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        result = await self.db.execute(select(func.count(Specification.id)).filter(Specification.project_id == project_id))
        total_specs = result.scalar() or 0

        # Assuming a 'Run' model exists for total_runs and last_run_date
        # Since I haven't seen a Run model, I'll mock these for now
        total_runs = 0
        compliance_score = 0.0
        last_run_date = None

        return ProjectAnalyticsResponse(
            project_id=project_id,
            total_specs=total_specs,
            total_runs=total_runs,
            compliance_score=compliance_score,
            last_run_date=last_run_date,
            status="Active" if total_specs > 0 else "Pending"
        )

    async def get_project_specs(self, project_id: int) -> List[Specification]:
        result = await self.db.execute(select(Specification).filter(Specification.project_id == project_id))
        return result.scalars().all()

    async def create_project_spec(self, project_id: int, spec_data: any) -> Specification:
        project = await self.get_project(project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

        db_spec = Specification(
            **spec_data.model_dump(),
            project_id=project_id,
            organization_id=project.organization_id
        )
        self.db.add(db_spec)
        await self.db.commit()
        await self.db.refresh(db_spec)
        return db_spec
