"use client";

import { useMemo } from "react";
import { X, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import growthData from "@/data/consumer/growth.json";

const SCORE_LABELS: Record<string, string> = {
  knowledge: "지식",
  application: "역량",
  performance: "성과",
  productivity: "생산성",
};

const SCORE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

const { certificate } = growthData as {
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

type Props = { open: boolean; onClose: () => void };

export default function CertificateModal({ open, onClose }: Props) {
  const scoreEntries = Object.entries(certificate.scores);

  const chartData = useMemo(
    () =>
      Object.entries(certificate.scores).map(([key, value]) => ({
        name: SCORE_LABELS[key] ?? key,
        score: value,
      })),
    [certificate.scores]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
      {/* 모달 = 테두리(프레임). 안에 A4, 하단에 PDF 버튼 고정 */}
      <div
        className="relative flex flex-col bg-gray-200 rounded-lg border-2 border-gray-300 shadow-2xl overflow-hidden max-h-[calc(100vh-2rem)]"
        style={{ width: "calc(210mm + 2rem)", maxWidth: "calc(100vw - 2rem)" }}
        role="dialog"
        aria-modal="true"
        aria-label="역량 인증서"
      >
        {/* 닫기: 프레임 안쪽 모서리 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-white/90 text-gray-600 hover:bg-white border border-gray-200 shadow-sm"
          aria-label="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 프레임 안 = A4만 보이는 영역 (세로 스크롤만) */}
        <div className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto flex justify-center items-start p-4">
          <div
            id="certificate-a4-inner-modal"
            className="bg-white rounded shadow-lg flex-shrink-0 border border-gray-300"
            style={{ width: "210mm", minHeight: "297mm" }}
          >
            <div className="h-full flex flex-col p-4" style={{ minHeight: "297mm" }}>
              <div className="text-center border-b border-gray-200 pb-2 mb-2 flex-shrink-0">
                <p className="text-[10px] text-gray-500">{certificate.issuerTitle}</p>
                <h3 className="text-sm font-bold text-gray-900 mt-0.5">{certificate.certificateTitle}</h3>
                <p className="text-[10px] text-gray-500">{certificate.certificateSubtitle}</p>
              </div>
              <div className="text-center py-1.5 mb-2 flex-shrink-0">
                <p className="text-base font-bold text-gray-900">{certificate.recipientName}</p>
                <p className="text-xs text-gray-500">{certificate.position}</p>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-2 flex-shrink-0">
                {scoreEntries.map(([key, value]) => (
                  <div key={key} className="rounded border border-gray-200 bg-white py-2 px-1.5 text-center">
                    <p className="text-[10px] font-semibold text-gray-700 mb-0.5">{SCORE_LABELS[key] ?? key}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
              {/* 그래프 영역: 고정 높이 필수(ResponsiveContainer가 %만 쓰면 0이 됨) */}
              <div className="w-full flex-shrink-0" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 12, right: 44, left: 8, bottom: 12 }}
                    barCategoryGap="20%"
                    barGap={10}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#374151", fontSize: 12, fontWeight: 500 }}
                      axisLine={{ stroke: "#9ca3af" }}
                      tickLine={{ stroke: "#9ca3af" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={52}
                      tick={{ fill: "#1f2937", fontSize: 12, fontWeight: 600 }}
                      axisLine={{ stroke: "#9ca3af" }}
                      tickLine={false}
                    />
                    <Bar
                      dataKey="score"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={40}
                      fill="#3b82f6"
                      label={{ position: "right", fontSize: 12, fontWeight: 700, fill: "#1f2937" }}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={SCORE_COLORS[i % SCORE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center pt-2 border-t border-gray-200 flex-shrink-0">
                <p className="text-[10px] text-gray-600">
                  종합 점수 <strong>{certificate.overallScore}</strong> · {certificate.grade}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  발급일: {certificate.issueDate} · 인증번호: {certificate.certId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정: PDF 다운로드 버튼 */}
        <div className="flex-shrink-0 bg-gray-200 border-t-2 border-gray-300 px-4 py-3 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow"
          >
            <Download className="w-4 h-4" />
            PDF 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}
