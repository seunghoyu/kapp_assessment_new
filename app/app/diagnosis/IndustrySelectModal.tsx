"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { IndustryNode } from "./industryTypes";
import IndustryIcon from "./IndustryIcon";
import IndustryClassificationModal from "./IndustryClassificationModal";
import jobTaxonomy from "@/data/Industry/job_taxonomy_payload.json";

type SaraminCategory = {
  saraminCategoryId: number;
  saraminCategoryName: string;
};

type SaraminJob = {
  saraminCategoryId: number;
  saraminCategoryName: string;
  saraminJobName: string;
};

const JOB_CATEGORIES = (jobTaxonomy as { categories: SaraminCategory[] }).categories;
const JOB_ITEMS = (jobTaxonomy as { jobs: SaraminJob[] }).jobs;

/** 모달에서 제외할 대분류명 (20번 제거 → 국제 및 외국기관이 20번이 되도록) */
const EXCLUDED_MAJOR_NAME =
  "가구 내 고용 활동 및 달리 분류되지 않은 자가 소비 생산 활동";

type Props = {
  open: boolean;
  onClose: () => void;
  majors: IndustryNode[];
  /** 최종 선택: 산업군(대분류) + 세부 직무 이름 */
  onSelect: (major: IndustryNode, jobName: string) => void;
};

type Step = "industry" | "job";

