"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  BarChart3,
  MapPin,
  Trophy,
  Rocket,
  Route,
  FileText,
  GraduationCap,
  ChartLine,
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

type DashboardTab = "my-competency" | "market" | "roadmap";

type MarketAction = { icon: string; title: string; description: string; priority: string };

const { kappLabels, scores, insights, marketPosition, marketBenchmark, industryBenchmark, marketActions, recommendedActions, roadmap } = dashboardData as {
  kappLabels: { key: string; label: string; short: string }[];
  scores: { my: Record<string, number>; positionAverage: Record<string, number> };
  insights: { id: string; title: string; desc: string; type: string }[];
  marketPosition: { currentLevel: string; percentile: string; strengthCount: number; improvementCount: number; averageCount: number; opportunitySummary: string };
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

export default function ConsumerDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>("my-competency");
  const [showGrowthPlanModal, setShowGrowthPlanModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [careerIndustry, setCareerIndustry] = useState("IT");
  const [careerPathIndex, setCareerPathIndex] = useState(0);

  const ib = industryBenchmark ?? industryBenchmarkFallback;
  const actions = (marketActions && marketActions.length > 0) ? marketActions : marketActionsFallback;

  const radarData = useMemo(() => {
    return kappLabels.map(({ key, label }) => ({
      subject: label,
      나: scores.my[key] ?? 0,
      직급평균: scores.positionAverage[key] ?? 0,
      fullMark: 100,
    }));
  }, [kappLabels, scores.my, scores.positionAverage]);

  const barData = useMemo(() => {
    return kappLabels.map(({ key, label }) => ({
      name: label,
      나: scores.my[key] ?? 0,
      직급평균: scores.positionAverage[key] ?? 0,
    }));
  }, [kappLabels, scores.my, scores.positionAverage]);

  const industryRadarData = useMemo(() => {
    const bench: Record<string, number> = ib as Record<string, number>;
    return kappLabels.map(({ key, label }) => ({
      subject: label,
      "업계 상위 10%": bench[key] ?? 0,
      "나의 점수": scores.my[key] ?? 0,
      fullMark: 100,
    }));
  }, [kappLabels, ib, scores.my]);

  const careerIndustryData = careerByIndustry[careerIndustry] ?? careerByIndustry["기타"] ?? careerByIndustry["IT"];
  const careerPath: CareerPathItem | undefined = careerIndustryData?.paths?.[careerPathIndex] ?? careerIndustryData?.paths?.[0];
  const careerLearningPath: LearningPathItem[] = careerIndustryData?.learningPath ?? [];

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50">
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">마이 대시보드</h1>
        <p className="text-xs text-gray-500 mt-0.5">KAPP 진단 기반 역량 현황</p>
      </div>

      {/* 탭: 시장·경쟁력 | 성장 로드맵 (내 역량은 탭 없이 기본) */}
      <div className="flex-shrink-0 flex border-b border-gray-200 bg-white px-4">
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
          onClick={() => setTab("market")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === "market"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          시장·경쟁력
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

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <div className="w-full max-w-full space-y-6">
          {/* ─── 내 역량 (기본) ─── */}
          {tab === "my-competency" && (
            <>
              {/* AI 인사이트: 항상 카드뷰 상단 */}
              <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-800">AI 분석 인사이트</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {insights.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 text-left"
                      >
                        <p className="text-xs font-medium text-gray-500 mb-1">{item.title}</p>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* KAPP 4차원 역량 점수 + 레이더 */}
              <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-semibold text-gray-800">KAPP 4차원 역량 점수</h2>
                </div>
                <div className="p-4 flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/2 flex items-center justify-center min-h-[260px]">
                    <ResponsiveContainer width="100%" height={260}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          formatter={(value, name) => [`${Number(value)}점`, name ?? ""]}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Radar
                          name="나"
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
                  <div className="lg:w-1/2">
                    <div className="grid grid-cols-2 gap-3">
                      {kappLabels.map(({ key, short }) => (
                        <div
                          key={key}
                          title={`${short}: 나 ${scores.my[key]}점, 직급 평균 ${scores.positionAverage[key]}점`}
                          className="rounded-lg border border-gray-100 p-3 flex justify-between items-center cursor-default"
                        >
                          <span className="text-sm font-medium text-gray-700">{short}</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-blue-600">{scores.my[key]}</span>
                            <span className="text-xs text-gray-400">vs {scores.positionAverage[key]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ─── 시장·경쟁력 탭 ─── */}
          {tab === "market" && (
            <div className="space-y-6">
              <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-800">시장 포지션 분석</h2>
                  <p className="text-xs text-gray-500 mt-0.5">업계 대비 나의 위치와 성장 기회</p>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-semibold text-gray-800">현재 포지션</h3>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{marketPosition.currentLevel}</p>
                    <p className="text-xs text-gray-500">업계 상위 약 {marketPosition.percentile}%</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-semibold text-gray-800">경쟁력 분석</h3>
                    </div>
                    <p className="text-sm text-gray-600">강점 스킬 {marketPosition.strengthCount}개, 개선 필요 {marketPosition.improvementCount}개</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Rocket className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-gray-800">성장 기회</h3>
                    </div>
                    <p className="text-sm text-gray-600">{marketPosition.opportunitySummary}</p>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">산업군 벤치마크 (상위 10% vs 나)</h4>
                  <p className="text-xs text-gray-500 mb-2">업계 최상위권과의 역량 비교를 통해 개선 포인트를 파악하세요</p>
                  <div className="h-[240px] rounded-lg">
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={industryRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
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
                <div className="px-4 pb-4">
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">상위권 진입을 위한 추천 액션</h4>
                  <div className="space-y-2 mb-4">
                    {actions.map((action, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-3 flex items-start gap-3 ${
                          action.priority === "high" ? "border-red-100 bg-red-50/50" : action.priority === "medium" ? "border-amber-100 bg-amber-50/50" : "border-gray-100 bg-gray-50/50"
                        }`}
                      >
                        <span className="text-lg">{action.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{action.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{action.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${action.priority === "high" ? "bg-red-100 text-red-700" : action.priority === "medium" ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-600"}`}>
                          {action.priority === "high" ? "높음" : action.priority === "medium" ? "중간" : "낮음"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGrowthPlanModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    <ChartLine className="w-4 h-4" />
                    맞춤 성장 플랜 시작하기
                  </button>
                </div>
              </section>
              <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-sm font-semibold text-gray-800">시장 벤치마킹</h2>
                  <p className="text-xs text-gray-500 mt-0.5">동일 업계 대비 나의 위치</p>
                </div>
                <div className="p-4 h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value, name) => [`${Number(value)}점`, name ?? ""]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Bar dataKey="나" fill="#2563eb" radius={[4, 4, 0, 0]} name="나" />
                      <Bar dataKey="직급평균" fill="#94a3b8" radius={[4, 4, 0, 0]} name="직급 평균" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="px-4 pb-4 flex gap-6 text-sm">
                  <span className="text-gray-600">동일 직급 평균: {marketBenchmark.positionAvgScore}점</span>
                  <span className="font-semibold text-blue-600">나의 평균: {marketBenchmark.myAvgScore}점</span>
                  <span className="text-gray-500">{marketBenchmark.percentileRank}</span>
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
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                    {(careerByIndustry[careerIndustry]?.paths?.length ?? 0) > 1 && (
                      <select
                        value={careerPathIndex}
                        onChange={(e) => setCareerPathIndex(Number(e.target.value))}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                      >
                        {(careerByIndustry[careerIndustry]?.paths ?? []).map((_: unknown, i: number) => (
                          <option key={i} value={i}>경로 {i + 1}</option>
                        ))}
                      </select>
                    )}
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
                          <div className="text-xs text-gray-500 mt-1">{careerPath.milestone1.probability}% 확률</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(careerPath.milestone1.skills ?? []).map((s, i) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 bg-white rounded border border-gray-200">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 min-w-[120px] p-4 bg-gray-100/50">
                          <div className="text-xs font-medium text-gray-500 mb-1">{careerPath.milestone2.year}</div>
                          <div className="text-sm font-semibold text-gray-900">{careerPath.milestone2.role}</div>
                          <div className="text-xs text-gray-500 mt-1">{careerPath.milestone2.probability}% 확률</div>
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

      {/* 모달: 맞춤 성장 플랜 */}
      {showGrowthPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowGrowthPlanModal(false)}>
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-gray-700">맞춤 성장 플랜이 곧 시작됩니다. 교육 큐레이션 페이지로 이동합니다.</p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowGrowthPlanModal(false)} className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
              <button type="button" onClick={() => { setShowGrowthPlanModal(false); router.push("/app/education"); }} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">교육 페이지로 이동</button>
            </div>
          </div>
        </div>
      )}

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
