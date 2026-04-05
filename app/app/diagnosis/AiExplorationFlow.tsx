"use client";

import { useMemo, useState, useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Sparkles, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import TwemojiIcon from "@/components/common/TwemojiIcon";
import { countryCodeToFlagEmoji } from "@/lib/countryFlagEmoji";
import aiToolsCatalog from "@/data/kappDiagnosis/aiToolsCatalog.json";
import aiTrendConcepts from "@/data/kappDiagnosis/aiTrendConcepts.json";

/** `aiTrendConcepts` JSON의 `**강조**` 마크다운을 굵게 렌더링 (내부에 `*` 없음 가정) */
function renderTrendTextWithBold(text: string, strongClassName: string): ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**") && seg.length > 4) {
      return (
        <strong key={i} className={strongClassName}>
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

export type AiExplorationPhase = "catalog" | "trend" | "survey";

export type AiExplorationPayload = {
  phase: AiExplorationPhase;
  toolsUsed: string[];
  /** AI 트렌드 이해도: concept id → 1~5 또는 미선택 */
  trendResponses: Record<string, number | null>;
  /** 트렌드 문항 현재 인덱스 (세션 복원용) */
  trendStepIndex: number;
  s1Frequency: string[];
  s2Pain: string[];
  s4Learning: string[];
  s5OrgSupport: string | null;
  /** AI 활용도 설문: 추가 의견(선택, S5 화면 하단) */
  surveyFreeText: string;
  cardsOpened: string[];
};

export function defaultAiExploration(): AiExplorationPayload {
  return {
    phase: "catalog",
    toolsUsed: [],
    trendResponses: {},
    trendStepIndex: 0,
    s1Frequency: [],
    s2Pain: [],
    s4Learning: [],
    s5OrgSupport: null,
    surveyFreeText: "",
    cardsOpened: [],
  };
}

/**
 * 카탈로그 `glossaryCards` / 향후 프롬프트로 채울 용어 카드 공통 형식.
 * 필드만 맞추면 UI 톤(violet)은 `AI_TOOL_MODAL_EDU_VIOLET`로 통일됩니다.
 */
type GlossaryCard = {
  title: string;
  lines: string[];
};

/** 도구 상세 모달 — 용어설명 카드·활용 팁 등 교육용 강조 블록 (보라 톤 통일) */
const AI_TOOL_MODAL_EDU_VIOLET = {
  surfaceCard: "rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3 shadow-sm",
  surfaceBlock: "rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-4",
  heading: "text-sm font-bold text-violet-900",
  cardTitle: "text-sm font-bold text-violet-900 leading-snug",
  bodySm: "text-sm text-violet-950 leading-relaxed",
  bodyBase: "text-base text-violet-950 leading-relaxed",
} as const;

type CatalogTool = (typeof aiToolsCatalog.tools)[number] & {
  logoPublicPath?: string | null;
  /** 오픈소스 항목 등, 공개 저장소 링크(선택). */
  githubRepo?: string;
  /** 특화·강점 한 줄(카탈로그 데이터, 공개 자료 기반 요약). */
  focusStrengths?: string;
  /** 용어설명 — 모달에서 카드 그리드로 표시. */
  glossaryCards?: GlossaryCard[];
};

const HQ_LABEL: Record<string, string> = {
  US: "미국",
  KR: "한국",
  JP: "일본",
  DE: "독일",
  FR: "프랑스",
  GB: "영국",
  CA: "캐나다",
  IL: "이스라엘",
  AU: "호주",
  IN: "인도",
  SG: "싱가포르",
  SE: "스웨덴",
  NL: "네덜란드",
  CH: "스위스",
  ES: "스페인",
  IT: "이탈리아",
  BR: "브라질",
  AE: "아랍에미리트",
  TW: "대만",
  FI: "핀란드",
  NO: "노르웨이",
  XX: "기타",
};

/** 국가명 + 국기(다른 메타 라벨과 구분되도록 배경·테두리) */
function CountryLabel({
  countryCode,
  className = "",
  compact = false,
}: {
  countryCode: string;
  className?: string;
  compact?: boolean;
}) {
  const hq = HQ_LABEL[countryCode] ?? countryCode;
  const flagEmoji = countryCodeToFlagEmoji(countryCode);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200/90 font-semibold text-slate-800 shadow-sm ${compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"} ${className}`}
    >
      <TwemojiIcon icon={flagEmoji} size={compact ? "0.75rem" : "0.875rem"} className="shrink-0 leading-none" />
      <span className="sr-only">{hq}</span>
      <span aria-hidden className="tracking-tight">
        {hq}
      </span>
    </span>
  );
}

function initialsFromName(name: string): string {
  const s = name.replace(/[()]/g, " ").trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return s.slice(0, 2).toUpperCase() || "?";
}

const LOGO_PUBLIC_DIR = "/kapp/ai-tools-logos";

/** WebP 대신 Twemoji로 보안 아이콘 표시 (가명·폐쇄망 항목). */
const INTERNAL_LLM_TOOL_ID = "internal_llm_placeholder";
const INTERNAL_LLM_SECURITY_EMOJI = "🔒";

/** 로고는 WebP만 사용. JSON에 png 등으로 적혀 있어도 동일 베이스명 .webp로 정규화. */
function logoWebpSrc(logoPublicPath: string | null | undefined, toolId?: string): string | null {
  if (logoPublicPath) {
    const base = logoPublicPath.replace(/\.(webp|png|svg|jpe?g)$/i, "");
    return `${base}.webp`;
  }
  if (toolId) {
    return `${LOGO_PUBLIC_DIR}/${toolId}.webp`;
  }
  return null;
}

function ToolLogoSlot({
  displayName,
  logoPublicPath,
  toolId,
  size = "lg",
}: {
  displayName: string;
  logoPublicPath?: string | null;
  /** 없으면 `/kapp/ai-tools-logos/{toolId}.webp`만 사용 */
  toolId?: string;
  size?: "lg" | "sm";
}) {
  const src = useMemo(() => logoWebpSrc(logoPublicPath ?? null, toolId), [logoPublicPath, toolId]);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [logoPublicPath, toolId]);

  const box = size === "lg" ? "h-16 w-16 min-h-16 min-w-16" : "h-12 w-12 min-h-12 min-w-12";
  const textSize = size === "lg" ? "text-base" : "text-sm";

  if (toolId === INTERNAL_LLM_TOOL_ID) {
    const emojiSize = size === "lg" ? "2.25rem" : "1.625rem";
    return (
      <div
        className={`${box} rounded-lg bg-violet-50/90 border border-violet-200/80 flex items-center justify-center overflow-hidden shrink-0`}
        role="img"
        aria-label={`${displayName} · 보안·폐쇄망`}
      >
        <TwemojiIcon icon={INTERNAL_LLM_SECURITY_EMOJI} size={emojiSize} className="shrink-0 leading-none" />
      </div>
    );
  }

  const showImg = Boolean(src) && !imgFailed;

  return (
    <div
      className={`${box} rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center overflow-hidden shrink-0`}
    >
      {showImg && src ? (
        // eslint-disable-next-line @next/next/no-img-element -- public WebP만 사용
        <img
          key={src}
          src={src}
          alt=""
          width={size === "lg" ? 64 : 48}
          height={size === "lg" ? 64 : 48}
          className="h-full w-full object-contain p-1.5"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className={`${textSize} font-bold text-violet-700/90 tabular-nums`}>{initialsFromName(displayName)}</span>
      )}
    </div>
  );
}

const S1_OPTIONS = [
  { id: "doc", label: "문서·메일 초안" },
  { id: "code", label: "코드·SQL" },
  { id: "data", label: "데이터·분석" },
  { id: "ads", label: "광고·캠페인" },
  { id: "meeting", label: "회의·녹취 요약" },
  { id: "strategy", label: "기획·전략·기안" },
  { id: "customer", label: "고객응대·CS" },
  { id: "edu", label: "교육·연구·자료" },
];

const S2_OPTIONS = [
  { id: "hallucination", label: "환각·사실 오류" },
  { id: "evidence", label: "근거·출처·최신성 확인" },
  { id: "quality", label: "품질·톤·반복 수정" },
  { id: "prompt_design", label: "프롬프트·역할 설계" },
  { id: "integration", label: "도구·연동·환경(API·승인)" },
  { id: "policy", label: "사내 정책·승인 불명확" },
  { id: "security", label: "데이터 반출·보안" },
  { id: "cost", label: "비용·과금" },
  { id: "skill", label: "쓰는 법 자체를 모름" },
];

const S4_OPTIONS = [
  { id: "prompt", label: "프롬프트·RAG 기초" },
  { id: "rag_kb", label: "사내 데이터·지식 RAG" },
  { id: "gov", label: "거버넌스·로그" },
  { id: "approval", label: "승인·감사 프로세스" },
  { id: "agent", label: "에이전트·자동화" },
  { id: "eval", label: "모델·출력 검증" },
];

const S5_OPTIONS = [
  { id: "guide", label: "가이드라인" },
  { id: "sandbox", label: "샌드박스" },
  { id: "training", label: "사내 교육" },
  { id: "budget", label: "외부 과정 예산" },
];

const SURVEY_STEP_COUNT = 4;
const SURVEY_FREE_TEXT_MAX = 200;

type TrendConcept = (typeof aiTrendConcepts.concepts)[number];

/** AI 트렌드 이해도: 10문항만 사용 (JSON 전체 중 선별 순서) */
const TREND_QUIZ_IDS_ORDER = [
  "hallucination",
  "llm_engineering",
  "rag",
  "prompt_engineering",
  "multimodal_ai",
  "ai_agent",
  "context_engineering",
  "fine_tuning",
  "reasoning_model",
  "model_context_protocol",
] as const;

const TREND_LIKERT_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "전혀 모른다" },
  { value: 2, label: "들어본 적 있다" },
  { value: 3, label: "개념은 이해한다" },
  { value: 4, label: "일부 활용할 줄 안다" },
  { value: 5, label: "능숙하게 활용 가능하다" },
];

