/**
 * aiToolsCatalog.json — 생성형 AI + Zapier/n8n만 유지
 * 실행: node scripts/filter-gen-ai-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, "..", "data", "kappDiagnosis", "aiToolsCatalog.json");

const KEEP = new Set([
  "chatgpt_team",
  "copilot_github",
  "cursor",
  "perplexity",
  "notion_ai",
  "gamma",
  "google_gemini",
  "anthropic_claude",
  "aws_bedrock",
  "mistral_ai",
  "aleph_alpha",
  "sap_generative_ai",
  "cohere_command",
  "ai21_studio",
  "naver_clova_x",
  "wrtn_ai",
  "upstage_solar",
  "stability_ai",
  "synthesia",
  "canva_magic",
  "sarvam_ai",
  "g42_jais",
  "leonardo_ai",
  "xai_grok",
  "zeta_ai_kr",
  "crack_ai",
  "lg_exaone",
  "liner_ai",
  "microsoft_copilot",
  "zapier",
  "n8n",
  "internal_llm_placeholder",
]);

const raw = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const before = raw.tools.length;
raw.tools = raw.tools.filter((t) => KEEP.has(t.toolId));
raw.version = "2026-Q2-gen-ai-only";
fs.writeFileSync(catalogPath, JSON.stringify(raw, null, 2) + "\n", "utf8");
console.log("tools:", before, "->", raw.tools.length, "wrote", catalogPath);
