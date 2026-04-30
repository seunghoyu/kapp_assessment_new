import type { ReportCompetencyRow, ReportModel } from "@/lib/report/report-data";

type Props = {
  report: ReportModel;
};

type RadarChartProps = {
  labels: string[];
  myScores: number[];
  benchmarkScores: number[];
  fullMark: number;
};

const CHART_SIZE = 420;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = 132;
const LABEL_RADIUS = CHART_RADIUS + 28;

function formatScore(value: number): string {
  return `${Math.round(value)}점`;
}

function pointsToString(points: { x: number; y: number }[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function polarToPoint(angleDeg: number, radius: number) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CHART_CENTER + radius * Math.cos(angle),
    y: CHART_CENTER + radius * Math.sin(angle),
  };
}

function buildPolygon(values: number[], maxValue: number) {
  return values.map((value, index) => {
    const ratio = Math.max(0, Math.min(1, value / maxValue));
    const angleStep = 360 / values.length;
    const point = polarToPoint(angleStep * index, CHART_RADIUS * ratio);
    return point;
  });
}

function buildGridRings(axisCount: number, levels = 4) {
  return Array.from({ length: levels }, (_, ringIndex) => {
    const ratio = (ringIndex + 1) / levels;
    const angleStep = 360 / axisCount;
    const points: { x: number; y: number }[] = [];
    for (let axisIndex = 0; axisIndex < axisCount; axisIndex += 1) {
      points.push(polarToPoint(angleStep * axisIndex, CHART_RADIUS * ratio));
    }
    return points;
  });
}

function RadarComparisonChart({ labels, myScores, benchmarkScores, fullMark }: RadarChartProps) {
  const userPolygon = buildPolygon(myScores, fullMark);
  const benchmarkPolygon = buildPolygon(benchmarkScores, fullMark);
  const rings = buildGridRings(labels.length);

  return (
    <div className="report-radar-frame">
      <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} className="report-radar-svg" role="img" aria-label="역량 비교 레이더 차트">
        <circle cx={CHART_CENTER} cy={CHART_CENTER} r={CHART_RADIUS} fill="none" stroke="#cbd5e1" strokeDasharray="4 6" />
        {rings.map((ring, ringIndex) => (
          <polygon
            key={`ring-${ringIndex}`}
            points={pointsToString(ring)}
            fill="none"
            stroke={ringIndex === rings.length - 1 ? "#cbd5e1" : "#e2e8f0"}
            strokeWidth={1}
          />
        ))}
        {labels.map((label, index) => {
          const angleStep = 360 / labels.length;
          const axisPoint = polarToPoint(angleStep * index, CHART_RADIUS);
          const labelPoint = polarToPoint(angleStep * index, LABEL_RADIUS);
          const isLeft = labelPoint.x < CHART_CENTER - 6;
          const isRight = labelPoint.x > CHART_CENTER + 6;
          const textAnchor = isLeft ? "end" : isRight ? "start" : "middle";
          return (
            <g key={label}>
              <line x1={CHART_CENTER} y1={CHART_CENTER} x2={axisPoint.x} y2={axisPoint.y} stroke="#e2e8f0" />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize="12"
                fill="#475569"
                fontWeight={700}
              >
                {label}
              </text>
            </g>
          );
        })}

        <polygon
          points={pointsToString(benchmarkPolygon)}
          fill="rgba(217, 119, 6, 0.10)"
          stroke="#d97706"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
        <polygon
          points={pointsToString(userPolygon)}
          fill="rgba(37, 99, 235, 0.18)"
          stroke="#2563eb"
          strokeWidth={2.5}
        />
        {benchmarkPolygon.map((point, index) => (
          <circle key={`benchmark-${index}`} cx={point.x} cy={point.y} r={3.5} fill="#d97706" />
        ))}
        {userPolygon.map((point, index) => (
          <circle key={`user-${index}`} cx={point.x} cy={point.y} r={4} fill="#2563eb" />
        ))}
      </svg>

      <div className="report-chart-legend">
        <span className="report-legend-item">
          <span className="report-legend-swatch" style={{ background: "#2563eb" }} />
          나의 점수
        </span>
        <span className="report-legend-item report-legend-item--benchmark">
          <span className="report-legend-swatch" style={{ background: "#d97706" }} />
          직급 평균
        </span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, desc }: { label: string; value: string; desc: string }) {
  return (
    <div className="report-metric">
      <div className="report-metric-main">
        <p className="report-metric-label">{label}</p>
        <p className="report-metric-value">{value}</p>
      </div>
      <p className="report-metric-desc">{desc}</p>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="report-section-header">
      <h2 className="report-section-title">{title}</h2>
      <p className="report-section-subtitle">{subtitle}</p>
    </div>
  );
}

