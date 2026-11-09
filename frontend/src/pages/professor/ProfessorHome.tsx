import { useState } from "react";
import { Search, Plus, X } from "lucide-react";

import { professorCourses } from "../../mocks/professorCourses";
import CourseCard from "../../components/professor/CourseCard";

export default function ProfessorHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("TODOS");
  const [selectedCampus, setSelectedCampus] = useState("TODOS");
  const [showCreateNotice, setShowCreateNotice] = useState(false);

  const campuses = Array.from(
    new Set(professorCourses.map((course) => course.campus)),
  );

  const filteredCourses = professorCourses.filter((course) => {
    const matchesSearch = course.nome
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesStatus =
      selectedStatus === "TODOS" || course.situacao === selectedStatus;

    const matchesCampus =
      selectedCampus === "TODOS" || course.campus === selectedCampus;

    return matchesSearch && matchesStatus && matchesCampus;
  });

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
          <p className="text-sm text-ink-2">
           ainda nao funciona
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
        <div className="md:col-span-1">
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
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none"
          >
            <option value="TODOS">Todas as situações</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="FECHADO">Fechado</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="campus-filter"
            className="mb-1.5 block text-sm font-medium text-ink"
          >
            Campus
          </label>

          <select
            id="campus-filter"
            value={selectedCampus}
            onChange={(event) => setSelectedCampus(event.target.value)}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none"
          >
            <option value="TODOS">Todos os campi</option>

            {campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-ink-2">
        {filteredCourses.length} curso(s) encontrado(s)
      </p>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
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
