"use client";

import { useMemo, useState, useCallback, useEffect, type ComponentType, type ReactNode } from "react";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Code,
  Search,
  Pen,
  Mic,
  Presentation,
  Target,
  BarChart3,
  Bot,
  Lock,
  Github,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import TwemojiIcon from "@/components/common/TwemojiIcon";
import { countryCodeToFlagEmoji } from "@/lib/countryFlagEmoji";
import aiToolsCatalog from "@/data/kappDiagnosis/aiToolsCatalog.json";
import aiExplorationScenarios from "@/data/kappDiagnosis/aiExplorationScenarios.json";
import aiTrendConcepts from "@/data/kappDiagnosis/aiTrendConcepts.json";

/** 카드에 `참고용` 배지가 붙는 경우의 의미(데이터 기준 + UI 툴팁). */
const REFERENCE_ONLY_TITLE =
  "우리가 바로 쓰거나 사서 도입하는 목록이 아니라, ‘세상에 이런 사례가 있다’ 정도로 보는 항목이에요. 특정 나라·앱 전용이거나, 규칙·개인정보 때문에 조심해야 하거나, 회사용 정식 제품이 아닌 참고 예시일 수 있습니다.";

/** `사내 서버·전용` 분류 클릭 시 바로 목록에 넣는 카탈로그 도구 ID */
const INTERNAL_ONPREM_TOOL_ID = "internal_llm_placeholder";

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

export type AiExplorationPhase = "catalog" | "trend" | "survey" | "scenario";

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
  scenarioChoice: number | null;
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
    scenarioChoice: null,
    cardsOpened: [],
  };
}

type CatalogTool = (typeof aiToolsCatalog.tools)[number] & {
  logoPublicPath?: string | null;
  /** 오픈소스 항목 등, 공개 저장소 링크(선택). */
  githubRepo?: string;
};
type CatalogCategory = (typeof aiToolsCatalog.categories)[number];

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  chat: MessageCircle,
  code: Code,
  search: Search,
  pen: Pen,
  mic: Mic,
  presentation: Presentation,
  target: Target,
  chart: BarChart3,
  bot: Bot,
  lock: Lock,
  opensource: Github,
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

const INDUSTRY_KEYS = ["IT", "금융", "의료", "마케팅/광고", "기타"] as const;

function resolveIndustryKey(industry: string): string {
  return INDUSTRY_KEYS.includes(industry as (typeof INDUSTRY_KEYS)[number]) ? industry : "기타";
}

function initialsFromName(name: string): string {
  const s = name.replace(/[()]/g, " ").trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
  return s.slice(0, 2).toUpperCase() || "?";
}

const LOGO_PUBLIC_DIR = "/kapp/ai-tools-logos";
const LOGO_FALLBACK_EXTS = ["webp", "png", "svg", "jpg", "jpeg"] as const;

/** JSON 경로 + 동일 베이스명의 webp/png 등 후보. logoPublicPath가 없으면 toolId 기준 자동 후보. */
function logoSrcCandidates(logoPublicPath: string | null | undefined, toolId?: string): string[] {
  const seen = new Set<string>();
  const add = (u: string) => {
    if (u) seen.add(u);
  };
  if (logoPublicPath) {
    add(logoPublicPath);
    const base = logoPublicPath.replace(/\.(webp|png|svg|jpe?g)$/i, "");
    for (const ext of LOGO_FALLBACK_EXTS) {
      add(`${base}.${ext}`);
    }
  } else if (toolId) {
    for (const ext of LOGO_FALLBACK_EXTS) {
      add(`${LOGO_PUBLIC_DIR}/${toolId}.${ext}`);
    }
  }
  return [...seen];
}

