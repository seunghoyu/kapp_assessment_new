/**
 * public/kapp/ai-tools-logos 에서 동일 베이스명의 .webp가 있을 때만
 * .png .jpg .jpeg .svg 원본을 삭제합니다.
 * 실행: node scripts/delete-ai-logo-sources-if-webp.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../Web/public/kapp/ai-tools-logos");

const exts = [".png", ".jpg", ".jpeg", ".svg"];

let removed = 0;
for (const name of fs.readdirSync(dir)) {
  const ext = path.extname(name).toLowerCase();
  if (!exts.includes(ext)) continue;
  const base = path.join(dir, name.slice(0, -ext.length));
  const webp = `${base}.webp`;
  if (!fs.existsSync(webp)) continue;
  fs.unlinkSync(path.join(dir, name));
  removed++;
  console.log("removed", name);
}
console.log(`done: ${removed} file(s) removed`);
