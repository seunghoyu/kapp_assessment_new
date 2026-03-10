"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  BarChart3,
  MapPin,
  Route,
  FileText,
  GraduationCap,
  User,
  Award,
  Table2,
  Activity,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import dashboardData from "@/data/consumer/dashboard.json";
import careerPathData from "@/data/consumer/careerPathByIndustry.json";
import dailyTipsData from "@/data/consumer/dailyTips.json";
import DailyTipWidget from "@/components/dashboard/DailyTipWidget";
import CertificateModal from "./CertificateModal";

type DashboardTab = "my-competency" | "roadmap";
type CompetencyViewTab = "bar" | "table" | "radar";

type MarketAction = { icon: string; title: string; description: string; priority: string };

const { kappLabels, scores, insights, marketPosition, marketBenchmark, industryBenchmark, marketActions, recommendedActions, roadmap } = dashboardData as {
  kappLabels: { key: string; label: string; short: string }[];
  scores: { my: Record<string, number>; positionAverage: Record<string, number> };
  insights: { id: string; title: string; desc: string; type: string }[];
  marketPosition: {
    currentLevel: string;
    percentile: string;
    strengthCount: number;
    improvementCount: number;
    averageCount: number;
    opportunitySummary: string;
    currentLevelDesc?: string;
    competitivenessDesc?: string;
    opportunityDesc?: string;
  };
  marketBenchmark: { positionAvgScore: number; myAvgScore: number; percentileRank: string };
  industryBenchmark?: Record<string, number>;
  marketActions?: MarketAction[];
  recommendedActions: string[];
  roadmap: { careerSimulatorDescription: string; careerPlaceholder: string; idpDescription: string; idpItems: string[] };
};

const industryBenchmarkFallback = { knowledge: 92, application: 90, performance: 91, productivity: 93 };
const marketActionsFallback: MarketAction[] = [
  { icon: "📚", title: "지식 역량 강화", description: "산업 트렌드와 최신 기술 습득을 위한 학습 추천", priority: "high" },
  { icon: "🔨", title: "실무 프로젝트 참여", description: "실전 경험을 통한 적용 능력 향상 필요", priority: "high" },
];

type CareerPathNode = { role: string; skills: string[] };
type CareerPathMilestone = CareerPathNode & { year: string; probability: number };
type CareerPathItem = {
  current: CareerPathNode;
  milestone1: CareerPathMilestone;
  milestone2: CareerPathMilestone;
};
type LearningPathItem = { title: string; duration: string; priority: string };

const careerByIndustry = (careerPathData as { data: Record<string, { paths: CareerPathItem[]; learningPath: LearningPathItem[] }> }).data;
const industries = (careerPathData as { industries?: string[] }).industries ?? Object.keys(careerByIndustry);

const MOCK_KAPP_INDUSTRIES = [
  "농업, 임업 및 어업",
  "광업",
  "제조업",
  "전기, 가스, 증기 및 공기조절 공급업",
  "수도, 하수 및 폐기물 처리, 원료 재생업",
  "건설업",
  "도매 및 소매업",
  "운수 및 창고업",
  "숙박 및 음식점업",
  "정보통신업",
  "금융 및 보험업",
  "부동산 임대 및 공급업",
  "전문, 과학 및 기술 서비스업",
  "사업시설 관리, 사업 지원 및 임대 서비스업",
  "공공 행정, 국방 및 사회보장 행정",
  "교육 서비스업",
  "보건업 및 사회복지 서비스업",
  "예술, 스포츠 및 여가 관련 서비스업",
  "협회 및 단체, 수리 및 기타 개인 서비스업",
  "가구 내 고용 활동 및 달리 분류되지 않은 자가 소비 생산 활동",
  "국제 및 외국기관",
] as const;

