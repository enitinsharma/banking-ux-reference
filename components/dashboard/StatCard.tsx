import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Trend {
  direction: 'up' | 'down';
  label: string;
  /** true = good for the user (green). Defaults to direction === 'up'. */
  positive?: boolean;
}

interface StatCardProps {
  label: string;
  value: ReactNode;
  sub: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon container, e.g. "bg-blue-50 text-blue-600" */
  iconClassName: string;
  trend?: Trend;
}

export function StatCard({ label, value, sub, icon: Icon, iconClassName, trend }: StatCardProps) {
  const isPositive = trend ? (trend.positive ?? trend.direction === 'up') : true;

  return (
    <div className="rounded-xl border border-ui-border bg-brand-card p-5">
      <div className="flex items-start justify-between">
        {/* Icon pill */}
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconClassName)}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Trend badge */}
        {trend && (
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700',
            )}
          >
            {trend.direction === 'up'
              ? <TrendingUp className="h-3 w-3" />
              : <TrendingDown className="h-3 w-3" />}
            {trend.label}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-content-primary">
          {value}
        </p>
        <p className="mt-0.5 text-xs text-content-secondary">{sub}</p>
      </div>
    </div>
  );
}
