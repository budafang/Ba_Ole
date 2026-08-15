import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server renders the rainforest journal shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>雨林行程紀錄 · Swak Ali × Ba Ole<\/title>/);
  assert.match(html, /行程可修訂/);
  assert.match(html, /每日行程/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Starter Project/);
});

test("source keeps itinerary, expense, field-note, and PWA workflows", async () => {
  const [page, data, layout, styles, manifest, serviceWorker] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/trip.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
  ]);

  assert.match(page, /記帳/);
  assert.match(page, /田野記錄/);
  assert.match(page, /匯出 CSV/);
  assert.match(page, /localStorage/);
  assert.match(page, /itemId/);
  assert.match(page, /expense-link/);
  assert.match(page, /ExpenseEditor/);
  assert.match(page, /FieldNoteEditor/);
  assert.match(page, /onFieldNote/);
  assert.match(page, /itemTitle/);
  assert.match(page, /swak-ali-field-notes/);
  assert.match(page, /ItemInfo/);
  assert.match(page, /個人裝備/);
  assert.match(page, /function GearView/);
  assert.match(page, /label="田調"/);
  assert.match(page, /label="裝備"/);
  assert.match(page, /gear-check-control/);
  assert.match(page, /gear-delete/);
  assert.match(page, /swak-ali-gear/);
  assert.match(page, /label="More"/);
  assert.doesNotMatch(page, /行前提醒與重要資料|trip-briefing|function GearMenu/);
  assert.doesNotMatch(page, /FIELD ITINERARY|swak-ali-itinerary\.json/);
  assert.match(page, /data-schedule-id/);
  assert.match(page, /onPointerMove/);
  assert.match(page, /event\.stopPropagation\(\); startPress/);
  assert.match(page, /baseItem\.info\) mergedItem\.info/);
  assert.match(data, /約 3 公里木棧道/);
  assert.match(data, /Batu Bungan 本南族村落/);
  assert.match(data, /Bat Exodus/);
  assert.match(data, /離洞口約 100 公尺處的蝙蝠觀測台/);
  assert.match(data, /超過 300 萬隻皺唇蝙蝠/);
  assert.match(page, /day-summary-link/);
  assert.doesNotMatch(page, /check-button|標記完成/);
  assert.match(page, /公費總計/);
  assert.match(page, /自費總計/);
  assert.match(page, /conic-gradient/);
  assert.match(data, /Swak Ali/);
  assert.match(data, /Ba Ole/);
  assert.match(data, /AK1511/);
  assert.match(data, /MH3251/);
  assert.match(data, /AK1510/);
  assert.match(data, /mulu-national-park-map\.jpg/);
  assert.match(data, /08:30/);
  assert.match(data, /09:00/);
  assert.match(data, /14:15–18:30/);
  assert.match(data, /09:00–12:30/);
  assert.match(data, /locked/);
  assert.match(data, /personalGear/);
  assert.match(data, /Clearwater Cave/);
  assert.match(data, /melissalin510\.pixnet\.net\/blog\/posts\/15347003365/);
  assert.match(data, /cxeltonlee\.pixnet\.net\/blog\/posts\/12222281094/);
  assert.match(data, /rHyBRh0og0A/);
  assert.doesNotMatch(data, /PPT 標示|PPT 標示 TBD|住宿資料依 PPT/);
  assert.match(layout, /themeColor/);
  assert.match(styles, /touch-action: none/);
  assert.match(styles, /input, select, textarea \{ font-size: 16px; \}/);
  assert.match(manifest, /standalone/);
  assert.match(page, /updateViaCache: "none"/);
  assert.match(serviceWorker, /rainforest-journal-v3/);
  assert.match(serviceWorker, /networkFirst/);
});
