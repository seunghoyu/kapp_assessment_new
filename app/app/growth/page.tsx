"use client";

import { useState } from "react";
import { Zap, Award, Download } from "lucide-react";
import growthData from "@/data/consumer/growth.json";

const { dailyTip, defaultStats, certificate } = growthData as {
  dailyTip: { category: string; duration: string; title: string; content: string };
  defaultStats: { streakDays: number; completedTips: number; weeklyProgress: string };
  certificate: {
    recipientName: string;
    position: string;
    scores: Record<string, number>;
    overallScore: number;
    grade: string;
    issueDate: string;
    certId: string;
    issuerTitle: string;
    certificateTitle: string;
    certificateSubtitle: string;
  };
};

export default function GrowthPage() {
  const [activeTab, setActiveTab] = useState<"main" | "certificate">("main");
  const [streakDays] = useState(defaultStats.streakDays);
  const [completedTips] = useState(defaultStats.completedTips);
  const [weeklyProgress] = useState(defaultStats.weeklyProgress);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50">
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">나의 성장</h1>
        <p className="text-xs text-gray-500 mt-0.5">매일 1%씩 성장하는 나를 응원합니다</p>
      </div>

      {/* 탭: 기본 화면 | 인증서 */}
      <div className="flex-shrink-0 flex border-b border-gray-200 bg-white px-4">
        <button
          type="button"
          onClick={() => setActiveTab("main")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "main"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          성장 활동
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("certificate")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "certificate"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          인증서
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* ─── 기본: 오늘의 1% 챌린지 (상단 고정) ─── */}
          {activeTab === "main" && (
            <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-amber-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h2 className="text-sm font-semibold text-gray-800">오늘의 1% 효율 챌린지</h2>
                </div>
                <span className="text-xs text-gray-500">매일 1분, 실무에 바로 적용 가능한 팁</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {dailyTip.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {dailyTip.duration}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{dailyTip.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{dailyTip.content}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
                  >
                    적용 완료
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    나중에 보기
                  </button>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex gap-6 text-sm">
                <span className="text-gray-600">연속 학습 <strong>{streakDays}일</strong></span>
                <span className="text-gray-600">완료한 팁 <strong>{completedTips}개</strong></span>
                <span className="text-gray-600">이번 주 목표 <strong>{weeklyProgress}</strong></span>
              </div>
            </section>
          )}

          {/* ─── 인증서 탭 ─── */}
          {activeTab === "certificate" && (
            <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-semibold text-gray-800">역량 인증서</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">KAPP 4차원 역량 평가 결과를 인증서로 확인하고 PDF로 다운로드할 수 있습니다.</p>
                {/* 인증서 미리보기 카드 */}
                <div className="rounded-xl border-2 border-gray-200 bg-white p-6 mb-4 shadow-inner">
                  <div className="text-center border-b border-gray-200 pb-4 mb-4">
                    <p className="text-xs text-gray-500">{certificate.issuerTitle}</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{certificate.certificateTitle}</h3>
                    <p className="text-xs text-gray-500">{certificate.certificateSubtitle}</p>
                  </div>
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">수료자</p>
                    <p className="text-xl font-bold text-gray-900">{certificate.recipientName}</p>
                    <p className="text-sm text-gray-500">{certificate.position}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
                    {Object.entries(certificate.scores).map(([name, value]) => (
                      <div key={name}>
                        <span className="text-gray-500">{name === "knowledge" ? "Knowledge" : name === "application" ? "Application" : name === "performance" ? "Performance" : "Productivity"}</span>
                        <p className="font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">종합 점수 {certificate.overallScore} · {certificate.grade}</p>
                    <p className="text-xs text-gray-400 mt-1">발급일: {certificate.issueDate} · 인증번호: {certificate.certId}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    PDF 다운로드
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    링크 복사
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
