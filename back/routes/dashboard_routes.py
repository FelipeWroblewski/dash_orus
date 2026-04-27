from fastapi import APIRouter
from back.services.dashboard_service import get_dashboard_metrics
import traceback

router = APIRouter()

@router.get("/dashboard")
def dashboard(team: str = None, sprint: str = None, dev: str = None):
    print("routes carregando")
    try:
        return get_dashboard_metrics(team, sprint, dev)
    except Exception as e:
        traceback.print_exc()
        raise e