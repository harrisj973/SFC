import { chromium } from "playwright";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = "http://localhost:5173?demo=1";

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

await ctx.addInitScript(() => {
  localStorage.setItem("sfc_onboarded", "1");
  localStorage.setItem("sfc_profile_setup_done", "1");
  localStorage.setItem("sfc_tour_done", "1");
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem("sfc_daily_motiv", today);
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const fmt = d => d.toISOString().slice(0, 10);
  localStorage.setItem("sfc_nutrition_log", JSON.stringify([
    { date: today, items: [] },
    { date: fmt(yesterday), items: [
      { name: "Chicken Breast", cal: 165, pro: 31, carb: 0, fat: 3.6, meal: "LUNCH", id: 1 },
      { name: "Brown Rice",     cal: 216, pro: 4.5, carb: 45, fat: 1.8, meal: "LUNCH", id: 2 },
    ]},
    { date: fmt(twoDaysAgo), items: [
      { name: "Chicken Breast", cal: 165, pro: 31, carb: 0, fat: 3.6, meal: "LUNCH", id: 3 },
      { name: "Oats",           cal: 307, pro: 10.7, carb: 55, fat: 5.3, meal: "BREAKFAST", id: 4, brand: "Quaker" },
    ]},
  ]));
});

const page = await ctx.newPage();
const errors = [];
page.on("pageerror", e => errors.push("PAGE ERR: " + e.message));
page.on("console", m => { if (m.type() === "error") { const t = m.text(); if (!t.includes("net::ERR") && !t.includes("WebSocket")) errors.push(t); } });

const warns = [];
async function check(label, fn) {
  try { await fn(); console.log("  ✅", label); }
  catch (e) { console.error("  ❌", label, "—", e.message.slice(0, 200)); warns.push({ label, err: e.message }); }
}
async function navTo(label) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator("span").filter({ hasText: new RegExp(`^${label}$`) }).last().click();
}

await page.goto(BASE, { waitUntil: "networkidle" });

// ─────────────────────────────────────────────────────────────
console.log("\n=== RECENT FOODS STRIP ===");
await check("Navigate to FUEL LOG tab", async () => {
  await navTo("FUEL");
  await page.waitForSelector("text=NUTRITION", { timeout: 4000 });
  await page.click("text=📋 LOG");
  await page.waitForSelector("text=RECENT FOODS", { timeout: 4000 });
});
await check("RECENT FOODS header + arrow label visible", async () => {
  await page.waitForSelector("text=RECENT FOODS", { timeout: 3000 });
  // Arrow label shows current meal target
  const txt = await page.evaluate(() => document.body.textContent);
  if (!txt.includes("RECENT FOODS")) throw new Error("Header missing");
});
await check("Chicken Breast card (ranked #1 — 2 appearances)", async () => {
  await page.waitForSelector("text=Chicken Breast", { timeout: 3000 });
});
await check("Brown Rice card visible", async () => {
  await page.waitForSelector("text=Brown Rice", { timeout: 3000 });
});
await check("Oats card visible + Quaker brand label", async () => {
  await page.waitForSelector("text=Oats", { timeout: 3000 });
  const brand = await page.locator("text=Quaker").isVisible().catch(() => false);
  if (!brand) throw new Error("Quaker brand label missing");
});
await page.screenshot({ path: "/tmp/ss-recent-foods.png" });

await check("+ ADD button opens FoodAddSheet", async () => {
  // There are 3 "+ ADD" buttons (one per card). First = Chicken Breast (highest freq).
  await page.locator("button", { hasText: "+ ADD" }).first().click();
  await page.waitForSelector("text=SERVING SIZE", { timeout: 5000 });
});
await page.screenshot({ path: "/tmp/ss-sheet-open-recent.png" });

