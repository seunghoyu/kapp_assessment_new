/**
 * docs 폴더 내 모든 .md 파일을 나열해 docs/index.html 의 문서 목록을 자동 갱신합니다.
 * 사용: 프로젝트 루트에서 node scripts/generate-docs-index.js (또는 npm run docs)
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs');
const indexPath = path.join(docsDir, 'index.html');

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

const listItems = mdFiles
  .map((f) => `<li><a href="#" data-file="${f}">${displayName(f)}</a></li>`)
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
console.log('docs/index.html 문서 목록 업데이트 완료. (' + mdFiles.length + '개)');
