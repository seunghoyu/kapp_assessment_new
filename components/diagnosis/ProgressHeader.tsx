"use client";

type Props = {
  step: number;
};

function getProgressPercent(step: number): number {
  // step 기준 단순 매핑: 1~7 (시작 0 제외)
  const map: Record<number, number> = {
    1: 10,
    2: 24,
    3: 38,
    4: 52,
    5: 66,
    6: 82,
    7: 100,
  };
  if (step <= 0) return 0;
  return map[step] ?? 0;
}

function getProgressDescription(step: number): string {
  if (step >= 1 && step <= 2) return "기초 정보를 분석하고 있어요";
  if (step >= 3 && step <= 4) return "핵심 역량을 분석하고 있어요";
  if (step === 5) return "실전 역량을 분석 중입니다";
  if (step === 6) return "AI 도구·트렌드·활용 패턴을 점검하고 학습 힌트를 모으고 있어요";
  return "최종 결과를 확인하세요";
}

export default function ProgressHeader({ step }: Props) {
  const percent = getProgressPercent(step);
  const description = getProgressDescription(step);

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white px-3 py-2">
      <div className="min-w-[220px]">
        <div className="text-sm font-semibold text-gray-900">AI 역량 분석 진행 중</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>

      <div className="flex-1 min-w-[200px]">
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
            aria-label={`진행률 ${percent}%`}
          />
        </div>
      </div>
    </div>
  );
}

