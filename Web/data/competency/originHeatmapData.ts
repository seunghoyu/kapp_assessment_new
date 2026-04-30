/**
 * origin admin-advanced.js organizationData 기반
 * 스킬 갭 히트맵용 부서·스킬 점수
 */

export type HeatmapDeptKey = "dev" | "marketing" | "sales" | "hr" | "finance" | "cs";

export const organizationData: {
  departments: Record<
    HeatmapDeptKey,
    { name: string; members: number; skills: Record<string, number> }
  >;
} = {
  departments: {
    dev: {
      name: "개발팀",
      members: 45,
      skills: {
        Python: 72,
        JavaScript: 78,
        "AI/ML": 38,
        Cloud: 52,
        DevOps: 62,
        커뮤니케이션: 48,
        "프로젝트 관리": 68,
        "애자일/스크럼": 55,
      },
    },
    marketing: {
      name: "마케팅팀",
      members: 32,
      skills: {
        "디지털 마케팅": 88,
        "데이터 분석": 59,
        "콘텐츠 기획": 92,
        "SEO/SEM": 72,
        "소셜 미디어": 90,
        커뮤니케이션: 85,
        전략: 64,
        "AI 도구": 43,
      },
    },
    sales: {
      name: "영업팀",
      members: 38,
      skills: {
        협상: 78,
        CRM: 65,
        프레젠테이션: 82,
        "제품 지식": 88,
        커뮤니케이션: 85,
        "데이터 분석": 35,
        전략: 68,
        "디지털 영업": 51,
      },
    },
    hr: {
      name: "인사팀",
      members: 18,
      skills: {
        채용: 87,
        "HR 애널리틱스": 44,
        "법무 지식": 72,
        커뮤니케이션: 92,
        교육: 78,
        전략: 70,
        "변경 관리": 58,
        HRIS: 39,
      },
    },
    finance: {
      name: "재무팀",
      members: 22,
      skills: {
        "재무 분석": 85,
        회계: 88,
        "엑셀 고급": 76,
        "ERP 시스템": 32,
        "데이터 시각화": 47,
        커뮤니케이션: 63,
        "전략 기획": 71,
        준법: 79,
      },
    },
    cs: {
      name: "고객지원팀",
      members: 28,
      skills: {
        "고객 서비스": 89,
        "문제 해결": 74,
        커뮤니케이션: 91,
        "CRM 시스템": 56,
        "갈등 해결": 68,
        "제품 지식": 77,
        "기술 지원": 28,
        "데이터 입력": 52,
      },
    },
  },
};

export const heatmapDeptOptions: { value: string; label: string }[] = [
  { value: "all", label: "전체 부서" },
  { value: "dev", label: "개발팀" },
  { value: "marketing", label: "마케팅팀" },
  { value: "sales", label: "영업팀" },
  { value: "hr", label: "인사팀" },
  { value: "finance", label: "재무팀" },
  { value: "cs", label: "고객지원팀" },
];

export const heatmapSkillOptions: { value: string; label: string }[] = [
  { value: "all", label: "전체 스킬" },
  { value: "technical", label: "기술 스킬" },
  { value: "soft", label: "소프트 스킬" },
  { value: "business", label: "비즈니스 스킬" },
];

/** 전체 부서에서 쓰이는 스킬 이름 합집합 (히트맵 열 순서용) */
export function getAllSkillNamesOrdered(): string[] {
  const set = new Set<string>();
  (Object.keys(organizationData.departments) as HeatmapDeptKey[]).forEach((key) => {
    Object.keys(organizationData.departments[key].skills).forEach((s) => set.add(s));
  });
  return Array.from(set).sort();
}

/** 점수 구간: X축 5구간 (0-40, 41-60, 61-75, 76-85, 86-100) */
export const HEATMAP_SCORE_RANGES = [
  { label: "0-40", min: 0, max: 40 },
  { label: "41-60", min: 41, max: 60 },
  { label: "61-75", min: 61, max: 75 },
  { label: "76-85", min: 76, max: 85 },
  { label: "86-100", min: 86, max: 100 },
] as const;

