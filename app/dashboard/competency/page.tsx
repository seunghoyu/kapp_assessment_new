
"use client";

import Header from "@/components/layout/Header";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useCompetencyFilter } from "./hooks/useCompetencyFilter";
import FilterBar from "./components/FilterBar";
import SummaryKpiRow from "./components/SummaryKpiRow";
import DepartmentCompetency from "./components/DepartmentCompetency";
import TrendLineChart from "./components/TrendLineChart";
import HighPerformerSection from "./sections/HighPerformerSection";
import ROICalculatorSection from "./sections/ROICalculatorSection";
import BenchmarkSection from "./sections/BenchmarkSection";
import Button from "@/components/ui/Button";
import { useState } from "react";

type Tab = "overview" | "strategy";

export default function CompetencyAnalysisPage() {
  const filter = useCompetencyFilter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "현황 & 비교" },
    { id: "strategy", label: "전략 & 성과" },
  ];

  const tabActions = (
    <div className="flex items-center gap-2">
      {TABS.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab(tab.id)}
          className="transition-colors"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <Header
        title="역량 분석"
        subtitle="부서·기간·역량 기준 통합 분석"
        actions={tabActions}
      />
      <main className="flex-1 overflow-y-auto bg-[#fdfdfd] w-full">
        {activeTab === "overview" && (
          <FilterBar
            selectedDepartments={filter.selectedDepartments}
            setSelectedDepartments={filter.setSelectedDepartments}
            dateRange={filter.dateRange}
            setDateRange={filter.setDateRange}
            departments={filter.departments}
            filteredData={filter.filteredData}
            onReset={filter.reset}
          />
        )}
        <div className="w-full p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <>
              <section className="mb-12">
                <h2 className="sr-only">요약 KPI</h2>
                <SummaryKpiRow
                  avg={filter.summary.avg}
                  maxDept={filter.summary.maxDept}
                  minDept={filter.summary.minDept}
                  maxDeptScore={filter.summary.maxDeptScore}
                  minDeptScore={filter.summary.minDeptScore}
                  skillAvg={filter.summary.skillAvg}
                  skillExtremes={filter.summary.skillExtremes}
                />
              </section>

              <section className="mb-12">
                <DepartmentCompetency 
                  data={filter.barData} 
                  dateRange={filter.dateRange}
                />
              </section>

              <section>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>기간별 추이</CardTitle>
                    <div className="flex gap-1">
                        <Button variant={filter.trendMode === 'daily' ? 'primary' : 'ghost'} size="sm" onClick={() => filter.setTrendMode('daily')}>일별</Button>
                        <Button variant={filter.trendMode === 'monthly' ? 'primary' : 'ghost'} size="sm" onClick={() => filter.setTrendMode('monthly')}>월별</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TrendLineChart data={filter.trendData} />
                  </CardContent>
                </Card>
              </section>
            </>
          )}
          {activeTab === "strategy" && (
            <>
              <section className="mb-12">
                <ROICalculatorSection />
              </section>
              <section className="mb-12">
                <HighPerformerSection />
              </section>
              <section>
                <BenchmarkSection />
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
