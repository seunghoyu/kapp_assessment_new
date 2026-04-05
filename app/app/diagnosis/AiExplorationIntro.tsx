"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ImageIcon, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

/** step 6 최초 진입 브리핑 표시 여부 (flow 변경 시 버전 접미사 증가 권장) */
export const AI_EXPLORATION_INTRO_STORAGE_KEY = "kapp_diagnosis_ai_intro_v3";

/** `next dev` 등 개발 빌드에서는 인박스→AI 단계 진입 시 sessionStorage와 무관하게 인트로를 항상 연다. */
export const AI_INTRO_ALWAYS_SHOW =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

/** ①②③ 슬라이드: 상단 미디어 + 하단 설명 카드. `mediaSrc`에 `/kapp/...` 등 넣으면 이미지·GIF 표시 */
type IntroStep = {
  title: string;
  body: string;
  mediaSrc?: string | null;
  mediaAlt?: string;
  placeholderHint: string;
};

const STEPS: IntroStep[] = [
  {
    title: "① 도구 탐색",
    body: "카드를 하나씩 열어보며 ‘이런 AI도 있구나’, ‘이건 이렇게 쓰이는구나’를 알아가는 단계예요. 우리 실무라면 이런 것도 써 볼 수 있겠다 싶은지 가볍게 확인해 보시면 돼요. 이미 쓰고 있는 도구가 있으면 골라 두시면 됩니다.",
    placeholderHint: "이미지 또는 GIF (도구 탐색 화면 예시)",
    mediaAlt: "도구 탐색 단계 안내 시각 자료",
  },
  {
    title: "② AI 트렌드 이해도",
    body: "AI는 계속 바뀌어요. 최근 흐름을 얼마나 따라가고 있는지 짧게 확인해요.",
    placeholderHint: "이미지 또는 GIF (트렌드 이해도 예시)",
    mediaAlt: "AI 트렌드 이해도 단계 안내 시각 자료",
  },
  {
    title: "③ AI 활용도 설문",
    body: "실무에서 어디에 AI를 쓰는지, 부족했던 점, 앞으로 배우고 싶은 것을 차례로 골라볼게요.",
    placeholderHint: "이미지 또는 GIF (활용도 설문 예시)",
    mediaAlt: "AI 활용도 설문 단계 안내 시각 자료",
  },
];

const BENEFIT_COPY = (
  <>
    여기까지 하시면, <span className="font-medium">내가 쓰는 AI와 트렌드 감각이 한눈에 정리</span>
    되고, 실무에서 어디에 쓰는지·무엇이 부족한지·무엇을 더 배우고 싶은지 스스로 짚어볼 수
    있어요. 그 결과는 <span className="font-medium">진단 리포트와 이후 추천 학습</span>을 이해하는
    데도 바로 이어져요.
  </>
);

/** 슬라이드: 도입 1 + 단계 3 + 마무리 멘트 1 */
const SLIDE_COUNT = 1 + STEPS.length + 1;

type Props = {
  open: boolean;
  variant: "initial" | "replay";
  onClose: () => void;
};

export default function AiExplorationIntro({ open, variant, onClose }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setSlideIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && variant === "replay") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, variant, onClose]);

  const handlePrimary = () => {
    if (variant === "initial" && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(AI_EXPLORATION_INTRO_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }
    onClose();
  };

  const lastIndex = SLIDE_COUNT - 1;
  const isLast = slideIndex === lastIndex;

  if (!open || !mounted || typeof document === "undefined") return null;

  const modal = (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-exploration-intro-title"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/45 backdrop-blur-[2px] cursor-default"
        aria-label="배경 닫기"
        onClick={() => {
          if (variant === "replay") onClose();
        }}
      />
      <div
        className="relative z-10 flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/20 max-h-[min(94dvh,calc(100dvh-1rem))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 border-b border-gray-100 px-6 py-3.5 flex items-center justify-between gap-2 bg-gradient-to-r from-violet-50/80 to-white">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-xs font-medium text-violet-800 truncate">AI 활용 탐색 안내</span>
          </div>
          <div className="flex items-center gap-1 shrink-0" aria-hidden>
            {Array.from({ length: SLIDE_COUNT }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slideIndex ? "w-5 bg-violet-600" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
          <div
            className="flex-1 min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] overflow-hidden relative"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              className="flex h-full transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {/* Slide 0 — 도입 */}
              <div className="w-full shrink-0 h-full overflow-y-auto overscroll-contain px-6 sm:px-8 py-6">
                <h2
                  id="ai-exploration-intro-title"
                  className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug"
                >
                  문제를 풀며 배운 뒤, AI 환경을 정리해 볼 차례예요
                </h2>
                <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                  KAPP는 역량 진단과 함께, 실무에서 바로 쓰일 학습 힌트를 남기는 흐름이에요. 앞에서는
                  상황 문제를 풀며 배웠다면, 지금 단계에서는 변화가 빠른 AI를{" "}
                  <span className="font-medium text-gray-800">어떻게 보고·고르고·쓰는지</span> 함께
                  점검해요.
                </p>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  다음 화면부터 단계별로 어떤 일을 하게 되는지 살펴보세요.
                </p>
              </div>

              {STEPS.map((s) => (
                <div
                  key={s.title}
                  className="w-full shrink-0 h-full overflow-y-auto overscroll-contain px-6 sm:px-10 py-5 sm:py-6 flex flex-col items-center justify-center gap-4"
                >
                  {/* 이미지·GIF와 설명 카드 동일 가로 너비(max-w-3xl 컬럼) */}
                  <div className="w-full max-w-3xl mx-auto shrink-0 flex flex-col gap-4">
                    <div
                      className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden border border-violet-100/80 bg-gradient-to-br from-violet-50 via-white to-slate-50 shadow-inner"
                      role="img"
                      aria-label={s.mediaAlt}
                    >
                      {s.mediaSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element -- 진단 인트로용 정적/공개 경로
                        <img
                          src={s.mediaSrc}
                          alt={s.mediaAlt ?? ""}
                          className="absolute inset-0 h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
                          <ImageIcon
                            className="h-12 w-12 sm:h-14 sm:w-14 text-violet-300"
                            strokeWidth={1.25}
                            aria-hidden
                          />
                          <span className="text-xs sm:text-sm font-medium text-violet-700/75 max-w-xs leading-snug">
                            {s.placeholderHint}
                          </span>
                          <span className="text-[11px] text-gray-400">추후 이미지·GIF로 교체</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full rounded-lg border border-violet-100 bg-violet-50/50 px-4 py-3 sm:px-4 sm:py-3.5 shadow-sm">
                      <p className="text-sm font-semibold text-violet-900">{s.title}</p>
                      <p className="mt-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed">{s.body}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* 마지막 — 얻는 것 */}
              <div className="w-full shrink-0 h-full overflow-y-auto overscroll-contain px-6 sm:px-8 py-6 flex flex-col justify-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  이 단계를 마치면
                </p>
                <div className="rounded-xl border border-gray-200 bg-gray-50/90 px-5 py-4">
                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{BENEFIT_COPY}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
              disabled={slideIndex <= 0}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none min-w-[4.5rem]"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
              이전
            </button>

            {!isLast ? (
              <button
                type="button"
                onClick={() => setSlideIndex((i) => Math.min(lastIndex, i + 1))}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 transition-colors ml-auto"
              >
                다음
                <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrimary}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 transition-colors ml-auto min-w-[10rem]"
              >
                {variant === "replay" ? "닫기" : "AI 활용 탐색 시작"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
