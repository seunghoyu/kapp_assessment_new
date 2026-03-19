"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { IndustryNode } from "./industryTypes";
import IndustryClassificationModal from "./IndustryClassificationModal";
import TwemojiIcon from "@/components/common/TwemojiIcon";
import jobFamilyPayload from "@/data/Industry/job_family_payload_v10.json";
import industryMajorMeta from "@/data/Industry/industry_major_meta_v10.json";

type JobFamilyItem = {
  job_family_id: string;
  family_group_id: string;
  major_category_num: number;
  major_category_label: string;
  major_category_icon: string;
  job_family_name_ko: string;
  typical_roles: string[];
};

const JOB_FAMILIES = jobFamilyPayload as JobFamilyItem[];
const META = industryMajorMeta as Record<string, { sort_order: number; short_name: string }>;

/** 모달에서 제외할 대분류 코드 (T, U → 19개만 표시) */
const EXCLUDED_MAJOR_CODES = new Set(["T", "U"]);

type Props = {
  open: boolean;
  onClose: () => void;
  majors: IndustryNode[];
  /** 최종 선택: 산업군(대분류) + 선택한 역할(typical_roles 중 1개 문자열) */
  onSelect: (major: IndustryNode, jobName: string) => void;
};

type Step = "industry" | "job";
type JobStep = "category" | "family";

