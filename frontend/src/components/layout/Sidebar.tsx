import { NavLink } from "react-router-dom";
import { navigationByRole, type AppRole } from "../../config/nav";

interface SidebarProps {
  role: AppRole;
}

export default function Sidebar({ role }: SidebarProps) {
  const menuItems = navigationByRole[role];

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-line bg-sidebar px-3 py-5 md:block">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="grid size-8 place-items-center rounded-lg bg-accent font-display font-bold text-white">
          D
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold">DEPPI</h2>

          <p className="text-xs text-ink-2">IFCE · Extensão</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/inicio"}
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                  isActive
                    ? "bg-accent/10 font-medium text-ink"
                    : "text-ink-2 hover:bg-surface-2"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={isActive ? "text-accent" : ""}
                  />

                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
