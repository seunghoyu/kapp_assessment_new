"use client";

import { useState, useMemo } from "react";
import type { InbasketQuestion } from "@/lib/inbasketData";
import {
  Mailbox,
  LayoutGrid,
  TrendingUp,
  MessageSquare,
  Headphones,
  Users,
  Calculator,
  Laptop,
  Scale,
  ListTodo,
  AlertTriangle,
  Megaphone,
  Factory,
  Layers,
  User,
  Calendar,
  Tag,
  FileText,
  Paperclip,
  Play,
  PenLine,
  X,
  ChevronDown,
} from "lucide-react";

export type { InbasketQuestion } from "@/lib/inbasketData";

/** 원본 index.html 순서: 전체, 경영/기획, 커뮤니케이션, 고객서비스, 인사/조직, 재무/회계, IT/디지털, 법무/컴플, 프로젝트, 위기대응, 마케팅/영업, 생산/운영 */
const JOB_PILLS: { id: string; label: string; shortLabel?: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "전체", label: "전체", icon: LayoutGrid },
  { id: "경영/기획", label: "경영/기획", icon: TrendingUp },
  { id: "커뮤니케이션", label: "커뮤니케이션", icon: MessageSquare },
  { id: "고객서비스", label: "고객서비스", icon: Headphones },
  { id: "인사/조직", label: "인사/조직", icon: Users },
  { id: "재무/회계", label: "재무/회계", icon: Calculator },
  { id: "IT/디지털", label: "IT/디지털", icon: Laptop },
  { id: "법무/컴플라이언스", label: "법무/컴플", shortLabel: "법무/컴플", icon: Scale },
  { id: "프로젝트관리", label: "프로젝트관리", icon: ListTodo },
  { id: "위기대응", label: "위기대응", icon: AlertTriangle },
  { id: "마케팅/영업", label: "마케팅/영업", icon: Megaphone },
  { id: "생산/운영", label: "생산/운영", icon: Factory },
];

function getCategoryIcon(category: string) {
  const map: Record<string, React.ComponentType<{ className?: string }>> = {
    "이메일 관리": Mailbox,
    "메신저 대응": MessageSquare,
    "보고서 작성": FileText,
    "일정 관리": Calendar,
    "통합 업무": ListTodo,
    "위기 관리": AlertTriangle,
    "글로벌 협업": Layers,
    "법무 검토": Scale,
    "디지털 활용": Laptop,
    "인사 관리": Users,
    "재무 관리": Calculator,
    "고객 관리": Headphones,
    "윤리 경영": Scale,
    "전략 기획": TrendingUp,
    "마케팅캠페인": Megaphone,
    "생산관리": Factory,
  };
  return map[category] || FileText;
}

/** 분류(우선순위)별 좌측 보조 강조 */
function getPriorityBorderClass(priority: string) {
  switch (priority) {
    case "긴급":
      return "border-l-red-500";
    case "낮음":
      return "border-l-gray-400";
    case "자동화":
      return "border-l-violet-500";
    case "보통":
    default:
      return "border-l-blue-500";
  }
}

/** 모달 등에서 쓰는 작은 뱃지용 */
function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case "긴급":
      return "bg-red-500 text-white";
    case "낮음":
      return "bg-gray-500 text-white";
    case "자동화":
      return "bg-violet-500 text-white";
    case "보통":
    default:
      return "bg-blue-500 text-white";
  }
}

export type AiWorkflowRow = {
  id: string;
  industry: string;
  title: string;
  task: string;
  options: { id: string; choice: string; timeReduction: string; qualityScore: number }[];
  answer: number;
  explanation?: string;
};

type Props = {
  questions: InbasketQuestion[];
  /** 생략·null이면 인바스켓 목록에서 AI 행을 표시하지 않음(별도 단계에서 진행). */
  aiWorkflow?: AiWorkflowRow | null;
  onStart: (questionId: string) => void;
  completedCount?: number;
  totalCount?: number;
  /**
   * 테스트 환경용 보조 버튼 콜백:
   * 인바스켓 다음 단계(AI 활용 탐색)로 이동한다.
   */
  onNextToResult?: () => void;
};

const AI_WORKFLOW_ID = "ai-workflow";

const TEST_ENV_TOOLTIP = (
  <>
    <p className="text-xs font-semibold text-amber-900 mb-1.5">테스트 환경</p>
    <p className="text-[11px] text-amber-800 leading-relaxed">
      현재는 <strong>테스트 환경</strong>입니다. 전체 문항과 직무 선택이 노출됩니다.
    </p>
    <p className="text-[11px] text-amber-800 leading-relaxed mt-2">
      실제 학습자 환경에서는 &quot;선정 문항&quot; 헤더로 표시되며, 직무·산업군·기업규모·직급에 따라 선정된 <strong>인당 4문항</strong>만 노출됩니다. 직무 선택 UI는 보이지 않습니다.
    </p>
  </>
);

