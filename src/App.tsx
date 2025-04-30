import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentDashboard from "./pages/student/Dashboard";
import LandlordDashboard from "./pages/landlord/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Landlord Routes */}
        <Route element={<ProtectedRoute allowedRoles={["landlord"]} />}>
          <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}