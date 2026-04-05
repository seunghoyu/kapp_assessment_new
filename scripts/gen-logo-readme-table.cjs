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
  const fn =
    t.toolId === "internal_llm_placeholder"
      ? "— (Twemoji 🔒, `AiExplorationFlow`)"
      : t.logoPublicPath
        ? t.logoPublicPath.split("/").pop()
        : `${t.toolId}.webp`;
  const name = String(t.displayName).replace(/\|/g, "\\|");
  table += `| ${name} | \`${t.toolId}\` | \`${fn}\` |\n`;
}

const readme = `# AI 도구 로고 (수기 배치)

진단 **AI 활용 탐색** 카드에 표시할 로고 파일을 이 폴더에 둡니다.

## 규칙

- **파일명:** \`toolId.webp\` (화면은 **WebP만** 로드). \`logoPublicPath\`가 비어 있으면 \`/kapp/ai-tools-logos/{toolId}.webp\`를 씁니다. 예외: \`internal_llm_placeholder\`는 WebP 없이 **Twemoji 🔒**(보안) 아이콘을 씁니다.
- **JSON:** \`data/kappDiagnosis/aiToolsCatalog.json\`의 \`logoPublicPath\` — 예: \`/kapp/ai-tools-logos/chatgpt_team.webp\`
- **권장:** 정사각형, 투명 배경, 가로세로 **최소 128px** (UI에서는 그리드 약 48px·모달 약 64px)
- 저작권·상표는 각 벤더 정책을 따릅니다. 파일이 없으면 카드에는 **이니셜 플레이스홀더**가 나옵니다.

## 도구별로 넣을 파일명 (catalog 기준)

${table}
---
*도구가 추가·변경되면 \`node scripts/gen-logo-readme-table.cjs\`로 이 README를 다시 생성할 수 있습니다.*
`;

const out = path.join(__dirname, "../public/kapp/ai-tools-logos/README.md");
fs.writeFileSync(out, readme, "utf8");
console.log("Wrote", out, "(" + j.tools.length + " rows)");
