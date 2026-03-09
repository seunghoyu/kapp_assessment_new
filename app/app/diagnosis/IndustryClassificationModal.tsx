"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft } from "lucide-react";
import type { IndustryNode } from "./industryTypes";

type Props = {
  open: boolean;
  onClose: () => void;
  majorName: string;
  /** 해당 대분류의 children (중분류 배열) */
  middleNodes: IndustryNode[];
};

export default function IndustryClassificationModal({
  open,
  onClose,
  majorName,
  middleNodes,
}: Props) {
  const [selectedMiddle, setSelectedMiddle] = useState<IndustryNode | null>(null);
  const [selectedSmall, setSelectedSmall] = useState<IndustryNode | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<IndustryNode | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedMiddle(null);
      setSelectedSmall(null);
      setSelectedDetail(null);
    }
  }, [open]);

  const middles = middleNodes;
  const smalls = selectedMiddle?.children ?? [];
  const details = selectedSmall?.children ?? [];
  const subDetails = selectedDetail?.children ?? [];

  const maxRows = Math.max(
    middles.length,
    smalls.length,
    details.length,
    subDetails.length,
    1
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
      <div
        className="relative flex flex-col w-[90vw] max-w-6xl h-[90vh] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="industry-classification-title"
      >
        {/* 상단: 제목 + 대분류 선택 버튼 */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="industry-classification-title" className="text-xl font-semibold text-gray-900">
                {majorName} 산업군 분류 체계
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                산업군 선택이 애매한 경우 아래 분류 체계를 참고하여 산업군을 확인할 수 있습니다.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ChevronLeft className="w-4 h-4" />
                대분류 선택
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 단계별 4열 테이블 */}
        <div className="flex-1 min-h-0 overflow-auto px-6 py-4">
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-blue-600">
                  <th className="text-left text-gray-900 text-sm font-semibold px-4 py-3 w-[25%]">
                    중분류
                  </th>
                  <th className="text-left text-gray-900 text-sm font-semibold px-4 py-3 w-[25%] border-l border-gray-200">
                    소분류
                  </th>
                  <th className="text-left text-gray-900 text-sm font-semibold px-4 py-3 w-[25%] border-l border-gray-200">
                    세분류
                  </th>
                  <th className="text-left text-gray-900 text-sm font-semibold px-4 py-3 w-[25%] border-l border-gray-200">
                    세세분류
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxRows }, (_, i) => (
                  <tr key={i} className="border-b border-gray-200 last:border-b-0">
                    {/* 중분류 */}
                    <td className="align-top border-r border-gray-100 px-4 py-2">
                      {middles[i] ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMiddle(middles[i]);
                            setSelectedSmall(null);
                            setSelectedDetail(null);
                          }}
                          className={`w-full text-left text-sm py-2 px-2 rounded -mx-2 ${
                            selectedMiddle?.code === middles[i].code
                              ? "bg-blue-50 text-blue-800 font-medium"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {middles[i].name}
                        </button>
                      ) : (
                        <span className="block py-2 px-2 text-gray-500 text-sm">—</span>
                      )}
                    </td>
                    {/* 소분류 */}
                    <td className="align-top border-r border-gray-100 px-4 py-2">
                      {smalls[i] ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSmall(smalls[i]);
                            setSelectedDetail(null);
                          }}
                          className={`w-full text-left text-sm py-2 px-2 rounded -mx-2 ${
                            selectedSmall?.code === smalls[i].code
                              ? "bg-blue-50 text-blue-800 font-medium"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {smalls[i].name}
                        </button>
                      ) : (
                        <span className="block py-2 px-2 text-gray-500 text-sm">—</span>
                      )}
                    </td>
                    {/* 세분류 */}
                    <td className="align-top border-r border-gray-100 px-4 py-2">
                      {details[i] ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDetail(details[i])}
                          className={`w-full text-left text-sm py-2 px-2 rounded -mx-2 ${
                            selectedDetail?.code === details[i].code
                              ? "bg-blue-50 text-blue-800 font-medium"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {details[i].name}
                        </button>
                      ) : (
                        <span className="block py-2 px-2 text-gray-500 text-sm">—</span>
                      )}
                    </td>
                    {/* 세세분류 */}
                    <td className="align-top px-4 py-2">
                      {subDetails[i] ? (
                        <span className="block text-sm py-2 px-2 text-gray-900">
                          {subDetails[i].name}
                        </span>
                      ) : (
                        <span className="block py-2 px-2 text-gray-500 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 하단: 대분류 목록으로 돌아가기 */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2.5 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            대분류 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