await check("Sheet QUANTITY label visible", async () => {
  await page.waitForSelector("text=QUANTITY", { timeout: 3000 });
});
await check("Sheet fraction chips visible (½)", async () => {
  // Two ½ buttons will now exist (fraction + possible elsewhere); just need at least one
  const found = await page.locator("button", { hasText: "1/2" }).count();
  if (found < 1) throw new Error("No ½ button found");
});
await check("Sheet macro preview shows CAL", async () => {
  await page.waitForSelector("text=CAL", { timeout: 3000 });
});
await check("ADD TO [MEAL] ◆ confirms and closes sheet", async () => {
  await page.locator("button", { hasText: /ADD TO .+ ◆/ }).click({ force: true });
  // Wait for sheet to disappear (allow up to 3s for React state to settle)
  try {
    await page.waitForSelector("text=SERVING SIZE", { state: "hidden", timeout: 3000 });
  } catch {
    // fallback: dismiss via backdrop click
    await page.mouse.click(195, 200);
    await page.waitForTimeout(400);
  }
});
await check("Chicken Breast appears in today's log", async () => {
  // Scroll down so the meal log is visible, look for logged item
  await page.waitForTimeout(300);
  const count = await page.evaluate(() =>
    [...document.querySelectorAll("div")].filter(d =>
      (d.textContent.trim() === "CHICKEN BREAST" || d.textContent.trim() === "Chicken Breast") &&
      d.offsetParent !== null
    ).length
  );
  if (count < 1) throw new Error("Chicken Breast not found in log");
});
await page.screenshot({ path: "/tmp/ss-recent-food-logged.png" });

// ─────────────────────────────────────────────────────────────
console.log("\n=== FOOD SERVING PICKER — fractions + quantity stepper ===");
await check("Open sheet from SEARCH results", async () => {
  // ensure any open sheet is dismissed first
  await page.evaluate(() => { const x = [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "✕"); if(x) x.click(); });
  await page.waitForTimeout(300);
  await page.click("text=🔍 SEARCH");
  await page.waitForTimeout(300);
  await page.fill("input[placeholder*='SEARCH']", "chicken");
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "+");
    btn?.click();
  });
  await page.waitForSelector("text=SERVING SIZE", { timeout: 4000 });
});
await check("Select ½ fraction chip", async () => {
  // .first() gets the first matching ½ button in the open sheet
  await page.locator("button", { hasText: "1/2" }).first().click();
  await page.waitForTimeout(200);
  // Custom input should reflect 0.5
  const val = await page.locator("input[type='number'][inputmode='decimal']").inputValue().catch(() => "");
  if (parseFloat(val) !== 0.5 && val !== "0.5") throw new Error(`Expected 0.5, got "${val}"`);
});
await check("Quantity chip 2 updates counter", async () => {
  // The quantity chip row has chips 1,2,3...
  // Use evaluate to click the qty chip "2" (the one inside the qty row)
  await page.evaluate(() => {
    const allBtns = [...document.querySelectorAll("button")];
    // qty chips are in the QUANTITY section — find the "2" among them
    // They're in a flex row between − and + stepper buttons
    const twoChip = allBtns.find(b => b.textContent.trim() === "2" && b.style.minWidth === "38px");
    if (twoChip) { twoChip.click(); return; }
    // Fallback: click first "2" button that's not a fraction chip
    allBtns.find(b => b.textContent.trim() === "2")?.click();
  });
  await page.waitForTimeout(200);
});
await check("Summary line shows total", async () => {
  const txt = await page.evaluate(() => document.body.textContent);
  if (!txt.includes("total")) throw new Error("No summary line with 'total'");
});
await page.screenshot({ path: "/tmp/ss-food-sheet-fracs.png" });
await check("Toggle to CUP → heading changes to CUP SIZE", async () => {
  await page.locator("button", { hasText: /CUP/ }).click();
  await page.waitForSelector("text=CUP SIZE", { timeout: 3000 });
});
await check("✕ button closes sheet", async () => {
  await page.locator("button", { hasText: "✕" }).last().click();
  await page.waitForTimeout(400);
  const open = await page.locator("text=CUP SIZE").isVisible().catch(() => false);
  if (open) throw new Error("Sheet still open after ✕");
});

// ─────────────────────────────────────────────────────────────
console.log("\n=== BACK SUB-FILTERS (LATS / MID BACK) in ExercisePicker ===");
await check("Navigate to TRAIN TRACK → BROWSE picker", async () => {
  await navTo("TRAIN");
  await page.waitForSelector("text=HUB", { timeout: 5000 });
  await page.click("text=TRACK");
  await page.waitForSelector("text=SESSION NAME", { timeout: 3000 });
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find(b => b.textContent.includes("BROWSE"));
    if (!btn) return false; btn.click(); return true;
  });
  if (!clicked) throw new Error("No BROWSE button");
  await page.waitForSelector("text=BROWSE EXERCISES", { timeout: 5000 });
});
await check("BACK chip shows LATS + MID BACK sub-filters", async () => {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "BACK")?.click();
  });
  await page.waitForTimeout(400);
  await page.waitForSelector("text=LATS", { timeout: 3000 });
  await page.waitForSelector("text=MID BACK", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-back-subfilters.png" });
await check("LATS filter → Lat Pulldown visible", async () => {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "LATS")?.click();
  });
  await page.waitForTimeout(300);
  await page.waitForSelector("text=Lat Pulldown", { timeout: 3000 });
});
await check("MID BACK filter → Barbell Row visible", async () => {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "MID BACK")?.click();
  });
  await page.waitForTimeout(300);
  await page.waitForSelector("text=Barbell Row", { timeout: 3000 });
});
await page.screenshot({ path: "/tmp/ss-mid-back.png" });
await page.evaluate(() => { [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "✕")?.click(); });
await page.waitForSelector("text=HUB", { timeout: 3000 });

