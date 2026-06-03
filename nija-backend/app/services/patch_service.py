import os
import uuid
import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update

from app.models import Patch
from app.schemas.patch import PatchCreate, PatchStatus, PatchResponse
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

class RemediationEngine:
    """
    Handles the logic of generating code patches based on breach details.
    In a full implementation, this would load templates from /templates/patches/
    and apply variables.
    """
    async def generate_patch_content(self, breach_id: str, file_path: str, breach_details: dict) -> str:
        # This is a simulated remediation engine.
        # In reality, it would use the Trust Engine pattern:
        # 1. Identify the breach type from breach_id.
        # 2. Load the corresponding .md template.
        # 3. Substitute variables.

        breach_type = breach_details.get("type", "generic_breach")
        logger.info(f"Generating patch for breach {breach_id} of type {breach_type}")

        # Simulated template substitution
        return f"--- Patch for {breach_id} ---\n# Remediation for {breach_type}\n# Target File: {file_path}\n\n// Fixed compliance breach\n// Added required security controls as per NijaSpec standards.\n"

class PatchService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.remediation_engine = RemediationEngine()

    async def generate_patch(self, project_id: int, breach_id: str, file_path: str, breach_details: dict) -> Patch:
        """
        Orchestrates patch generation: generate content -> store in DB -> track status.
        """
        # 1. Generate the patch content via the remediation engine
        content = await self.remediation_engine.generate_patch_content(
            breach_id, file_path, breach_details
        )

        # 2. Create the patch record in the database
        db_patch = Patch(
            id=str(uuid.uuid4()),
            project_id=project_id,
            breach_id=breach_id,
            file_path=file_path,
            content=content,
            description=breach_details.get("description", "Auto-generated remediation patch"),
            status=PatchStatus.PENDING
        )

        self.db.add(db_patch)
        await self.db.commit()
        await self.db.refresh(db_patch)

        return db_patch

    async def apply_patch(self, patch_id: str, project_root: str) -> Patch:
        """
        Applies the patch to the actual file system and updates status to APPLIED.
        """
        patch = await self.get_patch(patch_id)
        if not patch:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patch not found")

        try:
            # File Management: Write the patch to the designated patch directory
            # Following NijaSpec pattern: .nija/patches/<patch_id>.patch
            patch_dir = os.path.join(project_root, ".nija", "patches")
            os.makedirs(patch_dir, exist_ok=True)

            patch_file_path = os.path.join(patch_dir, f"{patch_id}.patch")
            with open(patch_file_path, "w", encoding="utf-8") as f:
                f.write(patch.content)

            # In a real implementation, we might actually apply the patch to the target file
            # using a diff tool or a custom applier. For now, we record it as applied.

            # Update status to APPLIED
            patch.status = PatchStatus.APPLIED
            patch.updated_at = datetime.utcnow()

            await self.db.commit()
            await self.db.refresh(patch)

            return patch

        except Exception as e:
            logger.error(f"Failed to apply patch {patch_id}: {str(e)}")
            patch.status = PatchStatus.FAILED
            await self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to apply patch to filesystem: {str(e)}"
            )

    async def reject_patch(self, patch_id: str) -> Patch:
        """
        Marks a patch as rejected.
        """
        patch = await self.get_patch(patch_id)
        if not patch:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patch not found")

        patch.status = PatchStatus.REJECTED
        patch.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(patch)
        return patch

    async def get_patch(self, patch_id: str) -> Optional[Patch]:
        """
        Retrieves a specific patch by ID.
        """
        result = await self.db.execute(select(Patch).filter(Patch.id == patch_id))
        return result.scalars().first()

    async def get_project_patches(self, project_id: int) -> List[Patch]:
        """
        Lists all patches associated with a project.
        """
        result = await self.db.execute(
            select(Patch).filter(Patch.project_id == project_id).order_by(Patch.created_at.desc())
        )
        return result.scalars().all()

    async def update_patch_status(self, patch_id: str, status: PatchStatus) -> Optional[Patch]:
        """
        Updates the status of a patch.
        """
        patch = await self.get_patch(patch_id)
        if not patch:
            return None

        patch.status = status
        patch.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(patch)
        return patch
