import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import type { AppRole } from "../../config/nav";

const mockUser = {
  name: "Administrador",
  role: "ADMIN" as AppRole,
};

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar role={mockUser.role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header name={mockUser.name} role={mockUser.role} pageTitle="Início" />

        <main className="flex-1 px-6 py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
