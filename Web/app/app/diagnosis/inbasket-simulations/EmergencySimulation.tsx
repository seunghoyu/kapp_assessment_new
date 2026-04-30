"use client";

import { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { InbasketQuestion } from "../InbasketList";

const STRATEGIES = ["선제적 보도자료 배포", "언론사와 협상", "침묵 유지", "자진 리콜 발표"];
const TEAM_MEMBERS = ["CEO", "홍보팀장", "법무팀장", "품질팀장", "고객서비스팀장", "외부 전문가"];
const COMM_OPTIONS = ["즉시 이메일/SMS 발송", "홈페이지 공지", "구매 고객 개별 연락", "보도 후 상황 보고"];

/** 원본과 동일: 4개 체크박스 + 금액 (최대 2억 5,800만) */
const BUDGET_ITEMS: { id: string; label: string; amount: number }[] = [
  { id: "외부전문가", label: "외부 전문가 컨설팅", amount: 50_000_000 },
  { id: "품질검사", label: "긴급 품질 재검사", amount: 30_000_000 },
  { id: "PR대행", label: "홍보/PR 대행", amount: 80_000_000 },
  { id: "보상준비금", label: "고객 보상 준비금", amount: 200_000_000 },
];
const BUDGET_MAX = 258_000_000;

type Props = { question: InbasketQuestion };

export default function EmergencySimulation({ question }: Props) {
  const [strategy, setStrategy] = useState<string | null>(null);
  const [team, setTeam] = useState<string[]>([]);
  const [comm, setComm] = useState<string | null>(null);
  const [budgetChecked, setBudgetChecked] = useState<Record<string, boolean>>({});

  const toggleTeam = (name: string) => {
    setTeam((t) => (t.includes(name) ? t.filter((x) => x !== name) : [...t, name]));
  };
  const toggleBudget = (id: string) => {
    setBudgetChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalBudget = useMemo(
    () =>
      BUDGET_ITEMS.filter((b) => budgetChecked[b.id]).reduce((sum, b) => sum + b.amount, 0),
    [budgetChecked]
  );

  const done1 = !!strategy;
  const done2 = team.length > 0;
  const done3 = !!comm;
  const done4 = Object.values(budgetChecked).some(Boolean);
  const completed = [done1, done2, done3, done4].filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="bg-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 shrink-0" />
          <div>
            <h2 className="text-lg font-bold">{question.title}</h2>
            <p className="text-sm opacity-90">{question.sender} · {question.date}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">06:00:00</div>
          <div className="text-xs">대응 마감까지</div>
        </div>
      </div>
      <div className="p-4 bg-gray-800 text-white text-sm border-b border-gray-700">
        <p className="text-gray-300">{question.content}</p>
      </div>

      <div className="flex min-h-0">
        {/* 좌측: 상황판 (원본과 동일) */}
        <div className="w-72 bg-gray-800 text-white p-4 overflow-y-auto flex-shrink-0">
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">위기 등급</div>
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-center">
              🔴 LEVEL 3 (심각)
            </div>
          </div>
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">현황 요약</div>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-green-400">✅ 자체 검사</div>
                <div className="text-xs text-gray-300">이상 없음</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-yellow-400">⏳ 외부 시험소</div>
                <div className="text-xs text-gray-300">재검사 중 (3일 소요)</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-blue-400">📋 법무팀</div>
                <div className="text-xs text-gray-300">대응 준비 중</div>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-purple-400">📞 고객센터</div>
                <div className="text-xs text-gray-300">문의 폭주 예상</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">진행률</div>
            <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${(completed / 4) * 100}%` }}
              />
            </div>
            <div className="text-xs text-center mt-1">{completed}/4 완료</div>
          </div>
        </div>

        {/* 우측: 의사결정 패널 */}
        <div className="flex-1 p-6 overflow-y-auto min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>진행률</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${(completed / 4) * 100}%` }}
              />
            </div>
            <span>{completed}/4 완료</span>
          </div>

          <section className="mb-6 border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">1️⃣ 즉각 대응 전략</h3>
            <div className="space-y-2">
              {STRATEGIES.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="strategy"
                    checked={strategy === s}
                    onChange={() => setStrategy(s)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{s}</span>
                  {strategy === s && <CheckCircle className="h-4 w-4 text-green-600" />}
                </label>
              ))}
            </div>
          </section>

          <section className="mb-6 border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">2️⃣ 위기대응팀 구성 (복수 선택)</h3>
            <div className="flex flex-wrap gap-2">
              {TEAM_MEMBERS.map((m) => (
                <label key={m} className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={team.includes(m)}
                    onChange={() => toggleTeam(m)}
                    className="text-blue-600 rounded"
                  />
                  <span className="text-sm">{m}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="mb-6 border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">3️⃣ 고객 커뮤니케이션</h3>
            <div className="space-y-2">
              {COMM_OPTIONS.map((o) => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="comm"
                    checked={comm === o}
                    onChange={() => setComm(o)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="mb-6 border-2 border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">4️⃣ 긴급 예산 승인</h3>
            <p className="text-sm text-gray-600 mb-4">위기 대응을 위한 긴급 예산을 승인하세요 (복수 선택)</p>
            <div className="space-y-3">
              {BUDGET_ITEMS.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                >
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600">
                      {(item.amount / 1_000_000).toLocaleString()}만원
                    </span>
                    <input
                      type="checkbox"
                      checked={!!budgetChecked[item.id]}
                      onChange={() => toggleBudget(item.id)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </label>
              ))}
              <div
                className={`p-3 rounded font-bold text-right ${
                  totalBudget > BUDGET_MAX ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"
                }`}
              >
                총 예산: {totalBudget.toLocaleString()}원
                {totalBudget > BUDGET_MAX && (
                  <span className="block text-sm font-normal mt-1">(최대 2억 5,800만원 초과)</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
