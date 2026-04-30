
"use client";

import { useMemo, useState } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBenchmarkFilters } from '../state/useBenchmarkFilters';
import { transformBenchmark } from '@/data/benchmark/transformBenchmark';
import BenchmarkFilters from '../components/BenchmarkFilters';
import InsightList from '../components/InsightList';
import RawDataButton from '../components/RawDataButton';
import RawDataPanel from '../components/RawDataPanel';
import type { RawDataTable } from '../components/RawDataPanel';
import RadarChart from '../components/RadarChart';
import type { CompetencyRecord } from '@/data/competency/competencyRawData';

const INDIVIDUAL_RAW_COLUMNS = ["이름", "부서", "직책", "역량", "점수", "날짜"];

type BenchmarkSectionProps = {
    rawRecords?: CompetencyRecord[];
};

export default function BenchmarkSection({ rawRecords = [] }: BenchmarkSectionProps) {
    const [rawOpen, setRawOpen] = useState(false);
    const {
        selectedDepartment,
        setSelectedDepartment,
        selectedIndustry,
        setSelectedIndustry,
        departmentOptions,
        industryOptions,
        currentDepartmentData,
        currentIndustryData,
    } = useBenchmarkFilters();

    const { positives, negatives } = useMemo(() => {
        return transformBenchmark(currentDepartmentData, currentIndustryData);
    }, [currentDepartmentData, currentIndustryData]);

    const chartData = useMemo(() => {
        const deptSkills = currentDepartmentData.skills;
        const benchmarkSkills = currentIndustryData?.skills ?? {};
        
        const labels = Object.keys(deptSkills);
        const departmentScores = Object.values(deptSkills);
        const benchmarkScores = labels.map(skill => benchmarkSkills[skill] ?? 80);

        return {
            labels,
            datasets: [
                {
                    label: currentDepartmentData.name,
                    data: departmentScores,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                },
                {
                    label: `${industryOptions.find(i => i.value === selectedIndustry)?.label} 상위 10%`,
                    data: benchmarkScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                },
            ],
        };
    }, [currentDepartmentData, currentIndustryData, selectedIndustry, industryOptions]);

    const rawTables: RawDataTable[] = useMemo(() => {
        const deptSkills = currentDepartmentData.skills;
        const industryLabel = industryOptions.find(i => i.value === selectedIndustry)?.label ?? selectedIndustry;
        const deptRows = Object.entries(deptSkills).map(([스킬명, 점수]) => ({ 스킬명, 점수 }));
        const benchSkills = currentIndustryData?.skills ?? {};
        const benchRows = Object.entries(benchSkills).map(([스킬명, 점수]) => ({ 스킬명, 점수 }));
        const tables: RawDataTable[] = [
            { title: `${currentDepartmentData.name} 스킬 점수`, columns: ["스킬명", "점수"], rows: deptRows },
            { title: `${industryLabel} 상위 10% 스킬 점수`, columns: ["스킬명", "점수"], rows: benchRows },
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
    }, [currentDepartmentData, currentIndustryData, selectedIndustry, industryOptions, rawRecords]);

    return (
        <section>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>역량 벤치마킹</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            부서 역량과 업계 상위 수준을 비교하여 강점과 약점을 분석합니다.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <RawDataButton onClick={() => setRawOpen((v) => !v)} />
                        <BenchmarkFilters
                        selectedDepartment={selectedDepartment}
                        onDepartmentChange={setSelectedDepartment}
                        departmentOptions={departmentOptions}
                        selectedIndustry={selectedIndustry}
                        onIndustryChange={setSelectedIndustry}
                        industryOptions={industryOptions}
                        />
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="min-h-[440px] flex items-center justify-center">
                        <div className="h-[400px] sm:h-[460px] min-h-[360px] w-full max-w-[520px]">
                            <RadarChart data={chartData} className="h-full w-full" />
                        </div>
                    </div>
                    <div className="space-y-6 min-h-[440px] max-h-[600px] overflow-y-auto pr-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">벤치마킹 인사이트</h3>
                            <div className="space-y-4">
                                <InsightList
                                    title="경쟁 우위 영역"
                                    insights={positives}
                                    isNegative={false}
                                    emptyPlaceholder="업계 대비 특별한 강점이 발견되지 않았습니다."
                                />
                                <InsightList
                                    title="우선 개선 필요 영역"
                                    insights={negatives}
                                    isNegative={true}
                                    emptyPlaceholder="업계 대비 특별한 약점이 발견되지 않았습니다."
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                {rawOpen && <RawDataPanel tables={rawTables} />}
            </Card>
        </section>
    );
}