export default function IndustrySelectModal({
  open,
  onClose,
  majors,
  onSelect,
}: Props) {
  const [selectedMajorInModal, setSelectedMajorInModal] = useState<IndustryNode | null>(null);
  const [classificationMajor, setClassificationMajor] = useState<IndustryNode | null>(null);
  const [step, setStep] = useState<Step>("industry");

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedJobName, setSelectedJobName] = useState<string>("");

  /** 20개만 표시 (가구 내 고용… 제외 → 국제 및 외국기관이 20번) */
  const displayMajors = useMemo(
    () => majors.filter((m) => m.name !== EXCLUDED_MAJOR_NAME),
    [majors]
  );

  useEffect(() => {
    if (!open) {
      setSelectedMajorInModal(null);
      setClassificationMajor(null);
      setStep("industry");
      setSelectedCategoryId(null);
      setSelectedJobName("");
    }
  }, [open]);

  const jobsForSelectedCategory = useMemo(() => {
    if (selectedCategoryId == null) return [] as SaraminJob[];
    return JOB_ITEMS.filter((job) => job.saraminCategoryId === selectedCategoryId);
  }, [selectedCategoryId]);

  const goToJobStep = () => {
    if (!selectedMajorInModal) return;
    setStep("job");
    setSelectedCategoryId(null);
    setSelectedJobName("");
  };

  const handleSelect = () => {
    if (step === "industry") {
      // 1단계: 산업군 선택 → 세부 직무 모달(2단계)로 슬라이드
      if (selectedMajorInModal) {
        goToJobStep();
      }
      return;
    }

    // 2단계: 세부 직무까지 선택 완료
    if (selectedMajorInModal && selectedJobName) {
      onSelect(selectedMajorInModal, selectedJobName);
      onClose();
    }
  };

  const handleOpenDetail = () => {
    if (selectedMajorInModal) setClassificationMajor(selectedMajorInModal);
  };

  const handleCloseClassification = () => {
    setClassificationMajor(null);
  };

  const handleConfirmFromClassification = () => {
    if (!classificationMajor) return;
    setSelectedMajorInModal(classificationMajor);
    setClassificationMajor(null);
    goToJobStep();
  };

  if (!open) return null;

  const isIndustryStep = step === "industry";

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        className="relative flex flex-col w-[98vw] max-w-[95rem] h-[92vh] min-h-[32rem] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="industry-select-title"
      >
          {/* 상단 헤더 */}
          <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="industry-select-title" className="text-xl font-semibold text-gray-900">
                  {isIndustryStep ? "산업군 선택" : "세부 직무 선택"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isIndustryStep
                    ? "산업군 선택이 어려운 경우 상세보기를 통해 산업 분류 체계를 확인할 수 있습니다."
                    : "선택한 산업군에 맞춰 분야와 세부 직무·직업을 선택해 주세요."}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isIndustryStep && (
                  <button
                    type="button"
                    onClick={handleOpenDetail}
                    disabled={!selectedMajorInModal}
                    className="rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    상세보기
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSelect}
                  disabled={isIndustryStep ? !selectedMajorInModal : !selectedJobName}
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

          {/* 본문: 좌우 슬라이드 전환 (산업군 → 세부 직무) */}
          <div className="flex-1 min-h-0 px-4 py-3 relative overflow-hidden">
            {/* 1단계: 산업군 선택 (그리드) */}
            <div
              className={`absolute inset-0 transition-transform duration-300 ${
                step === "industry" ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="h-full flex items-center justify-center">
                <div className="w-full max-w-6xl px-8 py-8">
                  <div className="grid grid-cols-4 grid-rows-5 gap-6 auto-rows-fr">
                    {displayMajors.map((major, index) => {
                      const isSelected = selectedMajorInModal?.code === major.code;
                      return (
                        <button
                          key={major.code}
                          type="button"
                          onClick={() => setSelectedMajorInModal(major)}
                          className={`rounded-xl border p-5 shadow-sm text-left flex items-center gap-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-0 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 shrink-0 font-bold text-base">
                            {index + 1}
                          </span>
                          <span className="text-gray-900 font-medium text-sm leading-snug">
                            {major.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 2단계: 세부 직무 선택 (분야/직무 2컬럼) */}
            <div
              className={`absolute inset-0 transition-transform duration-300 ${
                step === "job" ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex h-full gap-6 mt-30 mx-10">
                {/* 왼쪽 50%: 분야 — 텍스트 크게, 여백 있게 */}
                <div className="w-1/2 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-base font-semibold text-gray-800">분야</p>
                    <p className="text-xs text-gray-500 mt-0.5">직무 분야를 선택하세요</p>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto divide-y divide-gray-100">
                    {JOB_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategoryId === cat.saraminCategoryId;
                      return (
                        <button
                          key={cat.saraminCategoryId}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryId(cat.saraminCategoryId);
                            setSelectedJobName("");
                          }}
                          className={`w-full text-left px-5 py-3.5 text-base leading-snug ${
                            isSelected
                              ? "bg-blue-50 text-blue-800 font-medium"
                              : "text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {cat.saraminCategoryName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 오른쪽 50%: 직무·직업 — 리스트형, 헤더만 직관적으로 */}
                <div className="w-1/2 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-gray-800">직무·직업</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedCategoryId == null
                          ? "왼쪽에서 분야를 먼저 선택하세요"
                          : "세부 직무를 선택하세요"}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto divide-y divide-gray-100">
                    {selectedCategoryId == null || jobsForSelectedCategory.length === 0 ? (
                      <p className="px-5 py-4 text-sm text-gray-400">
                        {selectedCategoryId == null
                          ? "분야를 선택하면 관련 직무·직업 목록이 표시됩니다."
                          : "해당 분야에 연결된 직무·직업 데이터가 없습니다."}
                      </p>
                    ) : (
                      jobsForSelectedCategory.map((job) => {
                        const isSelected = selectedJobName === job.saraminJobName;
                        return (
                          <button
                            key={`${job.saraminCategoryId}-${job.saraminJobName}`}
                            type="button"
                          onClick={() => setSelectedJobName(job.saraminJobName)}
                          className={`w-full text-left px-5 py-2.5 text-base ${
                              isSelected
                                ? "bg-blue-50 text-blue-800 font-medium"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {job.saraminJobName}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      {typeof document !== "undefined" && createPortal(modalContent, document.body)}
      <IndustryClassificationModal
        open={classificationMajor !== null}
        onClose={handleCloseClassification}
        majorName={classificationMajor?.name ?? ""}
        middleNodes={classificationMajor?.children ?? []}
        onConfirmMajor={handleConfirmFromClassification}
      />
    </>
  );
}
