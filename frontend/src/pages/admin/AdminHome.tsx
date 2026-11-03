import PageHeader from "../../components/dashboard/PageHeader";
import StatStrip, {
  type StatItem,
} from "../../components/dashboard/StatStript";

const mockStats: StatItem[] = [
  {
    label: "Usuários",
    value: 1284,
  },
  {
    label: "Alunos",
    value: 1142,
  },
  {
    label: "Professores",
    value: 96,
  },
  {
    label: "Cursos",
    value: 38,
  },
  {
    label: "Inscrições",
    value: 2317,
  },
  {
    label: "Instituições",
    value: 7,
  },
  {
    label: "Vagas restantes",
    value: 214,
    highlight: true,
  },
];

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
    </section>
  );
}
