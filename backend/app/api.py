import os
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from app.db import get_db
from app.services.sponsor_service import get_summary, get_events, get_timeseries

router = APIRouter()

def get_mock_identity(x_user_id: str | None):
    # allow header override, else env default
    user_id = x_user_id or os.getenv("MOCK_USER_ID", "sponsor_123")
    role = os.getenv("MOCK_ROLE", "sponsor")
    return user_id, role

@router.get("/me")
def me(x_user_id: str | None = Header(default=None, convert_underscores=False)):
    user_id, role = get_mock_identity(x_user_id)
    return {"user_id": user_id, "role": role}

@router.get("/sponsor/summary")
def sponsor_summary(
    db: Session = Depends(get_db),
    x_user_id: str | None = Header(default=None, convert_underscores=False),
):
    user_id, _ = get_mock_identity(x_user_id)
    return get_summary(db, user_id)

@router.get("/sponsor/events")
def sponsor_events(
    db: Session = Depends(get_db),
    x_user_id: str | None = Header(default=None, convert_underscores=False),
):
    user_id, _ = get_mock_identity(x_user_id)
    return {"events": get_events(db, user_id)}

@router.get("/sponsor/timeseries")
def sponsor_timeseries(
    metric: str = "views",
    days: int = 14,
    db: Session = Depends(get_db),
    x_user_id: str | None = Header(default=None, convert_underscores=False),
):
    user_id, _ = get_mock_identity(x_user_id)
    days = max(7, min(days, 30))
    return {"metric": metric, "days": days, "points": get_timeseries(db, user_id, metric, days)}
