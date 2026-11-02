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
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[26px] font-semibold text-ink">
            {greeting}, administrador
          </h1>

          <p className="mt-1 text-sm text-ink-2">{formattedDate}</p>
        </div>
      </div>
    </section>
  );
}
