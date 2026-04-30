"use client";

import { useState, useCallback } from "react";
import { Zap, Check } from "lucide-react";

export type DailyTipItem = { category: string; text: string };

type Props = {
  tips: DailyTipItem[];
};

const AUTO_NEXT_MS = 450;

export default function DailyTipWidget({ tips }: Props) {
  const [index, setIndex] = useState(0);
  const [applied, setApplied] = useState(false);

  const goNext = useCallback(() => {
    setApplied(false);
    setIndex((i) => (i + 1) % tips.length);
  }, [tips.length]);

  const handleApply = useCallback(() => {
    if (applied) return;
    setApplied(true);
    window.setTimeout(goNext, AUTO_NEXT_MS);
  }, [applied, goNext]);

  if (!tips.length) return null;

  const tip = tips[index];

  return (
    <>
      <style>{`
        @keyframes daily-tip-slide {
          from { transform: translateX(10px); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 min-w-[280px] w-max max-w-[620px]">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="text-[10px] font-semibold text-amber-800 mb-0.5">오늘의 1% 효율 챌린지</p>
          <div key={index} style={{ animation: "daily-tip-slide 0.25s ease-out" }}>
            <p className="text-xs text-gray-700 whitespace-nowrap truncate" title={tip.text}>
              {tip.text}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleApply}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
            applied
              ? "bg-emerald-500 text-white"
              : "border-2 border-amber-500 text-amber-600 hover:bg-amber-100"
          }`}
          aria-label={applied ? "다음 팁으로 전환됨" : "적용 완료"}
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
