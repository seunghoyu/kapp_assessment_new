"use client";

export type FlowScope = "root" | "consumer" | "admin";

type ServiceFlowProps = {
  scope: FlowScope;
  flowDataBasePath?: string;
};

/**
 * KAPP 서비스 구조도 다이어그램.
 * flowDataBasePath에서 데이터를 불러와 플로우를 렌더링할 수 있도록 확장 가능.
 */
export default function ServiceFlow({ scope, flowDataBasePath }: ServiceFlowProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
      <p className="text-sm">
        서비스 구조도 (scope: <strong>{scope}</strong>
        {flowDataBasePath ? `, base: ${flowDataBasePath}` : ""})
      </p>
      <p className="mt-2 text-xs text-gray-400">다이어그램 데이터 연동은 추후 추가 예정입니다.</p>
    </div>
  );
}
