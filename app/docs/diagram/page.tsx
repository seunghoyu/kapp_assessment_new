"use client";

import { useSearchParams } from "next/navigation";
import ServiceFlow, { type FlowScope } from "@/components/diagram/ServiceFlow";

const VALID_SCOPES: FlowScope[] = ["root", "consumer", "admin"];

export default function DiagramPage() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("scope");
  const scope: FlowScope =
    raw && VALID_SCOPES.includes(raw as FlowScope) ? (raw as FlowScope) : "root";

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        KAPP 서비스 구조도 {scope !== "root" ? `(${scope})` : ""}
      </h1>
      <ServiceFlow scope={scope} flowDataBasePath="/docs/diagram" />
    </div>
  );
}
