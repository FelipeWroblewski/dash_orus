from fastapi import APIRouter
from back.repositories.dashboard_repository import load_data
from back.services.dashboard_service import get_dashboard_metrics
import traceback

router = APIRouter()

@router.get("/filters")
def filters():
    try:
        data = load_data()
        sprints = sorted(data["ticket_improvement"]["SPRINT_NUMBER"].dropna().unique().tolist())
        devs = sorted(data["ticket_improvement"]["NOME_DEV"].dropna().unique().tolist())
        return {
            "teams": ["WEB", "DADOS"],
            "sprints": sprints,
            "devs": devs
        }
    except Exception as e:
        traceback.print_exc()
        raise e

@router.get("/dashboard")
def dashboard(team: str = None, sprint: str = None, dev: str = None):
    try:
        return get_dashboard_metrics(team, sprint, dev)
    except Exception as e:
        traceback.print_exc()
        raise e