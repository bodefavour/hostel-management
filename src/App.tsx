import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import LandlordDashboard from "./pages/landlord/landlordDashboard";
import AdminDashboard from "./pages/admin/adminDashboard";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";
import SignupPage from "./pages/auth/SignUp";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/signup" element={<SignupPage />} />


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
