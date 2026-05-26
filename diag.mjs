// Targeted diagnostic — simplified, avoids timing issues
import { chromium } from "playwright";
const URL = "http://localhost:5173/?demo=1";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const today = new Date().toISOString().slice(0, 10);
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

ctx.addInitScript((params) => {
  localStorage.setItem("sfc_onboarded", "1");
  localStorage.setItem("sfc_profile_setup_done", "1");
  localStorage.setItem("sfc_tour_done", "1");
  localStorage.setItem("sfc_daily_motiv", params.today);
  localStorage.setItem("sfc_nutrition_log", JSON.stringify([
    { date: params.yesterday, items: [{ name: "Chicken Rice", cal: 500, pro: 40, carb: 50, fat: 8, meal: "lunch" }] }
  ]));
  localStorage.setItem("sfc_body_log", JSON.stringify([
    { date: params.today, weight: "180", bf: "15" },
    { date: params.yesterday, weight: "182", bf: "16" }
  ]));
  localStorage.setItem("sfc_goals", JSON.stringify({ weekly: 4, volume: 10000, streak: 7 }));
  localStorage.setItem("sfc_water_goal", "64");
  localStorage.setItem("sfc_streak_freezes", "2");
}, { today, yesterday });

const page = await browser.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const nav = async (label) => {
  await page.locator("button").filter({ hasText: new RegExp(label, "i") }).first().click({ force: true });
  await page.waitForTimeout(900);
};
const close = async () => {
  const b = page.locator("button").filter({ hasText: /✕|×/ }).first();
  if (await b.isVisible().catch(()=>false)) await b.click({ force: true });
  else await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
};

// ── HOME: quick-start cards ──
const qsDivCount = await page.evaluate(() =>
  [...document.querySelectorAll("div")].filter(d => {
    const t = d.textContent?.trim();
    return /^(PUSH DAY|PULL DAY|LEG DAY|FULL BODY)$/i.test(t);
  }).length
);
console.log(`HOME quick-start card divs: ${qsDivCount}`);

// ── TRAIN: TRACK sub-tab & exercise input ──
await nav("TRAIN");
// default is TRACK — enumerate all button texts visible
const trainBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => b.textContent?.trim().slice(0,25)).filter(t => t && t.length > 0).slice(0,25)
);
console.log("TRAIN buttons visible:", JSON.stringify(trainBtns));

// exercise input
const exPlaceholders = await page.evaluate(() =>
  [...document.querySelectorAll("input")].map(i => i.placeholder).filter(Boolean)
);
console.log("TRAIN input placeholders:", JSON.stringify(exPlaceholders));

// type in exercise
const exInput = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll("input")];
  return inputs.find(i => /exercise/i.test(i.placeholder))?.placeholder || "NOT FOUND";
});
console.log("TRAIN exercise input placeholder:", exInput);

// fill it
const inp = page.locator(`input[placeholder="${exInput}"]`).first();
if (await inp.isVisible().catch(()=>false)) {
  await inp.fill("bench");
  await page.waitForTimeout(700);
  const suggs = await page.evaluate(() =>
    [...document.querySelectorAll("div")].filter(d => {
      const t = d.textContent?.trim();
      return /bench/i.test(t) && t.length < 50 && t.length > 3;
    }).map(d => d.textContent.trim()).slice(0,5)
  );
  console.log("TRAIN bench suggestions:", JSON.stringify(suggs));
  // click a suggestion
  try {
    await page.evaluate(() => {
      const el = [...document.querySelectorAll("div")].find(d => d.textContent.trim() === "Barbell Bench Press");
      el?.click();
    });
    await page.waitForTimeout(600);
    const addSetBtns = await page.evaluate(() =>
      [...document.querySelectorAll("button")].filter(b => /\+ SET|\+SET/i.test(b.textContent)).map(b => b.textContent.trim())
    );
    console.log("TRAIN +SET buttons after exercise select:", JSON.stringify(addSetBtns));

    // fill reps/weight
    const setInputs = await page.evaluate(() =>
      [...document.querySelectorAll("input[type=number],input[inputmode=numeric],input[inputmode=decimal]")]
        .map(i => ({ ph: i.placeholder, type: i.inputMode || i.type }))
    );
    console.log("TRAIN set inputs:", JSON.stringify(setInputs.slice(0,4)));
  } catch(e) { console.log("TRAIN exercise click err:", e.message); }
}

// save button
const saveBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")].filter(b => /SAVE|FINISH|COMPLETE/i.test(b.textContent)).map(b => b.textContent.trim().slice(0,30))
);
console.log("TRAIN save-like buttons:", JSON.stringify(saveBtns));

