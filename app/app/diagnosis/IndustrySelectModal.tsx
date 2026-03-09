"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { IndustryNode } from "./industryTypes";
import IndustryIcon from "./IndustryIcon";
import IndustryClassificationModal from "./IndustryClassificationModal";

type Props = {
  open: boolean;
  onClose: () => void;
  majors: IndustryNode[];
  onSelect: (major: IndustryNode) => void;
};

export default function IndustrySelectModal({
  open,
  onClose,
  majors,
  onSelect,
}: Props) {
  const [selectedMajorInModal, setSelectedMajorInModal] = useState<IndustryNode | null>(null);
  const [classificationMajor, setClassificationMajor] = useState<IndustryNode | null>(null);

  useEffect(() => {
    if (!open) setSelectedMajorInModal(null);
  }, [open]);

  const handleSelect = () => {
    if (selectedMajorInModal) {
      onSelect(selectedMajorInModal);
      onClose();
    }
  };

  const handleOpenDetail = () => {
    if (selectedMajorInModal) setClassificationMajor(selectedMajorInModal);
  };

  const handleCloseClassification = () => {
    setClassificationMajor(null);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
        <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
        <div
          className="relative flex flex-col w-[90vw] max-w-6xl h-[96vh] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="industry-select-title"
        >
          <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="industry-select-title" className="text-xl font-semibold text-gray-900">
                  산업군 선택
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  산업군 선택이 어려운 경우 상세보기를 통해 산업 분류 체계를 확인할 수 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenDetail}
                  disabled={!selectedMajorInModal}
                  className="rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  상세보기
                </button>
                <button
                  type="button"
                  onClick={handleSelect}
                  disabled={!selectedMajorInModal}
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

          <div className="flex-1 min-h-0 flex flex-col px-6 py-4">
            <div className="grid grid-cols-3 grid-rows-7 gap-4 flex-1 min-h-0">
              {majors.map((major, index) => {
                const isSelected = selectedMajorInModal?.code === major.code;
                return (
                  <button
                    key={major.code}
                    type="button"
                    onClick={() => setSelectedMajorInModal(major)}
                    className={`rounded-lg border p-4 shadow-sm text-left flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-0 h-full ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 shrink-0 font-semibold text-sm">
                      {index + 1}
                    </span>
                    <span className="text-gray-900 font-medium text-sm leading-tight">
                      {major.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <IndustryClassificationModal
        open={classificationMajor !== null}
        onClose={handleCloseClassification}
        majorName={classificationMajor?.name ?? ""}
        middleNodes={classificationMajor?.children ?? []}
      />
    </>
  );
}
