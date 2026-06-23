import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:5179/?demo=1";
const shots = [];
let passed = 0, failed = 0, warned = 0;

function log(emoji, label, detail="") {
  console.log(`${emoji} ${label}${detail ? " — " + detail : ""}`);
  if (emoji === "✅") passed++;
  else if (emoji === "❌") failed++;
  else if (emoji === "⚠️") warned++;
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args:["--no-sandbox"] });
const ctx = await browser.newContext({ viewport:{ width:390, height:844 } });
await ctx.addInitScript(() => {
  const today = new Date().toISOString().slice(0,10);
  localStorage.setItem("sfc_onboarded","1");
  localStorage.setItem("sfc_profile_setup_done","1");
  localStorage.setItem("sfc_tour_done","1");
  localStorage.setItem("sfc_daily_motiv", today);
});
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", e => errs.push(e.message));
page.on("console", m => { if (m.type()==="error") errs.push(m.text()); });

await page.goto(BASE, { waitUntil:"networkidle" });

const shot = async (name) => {
  const p = `/tmp/${name}.png`;
  await page.screenshot({ path:p });
  shots.push(p);
  return p;
};

// ── 1. HOME SCREEN ──
await page.waitForTimeout(800);
log("✅", "HOME loaded");
await shot("home");

// MY BADGES card on home
const badgesCard = await page.locator("text=MY BADGES").first();
const badgesVisible = await badgesCard.isVisible().catch(() => false);
if (badgesVisible) log("✅", "MY BADGES card visible on home");
else log("❌", "MY BADGES card NOT found on home");

const badgeCount = await page.locator("text=/\\d+ of 29 unlocked/").first().isVisible().catch(() => false);
if (badgeCount) log("✅", "Badge count shows 'X of 29 unlocked'");
else log("⚠️", "Badge count text not found");

// Open badges modal from home
await badgesCard.click().catch(() => {});
await page.waitForTimeout(400);
const achievModal = await page.locator("text=MY BADGES").nth(1).isVisible().catch(() => false);
// check for modal content (category filters)
const catFilter = await page.locator("button", { hasText: /TRAINING/i }).first().isVisible().catch(() => false);
if (catFilter) log("✅", "AchievementsModal opens from home badges card");
else log("⚠️", "AchievementsModal content uncertain (may need scrolling)");
await shot("home_badges_modal");
await page.keyboard.press("Escape").catch(() => {});
await page.locator("button").filter({ hasText: /✕/ }).first().click().catch(() => {});
await page.waitForTimeout(300);

// ── 2. NAV BAR ──
// Verify nav bar is in DOM as flex child (not fixed)
const navStyle = await page.evaluate(() => {
  const nav = document.querySelector("[data-tour='nav']")?.parentElement;
  return nav ? window.getComputedStyle(nav).position : null;
});
if (navStyle !== "fixed") log("✅", `Nav bar is no longer position:fixed (got: ${navStyle})`);
else log("⚠️", "Nav bar still position:fixed — scroll fix may not be applied");

// Main scroll container check
const mainOverflow = await page.evaluate(() => {
  const main = document.querySelector("main");
  return main ? window.getComputedStyle(main).overflowY : null;
});
if (mainOverflow === "auto") log("✅", "main element is scroll container (overflow-y:auto)");
else log("⚠️", `main overflow-y: ${mainOverflow}`);

// ── 3. TRAIN ──
await page.locator("button", { hasText: /^TRAIN$/i }).click();
await page.waitForTimeout(500);
log("✅", "Navigated to TRAIN tab");

// Plate calculator
await page.locator("button", { hasText: /PLATES/i }).click();
await page.waitForTimeout(400);
const plateModal = await page.locator("text=PLATE CALCULATOR").isVisible().catch(() => false);
if (plateModal) log("✅", "Plate Calculator opens");
else log("❌", "Plate Calculator did not open");