// ── PROGRAMS ──
await page.locator("button").filter({ hasText: /PROGRAMS/i }).first().click({ force: true });
await page.waitForTimeout(700);
const progEls = await page.evaluate(() =>
  [...document.querySelectorAll("button,div[onClick],div[style*='cursor: pointer'],div[style*='cursor:pointer']")]
    .filter(el => /GOLDEN|POWERLIFTING|FAT|ATHLETE|HYPERTROPHY/i.test(el.textContent))
    .map(el => `${el.tagName}: "${el.textContent.trim().slice(0,35)}"`)
    .slice(0,5)
);
console.log("TRAIN program elements:", JSON.stringify(progEls));

// ── STATS: water tracker after scroll ──
await nav("STATS");
await page.locator("button").filter({ hasText: /^STATS$/i }).first().click({ force: true }).catch(()=>{});
await page.waitForTimeout(500);
// scroll down in main
await page.evaluate(() => document.querySelector("main")?.scrollTo(0, 800));
await page.waitForTimeout(400);
const waterBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")].filter(b => /^\s*(8|12|16|20)\s*(oz)?\s*$/i.test(b.textContent?.trim())).map(b => b.textContent.trim())
);
console.log("STATS water buttons (after scroll):", JSON.stringify(waterBtns));

// ── FUEL: search input placeholder ──
await nav("FUEL");
// click SEARCH tab
const fuelTabs = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => b.textContent?.trim()).filter(t => /SEARCH|SCAN|LOG|SUPPS/i.test(t) && t.length < 15)
);
console.log("FUEL tab buttons:", JSON.stringify(fuelTabs));

await page.locator("button").filter({ hasText: /🔍 SEARCH|SEARCH/i }).first().click({ force: true });
await page.waitForTimeout(500);
const searchInputPh = await page.evaluate(() =>
  [...document.querySelectorAll("input")].map(i => i.placeholder).filter(Boolean)
);
console.log("FUEL search inputs:", JSON.stringify(searchInputPh));

// type something and check results
const sInp = page.locator("input").filter({ hasAttribute: "placeholder" }).first();
if (await sInp.isVisible().catch(()=>false)) {
  await sInp.fill("chicken");
  await page.waitForTimeout(600);
  const results2 = await page.evaluate(() =>
    [...document.querySelectorAll("button")].filter(b => /chicken/i.test(b.textContent)).map(b => b.textContent.trim().slice(0,30))
  );
  console.log("FUEL chicken results:", JSON.stringify(results2.slice(0,4)));
}

// ── FUEL: past days - element type ──
// find LOG tab
const logTabBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => ({t: b.textContent.trim(), v: b.offsetWidth > 0})).filter(x => x.v).map(x => x.t).slice(0,15)
);
console.log("FUEL visible buttons:", JSON.stringify(logTabBtns));

// ── SQUAD: compose type buttons ──
await nav("SQUAD");
await page.locator("button").filter({ hasText: /\+ POST/i }).first().click({ force: true });
await page.waitForTimeout(700);
const composeBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => b.textContent?.trim()).filter(t => t && t.length < 25).slice(0,20)
);
console.log("SQUAD compose buttons:", JSON.stringify(composeBtns));
await page.mouse.click(195, 50);
await page.waitForTimeout(500);

// ── MORE: tile buttons text ──
await nav("MORE");
await page.evaluate(() => document.querySelector("main")?.scrollTo(0, 0));
await page.waitForTimeout(300);
const moreTileBtns = await page.evaluate(() =>
  [...document.querySelectorAll("button")].map(b => b.textContent?.trim().replace(/\s+/g,' ').slice(0,35)).filter(Boolean).slice(0,20)
);
console.log("MORE tile buttons:", JSON.stringify(moreTileBtns));

// ── MORE: notifications - what kind of toggle ──
await page.locator("button").filter({ hasText: /NOTIFICATIONS/i }).first().click({ force: true });
await page.waitForTimeout(600);
const notifEls = await page.evaluate(() => {
  return [...document.querySelectorAll("button,input,div[role]")]
    .map(el => ({ tag: el.tagName, type: el.type||'', role: el.role||'', txt: el.textContent?.trim().slice(0,20)||'' }))
    .filter(x => x.txt.length > 0)
    .slice(0,10);
});
console.log("NOTIFICATIONS modal elements:", JSON.stringify(notifEls));
await close();

console.log(`\nConsole errors: ${errors.length}`, errors.slice(0,2));
await browser.close();
