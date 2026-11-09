import { Search } from "lucide-react";

import type { StatusCurso, TipoAcao } from "../../types/cursos";

export type StatusFilter = "TODOS" | StatusCurso;
export type TipoAcaoFilter = "TODOS" | TipoAcao;

interface CourseFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;

  selectedStatus: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;

  selectedTipoAcao: TipoAcaoFilter;
  onTipoAcaoChange: (value: TipoAcaoFilter) => void;
}

export default function CourseFilter({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedTipoAcao,
  onTipoAcaoChange,
}: CourseFilterProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <label
          htmlFor="course-search"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Pesquisar curso
        </label>

        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3">
          <Search size={18} className="shrink-0 text-ink-2" />

          <input
            id="course-search"
            type="text"
            placeholder="Digite o nome do curso..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent py-2.5 text-sm text-ink outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="status-filter"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Situação
        </label>

        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
          }
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none"
        >
          <option value="TODOS">Todas as situações</option>
          <option value="RASCUNHO">Rascunho</option>
          <option value="PUBLICADO">Publicado</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="ENCERRADO">Encerrado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="action-filter"
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          Tipo de ação
        </label>

        <select
          id="action-filter"
          value={selectedTipoAcao}
          onChange={(event) =>
            onTipoAcaoChange(event.target.value as TipoAcaoFilter)
          }
          className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none"
        >
          <option value="TODOS">Todos os tipos</option>
          <option value="CURSO">Curso</option>
          <option value="EVENTO">Evento</option>
          <option value="PROJETO">Projeto</option>
          <option value="PROGRAMA">Programa</option>
        </select>
      </div>
    </div>
  );
}
