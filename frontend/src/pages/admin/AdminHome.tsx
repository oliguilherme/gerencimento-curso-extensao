import { useEffect, useState } from "react";

import PageHeader from "../../components/dashboard/PageHeader";
import StatStrip from "../../components/dashboard/StatStript";
import { type StatItem } from "../../components/dashboard/StatStript";
import DistributionBars, {
  type DistributionBarRow,
} from "../../components/dashboard/DistributionBars";

import DonutChart, {
  type DonutSegment,
} from "../../components/dashboard/DonutChart";

import {
  Ban,
  CheckCircle2,
  ClipboardList,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import { getAdminDashboard } from "../../services/dashboardService";

import type {
  AdminDashboardResponse,
  EnrollmentStatus,
  CourseStatus,
} from "../../types/dashboard";

const enrollmentPresentation: Record<
  EnrollmentStatus,
  {
    label: string;
    icon: LucideIcon;
    textColor: string;
    barColor: string;
  }
> = {
  PENDENTE: {
    label: "Pendente",
    icon: Clock,
    textColor: "text-amber-700",
    barColor: "bg-amber-600",
  },

  APROVADA: {
    label: "Aprovada",
    icon: CheckCircle2,
    textColor: "text-green-700",
    barColor: "bg-green-600",
  },

  REJEITADA: {
    label: "Rejeitada",
    icon: XCircle,
    textColor: "text-red-700",
    barColor: "bg-red-600",
  },

  CANCELADA: {
    label: "Cancelada",
    icon: Ban,
    textColor: "text-gray-600",
    barColor: "bg-gray-500",
  },

  LISTA_ESPERA: {
    label: "Lista de espera",
    icon: ClipboardList,
    textColor: "text-blue-700",
    barColor: "bg-blue-600",
  },
};

const coursePresentation: Record<
  CourseStatus,
  {
    label: string;
    color: string;
  }
> = {
  RASCUNHO: {
    label: "Rascunho",
    color: "#B45309",
  },

  PUBLICADO: {
    label: "Publicado",
    color: "#1D4ED8",
  },

  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "#15803D",
  },

  ENCERRADO: {
    label: "Encerrado",
    color: "#64748B",
  },

  CANCELADO: {
    label: "Cancelado",
    color: "#B91C1C",
  },
};

const enrollmentOrder: EnrollmentStatus[] = [
  "PENDENTE",
  "APROVADA",
  "REJEITADA",
  "CANCELADA",
  "LISTA_ESPERA",
];

const courseOrder: CourseStatus[] = [
  "RASCUNHO",
  "PUBLICADO",
  "EM_ANDAMENTO",
  "ENCERRADO",
  "CANCELADO",
];

export default function AdminHome() {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const result = await getAdminDashboard();

        if (active) {
          setDashboard(result);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Erro inesperado ao carregar o dashboard.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [reload]);

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

  if (loading) {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title={`${greeting}, administrador`}
          subtitle={formattedDate}
        />

        <p className="text-sm text-ink-2">
          Carregando informações do dashboard...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-6">
        <PageHeader
          title={`${greeting}, administrador`}
          subtitle={formattedDate}
        />

        <div className="rounded-lg border border-red-200 bg-surface p-5">
          <p className="font-medium text-danger">
            Não foi possível carregar o dashboard.
          </p>

          <p className="mt-2 text-sm text-ink-2">{error}</p>

          <button
            onClick={() => setReload((current) => current + 1)}
            className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  if (!dashboard) {
    return null;
  }

  const stats: StatItem[] = [
    {
      label: "Usuários",
      value: dashboard.estatisticas.usuarios,
    },
    {
      label: "Alunos",
      value: dashboard.estatisticas.alunos,
    },
    {
      label: "Professores",
      value: dashboard.estatisticas.professores,
    },
    {
      label: "Cursos",
      value: dashboard.estatisticas.cursos,
    },
    {
      label: "Inscrições",
      value: dashboard.estatisticas.inscricoes,
    },
    {
      label: "Instituições",
      value: dashboard.estatisticas.instituicoes,
    },
    {
      label: "Vagas restantes",
      value: dashboard.estatisticas.vagasRestantes,
      highlight: true,
    },
  ];

  const enrollmentRows: DistributionBarRow[] = enrollmentOrder.map((status) => {
    const item = dashboard.inscricoesPorSituacao.find(
      (item) => item.situacao === status,
    );

    return {
      ...enrollmentPresentation[status],
      value: item?.quantidade ?? 0,
    };
  });

  const courseSegments: DonutSegment[] = courseOrder.map((status) => {
    const item = dashboard.cursosPorSituacao.find(
      (item) => item.situacao === status,
    );

    return {
      id: status,
      ...coursePresentation[status],
      value: item?.quantidade ?? 0,
    };
  });

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting}, administrador`}
        subtitle={formattedDate}
      />

      <StatStrip items={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface">
          <header className="px-5 pt-5">
            <h2 className="font-display text-[15px] font-semibold text-ink">
              Inscrições por situação
            </h2>
          </header>

          <div className="p-5">
            <DistributionBars rows={enrollmentRows} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface">
          <header className="px-5 pt-5">
            <h2 className="font-display text-[15px] font-semibold text-ink">
              Cursos por situação
            </h2>
          </header>

          <div className="p-5">
            <DonutChart segments={courseSegments} />
          </div>
        </section>
      </div>
    </section>
  );
}
