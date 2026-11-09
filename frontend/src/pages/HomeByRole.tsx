import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import AdminHome from "./admin/AdminHome";
import ProfessorHome from "./professor/ProfessorHome";


export default function HomeByRole() {
  const { hasRole } = useAuth();

  if (hasRole("ADMIN_DEPPI")) {
    return <AdminHome />;
  }

  if (hasRole("PROFESSOR")) {
    return <ProfessorHome />
  }

  return <Navigate to="/acesso-negado" replace />;
}