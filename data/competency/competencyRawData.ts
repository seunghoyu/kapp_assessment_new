import type { CompetencyType } from "@/app/dashboard/competency/types";

export type CompetencyRecord = {
  department: string;
  date: string; // YYYY-MM-DD
  competency: CompetencyType;
  score: number;
};

export const competencyTypes: CompetencyType[] = ["지식", "적용", "성과", "생산성"];

const departments = ["개발팀", "마케팅팀", "영업팀", "인사팀", "재무팀"];
const competencies: CompetencyType[] = ["지식", "적용", "성과", "생산성"];

// (부서, 역량) 쌍별로 구간 배치 → 역량별로 골고루 분포 (0~30, 30~60, 60~70, 70~80, 80~100)
// 키: "부서|역량", 값: { min, max }
const deptCompetencyRanges: Record<string, { min: number; max: number }> = {
  "개발팀|지식": { min: 85, max: 95 },
  "개발팀|적용": { min: 12, max: 26 },
  "개발팀|성과": { min: 62, max: 68 },
  "개발팀|생산성": { min: 72, max: 78 },
  "마케팅팀|지식": { min: 38, max: 52 },
  "마케팅팀|적용": { min: 78, max: 88 },
  "마케팅팀|성과": { min: 18, max: 28 },
  "마케팅팀|생산성": { min: 65, max: 69 },
  "영업팀|지식": { min: 68, max: 72 },
  "영업팀|적용": { min: 25, max: 38 },
  "영업팀|성과": { min: 82, max: 92 },
  "영업팀|생산성": { min: 48, max: 58 },
  "인사팀|지식": { min: 72, max: 78 },
  "인사팀|적용": { min: 55, max: 62 },
  "인사팀|성과": { min: 8, max: 22 },
  "인사팀|생산성": { min: 88, max: 96 },
  "재무팀|지식": { min: 22, max: 32 },
  "재무팀|적용": { min: 75, max: 82 },
  "재무팀|성과": { min: 42, max: 52 },
  "재무팀|생산성": { min: 63, max: 68 },
};

const generateDeterministicScore = (department: string, competency: CompetencyType, date: string): number => {
  const key = `${department}|${competency}`;
  const range = deptCompetencyRanges[key] ?? { min: 50, max: 70 };
  const dateValue = parseInt(date.slice(8, 10), 10) || 1;
  const spread = range.max - range.min + 1;
  const baseScore = range.min + (dateValue % spread);

  // 기간별 추이가 보이도록: 월이 지날수록 소폭 상승 (월별 평균이 달라짐)
  const [y, m] = [date.slice(0, 4), date.slice(5, 7)].map(Number);
  const monthIndex = (y - 2025) * 12 + (m - 1); // 2025-01 = 0, 2025-02 = 1, ...
  const trendUp = Math.min(18, monthIndex * 1.5); // 최대 +18점까지 상승

  const score = baseScore + trendUp;
  return Math.min(100, Math.max(0, Math.round(score)));
};

const generateDataForDate = (date: string): CompetencyRecord[] => {
  const records: CompetencyRecord[] = [];
  for (const department of departments) {
    for (const competency of competencies) {
      records.push({
        department,
        date,
        competency,
        score: generateDeterministicScore(department, competency, date),
      });
    }
  }
  return records;
};

const generateDateRange = (start: Date, end: Date): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// 날짜 범위를 2025-01-01 부터 2026-01-31 까지로 수정합니다.
const startDate = new Date("2025-01-01");
const endDate = new Date("2026-01-31");
const allDates = generateDateRange(startDate, endDate);

export const competencyRawData: CompetencyRecord[] = allDates.flatMap(generateDataForDate);
