from fastapi import APIRouter
from app.api.v1 import auth, organizations, projects, specs, runs, health

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(organizations.router)
api_router.include_router(projects.router)
api_router.include_router(specs.router)
api_router.include_router(runs.router)
api_router.include_router(health.router)
