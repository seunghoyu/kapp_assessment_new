"use client";

import type { InbasketQuestion } from "../InbasketList";

type Props = { question: InbasketQuestion };

export default function PlaceholderSimulation({ question }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 min-h-[200px]">
      <p className="text-sm text-gray-600">{question.content}</p>
      <p className="text-xs text-gray-400 mt-4">
        [{question.category}] 타입 전용 UI는 추후 구현 예정입니다.
      </p>
    </div>
  );
}
