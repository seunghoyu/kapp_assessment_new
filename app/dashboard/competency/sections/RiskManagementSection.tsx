"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import {
  organizationData,
  HEATMAP_SCORE_RANGES_10,
  getSkillsByScoreRange10,
  type HeatmapDeptKey,
} from "@/data/competency/originHeatmapData";
import {
  skillRiskData,
  type RiskLevel,
  type SkillRiskItem,
} from "@/data/competency/originSkillRiskData";
import RawDataButton from "../components/RawDataButton";
import RawDataPanel from "../components/RawDataPanel";
import type { RawDataTable } from "../components/RawDataPanel";
import type { CompetencyRecord } from "@/data/competency/competencyRawData";

/** 리스크 레벨 → 긴급/주의/보통/양호 (히트맵과 동일 톤) */
const riskLevelToLabel: Record<RiskLevel, string> = {
  critical: "긴급",
  high: "주의",
  medium: "보통",
  low: "양호",
};

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

const INDIVIDUAL_RAW_COLUMNS = ["이름", "부서", "직책", "역량", "점수", "날짜"];

type RiskManagementSectionProps = {
  rawRecords?: CompetencyRecord[];
};

export default function RiskManagementSection({ rawRecords = [] }: RiskManagementSectionProps) {
  const [selectedDept, setSelectedDept] = useState<HeatmapDeptKey | null>(null);
  const [rawOpen, setRawOpen] = useState(false);
  const detailSectionRef = useRef<HTMLDivElement>(null);

  const deptKeys = useMemo(() => allDeptKeys, []);
  const isFullView = !selectedDept;
  const showEducationButton = !!selectedDept;

  const selectedDeptName = selectedDept ? organizationData.departments[selectedDept].name : null;

  const risksForDept = useMemo(() => {
    if (!selectedDeptName) return [];
    return skillRiskData.filter((r) => r.department === selectedDeptName);
  }, [selectedDeptName]);

  const risksCriticalHigh = useMemo(
    () => risksForDept.filter((r) => r.riskLevel === "critical" || r.riskLevel === "high"),
    [risksForDept]
  );

  const sortedRisks = useMemo(() => {
    return [...risksCriticalHigh].sort(
      (a, b) => riskPriority[a.riskLevel] - riskPriority[b.riskLevel]
    );
  }, [risksCriticalHigh]);

  useEffect(() => {
    if (selectedDept) {
      detailSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDept]);

  const handleDeptClick = useCallback((deptKey: HeatmapDeptKey) => {
    setSelectedDept(deptKey);
  }, []);

  const rawTables: RawDataTable[] = useMemo(() => {
    const heatmapRows: Record<string, unknown>[] = [];
    (Object.keys(organizationData.departments) as HeatmapDeptKey[]).forEach((key) => {
      const dept = organizationData.departments[key];
      Object.entries(dept.skills).forEach(([스킬, 점수]) => {
        heatmapRows.push({ 부서: dept.name, 스킬, 점수 });
      });
    });
    const riskRows = skillRiskData.map((r) => ({
      부서: r.department,
      스킬: r.skill,
      리스크레벨: riskLevelToLabel[r.riskLevel],
      전문가수: r.expertCount,
      필요인원: r.requiredCount,
      예상영향: r.estimatedImpact,
      확률: r.probability,
      영향설명: r.impactDescription,
      권장사항: r.recommendation,
    }));
    const tables: RawDataTable[] = [
      { title: "부서별 스킬 점수 (히트맵 Raw)", columns: ["부서", "스킬", "점수"], rows: heatmapRows },
      { title: "스킬 리스크 목록", columns: ["부서", "스킬", "리스크레벨", "전문가수", "필요인원", "예상영향", "확률", "영향설명", "권장사항"], rows: riskRows },
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

  return (
    <>
      {/* 1. 스킬 갭 히트맵 (origin 그대로) */}
      <section className="mb-12">
        <div className="mb-4 flex flex-row items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              스킬 갭 히트맵
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              조직도 기반 컬러 시각화로 위험 스킬 즉시 파악
            </p>
            <p className="text-sm text-blue-600 mt-1 font-medium">
              부서명을 클릭하면 해당 부서의 상세 내역을 확인할 수 있습니다.
            </p>
          </div>
          <RawDataButton onClick={() => setRawOpen((v) => !v)} />
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
                      <td className="sticky left-0 z-10 w-[10%] min-w-[80px] h-[100px] p-2 align-middle border border-gray-200 rounded-l-lg bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleDeptClick(deptKey)}
                          className="w-full text-left text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded px-1 py-2"
                          title={`${deptData.name} 상세 내역 보기`}
                        >
                          {deptData.name}
                        </button>
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
                                  {showEducationButton && selectedDept === deptKey && items.some((s) => s.score < 60) && (
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
        {rawOpen && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <RawDataPanel tables={rawTables} />
          </div>
        )}
      </section>

      {selectedDept && (
      <section ref={detailSectionRef} className="mb-12 scroll-mt-4">
        <div className="w-full rounded-xl border border-gray-200 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">스킬별 리스크 상세</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedRisks.length === 0 ? (
                <p className="col-span-full text-center py-12 text-gray-500">해당 레벨의 리스크가 없습니다.</p>
              ) : (
                sortedRisks.map((risk) => {
                  const label = riskLevelToLabel[risk.riskLevel];
                  const borderClass =
                    risk.riskLevel === "critical"
                      ? "border-l-red-500"
                      : risk.riskLevel === "high"
                        ? "border-l-red-200"
                        : risk.riskLevel === "medium"
                          ? "border-l-green-200"
                          : "border-l-blue-200";
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
                                {risk.department} — {risk.skill}
                              </h4>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                                  risk.riskLevel === "critical"
                                    ? "bg-red-100 text-red-600"
                                    : risk.riskLevel === "high"
                                      ? "bg-red-100 text-red-700"
                                      : risk.riskLevel === "medium"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
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
        </div>
      </section>
      )}
    </>
  );
}
