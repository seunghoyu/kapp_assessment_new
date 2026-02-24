"use client";

import { useState } from "react";
import { Mail, Phone, Share2, MessageSquare } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const CHANNELS = [
  { id: "email", label: "이메일", icon: Mail },
  { id: "phone", label: "전화", icon: Phone },
  { id: "sns", label: "SNS", icon: Share2 },
  { id: "messenger", label: "메신저", icon: MessageSquare },
];

const INQUIRIES = [
  { id: 1, channel: "email", title: "배송 지연 문의", urgent: true },
  { id: 2, channel: "phone", title: "VIP 고객 불만 전화", urgent: true },
  { id: 3, channel: "messenger", title: "제품 문의", urgent: false },
];

const ACTIONS = ["즉시처리", "부서이관", "보류", "에스컬레이션"] as const;

type Props = { question: InbasketQuestion };

export default function IntegratedWorkSimulation({ question }: Props) {
  const [activeChannel, setActiveChannel] = useState("email");
  const [responses, setResponses] = useState<Record<number, string>>({});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">{question.content}</p>
      </div>
      <div className="flex border-b border-gray-200">
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => setActiveChannel(ch.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeChannel === ch.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ch.icon className="h-4 w-4" />
            {ch.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">문의 목록</h3>
        <ul className="space-y-3">
          {INQUIRIES.filter((i) => i.channel === activeChannel).length === 0 ? (
            <li className="text-sm text-gray-500">해당 채널 문의 없음</li>
          ) : (
            INQUIRIES.filter((i) => i.channel === activeChannel).map((inq) => (
              <li key={inq.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{inq.title}</span>
                  {inq.urgent && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">긴급</span>}
                </div>
                <div className="flex gap-2">
                  {ACTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setResponses((r) => ({ ...r, [inq.id]: a }))}
                      className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                        responses[inq.id] === a ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
