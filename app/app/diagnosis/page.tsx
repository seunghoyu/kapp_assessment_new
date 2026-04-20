"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Cog,
  TrendingUp,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  Mailbox,
  Bot,
  BarChart3,
  HelpCircle,
  X,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import userInfoOptions from "@/data/kappDiagnosis/userInfoOptions.json";
import knowledgeData from "@/data/kappDiagnosis/knowledgeQuestions.json";
import applicationData from "@/data/kappDiagnosis/applicationQuestions.json";
import performanceData from "@/data/kappDiagnosis/performanceQuestions.json";
import etrayData from "@/data/kappDiagnosis/etrayByIndustry.json";
import industryTree from "@/data/Industry/industry_tree.json";
import { getInbasketQuestions } from "@/lib/inbasketData";
import InbasketList, { type InbasketQuestion } from "./InbasketList";
import InbasketSimulation from "./InbasketSimulation";
import type { IndustryNode } from "./industryTypes";
import IndustrySelectModal from "./IndustrySelectModal";
import DiagnosisStartStep from "./DiagnosisStartStep";
import { defaultAiExploration, type AiExplorationPayload } from "./AiExplorationFlow";
import DiagnosisAiExplorationStep from "./DiagnosisAiExplorationStep";
import ProgressHeader from "@/components/diagnosis/ProgressHeader";
import DiagnosisInfoInputLeftPanel from "@/components/diagnosis/DiagnosisInfoInputLeftPanel";
import { ROUTES } from "@/lib/routes";
import { serializeReportRequest } from "@/lib/report/report-data";
import TwemojiIcon from "@/components/common/TwemojiIcon";
import { getKnowledgeExplanation } from "@/lib/knowledgeExplanationData";
import KnowledgeExplanationModal from "./KnowledgeExplanationModal";
import KnowledgePracticalModal from "./KnowledgePracticalModal";

/** KAPP 진단 데이터 안내 + 문항 구성 로직 문서 기준 (kapp_origin flow 동일) */
const STEPS = [
  { id: 0, title: "시작", short: "시작" },
  { id: 1, title: "정보 입력", short: "정보" },
  { id: 2, title: "지식 문항", short: "지식" },
  { id: 3, title: "적용 문항", short: "적용" },
  { id: 4, title: "성과 문항", short: "성과" },
  { id: 5, title: "디지털 인바스켓", short: "인바스켓" },
  { id: 6, title: "AI 활용 탐색", short: "AI" },
  { id: 7, title: "결과", short: "결과" },
];

/**
 * sessionStorage 진단 상태 스키마 버전.
 * - 2: AI 단계(step 6) 분리
 * - 3: AI 단계에서 상황 판단(시나리오) 제거, 전환 인트로 키 정리
 * flowVersion 없음 또는 1만: 예전에는 step 6이 결과 → 복원 시 7로 올림 (아래 fv < 2 분기)
 */
const DIAGNOSIS_FLOW_VERSION = 3;

/** AI 단계 도입 이전 스키마 (step 6 = 결과 화면) */
const FLOW_VERSION_BEFORE_AI_STEP = 2;

/** 단계별 상세 로직 (KAPP_DIAGNOSIS_QUESTION_LOGIC + KAPP_DIAGNOSIS_DATA_REFERENCE + kapp_origin 동일) */
const STEP_DETAILS: Record<number, { title: string; what: string; criteria: string; logic: string[] }> = {
  1: {
    title: "정보 입력",
    what: "이름, 산업·직무, 직급, 연차, 기업 규모, 진단 목표 등 입력. 한 번만 입력하며, 이후 단계의 문항·시나리오 선정 기준이 됩니다.",
    criteria: "산업·직무 → 세부 직무 2단계 선택. 직급(인턴~임원), 연차(1년 미만~16년 이상), 기업 규모(대기업/중견/중소/스타트업), 진단 목표(복수 선택, 결과 해석·추천에만 사용).",
    logic: [
      "입력 정보는 「어떤 문항이 나올지」와 「인바스켓·AI 탐색 맥락」을 결정하는 데 사용됩니다.",
      "진단 목표(승진/이직/스킬업/커리어전환)는 문항 선정에는 쓰이지 않고, 결과 해석·추천에만 활용됩니다.",
    ],
  },
  2: {
    title: "지식 문항 (적응형)",
    what: "직무 관련 지식 퀴즈(객관식). 난이도·지식 수준에 따라 맞춤 출제(적응형).",
    criteria: "산업 ○, 직무 ○, 직급 사용 안 함, 연차 ○(시작 난이도만), 진단 목표 사용 안 함.",
    logic: [
      "시작 난이도: 보통(medium). 연차 1년 미만이면 쉬움(easy)부터 가능.",
      "문항 수: 지식 카테고리당 3문항 후 다음 단계(적용)로 이동.",
      "선정: (1) 지식 문항 (2) 산업·직무 일치 또는 공통 (3) 현재 난이도 일치 (4) 미출제 문항 중 무작위 1개.",
      "정답 시: 난이도 상승(쉬움→보통→어려움), 지식 레벨 소폭 상승(상한 5).",
      "오답 시: 난이도 하락, 지식 레벨 소폭 하락(하한 1).",
      "산업·직무별: 해당 산업·직무 문항 우선, 부족 시 공통 문항으로 채움.",
    ],
  },
  3: {
    title: "적용 문항 (시나리오)",
    what: "업무 시나리오를 읽고 선택. 실무 상황에서의 의사결정 및 문제 해결 능력 측정.",
    criteria: "산업 ○, 직무 ○, 직급 ○(일부 문항만), 연차 사용 안 함, 진단 목표 사용 안 함.",
    logic: [
      "문항 수: 3~4문항. 조건에 맞는 문항 부족 시 공통 시나리오로 보충.",
      "선정: (1) 적용(application) 문항 (2) 산업 일치 또는 공통 (3) 직무 일치 또는 공통 (4) 일부 문항은 직급 일치 시 후보 포함 (5) 미출제 중 순서/무작위.",
      "예: IT+개발자(Backend)+대리 → 백엔드 장애 대응, API 설계 검토 등 시나리오 우선. 금융+여신심사역+과장 → 여신 한도 검토, 심사 보고서 검토 등.",
    ],
  },
  4: {
    title: "성과 문항 (KPI·성과)",
    what: "KPI·성과 관련 선택 문항. 성과 창출 역량 측정.",
    criteria: "산업 ○, 직무 ○, 직급 사용 안 함, 연차 사용 안 함, 진단 목표 사용 안 함.",
    logic: [
      "문항 수: 3~4문항. 부족 시 공통 성과 문항으로 보충.",
      "선정: (1) 성과(performance) 문항 (2) 산업 일치 또는 공통 (3) 직무 일치 또는 공통 (4) 미출제 중 순서/무작위.",
    ],
  },
  5: {
    title: "디지털 인바스켓 (E-tray)",
    what: "받은 이메일·업무 시뮬레이션으로 우선순위·의사결정을 연습한다. AI 시나리오는 다음 단계 「AI 활용 탐색」에서 진행한다.",
    criteria: "직무·산업에 맞는 인바스켓 문항 목록에서 시뮬레이션을 완료한다.",
    logic: [
      "기록: 문항별 완료는 `answers.etray`에 저장.",
      "완료 후 다음 단계로 이동하여 AI 활용 탐색(도구·트렌드·설문)을 진행한다.",
    ],
  },
  6: {
    title: "AI 활용 탐색",
    what: "AI 도구 카탈로그 탐색, 트렌드 이해도, 실무 활용 설문으로 역량 진단과 학습 힌트를 함께 수집한다.",
    criteria: "`AiExplorationFlow`: ① 도구 탐색 → ② AI 트렌드 이해도 → ③ AI 활용도 설문 후 결과 단계로 이어진다.",
    logic: [
      "기록: `answers.aiExploration`(phase, toolsUsed, trendResponses, 설문 필드 등). 레거시 `answers.ai`는 사용하지 않는다.",
      "최초 진입 시 전환 인트로(`DiagnosisAiExplorationStep` → `AiExplorationIntro`, sessionStorage `kapp_diagnosis_ai_intro_v3`).",
    ],
  },
  7: {
    title: "진단 결과",
    what: "영역별·종합 점수, 지식 수준, 강점/개선 영역 표시. 결과 해석·추천에 진단 목표 활용.",
    criteria: "결과 해석·추천 시 산업/직무/직급/연차/진단 목표 모두 참고.",
    logic: [
      "포함: 입력 정보, 영역별 점수, 문항별 답, 인바스켓 기록, AI 탐색(`answers.aiExploration`).",
      "저장: 한 번의 진단을 한 덩어리로 정규화 저장.",
    ],
  },
};

