"use client";

import { useCallback, useState } from "react";
import AiExplorationFlow, { type AiExplorationPayload } from "./AiExplorationFlow";
import AiExplorationIntro, {
  AI_EXPLORATION_INTRO_STORAGE_KEY,
  AI_INTRO_ALWAYS_SHOW,
} from "./AiExplorationIntro";

type Props = {
  value: AiExplorationPayload;
  onChange: (payload: AiExplorationPayload) => void;
  onRequestResult: () => void;
};

/**
 * step 6: 전환 인트로 + AI 탐색 플로우.
 * 프로덕션: sessionStorage로 최초 1회 생략 가능. 개발(`NODE_ENV=development`): 단계 진입마다 인트로 표시.
 */
export default function DiagnosisAiExplorationStep({ value, onChange, onRequestResult }: Props) {
  const [introOpen, setIntroOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    if (AI_INTRO_ALWAYS_SHOW) return true;
    try {
      return sessionStorage.getItem(AI_EXPLORATION_INTRO_STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const handleIntroClose = useCallback(() => {
    setIntroOpen(false);
  }, []);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
      <AiExplorationIntro open={introOpen} variant="initial" onClose={handleIntroClose} />
      <AiExplorationFlow value={value} onChange={onChange} onRequestResult={onRequestResult} />
    </div>
  );
}
