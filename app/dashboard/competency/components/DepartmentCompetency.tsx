"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import type { BarData } from "../hooks/useCompetencyFilter";
import ViewToggle from "./ViewToggle";
import ChartView from "./ChartView";
import TableView from "./TableView";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type DepartmentCompetencyProps = {
  data: BarData[];
  dateRange: { start: Date; end: Date };
};

export default function DepartmentCompetency({
  data,
  dateRange,
}: DepartmentCompetencyProps) {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  const formatDate = (date: Date) => format(date, "yyyy.MM.dd");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          부서별 역량 점수 비교
        </CardTitle>
        <ViewToggle view={view} setView={setView} />
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
    </Card>
  );
}