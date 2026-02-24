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

/** 우선순위별 좌측 보조 강조(띠 대신 색으로만 구분) */
function getPriorityBorderClass(priority: string) {
  switch (priority) {
    case "긴급":
      return "border-l-red-500";
    case "낮음":
      return "border-l-gray-400";
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
    case "보통":
    default:
      return "bg-blue-500 text-white";
  }
}

type Props = {
  questions: InbasketQuestion[];
  onStart: (questionId: string) => void;
};

export default function InbasketList({ questions, onStart }: Props) {
  const [jobFilter, setJobFilter] = useState("전체");
  const [modalQuestion, setModalQuestion] = useState<InbasketQuestion | null>(null);

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
      {/* 메인: 직무 선택 + 문항 그리드 (제목은 진단 페이지 단계 바 좌측에 표시됨) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="rounded-xl bg-white border border-gray-300 shadow-sm overflow-hidden flex flex-col h-full min-h-0">
          {/* 직무 선택 섹션 — 대시보드 섹션 헤더 톤 */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-600 shrink-0" />
            <h2 className="text-sm font-semibold text-gray-800">직무 선택</h2>
            <span className="ml-2 text-xs text-gray-500">현재: {jobFilter}</span>
          </div>
          <div className="flex-shrink-0 p-4 flex flex-wrap gap-2">
            {JOB_PILLS.map((p) => {
              const Icon = p.icon;
              const count = jobCounts[p.id] ?? 0;
              const active = jobFilter === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setJobFilter(p.id)}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mr-1 shrink-0" />
                  {p.shortLabel ?? p.label}
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${active ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 문항 그리드 섹션 헤더 */}
          <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <h2 className="text-sm font-semibold text-gray-800">{currentJobTitle}</h2>
          </div>

          {/* 문항 테이블 — 우선순위 텍스트, 날짜 없음, 카테고리 강조, 액션 상세보기/진행하기, 행 높이 여유 */}
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
                    <th className="text-left py-3 pl-4 pr-2 text-sm font-semibold text-gray-600 w-[10%]">우선순위</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600 w-[28%]">제목</th>
                    <th className="text-left py-3 pl-2 pr-2 text-sm font-semibold text-gray-600 w-[14%]">발신자</th>
                    <th className="text-left py-3 pl-2 pr-2 text-sm font-semibold text-gray-600 w-[14%]">카테고리</th>
                    <th className="text-left py-3 pl-2 pr-4 text-sm font-semibold text-gray-600 w-[22%]">내용</th>
                    <th className="text-left py-3 pl-4 pr-4 text-sm font-semibold text-gray-600 w-[12%]">액션</th>
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
                          <span className={`inline-block whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${getPriorityBadgeClass(q.priority)}`}>
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
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

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
