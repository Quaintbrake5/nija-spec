from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from app.core.database import engine
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

async def check_database_health():
    """
    Check if the database is reachable and responding.
    """
    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
        return True, "Database is healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        return False, str(e)

@router.get("/health/live")
async def liveness_probe():
    """
    Liveness probe: returns 200 if the application is running.
    """
    return {"status": "live"}

@router.get("/health/ready")
async def readiness_probe():
    """
    Readiness probe: returns 200 if the application is ready to serve requests,
    including checking downstream dependencies like the database.
    """
    db_healthy, db_msg = await check_database_health()
    if not db_healthy:
        raise HTTPException(status_code=503, detail=f"Service Unavailable: {db_msg}")

    return {
        "status": "ready",
        "checks": {
            "database": "healthy"
        }
    }
