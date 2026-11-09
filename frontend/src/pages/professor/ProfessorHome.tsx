import { useEffect, useState } from "react";
import { Search, Plus, X } from "lucide-react";

import CourseCard from "../../components/professor/CourseCard";
import { listarMeusCursos } from "../../services/cursosService";

import type {
  Curso,
  StatusCurso,
  TipoAcao,
} from "../../types/cursos";

type StatusFilter = "TODOS" | StatusCurso;
type TipoAcaoFilter = "TODOS" | TipoAcao;

export default function ProfessorHome() {
  const [courses, setCourses] = useState<Curso[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>("TODOS");

  const [selectedTipoAcao, setSelectedTipoAcao] =
    useState<TipoAcaoFilter>("TODOS");

  const [showCreateNotice, setShowCreateNotice] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCourses() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await listarMeusCursos({
          status:
            selectedStatus === "TODOS" ? undefined : selectedStatus,

          tipoAcao:
            selectedTipoAcao === "TODOS"
              ? undefined
              : selectedTipoAcao,
        });

        if (active) {
          setCourses(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro ao carregar os cursos.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCourses();

    return () => {
      active = false;
    };
  }, [selectedStatus, selectedTipoAcao, reloadKey]);

  const filteredCourses = courses.filter((course) =>
    course.titulo
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <section className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Meus cursos
          </h1>

          <p className="mt-1 text-sm text-ink-2">
            Gerencie e acompanhe os cursos sob sua responsabilidade.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateNotice(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <Plus size={18} />
          Criar curso
        </button>
      </div>

      {showCreateNotice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4"
        >
          <p className="text-sm text-ink-2">
            ainda a ser feito.
          </p>

          <button
            type="button"
            onClick={() => setShowCreateNotice(false)}
            aria-label="Fechar aviso"
            className="shrink-0 text-ink-2 transition-colors hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
      )}

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
              onChange={(event) => setSearchTerm(event.target.value)}
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
              setSelectedStatus(event.target.value as StatusFilter)
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
              setSelectedTipoAcao(event.target.value as TipoAcaoFilter)
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

      {!isLoading && !error && (
        <p className="text-sm text-ink-2">
          {filteredCourses.length} curso(s) encontrado(s)
        </p>
      )}

      {isLoading && (
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-2">
            Carregando cursos...
          </p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Não foi possível carregar os cursos.
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredCourses.length === 0 && (
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <p className="font-medium text-ink">
            Nenhum curso encontrado.
          </p>

          <p className="mt-1 text-sm text-ink-2">
            Tente alterar os termos da pesquisa ou os filtros.
          </p>
        </div>
      )}
    </section>
  );
}