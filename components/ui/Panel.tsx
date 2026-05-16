import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

export function Panel({ children, className, title, action }: PanelProps) {
  return (
    <div className={cn('rounded-xl border border-ui-border bg-brand-card p-6', className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-base font-semibold text-content-primary">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
