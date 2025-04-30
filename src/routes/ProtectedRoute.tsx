import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: ("student" | "landlord" | "admin")[];
  redirectTo?: string;
  unauthorizedTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = "/login",
  unauthorizedTo = "/unauthorized",
}) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to={redirectTo} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;