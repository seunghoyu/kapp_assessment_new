"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft } from "lucide-react";
import type { IndustryNode } from "./industryTypes";
import HighlightedText from "@/components/common/HighlightedText";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

type Props = {
  open: boolean;
  onClose: () => void;
  majorName: string;
  /** 해당 대분류의 children (중분류 배열) */
  middleNodes: IndustryNode[];
  /** 대분류 선택 확정 콜백 (어느 레벨에서 선택해도 대분류 기준) */
  onConfirmMajor?: () => void;
  /** 검색 결과 클릭 시 이 경로로 선택 상태를 맞춥니다. [중,소,세,세세] 코드 배열(존재하는 depth까지만) */
  initialSelectionCodes?: string[];
  /** false면 상단 검색창·검색 결과 UI를 숨기고 분류 테이블만 표시(산업군 카드에서 「상세보기」로 열었을 때 등) */
  showSearch?: boolean;
};

export default function IndustryClassificationModal({
  open,
  onClose,
  majorName,
  middleNodes,
  onConfirmMajor,
  initialSelectionCodes,
  showSearch = true,
}: Props) {
  const [selectedMiddle, setSelectedMiddle] = useState<IndustryNode | null>(null);
  const [selectedSmall, setSelectedSmall] = useState<IndustryNode | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<IndustryNode | null>(null);
  const [selectedSubDetail, setSelectedSubDetail] = useState<IndustryNode | null>(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(searchKeyword, 300);

  useEffect(() => {
    if (open) {
      setSelectedMiddle(null);
      setSelectedSmall(null);
      setSelectedDetail(null);
      setSelectedSubDetail(null);
      setSearchKeyword("");
    }
  }, [open]);

  const middles = middleNodes;
  const smalls = selectedMiddle?.children ?? [];
  const details = selectedSmall?.children ?? [];
  const subDetails = selectedDetail?.children ?? [];

  // 외부에서 경로가 주어지면(open 시점에) 선택 상태 자동 세팅
  useEffect(() => {
    if (!open) return;
    if (!initialSelectionCodes || initialSelectionCodes.length === 0) return;

    const [midCode, smallCode, detailCode, subDetailCode] = initialSelectionCodes;
    const mid = middles.find((m) => m.code === midCode) ?? null;
    const small = mid?.children?.find((n) => n.code === smallCode) ?? null;
    const detail = small?.children?.find((n) => n.code === detailCode) ?? null;
    const subDetail = detail?.children?.find((n) => n.code === subDetailCode) ?? null;

    setSelectedMiddle(mid);
    setSelectedSmall(small);
    setSelectedDetail(detail);
    setSelectedSubDetail(subDetail);
  }, [open, initialSelectionCodes, middles]);

  type SearchResult = {
    codes: string[];
    path: string;
  };

  const searchResults = useMemo((): SearchResult[] => {
    const q = debouncedKeyword.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResult[] = [];

    const walk = (node: IndustryNode, names: string[], codes: string[]) => {
      const nextNames = [...names, node.name];
      const nextCodes = [...codes, node.code];
      const path = nextNames.join(" > ");
      if (path.toLowerCase().includes(q)) results.push({ codes: nextCodes, path });
      for (const c of node.children ?? []) walk(c, nextNames, nextCodes);
    };

    for (const mid of middles) walk(mid, [], []);
    return results.slice(0, 200);
  }, [debouncedKeyword, middles]);

  const applySelectionCodes = (codes: string[]) => {
    const [midCode, smallCode, detailCode, subDetailCode] = codes;
    const mid = middles.find((m) => m.code === midCode) ?? null;
    const small = mid?.children?.find((n) => n.code === smallCode) ?? null;
    const detail = small?.children?.find((n) => n.code === detailCode) ?? null;
    const subDetail = detail?.children?.find((n) => n.code === subDetailCode) ?? null;

    setSelectedMiddle(mid);
    setSelectedSmall(small);
    setSelectedDetail(detail);
    setSelectedSubDetail(subDetail);
  };

  const hasSelection =
    !!selectedMiddle || !!selectedSmall || !!selectedDetail || !!selectedSubDetail;

  const maxRows = Math.max(
    middles.length,
    smalls.length,
    details.length,
    subDetails.length,
    1
  );

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        className="relative flex flex-col w-[96vw] max-w-[80rem] h-[92vh] min-h-[32rem] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
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
                onClick={() => {
                  if (onConfirmMajor) {
                    onConfirmMajor();
                  }
                }}
                disabled={!hasSelection || !onConfirmMajor}
                className="rounded-md bg-blue-500 text-white text-sm font-medium px-3 py-2 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                선택
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

        {/* 검색 input (구분선 아래, 중앙 정렬) — 「상세보기」만으로 열었을 때는 미표시 */}
        {showSearch ? (
          <div className="flex-shrink-0 bg-white pt-[15px] pb-1 flex justify-center">
            <div className="w-full max-w-5xl px-6">
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="산업군 키워드를 검색하세요."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-600 shadow-sm"
              />
            </div>
          </div>
        ) : null}

        {/* 단계별 4열 테이블 */}
        <div className="flex-1 min-h-0 overflow-auto px-6 py-3">
          {showSearch && debouncedKeyword.trim() ? (
            <div>
              {searchResults.length === 0 ? (
                <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
              ) : (
                <div className="max-h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-white max-w-5xl mx-auto">
                  {searchResults.map((r, idx) => (
                    <button
                      key={`${r.codes.join("-")}-${idx}`}
                      type="button"
                      onClick={() => applySelectionCodes(r.codes)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      title={r.path}
                    >
                      <span className="block whitespace-nowrap overflow-hidden text-ellipsis">
                        <HighlightedText text={r.path} keyword={debouncedKeyword} />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
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
                            setSelectedSubDetail(null);
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
                            setSelectedSubDetail(null);
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
                          onClick={() => {
                            setSelectedDetail(details[i]);
                            setSelectedSubDetail(null);
                          }}
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
                        <button
                          type="button"
                          onClick={() => setSelectedSubDetail(subDetails[i])}
                          className={`w-full text-left text-sm py-2 px-2 rounded -mx-2 ${
                            selectedSubDetail?.code === subDetails[i].code
                              ? "bg-blue-50 text-blue-800 font-medium"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {subDetails[i].name}
                        </button>
                      ) : (
                        <span className="block py-2 px-2 text-gray-500 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
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

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
