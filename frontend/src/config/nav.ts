import {
  Home,
  BookOpen,
  Building2,
  Users,
  BarChart3,
  UserRound,
  ClipboardList,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type AppRole = "ADMIN" | "ADMIN_DEPPI" | "DEPPI" | "PROFESSOR" | "ALUNO";

export const rolePriority: AppRole[] = [
  "ADMIN",
  "ADMIN_DEPPI",
  "DEPPI",
  "PROFESSOR",
  "ALUNO",
];

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const adminNavigation: NavItem[] = [
  { label: "Início", path: "/inicio", icon: Home },
  { label: "Cursos", path: "/cursos", icon: BookOpen },
  { label: "Instituições", path: "/instituicoes", icon: Building2 },
  { label: "Usuários", path: "/usuarios", icon: Users },
  { label: "Relatórios", path: "/relatorios", icon: BarChart3 },
  { label: "Perfil", path: "/perfil", icon: UserRound },
];

export const navigationByRole: Record<AppRole, NavItem[]> = {
  ADMIN: adminNavigation,

  ADMIN_DEPPI: adminNavigation,

  DEPPI: [
    { label: "Início", path: "/inicio", icon: Home },
    { label: "Cursos", path: "/cursos", icon: BookOpen },
    { label: "Inscrições", path: "/inscricoes", icon: ClipboardList },
    { label: "Professores", path: "/professores", icon: Users },
    { label: "Perfil", path: "/perfil", icon: UserRound },
  ],

  PROFESSOR: [
    { label: "Início", path: "/inicio", icon: Home },
    { label: "Cursos", path: "/cursos", icon: BookOpen },
    { label: "Perfil", path: "/perfil", icon: UserRound },
  ],

  ALUNO: [
    { label: "Início", path: "/inicio", icon: Home },
    { label: "Cursos", path: "/cursos", icon: GraduationCap },
    {
      label: "Minhas inscrições",
      path: "/minhas-inscricoes",
      icon: ClipboardList,
    },
    { label: "Perfil", path: "/perfil", icon: UserRound },
  ],
};
