"use client";

import { useState } from "react";
import { BookOpen, Cog, TrendingUp, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const CARDS = [
  {
    id: "kapp",
    title: "측정 영역 (KAPP)",
    icon: BookOpen,
    iconBg: "bg-blue-500",
    content: (
      <ul className="space-y-2.5 text-sm text-gray-700">
        {[
          { Icon: BookOpen, label: "지식 (K)", desc: "직무 수행에 필요한 이론적 지식과 개념의 이해도를 측정합니다.", color: "text-blue-600", bg: "bg-blue-100" },
          { Icon: Cog, label: "적용 (A)", desc: "지식을 실제 상황에 적용하여 문제를 해결하는 능력을 평가합니다.", color: "text-emerald-600", bg: "bg-emerald-100" },
          { Icon: TrendingUp, label: "성과 (P)", desc: "주어진 자원 내에서 산출물의 완성도와 정확성을 검증합니다.", color: "text-amber-600", bg: "bg-amber-100" },
          { Icon: Zap, label: "생산성 (P)", desc: "AI 도구를 활용하여 시간당 산출량을 얼마나 극대화하는지 측정합니다.", color: "text-violet-600", bg: "bg-violet-100" },
        ].map(({ Icon, label, desc, color, bg }) => (
          <li key={label} className="flex gap-2.5">
            <span className={`shrink-0 mt-0.5 w-7 h-7 rounded-md ${bg} ${color} flex items-center justify-center`}>
              <Icon className="w-3.5 h-3.5" />
            </span>
            <span><strong className="text-gray-800">{label}</strong> {desc}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "composition",
    title: "문항 구성",
    icon: Cog,
    iconBg: "bg-emerald-500",
    content: (
      <ul className="space-y-2 text-sm text-gray-700">
        <li><span className="text-gray-500 font-medium">1.</span> 본인 정보 입력</li>
        <li><span className="text-gray-500 font-medium">2.</span> 지식 문항 <strong>3문항</strong> (객관식)</li>
        <li><span className="text-gray-500 font-medium">3.</span> 적용 문항 <strong>3문항</strong> (객관식)</li>
        <li><span className="text-gray-500 font-medium">4.</span> 성과 문항 <strong>3문항</strong> (객관식)</li>
        <li><span className="text-gray-500 font-medium">5.</span> 디지털 인바스켓 <strong>4문항</strong>
          <span className="text-gray-600 ml-1">(우선순위 3문항 + 자동화 1문항)</span>
        </li>
      </ul>
    ),
  },
  {
    id: "inbasket",
    title: "디지털 인바스킷이란",
    icon: TrendingUp,
    iconBg: "bg-amber-500",
    content: (
      <div className="text-sm text-gray-700 leading-relaxed space-y-3">
        <p>
          가상의 업무 환경을 제공하여, 제한 시간 내 <strong className="text-gray-800">정보 추출·우선순위 결정·대안 수립</strong> 과정을 데이터로 기록합니다.
        </p>
        <p>
          단순 지식이 아닌, <strong className="text-gray-800">현업에 즉시 투입 가능한 실제 수행 능력</strong>을 측정하며,
        </p>
        <p>
          산업군·직급·연차에 따라 초정밀 맞춤형 문항이 출제됩니다.
        </p>
      </div>
    ),
  },
  {
    id: "difference",
    title: "이 진단의 차별점",
    icon: Zap,
    iconBg: "bg-violet-500",
    content: (
      <ul className="space-y-2.5 text-sm text-gray-700">
        <li className="flex gap-2">
          <span className="shrink-0 font-medium text-blue-600">적응형</span>
          <span>정답/오답에 따라 난이도를 실시간 조정하여, 10~15문항 내에 지식 수준을 정밀하게 파악합니다.</span>
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-medium text-emerald-600">맞춤형</span>
          <span>산업군·직급·연차에 따른 초정밀 맞춤 문항으로 역량을 정확히 측정합니다.</span>
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-medium text-amber-600">AI 분석</span>
          <span>산업군 및 직무를 AI가 자동으로 분석하여 문항과 해석에 반영합니다.</span>
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 font-medium text-indigo-600">성장 예측</span>
          <span>스킬·역량 데이터와 AI 성장 예측을 연계하여 개인별 성장 포인트를 제시합니다.</span>
        </li>
      </ul>
    ),
  },
];

export default function DiagnosisStartStep({ onStart }: { onStart: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goPrev = () => setCurrentIndex((i) => (i <= 0 ? CARDS.length - 1 : i - 1));
  const goNext = () => setCurrentIndex((i) => (i >= CARDS.length - 1 ? 0 : i + 1));

  return (
    <div className="grid grid-cols-[60%_40%] flex-1 min-h-0 overflow-hidden bg-white">
      {/* 좌측 60%: 제목·부제목 세로 가운데 정렬, 텍스트 크게 */}
      <div className="flex flex-col justify-center py-8 pl-10 pr-8 min-h-0">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 md:text-5xl">
          맞춤형 역량 진단을 시작합니다
        </h2>
        <p className="text-xl text-gray-600 md:text-2xl">
          회사·직무에 맞는 문제로, 약 15분이면 끝나요.
        </p>
      </div>

      {/* 우측 40%: 카드 + CTA 모두 가운데 정렬, 영역 넓게 */}
      <div className="flex flex-col items-center justify-center py-8 px-6 min-h-0 bg-white border-l border-gray-100 overflow-hidden">
        <div className="w-full max-w-[92%] min-h-0 flex flex-col items-center justify-center flex-1 gap-6">
          {/* 카드 슬라이드 트랙 (가운데) */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
            <div
              className="flex w-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="w-full flex-shrink-0 flex justify-center px-0.5"
                  >
                    <article
                      className="w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden flex flex-col"
                      style={{ aspectRatio: "3/4", maxHeight: "min(58vh, 440px)" }}
                    >
                      <div className="flex-shrink-0 p-5 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          <span className={`w-9 h-9 rounded-xl ${card.iconBg} text-white flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          {card.title}
                        </h3>
                      </div>
                      <div className="flex-1 min-h-0 overflow-y-auto p-5">
                        {card.content}
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 카드뉴스 넘기기: 이전/다음 버튼 + 도트 */}
          <div className="flex items-center justify-center gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={goPrev}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="이전 카드"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentIndex ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`카드 ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="다음 카드"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* 카드 아래: 안내 문구 + CTA (가운데) */}
          <div className="flex-shrink-0 w-full flex flex-col items-center text-center">
            <p className="text-sm text-gray-500 mb-3">준비되셨으면 아래 버튼을 눌러 시작해 주세요</p>
            <button
              type="button"
              onClick={onStart}
              className="w-full max-w-[280px] rounded-xl bg-blue-600 text-white py-3.5 px-6 text-base font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              진단 시작하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