function ToolLogoSlot({
  displayName,
  logoPublicPath,
  toolId,
  size = "lg",
}: {
  displayName: string;
  logoPublicPath?: string | null;
  /** 없으면 logoPublicPath가 null일 때 `toolId.webp` 등만 시도 */
  toolId?: string;
  size?: "lg" | "sm";
}) {
  const candidates = useMemo(
    () => logoSrcCandidates(logoPublicPath ?? null, toolId),
    [logoPublicPath, toolId]
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAttempt(0);
  }, [logoPublicPath, toolId]);

  const box = size === "lg" ? "h-12 w-12 min-h-12 min-w-12" : "h-9 w-9 min-h-9 min-w-9";
  const textSize = size === "lg" ? "text-sm" : "text-xs";

  const src = candidates[attempt];
  const showImg = attempt < candidates.length && Boolean(src);

  return (
    <div
      className={`${box} rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center overflow-hidden shrink-0`}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- 로컬 public 경로(webp·png 등), 실패 시 후보 순회
        <img
          key={src}
          src={src}
          alt=""
          width={size === "lg" ? 48 : 36}
          height={size === "lg" ? 48 : 36}
          className="h-full w-full object-contain p-1"
          onError={() => setAttempt((a) => a + 1)}
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

const TREND_LIKERT_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "전혀 모른다" },
  { value: 2, label: "들어본 적 있다" },
  { value: 3, label: "개념은 이해한다" },
  { value: 4, label: "일부 활용할 줄 안다" },
  { value: 5, label: "능숙하게 활용 가능하다" },
];

type Props = {
  industry: string;
  value: AiExplorationPayload;
  onChange: (next: AiExplorationPayload) => void;
  onRequestResult: () => void;
};

