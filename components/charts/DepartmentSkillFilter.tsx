"use client";

import Select from "@/components/ui/Select";

interface DepartmentSkillFilterProps {
  selectedYear: number;
  selectedMonth: number | "all";
  availableYears: number[];
  availableMonths: number[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | "all") => void;
}

export function DepartmentSkillFilter({
  selectedYear,
  selectedMonth,
  availableYears,
  availableMonths,
  onYearChange,
  onMonthChange,
}: DepartmentSkillFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="min-w-[100px]"
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}년
          </option>
        ))}
      </Select>
      <Select
        value={selectedMonth}
        onChange={(e) =>
          onMonthChange(e.target.value === "all" ? "all" : Number(e.target.value))
        }
        className="min-w-[100px]"
      >
        <option value="all">전체</option>
        {availableMonths.map((month) => (
          <option key={month} value={month}>
            {month}월
          </option>
        ))}
      </Select>
    </div>
  );
}
