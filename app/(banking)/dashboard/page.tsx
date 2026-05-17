import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Good morning, Nitin. Here's your financial overview."
      />

      {/* ── Stat cards ── */}
      <DashboardStats />

      {/* ── Quick actions ── */}
      <QuickActions />

      {/* ── Main grid: recent transactions + account summary ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <AccountSummary />
        </div>
      </div>
    </div>
  );
}
