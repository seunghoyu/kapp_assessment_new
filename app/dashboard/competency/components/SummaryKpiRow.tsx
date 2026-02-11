"use client";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { CompetencyType } from "../types";

const competencyLabels: CompetencyType[] = ["지식", "적용", "성과", "생산성"];

// 부서별 역량 점수 비교 차트와 동일 색상 (가로 막대 fill)
const competencyBarColor: Record<CompetencyType, string> = {
  지식: "#3b82f6",
  적용: "#60a5fa",
  성과: "#facc15",
  생산성: "#8b5cf6",
};

export type SkillExtremes = Record<
  CompetencyType,
  { max: { dept: string; score: number }; min: { dept: string; score: number } }
>;

interface SummaryKpiRowProps {
  avg: number;
  maxDept: string;
  minDept: string;
  maxDeptScore: number;
  minDeptScore: number;
  skillAvg: Record<CompetencyType, number>;
  skillExtremes: SkillExtremes;
}

export default function SummaryKpiRow({
  avg,
  maxDept,
  minDept,
  maxDeptScore,
  minDeptScore,
  skillAvg,
  skillExtremes,
}: SummaryKpiRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 평균 점수: 좌측 (선택한 부서·기간 기준) */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base font-semibold">
            평균 점수
          </CardTitle>
          <p className="text-gray-500 text-xs mt-0.5">
            선택한 부서·기간 내 전 직원 역량 평균
          </p>
        </CardHeader>
        <CardContent className="flex flex-col justify-center min-h-[240px] py-6">
          <div className="space-y-3">
            {/* 전체 평균: 맨 위, 초록색 막대 + "전체" 파란색 볼드 */}
            <div className="grid grid-cols-[80px_1fr_52px] gap-3 items-center">
              <span className="text-blue-700 text-sm font-bold shrink-0">
                전체
              </span>
              <div className="h-6 bg-gray-100 rounded-lg overflow-hidden min-w-0">
                <div
                  className="h-full rounded-lg transition-[width] duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, avg))}%`,
                    backgroundColor: "#22c55e",
                  }}
                />
              </div>
              <span className="text-gray-900 text-sm font-bold text-right shrink-0">
                {Math.round(avg)}점
              </span>
            </div>
            {competencyLabels.map((skill) => {
              const score = skillAvg[skill];
              const pct = Math.min(100, Math.max(0, score));
              const barColor = competencyBarColor[skill];
              return (
                <div
                  key={skill}
                  className="grid grid-cols-[80px_1fr_52px] gap-3 items-center"
                >
                  <span className="text-gray-700 text-sm font-semibold shrink-0">
                    {skill}
                  </span>
                  <div className="h-6 bg-gray-100 rounded-lg overflow-hidden min-w-0">
                    <div
                      className="h-full rounded-lg transition-[width] duration-300"
                      style={{ width: `${pct}%`, backgroundColor: barColor }}
                    />
                  </div>
                  <span className="text-gray-900 text-sm font-bold text-right shrink-0">
                    {Math.round(score)}점
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 최고/최저 점수 부서: 우측 */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base font-semibold">
            최고 / 최저 점수 부서
          </CardTitle>
          <p className="text-gray-500 text-xs mt-0.5">
            선택한 부서·기간 기준
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row gap-3">
            <div className="flex-1 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100 flex items-center justify-between gap-2">
              <span className="text-gray-700 text-xs font-semibold shrink-0">
                전체 최고
              </span>
              <span className="text-gray-900 font-semibold truncate">
                {maxDept}
              </span>
              <span className="text-blue-700 font-bold shrink-0">
                {maxDeptScore}점
              </span>
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 flex items-center justify-between gap-2">
              <span className="text-gray-700 text-xs font-semibold shrink-0">
                전체 최저
              </span>
              <span className="text-gray-900 font-semibold truncate">
                {minDept}
              </span>
              <span className="text-gray-700 font-bold shrink-0">
                {minDeptScore}점
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-gray-700 text-sm font-semibold mb-2">
              스킬별 최고 / 최저 부서
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left text-gray-900 font-semibold px-3 py-2">
                      역량
                    </th>
                    <th className="text-left text-gray-900 font-semibold px-3 py-2">
                      최고 부서 (점수)
                    </th>
                    <th className="text-left text-gray-900 font-semibold px-3 py-2">
                      최저 부서 (점수)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competencyLabels.map((skill) => {
                    const ex = skillExtremes[skill];
                    return (
                      <tr
                        key={skill}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 text-gray-700 font-medium">
                          {skill}
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-900">{ex.max.dept}</span>
                          {ex.max.dept !== "-" && (
                            <Badge variant="blue" className="ml-2">
                              {ex.max.score}점
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-900">{ex.min.dept}</span>
                          {ex.min.dept !== "-" && (
                            <Badge variant="gray" className="ml-2">
                              {ex.min.score}점
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
