
import { useState, useMemo } from "react";
import {
  competencyRawData,
  competencyTypes,
  type CompetencyRecord,
} from "@/data/competencyRawData";
import { startOfDay, endOfDay } from "date-fns";
import type { CompetencyType } from "../types";

const DEPARTMENTS = Array.from(
  new Set(competencyRawData.map((r) => r.department))
).sort();

export type BarData = {
  department: string;
  value: number;
} & {
  [key in CompetencyType]?: number;
};

export function useCompetencyFilter() {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(DEPARTMENTS);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(new Date("2025-01-01")),
    end: endOfDay(new Date("2025-01-31")),
  });
  const [trendMode, setTrendMode] = useState<"daily" | "monthly">("monthly");

  const departments = useMemo(() => DEPARTMENTS, []);

  const filteredData = useMemo(() => {
    const start = dateRange.start.getTime();
    const end = dateRange.end.getTime();
    return competencyRawData.filter((r) => {
      const recordDate = new Date(r.date.replace(/-/g, "/")).getTime();
      return (
        selectedDepartments.includes(r.department) &&
        recordDate >= start &&
        recordDate <= end
      );
    });
  }, [selectedDepartments, dateRange]);

  const barData: BarData[] = useMemo(() => {
    const byDept = new Map<string, { total: number; count: number, scores: Record<string, number> }>();
    filteredData.forEach((r) => {
      if (!byDept.has(r.department)) {
        byDept.set(r.department, { total: 0, count: 0, scores: {} });
      }
      const entry = byDept.get(r.department)!;
      entry.total += r.score;
      entry.count += 1;
      entry.scores[r.competency] = (entry.scores[r.competency] ?? 0) + r.score;
    });
    
    return Array.from(byDept.entries()).map(([department, data]) => {
        const avgScores: Record<string, number> = {};
        for(const competency of competencyTypes) {
            const competencyTotal = data.scores[competency] ?? 0;
            const competencyDataCount = data.count / competencyTypes.length;
            avgScores[competency] = Math.round(competencyTotal / competencyDataCount);
        }
        return {
            department,
            value: Math.round(data.total / data.count),
            ...avgScores,
        };
    });
  }, [filteredData]);

  const trendData = useMemo(() => {
    const byDate = new Map<string, { total: number; count: number, scores: Record<string, number> }>();
    const format = trendMode === "daily" ? "yyyy-MM-dd" : "yyyy-MM";

    filteredData.forEach((r) => {
      const key = r.date.substring(0, format.length);
      if (!byDate.has(key)) {
        byDate.set(key, { total: 0, count: 0, scores: {} });
      }
      const entry = byDate.get(key)!;
      entry.total += r.score;
      entry.count += 1;
      entry.scores[r.competency] = (entry.scores[r.competency] ?? 0) + r.score;
    });

    return Array.from(byDate.entries())
      .map(([date, data]) => {
        const avgScores: Record<string, number> = {};
        for(const competency of competencyTypes) {
            avgScores[competency] = data.scores[competency] ? data.scores[competency] / (data.count / competencyTypes.length) : 0;
        }
          return {
              date,
              ...avgScores
          };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, trendMode]);

  const summary = useMemo(() => {
    const skillAvg: Record<CompetencyType, number> = {
      지식: 0,
      적용: 0,
      성과: 0,
      생산성: 0,
    };
    const skillExtremes: Record<
      CompetencyType,
      { max: { dept: string; score: number }; min: { dept: string; score: number } }
    > = {
      지식: { max: { dept: "-", score: 0 }, min: { dept: "-", score: 0 } },
      적용: { max: { dept: "-", score: 0 }, min: { dept: "-", score: 0 } },
      성과: { max: { dept: "-", score: 0 }, min: { dept: "-", score: 0 } },
      생산성: { max: { dept: "-", score: 0 }, min: { dept: "-", score: 0 } },
    };

    if (filteredData.length === 0) {
      return {
        avg: 0,
        maxDept: "-",
        minDept: "-",
        maxDeptScore: 0,
        minDeptScore: 0,
        skillAvg,
        skillExtremes,
        prevDiff: 0,
      };
    }

    const totalScore = filteredData.reduce((acc, r) => acc + r.score, 0);
    const overallAvg = Math.round((totalScore / filteredData.length) * 10) / 10;

    competencyTypes.forEach((comp) => {
      const records = filteredData.filter((r) => r.competency === comp);
      if (records.length > 0) {
        const sum = records.reduce((acc, r) => acc + r.score, 0);
        skillAvg[comp] = Math.round((sum / records.length) * 10) / 10;
      }
    });

    let maxDept = "-";
    let minDept = "-";
    let maxDeptScore = 0;
    let minDeptScore = 100;

    if (barData.length > 0) {
      const sorted = [...barData].sort((a, b) => b.value - a.value);
      maxDept = sorted[0]?.department ?? "-";
      minDept = sorted[sorted.length - 1]?.department ?? "-";
      maxDeptScore = sorted[0]?.value ?? 0;
      minDeptScore = sorted[sorted.length - 1]?.value ?? 0;

      competencyTypes.forEach((comp) => {
        const withScore = barData
          .map((d) => ({ dept: d.department, score: d[comp] ?? 0 }))
          .filter((x) => x.score > 0);
        if (withScore.length > 0) {
          const maxEntry = withScore.reduce((a, b) => (a.score >= b.score ? a : b));
          const minEntry = withScore.reduce((a, b) => (a.score <= b.score ? a : b));
          skillExtremes[comp] = {
            max: { dept: maxEntry.dept, score: maxEntry.score },
            min: { dept: minEntry.dept, score: minEntry.score },
          };
        }
      });
    }

    return {
      avg: overallAvg,
      maxDept,
      minDept,
      maxDeptScore,
      minDeptScore,
      skillAvg,
      skillExtremes,
      prevDiff: 0,
    };
  }, [barData, filteredData]);

  const reset = () => {
    setSelectedDepartments(DEPARTMENTS);
    setDateRange({
      start: startOfDay(new Date("2025-01-01")),
      end: endOfDay(new Date("2025-01-31")),
    });
    setTrendMode("monthly");
  };

  return {
    selectedDepartments,
    setSelectedDepartments,
    dateRange,
    setDateRange,
    trendMode,
    setTrendMode,
    departments,
    competencyTypes,
    barData,
    trendData,
    summary,
    filteredData,
    reset,
  };
}

