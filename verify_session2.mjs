import { chromium } from "playwright";

const BASE = "http://localhost:5179/?demo=1";
let passed = 0, failed = 0, warned = 0;
const shots = [];

const log = (e, label, detail="") => {
  console.log(`${e} ${label}${detail ? " — " + detail : ""}`);
  if (e==="✅") passed++; else if (e==="❌") failed++; else if (e==="⚠️") warned++;
};

const browser = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args:["--no-sandbox"] });
const ctx = await browser.newContext({ viewport:{width:390, height:844} });
await ctx.addInitScript(() => {
  const today = new Date().toISOString().slice(0,10);
  localStorage.setItem("sfc_onboarded","1");
  localStorage.setItem("sfc_profile_setup_done","1");
  localStorage.setItem("sfc_tour_done","1");
  localStorage.setItem("sfc_daily_motiv",today);
});
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", e => errs.push(e.message));
page.on("console", m => { if (m.type()==="error") errs.push(m.text()); });

const shot = async n => { const p=`/tmp/${n}.png`; await page.screenshot({path:p}); shots.push(p); return p; };
const nav = async tab => {
  await page.evaluate(t => {
    [...document.querySelectorAll("button")].find(b => b.innerText.trim().toUpperCase()===t)?.click();
  }, tab.toUpperCase());
  await page.waitForTimeout(600);
};
const closeModal = async () => {
  // try ✕ button, then backdrop click, then Escape
  const xBtn = page.locator("button").filter({ hasText: /^✕$/ }).first();
  if (await xBtn.isVisible().catch(()=>false)) { await xBtn.click(); await page.waitForTimeout(300); return; }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
};

await page.goto(BASE, { waitUntil:"networkidle" });
await page.waitForTimeout(800);

// ── 1. HOME: MY BADGES card ──
const badgesCard = page.locator("text=MY BADGES").first();
log(await badgesCard.isVisible().catch(()=>false) ? "✅":"❌", "MY BADGES card on HomeScreen");
log(await page.locator("text=/\\d+ of 29 unlocked/").isVisible().catch(()=>false) ? "✅":"⚠️", "Badge count label");
await shot("01_home");

// Open badges modal
await badgesCard.click();
await page.waitForTimeout(500);
const trainingFilter = page.locator("button", { hasText:/^TRAINING$/i }).first();
log(await trainingFilter.isVisible().catch(()=>false) ? "✅":"⚠️", "AchievementsModal opens from home tap");
await shot("02_home_badges_modal");
await closeModal();
await page.waitForTimeout(300);

// ── 2. LAYOUT: scroll container ──
const navPos = await page.evaluate(() => {
  const nav = document.querySelector("[data-tour='nav']")?.parentElement;
  return nav ? window.getComputedStyle(nav).position : "not found";
});
log(navPos === "static" ? "✅":"⚠️", `Nav bar position: ${navPos} (want static)`);

const mainOvf = await page.evaluate(() => {
  return window.getComputedStyle(document.querySelector("main")||document.body).overflowY;
});
log(mainOvf === "auto" ? "✅":"⚠️", `<main> overflow-y: ${mainOvf} (want auto)`);

const outerH = await page.evaluate(() => {
  const el = document.getElementById("root")?.firstElementChild;
  return el ? window.getComputedStyle(el).height : "?";
});
log("🔍", `Outer app div height: ${outerH}`);

// ── 3. TRAIN: Plate Calc bottom padding ──
await nav("TRAIN");
await page.locator("button", { hasText:/PLATES/i }).click();
await page.waitForTimeout(500);
log(await page.locator("text=PLATE CALCULATOR").isVisible().catch(()=>false) ? "✅":"❌", "Plate Calculator opens");

// Scroll to bottom to check target input visibility
const targetInput = page.locator("input[placeholder='E.G. 225']");
log(await targetInput.isVisible().catch(()=>false) ? "✅":"⚠️", "Target weight input visible");
await targetInput.fill("225").catch(()=>{});
await page.waitForTimeout(300);
await shot("03_plate_calc");
// Check results rendered (bar diagram should appear)
const barDiagram = await page.locator("svg").isVisible().catch(()=>false);
log(barDiagram ? "✅":"⚠️", "Bar diagram SVG renders after entering weight");
await closeModal();

// Training Max Calc
await page.locator("button", { hasText:/⚡.*TM|TM/i }).click();
await page.waitForTimeout(400);
log(await page.locator("text=TRAINING MAX CALC").isVisible().catch(()=>false) ? "✅":"❌", "Training Max Calc opens");
const rmInput = page.locator("input[placeholder='e.g. 315']");
log(await rmInput.isVisible().catch(()=>false) ? "✅":"⚠️", "1RM input visible (bottom padding OK)");
await rmInput.fill("315").catch(()=>{});
await page.waitForTimeout(300);
await shot("04_tm_calc");
const pctGrid = await page.locator("text=90%").isVisible().catch(()=>false);
log(pctGrid ? "✅":"⚠️", "Percentage targets grid renders");
await closeModal();

// Exercise demo — duplicate badge check
await page.locator("button", { hasText:/^TRACK$/i }).click();
await page.waitForTimeout(300);
const browseBtn = page.locator("button", { hasText:/BROWSE/i }).first();
if (await browseBtn.isVisible().catch(()=>false)) {
  await browseBtn.click();
  await page.waitForTimeout(500);
  const demoBtn = page.locator("button").filter({ hasText:/📹/ }).first();
  if (await demoBtn.isVisible().catch(()=>false)) {
    await demoBtn.click();
    await page.waitForTimeout(400);
    await shot("05_exercise_demo");
    const txt = await page.evaluate(() => document.body.innerText);
    const dup = /CHEST\s+CHEST|BACK\s+BACK|SHOULDERS\s+SHOULDERS|ARMS\s+ARMS/i.test(txt);
    log(!dup ? "✅":"❌", "No duplicate category badges in ExerciseDemoModal");
    await closeModal();
  } else log("⚠️", "No 📹 button in exercise picker");
  await closeModal();
} else log("⚠️", "BROWSE button not found");

