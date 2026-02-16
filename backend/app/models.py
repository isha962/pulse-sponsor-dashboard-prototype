from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Date, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    role: Mapped[str] = mapped_column(String, nullable=False)

class Event(Base):
    __tablename__ = "events"
    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    start_time: Mapped[str] = mapped_column(DateTime(timezone=True), nullable=False)

class SponsorEventAccess(Base):
    __tablename__ = "sponsor_event_access"
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), primary_key=True)
    event_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("events.id"), primary_key=True)

class EventMetrics(Base):
    __tablename__ = "event_metrics"
    event_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("events.id"), primary_key=True)
    date: Mapped[str] = mapped_column(Date, primary_key=True)
    views: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rsvps: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    attendance: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
