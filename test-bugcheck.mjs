import { chromium } from "playwright";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = "http://localhost:5173?demo=1";

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

const errors = [];
page.on("console", m => {
  if (m.type() === "error") {
    const txt = m.text();
    if (txt.includes("ERR_CERT") || txt.includes("WebSocket") || txt.includes("net::ERR")) return;
    errors.push(txt);
  }
});
page.on("pageerror", e => errors.push("PAGE ERROR: " + e.message));

const warns = [];
async function check(label, fn) {
  try {
    await fn();
    console.log("  ✅", label);
  } catch (e) {
    console.error("  ❌", label, "—", e.message.slice(0, 120));
    warns.push({ label, err: e.message.slice(0, 200) });
  }
}

// Helper: click a bottom nav tab by its label text exactly
async function navTo(label, marker) {
  // Bottom nav spans have exact tab text; scroll to bottom first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator(`span`).filter({ hasText: new RegExp(`^${label}$`) }).last().click();
  if (marker) await page.waitForSelector(marker, { timeout: 5000 });
}

console.log("\n=== LOADING APP ===");
await page.goto(BASE, { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/ss-home.png" });
console.log("  ✅ App loaded");

// Daily motivational popup — verify it shows then dismiss
console.log("\n=== DAILY MOTIV POPUP ===");
await check("Popup shown on first load", async () => {
  await page.waitForSelector("text=LET'S GO ◆", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-daily-motiv.png" });
await check("Popup dismisses on button click", async () => {
  await page.click("text=LET'S GO ◆");
  await page.waitForSelector("text=QUICK START", { timeout: 3000 });
});

// ── HOME SCREEN ──
console.log("\n=== HOME SCREEN ===");
await check("Quick Start card visible", async () => {
  await page.waitForSelector("text=QUICK START", { timeout: 3000 });
});
await check("Leaderboard card visible", async () => {
  await page.waitForSelector("text=LEADERBOARD", { timeout: 3000 });
});
await check("User name visible", async () => {
  await page.waitForSelector("text=DEMOUSER", { timeout: 3000 });
});

// ── TRAIN SCREEN ──
console.log("\n=== TRAIN SCREEN ===");
await check("Navigate to TRAIN", async () => {
  await navTo("TRAIN", null);
  await page.waitForSelector("text=HUB", { timeout: 5000 });
});
await page.screenshot({ path: "/tmp/ss-train.png" });

await check("TRACK tab shows session name input", async () => {
  await page.waitForSelector("text=SESSION NAME", { timeout: 3000 });
});
await check("Plate calculator button visible", async () => {
  await page.waitForSelector("text=PLATES", { timeout: 3000 });
});
await check("Open plate calculator", async () => {
  await page.dispatchEvent("text=PLATES", "click");
  await page.waitForSelector("text=PLATE CALCULATOR", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-plate-calc.png" });
await check("Close plate calculator", async () => {
  const closeBtn = await page.$("text=✕");
  await closeBtn.dispatchEvent("click");
  await page.waitForSelector("text=HUB", { timeout: 3000 });
});

await check("HISTORY tab shows past sessions", async () => {
  await page.click("text=HISTORY");
  await page.waitForSelector("text=PUSH DAY", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-history.png" });

await check("PRs tab shows personal records", async () => {
  await page.click("text=PRs");
  await page.waitForSelector("text=PERSONAL RECORDS", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-prs.png" });

await check("PROGRAMS tab", async () => {
  await page.click("text=PROGRAMS");
  await page.waitForSelector("text=PROGRAM", { timeout: 3000 });
});

// ── STATS SCREEN ──
console.log("\n=== STATS SCREEN ===");
await check("Navigate to STATS", async () => {
  await navTo("STATS", "text=PROGRESS");
});
// Default inner tab is "stats" — content already visible
await check("Stats content visible (SESSIONS stat)", async () => {
  await page.waitForSelector("text=TOTAL VOL", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-stats.png" });

await check("Streak tab", async () => {
  await page.click("text=STREAK");
  await page.waitForSelector("text=DAY STREAK", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-streak.png" });

await check("Heatmap tab", async () => {
  await page.click("text=HEAT MAP");
  await page.waitForSelector("text=MUSCLE", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-heatmap.png" });

// ── FUEL SCREEN ──
console.log("\n=== FUEL SCREEN ===");
await check("Navigate to FUEL", async () => {
  await navTo("FUEL", "text=NUTRITION");
});
await page.screenshot({ path: "/tmp/ss-fuel.png" });

await check("Calorie ring visible", async () => {
  await page.waitForSelector("text=KCAL", { timeout: 3000 });
});
await check("LOG tab visible", async () => {
  await page.waitForSelector("text=📋 LOG", { timeout: 3000 });
});
await check("SCAN tab", async () => {
  await page.click("text=📷 SCAN");
  await page.waitForTimeout(500);
});
await check("SEARCH tab", async () => {
  await page.click("text=🔍 SEARCH");
  await page.waitForSelector("text=SEARCH", { timeout: 3000 });
});
await check("SUPPS tab", async () => {
  await page.click("text=💊 SUPPS");
  await page.waitForSelector("text=SUPPLEMENT", { timeout: 3000 });
});

// ── SQUAD SCREEN ──
console.log("\n=== SQUAD SCREEN ===");
await check("Navigate to SQUAD", async () => {
  await navTo("SQUAD", "text=SQUAD FEED");
});
await page.screenshot({ path: "/tmp/ss-squad.png" });

await check("Squad feed loaded", async () => {
  await page.waitForSelector("text=SQUAD FEED", { timeout: 3000 });
});
await check("Open compose sheet", async () => {
  await page.click("text=+ POST");
  await page.waitForSelector("text=SHARE WITH THE SQUAD", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-compose.png" });
await check("Challenge type in compose", async () => {
  await page.waitForSelector("text=CHALLENGE", { timeout: 3000 });
});
await check("Close compose sheet", async () => {
  await page.mouse.click(195, 100);
  await page.waitForSelector("text=SQUAD FEED", { timeout: 3000 });
});

// ── MORE SCREEN ──
console.log("\n=== MORE SCREEN ===");
await check("Navigate to MORE", async () => {
  await navTo("MORE", "text=AI COACH");
});
await page.screenshot({ path: "/tmp/ss-more.png" });

for (const [tile, content] of [
  ["GOALS", "WEEKLY SESSIONS"],
  ["WEEKLY REPORTS", "WEEKLY REPORT"],
  ["ACCOUNTABILITY", "PLEDGE"],
  ["NOTIFICATIONS", "NOTIFICATION"],
  ["MACRO COACH", "MACRO"],
]) {
  await check(`${tile} modal opens`, async () => {
    await page.click(`text=${tile}`);
    await page.waitForSelector(`text=${content}`, { timeout: 3000 });
  });
  await check(`${tile} modal closes`, async () => {
    const closeBtns = await page.$$("text=✕");
    await closeBtns[closeBtns.length - 1].dispatchEvent("click");
    await page.waitForSelector("text=AI COACH", { timeout: 3000 });
  });
}

// ── TRAIN — start a session ──
console.log("\n=== START SESSION FLOW ===");
await check("Navigate back to TRAIN TRACK tab", async () => {
  await navTo("TRAIN", null);
  await page.waitForSelector("text=HUB", { timeout: 5000 });
  // Go to TRACK sub-tab
  await page.click("text=TRACK");
  await page.waitForSelector("text=SESSION NAME", { timeout: 3000 });
});

await check("Add exercise via browse picker", async () => {
  const btn = await page.$("[title='Browse exercises']");
  if (!btn) throw new Error("No [title='Browse exercises'] button found");
  await btn.dispatchEvent("click");
  await page.waitForSelector("text=BROWSE EXERCISES", { timeout: 3000 });
});
await check("Search for Barbell Squat", async () => {
  await page.fill("input[placeholder*='SEARCH']", "squat");
  await page.waitForSelector("text=Barbell Squat", { timeout: 3000 });
});
await check("Select Barbell Squat", async () => {
  await page.click("text=Barbell Squat");
  await page.waitForSelector("text=ADD SET", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-session.png" });

await check("Recovery alert shown (high quad score from demo)", async () => {
  await page.waitForSelector("text=Recovery Alert", { timeout: 5000 });
});
await page.screenshot({ path: "/tmp/ss-recovery-alert.png" });

await check("Add a set", async () => {
  await page.click("text=ADD SET");
  await page.waitForTimeout(300);
});
await page.screenshot({ path: "/tmp/ss-set-added.png" });

await check("Session type tags visible", async () => {
  await page.waitForSelector("text=Push", { timeout: 3000 });
});

// ── CONSOLE ERRORS ──
console.log("\n=== CONSOLE ERRORS ===");
if (errors.length === 0) {
  console.log("  ✅ No JS console errors");
} else {
  errors.forEach(e => console.error("  ❌ " + e));
}

await browser.close();

console.log("\n=== SUMMARY ===");
if (warns.length === 0 && errors.length === 0) {
  console.log("✅ All checks passed!");
} else {
  if (warns.length > 0) {
    console.log(`❌ ${warns.length} test failure(s):`);
    warns.forEach(w => console.log(`  • ${w.label}: ${w.err.slice(0, 100)}`));
  }
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} console error(s):`);
    errors.slice(0, 5).forEach(e => console.log("  " + e.slice(0, 120)));
  }
}
process.exit(warns.length > 0 || errors.length > 0 ? 1 : 0);
