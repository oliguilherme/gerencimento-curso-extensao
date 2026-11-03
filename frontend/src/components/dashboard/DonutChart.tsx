export interface DonutSegment {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  caption?: string;
}

export default function DonutChart({
  segments,
  caption = "cursos",
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  const radius = 55;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce<{
    arcs: (DonutSegment & {
      dashArray: string;
      dashOffset: number;
    })[];
    offset: number;
  }>(
    (acc, segment) => {
      const length = total > 0 ? (segment.value / total) * circumference : 0;

      const dashOffset = -acc.offset;

      acc.arcs.push({
        ...segment,
        dashArray: `${length} ${circumference - length}`,
        dashOffset,
      });

      return {
        arcs: acc.arcs,
        offset: acc.offset + length,
      };
    },
    {
      arcs: [],
      offset: 0,
    },
  ).arcs;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <div className="relative size-40 shrink-0">
        <svg
          viewBox="0 0 160 160"
          className="size-full"
          role="img"
          aria-label={`Distribuição de ${total} ${caption}`}
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth="22"
          />

          <g transform="rotate(-90 80 80)">
            {arcs.map((arc) => (
              <circle
                key={arc.id}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth="22"
                strokeDasharray={arc.dashArray}
                strokeDashoffset={arc.dashOffset}
              />
            ))}
          </g>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[28px] font-semibold text-ink">
            {total.toLocaleString("pt-BR")}
          </span>

          <span className="text-[11px] text-ink-2">{caption}</span>
        </div>
      </div>

      <ul className="flex w-full flex-1 flex-col gap-3">
        {segments.map((segment) => (
          <li
            key={segment.id}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex items-center gap-2 text-[13px] text-ink-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />

              {segment.label}
            </span>

            <span className="font-mono text-[13px] text-ink">
              {segment.value.toLocaleString("pt-BR")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
