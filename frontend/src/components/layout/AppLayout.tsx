import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header pageTitle="Início" />

        <main className="flex-1 px-6 py-7 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
