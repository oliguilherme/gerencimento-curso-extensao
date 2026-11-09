import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";
import AppLayout from "./components/layout/AppLayout";
import AccessDenied from "./pages/AccessDenied";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomeByRole from "./pages/HomeByRole";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/acesso-negado" element={<AccessDenied />} />

      <Route path="/logout" element={<Logout />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN_DEPPI", "PROFESSOR"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/inicio" element={<HomeByRole />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
