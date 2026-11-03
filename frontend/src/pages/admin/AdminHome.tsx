import PageHeader from "../../components/dashboard/PageHeader";
import StatStrip from "../../components/dashboard/StatStript";
import DistributionBars from "../../components/dashboard/DistributionBars";

import DonutChart from "../../components/dashboard/DonutChart";
import {
  mockStats,
  mockEnrollmentRows,
  mockCourseSegments,
} from "../../mocks/adminDashboard";

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
