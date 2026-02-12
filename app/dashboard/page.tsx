"use client";

import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Toast, { type ToastType } from "@/components/ui/Toast";
import ProgressSection from "./sections/ProgressSection";
import EmployeeSection from "./sections/EmployeeSection";
import strategyMapper from "@/data/strategyMapper.json";

// origin(admin-advanced.js)과 동일: 추천 인력 후보 5명
const MOCK_CANDIDATES = [
  { name: "김해커", dept: "개발팀", position: "시니어", matchScore: 92, matchedSkills: ["파이썬", "AI·머신러닝", "데이터 분석"] },
  { name: "이데이터", dept: "데이터분석팀", position: "매니저", matchScore: 88, matchedSkills: ["AI·머신러닝", "데이터 분석"] },
  { name: "박프로젝트", dept: "기획팀", position: "리드", matchScore: 85, matchedSkills: ["데이터 분석", "클라우드"] },
  { name: "최전략", dept: "전략팀", position: "시니어", matchScore: 82, matchedSkills: ["파이썬", "AI·머신러닝"] },
  { name: "정비즈", dept: "영업팀", position: "매니저", matchScore: 78, matchedSkills: ["데이터 분석", "클라우드"] },
];

// origin과 동일: 필수/권장 교육 (name, duration, priority)
const MOCK_TRAINING = [
  { name: "AI 기초", duration: "8주", priority: "high" as const },
  { name: "프로세스 자동화", duration: "6주", priority: "high" as const },
  { name: "크로스팀 리더십", duration: "10주", priority: "medium" as const },
];

// origin과 동일: 4단계 실행 로드맵
const ROADMAP_PHASES = [
  { phase: 1, title: "1단계: 후보 선정 및 팀 구성 (1~2주)", desc: "적합 후보 5명 선정, 프로젝트 킥오프" },
  { phase: 2, title: "2단계: 집중 교육 프로그램 (8~12주)", desc: "3개 핵심 과정 진행, 주간 성과 리뷰" },
  { phase: 3, title: "3단계: 파일럿 프로젝트 (4~6주)", desc: "실전 적용, A/B 테스트, 성과 측정" },
  { phase: 4, title: "4단계: 전사 확대 (진행 중)", desc: "Best Practice 공유, 전사 확산" },
];

