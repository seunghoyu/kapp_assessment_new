import ConsumerSidebar from "@/components/layout/ConsumerSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-screen">
      <ConsumerSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
