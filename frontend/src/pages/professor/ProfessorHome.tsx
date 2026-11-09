import { professorCourses } from "../../mocks/professorCourses";
import CourseCard from "../../components/professor/CourseCard";

export default function ProfessorHome() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Meus cursos</h1>

        <p className="mt-1 text-sm text-ink-2">
          Gerencie e acompanhe os cursos sob sua responsabilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {professorCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
