"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { KnowledgeExplanation } from "@/lib/knowledgeExplanationData";

type Props = {
  open: boolean;
  onClose: () => void;
  explanation: KnowledgeExplanation | null;
};

function Block({
  title,
  body,
  tone = "neutral",
}: {
  title: string;
  body: string;
  tone?: "neutral" | "amber";
}) {
  const toneCls =
    tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : "border-gray-200 bg-white";
  return (
    <section className={`rounded-xl border ${toneCls} p-4`}>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {body}
      </div>
    </section>
  );
}

export default function KnowledgePracticalModal({ open, onClose, explanation }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const ex = explanation;

  const modalContent = (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        className="relative flex flex-col w-[96vw] max-w-[52rem] max-h-[92vh] rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="knowledge-practical-title"
      >
        <header className="flex-shrink-0 border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="knowledge-practical-title" className="text-lg font-bold text-gray-900">
                실무에 적용하기
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                바로 써먹을 수 있는 적용 팁과 다음 학습 방향을 정리했어요.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {!ex ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              해설 데이터를 불러오지 못했습니다.
            </div>
          ) : (
            <div className="space-y-4">
              <Block title="실무적용" body={ex.practical} tone="amber" />
              <Block title="학습추천" body={ex.recommendations} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

