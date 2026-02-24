"use client";

import { useState } from "react";
import type { InbasketQuestion } from "../InbasketList";

const TOOLS = [
  { id: "chatgpt", name: "ChatGPT Plus", cost: "240만원/년", roi: "8개월", hours: "480시간 절감" },
  { id: "notion", name: "Notion AI", cost: "120만원/년", roi: "12개월" },
  { id: "midjourney", name: "Midjourney", cost: "360만원/년", roi: "6개월" },
  { id: "copilot", name: "GitHub Copilot", cost: "1,200만원/년", roi: "3개월" },
];

const DECISIONS = ["즉시 도입", "추후 검토", "불필요"] as const;

type Props = { question: InbasketQuestion };

export default function DigitalToolSimulation({ question }: Props) {
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [priority, setPriority] = useState<Record<string, number>>({});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">{question.content}</p>
        <p className="text-xs text-gray-500 mt-2">예산 현황: 가용/할당/잔액 확인 후 도입 결정 및 우선순위를 정하세요.</p>
      </div>
      <div className="p-4 space-y-4">
        {TOOLS.map((t) => (
          <div key={t.id} className="p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[140px]">
              <h4 className="font-semibold text-gray-900">{t.name}</h4>
              <p className="text-sm text-gray-500">{t.cost} · ROI {t.roi}{t.hours ? ` · ${t.hours}` : ""}</p>
            </div>
            <div className="flex gap-2">
              {DECISIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDecisions((dec) => ({ ...dec, [t.id]: d }))}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${
                    decisions[t.id] === d ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">우선순위:</span>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPriority((p) => ({ ...p, [t.id]: n }))}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    priority[t.id] === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
