import ReportPreviewClient from "../_components/ReportPreviewClient";
import { buildReportModel, parseReportRequest, serializeReportRequest } from "@/lib/report/report-data";

type PreviewPageProps = {
  searchParams?: {
    payload?: string | string[];
  };
};

export default function ReportPreviewPage({ searchParams }: PreviewPageProps) {
  const payloadParam = Array.isArray(searchParams?.payload) ? searchParams?.payload[0] : searchParams?.payload;
  const payload = payloadParam ?? serializeReportRequest({});
  const report = buildReportModel(parseReportRequest(payload));

  return <ReportPreviewClient report={report} payload={payload} />;
}
