import { Lock, MoveRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { FixedDepositAccount } from '@/types/account';

interface Props { account: FixedDepositAccount }

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-page">
      <div
        className="h-full rounded-full bg-violet-500 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function FixedDepositCard({ account }: Props) {
  const progress = Math.round((account.tenureElapsed / account.tenure) * 100);
  const interestEarned = account.maturityAmount - account.principal;

  return (
    <div className="overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      {/* ── Coloured top bar ── */}
      <div className="h-1.5 bg-violet-500" />

      <div className="p-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-content-secondary">
                Fixed Deposit
              </p>
              <p className="text-sm font-semibold text-content-primary">
                {account.interestRate}% p.a. · {account.tenure} months
              </p>
            </div>
          </div>
          <span className="rounded-full border border-ui-border px-2.5 py-1 text-xs text-content-secondary">
            {account.tenure - account.tenureElapsed} mo. remaining
          </span>
        </div>

        {/* ── Principal → Maturity ── */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 rounded-lg bg-brand-page px-4 py-3">
            <p className="text-xs text-content-secondary">Principal Amount</p>
            <p className="mt-1 text-xl font-bold text-content-primary">
              {formatCurrency(account.principal)}
            </p>
          </div>
          <MoveRight className="h-5 w-5 shrink-0 text-content-secondary" />
          <div className="flex-1 rounded-lg bg-violet-50 px-4 py-3">
            <p className="text-xs text-violet-600">Maturity Amount</p>
            <p className="mt-1 text-xl font-bold text-violet-700">
              {formatCurrency(account.maturityAmount)}
            </p>
          </div>
        </div>

        {/* ── Interest earned + maturity date ── */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <p className="text-xs text-content-secondary">Interest Earned</p>
            <p className="mt-0.5 text-sm font-semibold text-emerald-600">
              +{formatCurrency(interestEarned)}
            </p>
          </div>
          <div>
            <p className="text-xs text-content-secondary">Maturity Date</p>
            <p className="mt-0.5 text-sm font-semibold text-content-primary">
              {formatDate(account.maturityDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-content-secondary">Account No.</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-content-primary">
              {account.accountNumber}
            </p>
          </div>
        </div>

        {/* ── Tenure progress ── */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-content-secondary">Tenure Progress</p>
            <p className="text-xs font-semibold text-content-primary">
              {account.tenureElapsed} of {account.tenure} months · {progress}%
            </p>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* ── Actions ── */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" size="sm">Renew FD</Button>
          <Button variant="secondary" size="sm">Premature Withdrawal</Button>
          <Button variant="ghost" size="sm">Download Advice</Button>
        </div>
      </div>
    </div>
  );
}
