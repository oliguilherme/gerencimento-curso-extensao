import { Menu } from "lucide-react";
import type { AppRole } from "../../config/nav";

interface HeaderProps {
  name: string;
  role: AppRole;
  pageTitle: string;
}

const roleLabels: Record<AppRole, string> = {
  ADMIN: "ADMIN",
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

export default function Header({ name, role, pageTitle }: HeaderProps) {
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
            {roleLabels[role]}
          </p>
        </div>

        <div className="grid size-9 place-items-center rounded-full bg-surface-2 font-display text-xs font-semibold">
          {getInitials(name)}
        </div>
      </div>
    </header>
  );
}
