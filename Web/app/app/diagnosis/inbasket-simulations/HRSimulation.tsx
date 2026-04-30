"use client";

import { useState } from "react";
import { Users, ArrowRight } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const PROCESS_OPTIONS = ["SOP 정립", "워크플로 개선", "정기 협의체", "조정자 지정"];
const TEAM_OPTIONS = ["워크숍", "합동 프로젝트", "협업 교육", "순환 근무"];
const MEETING_OPTIONS = ["잔류 제안", "타부서 이동", "퇴사 수용", "조정"];

type Props = { question: InbasketQuestion };

export default function HRSimulation({ question }: Props) {
  const [process, setProcess] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [meeting, setMeeting] = useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">{question.content}</p>
      </div>
      <div className="p-4 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px] flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <div className="font-semibold text-gray-900">영업팀</div>
            <div className="text-xs text-gray-500">갈등 당사자 · 퇴사 예정자</div>
          </div>
          <ArrowRight className="h-6 w-6 text-red-500" />
          <div className="text-center">
            <div className="font-semibold text-gray-900">생산팀</div>
            <div className="text-xs text-gray-500">갈등 당사자 · 퇴사 예정자</div>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6 border-t border-gray-200">
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">1. 프로세스 정립</h3>
          <div className="flex flex-wrap gap-2">
            {PROCESS_OPTIONS.map((o) => (
              <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="process" checked={process === o} onChange={() => setProcess(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">2. 팀빌딩 활동</h3>
          <div className="flex flex-wrap gap-2">
            {TEAM_OPTIONS.map((o) => (
              <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="team" checked={team === o} onChange={() => setTeam(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-gray-900 mb-2">3. 개별 면담 전략</h3>
          <div className="flex flex-wrap gap-2">
            {MEETING_OPTIONS.map((o) => (
              <label key={o} className="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="meeting" checked={meeting === o} onChange={() => setMeeting(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
