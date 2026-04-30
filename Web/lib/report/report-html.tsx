import path from "path";
import { readFile } from "fs/promises";
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

function formatScore(value: number): string {
  return `${Math.round(value)}점`;
}

function pointsToString(points: { x: number; y: number }[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function polarToPoint(center: number, angleDeg: number, radius: number) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
}

function buildPolygon(center: number, chartRadius: number, values: number[], maxValue: number) {
  return values.map((value, index) => {
    const ratio = Math.max(0, Math.min(1, value / maxValue));
    const angleStep = 360 / values.length;
    return polarToPoint(center, angleStep * index, chartRadius * ratio);
  });
}

function buildGridRings(center: number, chartRadius: number, axisCount: number, levels = 4) {
  return Array.from({ length: levels }, (_, ringIndex) => {
    const ratio = (ringIndex + 1) / levels;
    const angleStep = 360 / axisCount;
    const points: { x: number; y: number }[] = [];
    for (let axisIndex = 0; axisIndex < axisCount; axisIndex += 1) {
      points.push(polarToPoint(center, angleStep * axisIndex, chartRadius * ratio));
    }
    return points;
  });
}

function renderRadarSvg(report: ReportModel): string {
  const chartSize = 420;
  const center = chartSize / 2;
  const chartRadius = 132;
  const labelRadius = chartRadius + 28;
  const labels = report.competency.radar.labels;
  const userPolygon = buildPolygon(center, chartRadius, report.competency.radar.myScores, report.competency.radar.fullMark);
  const benchmarkPolygon = buildPolygon(center, chartRadius, report.competency.radar.benchmarkScores, report.competency.radar.fullMark);
  const rings = buildGridRings(center, chartRadius, labels.length);

  const ringHtml = rings
    .map(
      (ring, ringIndex) =>
        `<polygon points="${pointsToString(ring)}" fill="none" stroke="${ringIndex === rings.length - 1 ? "#cbd5e1" : "#e2e8f0"}" stroke-width="1"></polygon>`
    )
    .join("");

  const labelHtml = labels
    .map((label, index) => {
      const angleStep = 360 / labels.length;
      const axisPoint = polarToPoint(center, angleStep * index, chartRadius);
      const labelPoint = polarToPoint(center, angleStep * index, labelRadius);
      const isLeft = labelPoint.x < center - 6;
      const isRight = labelPoint.x > center + 6;
      const textAnchor = isLeft ? "end" : isRight ? "start" : "middle";
      return `
        <g>
          <line x1="${center}" y1="${center}" x2="${axisPoint.x}" y2="${axisPoint.y}" stroke="#e2e8f0"></line>
          <text x="${labelPoint.x}" y="${labelPoint.y}" text-anchor="${textAnchor}" dominant-baseline="middle" font-size="12" fill="#475569" font-weight="700">${escapeHtml(label)}</text>
        </g>`;
    })
    .join("");

  return `
    <div class="report-radar-frame">
      <svg viewBox="0 0 ${chartSize} ${chartSize}" class="report-radar-svg" role="img" aria-label="역량 비교 레이더 차트">
        <circle cx="${center}" cy="${center}" r="${chartRadius}" fill="none" stroke="#cbd5e1" stroke-dasharray="4 6"></circle>
        ${ringHtml}
        ${labelHtml}
        <polygon points="${pointsToString(benchmarkPolygon)}" fill="rgba(217, 119, 6, 0.10)" stroke="#d97706" stroke-width="2" stroke-dasharray="6 4"></polygon>
        <polygon points="${pointsToString(userPolygon)}" fill="rgba(37, 99, 235, 0.18)" stroke="#2563eb" stroke-width="2.5"></polygon>
        ${benchmarkPolygon
          .map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.5" fill="#d97706"></circle>`)
          .join("")}
        ${userPolygon.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#2563eb"></circle>`).join("")}
      </svg>

      <div class="report-chart-legend">
        <span class="report-legend-item">
          <span class="report-legend-swatch" style="background:#2563eb"></span>
          나의 점수
        </span>
        <span class="report-legend-item report-legend-item--benchmark">
          <span class="report-legend-swatch" style="background:#d97706"></span>
          직급 평균
        </span>
      </div>
    </div>
  `;
}

function renderMetricCard(label: string, value: string, desc: string) {
  return `
    <div class="report-metric">
      <div class="report-metric-main">
        <p class="report-metric-label">${escapeHtml(label)}</p>
        <p class="report-metric-value">${escapeHtml(value)}</p>
      </div>
      <p class="report-metric-desc">${escapeHtml(desc)}</p>
    </div>
  `;
}

function renderSummaryBullet(title: string, text: string) {
  return `
    <div class="report-list-item">
      <p class="report-list-item-title">${escapeHtml(title)}</p>
      <p class="report-list-item-text">${escapeHtml(text)}</p>
    </div>
  `;
}

function renderCompetencyTable(report: ReportModel) {
  return `
    <table class="report-table">
      <thead>
        <tr>
          <th>역량</th>
          <th class="is-right">본인</th>
          <th class="is-right">직급 평균</th>
          <th class="is-right">차이</th>
        </tr>
      </thead>
      <tbody>
        ${report.competency.rows
          .map(
            (row) => `
              <tr>
                <td>
                  <strong>${escapeHtml(row.short)}</strong>
                  <span class="report-note" style="display:block;">${escapeHtml(row.label)}</span>
                </td>
                <td class="is-right is-blue">${formatScore(row.myScore)}</td>
                <td class="is-right is-warm">${formatScore(row.benchmarkScore)}</td>
                <td class="is-right is-blue">${row.gap >= 0 ? `+${row.gap}` : row.gap}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function buildAiAdvice(report: ReportModel) {
  const weakestGap = Math.abs(report.summary.weakest.myScore - report.summary.weakest.benchmarkScore);
  const benchmarkPressure = report.market.industryBenchmarkRows.reduce((lowest, current) => {
    if (!lowest) return current;
    return current.gap < lowest.gap ? current : lowest;
  }, null as null | ReportModel["market"]["industryBenchmarkRows"][number]);

  return [
    {
      title: "우선 보완",
      text: `${report.summary.weakest.short} 역량은 직급 평균 대비 ${weakestGap}점 차이입니다. 실제 업무에서 바로 쓰는 사례를 주 2회씩 넣어 균형을 먼저 맞추는 것이 좋습니다.`,
    },
    {
      title: "강점 활용",
      text: `${report.summary.strongest.short} 역량은 ${formatScore(report.summary.strongest.myScore)}로 안정적입니다. 직급 평균보다 ${Math.abs(report.summary.strongest.myScore - report.summary.strongest.benchmarkScore)}점 앞서 있으므로 회의 메모, 결과 정리, 리뷰 대응에 이 강점을 반복적으로 연결하세요.`,
    },
    {
      title: "실행 목표",
      text: `${report.summary.opportunitySummary}을 목표로, 앞으로 6주 동안 학습 1회 · 실전 1회 · 피드백 1회를 고정 루틴으로 운영하세요${benchmarkPressure ? `. 특히 ${benchmarkPressure.label}는 업계 상위 10% 대비 ${Math.abs(benchmarkPressure.gap)}점 차이입니다.` : ""}`,
    },
  ];
}

function renderRoadmapSkills(skills: string[] = []) {
  return skills.map((skill) => `<span class="report-skill-chip">${escapeHtml(skill)}</span>`).join("");
}

function renderReportBody(report: ReportModel): string {
  const aiAdvice = buildAiAdvice(report);
  const aiAdviceHtml = aiAdvice
    .map(
      (item, index) => `
        <div class="report-advice-item">
          <p class="report-advice-item-title">${index + 1}. ${escapeHtml(item.title)}</p>
          <p class="report-advice-item-text">${escapeHtml(item.text)}</p>
        </div>
      `
    )
    .join("");

  const actionHtml = report.market.actions
    .map(
      (action) => `
        <div class="report-list-item report-list-item--action">
          <p class="report-list-item-title">
            <span class="report-priority-chip ${
              action.priority === "high"
                ? "report-priority-chip--high"
                : action.priority === "medium"
                  ? "report-priority-chip--medium"
                  : "report-priority-chip--low"
            }">${action.priority === "high" ? "우선" : action.priority === "medium" ? "중간" : "보조"}</span>
            ${escapeHtml(action.icon)} ${escapeHtml(action.title)}
          </p>
          <p class="report-list-item-text">${escapeHtml(action.description)}</p>
        </div>
      `
    )
    .join("");

  const roadmapHtml = report.roadmap.careerPath
    ? `
        <div style="margin-top:14px;">
          <div class="report-list">
            <div class="report-list-item">
              <p class="report-list-item-title">현재</p>
              <p class="report-list-item-text">${escapeHtml(report.roadmap.careerPath.current.role)}</p>
              <div style="margin-top:8px;">${renderRoadmapSkills(report.roadmap.careerPath.current.skills)}</div>
            </div>
            <div class="report-list-item">
              <p class="report-list-item-title">${escapeHtml(report.roadmap.careerPath.milestone1.year)}</p>
              <p class="report-list-item-text">${escapeHtml(report.roadmap.careerPath.milestone1.role)}</p>
              <div style="margin-top:8px;">${renderRoadmapSkills(report.roadmap.careerPath.milestone1.skills)}</div>
            </div>
            <div class="report-list-item">
              <p class="report-list-item-title">${escapeHtml(report.roadmap.careerPath.milestone2.year)}</p>
              <p class="report-list-item-text">${escapeHtml(report.roadmap.careerPath.milestone2.role)}</p>
              <div style="margin-top:8px;">${renderRoadmapSkills(report.roadmap.careerPath.milestone2.skills)}</div>
            </div>
          </div>
          <div class="report-divider"></div>
          <p class="report-card-text">추천 학습 경로</p>
          <div class="report-list" style="margin-top:10px;">
            ${report.roadmap.learningPath
              .map(
                (item, index) => `
                  <div class="report-list-item">
                    <p class="report-list-item-title">${index + 1}. ${escapeHtml(item.title)}</p>
                    <p class="report-list-item-text">기간 ${escapeHtml(item.duration)} · 우선순위 ${escapeHtml(item.priority)}</p>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `
    : `
        <div style="margin-top:14px;">
          <div class="report-chip">공통 로드맵 우선 적용</div>
          <p class="report-card-text" style="margin-top:12px;">
            현재 상태에서는 산업군 기반 경로보다 공통 성장 과제를 먼저 실행하는 편이 더 자연스럽습니다.
          </p>
        </div>
      `;

  return `
    <div class="report-stack">
      <section class="report-page report-cover">
        <div class="report-watermark">${escapeHtml(report.user.name)}</div>
        <div class="report-cover-hero">
          <p class="report-kicker">COMPREHENSIVE REPORT</p>
          <h1 class="report-cover-title">${escapeHtml(report.title)}</h1>
          <div class="report-cover-badge">${escapeHtml(report.subtitle)}</div>
        </div>
        <div class="report-cover-stack">
          <div class="report-card report-card--large">
            <p class="report-card-title">작성자</p>
            <p class="report-cover-name">${escapeHtml(report.user.name)}</p>
            <p class="report-card-text">산업군 ${escapeHtml(report.user.industryLabel)} · 직무 ${escapeHtml(report.user.jobLabel)}</p>
          </div>
          <div class="report-card report-card--large">
            <p class="report-card-title">현재 위치</p>
            <p class="report-card-text">${escapeHtml(report.cover.summaryText)}</p>
            <div class="report-divider"></div>
            <div class="report-cover-metrics">
              ${renderMetricCard("종합 점수", String(report.cover.overallScore), "4개 역량 평균을 기준으로 정리한 대표 점수입니다.")}
              ${renderMetricCard("현재 수준", report.cover.currentLevel, "동일 집단 내 현재 위치를 먼저 확인합니다.")}
              ${renderMetricCard("상위권 해석", report.cover.percentileRank, "상위권 진입 가능성을 빠르게 읽을 수 있습니다.")}
            </div>
          </div>
        </div>
      </section>

      <section class="report-page">
        <div class="report-watermark">${escapeHtml(report.user.name)}</div>
        <div class="report-section-header">
          <h2 class="report-section-title">1. 전체 요약</h2>
          <p class="report-section-subtitle">임직원이 처음 결과를 볼 때 가장 먼저 이해해야 하는 핵심 해석만 압축했습니다.</p>
        </div>
        <div class="report-summary-layout">
          <div class="report-chart-card report-chart-card--narrow">
            ${renderRadarSvg(report)}
          </div>
          <div class="report-summary-side">
            ${renderMetricCard(
              "종합 점수",
              String(report.summary.overallScore),
              `직급 평균 ${report.summary.benchmarkAverage}점과 비교했을 때 ${report.summary.scoreGap >= 0 ? "+" : ""}${report.summary.scoreGap}점 차이입니다.`
            )}
            ${renderMetricCard("현재 수준", report.summary.currentLevel, "지식·적용·성과·생산성 4개 영역의 균형을 함께 읽어야 합니다.")}
            ${renderMetricCard("상위권 해석", report.summary.percentileRank, "상위권 진입 가능성을 한 문장으로 정리한 지표입니다.")}
            <div class="report-card report-card--large">
              <p class="report-card-title">핵심 해석</p>
              <div class="report-stack-list">
                ${renderSummaryBullet(
                  "강점",
                  `${report.summary.strongest.short} 영역이 상대적으로 가장 높습니다. ${formatScore(report.summary.strongest.myScore)}로 ${formatScore(report.summary.strongest.benchmarkScore)}인 직급 평균을 상회합니다.`
                )}
                ${renderSummaryBullet(
                  "보완",
                  `${report.summary.weakest.short} 영역은 가장 먼저 보완할 영역입니다. 현재 ${formatScore(report.summary.weakest.myScore)} 수준이므로 실전 적용 경험을 보강하면 균형이 좋아집니다.`
                )}
                ${renderSummaryBullet("핵심 기회", report.summary.opportunitySummary)}
              </div>
            </div>
          </div>
        </div>
        <div class="report-footer"><span class="report-page-number">PAGE 02</span></div>
      </section>

      <section class="report-page">
        <div class="report-watermark">${escapeHtml(report.user.name)}</div>
        <div class="report-section-header">
          <h2 class="report-section-title">2. 핵심 역량 구조</h2>
          <p class="report-section-subtitle">레이더 차트와 테이블을 함께 배치해 역량의 균형과 세부 점수를 동시에 볼 수 있도록 구성했습니다.</p>
        </div>
        <div class="report-competency-layout">
          <div class="report-chart-card report-chart-card--section2">
            ${renderRadarSvg(report)}
          </div>
          <div class="report-card report-card--large report-card--wide">
            <p class="report-card-title">역량 개요</p>
            ${renderCompetencyTable(report)}
          </div>
        </div>
        <div class="report-footer"><span class="report-page-number">PAGE 03</span></div>
      </section>

      <section class="report-page">
        <div class="report-watermark">${escapeHtml(report.user.name)}</div>
        <div class="report-section-header">
          <h2 class="report-section-title">3. 현재 상태 해석</h2>
          <p class="report-section-subtitle">점수를 어떤 관점으로 읽어야 하는지, 그리고 무엇을 우선적으로 개선해야 하는지 정리했습니다.</p>
        </div>
        <div class="report-grid-2">
          <div class="report-card report-card--large">
            <p class="report-card-title">현재 포지션</p>
            <p class="report-title" style="font-size:22px;">${escapeHtml(report.market.currentLevel)}</p>
            <div class="report-divider"></div>
            <p class="report-card-text">${escapeHtml(report.market.currentLevelDesc)}</p>
            <div class="report-divider"></div>
            <div class="report-grid-2">
              <div>
                <p class="report-metric-label">상위권 지표</p>
                <p class="report-metric-value" style="font-size:20px;">${escapeHtml(report.market.percentile)}</p>
              </div>
              <div>
                <p class="report-metric-label">기회 요약</p>
                <p class="report-metric-value" style="font-size:18px;">${escapeHtml(report.market.opportunitySummary)}</p>
              </div>
            </div>
            <div class="report-divider"></div>
            <div class="report-grid-3">
              <div>
                <p class="report-metric-label">강점</p>
                <p class="report-metric-value" style="font-size:20px;">${report.market.strengthCount}개</p>
              </div>
              <div>
                <p class="report-metric-label">보완</p>
                <p class="report-metric-value" style="font-size:20px;">${report.market.improvementCount}개</p>
              </div>
              <div>
                <p class="report-metric-label">평균</p>
                <p class="report-metric-value" style="font-size:20px;">${report.market.averageCount}개</p>
              </div>
            </div>
          </div>
          <div class="report-card report-card--large">
            <p class="report-card-title">벤치마크 비교</p>
            <table class="report-table">
              <thead>
                <tr>
                  <th>역량</th>
                  <th class="is-right">업계 상위 10%</th>
                  <th class="is-right">본인</th>
                  <th class="is-right">차이</th>
                </tr>
              </thead>
              <tbody>
                ${report.market.industryBenchmarkRows
                  .map(
                    (row) => `
                      <tr>
                        <td><strong>${escapeHtml(row.label)}</strong></td>
                        <td class="is-right is-warm">${formatScore(row.benchmarkScore)}</td>
                        <td class="is-right is-blue">${formatScore(row.myScore)}</td>
                        <td class="is-right is-blue">${row.gap >= 0 ? `+${row.gap}` : row.gap}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
        <div class="report-divider"></div>
        <div class="report-card report-card--large report-advice-panel">
          <div class="report-advice-summary">
            <p class="report-card-title">AI 조언</p>
            <p class="report-advice-lead">
              현재는 강점이 분명하지만, 실제 업무 성과를 더 올리려면 약한 역량을 먼저 끌어올리는 편이 가장 빠릅니다.
            </p>
            <div class="report-advice-list">${aiAdviceHtml}</div>
          </div>
          <div class="report-advice-actions">
            <p class="report-card-title">우선 실행 액션</p>
            <div class="report-list">${actionHtml}</div>
          </div>
        </div>
        <div class="report-footer"><span class="report-page-number">PAGE 04</span></div>
      </section>

      <section class="report-page">
        <div class="report-watermark">${escapeHtml(report.user.name)}</div>
        <div class="report-section-header">
          <h2 class="report-section-title">4. 성장 방향 / 로드맵</h2>
          <p class="report-section-subtitle">대시보드의 성장 로드맵 탭을 자연스럽게 이어 붙여, 다음 행동이 무엇인지 한 눈에 보이도록 구성했습니다.</p>
        </div>
        <div class="report-grid-2">
          <div class="report-card report-card--large">
            <p class="report-card-title">개인 개발 계획</p>
            <p class="report-card-text">${escapeHtml(report.roadmap.idpDescription)}</p>
            <div class="report-divider"></div>
            <div class="report-list">
              ${report.roadmap.idpItems
                .map(
                  (item, index) => `
                    <div class="report-list-item">
                      <p class="report-list-item-title">IDP ${index + 1}</p>
                      <p class="report-list-item-text">${escapeHtml(item)}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="report-card report-card--large">
            <p class="report-card-title">맞춤 경로 상태</p>
            <p class="report-card-text">산업군 ${escapeHtml(report.roadmap.selectedIndustryLabel)} · 직무 ${escapeHtml(report.roadmap.selectedJobLabel)}</p>
            <div class="report-divider"></div>
            <p class="report-note">${escapeHtml(report.roadmap.fallbackNote)}</p>
            ${roadmapHtml}
          </div>
        </div>
        <div class="report-footer"><span class="report-page-number">PAGE 05</span></div>
      </section>
    </div>
  `;
}

export async function renderReportHtml(report: ReportModel): Promise<string> {
  const template = await loadTemplate();
  const body = renderReportBody(report);

  return template
    .replace("{{TITLE}}", escapeHtml(report.title))
    .replace("{{SUBTITLE}}", escapeHtml(report.subtitle))
    .replace("{{REPORT_CSS}}", REPORT_SHARED_CSS)
    .replace("{{BODY}}", body);
}
