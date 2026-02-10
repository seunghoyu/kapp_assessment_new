"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import DepartmentPerformanceChart from "@/components/charts/DepartmentPerformanceChart";
import DepartmentSkillChartWithFilter from "@/components/charts/DepartmentSkillChartWithFilter";
import { useDepartmentSkillFilter } from "@/components/charts/useDepartmentSkillFilter";
import { DepartmentSkillFilter } from "@/components/charts/DepartmentSkillFilter";
import BenchmarkSection from "./competency/sections/BenchmarkSection";

export default function DashboardPage() {
  const skillFilter = useDepartmentSkillFilter();

  return (
    <>
      <Header
        title="대시보드"
        subtitle="조직 분석 및 관리"
      />
      <main className="flex-1 overflow-y-auto bg-[#fdfdfd] w-full">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          {/* KPI 카드 그리드 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>총 직원 수</CardTitle>
                  <Badge variant="blue">활성</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900">1,234</div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="trendingUp" size={12} className="text-blue-600" />
                  <span>전월 대비 +5.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>진행 중 프로그램</CardTitle>
                  <Badge variant="yellow">진행중</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900">12</div>
                <div className="mt-2 text-xs text-gray-500">참여자 456명</div>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>완료율</CardTitle>
                  <Badge variant="blue">목표</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900">87%</div>
                <div className="mt-2 text-xs text-gray-500">목표 대비 달성</div>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>평균 스킬 레벨</CardTitle>
                  <Badge variant="purple">향상</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-gray-900">4.2</div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="trendingUp" size={12} className="text-purple-600" />
                  <span>전월 대비 +0.3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 차트 섹션 */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>부서별 역량 현황</CardTitle>
                  <DepartmentSkillFilter
                    selectedYear={skillFilter.selectedYear}
                    selectedMonth={skillFilter.selectedMonth}
                    availableYears={skillFilter.availableYears}
                    availableMonths={skillFilter.availableMonths}
                    onYearChange={skillFilter.handleYearChange}
                    onMonthChange={skillFilter.setSelectedMonth}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <DepartmentSkillChartWithFilter data={skillFilter.filteredData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>스킬 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-400">차트 플레이스홀더</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 요약 지표 섹션 */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>이번 달 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">신규 직원</span>
                    <span className="text-sm font-semibold text-gray-900">23명</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">완료된 프로그램</span>
                    <span className="text-sm font-semibold text-gray-900">8개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">생성된 리포트</span>
                    <span className="text-sm font-semibold text-gray-900">12개</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>주요 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">교육 완료율</span>
                    <Badge variant="blue">87%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">스킬 향상</span>
                    <Badge variant="purple">+12%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">목표 달성</span>
                    <Badge variant="yellow">진행중</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>다음 액션</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium text-gray-900">리뷰 필요</div>
                    <div className="text-xs text-gray-500 mt-1">3개의 AI 인사이트</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <div className="font-medium text-gray-900">승인 대기</div>
                    <div className="text-xs text-gray-500 mt-1">5개의 교육 프로그램</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <BenchmarkSection />
          </div>
        </div>
      </main>
    </>
  );
}
