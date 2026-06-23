import { chromium } from "playwright";
const URL = "http://localhost:5173/?demo=1";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: CHROME });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const today = new Date().toISOString().slice(0, 10);

ctx.addInitScript((p) => {
  localStorage.setItem("sfc_onboarded", "1");
  localStorage.setItem("sfc_profile_setup_done", "1");
  localStorage.setItem("sfc_tour_done", "1");
  localStorage.setItem("sfc_daily_motiv", p.today);
}, { today });

const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/app_initial.png" });

// Navigate to TRAIN and screenshot
await page.locator("button").filter({ hasText: /TRAIN/i }).first().click({ force: true });
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/app_train.png" });

// print all visible button texts
const btns = await page.evaluate(() =>
  [...document.querySelectorAll("button")]
    .filter(b => b.offsetWidth > 0)
    .map(b => b.textContent.trim().replace(/\s+/g, " ").slice(0, 30))
);
console.log("All buttons on TRAIN screen:", JSON.stringify(btns));

await browser.close();
