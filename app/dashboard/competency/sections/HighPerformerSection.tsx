"use client";

import { useMemo, useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import RawDataButton from "../components/RawDataButton";
import RawDataPanel from "../components/RawDataPanel";
import type { RawDataTable } from "../components/RawDataPanel";
import RadarChart from "../components/RadarChart";
import type { ChartData } from "chart.js";
import {
  highPerformerData,
  teamAverageData,
  teamSelectOptions,
  kappLabels,
  type TeamKey,
} from "@/data/competency/highPerformerData";
import type { CompetencyRecord } from "@/data/competency/competencyRawData";

const INDIVIDUAL_RAW_COLUMNS = ["이름", "부서", "직책", "역량", "점수", "날짜"];

type HighPerformerSectionProps = {
  rawRecords?: CompetencyRecord[];
};

export default function HighPerformerSection({ rawRecords = [] }: HighPerformerSectionProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamKey>("all");
  const [rawOpen, setRawOpen] = useState(false);

  const highPerformer = highPerformerData[selectedTeam];
  const teamAverage = teamAverageData[selectedTeam];

  const rawTables: RawDataTable[] = useMemo(() => {
    const hpRows = teamSelectOptions.map((opt) => {
      const hp = highPerformerData[opt.value];
      return {
        팀: opt.label,
        인원: hp.count,
        평균점수: hp.avgScore,
        지식: hp.kappProfile.knowledge,
        적용: hp.kappProfile.application,
        성과: hp.kappProfile.performance,
        생산성: hp.kappProfile.productivity,
        공통특성: hp.commonTraits.join(", "),
      };
    });
    const taRows = teamSelectOptions.map((opt) => {
      const ta = teamAverageData[opt.value];
      return {
        팀: opt.label,
        평균점수: ta.avgScore,
        지식: ta.kappProfile.knowledge,
        적용: ta.kappProfile.application,
        성과: ta.kappProfile.performance,
        생산성: ta.kappProfile.productivity,
      };
    });
    const tables: RawDataTable[] = [
      { title: "고성과자 (상위 10%)", columns: ["팀", "인원", "평균점수", "지식", "적용", "성과", "생산성", "공통특성"], rows: hpRows },
      { title: "팀 평균", columns: ["팀", "평균점수", "지식", "적용", "성과", "생산성"], rows: taRows },
    ];
    if (rawRecords.length > 0) {
      tables.push({
        title: "개별 역량 점수 (Raw)",
        columns: INDIVIDUAL_RAW_COLUMNS,
        rows: rawRecords.map((r) => ({
          이름: r.employeeName,
          부서: r.department,
          직책: r.positionLevel,
          역량: r.competency,
          점수: Math.round(r.score),
          날짜: r.date,
        })),
      });
    }
    return tables;
  }, [rawRecords]);

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

  return (
    <section className="space-y-6">
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="insights" size={20} className="text-blue-600" />
              <CardTitle className="text-gray-900 text-base font-semibold">
                팀별 상위 성과자와 팀 역량 비교
              </CardTitle>
            </div>
            <p className="text-gray-500 text-sm mt-1">
            팀별로 상위 10% 성과자와 팀 평균 역량을 비교해 격차를 확인하고, 교육·배치 계획에 활용하세요.
            </p>
          </div>
          <RawDataButton onClick={() => setRawOpen((v) => !v)} />
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
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
              <h3 className="text-gray-900 text-sm font-semibold mb-3">
                상위 10% vs 팀 평균
              </h3>
              <div className="h-[300px] sm:h-[340px] min-h-[260px] w-full max-w-[420px] mx-auto">
                <RadarChart data={chartData} className="h-full w-full" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-gray-900 text-base font-semibold mb-4">갭 분석 (Gap Analysis)</h3>
                <div className="flex flex-wrap items-start gap-6">
                  <table className="flex-shrink-0 w-full max-w-[260px] border-collapse text-sm">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-600 font-medium">평균 격차</td>
                        <td className="py-2 text-gray-900 font-semibold">{avgGap}점</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-600 font-medium">고성과자 수</td>
                        <td className="py-2 text-blue-600 font-bold">{highPerformer.count}명</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-600 font-medium">고성과자 평균</td>
                        <td className="py-2 text-blue-600 font-bold">{highPerformer.avgScore}점</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-gray-600 font-medium">팀 평균</td>
                        <td className="py-2 text-gray-900 font-semibold">{teamAverage.avgScore}점</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex-1 min-w-[180px]">
                    <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">
                      격차 큰 영역 (순위)
                    </p>
                    <ul className="space-y-1.5">
                      {sortedGaps.map((g, i) => {
                        const variant = g.value >= 20 ? "destructive" : g.value >= 15 ? "yellow" : g.value >= 10 ? "purple" : "gray";
                        return (
                          <li
                            key={g.key}
                            className="flex items-center justify-between gap-2 py-1 border-b border-gray-100 last:border-0"
                          >
                            <span className="text-gray-700 text-sm">{i + 1}. {g.label}</span>
                            <Badge variant={variant}>{g.value.toFixed(1)}점</Badge>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-gray-50/50 p-5 shadow-sm">
                <h3 className="text-gray-900 text-base font-bold mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-blue-500" />
                  고성과자 공통 특성
                </h3>
                <div className="flex flex-wrap gap-2">
                  {highPerformer.commonTraits.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        {rawOpen && <RawDataPanel tables={rawTables} />}
      </Card>
    </section>
  );
}
