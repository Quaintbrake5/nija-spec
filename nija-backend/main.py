import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.api.v1.router import api_router
from app.middleware.security import setup_security_middleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.monitoring.logging_config import setup_logging
from app.monitoring.metrics import setup_metrics

# Initialize logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan handler for startup and shutdown events.
    """
    # Startup: Test database connection
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        print("Database connection successful")
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise

    yield

    # Shutdown: Close database connection
    await engine.dispose()
    print("Database connection closed")

app = FastAPI(
    title=settings.APP_NAME,
    description="API for NijaSpec compliance auditing engine",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Configure Metrics
setup_metrics(app)

# Configure Security Headers and CORS
setup_security_middleware(app)

# Configure Rate Limiting
app.add_middleware(RateLimitMiddleware)

# Include API routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "NijaSpec API is running"}

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        reload_excludes=[
            "nija_backend.log",
            "*.log",
            "__pycache__",
            "*.pyc",
            ".env",
            "*.env",
            ".git",
            "nija-backend/.venv/**"
        ]
    )
