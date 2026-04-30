"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

/** 원본과 동일: 6개 조항 (제9조·제11조 추가) */
const CLAUSES = [
  { id: 1, title: "제1조 계약 금액", risk: "저위험" },
  { id: 3, title: "제3조 위약금 20%", risk: "고위험" },
  { id: 5, title: "제5조 품질 보증 5년", risk: "고위험" },
  { id: 7, title: "제7조 지적재산권", risk: "중위험" },
  { id: 9, title: "제9조 비밀유지", risk: "저위험" },
  { id: 11, title: "제11조 일방적 해지", risk: "고위험" },
];

const OPINIONS = ["수정요청", "협상", "수용", "거절"] as const;

type Props = { question: InbasketQuestion };

export default function LegalSimulation({ question }: Props) {
  const [opinions, setOpinions] = useState<Record<number, string>>({});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <Scale className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-gray-900">50억원 규모 계약서 검토</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{question.content}</p>
        <div className="space-y-4">
          {CLAUSES.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{c.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  c.risk === "고위험" ? "bg-red-100 text-red-700" :
                  c.risk === "중위험" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {c.risk}
                </span>
              </div>
              <div className="flex gap-2">
                {OPINIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOpinions((op) => ({ ...op, [c.id]: o }))}
                    className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                      opinions[c.id] === o ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white"
                    }`}
                  >
                    {o}
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
