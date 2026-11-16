import { useEffect, useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";

import CourseCard from "../../components/professor/CourseCard";

import { listarMeusCursos } from "../../services/cursosService";

import CourseFilter from "../../components/professor/CourseFilter";

import type { Curso, CursosPagination } from "../../types/cursos";

import type {
  StatusFilter,
  TipoAcaoFilter,
} from "../../components/professor/CourseFilter";

const COURSES_PER_PAGE = 6;

export default function ProfessorHome() {
  const [courses, setCourses] = useState<Curso[]>([]);

  const [pagination, setPagination] = useState<CursosPagination | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("TODOS");

  const [selectedTipoAcao, setSelectedTipoAcao] =
    useState<TipoAcaoFilter>("TODOS");

  const [showCreateNotice, setShowCreateNotice] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Aguarda 400ms depois da última digitação para pesquisar.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  // Busca os cursos sempre que os filtros ou a página mudarem.
  useEffect(() => {
    let active = true;

    async function loadCourses() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await listarMeusCursos({
          page: currentPage,
          limit: COURSES_PER_PAGE,

          search: debouncedSearchTerm || undefined,

          status: selectedStatus === "TODOS" ? undefined : selectedStatus,

          tipoAcao: selectedTipoAcao === "TODOS" ? undefined : selectedTipoAcao,
        });

        if (active) {
          setCourses(result.data);
          setPagination(result.pagination);
        }
      } catch (error) {
        if (active) {
          setCourses([]);
          setPagination(null);

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
  }, [
    currentPage,
    debouncedSearchTerm,
    selectedStatus,
    selectedTipoAcao,
    reloadKey,
  ]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Meus cursos</h1>

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
          <p className="text-sm text-ink-2">Ainda a ser feito.</p>

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

      <CourseFilter
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          setCurrentPage(1);
        }}
        selectedTipoAcao={selectedTipoAcao}
        onTipoAcaoChange={(value) => {
          setSelectedTipoAcao(value);
          setCurrentPage(1);
        }}
      />

      {/* Paginação */}
          {pagination && pagination.total > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-5 sm:flex-row">
              <p className="text-sm text-ink-2">
                Página {pagination.page} de {Math.max(pagination.totalPages, 1)}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage || isLoading}
                  onClick={() => setCurrentPage((page) => page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage || isLoading}
                  onClick={() => setCurrentPage((page) => page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

      {!isLoading && !error && pagination && (
        <p className="text-sm text-ink-2">
          {pagination.total} curso(s) encontrado(s)
        </p>
      )}

      {isLoading && (
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-2">Carregando cursos...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">
            Não foi possível carregar os cursos.
          </p>

          <p className="mt-1 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          
        </>
      )}

      {!isLoading && !error && courses.length === 0 && (
        <div className="rounded-xl border border-line bg-surface p-8 text-center">
          <p className="font-medium text-ink">Nenhum curso encontrado.</p>

          <p className="mt-1 text-sm text-ink-2">
            Tente alterar os termos da pesquisa ou os filtros.
          </p>
        </div>
      )}
    </section>
  );
}
