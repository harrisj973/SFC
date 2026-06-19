import { chromium } from "playwright";

const BASE = "http://localhost:5179/?demo=1";
let P=0,F=0,W=0;
const shots=[];
const log=(e,l,d="")=>{ console.log(`${e} ${l}${d?" — "+d:""}`); if(e==="✅")P++; else if(e==="❌")F++; else if(e==="⚠️")W++; };

const br = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args:["--no-sandbox"] });
const ctx = await br.newContext({ viewport:{width:390,height:844} });
await ctx.addInitScript(()=>{
  const t=new Date().toISOString().slice(0,10);
  localStorage.setItem("sfc_onboarded","1"); localStorage.setItem("sfc_profile_setup_done","1");
  localStorage.setItem("sfc_tour_done","1"); localStorage.setItem("sfc_daily_motiv",t);
});
const page = await ctx.newPage();
const errs=[];
page.on("pageerror",e=>errs.push(e.message));
page.on("console",m=>{ if(m.type()==="error") errs.push(m.text()); });

const shot=async n=>{ const p=`/tmp/${n}.png`; await page.screenshot({path:p}); shots.push(n); };
const closeAny=async()=>{
  // try all close patterns used in the app
  for (const txt of ["✕ CLOSE","✕","CLOSE"]) {
    const b=page.locator("button", { hasText: new RegExp(`^${txt}$`) }).first();
    if (await b.isVisible({timeout:300}).catch(()=>false)) { await b.click(); await page.waitForTimeout(400); return; }
  }
  await page.keyboard.press("Escape"); await page.waitForTimeout(300);
};
const goTab=async t=>{
  await page.evaluate(tab=>{
    [...document.querySelectorAll("[data-tour^='tab-']")].find(b=>b.innerText.trim()===tab)?.click();
  }, t);
  await page.waitForTimeout(700);
};

await page.goto(BASE,{waitUntil:"networkidle"});
await page.waitForTimeout(800);

// ═══ 1. HOME — MY BADGES card ═══
log(await page.locator("text=MY BADGES").first().isVisible().catch(()=>false)?"✅":"❌","MY BADGES card on HomeScreen");
log(await page.locator("text=/\\d+ of 29 unlocked/").isVisible().catch(()=>false)?"✅":"⚠️","Badge count 'X of 29'");
// Check unlocked badge icons appear (demo data should have sessions → first_session badge at minimum)
const badgeIcons=await page.locator("text=MY BADGES").first().locator("..").locator("..").locator("div[style*='border-radius:9px']").count().catch(()=>0);
log(badgeIcons>0?"✅":"⚠️",`Badge icon tiles in preview: ${badgeIcons}`);
await shot("01_home");

// Open modal from home
await page.locator("text=MY BADGES").first().click();
await page.waitForTimeout(500);
const modalOpen=await page.locator("text=✕ CLOSE").isVisible().catch(()=>false);
log(modalOpen?"✅":"⚠️","AchievementsModal has '✕ CLOSE' button (verifies it opened)");
await shot("02_achievements_modal");
await closeAny(); // use "✕ CLOSE"
log(await page.locator("text=✕ CLOSE").isVisible({timeout:400}).catch(()=>false)===false?"✅":"⚠️","Modal closes properly");

// ═══ 2. LAYOUT ═══
const navPos=await page.evaluate(()=>{ const n=document.querySelector("[data-tour='nav']")?.parentElement; return n?window.getComputedStyle(n).position:"?"; });
log(navPos==="static"?"✅":"⚠️",`Nav bar position: ${navPos}`);
const mainOvf=await page.evaluate(()=>window.getComputedStyle(document.querySelector("main")).overflowY);
log(mainOvf==="auto"?"✅":"⚠️",`<main> overflow-y: ${mainOvf}`);
const appH=await page.evaluate(()=>{ const el=document.getElementById("root")?.firstElementChild; return el?window.getComputedStyle(el).height:"?"; });
log("🔍",`App container height: ${appH} (should be 844px)`);

// ═══ 3. TRAIN ═══
await goTab("TRAIN");

// Plate Calculator
await page.locator("button",{hasText:/PLATES/i}).click();
await page.waitForTimeout(500);
log(await page.locator("text=PLATE CALCULATOR").isVisible().catch(()=>false)?"✅":"❌","Plate Calculator opens");
const tgtInput=page.locator("input[placeholder='E.G. 225']");
log(await tgtInput.isVisible().catch(()=>false)?"✅":"⚠️","Target weight input visible");
await tgtInput.fill("225").catch(()=>{});
await page.waitForTimeout(300);
const barSvg=await page.locator("svg").count(); 
log(barSvg>0?"✅":"⚠️",`Bar diagram SVG present (count: ${barSvg})`);
await shot("03_plate_calc");
await closeAny();

// Training Max Calc
await page.locator("button",{hasText:/TM/i}).first().click();
await page.waitForTimeout(400);
log(await page.locator("text=TRAINING MAX CALC").isVisible().catch(()=>false)?"✅":"❌","TM Calc opens");
const rmInp=page.locator("input[placeholder='e.g. 315']");
log(await rmInp.isVisible().catch(()=>false)?"✅":"⚠️","1RM input visible (bottom padding fix)");
await rmInp.fill("315").catch(()=>{});
await page.waitForTimeout(300);
log(await page.locator("text=90%").isVisible().catch(()=>false)?"✅":"⚠️","Percentage grid shows 90%");
await shot("04_tm_calc");
await closeAny();

