import { useEffect, useMemo, useState } from "react";
import { Stack, Typography, Button, Alert, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import KpiCards from "../components/KpiCards";
import EventTable from "../components/EventTable";
import TrendChart from "../components/TrendChart";
import { api, type Summary, type EventRow, type TimePoint } from "../api/client";

type Metric = "views" | "rsvps" | "attendance";

export default function SponsorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<Summary>({ views: 0, rsvps: 0, attendance: 0 });
  const [events, setEvents] = useState<EventRow[]>([]);
  const [metric, setMetric] = useState<Metric>("views");
  const [days, setDays] = useState<number>(14);
  const [points, setPoints] = useState<TimePoint[]>([]);

  const subtitle = useMemo(() => "Your impact across sponsored events", []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [s, e] = await Promise.all([api.summary(), api.events()]);
        setSummary(s);
        setEvents(e.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const ts = await api.timeseries(metric, days);
        setPoints(ts.points);
      } catch (err) {
        // non-blocking chart failure
        console.error(err);
        setPoints([]);
      }
    })();
  }, [metric, days]);

  return (
    <Stack spacing={3}>
      {/* Header / Hero */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
        sx={{
          p: 2.5,
          borderRadius: 4,
          border: "1px solid rgba(255,79,216,0.22)",
          background:
            "linear-gradient(90deg, rgba(255,79,216,0.10), rgba(77,163,255,0.06))"
        }}
      >
        <div>
          <Typography variant="h4" fontWeight={900}>
            Sponsor Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => alert("Stub: generate sponsor report")}
          sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
        >
          Download Sponsor Report
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Loading sponsor metrics…
          </Typography>
        </Stack>
      ) : (
        <>
          <KpiCards views={summary.views} rsvps={summary.rsvps} attendance={summary.attendance} />
          <TrendChart
            metric={metric}
            onMetricChange={setMetric}
            days={days}
            onDaysChange={setDays}
            points={points}
          />
          <EventTable events={events} />
        </>
      )}
    </Stack>
  );
}
