export const REPORT_SHARED_CSS = `
:root {
  --report-blue-50: #eff6ff;
  --report-blue-100: #dbeafe;
  --report-blue-200: #bfdbfe;
  --report-blue-500: #3b82f6;
  --report-blue-600: #2563eb;
  --report-blue-700: #1d4ed8;
  --report-warm-100: #fef3c7;
  --report-warm-200: #fde68a;
  --report-warm-500: #f59e0b;
  --report-warm-600: #d97706;
  --report-warm-700: #b45309;
  --report-slate-50: #f8fafc;
  --report-slate-100: #f1f5f9;
  --report-slate-200: #e2e8f0;
  --report-slate-300: #cbd5e1;
  --report-slate-400: #94a3b8;
  --report-slate-500: #64748b;
  --report-slate-600: #475569;
  --report-slate-700: #334155;
  --report-slate-800: #1e293b;
  --report-slate-900: #0f172a;
  --report-white: #ffffff;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--report-slate-100);
  color: var(--report-slate-900);
  font-family: var(--font-noto-sans-kr, "Noto Sans KR", system-ui, sans-serif);
}

body {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.report-shell {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%);
}

.report-preview-shell {
  min-height: 100vh;
  padding: 24px 20px 40px;
  overflow-x: auto;
}

.report-preview-guard {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.report-preview-guard * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.report-toolbar {
  width: min(210mm, 100%);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);
  border: 1px solid var(--report-slate-200);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.06);
}

.report-toolbar-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--report-slate-900);
}

.report-toolbar-subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--report-slate-600);
}

.report-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-button,
.report-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.18s ease;
}

.report-button--primary,
.report-link-button--primary {
  background: linear-gradient(135deg, var(--report-blue-600), var(--report-blue-700));
  color: white;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.18);
}

.report-button--primary:hover,
.report-link-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(37, 99, 235, 0.24);
}

.report-button--ghost,
.report-link-button--ghost {
  background: white;
  color: var(--report-slate-700);
  border-color: var(--report-slate-200);
}

.report-button--ghost:hover,
.report-link-button--ghost:hover {
  border-color: var(--report-blue-200);
  color: var(--report-blue-700);
}

.report-stack {
  width: min(210mm, 100%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.report-page {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 16mm 16mm 15mm;
  overflow: hidden;
  background: var(--report-white);
  color: var(--report-slate-900);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  break-after: page;
  page-break-after: always;
}

.report-page:last-child {
  break-after: auto;
  page-break-after: auto;
}

.report-cover {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.report-cover-hero {
  margin-bottom: 18px;
}

.report-watermark {
  position: absolute;
  right: 14mm;
  bottom: 18mm;
  font-size: 42px;
  font-weight: 800;
  letter-spacing: -0.06em;
  color: var(--report-blue-600);
  opacity: 0.07;
  transform: rotate(-14deg);
  transform-origin: center;
  pointer-events: none;
  white-space: nowrap;
}

.report-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.report-kicker {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--report-blue-600);
  text-transform: uppercase;
}

.report-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.15;
  letter-spacing: -0.04em;
  color: var(--report-slate-900);
}

.report-cover-title {
  margin: 0;
  font-size: 62px;
  line-height: 0.96;
  letter-spacing: -0.08em;
  font-weight: 900;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--report-blue-700), #0f172a 55%, var(--report-blue-500));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.report-cover-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  margin-top: 12px;
  border-radius: 999px;
  background: rgba(219, 234, 254, 0.7);
  color: var(--report-blue-700);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.report-summary-layout {
  display: grid;
  grid-template-columns: 72mm minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.report-summary-side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-cover-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.report-cover-name {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: var(--report-slate-900);
}

.report-cover-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-subtitle {
  margin: 10px 0 0;
  max-width: 72ch;
  font-size: 14px;
  line-height: 1.72;
  color: var(--report-slate-700);
}

.report-meta {
  min-width: 150px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(219, 234, 254, 0.7), rgba(239, 246, 255, 0.7));
  border: 1px solid var(--report-blue-100);
}

.report-meta-label {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--report-blue-700);
}

.report-meta-value {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--report-slate-900);
}

.report-meta-note {
  margin: 6px 0 0;
  font-size: 11px;
  color: var(--report-slate-600);
}

.report-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.report-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.report-card {
  padding: 14px 16px;
  border-radius: 18px;
  background: var(--report-white);
  border: 1px solid var(--report-slate-200);
}

.report-card--large {
  padding: 18px 18px 20px;
}

.report-card--wide {
  width: min(100%, 170mm);
}

.report-chart-card--narrow {
  width: 72mm;
  padding: 14px 14px 16px;
}

.report-chart-card--section2 {
  width: 84mm;
  padding: 14px 14px 16px;
}

.report-card--soft {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 1));
}

.report-card-title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 800;
  color: var(--report-slate-800);
}

.report-card-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--report-slate-700);
}

.report-metric {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 14px;
  align-items: start;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid var(--report-slate-200);
}

.report-metric-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.report-metric-label {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--report-slate-500);
  text-transform: uppercase;
}

.report-metric-value {
  margin: 8px 0 0;
  font-size: 28px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--report-slate-900);
}

.report-metric-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--report-slate-700);
  padding-left: 14px;
  border-left: 1px solid var(--report-slate-200);
  display: flex;
  align-items: center;
  min-height: 100%;
}

.report-section {
  margin-top: 8px;
}

.report-section-header {
  margin-bottom: 14px;
}

.report-section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--report-slate-900);
}

.report-section-subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--report-slate-600);
}

.report-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--report-slate-200), transparent);
  margin: 16px 0;
}

.report-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: var(--report-blue-50);
  color: var(--report-blue-700);
  font-size: 11px;
  font-weight: 800;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.report-list-item {
  padding: 13px 14px;
  border-radius: 14px;
  border: 1px solid var(--report-slate-200);
  background: white;
}

.report-list-item-title {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--report-slate-800);
}

.report-list-item-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--report-slate-700);
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border: 1px solid var(--report-slate-200);
  border-radius: 16px;
}

.report-table thead th {
  padding: 11px 12px;
  background: var(--report-slate-50);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--report-slate-600);
  text-align: left;
  border-bottom: 1px solid var(--report-slate-200);
}

.report-table tbody td {
  padding: 11px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--report-slate-800);
  border-bottom: 1px solid var(--report-slate-200);
}

.report-table tbody tr:last-child td {
  border-bottom: 0;
}

.report-table .is-right {
  text-align: right;
}

.report-table .is-blue {
  color: var(--report-blue-700);
  font-weight: 800;
}

.report-table .is-muted {
  color: var(--report-slate-500);
}

.report-table .is-warm {
  color: var(--report-warm-700);
  font-weight: 800;
}

.report-competency-layout {
  display: grid;
  grid-template-columns: 84mm minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.report-chart-card {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--report-slate-200);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.report-radar-frame {
  width: 72mm;
  margin: 0 auto;
}

.report-chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.report-radar-svg {
  width: 100%;
  height: auto;
  display: block;
}

.report-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--report-slate-600);
  font-weight: 700;
}

.report-legend-item--benchmark {
  color: var(--report-warm-700);
}

.report-legend-swatch {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.report-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--report-slate-200);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.report-footer-text {
  margin: 0;
  font-size: 10px;
  color: var(--report-slate-500);
}

.report-page-number {
  font-size: 10px;
  font-weight: 800;
  color: var(--report-slate-400);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.report-note {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--report-slate-600);
}

.report-stack-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-centered-block {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.report-advice-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 16px;
  align-items: start;
}

.report-advice-summary {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-advice-lead {
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: var(--report-slate-800);
  font-weight: 600;
}

.report-advice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.report-advice-item {
  padding: 14px 15px;
  border-radius: 16px;
  border: 1px solid var(--report-slate-200);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.report-advice-item-title {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--report-slate-900);
}

.report-advice-item-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.72;
  color: var(--report-slate-700);
}

.report-advice-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.report-list-item--action {
  padding: 15px 15px 16px;
}

.report-priority-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 4px 9px;
  margin-right: 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.report-priority-chip--high {
  background: #fee2e2;
  color: #b91c1c;
}

.report-priority-chip--medium {
  background: var(--report-warm-100);
  color: var(--report-warm-700);
}

.report-priority-chip--low {
  background: var(--report-slate-100);
  color: var(--report-slate-600);
}

.report-cover-hero .report-kicker {
  font-size: 12px;
}

@media print {
  body {
    background: white;
  }

  .report-preview-shell {
    padding: 0;
  }

  .report-toolbar {
    display: none;
  }

  .report-stack {
    width: 100%;
    gap: 0;
  }

  .report-page {
    box-shadow: none;
    border-radius: 0;
    border: 0;
    margin: 0;
  }
}
`;
