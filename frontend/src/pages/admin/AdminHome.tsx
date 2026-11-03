import PageHeader from "../../components/dashboard/PageHeader";

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
    </section>
  );
}