const KAPP_BADGES = [
  { icon: BookOpen, label: "지식(K)", color: "bg-blue-500" },
  { icon: Cog, label: "적용(A)", color: "bg-emerald-500" },
  { icon: TrendingUp, label: "성과(P)", color: "bg-amber-500" },
  { icon: Zap, label: "생산성(P)", color: "bg-violet-500" },
];

type IndustryJobData = Record<string, { icon: string; jobs: string[] }>;
type OptionItem = { value: string; label: string; icon?: string };

type KnowledgeQ = { id: string; category: string; difficulty: string; industry: string; job: string; question: string; options: string[]; answer: number; explanation?: string };
type ApplicationQ = { id: string; category: string; industry: string; job: string; position: string; title: string; scenario: string; question: string; options: { label: string; score: number }[]; answer: number };
type PerformanceQ = { id: string; category: string; industry: string; job: string; title: string; question: string; options: { label: string; score: number }[]; answer: number };
type EtrayEmail = { id: string; sender: string; subject: string; time: string; priority: string; body: string; unread?: boolean };
const ETRAY_INDUSTRY_KEYS = ["IT", "금융", "의료", "마케팅/광고", "기타"];

const industryTreeData = industryTree as IndustryNode[];

const DIAGNOSIS_STORAGE_KEY = "kapp_diagnosis_state";
const INBASKET_TUTORIAL_DISMISSED_KEY = "kapp_inbasket_tutorial_dismissed";

/**
 * 진단 완료 후 AI 분석 로딩 메시지 (시간 기준으로만 순환)
 * - 전환 기준: MESSAGE_INTERVAL_MS(2.2초)마다 다음 문구로 변경. 실제 엔진 진행률과 무관.
 * - 추후 엔진 연동 시: setTimeout 대신 API 호출 후 .then(() => { setAnalysisLoading(false); setStep(7); }) 로
 *   로딩 종료만 엔진 완료 시점에 맞추면 됨. 메시지 순환은 그대로 시간 기준 유지 가능.
 */
const ANALYSIS_LOADING_MESSAGES = [
  "진단 응답을 수집하고 있습니다.",
  "AI 엔진이 역량 프로파일을 분석합니다.",
  "지식·적용·성과·생산성 영역을 종합하고 있습니다.",
  "마이 대시보드 결과를 준비하고 있습니다.",
  "잠시만 기다려 주세요.",
];

const COMPANY_TYPE_OPTIONS = [
  { value: "일반 사기업", label: "일반 사기업" },
  { value: "공기업·공공기관", label: "공기업·공공기관" },
  { value: "외국계 기업", label: "외국계 기업" },
  { value: "비영리·NGO", label: "비영리·NGO" },
] as const;

const JOB_TITLE_OPTIONS = [
  { value: "팀원", label: "팀원" },
  { value: "파트장", label: "파트장" },
  { value: "부팀장", label: "부팀장" },
  { value: "팀장", label: "팀장" },
] as const;

type PersistedState = {
  step: number;
  flowVersion: number;
  infoInputStep: 1 | 2 | 3;
  form: {
    name: string;
    email: string;
    password: string;
    phone: string;
    industry: string;
    job: string;
    companyType: string;
    position: string;
    jobTitle: string;
    experienceYears: string;
    company: string;
    companySize: string;
    diagnosticGoals: string[];
  };
  selectedEtrayId: string | null;
  inbasketView: "list" | "simulation";
  inbasketSelectedId: string | null;
  answers: {
    knowledge: number[];
    application: number[];
    performance: number[];
    etray: Record<string, string>;
    ai: number | null;
    aiExploration: AiExplorationPayload;
  };
};

