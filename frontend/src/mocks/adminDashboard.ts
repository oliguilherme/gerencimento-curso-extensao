import { Ban, CheckCircle2, ClipboardList, Clock, XCircle } from "lucide-react";
import type { StatItem } from "../components/dashboard/StatStript";
import type { DistributionBarRow } from "../components/dashboard/DistributionBars";
import type { DonutSegment } from "../components/dashboard/DonutChart";
export const mockStats: StatItem[] = [
  {
    label: "Usuários",
    value: 1284,
  },
  {
    label: "Alunos",
    value: 1142,
  },
  {
    label: "Professores",
    value: 96,
  },
  {
    label: "Cursos",
    value: 38,
  },
  {
    label: "Inscrições",
    value: 2317,
  },
  {
    label: "Instituições",
    value: 7,
  },
  {
    label: "Vagas restantes",
    value: 214,
    highlight: true,
  },
];

export const mockEnrollmentRows: DistributionBarRow[] = [
  {
    label: "Pendente",
    value: 412,
    icon: Clock,
    textColor: "text-amber-700",
    barColor: "bg-amber-600",
  },
  {
    label: "Aprovada",
    value: 1480,
    icon: CheckCircle2,
    textColor: "text-green-700",
    barColor: "bg-green-600",
  },
  {
    label: "Rejeitada",
    value: 220,
    icon: XCircle,
    textColor: "text-red-700",
    barColor: "bg-red-600",
  },
  {
    label: "Cancelada",
    value: 127,
    icon: Ban,
    textColor: "text-gray-600",
    barColor: "bg-gray-500",
  },
  {
    label: "Lista de espera",
    value: 78,
    icon: ClipboardList,
    textColor: "text-blue-700",
    barColor: "bg-blue-600",
  },
];

export const mockCourseSegments: DonutSegment[] = [
  {
    id: "RASCUNHO",
    label: "Rascunho",
    value: 4,
    color: "#B45309",
  },
  {
    id: "PUBLICADO",
    label: "Publicado",
    value: 5,
    color: "#1D4ED8",
  },
  {
    id: "EM_ANDAMENTO",
    label: "Em andamento",
    value: 17,
    color: "#15803D",
  },
  {
    id: "ENCERRADO",
    label: "Encerrado",
    value: 9,
    color: "#64748B",
  },
  {
    id: "CANCELADO",
    label: "Cancelado",
    value: 3,
    color: "#B91C1C",
  },
];