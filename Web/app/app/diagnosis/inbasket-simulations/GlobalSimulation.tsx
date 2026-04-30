"use client";

import { useState } from "react";
import { Globe, Clock, FileText } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const MEETING_OPTIONS = ["야근 시간 회의", "새벽 시간 회의", "녹화 후 공유", "분할 회의", "비동기 문서로 결정"];
const COMM_OPTIONS = ["Slack", "이메일", "화상회의", "문서 공유"];

type Props = { question: InbasketQuestion };

export default function GlobalSimulation({ question }: Props) {
  const [meeting, setMeeting] = useState<string | null>(null);
  const [comm, setComm] = useState<string | null>(null);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">{question.content}</p>
      </div>
      <div className="p-4 space-y-6">
        <section>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" /> 회의 시간 조율
          </h3>
          <p className="text-sm text-gray-500 mb-3">서울·뉴욕·베를린·싱가포르 지사가 참여하는 회의 시간을 선택하세요.</p>
          <div className="space-y-2">
            {MEETING_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="meeting" checked={meeting === o} onChange={() => setMeeting(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </section>
        <section>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" /> 문서 버전 관리
          </h3>
          <p className="text-sm text-gray-500 mb-2">5개 버전 충돌 시: 공통 버전으로 통합 후 재배포를 권장합니다.</p>
        </section>
        <section>
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" /> 커뮤니케이션 프로토콜
          </h3>
          <div className="space-y-2">
            {COMM_OPTIONS.map((o) => (
              <label key={o} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="comm" checked={comm === o} onChange={() => setComm(o)} className="text-blue-600" />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
