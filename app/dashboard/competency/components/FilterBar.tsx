
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import DepartmentFilterPanel from "./DepartmentFilterPanel";
import { format } from "date-fns";

interface FilterBarProps {
  selectedDepartments: string[];
  setSelectedDepartments: (v: string[]) => void;
  dateRange: { start: Date; end: Date };
  setDateRange: (v: { start: Date; end: Date }) => void;
  departments: string[];
  onReset: () => void;
}

export default function FilterBar({
  selectedDepartments,
  setSelectedDepartments,
  dateRange,
  setDateRange,
  departments,
  onReset,
}: FilterBarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, part: "start" | "end") => {
      const newDate = new Date(e.target.value);
      if(!isNaN(newDate.getTime())) {
          setDateRange({ ...dateRange, [part]: newDate });
      }
  };


  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white px-4 py-3">
      <div className="relative">
        <Button onClick={() => setIsPanelOpen(!isPanelOpen)}>
          부서 필터 ({selectedDepartments.length})
        </Button>
        {isPanelOpen && (
          <DepartmentFilterPanel
            departments={departments}
            selectedDepartments={selectedDepartments}
            onApply={setSelectedDepartments}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-700">기간</span>
        <input
            type="date"
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={e => handleDateChange(e, 'start')}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
        />
        <span className="text-gray-500">~</span>
        <input
            type="date"
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={e => handleDateChange(e, 'end')}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
        />
      </div>
      <Button variant="ghost" onClick={onReset}>
        초기화
      </Button>
    </div>
  );
}