// Exercise demo — no duplicate badges
await page.locator("button",{hasText:/^TRACK$/i}).first().click();
await page.waitForTimeout(300);
const browseBtn=page.locator("button",{hasText:/BROWSE/i}).first();
if (await browseBtn.isVisible().catch(()=>false)) {
  await browseBtn.click(); await page.waitForTimeout(500);
  const demoBtn=page.locator("button").filter({hasText:/📹/}).first();
  if (await demoBtn.isVisible().catch(()=>false)) {
    await demoBtn.click(); await page.waitForTimeout(400);
    await shot("05_exercise_demo");
    const txt=await page.evaluate(()=>document.body.innerText);
    log(!/CHEST\s+CHEST|BACK\s+BACK|SHOULDERS\s+SHOULDERS/i.test(txt)?"✅":"❌","No duplicate category badges");
    await closeAny();
  }
  await closeAny();
}

// PROGRAMS list
await page.locator("button",{hasText:/^PROGRAMS$/i}).first().click();
await page.waitForTimeout(500);
const progCards=await page.locator("text=4X/WK").count();
log(progCards>=3?"✅":"⚠️",`Programs list visible: ${progCards} cards`);
await shot("06_programs");

// ═══ 4. STATS / CHARTS ═══
await goTab("STATS");
const chartsBtn=page.locator("button",{hasText:/^CHARTS$/i}).first();
log(await chartsBtn.isVisible().catch(()=>false)?"✅":"❌","CHARTS sub-tab exists");
await chartsBtn.click(); await page.waitForTimeout(500);
await shot("07_charts_tab");

// Exercise pills from demo data
const firstPill=page.locator("button").filter({hasText:/Barbell Bench|Barbell Squat|Barbell Row|Lat Pull|Deadlift/i}).first();
const hasPills=await firstPill.isVisible().catch(()=>false);
log(hasPills?"✅":"⚠️","Exercise pills present (2+ sessions per exercise in demo data)");

if (hasPills) {
  const pillText=await firstPill.innerText();
  await firstPill.click(); await page.waitForTimeout(700);
  await shot("08_charts_exercise");
  log(await page.locator("text=BEST SET WEIGHT").isVisible().catch(()=>false)?"✅":"❌","BEST SET WEIGHT chart renders");
  log(await page.locator("text=ESTIMATED 1RM TREND").isVisible().catch(()=>false)?"✅":"❌","ESTIMATED 1RM TREND chart renders");
  log(await page.locator("text=TOTAL SESSION VOLUME").isVisible().catch(()=>false)?"✅":"❌","TOTAL SESSION VOLUME chart renders");
  const svgs=await page.locator("svg").count();
  log(svgs>=3?"✅":"⚠️",`SVG count after selecting '${pillText}': ${svgs}`);
  // Month labels check
  const monthLabel=await page.locator("text=/^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/").first().isVisible().catch(()=>false);
  log(monthLabel?"✅":"🔍","Month labels appear on chart x-axis");
}

// STATS and MAP still work
await page.locator("button",{hasText:/^STATS$/i}).first().click(); await page.waitForTimeout(300);
log(await page.locator("text=SESSIONS").first().isVisible().catch(()=>false)?"✅":"❌","STATS sub-tab still works");
await page.locator("button",{hasText:/^MAP$/i}).first().click(); await page.waitForTimeout(400);
log(await page.locator("svg").first().isVisible().catch(()=>false)?"✅":"⚠️","MAP (heatmap) still works");
await shot("09_heatmap");
// STREAK
await page.locator("button",{hasText:/^STREAK$/i}).first().click(); await page.waitForTimeout(300);
log(await page.locator("text=/STREAK|FREEZE/i").first().isVisible().catch(()=>false)?"✅":"🔍","STREAK sub-tab (probe)");

// ═══ 5. MORE ═══
await goTab("MORE");
log(await page.locator("text=MY BADGES").first().isVisible().catch(()=>false)?"✅":"⚠️","MY BADGES tile still in MoreScreen");
await shot("10_more");

// ═══ 6. FUEL ═══
await goTab("FUEL");
await page.waitForTimeout(400);
log(await page.locator("text=/LOG|SCAN|SEARCH/i").first().isVisible().catch(()=>false)?"✅":"⚠️","FUEL screen renders");

// ═══ 7. SQUAD ═══
await goTab("SQUAD");
await page.waitForTimeout(500);
log(await page.locator("text=/FOLLOWING|DISCOVER/i").first().isVisible().catch(()=>false)?"✅":"⚠️","SQUAD feed renders");

// ═══ 8. Console errors ═══
const appErrs=errs.filter(e=>!e.includes("supabase")&&!e.includes("fetch")&&!e.includes("ERR_")&&!e.includes("net::"));
log(appErrs.length===0?"✅":"⚠️",`JS errors (app, non-network): ${appErrs.length}`);
if(appErrs.length) appErrs.slice(0,5).forEach(e=>console.log("  ERR:",e.slice(0,160)));

// 🔍 Probe: rapid CHARTS tab switching doesn't crash
await goTab("STATS");
for(let i=0;i<3;i++){
  await page.locator("button",{hasText:/^CHARTS$/i}).first().click(); await page.waitForTimeout(80);
  await page.locator("button",{hasText:/^STATS$/i}).first().click(); await page.waitForTimeout(80);
}
const postErrs=errs.filter(e=>!e.includes("supabase")&&!e.includes("fetch")&&!e.includes("ERR_")).length;
log(postErrs===0?"✅":"⚠️","Rapid CHARTS switching doesn't crash (probe)");

await br.close();
console.log(`\n══ ${P} ✅  ${F} ❌  ${W} ⚠️  ══`);
console.log("Screenshots:", shots.join(", "));
