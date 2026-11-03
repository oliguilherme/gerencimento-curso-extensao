import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-[26px] font-semibold text-ink">
          {title}
        </h1>

        <p className="mt-1 text-sm text-ink-2">{subtitle}</p>
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
