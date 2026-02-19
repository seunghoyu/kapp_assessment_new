"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import {
  BookOpen,
  Cog,
  TrendingUp,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
  Mailbox,
  Bot,
  BarChart3,
} from "lucide-react";
import userInfoOptions from "@/data/kappDiagnosis/userInfoOptions.json";
import knowledgeData from "@/data/kappDiagnosis/knowledgeQuestions.json";
import applicationData from "@/data/kappDiagnosis/applicationQuestions.json";
import performanceData from "@/data/kappDiagnosis/performanceQuestions.json";
import etrayData from "@/data/kappDiagnosis/etrayByIndustry.json";
import aiWorkflowData from "@/data/kappDiagnosis/aiWorkflowByIndustry.json";

/** KAPP 진단 데이터 안내 + 문항 구성 로직 문서 기준 (kapp_origin flow 동일) */
const STEPS = [
  { id: 0, title: "시작", short: "시작" },
  { id: 1, title: "정보 입력", short: "정보" },
  { id: 2, title: "지식 문항", short: "지식" },
  { id: 3, title: "적용 문항", short: "적용" },
  { id: 4, title: "성과 문항", short: "성과" },
  { id: 5, title: "디지털 인바스켓", short: "인바스켓" },
  { id: 6, title: "AI 워크플로우", short: "AI" },
  { id: 7, title: "결과", short: "결과" },
];

