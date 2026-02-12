
"use client";

import { useMemo } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useBenchmarkFilters } from '../state/useBenchmarkFilters';
import { transformBenchmark } from '@/data/benchmark/transformBenchmark';
import BenchmarkFilters from '../components/BenchmarkFilters';
import InsightList from '../components/InsightList';
import RadarChart from '../components/RadarChart';

export default function BenchmarkSection() {
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
                    <BenchmarkFilters
                        selectedDepartment={selectedDepartment}
                        onDepartmentChange={setSelectedDepartment}
                        departmentOptions={departmentOptions}
                        selectedIndustry={selectedIndustry}
                        onIndustryChange={setSelectedIndustry}
                        industryOptions={industryOptions}
                    />
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <RadarChart data={chartData} />
                    </div>
                    <div className="space-y-6 max-h-[450px] overflow-y-auto pr-4">
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
            </Card>
        </section>
    );
}
