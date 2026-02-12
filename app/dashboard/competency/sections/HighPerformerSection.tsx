"use client";

import { useMemo, useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import RadarChart from "../components/RadarChart";
import type { ChartData } from "chart.js";
import {
  highPerformerData,
  teamAverageData,
  teamSelectOptions,
  getTeamLabel,
  kappLabels,
  type TeamKey,
} from "@/data/highPerformerData";

export default function HighPerformerSection() {
  const [selectedTeam, setSelectedTeam] = useState<TeamKey>("all");

  const highPerformer = highPerformerData[selectedTeam];
  const teamAverage = teamAverageData[selectedTeam];

  const chartData: ChartData<"radar"> = useMemo(() => {
    const profile = highPerformer.kappProfile;
    const avg = teamAverage.kappProfile;
    return {
      labels: [...kappLabels],
      datasets: [
        {
          label: "고성과자 (상위 10%)",
          data: [profile.knowledge, profile.application, profile.performance, profile.productivity],
          backgroundColor: "rgba(234, 179, 8, 0.2)",
          borderColor: "rgb(234, 179, 8)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(234, 179, 8)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
        {
          label: "팀 평균",
          data: [avg.knowledge, avg.application, avg.performance, avg.productivity],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    };
  }, [selectedTeam]);

  const gaps = useMemo(() => {
    const hp = highPerformer.kappProfile;
    const ta = teamAverage.kappProfile;
    return {
      knowledge: hp.knowledge - ta.knowledge,
      application: hp.application - ta.application,
      performance: hp.performance - ta.performance,
      productivity: hp.productivity - ta.productivity,
    };
  }, [highPerformer, teamAverage]);

  const gapKeyToLabel: Record<keyof typeof gaps, string> = {
    knowledge: "지식",
    application: "적용",
    performance: "성과",
    productivity: "생산성",
  };
  const sortedGaps = useMemo(
    () =>
      (["knowledge", "application", "performance", "productivity"] as const)
        .map((key) => ({ key, value: gaps[key], label: gapKeyToLabel[key] }))
        .sort((a, b) => b.value - a.value),
    [gaps]
  );

  const avgGap = useMemo(() => {
    const sum = sortedGaps.reduce((s, g) => s + g.value, 0);
    return (sum / 4).toFixed(1);
  }, [sortedGaps]);

  const teamName = getTeamLabel(selectedTeam);

  return (
    <section className="space-y-6">
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon name="insights" size={20} className="text-blue-600" />
            <CardTitle className="text-gray-900 text-base font-semibold">
              팀별 상위 성과자와 팀 역량 비교
            </CardTitle>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            팀별로 상위 10% 성과자와 팀 평균 역량을 비교해 격차를 확인하고, 교육·배치 계획에 활용하세요.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="cloneTeamSelect" className="block text-sm font-medium text-gray-700 mb-1">
              비교 대상 팀
            </label>
            <select
              id="cloneTeamSelect"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value as TeamKey)}
              className="w-auto min-w-[140px] max-w-[200px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {teamSelectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-gray-200">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-gray-900 text-base font-semibold mb-4">
                상위 10% 성과자 & 팀 평균 │ 비교 레이더 차트
              </h3>
              <RadarChart data={chartData} />
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-gray-900 text-base font-semibold mb-4">갭 분석 (Gap Analysis)</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs font-medium">평균 격차</p>
                    <p className="text-gray-900 text-xl font-semibold text-blue-700">{avgGap}점</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs font-medium">고성과자 수</p>
                    <p className="text-gray-900 text-xl font-semibold text-blue-700">
                      {highPerformer.count}명
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs font-medium">고성과자 평균</p>
                    <p className="text-gray-900 text-xl font-semibold text-blue-700">
                      {highPerformer.avgScore}점
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs font-medium">팀 평균</p>
                    <p className="text-gray-900 text-xl font-semibold text-blue-700">
                      {teamAverage.avgScore}점
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>{teamName}</strong>의 평균 역량이 고성과자 대비 가장 큰 차이를 보이는
                  영역:
                </p>
                <ul className="space-y-2">
                  {sortedGaps.map((g, i) => {
                    const variant = g.value >= 20 ? "destructive" : g.value >= 15 ? "yellow" : g.value >= 10 ? "purple" : "gray";
                    return (
                      <li
                        key={g.key}
                        className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-700 text-sm">
                          {i + 1}순위 {g.label}
                        </span>
                        <Badge variant={variant}>{g.value.toFixed(1)}점 차이</Badge>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-gray-900 text-base font-semibold mb-3">고성과자 공통 특성</h3>
                <div className="flex flex-wrap gap-1.5">
                  {highPerformer.commonTraits.map((trait) => (
                    <Badge key={trait} variant="purple">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