/** 단계별 상세 로직 (KAPP_DIAGNOSIS_QUESTION_LOGIC + KAPP_DIAGNOSIS_DATA_REFERENCE + kapp_origin 동일) */
const STEP_DETAILS: Record<number, { title: string; what: string; criteria: string; logic: string[] }> = {
  1: {
    title: "정보 입력",
    what: "이름, 산업·직무, 직급, 연차, 기업 규모, 진단 목표 등 입력. 한 번만 입력하며, 이후 단계의 문항·시나리오 선정 기준이 됩니다.",
    criteria: "산업·직무 → 세부 직무 2단계 선택. 직급(인턴~임원), 연차(1년 미만~16년 이상), 기업 규모(대기업/중견/중소/스타트업), 진단 목표(복수 선택, 결과 해석·추천에만 사용).",
    logic: [
      "입력 정보는 「어떤 문항이 나올지」와 「이메일/워크플로우 시나리오」를 결정하는 데 사용됩니다.",
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
    what: "받은 이메일을 처리하는 시뮬레이션. 우선순위 결정 및 문제 해결 능력 측정. 산업만 보고 이메일 세트가 정해집니다.",
    criteria: "산업 ○(이메일 세트), 직무/직급/연차/진단목표 사용 안 함.",
    logic: [
      "어떤 이메일: 선택한 산업에 해당하는 이메일 목록 1세트. 예: IT→개발·배포·장애 관련, 금융→여신·리스크·준법 관련.",
      "기록: (1) 어떤 이메일을 열었는지 (2) 각 이메일 액션(열기/답장/전달/보관) (3) 처리 시작~완료 소요 시간.",
      "점수: 긴급도 대응, 제한 시간 내 처리 등으로 생산성 점수 계산.",
    ],
  },
  6: {
    title: "AI 워크플로우 시뮬레이션",
    what: "산업별 정해진 1개 시나리오에서, 업무 상황에 맞는 AI 활용 옵션을 고르는 단계. AI 도구 활용 능력 측정.",
    criteria: "산업 ○(시나리오 1개), 직무/직급/연차/진단목표 사용 안 함.",
    logic: [
      "시나리오: 선택한 산업에 해당하는 AI 워크플로우 시나리오 1개. 예: IT→개발·코드 리뷰, 금융→리스크 리포트·심사.",
      "기록: (1) 시나리오(workflowId) (2) 선택한 옵션 인덱스 (3) 정답 여부 (4) 옵션 요약(시간 단축, 품질 점수 등).",
      "점수: 정답 시 만점/가산, 오답 시 감점 또는 선택 옵션 품질 반영.",
    ],
  },
  7: {
    title: "진단 결과",
    what: "영역별·종합 점수, 지식 수준, 강점/개선 영역 표시. 결과 해석·추천에 진단 목표 활용.",
    criteria: "결과 해석·추천 시 산업/직무/직급/연차/진단 목표 모두 참고.",
    logic: [
      "포함: 입력 정보, 영역별 점수(지식/적용/성과/생산성), 종합 점수, 지식 수준(1~5), 문항별 답, 인바스켓 기록(이메일별 액션·소요시간), AI 워크플로우 기록(선택 옵션·정답 여부).",
      "저장: 한 번의 진단을 한 덩어리로 정규화 저장. 마이페이지·관리자 대시보드에서 조회·집계 연동.",
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
type AiWorkflow = { id: string; industry: string; title: string; task: string; options: { id: string; choice: string; timeReduction: string; qualityScore: number }[]; answer: number; explanation?: string };

const ETRAY_INDUSTRY_KEYS = ["IT", "금융", "의료", "마케팅/광고", "기타"];
const AI_INDUSTRY_KEYS = ["IT", "금융", "의료", "마케팅/광고", "기타"];

export default function DiagnosisPage() {
  const [step, setStep] = useState(0);
  const industryJobData = userInfoOptions.industryJobData as IndustryJobData;
  const positionLevels = userInfoOptions.positionLevels as OptionItem[];
  const experienceYears = userInfoOptions.experienceYears as OptionItem[];
  const companySizes = userInfoOptions.companySizes as (OptionItem & { icon?: string })[];
  const diagnosticGoals = userInfoOptions.diagnosticGoals as OptionItem[];

  const [form, setForm] = useState({
    name: "",
    email: "",
    industry: "",
    job: "",
    position: "",
    experienceYears: "",
    company: "",
    companySize: "",
    diagnosticGoals: [] as string[],
  });

  const [selectedEtrayId, setSelectedEtrayId] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    knowledge: [] as number[],
    application: [] as number[],
    performance: [] as number[],
    etray: {} as Record<string, string>,
    ai: null as number | null,
  });

  const knowledgeList = (knowledgeData as { questions: KnowledgeQ[] }).questions;
  const applicationList = (applicationData as { questions: ApplicationQ[] }).questions;
  const performanceList = (performanceData as { questions: PerformanceQ[] }).questions;
  const etrayByIndustry = (etrayData as { byIndustry: Record<string, EtrayEmail[]> }).byIndustry;
  const aiByIndustry = (aiWorkflowData as { byIndustry: Record<string, AiWorkflow> }).byIndustry;

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

  const aiWorkflow = useMemo(() => {
    const key = AI_INDUSTRY_KEYS.includes(form.industry) ? form.industry : "기타";
    return aiByIndustry[key] ?? aiByIndustry["기타"] ?? null;
  }, [form.industry]);

  const industryList = useMemo(() => Object.keys(industryJobData), [industryJobData]);
  const jobList = useMemo(
    () => (industryJobData[form.industry]?.jobs ?? []) as string[],
    [industryJobData, form.industry]
  );

  /** 문서 기준 userInput 구조 (kappDiagnosisRawData.userInput과 동일) */
  const userInput = useMemo(
    () => ({
      basicInfo: { name: form.name.trim(), email: form.email.trim() || undefined },
      industryAndJob: form.industry ? { industry: form.industry, job: form.job } : undefined,
      careerInfo:
        form.position && form.experienceYears
          ? { position: form.position, experienceYears: form.experienceYears }
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

  const canNextFromInfo = () =>
    form.name.trim() &&
    form.industry &&
    form.job &&
    form.position &&
    form.experienceYears &&
    form.companySize;

  const canNext = () => {
    if (step === 1) return canNextFromInfo();
    return true;
  };

  const goNext = () => {
    if (step === 1) setForm((f) => ({ ...f, job: "" }));
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] max-h-[100vh] overflow-hidden bg-gray-50">
      {/* 상단: 제목만 (진행현황은 메인 카드 우측 상단으로 이동) */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">KAPP 지능형 역량 진단</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Knowledge · Application · Performance · Productivity
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-6">
        <div className="flex-1 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          {/* 진행현황: 메인 카드 우측 상단 (단계별 방향 표시) */}
          <div className="flex-shrink-0 flex justify-end items-center gap-0.5 flex-wrap px-4 py-2 border-b border-gray-100">
            {STEPS.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 && <span className="text-gray-300 text-xs mx-0.5 select-none" aria-hidden>→</span>}
                <button
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors shrink-0 ${
                    step === s.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.short}
                </button>
              </Fragment>
            ))}
          </div>
          {/* 단계별 콘텐츠 (가운데·중앙 배치를 위해 flex 컨테이너) */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          {/* 0: 시작 */}
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="flex gap-4 mb-8">
                {KAPP_BADGES.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className={`w-14 h-14 rounded-xl ${color} text-white flex items-center justify-center`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                맞춤형 역량 진단을 시작합니다
              </h2>
              <p className="text-sm text-gray-600 max-w-md mb-8">
                산업·직무·직급에 맞는 문항으로 약 15분 안에 역량 수준을 파악합니다.
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg bg-blue-600 text-white px-8 py-3 font-semibold hover:bg-blue-700 transition-colors"
              >
                진단 시작하기
              </button>
            </div>
          )}

          {/* 1: 정보 입력 — 화면 가운데 중앙 배치 (kapp_origin start-card 형태) */}
          {step === 1 && (
            <div className="flex-1 flex items-center justify-center overflow-y-auto p-6">
              <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <User className="w-7 h-7" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    맞춤형 역량 진단을 위한 정보 입력
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    귀하의 상황에 최적화된 진단 문항을 제공하기 위해 다음 정보를 입력해주세요
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일 (선택)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">산업군 *</label>
                  <select
                    value={form.industry}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, industry: e.target.value, job: "" }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    {industryList.map((ind) => (
                      <option key={ind} value={ind}>
                        {industryJobData[ind]?.icon ?? ""} {ind}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">세부 직무 *</label>
                  <select
                    value={form.job}
                    onChange={(e) => setForm((f) => ({ ...f, job: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!form.industry}
                  >
                    <option value="">
                      {form.industry ? "선택해주세요" : "먼저 산업군을 선택해주세요"}
                    </option>
                    {jobList.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">직급 *</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">연차 *</label>
                  <select
                    value={form.experienceYears}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, experienceYears: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사명 (선택)
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="소속 회사"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">기업 규모 *</label>
                  <select
                    value={form.companySize}
                    onChange={(e) => setForm((f) => ({ ...f, companySize: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">선택해주세요</option>
                    {companySizes.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.icon ?? ""} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    진단 목표 (선택, 복수 선택 가능)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {diagnosticGoals.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => toggleGoal(g.value)}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
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
              </div>
                <p className="text-xs text-gray-500 mt-4 text-center flex items-center justify-center gap-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">i</span>
                  입력하신 정보는 맞춤형 진단에만 활용되며, 암호화되어 안전하게 보호됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 2: 지식 문항 — 업종·직무별 문항 전부 표시 (가상 데이터) */}
          {step === 2 && STEP_DETAILS[2] && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{STEP_DETAILS[2].title}</h2>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">기준: </span>
                  {STEP_DETAILS[2].criteria}
                </div>
                {filteredKnowledge.length === 0 ? (
                  <p className="text-gray-500 py-4">선택한 산업·직무에 해당하는 지식 문항이 없습니다. 정보 입력에서 산업·직무를 선택한 뒤 진행해 주세요.</p>
                ) : (
                  <div className="space-y-6">
                    {filteredKnowledge.map((q, idx) => (
                      <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            {q.industry || "공통"}{q.job ? ` · ${q.job}` : ""} · {q.difficulty}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-3">{idx + 1}. {q.question}</p>
                        <ul className="space-y-2">
                          {q.options.map((opt, i) => (
                            <li key={i}>
                              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 p-2 hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
                                <input
                                  type="radio"
                                  name={`knowledge-${q.id}`}
                                  checked={(answers.knowledge[idx] ?? null) === i}
                                  onChange={() => {
                                    setAnswers((a) => {
                                      const next = [...a.knowledge];
                                      next[idx] = i;
                                      return { ...a, knowledge: next };
                                    });
                                  }}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="text-sm">{opt}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                        {q.explanation && answers.knowledge[idx] !== undefined && (
                          <p className="mt-3 text-xs text-gray-500 border-t pt-2">{q.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3: 적용 문항 — 업종·직무·직급별 시나리오 전부 표시 */}
          {step === 3 && STEP_DETAILS[3] && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{STEP_DETAILS[3].title}</h2>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">기준: </span>
                  {STEP_DETAILS[3].criteria}
                </div>
                {filteredApplication.length === 0 ? (
                  <p className="text-gray-500 py-4">선택한 산업·직무·직급에 해당하는 적용 문항이 없습니다.</p>
                ) : (
                  <div className="space-y-6">
                    {filteredApplication.map((q, idx) => (
                      <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            {q.industry || "공통"}{q.job ? ` · ${q.job}` : ""}{q.position ? ` · ${q.position}` : ""}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{q.title}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap mb-3">{q.scenario}</p>
                        <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                        <ul className="space-y-2">
                          {q.options.map((opt, i) => (
                            <li key={i}>
                              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 p-2 hover:bg-gray-50 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50">
                                <input
                                  type="radio"
                                  name={`application-${q.id}`}
                                  checked={(answers.application[idx] ?? null) === i}
                                  onChange={() => {
                                    setAnswers((a) => {
                                      const next = [...a.application];
                                      next[idx] = i;
                                      return { ...a, application: next };
                                    });
                                  }}
                                  className="h-4 w-4 text-emerald-600"
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4: 성과 문항 — 업종·직무별 전부 표시 */}
          {step === 4 && STEP_DETAILS[4] && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{STEP_DETAILS[4].title}</h2>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">기준: </span>
                  {STEP_DETAILS[4].criteria}
                </div>
                {filteredPerformance.length === 0 ? (
                  <p className="text-gray-500 py-4">선택한 산업·직무에 해당하는 성과 문항이 없습니다.</p>
                ) : (
                  <div className="space-y-6">
                    {filteredPerformance.map((q, idx) => (
                      <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                            {q.industry || "공통"}{q.job ? ` · ${q.job}` : ""}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{q.title}</h3>
                        <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                        <ul className="space-y-2">
                          {q.options.map((opt, i) => (
                            <li key={i}>
                              <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 p-2 hover:bg-gray-50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/50">
                                <input
                                  type="radio"
                                  name={`performance-${q.id}`}
                                  checked={(answers.performance[idx] ?? null) === i}
                                  onChange={() => {
                                    setAnswers((a) => {
                                      const next = [...a.performance];
                                      next[idx] = i;
                                      return { ...a, performance: next };
                                    });
                                  }}
                                  className="h-4 w-4 text-amber-600"
                                />
                                <span className="text-sm">{opt.label}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5: 디지털 인바스켓 — 왼쪽: 안 읽은 메일 목록, 가운데: 클릭 시 본문 */}
          {step === 5 && STEP_DETAILS[5] && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-shrink-0 px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">{STEP_DETAILS[5].title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">현재 산업: {form.industry || "(미선택 → 기타)"} · 메일을 클릭하면 본문이 가운데에 표시됩니다.</p>
              </div>
              {etrayEmails.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-6">
                  <p className="text-gray-500">해당 산업의 인바스켓 이메일 세트가 없습니다.</p>
                </div>
              ) : (
                <div className="flex-1 flex min-h-0">
                  {/* 왼쪽: 안 읽은 메일 목록 */}
                  <div className="w-72 sm:w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
                    <div className="p-2 border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-600">
                      안 읽은 메일 ({etrayEmails.length})
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {etrayEmails.map((em) => (
                        <li key={em.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedEtrayId(em.id)}
                            className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-l-2 ${
                              selectedEtrayId === em.id
                                ? "border-violet-500 bg-violet-50/50"
                                : "border-transparent"
                            }`}
                          >
                            <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mr-1.5 ${
                              em.priority === "critical" ? "bg-red-100 text-red-800" :
                              em.priority === "high" ? "bg-orange-100 text-orange-800" :
                              em.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                            }`}>
                              {em.priority}
                            </span>
                            <span className="text-xs text-gray-500">{em.time}</span>
                            <p className="font-medium text-gray-900 truncate text-sm mt-1" title={em.subject}>{em.subject}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{em.sender}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* 가운데: 선택한 메일 본문 */}
                  <div className="flex-1 min-w-0 overflow-y-auto bg-gray-50/50 p-4">
                    {selectedEtrayId ? (() => {
                      const em = etrayEmails.find((e) => e.id === selectedEtrayId);
                      if (!em) return null;
                      return (
                        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                          <div className="p-4 border-b border-gray-200">
                            <p className="text-xs text-gray-500">{em.sender}</p>
                            <h3 className="font-semibold text-gray-900 mt-1">{em.subject}</h3>
                            <p className="text-xs text-gray-500 mt-1">{em.time}</p>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{em.body}</p>
                          </div>
                          <div className="p-3 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-2">
                            <span className="text-xs text-gray-500 mr-2">이 메일에 대한 액션:</span>
                            {["열기", "답장", "전달", "보관"].map((action) => (
                              <button
                                key={action}
                                type="button"
                                onClick={() => setAnswers((a) => ({ ...a, etray: { ...a.etray, [em.id]: action } }))}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium border ${
                                  answers.etray[em.id] === action
                                    ? "border-violet-500 bg-violet-500 text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        왼쪽 목록에서 메일을 클릭하면 본문이 여기에 표시됩니다.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6: AI 워크플로우 — 산업별 시나리오 1개 전부 표시 */}
          {step === 6 && STEP_DETAILS[6] && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{STEP_DETAILS[6].title}</h2>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 mb-4 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">기준: </span>
                  {STEP_DETAILS[6].criteria}
                  <span className="block mt-1 text-gray-500">현재 산업: {form.industry || "(미선택 → 기타)"}</span>
                </div>
                {!aiWorkflow ? (
                  <p className="text-gray-500 py-4">해당 산업의 AI 워크플로우 시나리오가 없습니다.</p>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                        {aiWorkflow.industry}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{aiWorkflow.title}</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{aiWorkflow.task}</p>
                    <p className="font-medium text-gray-900 mb-3">선택지:</p>
                    <ul className="space-y-2">
                      {aiWorkflow.options.map((opt, i) => (
                        <li key={opt.id}>
                          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50 has-[:checked]:border-violet-500 has-[:checked]:bg-violet-50/50">
                            <input
                              type="radio"
                              name="ai-workflow"
                              checked={answers.ai === i}
                              onChange={() => setAnswers((a) => ({ ...a, ai: i }))}
                              className="h-4 w-4 text-violet-600"
                            />
                            <span className="text-sm font-medium">{opt.choice}</span>
                            <span className="text-xs text-gray-500 ml-auto">시간 단축 {opt.timeReduction}, 품질 {opt.qualityScore}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    {aiWorkflow.explanation && answers.ai !== null && (
                      <p className="mt-3 text-xs text-gray-500 border-t pt-2">{aiWorkflow.explanation}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7: 결과 — 로직 설명만 (실제 점수/저장은 추후 연동) */}
          {step === 7 && STEP_DETAILS[7] && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{STEP_DETAILS[7].title}</h2>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">무엇을 하나요?</h3>
                  <p className="text-sm text-gray-600">{STEP_DETAILS[7].what}</p>
                </div>
                <div className="rounded-lg bg-blue-50/50 border border-blue-100 p-4 mb-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">문항/시나리오가 정해지는 기준</h3>
                  <p className="text-sm text-gray-700">{STEP_DETAILS[7].criteria}</p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  {STEP_DETAILS[7].logic.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-4">영역별·종합 점수, 강점/개선 영역 표시는 추후 연동됩니다. 현재는 입력·문항 답이 상태로 저장되어 있습니다.</p>
              </div>
            </div>
          )}
          </div>
          {/* 이전 / 다음: 메인 카드 좌하·우하 */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" />
              이전
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={step === 1 && !canNext()}
                className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-6 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                다음
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-20" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
