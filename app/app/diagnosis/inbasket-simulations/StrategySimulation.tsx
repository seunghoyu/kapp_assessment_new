"use client";

import { useState } from "react";
import type { InbasketQuestion } from "../InbasketList";

const FINANCE_OPTIONS = ["승인", "재협상", "실사 후 재검토", "포기"];
const INTEGRATION_OPTIONS = ["완전 통합", "단계적 통합", "독립 운영", "혼합형"];

type Props = { question: InbasketQuestion };

export default function StrategySimulation({ question }: Props) {
  const [finance, setFinance] = useState<string | null>(null);
  const [integration, setIntegration] = useState<string | null>(null);
  const [budget, setBudget] = useState("");

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">XYZ 테크놀로지 M&A · 인수가 1,500억원</h3>
        <p className="text-sm text-gray-500 mt-1">연매출 300억, 영업이익 45억 · 시장점유율 12%→28% 예상</p>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{question.content}</p>
        <div className="space-y-6">
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">재무적 타당성</h3>
            <p className="text-xs text-gray-500 mb-2">Price/Revenue 5.0x, ROI 분석 검토</p>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">전략적 적합성</h3>
            <p className="text-xs text-gray-500 mb-2">시장 지배력, 기술 역량, 신규 고객층</p>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">실사(DD) 리스크</h3>
            <p className="text-xs text-gray-500 mb-2">72시간 제한 등 검증 조건 확인</p>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">통합(PMI) 전략</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {INTEGRATION_OPTIONS.map((o) => (
                <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="integration" checked={integration === o} onChange={() => setIntegration(o)} className="text-blue-600" />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="통합 예산 (원)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">5. 최종 의사결정</h3>
            <div className="flex flex-wrap gap-2">
              {FINANCE_OPTIONS.map((o) => (
                <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="finance" checked={finance === o} onChange={() => setFinance(o)} className="text-blue-600" />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
