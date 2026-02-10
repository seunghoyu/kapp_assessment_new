import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {children}
      </div>
      <RightPanel />
    </div>
  );
}