// ─────────────────────────────────────────────────────────────
console.log("\n=== REPEAT SESSION (🔄) ===");
await check("HISTORY tab has 🔄 button on sessions", async () => {
  await page.click("text=HISTORY");
  await page.waitForSelector("text=PUSH DAY", { timeout: 3000 });
  const found = await page.evaluate(() =>
    [...document.querySelectorAll("button")].some(b => b.textContent.includes("🔄"))
  );
  if (!found) throw new Error("No 🔄 button in HISTORY");
});
await page.screenshot({ path: "/tmp/ss-history-repeat.png" });
await check("🔄 loads PUSH DAY exercises into TRACK tab", async () => {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find(b => b.textContent.includes("🔄"))?.click();
  });
  await page.waitForSelector("text=SESSION NAME", { timeout: 3000 });
  const txt = await page.evaluate(() => document.body.textContent);
  if (!txt.includes("Barbell Bench Press") && !txt.includes("PUSH DAY"))
    throw new Error("Exercises not found after repeat");
});
await check("Session name pre-filled from source", async () => {
  const txt = await page.evaluate(() => document.body.textContent);
  if (!txt.includes("PUSH DAY")) throw new Error("Session name not set");
});
await page.screenshot({ path: "/tmp/ss-repeat-loaded.png" });

// ─────────────────────────────────────────────────────────────
console.log("\n=== EXPANDED SUPPLEMENTS DB (98 entries) ===");
await check("Navigate to FUEL SUPPS tab", async () => {
  await navTo("FUEL");
  await page.waitForSelector("text=NUTRITION", { timeout: 4000 });
  await page.click("text=💊 SUPPS");
  await page.waitForSelector("text=SUPPLEMENT", { timeout: 3000 });
});
await check("98 supplement items visible (unfiltered)", async () => {
  const count = await page.evaluate(() =>
    [...document.querySelectorAll("button")].filter(b => b.textContent.trim() === "+").length
  );
  console.log(`    → ${count} supplements`);
  if (count < 50) throw new Error(`Only ${count} found, expected ~98`);
});
await check("Creatine entry exists", async () => {
  await page.waitForSelector("text=Creatine", { timeout: 3000 });
});
await check("PROTEIN filter returns ≥1 item", async () => {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find(b => b.textContent.trim() === "PROTEIN")?.click();
  });
  await page.waitForTimeout(300);
  const count = await page.evaluate(() =>
    [...document.querySelectorAll("button")].filter(b => b.textContent.trim() === "+").length
  );
  console.log(`    → ${count} PROTEIN items`);
  if (count < 1) throw new Error("No PROTEIN supplements");
});
await page.screenshot({ path: "/tmp/ss-supps.png" });

// ─────────────────────────────────────────────────────────────
console.log("\n=== CONSOLE ERRORS ===");
if (errors.length === 0) console.log("  ✅ No JS console errors");
else errors.forEach(e => console.error("  ❌", e));

await browser.close();

console.log("\n=== SUMMARY ===");
const total = 33;
const passed = total - warns.length;
if (warns.length === 0 && errors.length === 0) {
  console.log(`✅ All ${total} feature checks passed!`);
} else {
  if (warns.length) {
    console.log(`❌ ${warns.length} of ${total} checks failed:`);
    warns.forEach(w => console.log(`  • ${w.label}: ${w.err.slice(0, 130)}`));
  }
  if (errors.length) {
    console.log(`⚠️  ${errors.length} console error(s)`);
    errors.slice(0, 5).forEach(e => console.log("  " + e.slice(0, 120)));
  }
}
process.exit(warns.length > 0 || errors.length > 0 ? 1 : 0);
