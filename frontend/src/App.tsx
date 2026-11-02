import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";

import AppLayout from "./components/layout/AppLayout";
import AdminHome from "./pages/admin/AdminHome";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/logout" element={<Logout />} />

      <Route element={<AppLayout />}>
        <Route path="/inicio" element={<AdminHome />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