function loadPersistedState(): Partial<PersistedState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DIAGNOSIS_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") return null;
    const d = data as Record<string, unknown>;
    const step = typeof d.step === "number" && d.step >= 0 && d.step <= 7 ? d.step : undefined;
    const flowVersion = typeof d.flowVersion === "number" ? d.flowVersion : undefined;
    const infoInputStep =
      d.infoInputStep === 1 || d.infoInputStep === 2 || d.infoInputStep === 3 ? (d.infoInputStep as 1 | 2 | 3) : undefined;
    if (step === undefined) return null;
    return {
      step,
      flowVersion,
      infoInputStep,
      form: typeof d.form === "object" && d.form !== null ? (d.form as PersistedState["form"]) : undefined,
      selectedEtrayId: typeof d.selectedEtrayId === "string" || d.selectedEtrayId === null ? d.selectedEtrayId : undefined,
      inbasketView: d.inbasketView === "list" || d.inbasketView === "simulation" ? d.inbasketView : undefined,
      inbasketSelectedId: typeof d.inbasketSelectedId === "string" || d.inbasketSelectedId === null ? d.inbasketSelectedId : undefined,
      answers: typeof d.answers === "object" && d.answers !== null ? (d.answers as PersistedState["answers"]) : undefined,
    } as Partial<PersistedState>;
  } catch {
    return null;
  }
}

function savePersistedState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  industry: "",
  job: "",
  companyType: "",
  position: "",
  jobTitle: "",
  experienceYears: "",
  company: "",
  companySize: "",
  diagnosticGoals: [] as string[],
};

