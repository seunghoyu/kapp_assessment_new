
import React from 'react';
import { CompetencyType } from '../types';

// 각 역량별 스타일 정의 (바 배경색, 바 텍스트색)
const competencyStyles: Record<CompetencyType, { bar: string; text: string; value: string; }> = {
    "생산성": { bar: "bg-purple-500", text: "text-white", value: "text-purple-900" },
    "성과":   { bar: "bg-yellow-400", text: "text-yellow-900", value: "text-yellow-900" },
    "적용":   { bar: "bg-sky-500", text: "text-white", value: "text-sky-900" },
    "지식":   { bar: "bg-blue-500", text: "text-white", value: "text-blue-900" },
};

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // 툴팁 컨테이너
    return (
      <div className="p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
        <p className="mb-3 font-bold text-left text-gray-900">{label}</p>
        
        {/* 세로 리스트 컨테이너 */}
        <div className="flex flex-col gap-y-1.5">
          {payload.slice(0, 4).map((pld: any) => {
            const style = competencyStyles[pld.dataKey as CompetencyType] || { bar: 'bg-gray-400', text: 'text-white', value: 'text-gray-800' };
            return (
              <div key={pld.dataKey} className="flex items-center justify-between gap-x-3">
                
                {/* 왼쪽: 색상 바 + 라벨 */}
                <div className={`flex-grow px-2.5 py-1 rounded ${style.bar}`}>
                  <span className={`text-sm font-semibold ${style.text}`}>
                    {pld.dataKey}
                  </span>
                </div>

                {/* 오른쪽: 점수 (반올림 처리) */}
                <span className={`w-8 text-right text-sm font-bold ${style.value}`}>
                  {Math.round(pld.value)}
                </span>

              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