export default function AiExplorationFlow({ industry, value, onChange, onRequestResult }: Props) {
  const [hubView, setHubView] = useState<"hub" | "list">("hub");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [flipToolId, setFlipToolId] = useState<string | null>(null);
  /** 설문: 0=S1 … 3=S5, 한 화면에 한 질문 */
  const [surveyStep, setSurveyStep] = useState(0);

  const catalog = aiToolsCatalog as { version: string; categories: CatalogCategory[]; tools: CatalogTool[] };
  const scenarios = aiExplorationScenarios as {
    byIndustry: Record<
      string,
      {
        id: string;
        industry: string;
        title: string;
        situation: string;
        options: { id: string; label: string }[];
        referenceNote?: string;
      }
    >;
  };

  const industryKey = resolveIndustryKey(industry);
  const scenario = scenarios.byIndustry[industryKey] ?? scenarios.byIndustry["기타"];

  const categoriesSorted = useMemo(
    () => [...catalog.categories].sort((a, b) => a.order - b.order),
    [catalog.categories]
  );

  const countByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    catalog.categories.forEach((c) => {
      m[c.id] = catalog.tools.filter((t) => t.primaryCategory === c.id).length;
    });
    return m;
  }, [catalog.categories, catalog.tools]);

  const filteredTools = useMemo(() => {
    if (!activeCategoryId) return [];
    return catalog.tools.filter((t) => t.primaryCategory === activeCategoryId);
  }, [catalog.tools, activeCategoryId]);

  const toolById = useMemo(() => {
    const m: Record<string, CatalogTool> = {};
    catalog.tools.forEach((t) => {
      m[t.toolId] = t;
    });
    return m;
  }, [catalog.tools]);

  const trendConcepts = useMemo(() => aiTrendConcepts.concepts as TrendConcept[], []);
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
  const uniqueCategoriesVisited = useMemo(() => {
    const set = new Set<string>();
    value.cardsOpened.forEach((tid) => {
      const t = catalog.tools.find((x) => x.toolId === tid);
      if (t) set.add(t.primaryCategory);
    });
    return set.size;
  }, [value.cardsOpened, catalog.tools]);

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

  const setPhase = (phase: AiExplorationPhase) => patch({ phase });

  const setTrendScore = (conceptId: string, score: number) => {
    patch({
      trendResponses: { ...value.trendResponses, [conceptId]: score },
    });
  };

  const deploymentLabel = (d: string) => {
    if (d === "cloud") return "클라우드";
    if (d === "on_prem") return "온프레미스";
    if (d === "hybrid") return "하이브리드";
    return d;
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
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" aria-hidden />
          <span
            className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
              value.phase === "scenario" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            ④ 상황 판단
          </span>
          <span className="ml-auto text-gray-500">
            탐색 {explorationPoints}장 · 분류 {uniqueCategoriesVisited}개
          </span>
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
                      내가 쓰는 AI를 골라 볼까요?
                    </h2>
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                      회사에서만 쓰는지, 사이드 프로젝트인지, 개인으로 쓰는지는 가리지 않아요.{" "}
                      <span className="font-medium text-gray-800">지금 실제로 쓰는 AI</span>라면 골라 주시면
                      돼요.
                    </p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      아래 분류를 눌러 보면 비슷한 도구들이 모여 있어요. 이름만 알고 지나가도 되고, 카드를
                      펼쳐 보면서 가볍게 탐색해 보세요.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-xs text-gray-600 leading-relaxed">
                  보안 때문에 <span className="font-medium text-gray-800">사내 전용 AI만</span> 쓰는
                  경우에는{" "}
                  <span className="font-medium text-violet-800">「사내 서버·전용」</span> 분류만 눌러도 돼요.
                  그러면 대표 항목이 <span className="font-medium">내가 쓰는 AI</span> 목록에 바로
                  담깁니다. (다른 분류는 카드에서 &quot;지금 쓰고 있어요&quot;를 눌러 주세요.)
                </div>
              </header>

              {hubView === "hub" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categoriesSorted.map((cat) => {
                    const Icon = ICON_MAP[cat.icon] ?? MessageCircle;
                    const n = countByCategory[cat.id] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          if (cat.id === "onprem") {
                            if (!value.toolsUsed.includes(INTERNAL_ONPREM_TOOL_ID)) {
                              patch({ toolsUsed: [...value.toolsUsed, INTERNAL_ONPREM_TOOL_ID] });
                            }
                            openCard(INTERNAL_ONPREM_TOOL_ID);
                            setActiveCategoryId("onprem");
                            setHubView("list");
                            setFlipToolId(null);
                            return;
                          }
                          setActiveCategoryId(cat.id);
                          setHubView("list");
                        }}
                        className="flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                      >
                        <Icon className="h-6 w-6 text-violet-600" aria-hidden />
                        <span className="text-sm font-semibold text-gray-900 leading-tight">{cat.labelKo}</span>
                        <span className="text-xs text-gray-500">{n}개 도구</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      setHubView("hub");
                      setActiveCategoryId(null);
                      setFlipToolId(null);
                    }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:text-violet-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    분류 목록으로
                  </button>
                  <h3 className="text-base font-semibold text-gray-800">
                    {categoriesSorted.find((c) => c.id === activeCategoryId)?.labelKo}
                  </h3>
                  <ul className="space-y-4">
                    {filteredTools.map((tool, idx) => {
                      const flipped = flipToolId === tool.toolId;
                      const hq = HQ_LABEL[tool.hqCountryCode] ?? tool.hqCountryCode;
                      const flagEmoji = countryCodeToFlagEmoji(tool.hqCountryCode);
                      const used = value.toolsUsed.includes(tool.toolId);
                      return (
                        <li
                          key={tool.toolId}
                          className={`ai-tool-card-enter rounded-xl border bg-white shadow-sm overflow-hidden transition-shadow duration-200 ${
                            used ? "border-violet-400 ring-2 ring-violet-200 shadow-md" : "border-gray-200 hover:shadow-md"
                          }`}
                          style={{ animationDelay: `${Math.min(idx, 8) * 45}ms` }}
                        >
                          <div className="p-4">
                            <div className="flex gap-3 mb-3">
                              <ToolLogoSlot
                                displayName={tool.displayName}
                                logoPublicPath={tool.logoPublicPath}
                                toolId={tool.toolId}
                                size="lg"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-gray-900">{tool.displayName}</span>
                                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                    <TwemojiIcon icon={flagEmoji} size="1.125rem" className="leading-none" />
                                    <span className="sr-only">{hq}</span>
                                    <span aria-hidden className="tracking-tight">
                                      {hq}
                                    </span>
                                  </span>
                                  {tool.isReferenceOnly && (
                                    <span
                                      className="cursor-help border-b border-dotted border-amber-600/70 text-[10px] font-medium text-amber-900"
                                      title={REFERENCE_ONLY_TITLE}
                                    >
                                      참고용
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{tool.vendor}</p>
                                {tool.githubRepo ? (
                                  <a
                                    href={tool.githubRepo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                                  >
                                    GitHub 저장소
                                  </a>
                                ) : null}
                              </div>
                              <span className="text-[10px] rounded border border-gray-200 px-2 py-0.5 text-gray-600 self-start shrink-0">
                                {deploymentLabel(tool.deployment)}
                              </span>
                            </div>

                            {!flipped ? (
                              <div className="space-y-2">
                                {tool.cardLines.map((line, i) => (
                                  <p key={i} className="text-sm text-gray-700 leading-relaxed">
                                    {line}
                                  </p>
                                ))}
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      openCard(tool.toolId);
                                      setFlipToolId(tool.toolId);
                                    }}
                                    className="text-xs font-medium text-violet-700 hover:underline transition-colors"
                                  >
                                    팁·유의사항 보기
                                  </button>
                                  <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={used}
                                    onClick={() => {
                                      openCard(tool.toolId);
                                      toggleToolUsed(tool.toolId);
                                    }}
                                    className={`ml-auto w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                      used
                                        ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/25 scale-[1.01]"
                                        : "border-gray-200 bg-white text-gray-800 hover:border-violet-300 hover:bg-violet-50/50"
                                    }`}
                                  >
                                    <span
                                      className={`flex h-6 w-6 items-center justify-center rounded-md border-2 ${
                                        used ? "border-white bg-white/20" : "border-gray-300 bg-white"
                                      }`}
                                    >
                                      {used && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                                    </span>
                                    지금 쓰고 있어요
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-violet-50/80 border border-violet-100 p-3 space-y-2 transition-all duration-200">
                                <p className="text-xs font-semibold text-violet-900">코치 팁</p>
                                <p className="text-sm text-violet-950">{tool.coachTip}</p>
                                <p className="text-xs font-semibold text-gray-700 pt-1">흔한 실수</p>
                                <p className="text-sm text-gray-700">{tool.commonPitfall}</p>
                                <button
                                  type="button"
                                  onClick={() => setFlipToolId(null)}
                                  className="inline-flex items-center gap-1 text-xs font-medium text-violet-800 mt-1 hover:underline"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  앞면으로
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-2 order-2 space-y-3">
              <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 shadow-sm">
                <h3 className="text-sm font-bold text-violet-900 mb-1">내가 쓰는 AI</h3>
                <p className="text-xs text-violet-800/80 mb-3 leading-relaxed">
                  골라 둔 도구가 여기 모여요. 위에서부터 고른 순서예요. 사내 전용만 쓰시면 왼쪽에서
                  「사내 서버·전용」만 눌러도 이 목록에 담겨요.
                </p>
                <div className="max-h-[min(60vh,420px)] overflow-y-auto space-y-2 pr-1">
                  {value.toolsUsed.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center rounded-lg border border-dashed border-gray-200 bg-white/80">
                      아직 선택한 도구가 없습니다. 카드에서 &quot;지금 쓰고 있어요&quot;를 눌러 보세요.
                    </p>
                  ) : (
                    value.toolsUsed.map((tid, i) => {
                      const t = toolById[tid];
                      if (!t) return null;
                      const flagEmoji = countryCodeToFlagEmoji(t.hqCountryCode);
                      return (
                        <div
                          key={`${tid}-${i}`}
                          className="ai-explore-inventory-enter group relative flex items-center gap-2 rounded-lg border border-violet-200 bg-white p-2.5 pr-8 shadow-sm"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <ToolLogoSlot displayName={t.displayName} logoPublicPath={t.logoPublicPath} toolId={tid} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-900 truncate">{t.displayName}</p>
                            <span className="mt-0.5 inline-flex max-w-full items-center gap-1 text-[11px] font-medium text-gray-800">
                              <TwemojiIcon icon={flagEmoji} size="0.875rem" className="shrink-0 leading-none" />
                              <span className="truncate">{HQ_LABEL[t.hqCountryCode] ?? t.hqCountryCode}</span>
                            </span>
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
                개념을 하나씩만 살펴보고, 지금 나의 이해도에 가장 가까운 항목을 골라 주세요.
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start min-h-0">
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
                  <p className="text-xs text-gray-500 mt-1.5">아래 번호 중 하나를 선택해 주세요.</p>
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
                        onClick={() => setTrendScore(cid, opt.value)}
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

        {value.phase === "scenario" && (
          <div className="max-w-[900px] mx-auto space-y-6">
            <header>
              <h2 className="text-lg font-bold text-gray-900">상황 판단 · {scenario.industry}</h2>
              <p className="text-sm text-gray-500">입력하신 산업({industryKey})에 맞춘 짧은 시나리오입니다.</p>
            </header>
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/90 to-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
              <h3 className="text-base font-semibold text-gray-900 mb-3">{scenario.title}</h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{scenario.situation}</p>
            </div>
            <div className="space-y-3">
              {scenario.options.map((opt, idx) => {
                const selected = value.scenarioChoice === idx;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      patch({ scenarioChoice: idx });
                    }}
                    className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                      selected
                        ? "border-violet-500 bg-violet-50 shadow-md scale-[1.01]"
                        : "border-gray-200 hover:border-violet-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900 leading-snug">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            {value.scenarioChoice !== null && scenario.referenceNote && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-950">
                <span className="font-semibold">참고: </span>
                {scenario.referenceNote}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 border-t border-gray-100 bg-white/95 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {value.phase === "catalog" && (
          <>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              카드를 열어보면 탐색 기록이 쌓여요. 준비되면 AI 트렌드 이해도 측정으로 넘어가 주세요.
            </p>
            <button
              type="button"
              onClick={() => {
                setSurveyStep(0);
                patch({ phase: "trend", trendStepIndex: 0 });
                setHubView("hub");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 transition-colors"
            >
              다음: AI 트렌드 이해도
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {value.phase === "trend" && currentTrend && (
          <>
            <button
              type="button"
              onClick={() => {
                if (trendIdx <= 0) {
                  patch({ phase: "catalog" });
                } else {
                  patch({ trendStepIndex: trendIdx - 1 });
                }
              }}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
            {(() => {
              const cid = currentTrend.id;
              const answered = typeof value.trendResponses[cid] === "number";
              const isLast = trendIdx >= trendTotal - 1;
              return (
                <button
                  type="button"
                  disabled={!answered}
                  onClick={() => {
                    if (isLast) {
                      setSurveyStep(0);
                      patch({ phase: "survey" });
                    } else {
                      patch({ trendStepIndex: trendIdx + 1 });
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 ml-auto transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isLast ? (
                    <>
                      다음: AI 활용도 설문
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      다음 문항
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              );
            })()}
          </>
        )}

        {value.phase === "survey" && (
          <>
            <button
              type="button"
              onClick={() => {
                if (surveyStep <= 0) {
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
                onClick={() => setPhase("scenario")}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:bg-violet-700 ml-auto transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                다음: 상황 판단
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}

        {value.phase === "scenario" && (
          <>
            <button
              type="button"
              onClick={() => {
                setSurveyStep(SURVEY_STEP_COUNT - 1);
                setPhase("survey");
              }}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
            <button
              type="button"
              disabled={value.scenarioChoice === null}
              onClick={onRequestResult}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none ml-auto transition-colors"
            >
              결과 보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
