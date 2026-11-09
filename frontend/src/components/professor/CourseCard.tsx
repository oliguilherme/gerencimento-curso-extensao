import {
  CalendarDays,
  Clock3,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";

import type { ProfessorCourse } from "../../types/professor";

interface CourseCardProps {
  course: ProfessorCourse;
}

const statusConfig = {
  EM_ANDAMENTO: {
    label: "Em andamento",
    className: "bg-green-50 text-green-700",
  },
  EM_ANALISE: {
    label: "Em análise",
    className: "bg-yellow-50 text-yellow-700",
  },
  CONCLUIDO: {
    label: "Concluído",
    className: "bg-blue-50 text-blue-700",
  },
  FECHADO: {
    label: "Fechado",
    className: "bg-gray-100 text-gray-600",
  },
} as const;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function CourseCard({ course }: CourseCardProps) {
  const status = statusConfig[course.situacao as keyof typeof statusConfig] ?? {
    label: course.situacao,
    className: "bg-gray-100 text-gray-600",
  };

  const occupancyPercentage =
    course.totalVagas > 0
      ? Math.min((course.vagasOcupadas / course.totalVagas) * 100, 100)
      : 0;

  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent/10 font-display text-sm font-bold text-accent">
            {course.sigla}
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
              {course.nome}
            </h3>

            <p className="mt-1 text-xs text-ink-2">
              {course.instituicao} · Campus {course.campus}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="flex items-start gap-2">
          <CalendarDays size={16} className="mt-0.5 shrink-0 text-ink-2" />

          <div>
            <p className="text-[11px] text-ink-2">Período</p>
            <p className="mt-1 text-xs font-medium text-ink">
              {formatDate(course.dataInicio)}
            </p>
            <p className="text-xs text-ink-2">
              até {formatDate(course.dataFim)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock3 size={16} className="mt-0.5 shrink-0 text-ink-2" />

          <div>
            <p className="text-[11px] text-ink-2">Horário</p>
            <p className="mt-1 text-xs font-medium text-ink">
              {course.horarioInicio} – {course.horarioFim}
            </p>
            <p className="text-xs text-ink-2">{course.cargaHoraria} horas</p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-ink-2" />
            <span className="text-xs text-ink-2">Vagas ocupadas</span>
          </div>

          <span className="text-xs font-semibold text-ink">
            {course.vagasOcupadas}/{course.totalVagas}
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-ink-2">
          <GraduationCap size={15} />
          <span>{course.cargaHoraria}h de carga horária</span>
        </div>

        <span className="flex items-center gap-1 text-xs text-ink-2">
          <MapPin size={13} />
          {course.campus}
        </span>
      </div>
    </article>
  );
}
