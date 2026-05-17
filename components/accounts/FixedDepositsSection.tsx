import { Amount } from '@/components/ui/Amount';
import { Button } from '@/components/ui/Button';
import { FixedDepositRow } from './FixedDepositRow';
import type { FixedDepositAccount } from '@/types/account';

interface Props { accounts: FixedDepositAccount[] }

export function FixedDepositsSection({ accounts }: Props) {
  if (accounts.length === 0) return null;

  const totalPrincipal = accounts.reduce((sum, fd) => sum + fd.principal, 0);
  const totalMaturity  = accounts.reduce((sum, fd) => sum + fd.maturityAmount, 0);
  const totalInterest  = totalMaturity - totalPrincipal;

  return (
    <div className="overflow-hidden rounded-xl border border-ui-border bg-brand-card">
      {/* Accent bar */}
      <div className="h-1.5 bg-violet-500" />

      <div className="p-5">
        {/* ── Section header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-content-primary">
              Fixed Deposits
              <span className="ml-2 text-sm font-normal text-content-secondary">
                ({accounts.length})
              </span>
            </h2>

            {/* Corpus summary */}
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
              <span>
                Principal&nbsp;
                <Amount value={totalPrincipal} className="font-semibold text-content-primary" />
              </span>
              <span>
                At maturity&nbsp;
                <Amount value={totalMaturity} className="font-semibold text-violet-600" />
              </span>
              <span>
                Interest&nbsp;
                <Amount value={totalInterest} prefix="+" className="font-semibold text-emerald-600" />
              </span>
            </div>
          </div>

          <Button variant="secondary" size="sm" className="shrink-0">
            + Open FD
          </Button>
        </div>

        {/* ── FD rows ── */}
        <div className="mt-2 divide-y divide-ui-border">
          {accounts.map(fd => (
            <FixedDepositRow key={fd.id} account={fd} />
          ))}
        </div>
      </div>
    </div>
  );
}