function reportPageNumber(pageIndex: number) {
  return String(pageIndex).padStart(2, "0");
}

function SummaryBullet({ title, text }: { title: string; text: string }) {
  return (
    <div className="report-list-item">
      <p className="report-list-item-title">{title}</p>
      <p className="report-list-item-text">{text}</p>
    </div>
  );
}

function CompetencyTable({ rows }: { rows: ReportCompetencyRow[] }) {
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th>역량</th>
          <th className="is-right">본인</th>
          <th className="is-right">직급 평균</th>
          <th className="is-right">차이</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>
              <strong>{row.short}</strong>
              <span className="report-note" style={{ display: "block" }}>
                {row.label}
              </span>
            </td>
            <td className="is-right is-blue">{formatScore(row.myScore)}</td>
            <td className="is-right is-warm">{formatScore(row.benchmarkScore)}</td>
            <td className="is-right is-blue">{row.gap >= 0 ? `+${row.gap}` : row.gap}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
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

export function ReportDocument({ report }: Props) {
  return (
    <div className="report-stack">
      <section className="report-page report-cover">
        <div className="report-watermark">{report.user.name}</div>

        <div className="report-cover-hero">
          <p className="report-kicker">COMPREHENSIVE REPORT</p>
          <h1 className="report-cover-title">{report.title}</h1>
          <div className="report-cover-badge">{report.subtitle}</div>
        </div>

        <div className="report-cover-stack">
          <div className="report-card report-card--large">
            <p className="report-card-title">작성자</p>
            <p className="report-cover-name">{report.user.name}</p>
            <p className="report-card-text">
              산업군 {report.user.industryLabel} · 직무 {report.user.jobLabel}
            </p>
          </div>

          <div className="report-card report-card--large">
            <p className="report-card-title">현재 위치</p>
            <p className="report-card-text">{report.cover.summaryText}</p>
            <div className="report-divider" />
            <div className="report-cover-metrics">
              <MetricCard
                label="종합 점수"
                value={String(report.cover.overallScore)}
                desc="4개 역량 평균을 기준으로 정리한 대표 점수입니다."
              />
              <MetricCard
                label="현재 수준"
                value={report.cover.currentLevel}
                desc="동일 집단 내 현재 위치를 먼저 확인합니다."
              />
              <MetricCard
                label="상위권 해석"
                value={report.cover.percentileRank}
                desc="상위권 진입 가능성을 빠르게 읽을 수 있습니다."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="report-page">
        <div className="report-watermark">{report.user.name}</div>
        <SectionHeader
          title="1. 전체 요약"
          subtitle="임직원이 처음 결과를 볼 때 가장 먼저 이해해야 하는 핵심 해석만 압축했습니다."
        />

        <div className="report-summary-layout">
          <div className="report-chart-card report-chart-card--narrow">
            <RadarComparisonChart
              labels={report.competency.radar.labels}
              myScores={report.competency.radar.myScores}
              benchmarkScores={report.competency.radar.benchmarkScores}
              fullMark={report.competency.radar.fullMark}
            />
          </div>

          <div className="report-summary-side">
            <MetricCard
              label="종합 점수"
              value={String(report.summary.overallScore)}
              desc={`직급 평균 ${report.summary.benchmarkAverage}점과 비교했을 때 ${report.summary.scoreGap >= 0 ? "+" : ""}${report.summary.scoreGap}점 차이입니다.`}
            />
            <MetricCard
              label="현재 수준"
              value={report.summary.currentLevel}
              desc="지식·적용·성과·생산성 4개 영역의 균형을 함께 읽어야 합니다."
            />
            <MetricCard
              label="상위권 해석"
              value={report.summary.percentileRank}
              desc="상위권 진입 가능성을 한 문장으로 정리한 지표입니다."
            />
            <div className="report-card report-card--large">
              <p className="report-card-title">핵심 해석</p>
              <div className="report-stack-list">
                <SummaryBullet title="강점" text={`${report.summary.strongest.short} 영역이 상대적으로 가장 높습니다. ${formatScore(report.summary.strongest.myScore)}로 ${formatScore(report.summary.strongest.benchmarkScore)}인 직급 평균을 상회합니다.`} />
                <SummaryBullet title="보완" text={`${report.summary.weakest.short} 영역은 가장 먼저 보완할 영역입니다. 현재 ${formatScore(report.summary.weakest.myScore)} 수준이므로 실전 적용 경험을 보강하면 균형이 좋아집니다.`} />
                <SummaryBullet title="핵심 기회" text={report.summary.opportunitySummary} />
              </div>
            </div>
          </div>
        </div>

        <div className="report-footer">
          <span className="report-page-number">PAGE {reportPageNumber(2)}</span>
        </div>
      </section>

      <section className="report-page">
        <div className="report-watermark">{report.user.name}</div>
        <SectionHeader
          title="2. 핵심 역량 구조"
          subtitle="레이더 차트와 테이블을 함께 배치해 역량의 균형과 세부 점수를 동시에 볼 수 있도록 구성했습니다."
        />

        <div className="report-competency-layout">
          <div className="report-chart-card report-chart-card--section2">
            <RadarComparisonChart
              labels={report.competency.radar.labels}
              myScores={report.competency.radar.myScores}
              benchmarkScores={report.competency.radar.benchmarkScores}
              fullMark={report.competency.radar.fullMark}
            />
          </div>

          <div className="report-card report-card--large report-card--wide">
            <p className="report-card-title">역량 개요</p>
            <CompetencyTable rows={report.competency.rows} />
          </div>
        </div>

        <div className="report-footer">
          <span className="report-page-number">PAGE {reportPageNumber(3)}</span>
        </div>
      </section>

      <section className="report-page">
        <div className="report-watermark">{report.user.name}</div>
        <SectionHeader
          title="3. 현재 상태 해석"
          subtitle="점수를 어떤 관점으로 읽어야 하는지, 그리고 무엇을 우선적으로 개선해야 하는지 정리했습니다."
        />

        <div className="report-grid-2">
          <div className="report-card report-card--large">
            <p className="report-card-title">현재 포지션</p>
            <p className="report-title" style={{ fontSize: "22px" }}>
              {report.market.currentLevel}
            </p>
            <div className="report-divider" />
            <p className="report-card-text">{report.market.currentLevelDesc}</p>
            <div className="report-divider" />
            <div className="report-grid-2">
              <div>
                <p className="report-metric-label">상위권 지표</p>
                <p className="report-metric-value" style={{ fontSize: "20px" }}>
                  {report.market.percentile}
                </p>
              </div>
              <div>
                <p className="report-metric-label">기회 요약</p>
                <p className="report-metric-value" style={{ fontSize: "18px" }}>
                  {report.market.opportunitySummary}
                </p>
              </div>
            </div>
            <div className="report-divider" />
            <div className="report-grid-3">
              <div>
                <p className="report-metric-label">강점</p>
                <p className="report-metric-value" style={{ fontSize: "20px" }}>
                  {report.market.strengthCount}개
                </p>
              </div>
              <div>
                <p className="report-metric-label">보완</p>
                <p className="report-metric-value" style={{ fontSize: "20px" }}>
                  {report.market.improvementCount}개
                </p>
              </div>
              <div>
                <p className="report-metric-label">평균</p>
                <p className="report-metric-value" style={{ fontSize: "20px" }}>
                  {report.market.averageCount}개
                </p>
              </div>
            </div>
          </div>

          <div className="report-card report-card--large">
            <p className="report-card-title">벤치마크 비교</p>
            <table className="report-table">
              <thead>
                <tr>
                  <th>역량</th>
                  <th className="is-right">업계 상위 10%</th>
                  <th className="is-right">본인</th>
                  <th className="is-right">차이</th>
                </tr>
              </thead>
              <tbody>
                {report.market.industryBenchmarkRows.map((row) => (
                  <tr key={row.label}>
                    <td><strong>{row.label}</strong></td>
                    <td className="is-right is-muted">{formatScore(row.benchmarkScore)}</td>
                    <td className="is-right is-blue">{formatScore(row.myScore)}</td>
                    <td className="is-right is-blue">{row.gap >= 0 ? `+${row.gap}` : row.gap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="report-divider" />

        <div className="report-card report-card--large report-advice-panel">
          <div className="report-advice-summary">
            <p className="report-card-title">AI 조언</p>
            <p className="report-advice-lead">
              현재는 강점이 분명하지만, 실제 업무 성과를 더 올리려면 약한 역량을 먼저 끌어올리는 편이 가장 빠릅니다.
            </p>
            <div className="report-advice-list">
              {buildAiAdvice(report).map((item, index) => (
                <div className="report-advice-item" key={`${item.title}-${index}`}>
                  <p className="report-advice-item-title">{index + 1}. {item.title}</p>
                  <p className="report-advice-item-text">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="report-advice-actions">
            <p className="report-card-title">우선 실행 액션</p>
            <div className="report-list">
              {report.market.actions.map((action, index) => (
                <div className="report-list-item report-list-item--action" key={`${action.title}-${index}`}>
                  <p className="report-list-item-title">
                    <span
                      className={`report-priority-chip ${
                        action.priority === "high"
                          ? "report-priority-chip--high"
                          : action.priority === "medium"
                            ? "report-priority-chip--medium"
                            : "report-priority-chip--low"
                      }`}
                    >
                      {action.priority === "high" ? "우선" : action.priority === "medium" ? "중간" : "보조"}
                    </span>
                    {action.icon} {action.title}
                  </p>
                  <p className="report-list-item-text">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="report-footer">
          <span className="report-page-number">PAGE {reportPageNumber(4)}</span>
        </div>
      </section>

      <section className="report-page">
        <div className="report-watermark">{report.user.name}</div>
        <SectionHeader
          title="4. 성장 방향 / 로드맵"
          subtitle="대시보드의 성장 로드맵 탭을 자연스럽게 이어 붙여, 다음 행동이 무엇인지 한 눈에 보이도록 구성했습니다."
        />

        <div className="report-grid-2">
          <div className="report-card report-card--large">
            <p className="report-card-title">개인 개발 계획</p>
            <p className="report-card-text">{report.roadmap.idpDescription}</p>
            <div className="report-divider" />
            <div className="report-list">
              {report.roadmap.idpItems.map((item, index) => (
                <div className="report-list-item" key={`${item}-${index}`}>
                  <p className="report-list-item-title">IDP {index + 1}</p>
                  <p className="report-list-item-text">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="report-card report-card--large">
            <p className="report-card-title">맞춤 경로 상태</p>
            <p className="report-card-text">
              산업군 {report.roadmap.selectedIndustryLabel} · 직무 {report.roadmap.selectedJobLabel}
            </p>
            <div className="report-divider" />
            <p className="report-note">{report.roadmap.fallbackNote}</p>
            {report.roadmap.careerPath ? (
              <div style={{ marginTop: 14 }}>
                <div className="report-list">
                  <div className="report-list-item">
                    <p className="report-list-item-title">현재</p>
                    <p className="report-list-item-text">{report.roadmap.careerPath.current.role}</p>
                  </div>
                  <div className="report-list-item">
                    <p className="report-list-item-title">{report.roadmap.careerPath.milestone1.year}</p>
                    <p className="report-list-item-text">{report.roadmap.careerPath.milestone1.role}</p>
                  </div>
                  <div className="report-list-item">
                    <p className="report-list-item-title">{report.roadmap.careerPath.milestone2.year}</p>
                    <p className="report-list-item-text">{report.roadmap.careerPath.milestone2.role}</p>
                  </div>
                </div>
                <div className="report-divider" />
                <p className="report-card-text">추천 학습 경로</p>
                <div className="report-list" style={{ marginTop: 10 }}>
                  {report.roadmap.learningPath.map((item, index) => (
                    <div className="report-list-item" key={`${item.title}-${index}`}>
                      <p className="report-list-item-title">{index + 1}. {item.title}</p>
                      <p className="report-list-item-text">기간 {item.duration} · 우선순위 {item.priority}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 14 }}>
                <div className="report-chip">공통 로드맵 우선 적용</div>
                <p className="report-card-text" style={{ marginTop: 12 }}>
                  현재 상태에서는 산업군 기반 경로보다 공통 성장 과제를 먼저 실행하는 편이 더 자연스럽습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="report-footer">
          <span className="report-page-number">PAGE {reportPageNumber(5)}</span>
        </div>
      </section>
    </div>
  );
}
