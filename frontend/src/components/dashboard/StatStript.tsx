export interface StatItem {
  label: string;
  value: number;
  highlight?: boolean;
}

interface StatStripProps {
  items: StatItem[];
}

export default function StatStrip({ items }: StatStripProps) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4 xl:grid-cols-7">
      {items.map((item) => (
        <div key={item.label} className="bg-surface px-3 py-3 sm:px-4">
          <p className="text-xs text-ink-2">{item.label}</p>

          <p
            className={`mt-1 font-display text-2xl font-semibold tabular-nums ${
              item.highlight ? "text-accent" : "text-ink"
            }`}
          >
            {item.value.toLocaleString("pt-BR")}
          </p>
        </div>
      ))}
    </div>
  );
}
