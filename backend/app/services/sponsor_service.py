from datetime import timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models import Event, SponsorEventAccess, EventMetrics

def get_accessible_event_ids(db: Session, user_id: str) -> list[str]:
    q = select(SponsorEventAccess.event_id).where(SponsorEventAccess.user_id == user_id)
    return [row[0] for row in db.execute(q).all()]

def get_summary(db: Session, user_id: str) -> dict:
    event_ids = get_accessible_event_ids(db, user_id)
    if not event_ids:
        return {"views": 0, "rsvps": 0, "attendance": 0}

    q = (
        select(
            func.coalesce(func.sum(EventMetrics.views), 0),
            func.coalesce(func.sum(EventMetrics.rsvps), 0),
            func.coalesce(func.sum(EventMetrics.attendance), 0),
        )
        .where(EventMetrics.event_id.in_(event_ids))
    )
    views, rsvps, attendance = db.execute(q).one()
    return {"views": int(views), "rsvps": int(rsvps), "attendance": int(attendance)}

def get_events(db: Session, user_id: str) -> list[dict]:
    event_ids = get_accessible_event_ids(db, user_id)
    if not event_ids:
        return []

    totals_q = (
        select(
            Event.id,
            Event.title,
            Event.start_time,
            func.coalesce(func.sum(EventMetrics.views), 0).label("views"),
            func.coalesce(func.sum(EventMetrics.rsvps), 0).label("rsvps"),
            func.coalesce(func.sum(EventMetrics.attendance), 0).label("attendance"),
        )
        .join(EventMetrics, EventMetrics.event_id == Event.id, isouter=True)
        .where(Event.id.in_(event_ids))
        .group_by(Event.id, Event.title, Event.start_time)
        .order_by(Event.start_time.asc())
    )

    rows = db.execute(totals_q).all()
    return [
        {
            "event_id": r.id,
            "title": r.title,
            "start_time": r.start_time.isoformat(),
            "views": int(r.views),
            "rsvps": int(r.rsvps),
            "attendance": int(r.attendance),
        }
        for r in rows
    ]

def get_timeseries(db: Session, user_id: str, metric: str, days: int = 14) -> list[dict]:
    if metric not in ("views", "rsvps", "attendance"):
        metric = "views"

    event_ids = get_accessible_event_ids(db, user_id)
    if not event_ids:
        return []

    # Find the latest date that actually has data for this sponsor's events
    max_date_q = select(func.max(EventMetrics.date)).where(EventMetrics.event_id.in_(event_ids))
    end_date = db.execute(max_date_q).scalar()

    # If there is no data at all, return an empty chart
    if end_date is None:
        return []

    start = end_date - timedelta(days=days - 1)

    metric_col = getattr(EventMetrics, metric)
    q = (
        select(
            EventMetrics.date,
            func.coalesce(func.sum(metric_col), 0).label("value"),
        )
        .where(EventMetrics.event_id.in_(event_ids))
        .where(EventMetrics.date >= start)
        .where(EventMetrics.date <= end_date)
        .group_by(EventMetrics.date)
        .order_by(EventMetrics.date.asc())
    )
    rows = db.execute(q).all()

    # Fill missing days with 0 so the chart looks clean
    row_map = {r.date: int(r.value) for r in rows}
    result = []
    for i in range(days):
        d = start + timedelta(days=i)
        result.append({"date": d.isoformat(), "value": row_map.get(d, 0)})
    return result