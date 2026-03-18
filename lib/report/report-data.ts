import dashboardData from "@/data/consumer/dashboard.json";
import careerPathData from "@/data/consumer/careerPathByIndustry.json";

type MarketAction = { icon: string; title: string; description: string; priority: string };
type CareerPathNode = { role: string; skills: string[] };
type CareerPathMilestone = CareerPathNode & { year: string; probability: number };
type CareerPathItem = {
  current: CareerPathNode;
  milestone1: CareerPathMilestone;
  milestone2: CareerPathMilestone;
};
type LearningPathItem = { title: string; duration: string; priority: string };

type DashboardData = {
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

const { kappLabels, scores, insights, marketPosition, marketBenchmark, industryBenchmark, marketActions, roadmap } =
  dashboardData as DashboardData;
const careerByIndustry = (careerPathData as { data: Record<string, { paths: CareerPathItem[]; learningPath: LearningPathItem[] }> }).data;

export type ReportRequest = {
  name?: string;
  industry?: string;
  job?: string;
};

export type ReportCompetencyRow = {
  key: string;
  label: string;
  short: string;
  myScore: number;
  benchmarkScore: number;
  gap: number;
};

export type ReportModel = {
  title: string;
  subtitle: string;
  generatedAtLabel: string;
  reportId: string;
  user: {
    name: string;
    industry: string;
    job: string;
    industryLabel: string;
    jobLabel: string;
  };
  cover: {
    overallScore: number;
    percentileRank: string;
    currentLevel: string;
    summaryText: string;
  };
  summary: {
    overallScore: number;
    benchmarkAverage: number;
    scoreGap: number;
    percentileRank: string;
    currentLevel: string;
    strengthCount: number;
    improvementCount: number;
    averageCount: number;
    strongest: ReportCompetencyRow;
    weakest: ReportCompetencyRow;
    opportunitySummary: string;
    currentLevelDesc: string;
    competitivenessDesc: string;
    opportunityDesc: string;
  };
  competency: {
    rows: ReportCompetencyRow[];
    radar: {
      labels: string[];
      myScores: number[];
      benchmarkScores: number[];
      fullMark: number;
    };
  };
  insights: { id: string; title: string; desc: string; type: string }[];
  market: {
    currentLevel: string;
    percentile: string;
    strengthCount: number;
    improvementCount: number;
    averageCount: number;
    currentLevelDesc: string;
    competitivenessDesc: string;
    opportunityDesc: string;
    opportunitySummary: string;
    actions: MarketAction[];
    benchmarkRows: { label: string; myScore: number; benchmarkScore: number; gap: number }[];
    industryBenchmarkRows: { label: string; benchmarkScore: number; myScore: number; gap: number }[];
  };
  roadmap: {
    careerSimulatorDescription: string;
    idpDescription: string;
    idpItems: string[];
    selectedIndustryLabel: string;
    selectedJobLabel: string;
    selectedIndustryKey: string;
    careerPath?: CareerPathItem;
    learningPath: LearningPathItem[];
    fallbackNote: string;
  };
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLevelLabel(value: string): string {
  return value.replace(/\s*\(([^)]*)\)\s*/g, "").trim();
}

function formatDateLabel(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function chooseExtremes(rows: ReportCompetencyRow[]) {
  const ordered = [...rows].sort((a, b) => {
    if (a.gap !== b.gap) return a.gap - b.gap;
    if (a.myScore !== b.myScore) return a.myScore - b.myScore;
    return a.short.localeCompare(b.short);
  });
  return {
    weakest: ordered[0] ?? rows[0],
    strongest: [...ordered].reverse()[0] ?? rows[0],
  };
}

export function serializeReportRequest(request: ReportRequest): string {
  return JSON.stringify({
    name: asText(request.name),
    industry: asText(request.industry),
    job: asText(request.job),
  });
}

export function normalizeReportRequest(input: unknown): ReportRequest {
  if (!input || typeof input !== "object") return {};
  const record = input as Record<string, unknown>;
  return {
    name: asText(record.name),
    industry: asText(record.industry),
    job: asText(record.job),
  };
}

export function parseReportRequest(raw: string | null | undefined): ReportRequest {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    return normalizeReportRequest(parsed);
  } catch {
    return {};
  }
}

export function buildReportModel(request: ReportRequest = {}): ReportModel {
  const name = asText(request.name) || "미기입";
  const industryKey = asText(request.industry);
  const jobValue = asText(request.job);
  const industryLabel = industryKey || "미선택";
  const jobLabel = jobValue || "미선택";
  const currentLevelLabel = normalizeLevelLabel(marketPosition.currentLevel);
  const reportDate = formatDateLabel();

  const competencyRows: ReportCompetencyRow[] = kappLabels.map(({ key, label, short }) => {
    const myScore = scores.my[key] ?? 0;
    const benchmarkScore = scores.positionAverage[key] ?? 0;
    return {
      key,
      label,
      short,
      myScore,
      benchmarkScore,
      gap: myScore - benchmarkScore,
    };
  });

  const { strongest, weakest } = chooseExtremes(competencyRows);
  const myValues = competencyRows.map((row) => row.myScore);
  const benchmarkValues = competencyRows.map((row) => row.benchmarkScore);
  const overallScore = average(myValues);
  const benchmarkAverage = average(benchmarkValues);
  const selectedIndustryPath = industryKey ? careerByIndustry[industryKey] : undefined;
  const selectedCareerPath = selectedIndustryPath?.paths?.[0];

  const radar = {
    labels: competencyRows.map((row) => row.short),
    myScores: competencyRows.map((row) => row.myScore),
    benchmarkScores: competencyRows.map((row) => row.benchmarkScore),
    fullMark: 100,
  };

  const benchmarkRows = competencyRows.map((row) => ({
    label: row.short,
    myScore: row.myScore,
    benchmarkScore: row.benchmarkScore,
    gap: row.gap,
  }));

  const industryBenchmarkSource = industryBenchmark ?? {};
  const industryBenchmarkRows = competencyRows.map((row) => ({
    label: row.short,
    benchmarkScore: industryBenchmarkSource[row.key] ?? row.benchmarkScore,
    myScore: row.myScore,
    gap: row.myScore - (industryBenchmarkSource[row.key] ?? row.benchmarkScore),
  }));

  const fallbackNote = selectedCareerPath
    ? "선택된 산업군을 기준으로 맞춤 경로를 함께 확인할 수 있습니다."
    : "산업군과 직무가 미선택이므로 공통 성장 로드맵을 우선 제안합니다.";

  return {
    title: "KAPP ANALYSIS",
    subtitle: "DATA-DRIVEN INSIGHTS",
    generatedAtLabel: reportDate,
    reportId: `KAPP-RPT-${reportDate.replace(/\./g, "")}`,
    user: {
      name,
      industry: industryLabel,
      job: jobLabel,
      industryLabel,
      jobLabel,
    },
    cover: {
      overallScore,
      percentileRank: marketBenchmark.percentileRank,
      currentLevel: currentLevelLabel,
      summaryText: marketPosition.currentLevelDesc ?? marketPosition.opportunitySummary,
    },
    summary: {
      overallScore,
      benchmarkAverage,
      scoreGap: overallScore - benchmarkAverage,
      percentileRank: marketBenchmark.percentileRank,
      currentLevel: currentLevelLabel,
      strengthCount: marketPosition.strengthCount,
      improvementCount: marketPosition.improvementCount,
      averageCount: marketPosition.averageCount,
      strongest,
      weakest,
      opportunitySummary: marketPosition.opportunitySummary,
      currentLevelDesc: marketPosition.currentLevelDesc ?? "",
      competitivenessDesc: marketPosition.competitivenessDesc ?? "",
      opportunityDesc: marketPosition.opportunityDesc ?? "",
    },
    competency: {
      rows: competencyRows,
      radar,
    },
    insights,
    market: {
      currentLevel: currentLevelLabel,
      percentile: marketPosition.percentile,
      strengthCount: marketPosition.strengthCount,
      improvementCount: marketPosition.improvementCount,
      averageCount: marketPosition.averageCount,
      currentLevelDesc: marketPosition.currentLevelDesc ?? "",
      competitivenessDesc: marketPosition.competitivenessDesc ?? "",
      opportunityDesc: marketPosition.opportunityDesc ?? "",
      opportunitySummary: marketPosition.opportunitySummary,
      actions: (marketActions && marketActions.length > 0 ? marketActions : []).map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
        priority: item.priority,
      })),
      benchmarkRows,
      industryBenchmarkRows,
    },
    roadmap: {
      careerSimulatorDescription: roadmap.careerSimulatorDescription,
      idpDescription: roadmap.idpDescription,
      idpItems: roadmap.idpItems,
      selectedIndustryLabel: industryLabel,
      selectedJobLabel: jobLabel,
      selectedIndustryKey: industryKey || "",
      careerPath: selectedCareerPath,
      learningPath: selectedIndustryPath?.learningPath ?? [],
      fallbackNote,
    },
  };
}

export function createPdfFileName(report: ReportModel): string {
  const safeName = report.user.name === "미기입" ? "anonymous" : sanitizeFileSegment(report.user.name);
  return `kapp-report-${safeName}-${report.generatedAtLabel.replace(/\./g, "")}.pdf`;
}

function sanitizeFileSegment(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[^\w가-힣-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