export default function ConsumerDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>("my-competency");
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  // 가상 프론트 기본 ON (명시적으로 false일 때만 OFF)
  const isMockFront = process.env.NEXT_PUBLIC_MOCK_FRONT !== "false";
  const [careerIndustry, setCareerIndustry] = useState<string>(() => {
    if (isMockFront) return MOCK_KAPP_INDUSTRIES[0] ?? "정보통신업";
    return "IT";
  });
  const [careerPathIndex, setCareerPathIndex] = useState(0);
  const [competencyViewTab, setCompetencyViewTab] = useState<CompetencyViewTab>("radar");
  const [marketBenchmarkView, setMarketBenchmarkView] = useState<CompetencyViewTab>("radar");
  const [selectedMajorIndustryName, setSelectedMajorIndustryName] = useState<string>("");

  const ib = industryBenchmark ?? industryBenchmarkFallback;
  const actions = (marketActions && marketActions.length > 0) ? marketActions : marketActionsFallback;

  const radarData = useMemo(() => {
    return kappLabels.map(({ key, short }) => ({
      subject: short,
      나: scores.my[key] ?? 0,
      직급평균: scores.positionAverage[key] ?? 0,
      fullMark: 100,
    }));
  }, [kappLabels, scores.my, scores.positionAverage]);

  const barData = useMemo(() => {
    return kappLabels.map(({ key, short }) => ({
      name: short,
      나: scores.my[key] ?? 0,
      직급평균: scores.positionAverage[key] ?? 0,
    }));
  }, [kappLabels, scores.my, scores.positionAverage]);

  const industryRadarData = useMemo(() => {
    const bench: Record<string, number> = ib as Record<string, number>;
    return kappLabels.map(({ key, short }) => ({
      subject: short,
      "업계 상위 10%": bench[key] ?? 0,
      "나의 점수": scores.my[key] ?? 0,
      fullMark: 100,
    }));
  }, [kappLabels, ib, scores.my]);

  const industryBarData = useMemo(() => {
    const bench: Record<string, number> = ib as Record<string, number>;
    return kappLabels.map(({ key, short }) => ({
      name: short,
      "업계 상위 10%": bench[key] ?? 0,
      "나의 점수": scores.my[key] ?? 0,
    }));
  }, [kappLabels, ib, scores.my]);

  const industryOptions = useMemo(
    () => (isMockFront ? [...MOCK_KAPP_INDUSTRIES] : industries),
    [isMockFront]
  );
  const careerIndustryData = careerByIndustry[careerIndustry] ?? careerByIndustry["기타"] ?? careerByIndustry["IT"];
  const jobOptionCount = isMockFront ? 4 : Math.max(1, careerIndustryData?.paths?.length ?? 1);
  const careerPath: CareerPathItem | undefined = careerIndustryData?.paths?.[careerPathIndex] ?? careerIndustryData?.paths?.[0];
  const careerLearningPath: LearningPathItem[] = careerIndustryData?.learningPath ?? [];

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("kapp_diagnosis_state");
      if (!raw) return;
      const parsed = JSON.parse(raw) as { form?: { industry?: string } };
      const name = parsed?.form?.industry;
      if (typeof name === "string") {
        setSelectedMajorIndustryName(name);
        if (!isMockFront) setCareerIndustry(name);
      }
    } catch {
      // ignore
    }
  }, [isMockFront]);

  // 옵션이 바뀌었는데 현재 값이 유효하지 않으면 첫 옵션으로 보정
  useEffect(() => {
    if (!industryOptions.includes(careerIndustry)) {
      setCareerIndustry(industryOptions[0] ?? careerIndustry);
      setCareerPathIndex(0);
    }
  }, [industryOptions, careerIndustry]);

  useEffect(() => {
    if (isMockFront) return;
    const maxIndex = (careerIndustryData?.paths?.length ?? 1) - 1;
    if (careerPathIndex > maxIndex) setCareerPathIndex(0);
  }, [isMockFront, careerIndustryData, careerPathIndex]);

  const allTips = (dailyTipsData as { tips?: { category?: string; text: string; industries?: string[] }[] }).tips ?? [];
  const dailyTips = useMemo(() => {
    const major = selectedMajorIndustryName.trim();
    const picked = allTips.filter((t) => {
      const tags = (t.industries && t.industries.length > 0) ? t.industries : ["공통"];
      if (!major) return tags.includes("공통");
      return tags.includes("공통") || tags.includes(major);
    });
    const uniq: { category: string; text: string }[] = [];
    const seen = new Set<string>();
    for (const t of picked) {
      const key = t.text.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      uniq.push({ category: t.category ?? "", text: t.text });
    }
    return uniq;
  }, [allTips, selectedMajorIndustryName]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50">
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900">마이 대시보드</h1>
          <p className="text-xs text-gray-500 mt-0.5">KAPP 진단 기반 역량 현황</p>
        </div>
        <div className="flex items-center gap-5 flex-shrink-0">
          {dailyTips.length > 0 && <DailyTipWidget tips={dailyTips} />}
          <button
            type="button"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="프로필"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 탭: 내 역량 | 성장 로드맵 / 우측 인증서 */}
      <div className="flex-shrink-0 flex border-b border-gray-200 bg-white px-4 items-center justify-between">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab("my-competency")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "my-competency"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            내 역량
          </button>
          <button
            type="button"
            onClick={() => setTab("roadmap")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "roadmap"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            성장 로드맵
          </button>
        </div>
        <button
          type="button"
          onClick={() => setCertModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Award className="w-5 h-5 text-blue-600" />
          인증서 다운로드
        </button>
      </div>

      <CertificateModal open={certModalOpen} onClose={() => setCertModalOpen(false)} />

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <div className="w-full max-w-full space-y-6">
          {/* ─── 내 역량: Split View + 시장 포지션 분석 하단 ─── */}
          {tab === "my-competency" && (
            <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full min-h-0">
              {/* 좌측 스플릿: AI 분석 인사이트 — 세로로 3개 카드 (5:5) */}
              <section className="lg:w-1/2 lg:min-w-0 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-800">AI 분석 인사이트</h2>
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1 min-h-0">
                  {insights.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-left flex-shrink-0"
                    >
                      <span className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold mb-2 bg-blue-100 text-blue-800">
                        {item.title}
                      </span>
                      <p className="text-sm text-gray-700">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 우측 스플릿: KAPP 4차원 역량 점수 — 탭(아이콘)으로 막대/테이블/레이더 전환 (5:5) */}
              <section className="lg:w-1/2 lg:min-w-0 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-sm font-semibold text-gray-800">KAPP 4차원 역량 점수</h2>
                  </div>
                  <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100" role="tablist" aria-label="뷰 전환">
                    <button
                      type="button"
                      onClick={() => setCompetencyViewTab("bar")}
                      className={`p-2 rounded-md transition-colors ${competencyViewTab === "bar" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                      title="막대 그래프"
                      aria-pressed={competencyViewTab === "bar"}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompetencyViewTab("table")}
                      className={`p-2 rounded-md transition-colors ${competencyViewTab === "table" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                      title="테이블 뷰"
                      aria-pressed={competencyViewTab === "table"}
                    >
                      <Table2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompetencyViewTab("radar")}
                      className={`p-2 rounded-md transition-colors ${competencyViewTab === "radar" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                      title="레이더 차트"
                      aria-pressed={competencyViewTab === "radar"}
                    >
                      <Activity className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 min-h-[280px] flex items-center justify-center">
                  {competencyViewTab === "bar" && (
                    <div className="w-full h-full min-h-[260px]">
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="30%">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Tooltip formatter={(value, name) => [`${Number(value)}점`, name ?? ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                          <Bar dataKey="나" fill="#2563eb" radius={[4, 4, 0, 0]} name="본인" barSize={24} />
                          <Bar dataKey="직급평균" fill="#94a3b8" radius={[4, 4, 0, 0]} name="직급 평균" barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {competencyViewTab === "table" && (
                    <div className="w-full overflow-auto">
                      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">역량</th>
                            <th className="text-right py-3 px-3 font-semibold text-blue-600">본인 점수</th>
                            <th className="text-right py-3 px-3 font-semibold text-gray-600">직급 평균 점수</th>
                          </tr>
                        </thead>
                        <tbody>
                          {kappLabels.map(({ key, short }) => (
                            <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 font-medium text-gray-800">{short}</td>
                              <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{scores.my[key]}점</td>
                              <td className="py-2.5 px-3 text-right text-gray-600">{scores.positionAverage[key]}점</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {competencyViewTab === "radar" && (
                    <div className="w-full flex items-center justify-center min-h-[280px]">
                      <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            formatter={(value, name) => [`${Number(value)}점`, name ?? ""]}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Radar
                            name="본인"
                            dataKey="나"
                            stroke="#2563eb"
                            fill="#2563eb"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Radar
                            name="직급 평균"
                            dataKey="직급평균"
                            stroke="#94a3b8"
                            fill="transparent"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* 시장 포지션 분석 (내 역량 하단) */}
            <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-sm font-semibold text-gray-800">시장 포지션 분석</h2>
                <p className="text-xs text-gray-500 mt-0.5">업계 대비 나의 위치와 성장 기회</p>
              </div>
              <div className="p-4 flex flex-col lg:flex-row gap-6">
                  {/* 좌측 50%: 산업군 벤치마크 — 테이블/막대/레이더 뷰 전환 (아이콘 우측 상단) */}
                  <div className="lg:w-1/2 min-h-[400px] flex flex-col min-w-0">
                    <div className="flex-shrink-0 mb-2 flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-600">산업군 벤치마크 (상위 10% vs 나)</h4>
                        <p className="text-xs text-gray-500 mt-0.5">업계 최상위권과의 역량 비교를 통해 개선 포인트를 파악하세요</p>
                      </div>
                      <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 shrink-0" role="tablist" aria-label="뷰 전환">
                        <button
                          type="button"
                          onClick={() => setMarketBenchmarkView("table")}
                          className={`p-2 rounded-md transition-colors ${marketBenchmarkView === "table" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                          title="테이블 뷰"
                          aria-pressed={marketBenchmarkView === "table"}
                        >
                          <Table2 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMarketBenchmarkView("bar")}
                          className={`p-2 rounded-md transition-colors ${marketBenchmarkView === "bar" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                          title="막대 그래프"
                          aria-pressed={marketBenchmarkView === "bar"}
                        >
                          <BarChart3 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMarketBenchmarkView("radar")}
                          className={`p-2 rounded-md transition-colors ${marketBenchmarkView === "radar" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                          title="레이더 차트"
                          aria-pressed={marketBenchmarkView === "radar"}
                        >
                          <Activity className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[320px] w-full min-w-0 flex flex-col">
                      {marketBenchmarkView === "table" && (
                        <div className="flex-1 min-h-0 w-full flex items-center justify-center overflow-auto">
                          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden max-w-lg">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-3 font-semibold text-gray-700">역량</th>
                                <th className="text-right py-3 px-3 font-semibold text-red-600">업계 상위 10%</th>
                                <th className="text-right py-3 px-3 font-semibold text-blue-600">나의 점수</th>
                              </tr>
                            </thead>
                            <tbody>
                              {kappLabels.map(({ key, short }) => (
                                <tr key={key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                  <td className="py-2.5 px-3 font-medium text-gray-800">{short}</td>
                                  <td className="py-2.5 px-3 text-right text-red-600">{(ib as Record<string, number>)[key] ?? 0}점</td>
                                  <td className="py-2.5 px-3 text-right font-semibold text-blue-600">{scores.my[key]}점</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {marketBenchmarkView === "bar" && (
                        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                          <div className="w-[88%] h-[88%] min-h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={industryBarData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="30%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(value, name) => [`${Number(value)}점`, name ?? ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                                <Bar dataKey="업계 상위 10%" fill="#ef4444" radius={[4, 4, 0, 0]} name="업계 상위 10%" barSize={24} />
                                <Bar dataKey="나의 점수" fill="#2563eb" radius={[4, 4, 0, 0]} name="나의 점수" barSize={24} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                      {marketBenchmarkView === "radar" && (
                        <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                          <div className="w-[88%] h-[88%] min-h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={industryRadarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11 }} />
                                <Tooltip
                                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                                  formatter={(value, name) => [`${Number(value)}점`, name ?? ""]}
                                />
                                <Radar
                                  name="업계 상위 10%"
                                  dataKey="업계 상위 10%"
                                  stroke="#ef4444"
                                  fill="rgba(239,68,68,0.1)"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                />
                                <Radar
                                  name="나의 점수"
                                  dataKey="나의 점수"
                                  stroke="#2563eb"
                                  fill="rgba(37,99,235,0.2)"
                                  strokeWidth={2}
                                />
                                <Legend />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 우측 50%: 현재 포지션 + 상위권 추천 액션 */}
                  <div className="lg:w-1/2 flex-shrink-0 min-w-0 flex flex-col gap-4">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <h3 className="text-sm font-semibold text-gray-800">현재 포지션</h3>
                        </div>
                        <span className="inline-flex items-center rounded-md bg-blue-100 px-2.5 py-1 text-sm font-semibold text-blue-800 shadow-sm">
                          {marketBenchmark.percentileRank}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">{marketPosition.currentLevel}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {(marketPosition as { currentLevelDesc?: string }).currentLevelDesc ?? `업계 상위 약 ${marketPosition.percentile}%`}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 flex flex-col flex-1 min-h-0">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex-shrink-0">상위권 진입을 위한 추천 액션</h4>
                      <div className="space-y-2">
                        {actions.map((action, i) => (
                          <div
                            key={i}
                            className={`rounded-lg border p-3 flex items-start gap-3 ${
                              action.priority === "high" ? "border-red-100 bg-red-50/50" : action.priority === "medium" ? "border-amber-100 bg-amber-50/50" : "border-gray-100 bg-gray-50/50"
                            }`}
                          >
                            <span className="text-lg flex-shrink-0">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{action.title}</p>
                              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{action.description}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${action.priority === "high" ? "bg-red-100 text-red-700" : action.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-600"}`}>
                              {action.priority === "high" ? "높음" : action.priority === "medium" ? "중간" : "낮음"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ─── 성장 로드맵 탭 ─── */}
          {tab === "roadmap" && (
            <div className="space-y-6">
              <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Route className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-800">커리어 경로 시뮬레이터</h2>
                  <span className="ml-auto inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                    실제 운영환경: KAPP 진단 산업군 자동 반영
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">{roadmap.careerSimulatorDescription}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <label className="text-xs text-gray-500 self-center">산업군</label>
                    <select
                      value={careerIndustry}
                      onChange={(e) => { setCareerIndustry(e.target.value); setCareerPathIndex(0); }}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                    >
                      {industryOptions.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    <select
                      value={careerPathIndex}
                      onChange={(e) => setCareerPathIndex(Number(e.target.value))}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                      disabled={!isMockFront && (careerIndustryData?.paths?.length ?? 0) <= 1}
                      aria-disabled={!isMockFront && (careerIndustryData?.paths?.length ?? 0) <= 1}
                      title={!isMockFront && (careerIndustryData?.paths?.length ?? 0) <= 1 ? "선택 가능한 직무가 1개입니다" : "직무 선택"}
                    >
                      {Array.from({ length: jobOptionCount }, (_, i) => (
                        <option key={i} value={i}>직무 {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  {careerPath && (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex flex-wrap items-stretch divide-x divide-gray-200">
                        <div className="flex-1 min-w-[120px] p-4 bg-blue-50/50">
                          <div className="text-xs font-medium text-blue-600 mb-1">현재</div>
                          <div className="text-sm font-semibold text-gray-900">{careerPath.current.role}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(careerPath.current.skills ?? []).map((s, i) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 min-w-[120px] p-4 bg-gray-50/50">
                          <div className="text-xs font-medium text-gray-500 mb-1">{careerPath.milestone1.year}</div>
                          <div className="text-sm font-semibold text-gray-900">{careerPath.milestone1.role}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(careerPath.milestone1.skills ?? []).map((s, i) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 min-w-[120px] p-4 bg-gray-100/50">
                          <div className="text-xs font-medium text-gray-500 mb-1">{careerPath.milestone2.year}</div>
                          <div className="text-sm font-semibold text-gray-900">{careerPath.milestone2.role}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(careerPath.milestone2.skills ?? []).map((s, i) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">목표 달성을 위한 추천 학습 경로</h4>
                    <div className="space-y-2">
                      {careerLearningPath.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 bg-gray-50/50">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium flex items-center justify-center">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">기간: {item.duration} · 우선순위: {item.priority}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCoursesModal(true)}
                    className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    <GraduationCap className="w-4 h-4" />
                    추천 강의 둘러보기
                  </button>
                </div>
              </section>
              <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-800">AI 생성 개인 개발 계획 (IDP)</h2>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">{roadmap.idpDescription}</p>
                  <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 space-y-2 text-sm text-gray-700">
                    {roadmap.idpItems.map((item, i) => (
                      <p key={i}>• {item}</p>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* 모달: 추천 강의 둘러보기 */}
      {showCoursesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCoursesModal(false)}>
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-gray-700">추천 강의를 둘러보시겠습니까? 교육 페이지로 이동합니다.</p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowCoursesModal(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
              <button type="button" onClick={() => { setShowCoursesModal(false); router.push("/app/education"); }} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">강의 둘러보기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
