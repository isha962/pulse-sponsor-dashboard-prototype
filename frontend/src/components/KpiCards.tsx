import { Grid, Card, CardContent, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupsIcon from "@mui/icons-material/Groups";

type Props = {
  views: number;
  rsvps: number;
  attendance: number;
};

function KpiCard({
  label,
  value,
  icon
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <div>{icon}</div>
        <div>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value.toLocaleString()}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default function KpiCards({ views, rsvps, attendance }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <KpiCard label="Views" value={views} icon={<VisibilityIcon />} />
      </Grid>
      <Grid item xs={12} md={4}>
        <KpiCard label="RSVPs" value={rsvps} icon={<EventAvailableIcon />} />
      </Grid>
      <Grid item xs={12} md={4}>
        <KpiCard label="Attendance" value={attendance} icon={<GroupsIcon />} />
      </Grid>
    </Grid>
  );
}
