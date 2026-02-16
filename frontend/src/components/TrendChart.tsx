import { Card, CardContent, Typography, Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import type { TimePoint } from "../api/client";

type Metric = "views" | "rsvps" | "attendance";

export default function TrendChart({
  metric,
  onMetricChange,
  days,
  onDaysChange,
  points
}: {
  metric: Metric;
  onMetricChange: (m: Metric) => void;
  days: number;
  onDaysChange: (d: number) => void;
  points: TimePoint[];
}) {
  const title =
    metric === "views" ? "Views" : metric === "rsvps" ? "RSVPs" : "Attendance";

  const theme = useTheme();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
          <div>
            <Typography variant="h6" fontWeight={700}>
              Trend — {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Daily totals across your sponsored events
            </Typography>
          </div>

          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup
              size="small"
              value={metric}
              exclusive
              onChange={(_, v) => v && onMetricChange(v)}
            >
              <ToggleButton value="views">Views</ToggleButton>
              <ToggleButton value="rsvps">RSVPs</ToggleButton>
              <ToggleButton value="attendance">Attendance</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              size="small"
              value={days}
              exclusive
              onChange={(_, v) => v && onDaysChange(v)}
            >
              <ToggleButton value={7}>7d</ToggleButton>
              <ToggleButton value={14}>14d</ToggleButton>
              <ToggleButton value={30}>30d</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>

        <div style={{ height: 280, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.6)"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString(undefined, { month: "short", day: "2-digit" })
                }
              />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  background: "#121224",
                  border: "1px solid rgba(255,79,216,0.25)",
                  borderRadius: 12
                }}
                labelFormatter={(d) =>
                  new Date(String(d)).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit"
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.secondary.main}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
