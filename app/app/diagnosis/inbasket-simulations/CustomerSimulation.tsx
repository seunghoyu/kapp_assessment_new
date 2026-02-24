"use client";

import { useState } from "react";
import { User } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const RESPONSE_OPTIONS = ["CEO 방문", "대응팀 파견", "개선안 제시", "긴급 보상"];
const PRICE_OPTIONS = ["수용", "부분 수용", "대체안", "거부"];
const WARRANTY_OPTIONS = ["5년 보증", "3년 보증", "프리미엄 플랜", "품질 투자"];
const RELATION_OPTIONS = ["전담팀 구성", "정기 미팅", "파트너십 강화"];

type Props = { question: InbasketQuestion };

export default function CustomerSimulation({ question }: Props) {
  const [response, setResponse] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [warranty, setWarranty] = useState<string | null>(null);
  const [relation, setRelation] = useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-gray-900">VIP 고객 ABC 그룹 (연 150억원)</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{question.content}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">1. 즉각 대응 전략</h3>
            {RESPONSE_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer mb-1">
                <input type="radio" name="response" checked={response === o} onChange={() => setResponse(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">2. 가격 협상</h3>
            {PRICE_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer mb-1">
                <input type="radio" name="price" checked={price === o} onChange={() => setPrice(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">3. 품질 보증 방안</h3>
            {WARRANTY_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer mb-1">
                <input type="radio" name="warranty" checked={warranty === o} onChange={() => setWarranty(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">4. 관계 강화</h3>
            {RELATION_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer mb-1">
                <input type="radio" name="relation" checked={relation === o} onChange={() => setRelation(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
