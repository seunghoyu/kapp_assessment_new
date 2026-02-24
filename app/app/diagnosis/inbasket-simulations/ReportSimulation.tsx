"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Database,
  Bold,
  Italic,
  Underline,
  BarChart3,
  Table,
  Image,
  CheckCircle,
  Save,
} from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

/** 원본과 동일: 6부서, 제출/부분제출/미제출 */
const DEPARTMENTS_INIT = [
  { id: 1, name: "영업부", status: "제출" as const, data: "매출 120억원, 전년대비 15% 증가", icon: "💼" },
  { id: 2, name: "마케팅부", status: "부분제출" as const, data: "캠페인 3건 진행 중, 데이터 보완 필요", icon: "📊" },
  { id: 3, name: "개발부", status: "미제출" as const, data: null, icon: "💻" },
  { id: 4, name: "인사부", status: "제출" as const, data: "신규 채용 8명, 이직률 5%", icon: "👥" },
  { id: 5, name: "재무부", status: "미제출" as const, data: null, icon: "💰" },
  { id: 6, name: "고객지원부", status: "부분제출" as const, data: "고객 만족도 조사 진행 중", icon: "🎧" },
];

const PRIORITY_OPTIONS = [
  { value: "1", label: "🔴 높음 (보고서 필수 항목)" },
  { value: "2", label: "🟡 보통 (있으면 좋음)" },
  { value: "3", label: "🟢 낮음 (생략 가능)" },
];

const ACTION_OPTIONS = [
  { value: "즉시독촉", label: "📞 긴급 독촉 (전화/방문)" },
  { value: "기존자료", label: "📄 기존 자료로 대체" },
  { value: "이번제외", label: "❌ 이번 보고서에서 제외" },
  { value: "간략요약", label: "✏️ 간략 요약으로 처리" },
];

type DeptDecision = {
  priority: string;
  action: string;
  note: string;
  complete: boolean;
};

type Props = { question: InbasketQuestion };

