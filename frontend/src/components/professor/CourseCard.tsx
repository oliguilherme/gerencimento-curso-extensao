import { CalendarDays, Clock3, Users, BookOpen, MapPin } from "lucide-react";

import type {
  Curso,
  StatusCurso,
  TipoAcao,
  TipoCurso,
  ModeloOferta,
} from "../../types/cursos";

interface CourseCardProps {
  course: Curso;
}

const statusConfig: Record<StatusCurso, { label: string; className: string }> =
  {
    RASCUNHO: {
      label: "Rascunho",
      className: "bg-gray-100 text-gray-600",
    },
    PUBLICADO: {
      label: "Publicado",
      className: "bg-blue-50 text-blue-700",
    },
    EM_ANDAMENTO: {
      label: "Em andamento",
      className: "bg-green-50 text-green-700",
    },
    ENCERRADO: {
      label: "Encerrado",
      className: "bg-gray-100 text-gray-600",
    },
    CANCELADO: {
      label: "Cancelado",
      className: "bg-red-50 text-red-700",
    },
  };

const tipoAcaoLabels: Record<TipoAcao, string> = {
  CURSO: "Curso",
  EVENTO: "Evento",
  PROJETO: "Projeto",
  PROGRAMA: "Programa",
};

const tipoCursoLabels: Record<TipoCurso, string> = {
  FORMACAO_INICIAL: "Formação inicial",
  FORMACAO_CONTINUADA: "Formação continuada",
};

const modeloOfertaLabels: Record<ModeloOferta, string> = {
  PRESENCIAL: "Presencial",
  ONLINE: "Online",
  HIBRIDO: "Híbrido",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default function CourseCard({ course }: CourseCardProps) {
  const status = statusConfig[course.status];

  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
            {course.titulo}
          </h3>

          <p className="mt-1 text-xs text-ink-2">
            {tipoAcaoLabels[course.tipoAcao]} · {tipoCursoLabels[course.tipo]}
          </p>
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
            <p className="text-[11px] text-ink-2">Carga horária</p>

            <p className="mt-1 text-xs font-medium text-ink">
              {course.cargaHoraria} horas
            </p>

            <p className="text-xs text-ink-2">
              {modeloOfertaLabels[course.modeloOferta]}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-ink-2" />

            <span className="text-xs text-ink-2">Beneficiados previstos</span>
          </div>

          <span className="text-xs font-semibold text-ink">
            {course.minBeneficiados}–{course.maxBeneficiados}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-ink-2">
          <BookOpen size={15} />

          <span>{course.areaTematica}</span>
        </div>

        <span className="flex items-center gap-1 text-xs text-ink-2">
          <MapPin size={13} />

          {course.localAtuacao === "URBANO" ? "Urbano" : "Rural"}
        </span>
      </div>
    </article>
  );
}
