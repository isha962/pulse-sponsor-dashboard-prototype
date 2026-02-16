import { Routes, Route, Navigate } from "react-router-dom";
import SponsorDashboard from "./pages/SponsorDashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
      <Route path="*" element={<Navigate to="/sponsor/dashboard" replace />} />
    </Routes>
  );
}
