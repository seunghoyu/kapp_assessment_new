import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildReportModel, createPdfFileName, normalizeReportRequest, parseReportRequest } from "@/lib/report/report-data";
import { renderReportHtml } from "@/lib/report/report-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readRequestPayload(request: NextRequest) {
  const queryPayload = request.nextUrl.searchParams.get("payload");
  if (queryPayload) {
    return parseReportRequest(queryPayload);
  }

  if (request.method === "POST") {
    try {
      const body = (await request.json()) as unknown;
      if (typeof body === "string") {
        return parseReportRequest(body);
      }
      if (body && typeof body === "object") {
        const record = body as Record<string, unknown>;
        if (typeof record.payload === "string") {
          return parseReportRequest(record.payload);
        }
        return normalizeReportRequest(record);
      }
    } catch {
      return {};
    }
  }

  return {};
}

async function createPdfResponse(request: NextRequest) {
  const reportRequest = await readRequestPayload(request);
  const report = buildReportModel(reportRequest);
  const html = await renderReportHtml(report);
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 2200, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: false,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    const filename = createPdfFileName(report);
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    return await createPdfResponse(request);
  } catch (error) {
    console.error("Failed to generate report PDF", error);
    return NextResponse.json({ message: "PDF 생성에 실패했습니다." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await createPdfResponse(request);
  } catch (error) {
    console.error("Failed to generate report PDF", error);
    return NextResponse.json({ message: "PDF 생성에 실패했습니다." }, { status: 500 });
  }
}
