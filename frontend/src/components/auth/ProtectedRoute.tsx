import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, hasRole } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Verificando sessão...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.some((role) => hasRole(role));

  if (!hasAccess) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}
