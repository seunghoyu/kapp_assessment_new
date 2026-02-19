"use client";

import Link from "next/link";
import {
  TrendingUp,
  Users,
  Building2,
  Trophy,
  Gamepad2,
  Factory,
  Bot,
  BarChart3,
  Info,
  Rocket,
  CheckCircle2,
  GraduationCap,
  RefreshCw,
  ArrowRight,
  Phone,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function ConsumerHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-emerald-500 text-white py-20 text-center">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12">
            <h1 className="text-4xl font-black mb-6 leading-tight md:text-5xl">
              AI 기반 직무 역량 진단으로
              <br />
              <span className="bg-white/20 px-4 py-1 rounded-lg inline-block mt-2">
                임직원 성장을 가속화
              </span>
              하세요
            </h1>
            <p className="text-xl md:text-2xl opacity-95 font-light mb-10">
              진단부터 교육, 성과 측정까지
              <br />
              원스톱 HR 솔루션으로 조직의 역량을 혁신합니다
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-600 px-8 py-4 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                KAPP 진단 시작하기
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white bg-white/20 px-8 py-4 font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                <Info className="w-5 h-5" />
                서비스 둘러보기
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { icon: Users, value: "1,000+", label: "기업 임직원" },
              { icon: Building2, value: "50+", label: "파트너 기업" },
              { icon: Trophy, value: "98%", label: "만족도" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <Icon className="w-10 h-10 mx-auto mb-3" />
                <h3 className="text-3xl font-black mb-1">{value}</h3>
                <p className="opacity-90">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Highlight */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { num: "15분", label: "빠른 진단 완료", desc: "기존 60분 → 15분 압축" },
              { num: "97%", label: "진단 정확도", desc: "KAPP 4차원 측정" },
              { num: "91%", label: "진단 완료율", desc: "게이미피케이션 효과" },
              { num: "10개", label: "산업별 맞춤", desc: "IT·금융·의료 등" },
              { num: "업계 최초", label: "AI 워크플로우", desc: "업무 가속도 측정" },
            ].map(({ num, label, desc }) => (
              <div
                key={label}
                className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/15 hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl font-black mb-2">{num}</div>
                <div className="font-semibold mb-1">{label}</div>
                <div className="text-sm opacity-90">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">
            왜 해커스 NEXT GEN인가요?
          </h2>
          <p className="text-center text-gray-500 mb-12">
            기존 솔루션과 완전히 다른 4가지 차별점
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Gamepad2,
                title: "게임처럼 몰입하는 진단",
                badge: "완료율 91%",
                desc: "지루한 설문 NO! 실무 시나리오, 시뮬레이션, E-tray로 15분 안에 정확하게 측정합니다.",
                list: ["8가지 인터랙티브 문항", "롤플레이 + 시뮬레이션", "참여율 기존 대비 2.2배"],
              },
              {
                icon: Factory,
                title: "산업별 맞춤 진단",
                badge: "10개 산업",
                desc: "IT는 서버 장애, 금융은 리스크 관리, 의료는 환자 안전! 산업별 실무 맥락을 반영합니다.",
                list: ["IT/금융/의료/마케팅 특화", "산업별 E-tray 시뮬레이션", "50+ 직무 커버"],
              },
              {
                icon: Bot,
                title: "AI 워크플로우 측정",
                badge: "업계 최초",
                desc: "단순 역량이 아닌 AI 도구 활용 능력까지! 2026년 필수 역량을 선제적으로 평가합니다.",
                list: ["AI 도구 선택 시뮬레이션", "업무 가속도 85% 측정", "자동화 레벨 분석"],
              },
              {
                icon: BarChart3,
                title: "차별화된 관리자 리포트",
                badge: "경영진 보고용",
                desc: "스킬 갭 히트맵, 업계 벤치마킹, 교육비 ROI 자동 계산! 데이터 기반 의사결정을 지원합니다.",
                list: ["조직 스킬 갭 히트맵", "업계 상위 10% 벤치마킹", "교육비 ROI 자동 계산"],
              },
            ].map(({ icon: Icon, title, badge, desc, list }) => (
              <div
                key={title}
                className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-3">
                  {badge}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{desc}</p>
                <ul className="space-y-2">
                  {list.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">
            핵심 기능
          </h2>
          <p className="text-center text-gray-500 mb-12">
            4단계 파이프라인으로 완성되는 역량 개발 프로세스
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-indigo-400 relative shadow-sm hover:shadow-lg transition-all">
              <span className="absolute -top-3 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                NEW!
              </span>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">KAPP 진단</h3>
              <p className="text-gray-600 text-sm mb-4">
                게임처럼 몰입하며 정확하게! 실무 시나리오, 시뮬레이션으로 역량을 측정합니다
              </p>
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:gap-2 transition-all"
              >
                체험하기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {[
              { icon: GraduationCap, title: "교육 큐레이션", desc: "진단 결과 기반 맞춤형 교육 추천 및 학습 경로 설계" },
              { icon: BarChart3, title: "성과 대시보드", desc: "역량 향상도 시각화 및 ROI 분석 리포트" },
              { icon: RefreshCw, title: "사후진단 & 재설계", desc: "주기적 재진단과 차기 교육 계획 지원" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border-2 border-transparent hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">
            어떻게 작동하나요?
          </h2>
          <p className="text-center text-gray-500 mb-12">
            간단한 4단계로 시작하는 역량 개발
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-2">
            {[
              { num: "01", title: "역량 진단", desc: "AI 기반 설문으로 직무 역량 측정" },
              { num: "02", title: "교육 추천", desc: "맞춤형 교육 콘텐츠 큐레이션" },
              { num: "03", title: "교육 이수", desc: "필요 역량 집중 개발" },
              { num: "04", title: "성과 측정", desc: "역량 향상도 확인" },
            ].map(({ num, title, desc }, i) => (
              <div key={num} className="flex items-center gap-2">
                <div className="bg-white p-6 rounded-xl shadow-md text-center min-w-[160px] hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-3">
                    {num}
                  </div>
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="w-6 h-6 text-blue-500 opacity-50 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-16 text-center">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-3xl font-black mb-4">
            KAPP 진단으로 지금 바로 시작하세요
          </h2>
          <p className="text-xl opacity-90 mb-6">
            8가지 인터랙티브 문항으로 더 정확하고 재미있게!
          </p>
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-600 px-8 py-4 font-semibold hover:bg-gray-100 transition-colors"
          >
            <Rocket className="w-5 h-5" />
            KAPP 진단 시작하기
          </Link>
          <p className="mt-4 text-sm opacity-80">
            ⏱️ 30분 → 15분으로 단축 | 📊 정확도 97% | 🎮 게임처럼 몰입
          </p>
        </div>
      </section>

      {/* CTA Section 2 */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20 text-center">
        <div className="mx-auto max-w-4xl px-5">
          <h2 className="text-3xl font-black mb-4">지금 바로 체험해보세요</h2>
          <p className="text-xl opacity-95 mb-8">
            신청 후 5분 안에 시작 가능 | 신용카드 불필요 | 1개월 무료 트라이얼
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 rounded-full bg-white text-indigo-600 px-10 py-4 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <Rocket className="w-5 h-5" />
              무료로 진단 시작하기
            </Link>
            <Link
              href={ROUTES.ADMIN}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/20 px-10 py-4 font-bold hover:bg-white hover:text-indigo-600 transition-all"
            >
              <Phone className="w-5 h-5" />
              도입 문의 (1:1 상담)
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {["1개월 무료 트라이얼", "전담 매니저 배정", "맞춤형 온보딩 지원", "언제든 해지 가능"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  {item}
                </span>
              )
            )}
          </div>
          <p className="text-lg opacity-95">
            🏆 이미 <strong>50+ 기업, 1,000+ 임직원</strong>이 사용 중입니다
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-2">해커스 캠퍼스 Business</h3>
              <p className="text-gray-400">NEXT GEN Solution</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">서비스</h4>
              <ul className="space-y-2">
                <li>
                  <Link href={ROUTES.LOGIN} className="text-gray-400 hover:text-white transition-colors">
                    KAPP 진단
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.APP} className="text-gray-400 hover:text-white transition-colors">
                    대시보드
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">문의</h4>
              <p className="text-gray-400">Email: business@hackers.com</p>
              <p className="text-gray-400">Tel: 02-1234-5678</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
            © 2026 Hackers Campus Business. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
