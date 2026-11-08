import { Menu } from "lucide-react";
import { rolePriority, type AppRole } from "../../config/nav";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  pageTitle: string;
}

const roleLabels: Record<AppRole, string> = {
  ADMIN: "ADMIN",
  ADMIN_DEPPI: "ADMIN. DEPPI",
  DEPPI: "DEPPI",
  PROFESSOR: "PROFESSOR",
  ALUNO: "ALUNO",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Header({ pageTitle }: HeaderProps) {
  const { user } = useAuth();

  const name = user?.name ?? "Usuário";

  // Identifica o papel de maior prioridade do usuário.
  const role = rolePriority.find((role) => user?.roles.includes(role));

  return (
    <header className="flex h-[58px] items-center justify-between border-b border-line bg-surface px-6">
      <div className="flex items-center gap-3 text-sm text-ink-2">
        <Menu size={18} />
        <span>{pageTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-[13px] font-semibold text-ink">{name}</p>

          <p className="font-mono text-[10px] text-accent">
            {role ? roleLabels[role] : "USUÁRIO"}
          </p>
        </div>

        <div className="grid size-9 place-items-center rounded-full bg-surface-2 font-display text-xs font-semibold">
          {getInitials(name)}
        </div>
      </div>
    </header>
  );
}
