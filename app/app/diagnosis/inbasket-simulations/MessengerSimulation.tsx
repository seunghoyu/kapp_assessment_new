"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Zap, User, Clock, Search } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const ACTIONS = [
  { value: "즉시처리", icon: Zap, label: "즉시 처리" },
  { value: "위임", icon: User, label: "위임" },
  { value: "대기", icon: Clock, label: "대기" },
  { value: "정보수집", icon: Search, label: "정보 수집" },
];

type Msg = { id: number; team: string; sender: string; avatar: string; message: string; time: string; urgent: boolean };

function buildMessages(question: InbasketQuestion): Msg[] {
  return [
    { id: 1, team: question.sender, sender: question.sender, avatar: "👔", message: question.content, time: question.date, urgent: question.priority === "긴급" },
    { id: 2, team: "회계팀", sender: "박회계", avatar: "💼", message: "결재 시스템 오류로 급여 처리가 지연되고 있습니다. 직원들이 문의하고 있어요.", time: "09:20", urgent: true },
    { id: 3, team: "마케팅팀", sender: "최마케팅", avatar: "📊", message: "오후 광고 송출 전에 승인 필요합니다. 12시까지 가능할까요?", time: "09:25", urgent: true },
    { id: 4, team: "인사팀", sender: "이인사", avatar: "👥", message: "면접 일정 3건 조율 부탁드립니다.", time: "09:30", urgent: false },
  ];
}

type Props = { question: InbasketQuestion };

export default function MessengerSimulation({ question }: Props) {
  const messages = useMemo(() => buildMessages(question), [question]);
  const [responses, setResponses] = useState<Record<number, { action?: string; priority?: string }>>({});

  const setAction = (msgId: number, action: string) => {
    setResponses((r) => ({ ...r, [msgId]: { ...r[msgId], action } }));
  };
  const setPriority = (msgId: number, priority: string) => {
    setResponses((r) => ({ ...r, [msgId]: { ...r[msgId], priority } }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex">
        <div className="w-52 bg-gray-800 text-white p-4 flex-shrink-0">
          <div className="font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> WorkChat
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-xs text-gray-400 uppercase">채널</div>
            <div className="flex items-center gap-2 p-2 rounded bg-gray-700">
              <span>📢</span>
              <span className="font-semibold">긴급-요청</span>
              <span className="ml-auto bg-red-500 text-xs px-1.5 py-0.5 rounded-full">{messages.filter((m) => m.urgent).length}</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
              <span>💼</span>
              <span>일반</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col max-h-[70vh]">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900"># 긴급-요청</h3>
            <p className="text-sm text-gray-500">{messages.length}개의 메시지</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-lg border-l-4 ${msg.urgent ? "bg-red-50 border-red-500" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{msg.avatar}</span>
                  <span className="font-semibold text-gray-900">{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.team}</span>
                  <span className="text-xs text-gray-400 ml-auto">{msg.time}</span>
                  {msg.urgent && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">긴급</span>}
                </div>
                <p className="text-sm text-gray-700 mb-3">{msg.message}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={responses[msg.id]?.action ?? ""}
                    onChange={(e) => setAction(msg.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
                  >
                    <option value="">처리 방법</option>
                    {ACTIONS.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                  <select
                    value={responses[msg.id]?.priority ?? ""}
                    onChange={(e) => setPriority(msg.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white"
                  >
                    <option value="">우선순위</option>
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={String(n)}>{n}순위</option>
                    ))}
                  </select>
                  {responses[msg.id]?.action && responses[msg.id]?.priority && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">선택 완료</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