/** 10점 단위 구간 10개. 흐름: 빨간색 → 연한 빨강 → 연한 초록 → 연한 파랑 → 파랑 */
export const HEATMAP_SCORE_RANGES_10: {
  label: string;
  min: number;
  max: number;
  group: "긴급" | "주의" | "보통" | "양호" | "우수";
  bgClass: string;
  textClass: string;
}[] = [
  { label: "0-10", min: 0, max: 10, group: "긴급", bgClass: "bg-red-500", textClass: "text-white" },
  { label: "10-20", min: 10, max: 20, group: "긴급", bgClass: "bg-red-400", textClass: "text-white" },
  { label: "20-30", min: 20, max: 30, group: "긴급", bgClass: "bg-red-300", textClass: "text-gray-900" },
  { label: "30-40", min: 30, max: 40, group: "긴급", bgClass: "bg-red-200", textClass: "text-gray-900" },
  { label: "40-50", min: 40, max: 50, group: "주의", bgClass: "bg-red-200", textClass: "text-gray-900" },
  { label: "50-60", min: 50, max: 60, group: "주의", bgClass: "bg-red-100", textClass: "text-gray-900" },
  { label: "60-70", min: 60, max: 70, group: "보통", bgClass: "bg-green-200", textClass: "text-gray-900" },
  { label: "70-80", min: 70, max: 80, group: "보통", bgClass: "bg-green-300", textClass: "text-gray-900" },
  { label: "80-90", min: 80, max: 90, group: "양호", bgClass: "bg-blue-200", textClass: "text-gray-900" },
  { label: "90-100", min: 90, max: 100, group: "우수", bgClass: "bg-blue-500", textClass: "text-white" },
];

export function getScoreRangeIndex(score: number): number {
  if (score <= 40) return 0;
  if (score <= 60) return 1;
  if (score <= 75) return 2;
  if (score <= 85) return 3;
  return 4;
}

/** 10점 단위 구간 인덱스 (0~9): 0-10→0, 10-20→1, ..., 90-100→9 */
export function getScoreRange10Index(score: number): number {
  const s = Math.max(0, Math.min(100, score));
  return Math.min(9, Math.floor(s / 10));
}

/** 부서별·10구간별 스킬 목록: deptKey -> rangeIndex(0~9) -> { skillName, score }[] */
export function getSkillsByScoreRange10(
  deptKey: HeatmapDeptKey
): { skillName: string; score: number }[][] {
  const skills = organizationData.departments[deptKey].skills;
  const buckets: { skillName: string; score: number }[][] = Array.from(
    { length: 10 },
    () => []
  );
  Object.entries(skills).forEach(([skillName, score]) => {
    const idx = getScoreRange10Index(score);
    buckets[idx].push({ skillName, score });
  });
  return buckets;
}

/** 부서별·구간별 스킬 목록: deptKey -> rangeIndex -> { skillName, score }[] */
export function getSkillsByScoreRange(
  deptKey: HeatmapDeptKey
): { skillName: string; score: number }[][] {
  const skills = organizationData.departments[deptKey].skills;
  const buckets: { skillName: string; score: number }[][] = [[], [], [], [], []];
  Object.entries(skills).forEach(([skillName, score]) => {
    const idx = getScoreRangeIndex(score);
    buckets[idx].push({ skillName, score });
  });
  return buckets;
}

/** 긴급(빨강) ~ 우수(파랑), 양호=초록 계열 */
export function getHeatmapColorClass(score: number): string {
  if (score >= 86) return "bg-blue-500 text-white";   // 우수
  if (score >= 76) return "bg-green-500 text-white"; // 양호
  if (score >= 61) return "bg-yellow-400 text-gray-900"; // 보통
  if (score >= 41) return "bg-amber-500 text-white";  // 주의
  return "bg-red-500 text-white";                    // 긴급
}

export function getSkillStatus(score: number): string {
  if (score >= 86) return "우수";
  if (score >= 76) return "양호";
  if (score >= 61) return "보통";
  if (score >= 41) return "주의";
  return "긴급";
}
