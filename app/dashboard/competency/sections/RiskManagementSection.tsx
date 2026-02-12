"use client";

import { useState, useMemo } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  organizationData,
  heatmapDeptOptions,
  heatmapSkillOptions,
  HEATMAP_SCORE_RANGES_10,
  getSkillsByScoreRange10,
  type HeatmapDeptKey,
} from "@/data/competency/originHeatmapData";
import {
  skillRiskData,
  riskLevelLabels,
  type RiskLevel,
  type SkillRiskItem,
} from "@/data/competency/originSkillRiskData";

const riskPriority: Record<RiskLevel, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

// --- 스킬 갭 히트맵: 교육 배정 (origin assignTraining)
function assignTraining(dept: string, skill: string) {
  const deptData = organizationData.departments[dept as HeatmapDeptKey];
  const deptName = deptData?.name ?? dept;
  window.alert(
    `${deptName}의 ${skill} 스킬 향상을 위한 교육 프로그램이 배정되었습니다.\n\n추천 강의:\n- ${skill} 기초부터 심화까지\n- 실무 프로젝트 기반 학습\n\n예상 학습 기간: 8주`
  );
}

// --- 조직 건강도: 교육 배정 (origin assignTrainingForRisk)
function assignTrainingForRisk(risk: SkillRiskItem) {
  window.alert(
    `교육 배정 완료!\n\n부서: ${risk.department}\n스킬: ${risk.skill}\n권장 교육: ${risk.recommendation}\n\n해당 팀원들에게 교육 과정이 배정되었습니다.`
  );
}

// --- 조직 건강도: 상세 분석 (origin viewRiskDetails)
function viewRiskDetails(risk: SkillRiskItem) {
  window.alert(
    `상세 리스크 분석\n\n부서: ${risk.department}\n스킬: ${risk.skill}\n리스크 레벨: ${risk.riskLevel}\n현재 전문가: ${risk.expertCount}명\n필요 인원: ${risk.requiredCount}명\n예상 영향: ${risk.estimatedImpact}%\n발생 확률: ${risk.probability}\n\n${risk.impactDescription}`
  );
}

const allDeptKeys = Object.keys(organizationData.departments) as HeatmapDeptKey[];