export default function DashboardPage() {
  const [draft, setDraft] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const onNotify = useCallback((message: string, type: ToastType = "info") => {
    setToast({ message, type });
  }, []);

  const placeholder = strategyMapper.inputPlaceholder ?? "예: AI 전환, 신규 해외 시장 진출, 디지털 마케팅 강화";

  const getPhaseColorClass = (phase: number) => {
    if (phase === 1) return "bg-blue-500";
    if (phase === 2) return "bg-blue-600";
    if (phase === 3) return "bg-blue-700";
    return "bg-gray-700";
  };

  const handleAnalyze = () => {
    const text = draft.trim();
    if (!text) return;
    setSubmittedKeyword(text);
    setDraft("");
  };

  const handleReset = () => {
    setSubmittedKeyword(null);
    setDraft("");
  };

  return (
    <>
      <Header
        title="대시보드"
        subtitle="조직 분석 및 관리"
      />
      <main className="flex-1 overflow-y-auto bg-[#fdfdfd] w-full">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          {/* 조직 전략-스킬 자동 매핑 (origin과 동일 구조) */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon name="insights" size={18} className="text-blue-600" />
                  <CardTitle>조직 전략-스킬 자동 매핑</CardTitle>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  전략 키워드를 입력하면 필요한 인력과 교육을 추천해요.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end mb-6">
                  <div className="flex-1">
                    <label htmlFor="strategyInput" className="block text-sm font-medium text-gray-700 mb-1">
                      2026년 조직 전략 키워드
                    </label>
                    <input
                      id="strategyInput"
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAnalyze();
                        }
                      }}
                      placeholder={placeholder}
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleAnalyze}
                    disabled={!draft.trim()}
                  >
                    AI 분석 시작
                  </Button>
                </div>

                {submittedKeyword && (
                  <div className="flex flex-col gap-8 pt-2 border-t border-gray-200">
                    <div className="flex justify-end">
                      <Button variant="secondary" size="sm" onClick={handleReset}>
                        결과 초기화
                      </Button>
                    </div>
                    {/* 1. 추천 인력 배치 (origin: candidate-list) */}
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Icon name="users" size={18} />
                          이런 분들이 <span className="text-blue-700">{submittedKeyword}</span>에 적합해 보여요
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          현재 보유 스킬을 기준으로 한 추천 예시입니다.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {MOCK_CANDIDATES.map((c, idx) => (
                          <div
                            key={c.name}
                            className="relative p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                          >
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                              #{idx + 1}
                            </div>
                            <div className="pr-10">
                              <h4 className="font-bold text-gray-900">{c.name}</h4>
                              <p className="text-gray-500 text-sm mt-0.5">{c.dept} | {c.position}</p>
                              <div className="mt-2">
                                <Badge variant="blue" size="md">적합도 {c.matchScore}%</Badge>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {c.matchedSkills.map((s) => (
                                  <Badge key={s} variant="yellow">{s}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. 필수 교육 프로그램 (origin: training-list) */}
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Icon name="programs" size={18} />
                          <span className="text-blue-700">{submittedKeyword}</span>을 위한 추천 교육이에요
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          우선순위에 따라 핵심 과정을 먼저 수강하는 것을 권장해요.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MOCK_TRAINING.map((t) => (
                          <div
                            key={t.name}
                            className="p-4 rounded-lg border border-gray-200 border-l-4 border-l-purple-500 bg-white shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h4 className="font-bold text-gray-900 flex-1">{t.name}</h4>
                              <Badge variant="purple">
                                {t.priority === "high" ? "필수" : "권장"}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-gray-500 text-sm mb-3">
                              <span>⏱ {t.duration}</span>
                              <span>20명 추천</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. 실행 로드맵 (origin: roadmap-timeline) */}
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <Icon name="trendingUp" size={18} />
                          <span className="text-blue-700">{submittedKeyword}</span> 실행 로드맵 예시예요
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          조직 상황에 맞게 기간·순서를 조정해 적용해요.
                        </p>
                      </div>
                      <div className="flex flex-col gap-6 py-2">
                        {ROADMAP_PHASES.map((item) => (
                          <div key={item.phase} className="flex gap-4 items-start">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white shrink-0 ${getPhaseColorClass(item.phase)}`}
                            >
                              {item.phase}
                            </div>
                            <div className="flex-1 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                              <h4 className="font-bold text-gray-900">{item.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* 역량 개발 진행 현황 (origin: progress-section) */}
          <section className="mb-12">
            <ProgressSection />
          </section>

          {/* 개요 카드: 진행현황 / 이번 달 요약 */}
          <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 진행현황 */}
            <Card hover>
              <CardHeader>
                <CardTitle>진행현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left font-semibold text-gray-900 px-3 py-2 border-b border-gray-200">
                          항목
                        </th>
                        <th className="text-left font-semibold text-gray-900 px-3 py-2 border-b border-gray-200">
                          값
                        </th>
                        <th className="text-left font-semibold text-gray-900 px-3 py-2 border-b border-gray-200">
                          상태/비고
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                          총 직원 수
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200">
                          <span className="font-semibold text-gray-900">1,234명</span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="blue">활성</Badge>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Icon name="trendingUp" size={12} className="text-blue-600" />
                              전월 대비 +5.2%
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                          진행 중 프로그램
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200">
                          <span className="font-semibold text-gray-900">12개</span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="yellow">진행중</Badge>
                            <span className="text-xs text-gray-500">참여자 456명</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                          완료율
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200">
                          <span className="font-semibold text-gray-900">87%</span>
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="blue">목표</Badge>
                            <span className="text-xs text-gray-500">목표 대비 달성</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-700">
                          평균 스킬 레벨
                        </td>
                        <td className="px-3 py-2">
                          <span className="font-semibold text-gray-900">4.2</span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="purple">향상</Badge>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Icon name="trendingUp" size={12} className="text-purple-600" />
                              전월 대비 +0.3
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 이번 달 요약 */}
            <Card hover>
              <CardHeader>
                <CardTitle>이번 달 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x divide-gray-100">
                  <div className="space-y-4 sm:pr-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">신규 직원</span>
                      <span className="font-semibold text-gray-900">23명</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">완료된 프로그램</span>
                      <span className="font-semibold text-gray-900">8개</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">생성된 리포트</span>
                      <span className="font-semibold text-gray-900">12개</span>
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-0 space-y-4 sm:pl-6">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      주요 성과
                    </div>
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
                </div>
              </CardContent>
            </Card>
          </div>
          </section>

          {/* 임직원 역량 현황 (origin: employee-section) */}
          <section>
            <EmployeeSection onNotify={onNotify} />
          </section>
        </div>
      </main>
      <Toast
        message={toast?.message ?? null}
        type={toast?.type ?? "info"}
        onDismiss={() => setToast(null)}
      />
    </>
  );
}
