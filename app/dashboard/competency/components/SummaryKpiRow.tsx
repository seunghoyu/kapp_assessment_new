
"use client";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface SummaryKpiRowProps {
  avg: number;
  maxDept: string;
  minDept: string;
}

export default function SummaryKpiRow({
  avg,
  maxDept,
  minDept,
}: SummaryKpiRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card hover>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            평균 점수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold text-gray-900">{avg.toFixed(1)}</div>
        </CardContent>
      </Card>
      <Card hover className="col-span-1 sm:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">
            최고/최저 점수 부서
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-semibold text-gray-900">
            <span>최고: {maxDept}</span>
            <span className="mx-2 text-gray-300">/</span>
            <span>최저: {minDept}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