export default function InbasketList({
  questions,
  aiWorkflow,
  onStart,
  completedCount = 0,
  totalCount,
  onNextToResult,
}: Props) {
  const [jobFilter, setJobFilter] = useState("전체");
  const [modalQuestion, setModalQuestion] = useState<InbasketQuestion | null>(null);
  const [aiWorkflowModalOpen, setAiWorkflowModalOpen] = useState(false);
  const [testEnvTooltipOpen, setTestEnvTooltipOpen] = useState(false);
  const [testEnvExpanded, setTestEnvExpanded] = useState(false);

  const total = totalCount ?? questions.length + (aiWorkflow ? 1 : 0);
  const completed = Math.min(completedCount, total);
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filtered = useMemo(() => {
    if (jobFilter === "전체") return questions;
    return questions.filter((q) => q.jobCategory === jobFilter);
  }, [questions, jobFilter]);

  const jobCounts = useMemo(() => {
    const counts: Record<string, number> = { 전체: questions.length };
    JOB_PILLS.forEach((p) => {
      if (p.id !== "전체") counts[p.id] = questions.filter((q) => q.jobCategory === p.id).length;
    });
    return counts;
  }, [questions]);

  const currentJobTitle = jobFilter === "전체" ? "전체 문항" : `${jobFilter} 문항`;
  const CategoryIcon = getCategoryIcon;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="rounded-xl bg-white border border-gray-300 shadow-sm overflow-hidden flex flex-col h-full min-h-0">
          {/* 헤더: 전체 문항(좌) | 진행률 + 게이지 + 테스트 환경(우, 게이지는 테스트 환경 바로 좌측) */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center gap-3 flex-wrap">
            <LayoutGrid className="w-5 h-5 text-blue-600 shrink-0" aria-hidden />
            <h2 className="text-sm font-semibold text-gray-800 shrink-0">전체 문항</h2>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-500">진행률</span>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                  role="progressbar"
                  aria-valuenow={completed}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-label="디지털 인바스켓 진행률"
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{completed}/{total}</span>
            </div>
            <span
              className="relative inline-flex shrink-0"
              onMouseEnter={() => setTestEnvTooltipOpen(true)}
              onMouseLeave={() => setTestEnvTooltipOpen(false)}
            >
              <button
                type="button"
                onClick={() => setTestEnvExpanded((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-800 hover:bg-amber-100"
              >
                테스트 환경
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${testEnvExpanded ? "rotate-180" : ""}`} />
              </button>
              {testEnvTooltipOpen && (
                <span className="absolute right-0 top-full z-30 mt-1 w-72 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left shadow-lg">
                  {TEST_ENV_TOOLTIP}
                </span>
              )}
            </span>
          </div>

          {/* 테스트 환경 펼침 시: 직무 선택 드롭다운 */}
          {testEnvExpanded && (
            <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-gray-50/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <label htmlFor="inbasket-job-filter" className="text-xs font-medium text-gray-600 shrink-0">
                    직무 필터
                  </label>
                  <select
                    id="inbasket-job-filter"
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white min-w-[140px]"
                  >
                    {JOB_PILLS.map((p) => {
                      const count = jobCounts[p.id] ?? 0;
                      return (
                        <option key={p.id} value={p.id}>
                          {p.shortLabel ?? p.label} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <span className="text-xs text-gray-500 truncate">현재: {jobFilter}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onNextToResult?.()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  다음 →
                </button>
              </div>
            </div>
          )}

          {/* 테이블 헤더 — 바로 아래 배치 */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Mailbox className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">해당 직무의 문항이 없습니다</p>
              </div>
            ) : (
              <table className="w-full border-collapse table-fixed">
                <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="text-left py-2 pl-4 pr-2 text-sm font-semibold text-gray-600 w-[10%]">분류</th>
                    <th className="text-left py-2 px-2 text-sm font-semibold text-gray-600 w-[28%]">제목</th>
                    <th className="text-left py-2 pl-2 pr-2 text-sm font-semibold text-gray-600 w-[14%]">발신자</th>
                    <th className="text-left py-2 pl-2 pr-2 text-sm font-semibold text-gray-600 w-[14%]">카테고리</th>
                    <th className="text-left py-2 pl-2 pr-4 text-sm font-semibold text-gray-600 w-[22%]">내용</th>
                    <th className="text-left py-2 pl-4 pr-4 text-sm font-semibold text-gray-600 w-[12%]">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => {
                    const contentPreview = q.content ? (q.content.length > 120 ? q.content.substring(0, 120) + "..." : q.content) : "내용 없음";
                    const priorityLabel = q.priority || "보통";
                    return (
                      <tr
                        key={q.id}
                        className={`border-b border-gray-200 hover:bg-gray-50/80 transition-colors ${getPriorityBorderClass(q.priority)}`}
                      >
                        <td className="py-5 pl-4 pr-2 align-middle">
                          <span className={`inline-block whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${getPriorityBadgeClass(q.priority || "보통")}`}>
                            {priorityLabel}
                          </span>
                        </td>
                        <td className="py-5 px-2 align-middle">
                          <button
                            type="button"
                            onClick={() => setModalQuestion(q)}
                            className="text-left w-full font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition-colors"
                          >
                            {q.title || "제목 없음"}
                          </button>
                        </td>
                        <td className="py-5 pl-2 pr-2 align-middle text-sm text-gray-600">
                          <span className="truncate block" title={q.sender}>{q.sender || "—"}</span>
                        </td>
                        <td className="py-5 pl-2 pr-2 align-middle">
                          <span className="inline-block max-w-full rounded-md bg-blue-50 px-2 py-1 text-sm font-semibold text-blue-800 border border-blue-200 truncate whitespace-nowrap" title={q.category}>
                            {q.category || "—"}
                          </span>
                        </td>
                        <td className="py-5 pl-2 pr-4 align-middle text-sm text-gray-500">
                          <p className="line-clamp-2">{contentPreview}</p>
                        </td>
                        <td className="py-5 pl-4 pr-4 align-middle text-right">
                          <div className="flex flex-col gap-2 items-end justify-center">
                            <button
                              type="button"
                              onClick={() => setModalQuestion(q)}
                              className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            >
                              상세보기
                            </button>
                            <button
                              type="button"
                              onClick={() => onStart(q.id)}
                              className="py-2 px-3 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              진행하기
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {aiWorkflow && (
                    <tr className="border-b border-gray-200 hover:bg-gray-50/80 transition-colors border-l-violet-500">
                      <td className="py-5 pl-4 pr-2 align-middle">
                        <span className="inline-block whitespace-nowrap rounded px-2 py-1 text-xs font-medium bg-violet-500 text-white">
                          자동화
                        </span>
                      </td>
                      <td className="py-5 px-2 align-middle">
                        <button
                          type="button"
                          onClick={() => setAiWorkflowModalOpen(true)}
                          className="text-left w-full font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition-colors"
                        >
                          {aiWorkflow.title}
                        </button>
                      </td>
                      <td className="py-5 pl-2 pr-2 align-middle text-sm text-gray-600">
                        <span className="truncate block">—</span>
                      </td>
                      <td className="py-5 pl-2 pr-2 align-middle">
                        <span className="inline-block max-w-full rounded-md bg-violet-50 px-2 py-1 text-sm font-semibold text-violet-800 border border-violet-200 truncate whitespace-nowrap">
                          자동화
                        </span>
                      </td>
                      <td className="py-5 pl-2 pr-4 align-middle text-sm text-gray-500">
                        <p className="line-clamp-2">{aiWorkflow.task.length > 120 ? aiWorkflow.task.substring(0, 120) + "..." : aiWorkflow.task}</p>
                      </td>
                      <td className="py-5 pl-4 pr-4 align-middle text-right">
                        <div className="flex flex-col gap-2 items-end justify-center">
                          <button
                            type="button"
                            onClick={() => setAiWorkflowModalOpen(true)}
                            className="py-2 px-3 rounded-lg text-xs font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                          >
                            상세보기
                          </button>
                          <button
                            type="button"
                            onClick={() => onStart(AI_WORKFLOW_ID)}
                            className="py-2 px-3 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            진행하기
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* AI 워크플로우(자동화) 상세 모달 */}
      {aiWorkflowModalOpen && aiWorkflow && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
          onClick={() => setAiWorkflowModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setAiWorkflowModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-gray-800 flex-1">{aiWorkflow.title}</h2>
                  <span className="shrink-0 rounded px-2 py-1 text-xs font-medium bg-violet-500 text-white">
                    자동화
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    자동화
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  시나리오 내용
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiWorkflow.task}</div>
              </div>
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => { onStart(AI_WORKFLOW_ID); setAiWorkflowModalOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  <Play className="h-4 w-4" />
                  진행하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상세 모달: 원본 구조(제목+우선순위, 발신자/날짜/카테고리, 문항 내용, 첨부, 시뮬레이션 시작/기본 응답 작성) */}
      {modalQuestion && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
          onClick={() => setModalQuestion(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalQuestion(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-gray-800 flex-1">{modalQuestion.title}</h2>
                  <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${getPriorityBadgeClass(modalQuestion.priority)}`}>
                    {modalQuestion.priority}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    {modalQuestion.sender}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    {modalQuestion.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-500" />
                    {modalQuestion.category}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  문항 내용
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{modalQuestion.content}</div>
              </div>
              {modalQuestion.attachments && modalQuestion.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-blue-600" />
                    첨부 문서 ({modalQuestion.attachments.length}개)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {modalQuestion.attachments.map((att) => (
                      <div key={att} className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                        <FileText className="h-4 w-4 text-blue-500 mr-2 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{att}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => { onStart(modalQuestion.id); setModalQuestion(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  <Play className="h-4 w-4" />
                  시뮬레이션 시작
                </button>
                <button
                  type="button"
                  onClick={() => window.alert("기본 응답 작성 기능은 개발 중입니다. 시뮬레이션을 이용해 주세요.")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-600 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  <PenLine className="h-4 w-4" />
                  기본 응답 작성
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
