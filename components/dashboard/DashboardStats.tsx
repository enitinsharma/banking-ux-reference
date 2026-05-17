'use client';

import { Landmark, Star, TrendingDown, Wallet } from 'lucide-react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useRewards } from '@/lib/hooks/useRewards';
import { Amount } from '@/components/ui/Amount';
import { formatCurrencyCompact } from '@/lib/utils';
import { StatCard } from './StatCard';

function Skeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-ui-border bg-brand-card p-5">
      <div className="h-10 w-10 rounded-lg bg-brand-page" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-20 rounded bg-brand-page" />
        <div className="h-7 w-36 rounded bg-brand-page" />
        <div className="h-3 w-24 rounded bg-brand-page" />
      </div>
    </div>
  );
}

export function DashboardStats() {
  const { accounts, loading: loadingAccounts } = useAccounts();
  const { transactions, loading: loadingTxns } = useTransactions();
  const { summary, loading: loadingRewards } = useRewards();

  const loading = loadingAccounts || loadingTxns || loadingRewards;

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map(i => <Skeleton key={i} />)}
      </div>
    );
  }

  // Derive values from live mock data
  const savingsAccounts = accounts.filter(a => a.type === 'savings');
  const availableBalance = savingsAccounts.reduce(
    (sum, a) => sum + (a.type === 'savings' ? a.availableBalance : 0), 0,
  );
  const totalHold = savingsAccounts.reduce(
    (sum, a) => sum + (a.type === 'savings' ? (a.holdAmount ?? 0) : 0), 0,
  );
  const holdReasons = savingsAccounts
    .filter(a => a.type === 'savings' && a.holdAmount)
    .map(a => a.type === 'savings' && a.holdReason)
    .filter(Boolean)
    .join(', ');

  const loanAccounts = accounts.filter(
    a => a.type === 'home_loan' || a.type === 'personal_loan',
  );
  const totalOutstanding = loanAccounts.reduce((sum, a) => sum + a.outstandingAmount, 0);
  const nextEmi = loanAccounts
    .map(a => ({ emi: a.emi, date: new Date(a.nextEmiDate) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  // Monthly spend: sum of debits in the current calendar month
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthName = now.toLocaleString('en-IN', { month: 'long' });
  const dayOfMonth = now.getDate();

  const monthlySpend = transactions
    .filter(t => t.type === 'debit' && t.date.startsWith(currentYM))
    .reduce((sum, t) => sum + t.amount, 0);

  // Average spend by this day-of-month across past 2 months
  const pastSpends = [1, 2].map(monthsAgo => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return transactions
      .filter(t => t.type === 'debit' && t.date.startsWith(ym) && parseInt(t.date.slice(8, 10)) <= dayOfMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }).filter(s => s > 0);

  const avgSpend = pastSpends.length > 0
    ? Math.round(pastSpends.reduce((a, b) => a + b, 0) / pastSpends.length)
    : 0;

  const spendDiff = avgSpend > 0 ? monthlySpend - avgSpend : 0;

  const points = summary?.points ?? 0;
  const tier = summary?.tier ?? '—';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Available Balance"
        value={<Amount value={availableBalance} />}
        sub={savingsAccounts.length > 1 ? `${savingsAccounts.length} savings accounts` : 'Savings account'}
        icon={Wallet}
        iconClassName="bg-blue-50 text-blue-600"
        alert={totalHold > 0 ? `₹${(totalHold / 1000).toFixed(1)}K on hold · ${holdReasons}` : undefined}
        action={{ label: 'View accounts', href: '/accounts' }}
      />
      <StatCard
        label="Monthly Spend"
        value={<Amount value={monthlySpend} />}
        sub={monthName}
        icon={TrendingDown}
        iconClassName="bg-rose-50 text-rose-600"
        trend={avgSpend > 0 ? {
          direction: spendDiff > 0 ? 'up' : 'down',
          label: `${formatCurrencyCompact(Math.abs(spendDiff))} ${spendDiff > 0 ? 'above' : 'below'} usual`,
          positive: spendDiff <= 0,
        } : undefined}
        action={{ label: 'View transactions', href: '/transactions' }}
      />
      <StatCard
        label="Next EMI"
        value={nextEmi ? <Amount value={nextEmi.emi} /> : '—'}
        sub={nextEmi
          ? `Due ${nextEmi.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${loanAccounts.length} loan${loanAccounts.length > 1 ? 's' : ''} · ₹${(totalOutstanding / 100000).toFixed(1)}L outstanding`
          : 'No active loans'}
        icon={Landmark}
        iconClassName="bg-amber-50 text-amber-600"
        action={{ label: 'Pre-pay a loan', href: '/transfer' }}
      />
      <StatCard
        label="Reward Points"
        value={`${points.toLocaleString('en-IN')} pts`}
        sub={`1 pt = ₹1 · ${tier} tier`}
        icon={Star}
        iconClassName="bg-amber-50 text-amber-600"
        action={{ label: 'Redeem points', href: '/cards' }}
      />
    </div>
  );
}
