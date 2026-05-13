import { AppSidebar } from "@/components/dashboard/app-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-root min-h-screen text-on-surface">
      <AppSidebar />
      <div className="flex min-h-screen flex-col md:pl-64">{children}</div>
    </div>
  );
}
