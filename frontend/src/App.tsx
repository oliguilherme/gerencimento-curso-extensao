import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";
import AppLayout from "./components/layout/AppLayout";
import AdminHome from "./pages/admin/AdminHome";
import AccessDenied from "./pages/AccessDenied";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/acesso-negado" element={<AccessDenied />} />

      <Route path="/logout" element={<Logout />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN_DEPPI"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/inicio" element={<AdminHome />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