export default function ReportSimulation({ question }: Props) {
  const [departments] = useState(() => DEPARTMENTS_INIT);
  const [decisions, setDecisions] = useState<Record<number, DeptDecision>>({});
  const [overview, setOverview] = useState("");
  const [deptAnalysis, setDeptAnalysis] = useState("");
  const [conclusion, setConclusion] = useState("");

  const needDecision = useMemo(
    () => departments.filter((d) => d.status !== "제출"),
    [departments]
  );

  const completeDecision = (deptId: number, priority: string, action: string, note: string) => {
    if (!priority || !action) return;
    setDecisions((prev) => ({
      ...prev,
      [deptId]: { priority, action, note, complete: true },
    }));
  };

  const completedCount = useMemo(
    () => needDecision.filter((d) => decisions[d.id]?.complete).length,
    [needDecision, decisions]
  );
  const progressPercent = needDecision.length > 0 ? Math.round((completedCount / needDecision.length) * 100) : 100;

  return (
    <div className="bg-gray-100 flex flex-col rounded-xl overflow-hidden min-h-[70vh]">
      {/* 상단 툴바 + 리본 (원본과 동일) */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-blue-600">보고서 작성</span>
            <span className="text-sm text-gray-600 truncate max-w-[200px]">{question.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> 임시저장
            </button>
          </div>
        </div>
        {/* 리본 메뉴: 폰트, B/I/U, 차트/표/이미지 */}
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">폰트</span>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
              <option>맑은 고딕</option>
              <option>나눔고딕</option>
              <option>Arial</option>
            </select>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm w-14 bg-white">
              <option>11</option>
              <option>12</option>
              <option>14</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="p-2 hover:bg-gray-200 rounded" title="굵게">
              <Bold className="h-4 w-4" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-200 rounded" title="기울임">
              <Italic className="h-4 w-4" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-200 rounded" title="밑줄">
              <Underline className="h-4 w-4" />
            </button>
          </div>
          <div className="w-px h-5 bg-gray-300" />
          <div className="flex items-center gap-1">
            <button type="button" className="p-2 hover:bg-gray-200 rounded" title="차트 삽입">
              <BarChart3 className="h-4 w-4" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-200 rounded" title="표 삽입">
              <Table className="h-4 w-4" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-200 rounded" title="이미지 삽입">
              <Image className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* 왼쪽: 부서별 데이터 수집 (6부서, 진행률, 긴급도·대응방안·메모·결정완료) */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center text-blue-700">
              <Database className="h-5 w-5 mr-2" />
              부서별 데이터 수집
            </h3>
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>수집 진행률</span>
                <span className="text-blue-600">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {completedCount} / {needDecision.length} 부서 결정 완료
              </div>
            </div>

            {departments.map((dept) => {
              const decision = decisions[dept.id];
              const isComplete = dept.status === "제출" || decision?.complete;
              return (
                <div
                  key={dept.id}
                  className={`mb-4 p-4 border-2 rounded-lg transition-all ${
                    isComplete ? "border-green-500 bg-green-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{dept.icon}</span>
                      <span className="font-semibold text-gray-800">{dept.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        dept.status === "제출"
                          ? "bg-green-100 text-green-700"
                          : dept.status === "부분제출"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {dept.status}
                    </span>
                  </div>
                  {dept.data && (
                    <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">{dept.data}</div>
                  )}

                  {!isComplete && !decision?.complete ? (
                    <DepartmentDecisionForm
                      deptId={dept.id}
                      onComplete={(priority, action, note) =>
                        completeDecision(dept.id, priority, action, note)
                      }
                    />
                  ) : decision?.complete ? (
                    <div className="text-sm text-green-700 mt-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      결정 완료: {decision.priority}순위 / {decision.action}
                      {decision.note && ` · ${decision.note}`}
                    </div>
                  ) : (
                    <div className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> 데이터 수집 완료
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 중앙: A4 보고서 편집 영역 (원본 구조) */}
        <div className="flex-1 bg-gray-200 p-6 overflow-y-auto min-w-0">
          <div
            className="max-w-4xl mx-auto bg-white shadow-xl rounded-sm"
            style={{ minHeight: "1123px", padding: "40px 32px" }}
          >
            <div className="border-b-4 border-blue-600 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">2026년 1분기 통합 실적 보고서</h1>
              <div className="flex justify-between text-sm text-gray-600">
                <span>작성일: 2026년 2월 23일</span>
                <span>작성자: {question.sender || "경영기획팀"}</span>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                개요
              </h2>
              <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="보고서 작성 목적과 개요를 입력하세요..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
              />
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                부서별 데이터 현황
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {departments.map((dept) => {
                  const done = dept.status === "제출" || decisions[dept.id]?.complete;
                  return (
                    <div
                      key={dept.id}
                      className={`border-2 rounded-lg p-3 ${done ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <div className="text-xl mb-1">{dept.icon}</div>
                      <div className="font-semibold text-sm">{dept.name}</div>
                      <div className={`text-2xl font-bold ${done ? "text-green-600" : "text-red-600"}`}>
                        {done ? "✓" : "?"}
                      </div>
                      <div className="text-xs text-gray-600">{dept.status}</div>
                    </div>
                  );
                })}
              </div>
              <textarea
                value={deptAnalysis}
                onChange={(e) => setDeptAnalysis(e.target.value)}
                placeholder="부서별 데이터 분석 및 인사이트를 작성하세요..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
              />
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                데이터 시각화
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">차트 및 그래프 삽입 영역</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
                  4
                </span>
                결론 및 제언
              </h2>
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                placeholder="분석 결과를 바탕으로 한 결론과 향후 계획을 작성하세요..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
              />
            </section>
          </div>
        </div>

        {/* 오른쪽: 디자인 패널 (원본과 동일) */}
        <div className="w-56 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0 hidden lg:block">
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-3">디자인</h3>
            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">테마 색상</div>
              <div className="grid grid-cols-4 gap-2">
                {["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-orange-600"].map((c) => (
                  <div key={c} className={`w-full h-8 rounded ${c} cursor-pointer hover:ring-2 ring-offset-1`} />
                ))}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-2">요소 추가</div>
            <div className="space-y-2">
              <button type="button" className="w-full py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm">
                표 추가
              </button>
              <button type="button" className="w-full py-2 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm">
                차트 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartmentDecisionForm({
  deptId,
  onComplete,
}: {
  deptId: number;
  onComplete: (priority: string, action: string, note: string) => void;
}) {
  const [priority, setPriority] = useState("");
  const [action, setAction] = useState("");
  const [note, setNote] = useState("");
  const canComplete = !!priority && !!action;

  return (
    <div className="space-y-3 mt-3">
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1 block">긴급도 평가</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="">선택하세요</option>
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1 block">대응 방안</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
        >
          <option value="">선택하세요</option>
          {ACTION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1 block">상황 메모</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="예: 담당자 출장중, 시스템 장애 등..."
          className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none bg-white"
          rows={2}
        />
      </div>
      <button
        type="button"
        disabled={!canComplete}
        onClick={() => onComplete(priority, action, note)}
        className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle className="h-4 w-4" /> 결정 완료
      </button>
    </div>
  );
}
