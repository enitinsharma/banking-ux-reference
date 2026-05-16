import Link from 'next/link';
import { CreditCard, FileText, Headphones, SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const actions = [
  {
    label: 'Transfer',
    icon: SendHorizontal,
    href: '/transfer',
    iconClassName: 'bg-blue-50 text-blue-600',
    ringClassName: 'hover:ring-blue-200',
  },
  {
    label: 'Pay Bill',
    icon: FileText,
    href: '/bills',
    iconClassName: 'bg-violet-50 text-violet-600',
    ringClassName: 'hover:ring-violet-200',
  },
  {
    label: 'Service Request',
    icon: Headphones,
    href: '/service-requests',
    iconClassName: 'bg-emerald-50 text-emerald-600',
    ringClassName: 'hover:ring-emerald-200',
  },
  {
    label: 'Cards & Rewards',
    icon: CreditCard,
    href: '/cards',
    iconClassName: 'bg-amber-50 text-amber-600',
    ringClassName: 'hover:ring-amber-200',
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-ui-border bg-brand-card p-5">
      <h2 className="mb-4 text-base font-semibold text-content-primary">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ label, icon: Icon, href, iconClassName, ringClassName }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-2.5 rounded-xl border border-ui-border p-4',
              'transition-all duration-150 hover:border-transparent hover:ring-2',
              ringClassName,
            )}
          >
            <div className={cn('flex h-11 w-11 items-center justify-center rounded-full', iconClassName)}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-content-primary">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
