"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const INITIAL_OPTIONS = ["즉시 조사", "윤리위원회 상정", "외부 감사", "내부 사전조사"];
const TARGET_OPTIONS = ["직위 해제", "타부서 배치", "현 업무 유지", "자택 대기"];
const SCOPE_OPTIONS = ["거래 내역", "협력업체", "금융거래", "이메일 로그"];
const DISCLOSURE_OPTIONS = ["즉시 공개", "이사회 후", "조사 완료 후", "최소 공개"];

type Props = { question: InbasketQuestion };

export default function EthicsSimulation({ question }: Props) {
  const [initial, setInitial] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [scope, setScope] = useState<string[]>([]);
  const [disclosure, setDisclosure] = useState<string | null>(null);

  const toggleScope = (s: string) => {
    setScope((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-amber-50 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <span className="font-semibold text-gray-900">제보 WB-2026-021 · 구매팀 김과장 (재직 15년)</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{question.content}</p>
        <div className="space-y-6">
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">1. 초기 대응 방향</h3>
            <div className="flex flex-wrap gap-2">
              {INITIAL_OPTIONS.map((o) => (
                <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="initial" checked={initial === o} onChange={() => setInitial(o)} className="text-blue-600" />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">2. 대상자 조치</h3>
            <div className="flex flex-wrap gap-2">
              {TARGET_OPTIONS.map((o) => (
                <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="target" checked={target === o} onChange={() => setTarget(o)} className="text-blue-600" />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">3. 조사 범위 (복수 선택)</h3>
            <div className="flex flex-wrap gap-2">
              {SCOPE_OPTIONS.map((o) => (
                <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={scope.includes(o)} onChange={() => toggleScope(o)} className="text-blue-600 rounded" />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-semibold text-gray-900 mb-2">4. 공개 및 보고 전략</h3>
            <div className="flex flex-wrap gap-2">
              {DISCLOSURE_OPTIONS.map((o) => (
                <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="disclosure" checked={disclosure === o} onChange={() => setDisclosure(o)} className="text-blue-600" />
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
