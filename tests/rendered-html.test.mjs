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
  assert.match(html, /把變動，留下來。/);
  assert.match(html, /每日行程/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Starter Project/);
});

test("source keeps itinerary, expense, field-note, and PWA workflows", async () => {
  const [page, data, layout, manifest, serviceWorker] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/trip.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
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
  assert.match(page, /固定資訊/);
  assert.match(data, /Swak Ali/);
  assert.match(data, /Ba Ole/);
  assert.match(data, /AK1511/);
  assert.match(data, /MH3251/);
  assert.match(data, /AK1510/);
  assert.match(data, /locked/);
  assert.match(data, /details/);
  assert.match(layout, /themeColor/);
  assert.match(manifest, /standalone/);
  assert.match(serviceWorker, /rainforest-journal-v2/);
});
