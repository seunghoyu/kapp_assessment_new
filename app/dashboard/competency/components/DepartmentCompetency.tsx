"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import type { BarData } from "../hooks/useCompetencyFilter";
import type { CompetencyRecord } from "@/data/competency/competencyRawData";
import ViewToggle from "./ViewToggle";
import ChartView from "./ChartView";
import TableView from "./TableView";
import RawDataButton from "./RawDataButton";
import RawDataPanel from "./RawDataPanel";
import type { RawDataTable } from "./RawDataPanel";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type DepartmentCompetencyProps = {
  data: BarData[];
  dateRange: { start: Date; end: Date };
  /** 개별 역량 점수 Raw (부서·역량·점수·날짜) */
  rawRecords: CompetencyRecord[];
};

const RAW_COLUMNS = ["이름", "부서", "직책", "역량", "점수", "날짜"];

export default function DepartmentCompetency({
  data,
  dateRange,
  rawRecords,
}: DepartmentCompetencyProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [rawOpen, setRawOpen] = useState(false);

  const formatDate = (date: Date) => format(date, "yyyy.MM.dd");

  const rawTables: RawDataTable[] = useMemo(() => {
    return [
      {
        title: "개별 역량 점수 (Raw)",
        columns: RAW_COLUMNS,
        rows: rawRecords.map((r) => ({
          이름: r.employeeName,
          부서: r.department,
          직책: r.positionLevel,
          역량: r.competency,
          점수: Math.round(r.score),
          날짜: r.date,
        })),
      },
    ];
  }, [rawRecords]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          부서별 역량 점수 비교
        </CardTitle>
        <div className="flex items-center gap-2">
          <RawDataButton onClick={() => setRawOpen((v) => !v)} />
          <ViewToggle view={view} setView={setView} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-500 mb-4">
          선택한 기간: {formatDate(dateRange.start)} ~ {formatDate(dateRange.end)}
        </div>
        
        {view === 'chart' ? (
          <ChartView data={data} />
        ) : (
          <TableView data={data} />
        )}
      </CardContent>
      {rawOpen && <RawDataPanel tables={rawTables} />}
    </Card>
  );
}