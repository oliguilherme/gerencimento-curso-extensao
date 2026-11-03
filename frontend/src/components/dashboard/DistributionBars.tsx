import type { LucideIcon } from "lucide-react";

export interface DistributionBarRow {
  label: string;
  value: number;
  icon: LucideIcon;
  textColor: string;
  barColor: string;
}

interface DistributionBarsProps {
  rows: DistributionBarRow[];
}

export default function DistributionBars({ rows }: DistributionBarsProps) {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((row) => {
        const Icon = row.icon;

        const percentage = (row.value / maxValue) * 100;

        return (
          <li
            key={row.label}
            className="grid grid-cols-[120px_minmax(0,1fr)_50px] items-center gap-3"
          >
            <span
              className={`flex items-center gap-1.5 text-xs ${row.textColor}`}
            >
              <Icon size={16} />

              {row.label}
            </span>

            <div className="h-5 overflow-hidden rounded bg-surface-2">
              <div
                className={`h-full rounded ${row.barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <span className="text-right font-mono text-xs text-ink">
              {row.value.toLocaleString("pt-BR")}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
