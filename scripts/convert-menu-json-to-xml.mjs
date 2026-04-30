import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const inPath = path.join(root, "menu-structure.planning.json");
const outPath = path.join(root, "menu-structure.planning.xml");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function indent(n) {
  return "  ".repeat(n);
}

function menuItemXml(item, level) {
  const lines = [];
  lines.push(`${indent(level)}<메뉴>`);
  lines.push(`${indent(level + 1)}<메뉴명>${esc(item["메뉴명"] ?? "")}</메뉴명>`);
  lines.push(`${indent(level + 1)}<경로>${esc(item["경로"] ?? "")}</경로>`);
  lines.push(`${indent(level + 1)}<depth>${esc(item["depth"] ?? "")}</depth>`);
  lines.push(`${indent(level + 1)}<children>`);
  const children = Array.isArray(item.children) ? item.children : [];
  for (const c of children) lines.push(menuItemXml(c, level + 2));
  lines.push(`${indent(level + 1)}</children>`);
  lines.push(`${indent(level)}</메뉴>`);
  return lines.join("\n");
}

const raw = fs.readFileSync(inPath, "utf8");
const json = JSON.parse(raw);
if (!Array.isArray(json)) throw new Error("Root JSON must be an array.");

const parts = [];
parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
parts.push(`<메뉴구조>`);
for (const item of json) parts.push(menuItemXml(item, 1));
parts.push(`</메뉴구조>`);
parts.push("");

fs.writeFileSync(outPath, parts.join("\n"), "utf8");
console.log("Wrote", outPath);
