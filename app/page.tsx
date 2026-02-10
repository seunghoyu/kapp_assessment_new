import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Kapp Assessment
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            관리자 대시보드 프로토타입
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900">대시보드</h2>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                관리자 대시보드
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                조직 분석 및 관리 대시보드로 이동
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
