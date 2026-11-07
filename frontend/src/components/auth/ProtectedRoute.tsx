import { Navigate, Outlet } from "react-router-dom";
import { getAccessTokenPayload } from "../../lib/auth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const payload = getAccessTokenPayload();

  if (!payload) {
    return <Navigate to="/login" replace/>
  }

  const hasPermission = allowedRoles.some((role) => payload.roles.includes(role));

  if (!hasPermission) {
    return <Navigate to="/acesso-negado" replace/>
  }

  return <Outlet />
}