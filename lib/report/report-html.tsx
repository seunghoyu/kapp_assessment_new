import path from "path";
import { readFile } from "fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { ReportDocument } from "@/app/report/_components/ReportDocument";
import { REPORT_SHARED_CSS } from "./report-styles";
import type { ReportModel } from "./report-data";

let templateCache: Promise<string> | null = null;

async function loadTemplate(): Promise<string> {
  if (!templateCache) {
    const templatePath = path.join(process.cwd(), "app", "report", "_templates", "report-template.html");
    templateCache = readFile(templatePath, "utf8");
  }
  return templateCache;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function renderReportHtml(report: ReportModel): Promise<string> {
  const template = await loadTemplate();
  const body = renderToStaticMarkup(<ReportDocument report={report} />);

  return template
    .replace("{{TITLE}}", escapeHtml(report.title))
    .replace("{{SUBTITLE}}", escapeHtml(report.subtitle))
    .replace("{{REPORT_CSS}}", REPORT_SHARED_CSS)
    .replace("{{BODY}}", body);
}
