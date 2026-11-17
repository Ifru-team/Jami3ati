from fastapi import APIRouter
from app.api.routes import health, universities, institutions, reports

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(universities.router)
api_router.include_router(institutions.router)
api_router.include_router(reports.router)
