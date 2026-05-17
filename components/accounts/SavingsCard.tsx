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
  className,
}: {
  label: string;
  value: string;
  copyValue?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${className ?? ''}`}>
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
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
                Savings Account
              </p>
              {account.isJoint && (
                <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                  Joint
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <p className="font-mono text-sm font-semibold text-content-primary">
                {account.accountNumber}
              </p>
              <CopyButton value={account.accountNumber} />
            </div>
            {account.isJoint && account.jointHolderName && (
              <p className="mt-0.5 text-xs text-content-secondary">
                with{' '}
                <span className="sm:hidden">{account.jointHolderName.split(' ')[0]}</span>
                <span className="hidden sm:inline">{account.jointHolderName}</span>
              </p>
            )}
          </div>
        </div>

        {/* ── Balance ── */}
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
            Available Balance
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-content-primary">
            {formatCurrency(account.availableBalance)}
          </p>
          {account.holdAmount ? (
            <p className="mt-1 text-xs text-amber-600">
              {formatCurrency(account.holdAmount)} on hold · {account.holdReason}
            </p>
          ) : null}
        </div>

        {/* ── Account details ── */}
        <div className="mt-6 divide-y divide-ui-border rounded-lg border border-ui-border px-4">
          <DetailRow
            label="Interest Rate"
            value={`${account.interestRate}% per annum`}
          />
          <DetailRow
            label="IFSC Code"
            value={account.ifsc}
            copyValue={account.ifsc}
          />
          <DetailRow
            label="Branch"
            value={account.branch}
            className="hidden sm:flex"
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
