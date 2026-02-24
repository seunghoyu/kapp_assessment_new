"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const MEETINGS = [
  { id: 1, title: "신제품 런칭 전략 회의", time: "14:00 - 15:30", location: "본사 2층 대회의실", attendees: "CEO, 마케팅이사, 개발팀장", priority: "high" },
  { id: 2, title: "주요 투자자 미팅", time: "14:00 - 16:00", location: "강남 투자사 본사", attendees: "CFO, 투자자 A/B/C", priority: "high" },
  { id: 3, title: "전사 직원 간담회", time: "14:00 - 15:00", location: "온라인 (Zoom)", attendees: "전 직원 약 50명", priority: "low" },
];

const DECISIONS = ["직접 참석", "대리 참석", "시간 변경", "불참"] as const;

type Props = { question: InbasketQuestion };

export default function CalendarSimulation({ question }: Props) {
  const [choices, setChoices] = useState<Record<number, string>>({});

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-red-50 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-red-600" />
        <span className="font-semibold text-red-800">⚠️ 14시 3개 회의 시간 충돌</span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">{question.content}</p>
        <div className="space-y-4">
          {MEETINGS.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border-2 ${m.priority === "high" ? "border-red-200 bg-red-50/50" : "border-gray-200"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{m.priority === "high" ? "🔴" : "🔵"}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{m.title}</h4>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3" />{m.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3" />{m.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3" />{m.attendees}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {DECISIONS.map((d) => (
                      <label key={d} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`meeting-${m.id}`}
                          checked={choices[m.id] === d}
                          onChange={() => setChoices((c) => ({ ...c, [m.id]: d }))}
                          className="text-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
