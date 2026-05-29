// Targeted diagnosis of the 8 remaining failures
import { chromium } from "playwright";
const URL = "http://localhost:5173/?demo=1";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
ctx.addInitScript(() => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  localStorage.setItem("sfc_onboarded", "1");
  localStorage.setItem("sfc_profile_setup_done", "1");
  localStorage.setItem("sfc_tour_done", "1");
  localStorage.setItem("sfc_daily_motiv", today);
  localStorage.setItem("sfc_nutrition_log", JSON.stringify([
    { date: yesterday, items: [{ name: "Chicken Rice", cal: 500, pro: 40, carb: 50, fat: 8, meal: "lunch" }] }
  ]));
  localStorage.setItem("sfc_water_goal", "64");
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const nav = async (label) => {
  await page.locator("button").filter({ hasText: new RegExp(label, "i") }).first().click({ force: true });
  await page.waitForTimeout(900);
};

// ── TRAIN: +SET and SAVE button text ──
await nav("TRAIN");
// Quick-start a workout to get exercises loaded
await page.evaluate(() => {
  const d = [...document.querySelectorAll("div")].find(el => el.textContent?.trim() === "PUSH DAY");
  d?.click();
});
await page.waitForTimeout(600);
// Select an exercise
const exInp = page.locator("input[placeholder='EXERCISE NAME']").first();
if (await exInp.isVisible().catch(() => false)) {
  await exInp.fill("bench");
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const d = [...document.querySelectorAll("div")].find(el => el.textContent?.trim() === "Barbell Bench Press");
    d?.click();
  });
  await page.waitForTimeout(500);
}
// Dump ALL button texts visible now
const allBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")]
    .filter(b => b.offsetWidth > 0)
    .map(b => JSON.stringify(b.textContent?.trim().replace(/\s+/g," ").slice(0,30)))
);
console.log("TRAIN all buttons after exercise select:");
allBtns.forEach(t => console.log(" ", t));

// ── STATS: water button text at max scroll ──
await nav("STATS");
await page.locator("button").filter({ hasText: /^STATS$/i }).first().click({ force: true }).catch(() => {});
await page.waitForTimeout(400);
// scroll to bottom of main
for (let scroll = 200; scroll <= 1500; scroll += 200) {
  await page.evaluate((s) => document.querySelector("main")?.scrollTo(0, s), scroll);
  await page.waitForTimeout(100);
  const found = await page.evaluate(() =>
    [...document.querySelectorAll("button")].filter(b => /\b(8|12|16|20)\b/.test(b.textContent?.trim())).map(b => b.textContent.trim())
  );
  if (found.length > 0) { console.log(`STATS water buttons at scroll=${scroll}:`, JSON.stringify(found)); break; }
}
// if not found, show all button texts
const waterArea = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => b.textContent.trim().replace(/\s+/g," ")).filter(t => /oz|water|ml|\d+/i.test(t)).slice(0,10)
);
console.log("STATS water-related buttons:", JSON.stringify(waterArea));

// ── FUEL: past days click + food search ──
await nav("FUEL");
// back to LOG tab
const logTabs = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => ({t: b.textContent.trim(), v: b.offsetWidth > 0})).filter(x => x.v && /log|📋/i.test(x.t) && x.t.length < 15)
);
console.log("FUEL LOG tab candidates:", JSON.stringify(logTabs.map(x=>x.t)));
if (logTabs.length > 0) {
  await page.locator("button").filter({ hasText: new RegExp(logTabs[0].t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "i") }).first().click({ force: true });
  await page.waitForTimeout(400);
}

// Check PAST DAYS element structure
const pastInfo = await page.evaluate(() => {
  const el = [...document.querySelectorAll("div,button")].find(e => /^PAST DAYS$/i.test(e.textContent?.trim()));
  if (!el) return "not found";
  return { tag: el.tagName, hasOnClick: !!el.onclick, role: el.getAttribute("role"), style: el.getAttribute("style")?.slice(0,80) };
});
console.log("FUEL PAST DAYS element:", JSON.stringify(pastInfo));

// Try clicking it via pointer event
const pastDays = page.locator("text=PAST DAYS").first();
if (await pastDays.isVisible().catch(() => false)) {
  await pastDays.click({ force: true });
  await page.waitForTimeout(500);
  const expanded = await page.evaluate(() =>
    [...document.querySelectorAll("div")].some(d => /chicken/i.test(d.textContent) && d.textContent.trim().length < 40)
  );
  console.log("FUEL past days expanded (chicken visible):", expanded);
}

// Food search — what input is present in SEARCH tab
await page.locator("button").filter({ hasText: /🔍 SEARCH|SEARCH/i }).first().click({ force: true });
await page.waitForTimeout(500);
const searchInputInfo = await page.evaluate(() =>
  [...document.querySelectorAll("input")].map(i => ({ ph: i.placeholder, type: i.type }))
);
console.log("FUEL SEARCH inputs:", JSON.stringify(searchInputInfo));
// Fill and check what buttons appear
const inp = page.locator("input").first();
if (await inp.isVisible().catch(() => false)) {
  await inp.fill("chicken");
  await page.waitForTimeout(600);
  const afterBtns = await page.evaluate(() =>
    [...document.querySelectorAll("button")].map(b => b.textContent.trim().replace(/\s+/g," ").slice(0,35)).filter(t => /chicken|food|add/i.test(t)).slice(0,5)
  );
  console.log("FUEL after typing 'chicken' buttons:", JSON.stringify(afterBtns));
  // Also check for divs with chicken
  const chickenDivs = await page.evaluate(() =>
    [...document.querySelectorAll("div")].filter(d => /chicken/i.test(d.textContent?.trim()) && d.textContent.trim().length < 40).map(d => d.textContent.trim()).slice(0,5)
  );
  console.log("FUEL chicken divs:", JSON.stringify(chickenDivs));
}

// ── SQUAD compose post type buttons ──
await nav("SQUAD");
await page.locator("button").filter({ hasText: /\+ POST/i }).first().click({ force: true });
await page.waitForTimeout(700);
const composeBtnsAll = await page.evaluate(() =>
  [...document.querySelectorAll("button")]
    .filter(b => b.offsetWidth > 0)
    .map(b => b.textContent.trim().replace(/\s+/g," ").slice(0,30))
    .filter(t => t.length > 0)
);
console.log("SQUAD compose all buttons:", JSON.stringify(composeBtnsAll));
await page.mouse.click(195, 50);
await page.waitForTimeout(500);

// ── MORE: goals modal input type ──
await nav("MORE");
await page.evaluate(() => document.querySelector("main")?.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.locator("button").filter({ hasText: /GOALS/i }).first().click({ force: true });
await page.waitForTimeout(600);
const goalsInputs = await page.evaluate(() =>
  [...document.querySelectorAll("input")].map(i => ({ ph: i.placeholder, type: i.type, inputMode: i.inputMode }))
);
console.log("MORE goals modal inputs:", JSON.stringify(goalsInputs));
// Also check divs with number-like content
const goalsSliders = await page.evaluate(() =>
  [...document.querySelectorAll("input,button,div[role='slider']")].filter(el => el.getAttribute("type") === "range" || el.getAttribute("role") === "slider").map(el => el.tagName + " type=" + el.type)
);
console.log("MORE goals sliders:", JSON.stringify(goalsSliders));

await browser.close();
