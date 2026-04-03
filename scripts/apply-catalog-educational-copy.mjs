/**
 * aiToolsCatalog.json — 카드 문구를「차별점·할 일·예시」중심으로 통일, 단점 필드 비움
 * 실행: node scripts/apply-catalog-educational-copy.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "data", "kappDiagnosis", "aiToolsCatalog.json");
const patchPath = path.join(root, "data", "kappDiagnosis", "aiToolsCopyPatch.json");

const raw = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));

for (const t of raw.tools) {
  const p = patch[t.toolId];
  if (!p) {
    console.warn("No patch for", t.toolId);
    continue;
  }
  t.cardLines = p.cardLines;
  t.focusStrengths = p.focusStrengths;
  t.coachTip = p.coachTip ?? "";
  t.commonPitfall = "";
}

raw.version = "2026-Q2-gen-ai-edu-copy";
fs.writeFileSync(catalogPath, JSON.stringify(raw, null, 2) + "\n", "utf8");
console.log("Applied patch, tools:", raw.tools.length, catalogPath);
