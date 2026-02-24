"use client";

import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

/** 원본과 동일: 예산·성과 지표 */
const CAMPAIGNS = [
  { id: 1, name: "SNS 인플루언서", budget: "84%", target: "50%", status: "초과", metric: "조회수/참여자" },
  { id: 2, name: "온라인 광고", budget: "97.5%", target: "100%", status: "초과", metric: "클릭수/전환율" },
  { id: 3, name: "오프라인 이벤트", budget: "50%", target: "40%", status: "정상", metric: "참여자" },
  { id: 4, name: "이메일 마케팅", budget: "60%", target: "50%", status: "초과", metric: "오픈율/전환율" },
];

const ACTIONS = ["계속", "확대", "축소", "중단"] as const;

type Props = { question: InbasketQuestion };

export default function MarketingCampaignSimulation({ question }: Props) {
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 상단 예산 현황 (원본과 동일) */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          예산 현황
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-gray-500">총 예산</div>
            <div className="font-bold text-gray-900">2억 4,000만원</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-gray-500">집행액</div>
            <div className="font-bold text-gray-900">1억 8,200만원</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-gray-500">가용 예산</div>
            <div className="font-bold text-green-600">5,800만원</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-gray-500">추가 요청액</div>
            <div className="font-bold text-amber-600">3,200만원</div>
          </div>
        </div>
      </div>

      <div className="flex min-h-0">
        <div className="flex-1 p-4 min-w-0">
          <div className="p-2 border-b border-gray-200 bg-gray-50 flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-900">캠페인별 예산·성과 점검</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">{question.content}</p>
          <div className="space-y-4">
            {CAMPAIGNS.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[140px]">
                  <h4 className="font-semibold text-gray-900">{c.name}</h4>
                  <p className="text-sm text-gray-500">예산 집행 {c.budget} · 목표 {c.target} · {c.metric}</p>
                </div>
                <input
                  type="text"
                  placeholder="조정 예산 (원)"
                  value={amounts[c.id] ?? ""}
                  onChange={(e) => setAmounts((a) => ({ ...a, [c.id]: e.target.value }))}
                  className="w-28 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                />
                <div className="flex gap-2">
                  {ACTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setChoices((ch) => ({ ...ch, [c.id]: a }))}
                      className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                        choices[c.id] === a ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: ROI 평가 패널 (원본과 동일) */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 flex-shrink-0 hidden sm:block">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            ROI 평가
          </h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>· 가용 예산 대비 할당액 실시간 반영</li>
            <li>· 캠페인별 조치(계속/확대/축소/중단)에 따라 예산 재배분</li>
            <li>· 목표 대비 성과 초과 시 확대·축소 권장 검토</li>
          </ul>
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500">현재 가용</div>
            <div className="font-bold text-green-600">5,800만원</div>
          </div>
        </div>
      </div>
    </div>
  );
}