export default function RiskManagementSection() {
  const [heatmapDept, setHeatmapDept] = useState<string>("all");
  const [heatmapSkill, setHeatmapSkill] = useState<string>("all");
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>("all");

  const deptKeys = useMemo(() => {
    if (heatmapDept === "all") return allDeptKeys;
    return [heatmapDept as HeatmapDeptKey];
  }, [heatmapDept]);

  const isFullView = heatmapDept === "all";
  const showEducationButton = !isFullView;

  const riskCounts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 };
    skillRiskData.forEach((r) => {
      c[r.riskLevel]++;
    });
    return c;
  }, []);

  const filteredRisks = useMemo(() => {
    if (riskLevelFilter === "all") return [...skillRiskData];
    return skillRiskData.filter((r) => r.riskLevel === riskLevelFilter);
  }, [riskLevelFilter]);

  const sortedFilteredRisks = useMemo(() => {
    return [...filteredRisks].sort(
      (a, b) => riskPriority[a.riskLevel] - riskPriority[b.riskLevel]
    );
  }, [filteredRisks]);

  const refreshHeatmap = () => {
    setHeatmapDept((d) => d);
    setHeatmapSkill((s) => s);
  };

  const refreshRiskAnalysis = () => {
    window.alert("스킬 리스크 재분석이 완료되었습니다.");
  };

  return (
    <>
      {/* 1. 스킬 갭 히트맵 (origin 그대로) */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            스킬 갭 히트맵
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            조직도 기반 컬러 시각화로 위험 스킬 즉시 파악
          </p>
        </div>
        <div className="flex flex-wrap gap-6 items-end mb-8">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">부서 선택</label>
            <select
              value={heatmapDept}
              onChange={(e) => setHeatmapDept(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {heatmapDeptOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">스킬 카테고리</label>
            <select
              value={heatmapSkill}
              onChange={(e) => setHeatmapSkill(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {heatmapSkillOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={refreshHeatmap}>
            새로고침
          </Button>
        </div>
        <div className="w-full min-h-[50vh] overflow-auto rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
          <div className="w-full p-2">
            <table className="w-full border-separate table-fixed" style={{ borderSpacing: 6 }}>
              <tbody>
                {deptKeys.map((deptKey) => {
                  const deptData = organizationData.departments[deptKey];
                  const buckets = getSkillsByScoreRange10(deptKey);
                  return (
                    <tr key={deptKey} className="h-[100px]">
                      <td className="sticky left-0 z-10 w-[10%] min-w-[80px] h-[100px] p-2 text-sm font-medium text-gray-800 bg-gray-50 align-middle border border-gray-200 rounded-l-lg">
                        {deptData.name}
                      </td>
                      {HEATMAP_SCORE_RANGES_10.map((range, rangeIndex) => {
                        const items = buckets[rangeIndex] ?? [];
                        const { bgClass, textClass } = range;
                        const skillListText = items
                          .map((s) => `${s.skillName} ${s.score}점`)
                          .join("\n");
                        return (
                          <td
                            key={range.label}
                            className={`min-w-[64px] w-[9%] h-[100px] p-2.5 align-top border border-gray-200 rounded-lg ${items.length === 0 ? "bg-gray-100" : bgClass} ${items.length === 0 ? "text-gray-400" : textClass}`}
                            title={skillListText || `${range.label} (${range.group})`}
                          >
                            <div className="w-full h-full flex flex-col items-stretch justify-start gap-1 overflow-hidden">
                              {items.length === 0 ? (
                                <span className="text-sm">-</span>
                              ) : (
                                <>
                                  {items.slice(0, 3).map((s) => (
                                    <div
                                      key={s.skillName}
                                      className="flex items-baseline justify-between gap-1 text-sm leading-snug"
                                      title={`${s.skillName} ${s.score}점`}
                                    >
                                      <span className="truncate min-w-0 font-medium">
                                        {s.skillName}
                                      </span>
                                      <span className="font-bold shrink-0 tabular-nums">{s.score}</span>
                                    </div>
                                  ))}
                                  {items.length > 3 && (
                                    <span className="text-xs font-medium opacity-90">+{items.length - 3}</span>
                                  )}
                                  {showEducationButton && items.some((s) => s.score < 60) && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {items
                                        .filter((s) => s.score < 60)
                                        .slice(0, 2)
                                        .map((s) => (
                                          <button
                                            key={s.skillName}
                                            type="button"
                                            onClick={() => assignTraining(deptKey, s.skillName)}
                                            className="text-xs font-medium underline opacity-90 hover:opacity-100 truncate max-w-full text-left"
                                            title={`${s.skillName} - 교육 배정`}
                                          >
                                            {s.skillName}
                                          </button>
                                        ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-red-500 border border-gray-200" />
            긴급 (0-40)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-red-200 border border-gray-200" />
            주의 (41-60)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-green-200 border border-gray-200" />
            보통 (61-80)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-blue-200 border border-gray-200" />
            양호 (80-90)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-blue-500 border border-gray-200" />
            우수 (90-100)
          </span>
        </div>
      </section>

      {/* 2. 조직 건강도 및 스킬 리스크 관리 (origin 그대로) */}
      <section className="mb-12">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            조직 건강도 및 스킬 리스크 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            부서별 스킬 분포 분석 및 역량 공백 구역 조기 경고 시스템
          </p>
        </div>
        <div className="flex flex-wrap gap-6 items-end mb-8">
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              리스크 레벨 필터
            </label>
            <select
              value={riskLevelFilter}
              onChange={(e) => setRiskLevelFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">전체 보기</option>
              <option value="critical">긴급 (Critical)</option>
              <option value="high">높음 (High)</option>
              <option value="medium">보통 (Medium)</option>
              <option value="low">낮음 (Low)</option>
            </select>
          </div>
          <Button variant="primary" size="sm" onClick={refreshRiskAnalysis}>
            리스크 재분석
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border-2 border-red-500 flex items-center gap-4">
            <div>
              <h4 className="text-xs uppercase text-gray-500 font-semibold">긴급</h4>
              <p className="text-2xl font-bold text-gray-900">{riskCounts.critical}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-amber-500 flex items-center gap-4">
            <div>
              <h4 className="text-xs uppercase text-gray-500 font-semibold">높음</h4>
              <p className="text-2xl font-bold text-gray-900">{riskCounts.high}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-yellow-500 flex items-center gap-4">
            <div>
              <h4 className="text-xs uppercase text-gray-500 font-semibold">보통</h4>
              <p className="text-2xl font-bold text-gray-900">{riskCounts.medium}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-emerald-500 flex items-center gap-4">
            <div>
              <h4 className="text-xs uppercase text-gray-500 font-semibold">낮음</h4>
              <p className="text-2xl font-bold text-gray-900">{riskCounts.low}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {sortedFilteredRisks.length === 0 ? (
                <p className="text-center py-12 text-gray-500">해당 레벨의 리스크가 없습니다.</p>
              ) : (
                sortedFilteredRisks.map((risk) => {
                  const label = riskLevelLabels[risk.riskLevel];
                  const borderClass =
                    risk.riskLevel === "critical"
                      ? "border-l-red-500"
                      : risk.riskLevel === "high"
                        ? "border-l-amber-500"
                        : risk.riskLevel === "medium"
                          ? "border-l-yellow-500"
                          : "border-l-emerald-500";
                  return (
                    <div
                      key={risk.id}
                      className={`bg-gray-50 rounded-xl border-2 border-gray-200 border-l-[6px] ${borderClass} overflow-hidden hover:border-blue-500 hover:shadow-md transition-all`}
                    >
                      <div className="bg-white p-6 border-b-2 border-gray-200">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {risk.department} - {risk.skill}
                              </h4>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                  risk.riskLevel === "critical"
                                    ? "bg-red-100 text-red-600"
                                    : risk.riskLevel === "high"
                                      ? "bg-amber-100 text-amber-700"
                                      : risk.riskLevel === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {label}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <div>
                              <label className="text-xs text-gray-500 font-semibold">
                                현재 전문가
                              </label>
                              <p
                                className={`text-xl font-bold ${
                                  risk.expertCount === 0 ? "text-red-600" : "text-gray-900"
                                }`}
                              >
                                {risk.expertCount}명
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-semibold">
                                필요 인원
                              </label>
                              <p className="text-xl font-bold text-gray-900">
                                {risk.requiredCount}명
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-semibold">
                                예상 영향
                              </label>
                              <p className="text-xl font-bold text-red-600">
                                {risk.estimatedImpact}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-4">
                          <h5 className="text-sm font-bold text-gray-900 mb-1">
                            리스크 상황
                          </h5>
                          <p className="text-gray-600 text-sm">{risk.impactDescription}</p>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-sm font-bold text-gray-900 mb-1">권장 조치</h5>
                          <p className="text-gray-600 text-sm">{risk.recommendation}</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => assignTrainingForRisk(risk)}
                          >
                            교육 즉시 배정
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => viewRiskDetails(risk)}
                          >
                            상세 분석
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