type Props = {
  value: AiExplorationPayload;
  onChange: (next: AiExplorationPayload) => void;
  onRequestResult: () => void;
};

export default function AiExplorationFlow({ value, onChange, onRequestResult }: Props) {
  /** 상세 모달에 표시할 도구 id */
  const [modalToolId, setModalToolId] = useState<string | null>(null);
  /** 설문: 0=S1 … 3=S5, 한 화면에 한 질문 */
  const [surveyStep, setSurveyStep] = useState(0);
  /** 트렌드 문항 전환: 다음(답 선택)=오른쪽에서 슬라이드 인, 이전 문항=왼쪽에서 슬라이드 인 */
  const [trendSlideDir, setTrendSlideDir] = useState<"next" | "prev">("next");

  const catalog = aiToolsCatalog as { version: string; tools: CatalogTool[] };

  const toolById = useMemo(() => {
    const m: Record<string, CatalogTool> = {};
    catalog.tools.forEach((t) => {
      m[t.toolId] = t;
    });
    return m;
  }, [catalog.tools]);

  const modalTool = useMemo(
    () => (modalToolId ? (toolById[modalToolId] ?? null) : null),
    [modalToolId, toolById]
  );

  useEffect(() => {
    if (!modalToolId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalToolId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalToolId]);

  useEffect(() => {
    if (!modalToolId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalToolId]);

  const trendConceptById = useMemo(() => {
    const m: Record<string, TrendConcept> = {};
    (aiTrendConcepts.concepts as TrendConcept[]).forEach((c) => {
      m[c.id] = c;
    });
    return m;
  }, []);

  const trendConcepts = useMemo(
    () =>
      TREND_QUIZ_IDS_ORDER.map((id) => trendConceptById[id]).filter(
        (c): c is TrendConcept => c != null
      ),
    [trendConceptById]
  );
  const trendTotal = trendConcepts.length;
  const trendIdx = trendTotal === 0 ? 0 : Math.min(Math.max(0, value.trendStepIndex), trendTotal - 1);
  const currentTrend = trendConcepts[trendIdx];

  const surveyCanProceed = useMemo(() => {
    if (value.phase !== "survey") return true;
    switch (surveyStep) {
      case 0:
        return value.s1Frequency.length >= 1;
      case 1:
        return value.s2Pain.length >= 1;
      case 2:
        return value.s4Learning.length >= 1;
      case 3:
        return value.s5OrgSupport !== null;
      default:
        return false;
    }
  }, [
    value.phase,
    surveyStep,
    value.s1Frequency,
    value.s2Pain,
    value.s4Learning,
    value.s5OrgSupport,
  ]);

  const explorationPoints = value.cardsOpened.length;

  const patch = useCallback(
    (partial: Partial<AiExplorationPayload>) => {
      onChange({ ...value, ...partial });
    },
    [onChange, value]
  );

  /** 선택 순서 유지: 끄면 제거만, 켜면 맨 뒤에 추가 */
  const toggleToolUsed = (toolId: string) => {
    const cur = value.toolsUsed;
    if (cur.includes(toolId)) {
      patch({ toolsUsed: cur.filter((id) => id !== toolId) });
    } else {
      patch({ toolsUsed: [...cur, toolId] });
    }
  };

  const removeFromInventory = (toolId: string) => {
    patch({ toolsUsed: value.toolsUsed.filter((id) => id !== toolId) });
  };

  const openCard = (toolId: string) => {
    if (!value.cardsOpened.includes(toolId)) {
      patch({ cardsOpened: [...value.cardsOpened, toolId] });
    }
  };

  const toggleMulti = (field: "s1Frequency" | "s2Pain" | "s4Learning", id: string, max?: number) => {
    const arr = value[field];
    const set = new Set(arr);
    if (set.has(id)) set.delete(id);
    else {
      if (max && set.size >= max) return;
      set.add(id);
    }
    patch({ [field]: [...set] } as Partial<AiExplorationPayload>);
  };

  /** 선택 즉시 다음 문항(마지막이면 설문 단계)으로 이동 */
  const selectTrendAndAdvance = (conceptId: string, score: number) => {
    setTrendSlideDir("next");
    const nextResponses = { ...value.trendResponses, [conceptId]: score };
    const isLast = trendIdx >= trendTotal - 1;
    if (isLast) {
      setSurveyStep(0);
      patch({
        trendResponses: nextResponses,
        phase: "survey",
      });
    } else {
      patch({
        trendResponses: nextResponses,
        trendStepIndex: trendIdx + 1,
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-[1200px] mx-auto mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              value.phase === "catalog" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            ① 도구 탐색
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" aria-hidden />
          <span
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              value.phase === "trend" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            ② AI 트렌드 이해도
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" aria-hidden />
          <span
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              value.phase === "survey" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            ③ AI 활용도 설문
          </span>
          <span className="ml-auto text-gray-500">탐색 {explorationPoints}장</span>
        </div>

        {value.phase === "catalog" && (
          <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            <div className="flex-1 min-w-0 space-y-6 order-1">
              <header className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
                      어떤 AI들이 있는지, 같이 둘러볼까요?
                    </h2>
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                      카드를 눌러 설명을 읽다 보면 &quot;아, 이런 AI도 있구나&quot;, &quot;이건 이런 일에
                      쓰이는구나&quot;가 하나씩 잡혀요. 그러다 &quot;우리 업무에도 이런 걸 써 볼 수
                      있겠다&quot; 같은 생각이 드는지도 천천히 확인해 보세요.
                    </p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      회사·개인 어디서 쓰는지는 가리지 않아요.{" "}
                      <span className="font-medium text-gray-700">지금 쓰는 AI</span>가 있으면 모달에서
                      &quot;지금 쓰고 있어요&quot;를 눌러 오른쪽 목록에 넣으면 됩니다. 구경만 하셔도 괜찮아요.
                    </p>
                  </div>
                </div>
              </header>

              {/* 분류 허브와 동일: 그리드 + 컴팩트 카드(로고·제목·하단 한 줄). 상세는 모달 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {catalog.tools.map((tool, idx) => {
                  const used = value.toolsUsed.includes(tool.toolId);
                  return (
                    <button
                      key={tool.toolId}
                      type="button"
                      aria-label={`${tool.displayName} 상세 보기`}
                      onClick={() => {
                        openCard(tool.toolId);
                        setModalToolId(tool.toolId);
                      }}
                      className={`ai-tool-card-enter relative flex flex-col items-start gap-2 rounded-xl border bg-white p-4 text-left shadow-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${
                        used
                          ? "border-violet-400 ring-2 ring-violet-200 shadow-md scale-[1.01]"
                          : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-md hover:scale-[1.02]"
                      }`}
                      style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}
                    >
                      <span className="absolute top-3 right-3 z-[1] max-w-[calc(100%-4rem)] flex justify-end">
                        <CountryLabel countryCode={tool.hqCountryCode} compact />
                      </span>

                      <ToolLogoSlot
                        displayName={tool.displayName}
                        logoPublicPath={tool.logoPublicPath}
                        toolId={tool.toolId}
                        size="sm"
                      />

                      <span className="text-sm font-semibold text-gray-900 leading-tight pr-14 line-clamp-3">
                        {tool.displayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-2 order-2 space-y-3">
              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-violet-900 mb-1">내가 쓰는 AI</h3>
                <p className="text-xs text-violet-800/80 mb-3 leading-relaxed">
                  실제로 쓰는 도구만 여기 모아 두면 돼요. 위에서부터 고른 순서예요. 카드 → 모달 →
                  &quot;지금 쓰고 있어요&quot;로 넣을 수 있어요.
                </p>
                <div className="max-h-[min(60vh,420px)] overflow-y-auto space-y-2 pr-1">
                  {value.toolsUsed.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center rounded-lg border border-dashed border-gray-200 bg-white/80 leading-relaxed px-2">
                      아직 없어요. 마음에 드는 카드를 열고 &quot;지금 쓰고 있어요&quot;를 눌러 보세요.
                    </p>
                  ) : (
                    value.toolsUsed.map((tid, i) => {
                      const t = toolById[tid];
                      if (!t) return null;
                      return (
                        <div
                          key={`${tid}-${i}`}
                          className="ai-explore-inventory-enter group relative flex items-center gap-2 rounded-lg border border-violet-200 bg-white p-2.5 pr-8 shadow-sm"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <ToolLogoSlot displayName={t.displayName} logoPublicPath={t.logoPublicPath} toolId={tid} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 truncate">{t.displayName}</p>
                            <div className="mt-1">
                              <CountryLabel countryCode={t.hqCountryCode} compact />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromInventory(tid)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            aria-label={`${t.displayName} 선택 해제`}
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}

        {value.phase === "trend" && currentTrend && (
          <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-2 min-h-0 w-full">
            <header className="shrink-0">
              <p className="text-xs font-medium text-violet-600 mb-2">
                문항 {trendIdx + 1} / {trendTotal}
              </p>
              <h2 className="text-lg font-bold text-gray-900">AI 트렌드 이해도 측정</h2>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                개념을 하나씩만 살펴보고, 가장 가까운 항목을 고르면 바로 다음 문항으로 넘어가요.
              </p>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: trendTotal }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= trendIdx ? "bg-violet-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </header>

            <div className="overflow-hidden min-h-0">
              <div
                key={`trend-q-${trendIdx}-${currentTrend.id}`}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start min-h-0 ${
                  trendSlideDir === "prev" ? "trend-question-slide-prev" : "trend-question-slide-next"
                }`}
              >
              {/* 좌: 개념 카드 + 실무 예시 */}
              <div className="flex flex-col gap-5 min-w-0">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                  <div>
                    <p className="text-xs font-medium text-violet-700 mb-1">{currentTrend.nameEn}</p>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{currentTrend.nameKo}</h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {renderTrendTextWithBold(currentTrend.description, "font-semibold text-gray-900")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 font-medium text-violet-900 border border-violet-100">
                      최초 등장 {currentTrend.firstAppeared}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 font-medium text-gray-800 border border-gray-100">
                      {currentTrend.category}
                    </span>
                  </div>
                </div>

                {currentTrend.workplaceExample ? (
                  <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-violet-900 mb-2">실무 예시</p>
                    <p className="text-sm text-violet-950/90 leading-relaxed">
                      {renderTrendTextWithBold(currentTrend.workplaceExample, "font-semibold text-violet-950")}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* 우: 질문 + 객관식 */}
              <div className="flex flex-col gap-4 min-w-0 border-t border-gray-100 pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:border-gray-100 lg:pl-10 xl:pl-14">
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">이 개념에 대해 어느 쪽에 가깝나요?</p>
                  <p className="text-xs text-gray-500 mt-1.5">항목을 누르면 곧바로 다음 문항으로 이동합니다.</p>
                </div>
                <div className="grid gap-2.5">
                  {TREND_LIKERT_OPTIONS.map((opt) => {
                    const cid = currentTrend.id;
                    const sel = value.trendResponses[cid];
                    const active = sel === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => selectTrendAndAdvance(cid, opt.value)}
                        className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all duration-200 ${
                          active
                            ? "border-violet-500 bg-violet-50 text-violet-950 shadow-sm"
                            : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-semibold text-violet-700 mr-2 tabular-nums">{opt.value}</span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {value.phase === "survey" && (
          <div className="max-w-[560px] mx-auto space-y-6 pb-4">
            <header>
              <p className="text-xs font-medium text-violet-600 mb-2">
                질문 {surveyStep + 1} / {SURVEY_STEP_COUNT}
              </p>
              <h2 className="text-lg font-bold text-gray-900">AI 활용도 설문</h2>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                아까 탐색한 도구를 떠올리며 답해 주세요.{" "}
                <span className="font-medium text-gray-700">최근 실제 업무에서 쓰신 경험</span>을 기준으로 하면
                좋아요. 한 화면에 질문 하나씩입니다.
              </p>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: SURVEY_STEP_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= surveyStep ? "bg-violet-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </header>

            {surveyStep === 0 && (
              <section className="transition-opacity duration-200">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  요즘 업무에서 AI를 가장 자주 쓰는 용도는 무엇인가요?
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  복수 선택 가능합니다. 해당되는 것을 모두 골라 주세요.
                </p>
                <div className="flex flex-wrap gap-2">
                  {S1_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("s1Frequency", o.id)}
                      className={`rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 ${
                        value.s1Frequency.includes(o.id)
                          ? "border-violet-500 bg-violet-50 text-violet-900 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {value.s1Frequency.length === 0 ? (
                  <p className="text-xs text-amber-800 mt-3">한 가지 이상 선택하면 다음으로 넘어갈 수 있어요.</p>
                ) : null}
              </section>
            )}

            {surveyStep === 1 && (
              <section className="transition-opacity duration-200">
                <h3 className="text-base font-semibold text-gray-900 mb-1">그때 가장 잘 막히거나 불안한 지점은 무엇인가요?</h3>
                <p className="text-xs text-gray-500 mb-4">
                  품질·정책·환경 등 여러 개가 겹칠 수 있어요. 해당하는 만큼 골라 주세요.
                </p>
                <div className="flex flex-wrap gap-2">
                  {S2_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("s2Pain", o.id)}
                      className={`rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 ${
                        value.s2Pain.includes(o.id)
                          ? "border-violet-500 bg-violet-50 text-violet-900 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {value.s2Pain.length === 0 ? (
                  <p className="text-xs text-amber-800 mt-3">한 가지 이상 선택하면 다음으로 넘어갈 수 있어요.</p>
                ) : null}
              </section>
            )}

            {surveyStep === 2 && (
              <section className="transition-opacity duration-200">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  막힌 부분을 줄이려면, 3개월 안에 무엇을 배우고 싶으신가요?
                </h3>
                <p className="text-xs text-gray-500 mb-4">우선순위가 높은 것 최대 2개까지 골라 주세요.</p>
                <div className="flex flex-wrap gap-2">
                  {S4_OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => toggleMulti("s4Learning", o.id, 2)}
                      className={`rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 ${
                        value.s4Learning.includes(o.id)
                          ? "border-violet-500 bg-violet-50 text-violet-900 shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                {value.s4Learning.length === 0 ? (
                  <p className="text-xs text-amber-800 mt-3">한 가지 이상 선택하면 다음으로 넘어갈 수 있어요.</p>
                ) : null}
              </section>
            )}

            {surveyStep === 3 && (
              <section className="transition-opacity duration-200 space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    조직에서 지원해 주면 가장 도움이 되는 것은 무엇인가요?
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    지금 당장 시급한 한 가지만 골라 주세요.
                  </p>
                  <div className="space-y-2">
                    {S5_OPTIONS.map((o) => (
                      <label
                        key={o.id}
                        className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                          value.s5OrgSupport === o.id
                            ? "border-violet-500 bg-violet-50 shadow-sm"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="s5"
                          checked={value.s5OrgSupport === o.id}
                          onChange={() => patch({ s5OrgSupport: o.id })}
                          className="text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm text-gray-800">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  {value.s5OrgSupport === null ? (
                    <p className="text-xs text-amber-800 mt-3">한 가지를 선택하면 다음으로 넘어갈 수 있어요.</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="survey-free-text" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    추가로 남기고 싶은 말이 있나요? <span className="font-normal text-gray-500">(선택)</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    더 자세히 질문해 주었으면 하는 점이나, 막히는 상황을 적어 주셔도 돼요.
                  </p>
                  <textarea
                    id="survey-free-text"
                    rows={3}
                    maxLength={SURVEY_FREE_TEXT_MAX}
                    value={value.surveyFreeText ?? ""}
                    onChange={(e) => {
                      const t = e.target.value.slice(0, SURVEY_FREE_TEXT_MAX);
                      patch({ surveyFreeText: t });
                    }}
                    placeholder="예: 사내 승인 절차를 설문에 더 물어봤으면 좋겠어요."
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-y min-h-[88px]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5 tabular-nums">
                    {(value.surveyFreeText ?? "").length} / {SURVEY_FREE_TEXT_MAX}
                  </p>
                </div>
              </section>
            )}
          </div>
        )}

      </div>

      {typeof window !== "undefined" &&
        modalTool &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-tool-modal-title"
          >
            <button
              type="button"
              className="absolute inset-0 z-0 bg-black/45 cursor-default"
              aria-label="닫기"
              onClick={() => setModalToolId(null)}
            />
            <div
              className="relative z-10 flex h-[min(94dvh,calc(100dvh-1rem))] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/15"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <ToolLogoSlot
                    displayName={modalTool.displayName}
                    logoPublicPath={modalTool.logoPublicPath}
                    toolId={modalTool.toolId}
                    size="lg"
                  />
                      <div className="min-w-0">
                        <h3 id="ai-tool-modal-title" className="text-lg font-bold text-gray-900 leading-snug">
                          {modalTool.displayName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{modalTool.vendor}</p>
                      </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalToolId(null)}
                  className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="모달 닫기"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 space-y-6 sm:space-y-8">
                <div>
                  <CountryLabel countryCode={modalTool.hqCountryCode} />
                </div>

                <section className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">소개</h4>
                  <div className="space-y-3 text-base text-gray-800 leading-relaxed">
                    {modalTool.cardLines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </section>

                {modalTool.focusStrengths ? (
                  <section className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900">특화·강점</h4>
                    <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">
                      {modalTool.focusStrengths}
                    </p>
                  </section>
                ) : null}

                {modalTool.glossaryCards && modalTool.glossaryCards.length > 0 ? (
                  <section className="space-y-3">
                    <h4 className={AI_TOOL_MODAL_EDU_VIOLET.heading}>용어설명</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {modalTool.glossaryCards.map((card, gi) => (
                        <div key={gi} className={AI_TOOL_MODAL_EDU_VIOLET.surfaceCard}>
                          <h5 className={AI_TOOL_MODAL_EDU_VIOLET.cardTitle}>{card.title}</h5>
                          <div className={`mt-2 space-y-2 ${AI_TOOL_MODAL_EDU_VIOLET.bodySm}`}>
                            {card.lines.map((line, li) => (
                              <p key={li}>{line}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {modalTool.coachTip ? (
                  <section className={`space-y-2 ${AI_TOOL_MODAL_EDU_VIOLET.surfaceBlock}`}>
                    <h4 className={AI_TOOL_MODAL_EDU_VIOLET.heading}>활용 팁</h4>
                    <p className={AI_TOOL_MODAL_EDU_VIOLET.bodyBase}>{modalTool.coachTip}</p>
                  </section>
                ) : null}

                {modalTool.githubRepo ? (
                  <a
                    href={modalTool.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex text-sm font-medium text-violet-700 hover:underline"
                  >
                    GitHub 저장소 열기
                  </a>
                ) : null}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={value.toolsUsed.includes(modalTool.toolId)}
                    onClick={() => {
                      openCard(modalTool.toolId);
                      toggleToolUsed(modalTool.toolId);
                    }}
                    className={`inline-flex min-h-[48px] min-w-[220px] items-center justify-center gap-2 rounded-xl border-2 px-5 py-3 text-base font-semibold transition-all duration-200 ${
                      value.toolsUsed.includes(modalTool.toolId)
                        ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                        : "border-gray-200 bg-white text-gray-800 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md border-2 ${
                        value.toolsUsed.includes(modalTool.toolId)
                          ? "border-white bg-white/20"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {value.toolsUsed.includes(modalTool.toolId) && (
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      )}
                    </span>
                    지금 쓰고 있어요
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalToolId(null)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <div className="flex-shrink-0 border-t border-gray-100 bg-white/95 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {value.phase === "catalog" && (
          <>
            <p className="text-xs text-gray-500 max-w-lg leading-relaxed">
              카드를 열어볼 때마다 탐색 기록이 쌓여요. 충분히 둘러보셨다면 다음으로 넘어가 주세요.
            </p>
            <button
              type="button"
              onClick={() => {
                setTrendSlideDir("next");
                setSurveyStep(0);
                setModalToolId(null);
                patch({ phase: "trend", trendStepIndex: 0 });
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 transition-colors"
            >
              다음: AI 트렌드 이해도
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {value.phase === "trend" && currentTrend && (
          <button
            type="button"
            onClick={() => {
              if (trendIdx <= 0) {
                patch({ phase: "catalog" });
              } else {
                setTrendSlideDir("prev");
                patch({ trendStepIndex: trendIdx - 1 });
              }
            }}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            {trendIdx <= 0 ? "이전 단계" : "이전 문항"}
          </button>
        )}

        {value.phase === "survey" && (
          <>
            <button
              type="button"
              onClick={() => {
                if (surveyStep <= 0) {
                  setTrendSlideDir("prev");
                  patch({ phase: "trend", trendStepIndex: Math.max(0, trendTotal - 1) });
                } else {
                  setSurveyStep((s) => s - 1);
                }
              }}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
            {surveyStep < SURVEY_STEP_COUNT - 1 ? (
              <button
                type="button"
                disabled={!surveyCanProceed}
                onClick={() => setSurveyStep((s) => Math.min(s + 1, SURVEY_STEP_COUNT - 1))}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 ml-auto transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                다음 질문
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={!surveyCanProceed}
                onClick={onRequestResult}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 ml-auto transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                분석하고 결과 보기
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
