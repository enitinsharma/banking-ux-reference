import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/ui/Panel";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Nitin. Here's your financial overview."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Balance", value: "₹2,45,680", sub: "Savings account" },
          { label: "Monthly Spend", value: "₹84,648", sub: "May 2026" },
          { label: "Savings Goal", value: "68%", sub: "Emergency fund" },
          { label: "Reward Points", value: "12,450 pts", sub: "1 pt = ₹1 · Gold tier" },
        ].map(card => (
          <Panel key={card.label}>
            <p className="text-sm text-content-secondary">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-content-primary">{card.value}</p>
            <p className="mt-0.5 text-xs text-content-secondary">{card.sub}</p>
          </Panel>
        ))}
      </div>
      <p className="mt-8 text-sm text-content-secondary">
        Full dashboard components coming next session.
      </p>
    </div>
  );
}
