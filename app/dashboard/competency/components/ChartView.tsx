"use client";
import React, { useEffect } from 'react';
import DepartmentBarChart from './DepartmentBarChart';
import type { BarData } from '../hooks/useCompetencyFilter';

export default function ChartView({ data }: { data: BarData[] }) {
  
  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn("ChartView received no data or an empty array. Chart will not render.");
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">선택한 기간에 해당하는 데이터가 없습니다.</p>
      </div>
    );
  }

  return <DepartmentBarChart data={data} />;
}
