# Pulse Sponsor Dashboard Prototype

Prototype Sponsor Dashboard to demonstrate dashboard UX + clean architecture in React/TS + FastAPI + Postgres (Supabase-compatible schema).

## Overview
- Separate sponsor dashboard route: `/sponsor/dashboard`
- KPIs: Views / RSVPs / Attendance
- Trend chart (7/14/30 days)
- Event table (per-event totals)
- Mock auth via `X-User-Id` header (defaults to `sponsor_123`)

## Architecture
- **Frontend:** React + TypeScript + MUI + Recharts
- **Backend:** FastAPI
- **DB:** Postgres with schema for events + sponsor_event_access + daily metrics
- **Docker:** `docker compose up --build` runs everything locally

## How to Run
```bash
docker compose up --build