export default function IndustrySelectModal({
  open,
  onClose,
  majors,
  onSelect,
}: Props) {
  const [selectedMajorInModal, setSelectedMajorInModal] = useState<IndustryNode | null>(null);
  const [classificationMajor, setClassificationMajor] = useState<IndustryNode | null>(null);
  const [step, setStep] = useState<Step>("industry");
  const [jobStep, setJobStep] = useState<JobStep>("category");

  const [selectedCategoryNum, setSelectedCategoryNum] = useState<number | null>(null);
  const [selectedJobFamilyId, setSelectedJobFamilyId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  type DisplayMajor = IndustryNode & { sort_order: number; short_name: string };

  /** 19개만 표시 (T/U 제외), industry_major_meta의 short_name·sort_order로 정렬/표시 */
  const displayMajors = useMemo((): DisplayMajor[] => {
    const filtered = majors.filter((m) => !EXCLUDED_MAJOR_CODES.has(m.code));
    return filtered
      .map((m) => ({
        ...m,
        sort_order: META[m.code]?.sort_order ?? 999,
        short_name: META[m.code]?.short_name ?? m.name,
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [majors]);

  /** 직무 카테고리: major_category_num 기준 그룹, 대표 label/icon */
  const jobCategories = useMemo(() => {
    const byNum = new Map<
      number,
      { major_category_num: number; major_category_label: string; major_category_icon: string }
    >();
    for (const j of JOB_FAMILIES) {
      if (!byNum.has(j.major_category_num)) {
        byNum.set(j.major_category_num, {
          major_category_num: j.major_category_num,
          major_category_label: j.major_category_label,
          major_category_icon: j.major_category_icon,
        });
      }
    }
    return Array.from(byNum.values()).sort((a, b) => a.major_category_num - b.major_category_num);
  }, []);

  /** 선택한 카테고리 내 job_family 목록 */
  const jobsForSelectedCategory = useMemo(() => {
    if (selectedCategoryNum == null) return [];
    return JOB_FAMILIES.filter((j) => j.major_category_num === selectedCategoryNum);
  }, [selectedCategoryNum]);

  /** 선택한 job_family의 typical_roles */
  const rolesForSelectedJobFamily = useMemo(() => {
    if (!selectedJobFamilyId) return [];
    const j = JOB_FAMILIES.find((f) => f.job_family_id === selectedJobFamilyId);
    return j?.typical_roles ?? [];
  }, [selectedJobFamilyId]);

  useEffect(() => {
    if (!open) {
      setSelectedMajorInModal(null);
      setClassificationMajor(null);
      setStep("industry");
      setJobStep("category");
      setSelectedCategoryNum(null);
      setSelectedJobFamilyId(null);
      setSelectedRole(null);
    }
  }, [open]);

  const goToJobStep = () => {
    if (!selectedMajorInModal) return;
    setStep("job");
    setJobStep("category");
    setSelectedCategoryNum(null);
    setSelectedJobFamilyId(null);
    setSelectedRole(null);
  };

  const goBackToIndustryStep = () => {
    setStep("industry");
    setJobStep("category");
    setSelectedCategoryNum(null);
    setSelectedJobFamilyId(null);
    setSelectedRole(null);
    setClassificationMajor(null);
  };

  const handleSelect = () => {
    if (step === "industry") {
      if (selectedMajorInModal) goToJobStep();
      return;
    }
    if (selectedMajorInModal && selectedRole) {
      onSelect(selectedMajorInModal, selectedRole);
      onClose();
    }
  };

  const handleOpenDetail = () => {
    if (selectedMajorInModal) setClassificationMajor(selectedMajorInModal);
  };

  const handleCloseClassification = () => setClassificationMajor(null);

  const handleConfirmFromClassification = () => {
    if (!classificationMajor) return;
    setSelectedMajorInModal(classificationMajor);
    setClassificationMajor(null);
    goToJobStep();
  };

  const handleCategoryClick = (num: number) => {
    setSelectedCategoryNum(num);
    setJobStep("family");
    setSelectedJobFamilyId(null);
    setSelectedRole(null);
  };

  const goBackToCategoryStep = () => {
    setJobStep("category");
    setSelectedCategoryNum(null);
    setSelectedJobFamilyId(null);
    setSelectedRole(null);
  };

  const canConfirmJob = step === "job" && selectedMajorInModal != null && selectedRole != null;

  if (!open) return null;

  const isIndustryStep = step === "industry";

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        className="relative flex flex-col w-[98vw] max-w-[95rem] h-[92vh] min-h-[32rem] rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="industry-select-title"
        onDragStart={(e) => e.preventDefault()}
      >
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 id="industry-select-title" className="text-xl font-semibold text-gray-900">
                  {isIndustryStep ? "산업군 선택" : "세부 직무 선택"}
                </h2>
                {step === "job" && jobStep === "family" && (
                  <button
                    type="button"
                    onClick={goBackToCategoryStep}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    ← 뒤로가기
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {isIndustryStep
                  ? "산업군 선택이 어려운 경우 상세보기를 통해 산업 분류 체계를 확인할 수 있습니다."
                  : "직무 카테고리를 선택해주세요."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {!isIndustryStep && (
                  <button
                    type="button"
                    onClick={goBackToIndustryStep}
                    className="rounded-md bg-white border border-gray-300 text-gray-700 text-sm font-medium px-3 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    산업군 다시 선택
                  </button>
                )}
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
                disabled={isIndustryStep ? !selectedMajorInModal : !canConfirmJob}
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

        <div className="flex-1 min-h-0 px-4 py-3 relative overflow-hidden">
          {/* 1단계: 산업군 선택 (그리드, 19개 sort_order·short_name) */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              step === "industry" ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="h-full flex items-center justify-center">
              <div className="w-full max-w-7xl px-8 py-8">
                <div className="grid grid-cols-4 gap-6 auto-rows-fr">
                  {displayMajors.map((major) => {
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
                          {major.sort_order}
                        </span>
                        <span className="text-gray-900 font-medium text-sm leading-snug">
                          {major.short_name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 2단계: 직무 선택 — (1) 카테고리 카드 (2) 좌 job_family 리스트 / 우 typical_roles 행형 */}
          <div
            className={`absolute inset-0 transition-transform duration-300 ${
              step === "job" ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {jobStep === "category" ? (
                <>
                  <p className="text-sm text-gray-500 mb-4 px-6">
                  </p>
                  <div className="flex-1 min-h-0 flex items-center justify-center px-6 py-8">
                    <div className="grid grid-cols-7 grid-rows-3 gap-[18px] w-full max-w-6xl">
                    {jobCategories.map((cat) => {
                      const isSelected = selectedCategoryNum === cat.major_category_num;
                      return (
                        <button
                          key={cat.major_category_num}
                          type="button"
                          onClick={() => handleCategoryClick(cat.major_category_num)}
                          draggable={false}
                          className={`aspect-square flex flex-col justify-center items-center border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                              : "border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50"
                          }`}
                        >
                          <TwemojiIcon
                            icon={cat.major_category_icon}
                            size="2rem"
                            className="mb-5"
                          />
                          <span className="text-xs font-medium text-gray-800 text-center px-1">
                            {cat.major_category_label}
                          </span>
                        </button>
                      );
                    })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 min-h-0 flex-col px-6 py-[30px]">
                  <div className="flex flex-1 min-h-0 gap-6">
                    {/* 좌측: job_family 행형 리스트 */}
                    <div className="w-[40%] flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-base font-semibold text-gray-800">직무군</p>
                        <p className="text-xs text-gray-500 mt-0.5">직무군을 선택하세요</p>
                      </div>
                      <div className="flex-1 min-h-0 overflow-auto divide-y divide-gray-100">
                        {jobsForSelectedCategory.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-gray-400">
                            해당 카테고리에 직무군이 없습니다.
                          </p>
                        ) : (
                          jobsForSelectedCategory.map((j) => {
                            const isSelected = selectedJobFamilyId === j.job_family_id;
                            return (
                              <button
                                key={j.job_family_id}
                                type="button"
                                onClick={() => {
                                  setSelectedJobFamilyId(j.job_family_id);
                                  setSelectedRole(null);
                                }}
                                className={`w-full text-left px-5 py-3.5 text-base leading-snug ${
                                  isSelected
                                    ? "bg-blue-50 text-blue-800 font-medium"
                                    : "text-gray-900 hover:bg-gray-50"
                                }`}
                              >
                                {j.job_family_name_ko}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                    {/* 우측: typical_roles 1행=1항목 행형 */}
                    <div className="flex-1 min-w-0 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-base font-semibold text-gray-800">역할</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {selectedJobFamilyId == null
                            ? "왼쪽에서 직무군을 먼저 선택하세요"
                            : "역할을 선택하세요"}
                        </p>
                      </div>
                      <div className="flex-1 min-h-0 overflow-auto divide-y divide-gray-100">
                        {selectedJobFamilyId == null ? (
                          <p className="px-5 py-4 text-sm text-gray-400">
                            직무군을 선택하면 해당 역할 목록이 표시됩니다.
                          </p>
                        ) : rolesForSelectedJobFamily.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-gray-400">
                            해당 직무군에 정의된 역할이 없습니다.
                          </p>
                        ) : (
                          rolesForSelectedJobFamily.map((role) => {
                            const isSelected = selectedRole === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left px-5 py-2.5 text-base ${
                                  isSelected
                                    ? "bg-blue-50 text-blue-800 font-medium"
                                    : "text-gray-900 hover:bg-gray-50"
                                }`}
                              >
                                {role}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
