/**
 * 고성과자 복제 모델링 - origin(admin-high-performer.js)과 동일 구조
 * 팀 선택 → 상위 N% Golden Standard 레이더·갭 분석용
 */

export type TeamKey = "all" | "dev" | "marketing" | "sales" | "hr" | "finance" | "cs";

export interface KappProfile {
  knowledge: number;
  application: number;
  performance: number;
  productivity: number;
}

export interface HighPerformerTeam {
  count: number;
  avgScore: number;
  kappProfile: KappProfile;
  commonTraits: string[];
  industries?: Record<string, number>;
}

export interface TeamAverageTeam {
  avgScore: number;
  kappProfile: KappProfile;
}

/** 상위 10% 성과자 데이터 (origin highPerformerData) */
export const highPerformerData: Record<TeamKey, HighPerformerTeam> = {
  all: {
    count: 18,
    avgScore: 92,
    kappProfile: { knowledge: 94, application: 91, performance: 93, productivity: 90 },
    commonTraits: ["빠른 학습", "문제 해결", "주도성", "협업"],
    industries: { IT: 6, 금융: 4, 마케팅: 3, 영업: 2, 인사: 1, 재무: 1, 고객지원: 1 },
  },
  dev: {
    count: 6,
    avgScore: 94,
    kappProfile: { knowledge: 96, application: 93, performance: 92, productivity: 95 },
    commonTraits: ["코드 품질", "시스템 설계", "기술 리더십", "멘토링"],
  },
  marketing: {
    count: 3,
    avgScore: 91,
    kappProfile: { knowledge: 92, application: 90, performance: 94, productivity: 88 },
    commonTraits: ["창의성", "데이터 분석", "트렌드 파악", "커뮤니케이션"],
  },
  sales: {
    count: 2,
    avgScore: 93,
    kappProfile: { knowledge: 90, application: 95, performance: 94, productivity: 93 },
    commonTraits: ["고객 이해", "설득력", "관계 구축", "목표 지향"],
  },
  hr: {
    count: 1,
    avgScore: 90,
    kappProfile: { knowledge: 91, application: 89, performance: 92, productivity: 88 },
    commonTraits: ["공감 능력", "조직 이해", "소통", "정책 이해"],
  },
  finance: {
    count: 1,
    avgScore: 92,
    kappProfile: { knowledge: 95, application: 90, performance: 91, productivity: 92 },
    commonTraits: ["정확성", "분석력", "리스크 관리", "재무 지식"],
  },
  cs: {
    count: 1,
    avgScore: 89,
    kappProfile: { knowledge: 88, application: 90, performance: 92, productivity: 86 },
    commonTraits: ["고객 중심", "문제 해결", "인내심", "소통"],
  },
};

/** 현재 팀 평균 데이터 (origin teamAverageData) */
export const teamAverageData: Record<TeamKey, TeamAverageTeam> = {
  all: {
    avgScore: 76,
    kappProfile: { knowledge: 75, application: 74, performance: 78, productivity: 77 },
  },
  dev: {
    avgScore: 75,
    kappProfile: { knowledge: 72, application: 70, performance: 78, productivity: 80 },
  },
  marketing: {
    avgScore: 79,
    kappProfile: { knowledge: 82, application: 78, performance: 85, productivity: 72 },
  },
  sales: {
    avgScore: 78,
    kappProfile: { knowledge: 78, application: 82, performance: 85, productivity: 68 },
  },
  hr: {
    avgScore: 77,
    kappProfile: { knowledge: 85, application: 72, performance: 88, productivity: 63 },
  },
  finance: {
    avgScore: 80,
    kappProfile: { knowledge: 85, application: 76, performance: 79, productivity: 80 },
  },
  cs: {
    avgScore: 72,
    kappProfile: { knowledge: 68, application: 72, performance: 74, productivity: 74 },
  },
};

export const teamSelectOptions: { value: TeamKey; label: string }[] = [
  { value: "all", label: "전체 조직" },
  { value: "dev", label: "개발팀" },
  { value: "marketing", label: "마케팅팀" },
  { value: "sales", label: "영업팀" },
  { value: "hr", label: "인사팀" },
  { value: "finance", label: "재무팀" },
  { value: "cs", label: "고객지원팀" },
];

export function getTeamLabel(key: TeamKey): string {
  return teamSelectOptions.find((o) => o.value === key)?.label ?? key;
}

/** K-A-P-P 축 라벨 (한글, 7.3·7.4 스펙에 맞게) */
export const kappLabels = ["지식", "적용", "성과", "생산성"] as const;