// Test target weight input visibility (bottom padding fix)
const targetInput = await page.locator("input[placeholder='E.G. 225']").isVisible().catch(() => false);
if (targetInput) log("✅", "Plate Calc target weight input visible (bottom padding OK)");
else log("⚠️", "Plate Calc target weight input not visible");

// Enter a weight to see results
await page.locator("input[placeholder='E.G. 225']").fill("225").catch(() => {});
await page.waitForTimeout(300);
await shot("plate_calc_225");
await page.locator("button").filter({ hasText: /✕/ }).first().click().catch(() => {});
await page.waitForTimeout(200);

// Training Max Calc
await page.locator("button", { hasText: /TM/i }).click();
await page.waitForTimeout(400);
const tmModal = await page.locator("text=TRAINING MAX CALC").isVisible().catch(() => false);
if (tmModal) log("✅", "Training Max Calc opens");
else log("❌", "Training Max Calc did not open");
const tmInput = await page.locator("input[placeholder='e.g. 315']").isVisible().catch(() => false);
if (tmInput) log("✅", "TM Calc 1RM input visible (bottom padding OK)");
else log("⚠️", "TM Calc input not visible");
await shot("tm_calc");
await page.locator("button").filter({ hasText: /✕/ }).first().click().catch(() => {});
await page.waitForTimeout(200);

// Exercise Demo duplicate badge check
await page.locator("button", { hasText: /^TRACK$/i }).click().catch(() => {});
await page.waitForTimeout(300);
// Add an exercise - click BROWSE on first exercise slot
const browseBtn = await page.locator("button", { hasText: /BROWSE/i }).first();
const browseVisible = await browseBtn.isVisible().catch(() => false);
if (browseVisible) {
  await browseBtn.click();
  await page.waitForTimeout(500);
  // Click the demo button on first exercise (the 📹 icon)
  const demoBtn = await page.locator("button").filter({ hasText: /📹/ }).first();
  const demoBtnVisible = await demoBtn.isVisible().catch(() => false);
  if (demoBtnVisible) {
    await demoBtn.click();
    await page.waitForTimeout(400);
    await shot("exercise_demo");
    const bodyText = await page.evaluate(() => document.body.innerText);
    // Check for duplicate "CHEST CHEST" pattern
    const dupMatch = bodyText.match(/CHEST\s+CHEST|BACK\s+BACK|ARMS\s+ARMS/);
    if (!dupMatch) log("✅", "No duplicate category badges in ExerciseDemoModal");
    else log("❌", `Duplicate badge found: ${dupMatch[0]}`);
    await page.locator("button").filter({ hasText: /✕/ }).first().click().catch(() => {});
    await page.waitForTimeout(200);
  } else {
    log("⚠️", "Exercise demo button not found in picker");
  }
  await page.keyboard.press("Escape").catch(() => {});
  await page.locator("button").filter({ hasText: /✕/ }).nth(0).click().catch(() => {});
  await page.waitForTimeout(300);
}

// PROGRAMS tab
await page.locator("button", { hasText: /^PROGRAMS$/i }).click();
await page.waitForTimeout(400);
const progCard = await page.locator("text=GOLDEN ERA HYPERTROPHY").isVisible().catch(() => false);
if (progCard) log("✅", "PROGRAMS tab shows program list");
else log("⚠️", "Programs list not visible");
await shot("programs_tab");

// ── 4. STATS / CHARTS ──
await page.locator("button", { hasText: /^STATS$/i }).click();
await page.waitForTimeout(500);
log("✅", "Navigated to STATS tab");

