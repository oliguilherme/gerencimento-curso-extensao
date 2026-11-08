import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
     return <Navigate to="/login" replace />
  }

  const hasAccess = allowedRoles.some(role => hasRole(role));

  if (!hasAccess) {
    return <Navigate to="/acesso-negado" replace />
  }

  return <Outlet />;
}
