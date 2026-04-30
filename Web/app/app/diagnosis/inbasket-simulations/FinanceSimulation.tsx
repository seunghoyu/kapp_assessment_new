"use client";

import { useState } from "react";
import { Calculator, Building2 } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const DEPARTMENTS = [
  { id: "mkt", name: "마케팅", request: "+3,000만원", reason: "캠페인 확대" },
  { id: "rd", name: "연구개발", request: "+4,000만원", reason: "신규 과제" },
  { id: "sales", name: "영업", request: "+2,000만원", reason: "인력 증원" },
  { id: "prod", name: "생산", request: "+2,000만원", reason: "설비 보강" },
];

const DECISIONS = ["전액 승인", "일부 승인", "거부", "차기 분기"] as const;

type Props = { question: InbasketQuestion };

export default function FinanceSimulation({ question }: Props) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-gray-900">부서별 예산 요청 검토</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{question.content}</p>
        <div className="space-y-4">
          {DEPARTMENTS.map((d) => (
            <div key={d.id} className="p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[120px]">
                <h4 className="font-semibold text-gray-900 flex items-center gap-1">
                  <Building2 className="h-4 w-4" /> {d.name}
                </h4>
                <p className="text-sm text-gray-500">{d.request} · {d.reason}</p>
              </div>
              <input
                type="text"
                placeholder="배분액 (원)"
                value={amounts[d.id] ?? ""}
                onChange={(e) => setAmounts((a) => ({ ...a, [d.id]: e.target.value }))}
                className="w-32 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
              />
              <div className="flex gap-2">
                {DECISIONS.map((dec) => (
                  <button
                    key={dec}
                    type="button"
                    onClick={() => setChoices((c) => ({ ...c, [d.id]: dec }))}
                    className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                      choices[d.id] === dec ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white"
                    }`}
                  >
                    {dec}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
