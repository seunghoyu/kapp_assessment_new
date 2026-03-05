import Link from "next/link";
import { Gamepad2, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function ConsumerAppHomePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 min-h-0">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Gamepad2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          KAPP 역량 진단에 오신 것을 환영합니다
        </h1>
        <p className="text-gray-600 mb-8">
          AI 기반 맞춤형 역량 진단을 시작하여 나의 강점과 성장 포인트를 파악하세요.
        </p>
        <Link
          href={ROUTES.APP_DIAGNOSIS}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors"
        >
          KAPP 진단 시작하기
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