// CHARTS sub-tab
const chartsBtn = await page.locator("button", { hasText: /^CHARTS$/i }).first();
const chartsVisible = await chartsBtn.isVisible().catch(() => false);
if (chartsVisible) {
  log("✅", "CHARTS sub-tab exists in ProgressScreen");
  await chartsBtn.click();
  await page.waitForTimeout(500);
  await shot("charts_tab");

  // Should show exercise pills (demo data has sessions)
  const exercisePill = await page.locator("button", { hasText: /Barbell|Squat|Bench|Deadlift/i }).first().isVisible().catch(() => false);
  if (exercisePill) {
    log("✅", "Exercise pills visible in CHARTS tab");
    // Click the first pill
    await page.locator("button", { hasText: /Barbell|Squat|Bench|Deadlift/i }).first().click();
    await page.waitForTimeout(500);
    await shot("charts_with_exercise");
    // Check for chart labels
    const bestSet = await page.locator("text=BEST SET WEIGHT").isVisible().catch(() => false);
    const volumeChart = await page.locator("text=TOTAL SESSION VOLUME").isVisible().catch(() => false);
    const est1rm = await page.locator("text=ESTIMATED 1RM").isVisible().catch(() => false);
    if (bestSet) log("✅", "BEST SET WEIGHT chart rendered");
    else log("⚠️", "BEST SET WEIGHT chart not found");
    if (est1rm) log("✅", "ESTIMATED 1RM TREND chart rendered");
    else log("⚠️", "ESTIMATED 1RM chart not found");
    if (volumeChart) log("✅", "TOTAL SESSION VOLUME chart rendered");
    else log("⚠️", "TOTAL SESSION VOLUME chart not found");
  } else {
    log("⚠️", "No exercise pills found in CHARTS — demo data may not have 2+ sessions per exercise");
    // Check empty state
    const emptyState = await page.locator("text=/LOG SESSIONS|TAP AN EXERCISE/i").first().isVisible().catch(() => false);
    if (emptyState) log("✅", "CHARTS empty state shown correctly");
    else log("⚠️", "CHARTS empty state not visible");
  }
} else {
  log("❌", "CHARTS sub-tab not found in ProgressScreen");
}

// STATS sub-tab still works
await page.locator("button", { hasText: /^STATS$/i }).first().click();
await page.waitForTimeout(300);
const statsGrid = await page.locator("text=SESSIONS").first().isVisible().catch(() => false);
if (statsGrid) log("✅", "STATS sub-tab still works after adding CHARTS");
else log("❌", "STATS sub-tab broken");

// MAP (heatmap) renamed tab
await page.locator("button", { hasText: /^MAP$/i }).first().click().catch(() => {});
await page.waitForTimeout(400);
const heatmap = await page.locator("svg").first().isVisible().catch(() => false);
if (heatmap) log("✅", "MAP (heatmap) sub-tab renders");
else log("⚠️", "Heatmap SVG not found");

// ── 5. MORE / BADGES (still accessible) ──
await page.locator("button", { hasText: /^MORE$/i }).click();
await page.waitForTimeout(400);
const moreMyBadges = await page.locator("text=MY BADGES").first().isVisible().catch(() => false);
if (moreMyBadges) log("✅", "MY BADGES tile still in MoreScreen");
else log("⚠️", "MY BADGES tile missing from MoreScreen");
await shot("more_screen");

// ── 6. SCROLL CONTAINER - verify body does not scroll ──
const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
log("🔍", `body overflow: ${bodyOverflow} (should not be scroll)`);

// Outer app div height check
const outerHeight = await page.evaluate(() => {
  const outer = document.body.firstElementChild?.firstElementChild;
  return outer ? window.getComputedStyle(outer).height : "unknown";
});
log("🔍", `Outer app div computed height: ${outerHeight}`);

// ── 7. CONSOLE ERRORS ──
if (errs.length === 0) log("✅", "No JS console errors");
else {
  const relevant = errs.filter(e => !e.includes("supabase") && !e.includes("Failed to fetch") && !e.includes("net::ERR"));
  if (relevant.length === 0) log("✅", "No non-network JS errors");
  else {
    relevant.slice(0,5).forEach(e => log("⚠️", "Console error", e.slice(0,120)));
  }
}

await browser.close();

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed, ${warned} warnings ===`);
console.log("Screenshots:", shots.join(", "));
