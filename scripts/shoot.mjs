/**
 * Dev-only visual check. Captures each section at desktop + mobile.
 * Usage: node scripts/shoot.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = "shots";
mkdirSync(out, { recursive: true });

const sections = [
  "top",
  "impact",
  "work",
  "services",
  "process",
  "experience",
  "skills",
  "about",
  "faq",
  "contact",
];

const errors = [];

const browser = await chromium.launch();

for (const [name, viewport] of [
  ["desktop", { width: 1512, height: 950 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });

  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${name}] console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${name}] pageerror: ${e.message}`));

  await page.goto(base, { waitUntil: "networkidle" });
  // Let the preloader finish and the hero settle.
  await page.waitForTimeout(4200);

  await page.screenshot({ path: `${out}/${name}-hero.png` });

  for (const id of sections) {
    const el = page.locator(`#${id}`);
    if (!(await el.count())) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${name}-${id}.png` });
  }

  // Full-page height sanity check + horizontal overflow detection
  const metrics = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  console.log(`${name}:`, JSON.stringify(metrics));
  if (metrics.scrollWidth > metrics.clientWidth + 1) {
    errors.push(
      `[${name}] horizontal overflow: scrollWidth ${metrics.scrollWidth} > clientWidth ${metrics.clientWidth}`,
    );
  }

  await page.close();
}

await browser.close();

if (errors.length) {
  console.log("\n--- ISSUES ---");
  for (const e of errors) console.log(e);
} else {
  console.log("\nNo console errors, no horizontal overflow.");
}
