/**
 * public/kapp/ai-tools-logos/README.md 상단 안내 + 도구별 파일명 테이블을
 * data/kappDiagnosis/aiToolsCatalog.json 기준으로 다시 씁니다.
 * 실행: node scripts/gen-logo-readme-table.cjs
 */
const fs = require("fs");
const path = require("path");
const j = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/kappDiagnosis/aiToolsCatalog.json"), "utf8")
);

let table = "| 표시 이름 | toolId | 이 폴더에 넣을 파일명 |\n| --- | --- | --- |\n";
for (const t of j.tools) {
  const fn = t.logoPublicPath
    ? t.logoPublicPath.split("/").pop()
    : `${t.toolId}.webp · ${t.toolId}.png … (동일 이름)`;
  const name = String(t.displayName).replace(/\|/g, "\\|");
  table += `| ${name} | \`${t.toolId}\` | ${t.logoPublicPath ? `\`${fn}\`` : fn} |\n`;
}

const readme = `# AI 도구 로고 (수기 배치)

진단 **AI 활용 탐색** 카드에 표시할 로고 파일을 이 폴더에 둡니다.

## 규칙

- **파일명:** \`toolId\`와 같은 이름 + 확장자. **WebP·PNG·SVG·JPG** 모두 사용 가능합니다. 화면에서는 같은 베이스 이름이면 **webp → png → svg → jpg** 순으로 자동 시도합니다. \`logoPublicPath\`가 비어 있으면 \`/kapp/ai-tools-logos/{toolId}.webp\`부터 찾습니다.
- **JSON:** \`data/kappDiagnosis/aiToolsCatalog.json\`의 \`logoPublicPath\` — 예: \`/kapp/ai-tools-logos/chatgpt_team.webp\` 또는 \`.png\`
- **권장:** 정사각형, 투명 배경, 가로세로 **최소 128px** (UI에서는 약 48~56px)
- 저작권·상표는 각 벤더 정책을 따릅니다. 파일이 없으면 카드에는 **이니셜 플레이스홀더**가 나옵니다.

## 도구별로 넣을 파일명 (catalog 기준)

${table}
---
*도구가 추가·변경되면 \`node scripts/gen-logo-readme-table.cjs\`로 이 README를 다시 생성할 수 있습니다.*
`;

const out = path.join(__dirname, "../public/kapp/ai-tools-logos/README.md");
fs.writeFileSync(out, readme, "utf8");
console.log("Wrote", out, "(" + j.tools.length + " rows)");
