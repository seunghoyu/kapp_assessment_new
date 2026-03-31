const fs = require("fs");
const path = require("path");
const copy = require("./easy-copy-data.cjs");

const catalogPath = path.join(__dirname, "../data/kappDiagnosis/aiToolsCatalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
let n = 0;
for (const t of catalog.tools) {
  const c = copy[t.toolId];
  if (c) {
    t.cardLines = c.cardLines;
    t.coachTip = c.coachTip;
    t.commonPitfall = c.commonPitfall;
    n++;
  }
}
catalog.version = "2026-Q2-simple";
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log("updated tools:", n, "/", catalog.tools.length);
