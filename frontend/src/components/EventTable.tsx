import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import type { EventRow } from "../api/client";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

export default function EventTable({ events }: { events: EventRow[] }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Events
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Views</TableCell>
              <TableCell align="right">RSVPs</TableCell>
              <TableCell align="right">Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((e) => (
              <TableRow key={e.event_id} hover>
                <TableCell>{e.title}</TableCell>
                <TableCell>{formatDate(e.start_time)}</TableCell>
                <TableCell align="right">{e.views.toLocaleString()}</TableCell>
                <TableCell align="right">{e.rsvps.toLocaleString()}</TableCell>
                <TableCell align="right">{e.attendance.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ color: "text.secondary" }}>
                  No events available for this sponsor.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
