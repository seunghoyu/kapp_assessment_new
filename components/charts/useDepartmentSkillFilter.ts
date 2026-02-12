import { useState, useMemo } from "react";
import { departmentSkillPerformanceData, type DepartmentSkillValue } from "@/data/dashboard/departmentSkillPerformance";

export function useDepartmentSkillFilter() {
  // 사용 가능한 연도 추출
  const availableYears = useMemo(() => {
    const years = new Set(departmentSkillPerformanceData.map((record) => record.year));
    return Array.from(years).sort((a, b) => b - a); // 최신 연도부터
  }, []);

  // 선택된 연도의 사용 가능한 월 추출
  const getAvailableMonths = (year: number) => {
    const months = departmentSkillPerformanceData
      .filter((record) => record.year === year)
      .map((record) => record.month)
      .sort((a, b) => b - a); // 최신 월부터
    return months;
  };

  // 초기값: 최신 연도, 최신 월
  const latestYear = availableYears[0] || 2026;
  const latestMonths = getAvailableMonths(latestYear);
  const latestMonth = latestMonths[0] || 1;

  const [selectedYear, setSelectedYear] = useState<number>(latestYear);
  const [selectedMonth, setSelectedMonth] = useState<number | "all">(latestMonth);

  // 선택된 연도에 따라 사용 가능한 월 업데이트
  const availableMonths = useMemo(() => {
    return getAvailableMonths(selectedYear);
  }, [selectedYear]);

  // 연도 변경 시 월을 최신 월로 설정
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const months = getAvailableMonths(year);
    if (months.length > 0) {
      setSelectedMonth(months[0]);
    } else {
      setSelectedMonth("all");
    }
  };

  // 필터링된 데이터 계산
  const filteredData = useMemo<DepartmentSkillValue[]>(() => {
    if (selectedMonth === "all") {
      // 전체 월 선택 시: 해당 연도의 모든 데이터를 평균 계산
      const yearData = departmentSkillPerformanceData.filter(
        (record) => record.year === selectedYear
      );

      if (yearData.length === 0) return [];

      // 부서별 평균 계산
      const departmentMap = new Map<string, { sum: number; count: number }>();

      yearData.forEach((record) => {
        record.data.forEach((item) => {
          const existing = departmentMap.get(item.department);
          if (existing) {
            existing.sum += item.value;
            existing.count += 1;
          } else {
            departmentMap.set(item.department, { sum: item.value, count: 1 });
          }
        });
      });

      return Array.from(departmentMap.entries()).map(([department, { sum, count }]) => ({
        department,
        value: Math.round(sum / count),
      }));
    } else {
      // 특정 월 선택 시
      const record = departmentSkillPerformanceData.find(
        (r) => r.year === selectedYear && r.month === selectedMonth
      );
      return record ? record.data : [];
    }
  }, [selectedYear, selectedMonth]);

  return {
    selectedYear,
    selectedMonth,
    availableYears,
    availableMonths,
    filteredData,
    handleYearChange,
    setSelectedMonth,
  };
}
