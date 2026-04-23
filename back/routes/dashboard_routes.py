from fastapi import APIRouter
from back.services.dashboard_service import get_dashboard_metrics

router = APIRouter()

@router.get("/dashboard")
def dashboard(team: str = None, sprint: str = None, dev: str = None):
    return get_dashboard_metrics(team, sprint, dev)