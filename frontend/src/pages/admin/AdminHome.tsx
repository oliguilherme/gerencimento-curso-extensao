import PageHeader from "../../components/dashboard/PageHeader";
import StatStrip, {
  type StatItem,
} from "../../components/dashboard/StatStript";
import DistributionBars, {
  type DistributionBarRow,
} from "../../components/dashboard/DistributionBars";
import { Ban, CheckCircle2, ClipboardList, Clock, XCircle } from "lucide-react";
import DonutChart, {
  type DonutSegment,
} from "../../components/dashboard/DonutChart";

const mockStats: StatItem[] = [
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

const mockEnrollmentRows: DistributionBarRow[] = [
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

const mockCourseSegments: DonutSegment[] = [
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

export default function AdminHome() {
  const now = new Date();

  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting}, administrador`}
        subtitle={formattedDate}
      />

      <StatStrip items={mockStats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface">
          <header className="px-5 pt-5">
            <h2 className="font-display text-[15px] font-semibold text-ink">
              Inscrições por situação
            </h2>
          </header>

          <div className="p-5">
            <DistributionBars rows={mockEnrollmentRows} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface">
          <header className="px-5 pt-5">
            <h2 className="font-display text-[15px] font-semibold text-ink">
              Cursos por situação
            </h2>
          </header>

          <div className="p-5">
            <DonutChart segments={mockCourseSegments} />
          </div>
        </section>
      </div>
    </section>
  );
}
