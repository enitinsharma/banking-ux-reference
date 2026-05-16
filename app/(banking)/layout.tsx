import { Shell } from "@/components/layout/Shell";

export default function BankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}