const initialAnswers: PersistedState["answers"] = {
  knowledge: [],
  application: [],
  performance: [],
  etray: {},
  ai: null,
  aiExploration: defaultAiExploration(),
};

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [infoInputStep, setInfoInputStep] = useState<1 | 2 | 3>(1);
  /** 단계 전환 방향: 다음 → 우측 슬라이드, 이전 → 좌측 슬라이드 */
  const [stepTransitionDir, setStepTransitionDir] = useState<"left" | "right" | null>(null);
  /** 카드형 문항 UI: step 내 현재 문항 인덱스 */
  const [knowledgeIndex, setKnowledgeIndex] = useState(0);
  const [applicationIndex, setApplicationIndex] = useState(0);
  const [performanceIndex, setPerformanceIndex] = useState(0);
  // step 2(지식 문항) 채점/해설 UI 상태
  const [knowledgeGraded, setKnowledgeGraded] = useState(false);
  const [knowledgeIsCorrect, setKnowledgeIsCorrect] = useState<boolean | null>(null);
  const [knowledgeExplanationModalOpen, setKnowledgeExplanationModalOpen] = useState(false);
  const [knowledgePracticalModalOpen, setKnowledgePracticalModalOpen] = useState(false);
  const industryJobData = userInfoOptions.industryJobData as IndustryJobData;
  const positionLevels = userInfoOptions.positionLevels as OptionItem[];
  const experienceYears = userInfoOptions.experienceYears as OptionItem[];
  const companySizes = userInfoOptions.companySizes as OptionItem[];
  const diagnosticGoals = userInfoOptions.diagnosticGoals as OptionItem[];

  const [form, setForm] = useState(initialForm);
  const [selectedMajor, setSelectedMajor] = useState<IndustryNode | null>(null);
  const [industrySelectModalOpen, setIndustrySelectModalOpen] = useState(false);
  const [selectedEtrayId, setSelectedEtrayId] = useState<string | null>(null);
  const [inbasketView, setInbasketView] = useState<"list" | "simulation">("list");
  const [inbasketSelectedId, setInbasketSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<PersistedState["answers"]>(initialAnswers);
  const hasRestored = useRef(false);
  const skipNextSave = useRef(true);

  // 디지털 인바스켓 튜토리얼: 첫 진입 시 자동 표시, 닫기 후에는 호버 시에만 표시
  const [inbasketTutorialDismissed, setInbasketTutorialDismissed] = useState(true);
  const [inbasketTutorialHover, setInbasketTutorialHover] = useState(false);
  const [testEnvTooltipHover, setTestEnvTooltipHover] = useState(false);

  // 진단 → 결과 전환 시 AI 분석 로딩 (메시지는 시간 기준 순환, 추후 엔진 완료 시점에 연동 가능)
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const analysisLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisLoadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setInbasketTutorialDismissed(sessionStorage.getItem(INBASKET_TUTORIAL_DISMISSED_KEY) === "1");
  }, []);

  // 옵션 변경 시(또는 복원된 값이 구버전일 때) 매칭 안 되면 placeholder로 초기화
  useEffect(() => {
    const companyTypeValues = new Set<string>(COMPANY_TYPE_OPTIONS.map((o) => o.value));
    const companySizeValues = new Set<string>(companySizes.map((o) => o.value));

    setForm((f) => {
      const nextCompanyType = companyTypeValues.has(f.companyType) ? f.companyType : "";
      const nextCompanySize = companySizeValues.has(f.companySize) ? f.companySize : "";
      if (nextCompanyType === f.companyType && nextCompanySize === f.companySize) return f;
      return { ...f, companyType: nextCompanyType, companySize: nextCompanySize };
    });
  }, [companySizes]);

  // 분석 로딩 중: 메시지 시간 기준 순환 (엔진 진행률과 무관, 추후 API 완료 시점으로 교체 가능)
  useEffect(() => {
    if (!analysisLoading) {
      if (analysisLoadingIntervalRef.current) {
        clearInterval(analysisLoadingIntervalRef.current);
        analysisLoadingIntervalRef.current = null;
      }
      if (analysisLoadingTimerRef.current) {
        clearTimeout(analysisLoadingTimerRef.current);
        analysisLoadingTimerRef.current = null;
      }
      return;
    }
    setLoadingMessageIndex(0);
    const MESSAGE_INTERVAL_MS = 2200;
    const LOADING_DURATION_MS = 4500;
    analysisLoadingIntervalRef.current = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % ANALYSIS_LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    analysisLoadingTimerRef.current = setTimeout(() => {
      setAnalysisLoading(false);
      setStep(7);
    }, LOADING_DURATION_MS);
    return () => {
      if (analysisLoadingIntervalRef.current) clearInterval(analysisLoadingIntervalRef.current);
      if (analysisLoadingTimerRef.current) clearTimeout(analysisLoadingTimerRef.current);
    };
  }, [analysisLoading]);

  // GET 요청/새로고침 시 복원: sessionStorage에서 진단 진행 상태 복원
  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;
    const saved = loadPersistedState();
    if (!saved || saved.step === undefined) return;
    let nextStep = saved.step;
    const fv = saved.flowVersion ?? 1;
    if (fv < FLOW_VERSION_BEFORE_AI_STEP && nextStep === 6) {
      nextStep = 7;
    }
    if (saved.step === 5 && saved.inbasketSelectedId === "ai-workflow") {
      nextStep = 6;
    }
    setStep(nextStep);
    if (saved.step === 5 && saved.inbasketSelectedId === "ai-workflow") {
      setInbasketView("list");
      setInbasketSelectedId(null);
    }
    if (saved.infoInputStep !== undefined) setInfoInputStep(saved.infoInputStep);
    if (saved.form) {
      setForm({ ...initialForm, ...saved.form });
      const industryName = saved.form.industry;
      if (industryName && industryTreeData.length > 0) {
        const found = industryTreeData.find((m) => m.name === industryName) ?? null;
        setSelectedMajor(found);
      }
    }
    if (saved.selectedEtrayId !== undefined) setSelectedEtrayId(saved.selectedEtrayId);
    if (saved.inbasketView !== undefined) setInbasketView(saved.inbasketView);
    if (saved.inbasketSelectedId !== undefined) setInbasketSelectedId(saved.inbasketSelectedId);
    if (saved.answers) {
      const merged = { ...initialAnswers, ...saved.answers };
      const defaults = defaultAiExploration();
      if (!merged.aiExploration) {
        merged.aiExploration = defaults;
      } else {
        const raw = merged.aiExploration as AiExplorationPayload & {
          scenarioChoice?: number | null;
          phase?: string;
        };
        const { scenarioChoice: _legacyScenario, ...withoutScenario } = raw;
        let ae: AiExplorationPayload = { ...defaults, ...withoutScenario };
        if ((ae.phase as string) === "scenario") {
          ae = { ...ae, phase: "survey" };
        }
        if (!ae.trendResponses) ae.trendResponses = {};
        if (typeof ae.trendStepIndex !== "number") ae.trendStepIndex = 0;
        if (typeof ae.surveyFreeText !== "string") ae.surveyFreeText = "";
        merged.aiExploration = ae;
      }
      setAnswers(merged);
    }
  }, []);

  // 진단 상태 변경 시 sessionStorage에 저장 (첫 마운트 시 복원 전 덮어쓰기 방지)
  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const state: PersistedState = {
      step,
      flowVersion: DIAGNOSIS_FLOW_VERSION,
      infoInputStep,
      form,
      selectedEtrayId,
      inbasketView,
      inbasketSelectedId,
      answers,
    };
    savePersistedState(state);
  }, [step, infoInputStep, form, selectedEtrayId, inbasketView, inbasketSelectedId, answers]);

  const knowledgeList = (knowledgeData as { questions: KnowledgeQ[] }).questions;
  const applicationList = (applicationData as { questions: ApplicationQ[] }).questions;
  const performanceList = (performanceData as { questions: PerformanceQ[] }).questions;
  const etrayByIndustry = (etrayData as { byIndustry: Record<string, EtrayEmail[]> }).byIndustry;

  const filteredKnowledge = useMemo(() => {
    return knowledgeList.filter(
      (q) => (q.industry === "" || q.industry === form.industry) && (q.job === "" || q.job === form.job)
    ).slice(0, 5);
  }, [form.industry, form.job]);

  const filteredApplication = useMemo(() => {
    return applicationList.filter(
      (q) =>
        (q.industry === "" || q.industry === form.industry) &&
        (q.job === "" || q.job === form.job) &&
        (q.position === "" || q.position === form.position)
    ).slice(0, 4);
  }, [form.industry, form.job, form.position]);

  const filteredPerformance = useMemo(() => {
    return performanceList.filter(
      (q) => (q.industry === "" || q.industry === form.industry) && (q.job === "" || q.job === form.job)
    ).slice(0, 4);
  }, [form.industry, form.job]);

  const etrayEmails = useMemo(() => {
    const key = ETRAY_INDUSTRY_KEYS.includes(form.industry) ? form.industry : "기타";
    return etrayByIndustry[key] ?? etrayByIndustry["기타"] ?? [];
  }, [form.industry]);

  useEffect(() => {
    if (step === 5 && etrayEmails.length > 0) {
      const firstId = etrayEmails[0].id;
      if (!selectedEtrayId || !etrayEmails.some((e) => e.id === selectedEtrayId)) setSelectedEtrayId(firstId);
    }
  }, [step, etrayEmails, selectedEtrayId]);

  const inbasketQuestions = getInbasketQuestions();

  const selectedInbasketQuestion = useMemo(
    () => (inbasketSelectedId ? inbasketQuestions.find((q) => q.id === inbasketSelectedId) ?? null : null),
    [inbasketSelectedId, inbasketQuestions]
  );

  const inbasketProgress = useMemo(() => {
    const total = inbasketQuestions.length;
    const completed = inbasketQuestions.filter(
      (q) => answers.etray[q.id] != null && String(answers.etray[q.id]).trim() !== ""
    ).length;
    return { completed, total };
  }, [inbasketQuestions, answers.etray]);

  const allInbasketComplete = useMemo(
    () =>
      inbasketQuestions.length > 0 &&
      inbasketQuestions.every(
        (q) => answers.etray[q.id] != null && String(answers.etray[q.id]).trim() !== ""
      ),
    [inbasketQuestions, answers.etray]
  );

  /** 디지털 인바스켓 시뮬레이션 → 목록으로 돌아가기. step은 변경하지 않음(5 유지). */
  const handleInbasketBackToList = useCallback(() => {
    setInbasketView("list");
    setInbasketSelectedId(null);
  }, []);

  const industryList = useMemo(() => Object.keys(industryJobData), [industryJobData]);
  const jobList = useMemo(
    () => (industryJobData[form.industry]?.jobs ?? industryJobData["기타"]?.jobs ?? []) as string[],
    [industryJobData, form.industry]
  );

  const handleIndustrySelect = useCallback((major: IndustryNode, jobName: string) => {
    setSelectedMajor(major);
    setForm((f) => ({ ...f, industry: major.name, job: jobName }));
    setIndustrySelectModalOpen(false);
  }, []);

  /** 문서 기준 userInput 구조 (kappDiagnosisRawData.userInput과 동일) */
  const userInput = useMemo(
    () => ({
      basicInfo: { name: form.name.trim(), email: form.email.trim() || undefined },
      industryAndJob: form.industry ? { industry: form.industry, job: form.job } : undefined,
      careerInfo:
        form.position && form.experienceYears
          ? {
              position: form.position,
              title: form.jobTitle || undefined,
              experienceYears: form.experienceYears,
            }
          : undefined,
      organizationInfo: form.companySize
        ? { company: form.company.trim() || undefined, companySize: form.companySize }
        : undefined,
      diagnosticGoals: form.diagnosticGoals.length > 0 ? form.diagnosticGoals : undefined,
    }),
    [form]
  );

  const toggleGoal = (value: string) => {
    setForm((f) => ({
      ...f,
      diagnosticGoals: f.diagnosticGoals.includes(value)
        ? f.diagnosticGoals.filter((g) => g !== value)
        : [...f.diagnosticGoals, value],
    }));
  };

  const canNextFromInfoInputStep = () => {
    switch (infoInputStep) {
      case 1:
        return !!(form.industry && form.job);
      case 2:
        return !!(
          form.name.trim() &&
          form.email.trim() &&
          form.password.trim() &&
          form.phone.trim()
        );
      case 3:
        return !!(
          form.companyType &&
          form.position &&
          form.jobTitle &&
          form.experienceYears &&
          form.companySize
        );
      default:
        return false;
    }
  };

  const canNext = () => {
    if (step === 1) return canNextFromInfoInputStep();
    return true;
  };

  const goNext = () => {
    setStepTransitionDir("right");
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleInfoInputNext = () => {
    if (infoInputStep < 3) {
      // 산업군 모달이 열려있을 수 있으므로, 서브 스텝 전환 시 닫아준다.
      setIndustrySelectModalOpen(false);
      setInfoInputStep((s) => (Math.min(3, s + 1) as 1 | 2 | 3));
      return;
    }
    // 서브 스텝 3 완료 -> 메인 step 1 -> step 2로 이동
    goNext();
  };

  const goPrev = () => {
    setStepTransitionDir("left");
    setStep((s) => Math.max(0, s - 1));
  };

  // step 변경 시: 해당 step의 카드 인덱스 초기화
  useEffect(() => {
    if (step === 2) setKnowledgeIndex(0);
    if (step === 3) setApplicationIndex(0);
    if (step === 4) setPerformanceIndex(0);
  }, [step]);

  // 지식 문항(step 2) 채점 상태는 "선택 변경/다음 이동" 시점에만 초기화합니다.

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] max-h-[100vh] overflow-hidden bg-gray-50">
      {/* 상단 헤더 — 로딩·스크롤 시에도 고정 유지 */}
      <div className="sticky top-0 z-20 flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">KAPP 지능형 역량 진단</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Knowledge · Application · Performance · Productivity
          </p>
        </div>
      </div>

      {/* 메인 영역만 로딩 오버레이 적용 (사이드바·헤더는 그대로 노출) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        {analysisLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm" aria-live="polite" aria-busy="true">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin shrink-0" aria-hidden />
            <p className="mt-4 text-sm font-medium text-gray-700 min-h-[1.5rem] text-center px-4">
              {ANALYSIS_LOADING_MESSAGES[loadingMessageIndex % ANALYSIS_LOADING_MESSAGES.length]}
            </p>
            <p className="mt-2 text-xs text-gray-500">로딩이 완료되면 마이 대시보드에서 분석 결과를 확인할 수 있습니다.</p>
          </div>
        )}

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-6 relative">
        <div className="flex-1 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0 relative">
          {/* 상단: 이전(아이콘) 좌측 + step 5일 때 제목/툴팁 + 단계 버튼 우측 */}
          <div className="flex-shrink-0 flex justify-between items-center gap-4 px-4 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 5 && inbasketView === "simulation") {
                      handleInbasketBackToList();
                    } else if (step === 6) {
                      setStepTransitionDir("left");
                      setInbasketView("list");
                      setStep(5);
                    } else if (step === 1 && infoInputStep > 1) {
                      setInfoInputStep((s) => (Math.max(1, s - 1) as 1 | 2 | 3));
                    } else {
                      setIndustrySelectModalOpen(false);
                      goPrev();
                    }
                  }}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
                  aria-label={step === 5 && inbasketView === "simulation" ? "목록으로" : "이전"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            {step === 5 ? (
              <div className="min-w-0 flex items-start gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5">
                    <h1 className="text-lg font-bold text-gray-900 shrink-0">디지털 인바스켓</h1>
                    <span
                      className="relative shrink-0"
                      onMouseEnter={() => setInbasketTutorialHover(true)}
                      onMouseLeave={() => setInbasketTutorialHover(false)}
                    >
                      <button
                        type="button"
                        className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        aria-label="디지털 인바스켓 이용 안내"
                      >
                        <HelpCircle className="h-5 w-5" />
                      </button>
                  {(inbasketTutorialDismissed ? inbasketTutorialHover : true) && (
                    <div className="absolute left-0 top-full mt-1 z-20 w-96 rounded-xl border border-gray-200 bg-white shadow-lg p-4 text-left">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="font-semibold text-gray-900 text-sm">디지털 인바스켓 안내</span>
                        <button
                          type="button"
                          onClick={() => {
                            setInbasketTutorialDismissed(true);
                            setInbasketTutorialHover(false);
                            if (typeof window !== "undefined") sessionStorage.setItem(INBASKET_TUTORIAL_DISMISSED_KEY, "1");
                          }}
                          className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          aria-label="닫기"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                        디지털 인바스켓은 <strong>실전 업무 의사결정 시뮬레이터</strong>입니다. 표시된 문항을 시뮬레이션으로 완료한 뒤, 다음 단계 「AI 활용 탐색」에서 산업별 AI 시나리오를 진행합니다.
                      </p>
                      <p className="font-semibold text-gray-800 text-xs mb-2">이용 방법</p>
                      <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                        <li>표에서 <strong>상세보기</strong>로 내용을 확인하고, <strong>진행하기</strong>로 시뮬레이션을 시작하세요.</li>
                        <li>시뮬레이션 안에서 지시에 따라 업무를 처리한 뒤, 하단 <strong>완료하고 다음 단계로</strong>를 누르면 목록으로 돌아갑니다.</li>
                      </ul>
                    </div>
                  )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>실전 업무 의사결정 시뮬레이터 · 이후 단계에서 AI 활용 탐색</span>
                    <span
                      className="relative inline-flex"
                      onMouseEnter={() => setTestEnvTooltipHover(true)}
                      onMouseLeave={() => setTestEnvTooltipHover(false)}
                    >
                      <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800 cursor-help">
                        테스트 환경
                      </span>
                      {testEnvTooltipHover && (
                        <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left shadow-lg">
                          <p className="text-xs font-semibold text-amber-900 mb-1.5">테스트 환경</p>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            현재는 <strong>테스트 환경</strong>입니다. 전체 문항과 직무 선택이 노출됩니다.
                          </p>
                          <p className="text-[11px] text-amber-800 leading-relaxed mt-2">
                            실제 학습자 환경에서는 &quot;선정 문항&quot; 헤더로 표시되며, 직무·산업군·기업규모·직급에 따라 선정된 문항만 노출됩니다. 직무 선택 UI는 보이지 않습니다.
                          </p>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : step === 6 ? (
              <div className="min-w-0 flex items-start gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5">
                    <Bot className="h-5 w-5 text-violet-600 shrink-0" aria-hidden />
                    <h1 className="text-lg font-bold text-gray-900 shrink-0">AI 활용 탐색</h1>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    도구 탐색·AI 트렌드 이해도·AI 활용도 설문·상황 판단까지 진행하며, 응답은 진단 맥락 분석에 활용됩니다.
                  </p>
                </div>
              </div>
            ) : null}
            </div>
            <div className="flex items-center justify-end gap-3 flex-wrap shrink-0">
              {step >= 1 && <ProgressHeader step={step} />}
            </div>
          </div>
          {/* 단계별 콘텐츠 — 단계 전환 시 방향별 슬라이드 인 (다음→우측, 이전→좌측) */}
          <div
            key={step}
            className={`flex-1 min-h-0 overflow-hidden flex flex-col ${
              stepTransitionDir === "right"
                ? "diagnosis-step-enter-right"
                : stepTransitionDir === "left"
                  ? "diagnosis-step-enter-left"
                  : ""
            }`}
          >
          {/* 0: 시작 — Split Layout + 카드뉴스 슬라이드 */}
          {step === 0 && (
            <DiagnosisStartStep
              onStart={() => {
                setStepTransitionDir("right");
                setInfoInputStep(1);
                setStep(1);
              }}
            />
          )}

          {/* 1: 정보 입력 — Split Layout (좌 60% 설명 / 우 40% 입력 UI) */}
          {step === 1 && (
            <div className="grid grid-cols-[60%_40%] flex-1 min-h-0 overflow-hidden bg-white">
              {/* 좌측 60%: 설명 영역, 세로 가운데 정렬 */}
              <div className="flex flex-col items-start justify-center px-10 py-8 min-h-0 border-r border-gray-100">
                <DiagnosisInfoInputLeftPanel infoStep={infoInputStep} />
              </div>

              {/* 우측 40%: 입력 UI, overflow 시 세로 스크롤 */}
              <div className="flex flex-col min-h-0 overflow-y-auto">
                <div className="flex-1 p-8 flex flex-col gap-5 justify-center">
                  {infoInputStep === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">산업군 *</label>
                        <button
                          type="button"
                          onClick={() => setIndustrySelectModalOpen(true)}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-left bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 transition-colors flex items-center justify-between shadow-sm"
                        >
                          <span className={form.industry ? "text-gray-900" : "text-gray-500"}>
                            {(selectedMajor?.name ?? form.industry) || "산업군 선택"}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                        </button>

                        <IndustrySelectModal
                          open={industrySelectModalOpen}
                          onClose={() => setIndustrySelectModalOpen(false)}
                          majors={industryTreeData}
                          onSelect={handleIndustrySelect}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">세부 직무 *</label>
                        <input
                          type="text"
                          value={form.job}
                          readOnly
                          disabled={!form.industry}
                          placeholder={
                            form.industry
                              ? "산업군 모달에서 직무·직업을 선택해주세요"
                              : "먼저 산업군을 선택해주세요"
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {infoInputStep === 2 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="홍길동"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일 (아이디) *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="example@company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="010-1234-5678"
                        />
                      </div>
                    </>
                  )}

                  {infoInputStep === 3 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">기업유형 *</label>
                        <select
                          value={form.companyType}
                          onChange={(e) => setForm((f) => ({ ...f, companyType: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                          <option value="">선택해주세요</option>
                          {COMPANY_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">직급 *</label>
                          <select
                            value={form.position}
                            onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          >
                            <option value="">선택해주세요</option>
                            {positionLevels.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">직책 *</label>
                          <select
                            value={form.jobTitle}
                            onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          >
                            <option value="">선택해주세요</option>
                            {JOB_TITLE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">회사명 (선택)</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="소속 회사"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">연차 *</label>
                        <select
                          value={form.experienceYears}
                          onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                          <option value="">선택해주세요</option>
                          {experienceYears.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">기업 규모 *</label>
                        <select
                          value={form.companySize}
                          onChange={(e) => setForm((f) => ({ ...f, companySize: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        >
                          <option value="">선택해주세요</option>
                          {companySizes.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          진단 목표 (선택, 복수 선택 가능)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {diagnosticGoals.map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => toggleGoal(g.value)}
                              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors shadow-sm ${
                                form.diagnosticGoals.includes(g.value)
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.1">
                        <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] shrink-0">i</span>
                        입력하신 정보는 맞춤형 진단에만 활용되며, 암호화되어 안전하게 보호됩니다.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2: 지식 문항 — 업종·직무별 문항 전부 표시 (가상 데이터) */}
          {step === 2 && STEP_DETAILS[2] && (
            <div className="flex-1 min-h-0 flex items-center justify-center px-6 py-8">
              {filteredKnowledge.length === 0 ? (
                <div className="w-full max-w-[900px]">
                  <p className="text-gray-500">선택한 산업·직무에 해당하는 지식 문항이 없습니다. 정보 입력에서 산업·직무를 선택한 뒤 진행해 주세요.</p>
                </div>
              ) : (
                (() => {
                  const q = filteredKnowledge[Math.min(knowledgeIndex, filteredKnowledge.length - 1)];
                  const selected = answers.knowledge[knowledgeIndex];
                  const canGrade = selected !== undefined;
                  const canProceed = knowledgeGraded;
                  const correctIndex = q.answer;
                  const explanation = getKnowledgeExplanation(q.id);
                  return (
                    <div className="w-full max-w-[900px] px-2 sm:px-6">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            {q.industry || "공통"}{q.job ? ` · ${q.job}` : ""} · {q.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">
                            {knowledgeIndex + 1} / {filteredKnowledge.length}
                          </span>
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed mb-6">
                        {knowledgeIndex + 1}. {q.question}
                      </p>

                      <div className="h-px bg-gray-200 mb-6" aria-hidden />

                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                          const isSelected = selected === i;
                          const isCorrect = i === correctIndex;
                          const showCorrect = knowledgeGraded && isCorrect;
                          const showWrong = knowledgeGraded && isSelected && !isCorrect;

                          const ringCls = showCorrect
                            ? "border-emerald-300 bg-emerald-50"
                            : showWrong
                              ? "border-rose-300 bg-rose-50"
                              : isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-400 hover:bg-gray-50";

                          const badge =
                            showCorrect ? (
                              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                정답
                              </span>
                            ) : showWrong ? (
                              <span className="ml-2 inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                                오답
                              </span>
                            ) : null;
                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={knowledgeGraded}
                              onClick={() => {
                                setAnswers((a) => {
                                  const next = [...a.knowledge];
                                  next[knowledgeIndex] = i;
                                  return { ...a, knowledge: next };
                                });
                                setKnowledgeGraded(false);
                                setKnowledgeIsCorrect(null);
                              }}
                              className={`w-full text-left rounded-lg border p-5 transition-colors ${ringCls} ${
                                knowledgeGraded ? "cursor-not-allowed opacity-95" : ""
                              }`}
                            >
                              <span className="text-base text-gray-900 inline-flex items-center">
                                {opt}
                                {badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-3 flex-wrap">
                        {knowledgeGraded ? (
                          <div className="flex items-center gap-3 flex-wrap">
                            <button
                              type="button"
                              onClick={() => setKnowledgePracticalModalOpen(true)}
                              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-100 hover:shadow-emerald-600/10 transition-all"
                            >
                              <TwemojiIcon icon="🧰" size="1.25rem" className="shrink-0" />
                              실무에 적용하기
                            </button>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm hover:bg-amber-100 hover:shadow-amber-600/10 transition-all">
                              <button
                                type="button"
                                onClick={() => setKnowledgeExplanationModalOpen(true)}
                                className="flex items-center gap-3 text-left"
                              >
                                <TwemojiIcon icon="💡" size="1.4rem" className="shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-amber-900 text-center">
                                    더 자세하게 알아볼까요?
                                  </p>
                                </div>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">
                            선택 후 채점 버튼을 눌러 결과를 확인하세요.
                          </div>
                        )}

                        {!knowledgeGraded ? (
                          <button
                            type="button"
                            disabled={!canGrade}
                            onClick={() => {
                              const isCorrect = selected === correctIndex;
                              setKnowledgeIsCorrect(isCorrect);
                              setKnowledgeGraded(true);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
                          >
                            채점
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={!canProceed}
                            onClick={() => {
                              if (knowledgeIndex < filteredKnowledge.length - 1) {
                                setStepTransitionDir("right");
                                setKnowledgeIndex((i) => i + 1);
                              } else {
                                goNext();
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
                          >
                            다음
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <KnowledgeExplanationModal
                        open={knowledgeExplanationModalOpen}
                        onClose={() => setKnowledgeExplanationModalOpen(false)}
                        explanation={explanation}
                      />
                      <KnowledgePracticalModal
                        open={knowledgePracticalModalOpen}
                        onClose={() => setKnowledgePracticalModalOpen(false)}
                        explanation={explanation}
                      />
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* 3: 적용 문항 — 업종·직무·직급별 시나리오 전부 표시 */}
          {step === 3 && STEP_DETAILS[3] && (
            <div className="flex-1 min-h-0 flex items-center justify-center px-6 py-8">
              {filteredApplication.length === 0 ? (
                <div className="w-full max-w-[900px]">
                  <p className="text-gray-500">선택한 산업·직무·직급에 해당하는 적용 문항이 없습니다.</p>
                </div>
              ) : (
                (() => {
                  const q = filteredApplication[Math.min(applicationIndex, filteredApplication.length - 1)];
                  const selected = answers.application[applicationIndex];
                  const canProceed = selected !== undefined;
                  return (
                    <div className="w-full max-w-[900px] px-2 sm:px-6">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            {q.industry || "공통"}{q.job ? ` · ${q.job}` : ""}{q.position ? ` · ${q.position}` : ""}
                          </span>
                          <span className="text-xs text-gray-500">
                            {applicationIndex + 1} / {filteredApplication.length}
                          </span>
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                        {applicationIndex + 1}. {q.title}
                      </p>
                      <p className="mt-4 text-sm md:text-base text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {q.scenario}
                      </p>
                      <p className="mt-6 text-base md:text-lg font-semibold text-gray-900 leading-relaxed">
                        {q.question}
                      </p>

                      <div className="h-px bg-gray-200 mt-6" aria-hidden />

                      <div className="mt-6 space-y-3">
                        {q.options.map((opt, i) => {
                          const isSelected = selected === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setAnswers((a) => {
                                  const next = [...a.application];
                                  next[applicationIndex] = i;
                                  return { ...a, application: next };
                                });
                              }}
                              className={`w-full text-left rounded-lg border p-5 transition-colors ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                              }`}
                            >
                              <span className="text-base text-gray-900">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          disabled={!canProceed}
                          onClick={() => {
                            if (applicationIndex < filteredApplication.length - 1) {
                              setStepTransitionDir("right");
                              setApplicationIndex((i) => i + 1);
                            } else {
                              goNext();
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                          다음
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* 4: 성과 문항 — 업종·직무별 전부 표시 */}
          {step === 4 && STEP_DETAILS[4] && (
            <div className="flex-1 min-h-0 flex items-center justify-center px-6 py-8">
              {filteredPerformance.length === 0 ? (
                <div className="w-full max-w-[900px]">
                  <p className="text-gray-500">선택한 산업·직무에 해당하는 성과 문항이 없습니다.</p>
                </div>
              ) : (
                (() => {
                  const q = filteredPerformance[Math.min(performanceIndex, filteredPerformance.length - 1)];
                  const selected = answers.performance[performanceIndex];
                  const canProceed = selected !== undefined;
                  return (
                    <div className="w-full max-w-[900px] px-2 sm:px-6">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            {q.industry || "공통"}{q.job ? ` · ${q.job}` : ""}
                          </span>
                          <span className="text-xs text-gray-500">
                            {performanceIndex + 1} / {filteredPerformance.length}
                          </span>
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
                        {performanceIndex + 1}. {q.title}
                      </p>
                      <p className="mt-6 text-base md:text-lg font-semibold text-gray-900 leading-relaxed">
                        {q.question}
                      </p>

                      <div className="h-px bg-gray-200 mt-6" aria-hidden />

                      <div className="mt-6 space-y-3">
                        {q.options.map((opt, i) => {
                          const isSelected = selected === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setAnswers((a) => {
                                  const next = [...a.performance];
                                  next[performanceIndex] = i;
                                  return { ...a, performance: next };
                                });
                              }}
                              className={`w-full text-left rounded-lg border p-5 transition-colors ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                              }`}
                            >
                              <span className="text-base text-gray-900">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          disabled={!canProceed}
                          onClick={() => {
                            if (performanceIndex < filteredPerformance.length - 1) {
                              setStepTransitionDir("right");
                              setPerformanceIndex((i) => i + 1);
                            } else {
                              goNext();
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
                        >
                          다음
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* 5: 디지털 인바스켓 — 목록 / 시뮬레이션 (AI는 step 6) */}
          {step === 5 && STEP_DETAILS[5] && (
            <>
              {inbasketView === "simulation" && selectedInbasketQuestion ? (
                <InbasketSimulation
                  question={selectedInbasketQuestion}
                  onBack={handleInbasketBackToList}
                  onComplete={() => {
                    const qId = selectedInbasketQuestion.id;
                    setAnswers((a) => ({ ...a, etray: { ...a.etray, [qId]: "completed" } }));
                    setInbasketView("list");
                    setInbasketSelectedId(null);
                  }}
                />
              ) : (
                <InbasketList
                  questions={inbasketQuestions}
                  onStart={(id) => {
                    setInbasketSelectedId(id);
                    setInbasketView("simulation");
                  }}
                  completedCount={inbasketProgress.completed}
                  totalCount={inbasketProgress.total}
                  onNextToResult={goNext}
                />
              )}
            </>
          )}

          {/* 6: AI 활용 탐색 — 기획서 §4.11 (카탈로그·설문·시나리오), 구 aiWorkflowByIndustry 미사용 */}
          {step === 6 && STEP_DETAILS[6] && (
            <DiagnosisAiExplorationStep
              value={answers.aiExploration}
              onChange={(payload) =>
                setAnswers((a) => ({
                  ...a,
                  aiExploration: payload,
                  ai: null,
                }))
              }
              onRequestResult={() => {
                setStepTransitionDir("right");
                setAnalysisLoading(true);
              }}
            />
          )}

          {/* 7: 결과 — 결과 확인하기 버튼만 표시 */}
          {step === 7 && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-[600px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Check className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                  이제 결과를 확인하고
                  <br />
                  성장 전략을 확인하세요.
                </p>
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/app/dashboard")}
                    className="rounded-lg bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700 transition-colors"
                  >
                    결과 확인하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const payload = serializeReportRequest({
                        name: form.name,
                        industry: form.industry,
                        job: form.job,
                      });
                      const previewUrl = `${ROUTES.REPORT_PREVIEW}?payload=${encodeURIComponent(payload)}`;
                      window.open(previewUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="rounded-lg border border-blue-200 text-blue-700 bg-white px-5 py-3 font-semibold hover:bg-blue-50 transition-colors"
                    title="새 창으로 리포트 미리보기"
                  >
                    종합분석 리포트 다운로드
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* 메인(흰 카드) 영역 기준 우측 하단 고정 CTA — 정보(step 1) */}
          {step === 1 && (
            <div className="absolute bottom-6 right-6 z-10">
              <button
                type="button"
                onClick={handleInfoInputNext}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                다음
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* 인바스켓 목록에서 전체 완료 시 → AI 단계 */}
          {step === 5 && inbasketView === "list" && allInbasketComplete && (
            <div className="absolute bottom-6 right-6 z-10">
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-violet-600/25 hover:bg-violet-700 hover:shadow-violet-600/30 transition-all"
              >
                다음: AI 활용 탐색
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
