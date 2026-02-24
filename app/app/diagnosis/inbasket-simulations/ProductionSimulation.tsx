"use client";

import { useState } from "react";
import { Factory, AlertCircle } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

/** 원본과 동일: 4라인, 라인2 상세(납기·재고·손실) */
const LINES = [
  { id: 1, product: "A제품", status: "정상", rate: "98%", color: "green", detail: null },
  {
    id: 2,
    product: "B제품",
    status: "긴급 중단",
    rate: "불량률 15%",
    color: "red",
    detail: "납기 5일 후 10,000개 · 재고 2,000개 · 1일 손실 8,000만원",
  },
  { id: 3, product: "C제품", status: "주의", rate: "가동률 70%", color: "yellow", detail: "설비 노후" },
  { id: 4, product: "D제품", status: "시험 생산", rate: "-", color: "blue", detail: "신규 시험" },
];

const LINE2_OPTIONS = ["원자재 교체", "라인 전환", "외주 생산", "납기 연장"];
const LINE3_OPTIONS = ["유지보수", "조기 설비 교체", "생산 축소"];
const LINE4_OPTIONS = ["양산 진행", "테스트 연장", "개선 후 진행"];

type Props = { question: InbasketQuestion };

export default function ProductionSimulation({ question }: Props) {
  const [line2, setLine2] = useState<string | null>(null);
  const [line3, setLine3] = useState<string | null>(null);
  const [line4, setLine4] = useState<string | null>(null);

  const getOptions = (lineId: number) => {
    if (lineId === 2) return LINE2_OPTIONS;
    if (lineId === 3) return LINE3_OPTIONS;
    if (lineId === 4) return LINE4_OPTIONS;
    return [];
  };

  const getChoice = (lineId: number) => {
    if (lineId === 2) return line2;
    if (lineId === 3) return line3;
    if (lineId === 4) return line4;
    return null;
  };

  const setChoice = (lineId: number, value: string) => {
    if (lineId === 2) setLine2(value);
    if (lineId === 3) setLine3(value);
    if (lineId === 4) setLine4(value);
  };

  const summaryCount = { normal: 1, caution: 1, urgent: 1, test: 1 };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 상단: 4라인 실시간 현황 요약 (원본과 동일) */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Factory className="h-5 w-5 text-blue-600" />
          생산 라인 실시간 현황
        </h3>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            정상 {summaryCount.normal}
          </span>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            주의 {summaryCount.caution}
          </span>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
            긴급 {summaryCount.urgent}
          </span>
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            시험 {summaryCount.test}
          </span>
        </div>
      </div>

      <div className="flex min-h-0">
        <div className="flex-1 p-4 min-w-0">
          <p className="text-sm text-gray-600 mb-4">{question.content}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LINES.map((line) => (
              <div
                key={line.id}
                className={`p-4 rounded-xl border-2 ${
                  line.color === "red"
                    ? "border-red-200 bg-red-50"
                    : line.color === "yellow"
                      ? "border-yellow-200 bg-yellow-50"
                      : line.color === "blue"
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {line.color === "green"
                      ? "🟢"
                      : line.color === "red"
                        ? "🔴"
                        : line.color === "yellow"
                          ? "🟡"
                          : "🔵"}
                  </span>
                  <h4 className="font-semibold text-gray-900">라인 {line.id} ({line.product})</h4>
                </div>
                <p className="text-sm text-gray-600 mb-1">{line.status} · {line.rate}</p>
                {line.detail && (
                  <p className="text-xs text-gray-500 mb-3">{line.detail}</p>
                )}
                {getOptions(line.id).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {getOptions(line.id).map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setChoice(line.id, o)}
                        className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                          getChoice(line.id) === o
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 긴급 우선순위 가이드 (원본과 동일) */}
        <div className="w-56 bg-amber-50 border-l border-amber-200 p-4 flex-shrink-0 hidden sm:block">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            긴급 우선순위 가이드
          </h3>
          <ul className="text-sm space-y-2 text-gray-700">
            <li>· 라인 2(B제품): 불량률 15% 긴급 중단 → 원자재 교체/라인 전환/외주/납기 연장 중 결정</li>
            <li>· 라인 3: 설비 노후 가동률 70% → 유지보수/설비 교체/생산 축소 검토</li>
            <li>· 라인 4: 신규 시험 생산 → 양산 진행/테스트 연장/개선 후 진행</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
