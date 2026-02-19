/**
 * public/docs 폴더 내 모든 .md 파일을 나열해 public/docs/index.html 의 문서 목록을 자동 갱신합니다.
 * 목록 표시는 한글 제목으로 합니다. (앱에서 /docs/index.html 로 접근)
 * 사용: 프로젝트 루트에서 node scripts/generate-docs-index.js (또는 npm run docs)
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'public', 'docs');
const indexPath = path.join(docsDir, 'index.html');

/** 파일명 → 한글 표시 제목 (더미데이터 기준). 없으면 파일명 기반 영문 표시 */
const titleKo = {
  '01_project_brief_product_new.md': '01 프로젝트 브리프 (제품·기획)',
  '02_project_brief_frontend_new.md': '02 프로젝트 브리프 (프론트엔드)',
  '03_project_brief_backend_new.md': '03 프로젝트 브리프 (백엔드)',
  '04_project_brief_marketer_new.md': '04 프로젝트 브리프 (마케터)',
  '05_project_brief_data_analyst_new.md': '05 프로젝트 브리프 (데이터 분석가)',
  '06_implementation_status_and_guide_new.md': '06 구현 현황 및 가이드',
  '07_data_reference_integration_new.md': '07 데이터 참조 및 연동',
  '08_employee_management_and_kapp_self_assessment_new.md': '08 임직원 관리 및 KAPP 자가진단',
  'KAPP_DIAGNOSIS_DATA_REFERENCE.md': 'KAPP 진단 데이터 안내',
  'KAPP_DIAGNOSIS_QUESTION_LOGIC.md': 'KAPP 진단 문항 구성 로직',
  'MIGRATION_PLAN_ORIGIN_TO_NEW.md': '마이그레이션 계획 (Origin → New)',
  '09_competency_risk_integration_plan.md': '09 역량·리스크 통합 진행방향',
  '10_TF_meeting_notes.md': '10 TF팀 회의록',
  '11_development_deployment_history.md': '⭐ 개발·배포 업데이트 히스토리',
  '12_AI_competency_5layer_data.md': '12 AI 역량진단 5레이어 데이터 구조 (요약)',
  '13_consumer_entry_redesign_draft.md': '13 소비자 진입점 재구성 초안',
};
/** 사이드바 최상단 문서 목록에 배치 (드롭다운 밖), 나머지는 '관리자 LMS' 드롭다운 */
const TOP_LEVEL_FILES = [
  '11_development_deployment_history.md',
  '12_AI_competency_5layer_data.md',
];

if (!fs.existsSync(docsDir) || !fs.existsSync(indexPath)) {
  console.error('public/docs 폴더 또는 public/docs/index.html 이 없습니다. 프로젝트 루트에서 실행하세요.');
  process.exit(1);
}

const mdFiles = fs.readdirSync(docsDir)
  .filter((f) => f.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (mdFiles.length === 0) {
  console.warn('public/docs 폴더에 .md 파일이 없습니다.');
  process.exit(0);
}

function displayName(filename) {
  return filename.replace(/\.md$/, '').replace(/_/g, ' ');
}

function displayNameKorean(filename) {
  return titleKo[filename] != null ? titleKo[filename] : displayName(filename);
}

const lmsFiles = mdFiles.filter((f) => !TOP_LEVEL_FILES.includes(f));
const DIAGRAM_FILE = 'app-structure-diagram.html';
const hasDiagram = fs.existsSync(path.join(docsDir, DIAGRAM_FILE));
const diagramLink = hasDiagram
  ? `<li><a href="#" data-file="${DIAGRAM_FILE}">📐 앱 구조 모식도</a></li>`
  : '';
const topLevelListItems = TOP_LEVEL_FILES.filter((f) => mdFiles.includes(f))
  .map((f) => `<li><a href="#" data-file="${f}">${displayNameKorean(f)}</a></li>`)
  .join('\n        ');
const lmsListItems = lmsFiles
  .map((f) => `<li><a href="#" data-file="${f}">${displayNameKorean(f)}</a></li>`)
  .join('\n          ');
const listItems =
  `${diagramLink}
        ${topLevelListItems}
        <li class="sidebar-group">
          <button type="button" class="sidebar-group-btn" aria-expanded="false">관리자 LMS ▾</button>
          <ul class="sidebar-group-list">
${lmsListItems.split('\n').map((line) => '          ' + line).join('\n')}
          </ul>
        </li>`;

const docsArrayStr = [
  ...(hasDiagram ? [`'${DIAGRAM_FILE}'`] : []),
  ...TOP_LEVEL_FILES.filter((f) => mdFiles.includes(f)).map((f) => `'${f}'`),
  ...lmsFiles.map((f) => `'${f}'`),
].join(', ');

/** 각 .md 파일의 수정일 (YYYY-MM-DD) — 문서 상단 표시용 */
const docDates = {};
mdFiles.forEach((f) => {
  const stat = fs.statSync(path.join(docsDir, f));
  const d = stat.mtime;
  docDates[f] =
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0');
});

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(
  /<ul>\s*[\s\S]*?<\/ul>/,
  `<ul>\n        ${listItems}\n      </ul>`
);
html = html.replace(
  /var docs = \[[^\]]*\];/,
  `var docs = [ ${docsArrayStr} ];`
);
html = html.replace(
  /var docDates = \{\};/,
  'var docDates = ' + JSON.stringify(docDates) + ';'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('public/docs/index.html 문서 목록 업데이트 완료. (' + mdFiles.length + '개, 한글 제목 적용)');
