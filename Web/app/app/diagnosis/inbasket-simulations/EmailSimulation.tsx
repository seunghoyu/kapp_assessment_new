"use client";

import { useState, useMemo } from "react";
import { Inbox, Star, Send, Reply, Forward, Archive, Trash2 } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

type EmailItem = {
  id: number;
  from: string;
  subject: string;
  time: string;
  priority: "high" | "normal" | "low";
  unread: boolean;
  content: string;
};

type Props = { question: InbasketQuestion };

/** 문항 1통 + 원본과 동일한 추가 4통으로 5통 구성 */
function buildEmails(question: InbasketQuestion): EmailItem[] {
  const priorityMap = question.priority === "긴급" ? "high" : question.priority === "낮음" ? "low" : "normal";
  return [
    {
      id: 1,
      from: question.sender,
      subject: question.title,
      time: question.date,
      priority: priorityMap,
      unread: true,
      content: question.content,
    },
    { id: 2, from: "고객사 담당자", subject: "계약서 검토 요청", time: "15분 전", priority: "high", unread: true, content: "신규 고객사와의 계약서 초안이 완성되었습니다. 법무팀 검토가 완료되었으니 최종 승인 부탁드립니다." },
    { id: 3, from: "재무팀", subject: "예산 추가 승인 건", time: "20분 전", priority: "high", unread: true, content: "1분기 실적 부진으로 마케팅 예산 추가가 시급합니다." },
    { id: 4, from: "마케팅팀", subject: "월간 실적 보고서", time: "1시간 전", priority: "normal", unread: false, content: "2월 마케팅 실적을 정리하여 보고드립니다." },
    { id: 5, from: "영업팀", subject: "분기 목표 수정안", time: "2시간 전", priority: "low", unread: false, content: "시장 상황 변화를 반영한 분기 목표 수정안입니다." },
  ];
}

export default function EmailSimulation({ question }: Props) {
  const emails = useMemo(() => buildEmails(question), [question]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [responses, setResponses] = useState<Record<number, { action?: string; priority?: string }>>({});

  const selected = selectedId ? emails.find((e) => e.id === selectedId) : null;
  const response = selected ? responses[selected.id] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[70vh] flex">
      {/* 왼쪽: 폴더 + 이메일 목록 (원본과 동일) */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col min-h-0">
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center text-blue-600 font-semibold mb-2">
            <Inbox className="h-4 w-4 mr-2" />
            받은 편지함
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {emails.filter((e) => e.unread).length}
            </span>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            <div className="flex items-center py-1"><Star className="h-4 w-4 mr-2" />중요</div>
            <div className="flex items-center py-1"><Send className="h-4 w-4 mr-2" />보낸 편지함</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(email.id)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedId(email.id)}
              className={`border-b border-gray-100 p-3 cursor-pointer hover:bg-blue-50 ${selectedId === email.id ? "bg-blue-100" : ""} ${email.unread ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center">
                  {email.unread ? <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 shrink-0" /> : <div className="w-2 h-2 mr-2 shrink-0" />}
                  <span className={`text-sm truncate ${email.unread ? "font-bold" : ""}`}>{email.from}</span>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{email.time}</span>
              </div>
              <div className={`text-sm text-gray-700 truncate ${email.unread ? "font-semibold" : ""}`}>{email.subject}</div>
              {email.priority === "high" && <span className="text-xs text-red-500">긴급</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 이메일 뷰어 (원본과 동일 — 제목/발신/본문/답장·전달·보관·삭제/우선순위) */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6 overflow-y-auto">
          {selected ? (
            <div className="max-w-4xl">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{selected.subject}</h2>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shrink-0">
                    {selected.from[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{selected.from}</div>
                    <div className="text-xs text-gray-500">{selected.time}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{selected.content}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {(["답장", "전달", "보관", "삭제"] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setResponses((r) => ({ ...r, [selected.id]: { ...r[selected.id], action } }))}
                    className={`px-4 py-2 rounded-lg font-semibold border-2 transition ${
                      response?.action === action
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {action === "답장" && <Reply className="h-4 w-4 inline mr-2" />}
                    {action === "전달" && <Forward className="h-4 w-4 inline mr-2" />}
                    {action === "보관" && <Archive className="h-4 w-4 inline mr-2" />}
                    {action === "삭제" && <Trash2 className="h-4 w-4 inline mr-2" />}
                    {action}
                  </button>
                ))}
              </div>
              <div className="mb-4">
                <label className="block font-semibold text-gray-800 mb-2">우선순위 설정</label>
                <div className="flex flex-wrap gap-2">
                  {(["긴급", "중요", "보통"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setResponses((r) => ({ ...r, [selected.id]: { ...r[selected.id], priority: p } }))}
                      className={`px-4 py-2 rounded-lg border-2 font-medium ${
                        response?.priority === p
                          ? p === "긴급" ? "bg-red-500 text-white border-red-500"
                          : p === "중요" ? "bg-orange-500 text-white border-orange-500"
                          : "bg-blue-500 text-white border-blue-500"
                          : p === "긴급" ? "bg-white border-red-500 text-red-500 hover:bg-red-50"
                          : p === "중요" ? "bg-white border-orange-500 text-orange-500 hover:bg-orange-50"
                          : "bg-white border-blue-500 text-blue-500 hover:bg-blue-50"
                      }`}
                    >
                      {p === "긴급" && "🔴"} {p === "중요" && "🟠"} {p === "보통" && "🔵"} {p}
                    </button>
                  ))}
                </div>
              </div>
              {response?.action && response?.priority && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 flex items-center">
                  <span className="text-green-600 font-semibold">처리 완료: {response.action} / {response.priority}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Inbox className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>이메일을 선택하세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
