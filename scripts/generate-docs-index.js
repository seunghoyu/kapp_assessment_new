/**
 * docs 폴더 내 모든 .md 파일을 나열해 docs/index.html 의 문서 목록을 자동 갱신합니다.
 * 목록 표시는 한글 제목으로 하며, public/docs 로 복사해 앱에서 /docs/ 로 접근 가능하게 합니다.
 * 사용: 프로젝트 루트에서 node scripts/generate-docs-index.js (또는 npm run docs)
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs');
const indexPath = path.join(docsDir, 'index.html');
const publicDocsDir = path.join(process.cwd(), 'public', 'docs');

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
};

if (!fs.existsSync(docsDir) || !fs.existsSync(indexPath)) {
  console.error('docs 폴더 또는 docs/index.html 이 없습니다. 프로젝트 루트에서 실행하세요.');
  process.exit(1);
}

const mdFiles = fs.readdirSync(docsDir)
  .filter((f) => f.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (mdFiles.length === 0) {
  console.warn('docs 폴더에 .md 파일이 없습니다.');
  process.exit(0);
}

function displayName(filename) {
  return filename.replace(/\.md$/, '').replace(/_/g, ' ');
}

function displayNameKorean(filename) {
  return titleKo[filename] != null ? titleKo[filename] : displayName(filename);
}

const listItems = mdFiles
  .map((f) => `<li><a href="#" data-file="${f}">${displayNameKorean(f)}</a></li>`)
  .join('\n        ');

const docsArrayStr = mdFiles.map((f) => `'${f}'`).join(', ');

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(
  /<ul>\s*[\s\S]*?<\/ul>/,
  `<ul>\n        ${listItems}\n      </ul>`
);
html = html.replace(
  /var docs = \[[^\]]*\];/,
  `var docs = [ ${docsArrayStr} ];`
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('docs/index.html 문서 목록 업데이트 완료. (' + mdFiles.length + '개, 한글 제목 적용)');

// public/docs 로 복사 (Next 앱에서 /docs/ 로 접근 가능)
if (fs.existsSync(publicDocsDir)) {
  fs.rmSync(publicDocsDir, { recursive: true });
}
fs.cpSync(docsDir, publicDocsDir, { recursive: true });
console.log('public/docs 복사 완료. (앱 실행 시 /docs/ 에서 문서 열람 가능)');
