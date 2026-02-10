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

const generateDeterministicScore = (department: string, competency: CompetencyType, date: string): number => {
  const deptValue = department.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const compValue = competency.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dateValue = parseInt(date.slice(8, 10), 10); // 날짜의 '일' 부분만 사용

  // 입력값들을 조합하여 30~100점 사이의 일관된 점수를 생성
  const score = 30 + ((deptValue + compValue + dateValue * 3) % 71);
  return score;
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