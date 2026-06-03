from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from sqlalchemy import text

router = APIRouter()

@router.get("/liveness", tags=["Health"])
async def liveness_probe():
    """
    Liveness probe to indicate if the application is running.
    """
    return {"status": "ok"}

@router.get("/readiness", tags=["Health"])
async def readiness_probe(db: Session = Depends(get_db)):
    """
    Readiness probe to indicate if the application is ready to handle traffic.
    Checks database connectivity.
    """
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")
