"use client";

import { Check } from "lucide-react";

type Props = {
  infoStep: 1 | 2 | 3;
};

function getDescription(infoStep: 1 | 2 | 3): string {
  switch (infoStep) {
    case 1:
      return "당신의 직무 기준으로 분석이 시작됩니다";
    case 2:
      return "분석 결과를 저장하고 언제든 다시 확인할 수 있습니다";
    case 3:
      return "조직 환경 기반으로 더 정밀한 결과를 제공합니다";
    default:
      return "";
  }
}

export default function DiagnosisInfoInputLeftPanel({ infoStep }: Props) {
  const description = getDescription(infoStep);

  return (
    <>
      <div className="text-xs text-gray-400 w-full">STEP {infoStep} / 3</div>

      <h2 className="text-3xl font-bold text-gray-900 mb-3 md:text-4xl w-full text-left">
        맞춤형 역량 진단을 위한 정보 입력
      </h2>

      <p className="text-sm text-gray-600 max-w-[420px] leading-relaxed w-full text-left">
        {description}
      </p>

      <div className="mt-4 flex flex-col gap-2 w-full text-left">
        <div className="flex items-center justify-start gap-2 text-sm text-gray-600">
          <Check className="h-4 w-4 text-green-500" />
          개인 역량 리포트 제공
        </div>
        <div className="flex items-center justify-start gap-2 text-sm text-gray-600">
          <Check className="h-4 w-4 text-green-500" />
          맞춤 성장 로드맵 제공
        </div>
      </div>
    </>
  );
}

