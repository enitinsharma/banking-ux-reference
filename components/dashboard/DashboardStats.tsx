'use client';

import { Star, Target, TrendingDown, Wallet } from 'lucide-react';
import { useAccounts } from '@/lib/hooks/useAccounts';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useRewards } from '@/lib/hooks/useRewards';
import { formatCurrency } from '@/lib/utils';
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
  const savings = accounts.find(a => a.type === 'savings');
  const balance = savings?.balance ?? 0;

  // Monthly spend: sum of debits in the latest transaction month (2026-05)
  const monthlySpend = transactions
    .filter(t => t.type === 'debit' && t.date.startsWith('2026-05'))
    .reduce((sum, t) => sum + t.amount, 0);

  const points = summary?.points ?? 0;
  const tier = summary?.tier ?? '—';

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Balance"
        value={formatCurrency(balance)}
        sub="Savings account"
        icon={Wallet}
        iconClassName="bg-blue-50 text-blue-600"
        trend={{ direction: 'up', label: 'Salary credited', positive: true }}
      />
      <StatCard
        label="Monthly Spend"
        value={formatCurrency(monthlySpend)}
        sub="May 2026"
        icon={TrendingDown}
        iconClassName="bg-rose-50 text-rose-600"
      />
      <StatCard
        label="Savings Goal"
        value="68%"
        sub="Emergency fund · ₹6.8L of ₹10L"
        icon={Target}
        iconClassName="bg-emerald-50 text-emerald-600"
        trend={{ direction: 'up', label: '+3% this month', positive: true }}
      />
      <StatCard
        label="Reward Points"
        value={`${points.toLocaleString('en-IN')} pts`}
        sub={`1 pt = ₹1 · ${tier} tier`}
        icon={Star}
        iconClassName="bg-amber-50 text-amber-600"
      />
    </div>
  );
}
