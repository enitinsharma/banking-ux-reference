import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AccountSummary } from '@/components/dashboard/AccountSummary';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`${greeting()}, Nitin. Here's your financial overview.`}
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
