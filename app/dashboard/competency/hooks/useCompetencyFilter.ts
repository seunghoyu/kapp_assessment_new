
import { useState, useMemo } from "react";
import {
  competencyRawData,
  competencyTypes,
  type CompetencyRecord,
} from "@/data/competencyRawData";
import { startOfDay, endOfDay } from "date-fns";

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
    if (barData.length === 0)
      return {
        avg: 0,
        maxDept: "-",
        minDept: "-",
        prevDiff: 0,
      };
    
    const sorted = [...barData].sort((a, b) => b.value - a.value);
    const maxDept = sorted[0]?.department ?? "-";
    const minDept = sorted[sorted.length - 1]?.department ?? "-";
    const avg = Math.round(barData.reduce((acc, d) => acc + d.value, 0) / barData.length);

    return { avg, maxDept, minDept, prevDiff: 0 };
  }, [barData]);

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
    reset,
  };
}

