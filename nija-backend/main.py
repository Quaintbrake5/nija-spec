import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan handler for startup and shutdown events.
    """
    # Startup logic here (e.g., database connection)
    yield
    # Shutdown logic here (e.g., closing database connection)

app = FastAPI(
    title=settings.APP_NAME,
    description="API for NijaSpec compliance auditing engine",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        reload=settings.DEBUG
    )
