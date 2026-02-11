"use client";

import { useState, useMemo } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

// origin admin-advanced.js ROI 공식 그대로
const SKILL_TO_PRODUCTIVITY_RATE = 0.75;
const AVG_SALARY_MAN = 5000; // 만원 (5천만원, 2024 한국 중간 관리자 평균)

function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()}만원`;
}

function calculateROI(
  employees: number,
  costPerPerson: number,
  skillImprovement: number
): {
  totalInvestment: number;
  annualReturn: number;
  profit: number;
  roiPercentage: number;
  productivityGain: number;
  errorReduction: number;
  timeEfficiency: number;
  paybackMonths: number;
} {
  const totalInvestment = employees * costPerPerson;
  const productivityImprovement = skillImprovement * SKILL_TO_PRODUCTIVITY_RATE;
  const annualReturn =
    employees * AVG_SALARY_MAN * (productivityImprovement / 100);
  const profit = annualReturn - totalInvestment;
  const roiPercentage =
    totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
  const productivityGain = annualReturn * 0.6;
  const errorReduction = annualReturn * 0.25;
  const timeEfficiency = annualReturn * 0.15;
  const paybackMonths =
    annualReturn > 0 ? Math.ceil((totalInvestment / annualReturn) * 12) : 0;
  return {
    totalInvestment,
    annualReturn,
    profit,
    roiPercentage,
    productivityGain,
    errorReduction,
    timeEfficiency,
    paybackMonths,
  };
}

export default function ROICalculatorSection() {
  const [employees, setEmployees] = useState(50);
  const [costPerPerson, setCostPerPerson] = useState(120);
  const [skillImprovement, setSkillImprovement] = useState(25);
  const [showResults, setShowResults] = useState(false);

  const result = useMemo(
    () => calculateROI(employees, costPerPerson, skillImprovement),
    [employees, costPerPerson, skillImprovement]
  );

  const handleCalculate = () => {
    if (!employees || !costPerPerson || !skillImprovement) return;
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <section className="space-y-6">
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon name="analytics" size={20} className="text-blue-600" />
            <CardTitle className="text-gray-900 text-base font-semibold">
              교육비 ROI 자동 계산기
            </CardTitle>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            스킬 갭 교육 투자의 예상 수익 금액 환산
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
              <div>
                <label
                  htmlFor="roiEmployees"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  교육 대상 인원
                </label>
                <input
                  id="roiEmployees"
                  type="number"
                  min={1}
                  value={employees}
                  onChange={(e) => setEmployees(Number(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="roiCostPerPerson"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  1인당 교육 비용 (만원)
                </label>
                <input
                  id="roiCostPerPerson"
                  type="number"
                  min={1}
                  value={costPerPerson}
                  onChange={(e) => setCostPerPerson(Number(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="roiSkillImprovement"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  예상 스킬 향상 (%)
                </label>
                <input
                  id="roiSkillImprovement"
                  type="number"
                  min={1}
                  max={100}
                  value={skillImprovement}
                  onChange={(e) =>
                    setSkillImprovement(Number(e.target.value) || 0)
                  }
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleCalculate}
              disabled={!employees || !costPerPerson || !skillImprovement}
              className="sm:shrink-0"
            >
              ROI 계산하기
            </Button>
          </div>

          {showResults && (
            <div className="pt-6 border-t border-gray-200 space-y-6">
              <div className="flex justify-end">
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  초기화
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 items-center justify-center flex-wrap">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-center min-w-[180px] flex-1 sm:flex-initial sm:min-w-[200px]">
                  <h4 className="text-gray-700 text-base font-semibold mb-1">
                    총 교육 투자
                  </h4>
                  <p className="text-gray-900 text-2xl font-semibold text-blue-700">
                    {formatCurrency(result.totalInvestment)}
                  </p>
                </div>
                <div className="flex items-center justify-center text-blue-500 shrink-0">
                  <Icon name="chevronRight" size={28} />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm text-center min-w-[180px] flex-1 sm:flex-initial sm:min-w-[200px]">
                  <h4 className="text-gray-700 text-base font-semibold mb-1">
                    예상 수익 (1년)
                  </h4>
                  <p className="text-gray-900 text-2xl font-semibold text-blue-700">
                    {formatCurrency(result.annualReturn)}
                  </p>
                </div>
                <span className="flex items-center justify-center text-blue-600 font-bold text-2xl shrink-0 w-8">
                  =
                </span>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-sm text-center min-w-[180px] flex-1 sm:flex-initial sm:min-w-[200px]">
                  <h4 className="text-gray-700 text-base font-semibold mb-1">
                    순이익 (ROI)
                  </h4>
                  <p className="text-gray-900 text-2xl font-bold text-blue-700">
                    {formatCurrency(result.profit)}
                  </p>
                  <p className="text-blue-700 text-sm font-semibold mt-0.5">
                    ROI: {result.roiPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-gray-900 text-base font-semibold mb-4">
                  상세 수익 분석
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-[120px_1fr_140px] gap-3 items-center">
                    <span className="text-gray-700 text-sm font-semibold">
                      생산성 향상
                    </span>
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden min-w-0">
                      <div
                        className="h-full bg-blue-500 rounded-lg"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <span className="text-gray-900 text-sm font-bold text-right">
                      {formatCurrency(result.productivityGain)}{" "}
                      <span className="text-purple-700 font-bold">(60%)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr_140px] gap-3 items-center">
                    <span className="text-gray-700 text-sm font-semibold">
                      오류 감소
                    </span>
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden min-w-0">
                      <div
                        className="h-full bg-blue-600 rounded-lg"
                        style={{ width: "25%" }}
                      />
                    </div>
                    <span className="text-gray-900 text-sm font-bold text-right">
                      {formatCurrency(result.errorReduction)}{" "}
                      <span className="text-purple-700 font-bold">(25%)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr_140px] gap-3 items-center">
                    <span className="text-gray-700 text-sm font-semibold">
                      시간 효율성
                    </span>
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden min-w-0">
                      <div
                        className="h-full bg-blue-700 rounded-lg"
                        style={{ width: "15%" }}
                      />
                    </div>
                    <span className="text-gray-900 text-sm font-bold text-right">
                      {formatCurrency(result.timeEfficiency)}{" "}
                      <span className="text-purple-700 font-bold">(15%)</span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-gray-700 text-sm font-semibold mb-1">
                    투자 회수 기간 (Payback Period)
                  </h4>
                  <p className="text-gray-900 font-semibold text-blue-700">
                    약 {result.paybackMonths}개월
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    * 교육 효과는 3개월 후부터 본격 발현됨 (Learning Curve 고려)
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
