"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Award, Download } from "lucide-react";
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

const A4_W_PX = 794;
const A4_H_PX = 1123;

export default function GrowthPage() {
  const scoreEntries = Object.entries(certificate.scores);
  const certWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  const chartData = useMemo(
    () =>
      Object.entries(certificate.scores).map(([key, value]) => ({
        name: SCORE_LABELS[key] ?? key,
        score: value,
      })),
    [certificate.scores]
  );

  useEffect(() => {
    const updateScale = () => {
      const wrap = certWrapRef.current;
      if (!wrap) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const pad = 24;
      const s = Math.min((w - pad) / A4_W_PX, (h - pad) / A4_H_PX, 1);
      setScale(Math.max(0.2, s));
    };
    const id = setTimeout(updateScale, 0);
    const ro = new ResizeObserver(updateScale);
    const wrap = certWrapRef.current;
    if (wrap) ro.observe(wrap);
    return () => {
      clearTimeout(id);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-50">
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">나의 성장</h1>
        <p className="text-xs text-gray-500 mt-0.5">매일 1%씩 성장하는 나를 응원합니다</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <p className="text-sm text-gray-600 px-6 py-2 flex-shrink-0">
          KAPP 4차원 역량 평가 결과를 인증서로 확인하고 PDF로 다운로드할 수 있습니다.
        </p>

        {/* A4 전체가 한 화면에 스크롤 없이 보이도록 비율 축소 */}
        <div
          ref={certWrapRef}
          className="flex-1 min-h-0 flex items-center justify-center overflow-hidden px-3 py-3"
        >
          <div
            id="certificate-a4-inner"
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 print:shadow-none origin-center flex-shrink-0"
            style={{
              width: `${A4_W_PX}px`,
              height: `${A4_H_PX}px`,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            <div className="p-5 h-full flex flex-col min-h-0">
              <div className="text-center border-b border-gray-200 pb-3 mb-3 flex-shrink-0">
                <p className="text-xs text-gray-500">{certificate.issuerTitle}</p>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{certificate.certificateTitle}</h3>
                <p className="text-xs text-gray-500">{certificate.certificateSubtitle}</p>
              </div>
              <div className="text-center py-2 mb-3 flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">{certificate.recipientName}</p>
                <p className="text-sm text-gray-500">{certificate.position}</p>
              </div>

              {/* 점수 카드 4개 - 테두리만 통일, 배경색 없음 */}
              <div className="grid grid-cols-4 gap-2 mb-3 flex-shrink-0">
                {scoreEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border-2 border-gray-200 bg-white p-3 text-center"
                  >
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">{SCORE_LABELS[key] ?? key}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {/* 막대 그래프 - A4 영역 꽉 채우기 */}
              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={52} tick={{ fill: "#374151", fontSize: 12 }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={36} label={{ position: "right", fontSize: 11 }}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={SCORE_COLORS[index % SCORE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-center pt-3 border-t border-gray-200 flex-shrink-0">
                <p className="text-xs text-gray-600">
                  종합 점수 <strong>{certificate.overallScore}</strong> · {certificate.grade}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  발급일: {certificate.issueDate} · 인증번호: {certificate.certId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`@media print { #certificate-a4-inner { transform: none !important; } }`}</style>

        <div className="flex-shrink-0 px-6 py-3 border-t border-gray-200 bg-white">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            PDF 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}
