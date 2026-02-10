import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">
                관리자 대시보드
              </h2>
              <p className="mt-2 text-gray-600">
                대시보드 섹션들이 여기에 표시됩니다.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Phase 2부터 각 섹션을 단계적으로 구현할 예정입니다.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