// PROGRAMS tab - scroll check (programs list length)
await page.locator("button", { hasText:/^PROGRAMS$/i }).click();
await page.waitForTimeout(500);
const progCount = await page.locator("text=4X/WK").count();
log(progCount >= 3 ? "✅":"⚠️", `Programs list: ${progCount} visible programs`);
await shot("06_programs");

// ── 4. STATS / CHARTS tab ──
await nav("STATS");
const chartsBtn = page.locator("button", { hasText:/^CHARTS$/i }).first();
log(await chartsBtn.isVisible().catch(()=>false) ? "✅":"❌", "CHARTS sub-tab exists in ProgressScreen");
await chartsBtn.click();
await page.waitForTimeout(500);
await shot("07_charts_empty");

// Demo data should have exercises logged 2+ times
const exPills = page.locator("button").filter({ hasText:/Barbell|Bench|Squat|Deadlift|Press/i }).first();
const hasPills = await exPills.isVisible().catch(()=>false);
log(hasPills ? "✅":"⚠️", "Exercise pills visible in CHARTS tab (demo data has 2+ sessions)");

if (hasPills) {
  await exPills.click();
  await page.waitForTimeout(600);
  await shot("08_charts_exercise");
  log(await page.locator("text=BEST SET WEIGHT").isVisible().catch(()=>false) ? "✅":"❌", "BEST SET WEIGHT chart renders");
  log(await page.locator("text=ESTIMATED 1RM TREND").isVisible().catch(()=>false) ? "✅":"❌", "ESTIMATED 1RM TREND chart renders");
  log(await page.locator("text=TOTAL SESSION VOLUME").isVisible().catch(()=>false) ? "✅":"❌", "TOTAL SESSION VOLUME chart renders");
  // Check SVG charts rendered
  const svgCount = await page.locator("svg").count();
  log(svgCount >= 2 ? "✅":"⚠️", `SVG charts rendered: ${svgCount}`);
}

// STATS still works
await page.locator("button", { hasText:/^STATS$/i }).first().click();
await page.waitForTimeout(300);
log(await page.locator("text=SESSIONS").first().isVisible().catch(()=>false) ? "✅":"❌", "STATS sub-tab still works");

// MAP still works (renamed from HEAT MAP)
await page.locator("button", { hasText:/^MAP$/i }).first().click();
await page.waitForTimeout(400);
const svgMap = await page.locator("svg").first().isVisible().catch(()=>false);
log(svgMap ? "✅":"⚠️", "MAP (heatmap) sub-tab still renders SVG");
await shot("09_heatmap");

// ── 5. MORE: badges tile still there ──
await nav("MORE");
log(await page.locator("text=MY BADGES").first().isVisible().catch(()=>false) ? "✅":"⚠️", "MY BADGES tile still in MoreScreen");

// ── 6. SQUAD feed still renders ──
await nav("SQUAD");
await page.waitForTimeout(600);
const feedTab = await page.locator("text=/FOLLOWING|DISCOVER/i").first().isVisible().catch(()=>false);
log(feedTab ? "✅":"⚠️", "SQUAD/Feed screen renders");

// ── 7. FUEL still renders ──
await nav("FUEL");
await page.waitForTimeout(400);
const fuelTab = await page.locator("text=/LOG|SCAN|SEARCH/i").first().isVisible().catch(()=>false);
log(fuelTab ? "✅":"⚠️", "FUEL screen renders");

// ── 8. Console errors ──
const appErrs = errs.filter(e => !e.includes("supabase") && !e.includes("Failed to fetch") && !e.includes("net::ERR") && !e.includes("ERR_CONNECTION"));
log(appErrs.length === 0 ? "✅":"⚠️", `Console errors (non-network): ${appErrs.length}`);
if (appErrs.length) appErrs.slice(0,3).forEach(e => console.log("  ERROR:", e.slice(0,150)));

// 🔍 PROBES
// Probe: STREAK tab still works
await nav("STATS");
await page.locator("button", { hasText:/^STREAK$/i }).first().click();
await page.waitForTimeout(300);
const streakEl = await page.locator("text=/DAY STREAK|CURRENT STREAK/i").first().isVisible().catch(()=>false);
log(streakEl ? "✅":"🔍", "STREAK sub-tab still works (probe)");

// Probe: switching sub-tabs rapidly doesn't crash
await page.locator("button", { hasText:/^CHARTS$/i }).first().click();
await page.waitForTimeout(100);
await page.locator("button", { hasText:/^STATS$/i }).first().click();
await page.waitForTimeout(100);
await page.locator("button", { hasText:/^CHARTS$/i }).first().click();
await page.waitForTimeout(400);
const nocrash = errs.filter(e => !e.includes("supabase") && !e.includes("fetch") && !e.includes("ERR_")).length;
log(nocrash === 0 ? "✅":"⚠️", "Rapid tab-switching doesn't crash (probe)");

await browser.close();
console.log(`\n══ SUMMARY: ${passed} ✅ passed  ${failed} ❌ failed  ${warned} ⚠️ warnings ══`);
console.log("Screenshots:", shots.map(s => s.split("/").pop()).join(", "));
