import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import AdminHome from "../pages/admin/AdminHome";


export default function HomeByRole() {
  const { hasRole } = useAuth();

  if (hasRole("ADMIN") || hasRole("ADMIN_DEPPI")) {
    return <AdminHome />;
  }


  return <Navigate to="/acesso-negado" replace />;
}