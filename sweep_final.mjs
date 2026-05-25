import { chromium } from "playwright";

const URL = "http://localhost:5173/?demo=1";
const results = [];

function log(label, pass, note = "") {
  const sym = pass ? "✅" : "❌";
  results.push({ label, pass, note });
  console.log(`${sym} ${label}${note ? " — " + note : ""}`);
}

async function waitFor(page, selector, timeout = 5000) {
  try { await page.waitForSelector(selector, { timeout }); return true; }
  catch { return false; }
}

async function navTo(page, tabName) {
  await page.locator("button").filter({ hasText: new RegExp(tabName, "i") }).first().click({ force: true });
  await page.waitForTimeout(800);
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

ctx.addInitScript(() => {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem("sfc_onboarded", "1");
  localStorage.setItem("sfc_profile_setup_done", "1");
  localStorage.setItem("sfc_daily_motiv", today);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  localStorage.setItem("sfc_nutrition_log", JSON.stringify([
    { date: yesterday, items: [{ name: "Chicken", cal: 300, pro: 30, carb: 0, fat: 5, meal: "lunch" }] }
  ]));
});

const page = await ctx.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// ============ HOME ============
log("HOME renders", await waitFor(page, "text=YOUR STATS"));
log("HOME stats card present", await waitFor(page, "text=SESSIONS"));
log("HOME leaderboard section", await waitFor(page, "text=LEADERBOARD"));
log("HOME quick start section", await waitFor(page, "text=QUICK START"));
log("HOME weekly volume chart", await waitFor(page, "svg", 3000));

// ============ TRAIN ============
await navTo(page, "TRAIN");
log("TRAIN screen renders", await waitFor(page, "text=TRAINING HUB"));

// Sub-tabs
await page.locator("button").filter({ hasText: /^HISTORY$/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("TRAIN HISTORY tab", await waitFor(page, "text=Session History", 3000));

await page.locator("button").filter({ hasText: /^PRs$/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("TRAIN PRs tab", await waitFor(page, "text=PERSONAL RECORDS", 3000));

await page.locator("button").filter({ hasText: /^PROGRAMS$/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("TRAIN PROGRAMS tab", await waitFor(page, "text=PROGRAMS", 3000));

await page.locator("button").filter({ hasText: /^TRACK$/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("TRAIN TRACK tab", await waitFor(page, "text=SESSION NAME", 3000));

// Plate calculator
const platesBtn = page.locator("button").filter({ hasText: /PLATES/i }).first();
if (await platesBtn.isVisible().catch(() => false)) {
  await platesBtn.click({ force: true });
  await page.waitForTimeout(600);
  log("TRAIN plate calculator opens", await waitFor(page, "text=PLATE CALCULATOR"));
  const closeBtn = page.locator("button").filter({ hasText: /✕|×/i }).first();
  if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click({ force: true });
  else await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
} else {
  log("TRAIN plate calculator opens", false, "PLATES button not found");
}

// ============ STATS ============
await navTo(page, "STATS");
log("STATS screen renders", await waitFor(page, "text=PROGRESS"));
log("STATS stats content visible", await waitFor(page, "text=SESSIONS", 3000));

await page.locator("button").filter({ hasText: /^STREAK$/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("STATS streak tab", await waitFor(page, "text=STREAK", 3000));

await page.locator("button").filter({ hasText: /HEAT MAP/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("STATS heatmap tab renders SVG", await waitFor(page, "svg", 3000));

await page.locator("button").filter({ hasText: /^STATS$/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("STATS body composition section", await waitFor(page, "text=BODY COMPOSITION", 3000));
log("STATS water tracker", await waitFor(page, "text=WATER", 3000));

// ============ FUEL ============
await navTo(page, "FUEL");
log("FUEL screen renders", await waitFor(page, "text=NUTRITION"));
log("FUEL log tab — BREAKFAST", await waitFor(page, "text=BREAKFAST", 3000));
log("FUEL calorie ring", await waitFor(page, "text=KCAL", 3000));
log("FUEL past days section", await waitFor(page, "text=PAST DAYS", 3000));

// SEARCH tab
await page.locator("button").filter({ hasText: /SEARCH/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("FUEL search tab", await waitFor(page, "text=SEARCH", 3000));

// SCAN tab
const fuelBtns = await page.locator("button").all();
let scanFound = false;
for (const b of fuelBtns) {
  const txt = await b.textContent().catch(() => "");
  if (txt.includes("SCAN")) {
    await b.click({ force: true });
    await page.waitForTimeout(600);
    scanFound = true; break;
  }
}
log("FUEL scan tab", scanFound && await waitFor(page, "text=SCAN", 3000));

// SUPPS tab
await page.locator("button").filter({ hasText: /SUPPS/i }).first().click({ force: true });
await page.waitForTimeout(600);
log("FUEL supps tab", await waitFor(page, "text=SUPPLEMENT", 3000));

// ============ SQUAD ============
await navTo(page, "SQUAD");
log("SQUAD screen renders", await waitFor(page, "text=FEED"));
log("SQUAD FOLLOWING tab", await waitFor(page, "text=FOLLOWING", 3000));
log("SQUAD DISCOVER tab", await waitFor(page, "text=DISCOVER", 3000));

// Compose — button is "+ POST"
const composeBtn = page.locator("button").filter({ hasText: /\+ POST/i }).first();
if (await composeBtn.isVisible().catch(() => false)) {
  await composeBtn.click({ force: true });
  await page.waitForTimeout(600);
  const composeOpen = await waitFor(page, "text=SHARE WITH THE SQUAD", 3000)
    || await waitFor(page, "text=WHAT'S ON YOUR MIND", 2000)
    || await waitFor(page, "text=POST TYPE", 2000);
  log("SQUAD compose sheet opens", composeOpen);
  // Close compose via backdrop click (top of screen, outside the sheet)
  await page.mouse.click(195, 50);
  await page.waitForTimeout(700);
  // Verify compose closed
  const composeGone = !(await page.locator("text=SHARE WITH THE SQUAD").isVisible().catch(() => false));
  if (!composeGone) await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
} else {
  log("SQUAD compose sheet opens", false, "+ POST button not found");
}

// User search — "🔍" emoji button
const searchEmojiBtn = page.locator("button").filter({ hasText: "🔍" }).first();
if (await searchEmojiBtn.isVisible().catch(() => false)) {
  await searchEmojiBtn.click();
  await page.waitForTimeout(700);
  const searchOpen = await waitFor(page, "text=FIND YOUR SQUAD", 3000)
    || await waitFor(page, "[role='dialog']", 2000)
    || await waitFor(page, "text=SEARCH USERS", 2000);
  log("SQUAD user search opens", searchOpen);
  // Close search modal via ← back button or Escape
  const backBtn = page.locator("button").filter({ hasText: /←|BACK/i }).first();
  if (await backBtn.isVisible().catch(() => false)) await backBtn.click({ force: true });
  else await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
} else {
  log("SQUAD user search opens", false, "🔍 button not found");
}

// ============ MORE ============
await navTo(page, "MORE");
log("MORE screen renders", await waitFor(page, "text=MORE TOOLS"));

// Scroll to profile card (below tile grid)
await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 9999));
await page.waitForTimeout(400);

// Profile card — ChromeCard with "EDIT ✎" text
const editCard = page.locator("text=EDIT ✎").first();
if (await editCard.isVisible().catch(() => false)) {
  await editCard.click({ force: true });
  await page.waitForTimeout(700);
  log("MORE profile edit opens", await waitFor(page, "text=EDIT PROFILE", 3000));
  const closeX = page.locator("button").filter({ hasText: /✕|×/i }).first();
  if (await closeX.isVisible().catch(() => false)) await closeX.click({ force: true });
  else await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  // scroll back up in MORE
  await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 0));
  await page.waitForTimeout(300);
} else {
  log("MORE profile edit opens", false, "EDIT ✎ card not found");
}

// Modal tiles — scroll to top first
await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 0));
await page.waitForTimeout(300);

const moreModals = [
  { tile: "AI COACH", expected: "AI COACH" },
  { tile: "GOALS", expected: "GOALS" },
  { tile: "WEEKLY REPORTS", expected: "REPORT" },
  { tile: "ACCOUNTABILITY", expected: "ACCOUNTABILITY" },
  { tile: "NOTIFICATIONS", expected: "NOTIFICATION" },
  { tile: "FORM CHECK", expected: "FORM CHECK" },
  { tile: "HEALTH CONNECT", expected: "HEALTH CONNECT" },
  { tile: "MACRO COACH", expected: "MACRO COACH" },
];

for (const { tile, expected } of moreModals) {
  const btn = page.locator("button").filter({ hasText: new RegExp(tile, "i") }).first();
  const visible = await btn.isVisible().catch(() => false);
  if (!visible) { log(`MORE ${tile} modal`, false, "tile not found"); continue; }
  await btn.click({ force: true });
  await page.waitForTimeout(700);
  const opened = await waitFor(page, `text=${expected}`, 3000);
  log(`MORE ${tile} modal`, opened);
  const closeBtn = page.locator("button").filter({ hasText: /✕|×|✖/i }).first();
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click({ force: true });
  } else {
    await page.keyboard.press("Escape");
  }
  await page.waitForTimeout(600);
  if (!await waitFor(page, "text=MORE TOOLS", 1500)) {
    await navTo(page, "MORE");
    await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 0));
    await page.waitForTimeout(300);
  }
}

// Help & Support — scroll to bottom
await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 9999));
await page.waitForTimeout(300);
const helpDiv = page.locator("text=HELP & SUPPORT").first();
if (await helpDiv.isVisible().catch(() => false)) {
  await helpDiv.click({ force: true });
  await page.waitForTimeout(600);
  log("MORE HELP & SUPPORT modal", await waitFor(page, "text=HELP", 3000));
  const closeBtn = page.locator("button").filter({ hasText: /✕|×/i }).first();
  if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click({ force: true });
  else await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
} else {
  log("MORE HELP & SUPPORT modal", false, "HELP & SUPPORT row not found");
}

// ============ CONSOLE ERRORS ============
log("Zero console errors", errors.length === 0, errors.length > 0 ? errors.slice(0,3).join(" | ") : "");

await browser.close();

// ============ SUMMARY ============
const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;
console.log(`\n${"=".repeat(55)}`);
console.log(`TOTAL: ${passed} passed, ${failed} failed out of ${results.length}`);
console.log(`VERDICT: ${failed === 0 ? "PASS ✅" : "FAIL ❌"}`);
if (failed > 0) {
  console.log("\nFailed checks:");
  results.filter(r => !r.pass).forEach(r => console.log(`  ❌ ${r.label}${r.note ? " — " + r.note : ""}`));
}
