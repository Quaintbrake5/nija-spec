import asyncio
import json
import os
import shutil
import tempfile
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.run import Run
from app.models.specification import Specification as Spec

class RunService:
    """
    Service for managing and executing Trust Engine runs.
    Integrates the backend with the nija-audit CLI tool.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        # Map to track active processes for cancellation
        self._active_processes: Dict[int, asyncio.subprocess.Process] = {}
        # CLI command to use. In production this should be 'nija-audit'.
        # For dev/test, we use 'ts-node' with the path to the entry point.
        self._cli_cmd = ["nija-audit"]
        if os.getenv("NIJA_DEV_MODE") == "true":
            # Assuming we are running from nija-backend/ and the CLI is in ../bin/nija.ts
            self._cli_cmd = ["ts-node", "../bin/nija.ts"]

    async def create_run(self, specification_id: int) -> Run:
        """
        Initialize a new run for a given specification.
        """
        new_run = Run(
            specification_id=specification_id,
            status="pending",
            created_at=datetime.utcnow()
        )
        self.db.add(new_run)
        await self.db.commit()
        await self.db.refresh(new_run)
        return new_run

    async def execute_run(self, run_id: int) -> Run:
        """
        Execute the Trust Engine pipeline for a specific run.
        Pipeline:
        1. Save spec to temp file
        2. nija-audit generate <spec>
        3. nija-audit verify
        """
        run = await self.get_run(run_id)
        if not run:
            raise ValueError(f"Run {run_id} not found")

        result = await self.db.execute(select(Spec).filter(Spec.id == run.specification_id))
        spec = result.scalar_one_or_none()
        if not spec:
            raise ValueError(f"Specification {run.specification_id} not found")

        try:
            # Update status to running
            run.status = "running"
            run.started_at = datetime.utcnow()
            await self.db.commit()

            # Create temporary directory for the run artifacts
            with tempfile.TemporaryDirectory() as tmp_dir:
                tmp_path = Path(tmp_dir)
                spec_file = tmp_path / "spec.md"
                spec_file.write_text(spec.content)

                # 1. Generate Compliance Gap Analysis
                generate_results = await self._run_cli_command(
                    self._cli_cmd + ["generate", str(spec_file), "--skip-llm"],
                    run_id
                )

                # 2. Verify generated tests
                verify_results = await self._run_cli_command(
                    self._cli_cmd + ["verify"],
                    run_id,
                    cwd=tmp_dir # Run verify in the context of the generated artifacts
                )

                # Aggregate results
                run.results = {
                    "generate": generate_results,
                    "verify": verify_results,
                    "artifacts_path": str(tmp_path) # In real scenario, move to permanent storage
                }
                run.status = "completed" if generate_results["exit_code"] == 0 else "failed"

        except asyncio.CancelledError:
            run.status = "cancelled"
            # Cleanup happens via try-finally or similar if needed
        except Exception as e:
            run.status = "failed"
            run.results = {"error": str(e)}
        finally:
            run.completed_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(run)
            if run_id in self._active_processes:
                del self._active_processes[run_id]

        return run

    async def _run_cli_command(self, args: List[str], run_id: int, cwd: Optional[str] = None) -> Dict[str, Any]:
        """
        Helper to execute a CLI command and capture its output.
        """
        process = await asyncio.create_subprocess_exec(
            *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=cwd
        )

        self._active_processes[run_id] = process

        stdout, stderr = await process.communicate()

        return {
            "exit_code": process.returncode,
            "stdout": stdout.decode().strip(),
            "stderr": stderr.decode().strip()
        }

    async def get_run(self, run_id: int) -> Optional[Run]:
        """
        Retrieve a run by its ID.
        """
        result = await self.db.execute(select(Run).filter(Run.id == run_id))
        return result.scalar_one_or_none()

    async def cancel_run(self, run_id: int) -> bool:
        """
        Cancel a currently running run.
        """
        process = self._active_processes.get(run_id)
        if process:
            try:
                process.terminate()
                return True
            except ProcessLookupError:
                return False
        return False

    async def get_run_artifacts(self, run_id: int) -> List[str]:
        """
        List artifacts associated with a run.
        In a full implementation, this would look into the permanent storage
        or the Patch model.
        """
        run = await self.get_run(run_id)
        if not run or not run.results:
            return []

        # Mocking artifact discovery from results
        # In reality, we'd scan the artifacts directory
        return ["compliance_report.json", "remediation_patches.md", "test_suite.ts"]
