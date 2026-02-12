
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import DepartmentFilterPanel from "./DepartmentFilterPanel";
import Icon from "@/components/ui/Icon";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import type { CompetencyRecord } from "@/data/competency/competencyRawData";

interface FilterBarProps {
  selectedDepartments: string[];
  setSelectedDepartments: (v: string[]) => void;
  dateRange: { start: Date; end: Date };
  setDateRange: (v: { start: Date; end: Date }) => void;
  departments: string[];
  filteredData: CompetencyRecord[];
  onReset: () => void;
}

function downloadCompetencyExcel(filteredData: CompetencyRecord[], dateRange: { start: Date; end: Date }) {
  const headers = ["부서", "일자", "역량", "점수"];
  const rows = filteredData.map((r) => [r.department, r.date, r.competency, r.score]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "역량현황");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `역량_현황비교_${format(dateRange.start, "yyyyMMdd")}_${format(dateRange.end, "yyyyMMdd")}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FilterBar({
  selectedDepartments,
  setSelectedDepartments,
  dateRange,
  setDateRange,
  departments,
  filteredData,
  onReset,
}: FilterBarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, part: "start" | "end") => {
      const newDate = new Date(e.target.value);
      if(!isNaN(newDate.getTime())) {
          setDateRange({ ...dateRange, [part]: newDate });
      }
  };

  const handleExcelDownload = () => {
    downloadCompetencyExcel(filteredData, dateRange);
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
      <div className="ml-auto relative">
        <button
          type="button"
          onClick={handleExcelDownload}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="엑셀 다운로드"
        >
          <Icon name="download" size={20} />
        </button>
        {tooltipVisible && (
          <div
            className="absolute right-0 top-full mt-1 z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap"
            role="tooltip"
          >
            선택한 부서·기간의 원데이터를 엑셀(xlsx) 파일로 다운로드합니다.
          </div>
        )}
      </div>
    </div>
  );
}

