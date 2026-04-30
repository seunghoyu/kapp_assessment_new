"use client";

import { ArrowLeft, CheckCircle } from "lucide-react";
import type { InbasketQuestion } from "./InbasketList";
import { SimulationContent } from "./inbasket-simulations";

type Props = {
  question: InbasketQuestion;
  onBack: () => void;
  onComplete: () => void;
};

export default function InbasketSimulation({ question, onBack, onComplete }: Props) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      {/* 상단: 목록으로 버튼만 */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </button>
      </div>

      {/* 헤더 */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-white">
        <p className="text-sm font-semibold text-gray-800">{question.category} · {question.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">완료 후 다음 단계로 이동할 수 있습니다.</p>
      </div>

      {/* 시뮬레이션 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div id="simulation-content">
          <SimulationContent question={question} />
        </div>
      </div>

      {/* 하단: 완료 버튼 */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700"
        >
          <CheckCircle className="h-5 w-5" />
          완료하고 다음 단계로
        </button>
      </div>
    </div>
  );
}
