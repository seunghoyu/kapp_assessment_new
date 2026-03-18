"use client";

import { useEffect, useMemo, useRef, type KeyboardEvent, type SyntheticEvent } from "react";
import { Download } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import type { ReportModel } from "@/lib/report/report-data";
import { REPORT_SHARED_CSS } from "@/lib/report/report-styles";
import { ReportDocument } from "./ReportDocument";

type Props = {
  report: ReportModel;
  payload: string;
};

export default function ReportPreviewClient({ report, payload }: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const pdfHref = useMemo(() => {
    const encoded = encodeURIComponent(payload);
    return `${ROUTES.REPORT_PDF_API}?payload=${encoded}`;
  }, [payload]);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const preventSelectStart = (event: Event) => {
      event.preventDefault();
    };

    element.addEventListener("selectstart", preventSelectStart);
    return () => {
      element.removeEventListener("selectstart", preventSelectStart);
    };
  }, []);

  const handleBlock = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key.toLowerCase();
    const blocked = (event.ctrlKey || event.metaKey) && ["c", "x", "v", "a"].includes(key);
    if (blocked) {
      event.preventDefault();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
    }
  };

  return (
    <div
      ref={previewRef}
      className="report-preview-shell report-preview-guard"
      onCopy={handleBlock}
      onCut={handleBlock}
      onPaste={handleBlock}
      onContextMenu={handleBlock}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <style dangerouslySetInnerHTML={{ __html: REPORT_SHARED_CSS }} />

      <div className="report-toolbar">
        <div>
          <p className="report-toolbar-title">종합 역량 분석 PDF 미리보기</p>
          <p className="report-toolbar-subtitle">
            동일한 데이터로 PDF를 바로 생성할 수 있습니다.
          </p>
        </div>

        <div className="report-toolbar-actions">
          <a
            className="report-link-button report-link-button--primary"
            href={pdfHref}
            download
          >
            <Download size={16} />
            PDF 다운로드
          </a>
        </div>
      </div>

      <ReportDocument report={report} />
    </div>
  );
}
