import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { CopyButton } from './CopyButton';
import type { SavingsAccount } from '@/types/account';

interface Props { account: SavingsAccount }

function DetailRow({
  label,
  value,
  copyValue,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-xs text-content-secondary">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-sm text-content-primary">{value}</span>
        {copyValue && <CopyButton value={copyValue} />}
      </div>
    </div>
  );
}

export function SavingsCard({ account }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      {/* ── Coloured top bar ── */}
      <div className="h-1.5 bg-blue-500" />

      <div className="p-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
                Savings Account
              </p>
              <p className="text-sm font-semibold text-content-primary">
                {account.name}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>

        {/* ── Balance ── */}
        <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
              Total Balance
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-content-primary">
              {formatCurrency(account.balance)}
            </p>
          </div>
          <div className="rounded-lg bg-brand-page px-4 py-2 text-right">
            <p className="text-xs text-content-secondary">Available Balance</p>
            <p className="mt-0.5 text-lg font-semibold text-content-primary">
              {formatCurrency(account.availableBalance)}
            </p>
          </div>
        </div>

        {/* ── Account details ── */}
        <div className="mt-6 divide-y divide-ui-border rounded-lg border border-ui-border px-4">
          <DetailRow
            label="Account Number"
            value={account.accountNumber}
            copyValue={account.accountNumber}
          />
          <DetailRow
            label="IFSC Code"
            value={account.ifsc}
            copyValue={account.ifsc}
          />
          <DetailRow
            label="Branch"
            value={account.branch}
          />
        </div>

        {/* ── Actions ── */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/transfer">
            <Button variant="primary" size="sm">Transfer Money</Button>
          </Link>
          <Button variant="secondary" size="sm">Download Statement</Button>
        </div>
      </div>
    </div>
  );
}
