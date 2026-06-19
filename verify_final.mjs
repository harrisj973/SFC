import { chromium } from "playwright";

const BASE = "http://localhost:5179/?demo=1";
let P=0,F=0,W=0; const shots=[];
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

const shot=async n=>{ const p=`/tmp/${n}.png`; await page.screenshot({path:p,fullPage:false}); shots.push(n); };
// Use data-tour attributes — reliable, no text-match ambiguity
const goTab=async id=>{
  await page.locator(`[data-tour="tab-${id}"]`).click();
  await page.waitForTimeout(700);
};
const closeAny=async()=>{
  for(const txt of ["✕ CLOSE","✕"]){
    const b=page.locator("button",{hasText:new RegExp(`^${txt.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}$`)}).first();
    if(await b.isVisible({timeout:300}).catch(()=>false)){await b.click();await page.waitForTimeout(400);return;}
  }
  await page.keyboard.press("Escape");await page.waitForTimeout(300);
};

await page.goto(BASE,{waitUntil:"networkidle"});
await page.waitForTimeout(900);

// ═══ HOME ═══
log(await page.locator("text=MY BADGES").first().isVisible().catch(()=>false)?"✅":"❌","MY BADGES card on HomeScreen");
log(await page.locator("text=/\\d+ of 29 unlocked/").isVisible().catch(()=>false)?"✅":"⚠️","Badge count label");
await shot("01_home");

// Open AchievementsModal from home
await page.locator("text=MY BADGES").first().click();
await page.waitForTimeout(600);
const achModalOpen=await page.locator("text=✕ CLOSE").isVisible().catch(()=>false);
log(achModalOpen?"✅":"⚠️","AchievementsModal opens from home card");
await shot("02_badges_modal");
// Check badge content
const trainingChip=await page.locator("button",{hasText:/TRAINING/}).first().isVisible().catch(()=>false);
log(trainingChip?"✅":"⚠️","Category chips visible in AchievementsModal");
await closeAny();
log(await page.locator("text=✕ CLOSE").isVisible({timeout:500}).catch(()=>false)===false?"✅":"⚠️","Modal closes");

// ═══ LAYOUT ═══
const navPos=await page.evaluate(()=>window.getComputedStyle(document.querySelector("[data-tour='nav']")?.parentElement).position);
log(navPos==="static"?"✅":"⚠️",`Nav bar position: ${navPos}`);
const mainOvf=await page.evaluate(()=>window.getComputedStyle(document.querySelector("main")).overflowY);
log(mainOvf==="auto"?"✅":"⚠️",`<main> overflow-y: ${mainOvf}`);
const appH=await page.evaluate(()=>{ const el=document.getElementById("root")?.firstElementChild; return window.getComputedStyle(el).height; });
log("🔍",`App div height: ${appH}`);

// ═══ TRAIN ═══
await goTab("train");
await shot("03_train");

// Plate Calculator — bottom padding fix
const platesBtn=page.locator("button",{hasText:/PLATES/i});
log(await platesBtn.isVisible().catch(()=>false)?"✅":"❌","PLATES button visible in TrainScreen");
await platesBtn.click(); await page.waitForTimeout(500);
log(await page.locator("text=PLATE CALCULATOR").isVisible().catch(()=>false)?"✅":"❌","Plate Calc modal opens");
const tgt=page.locator("input[placeholder='E.G. 225']");
log(await tgt.isVisible().catch(()=>false)?"✅":"⚠️","Target weight input visible (bottom padding fix)");
await tgt.fill("225").catch(()=>{}); await page.waitForTimeout(400);
await shot("04_plate_calc");
await closeAny();

// TM Calc
await page.locator("button",{hasText:/TM/i}).first().click(); await page.waitForTimeout(400);
log(await page.locator("text=TRAINING MAX CALC").isVisible().catch(()=>false)?"✅":"❌","TM Calc opens");
const rmInp=page.locator("input[placeholder='e.g. 315']");
log(await rmInp.isVisible().catch(()=>false)?"✅":"⚠️","1RM input visible (bottom padding)");
await rmInp.fill("315").catch(()=>{}); await page.waitForTimeout(300);
log(await page.locator("text=90%").isVisible().catch(()=>false)?"✅":"⚠️","Percentage grid renders");
await shot("05_tm_calc");
await closeAny();

// Exercise Demo — duplicate badge check
await page.locator("button",{hasText:/^TRACK$/i}).first().click(); await page.waitForTimeout(400);
const browseBtn=page.locator("button",{hasText:/BROWSE/i}).first();
if(await browseBtn.isVisible().catch(()=>false)){
  await browseBtn.click(); await page.waitForTimeout(600);
  const demoBtn=page.locator("button").filter({hasText:/📹/}).first();
  if(await demoBtn.isVisible().catch(()=>false)){
    await demoBtn.click(); await page.waitForTimeout(500);
    await shot("06_exercise_demo");
    const txt=await page.evaluate(()=>document.body.innerText);
    log(!/CHEST\s+CHEST|BACK\s+BACK|SHOULDERS\s+SHOULDERS|LEGS\s+LEGS/i.test(txt)?"✅":"❌","No duplicate category badges in ExerciseDemoModal");
    await closeAny();
  } else log("⚠️","No 📹 button in picker");
  await closeAny();
} else log("⚠️","BROWSE button not found");

// Programs tab
await page.locator("button",{hasText:/^PROGRAMS$/i}).first().click(); await page.waitForTimeout(500);
const progCount=await page.locator("text=4X/WK").count();
log(progCount>=3?"✅":"⚠️",`Programs list: ${progCount} cards`);
await shot("07_programs");

// ═══ STATS / CHARTS ═══
await goTab("progress");
const chartsTab=page.locator("button",{hasText:/^CHARTS$/i}).first();
log(await chartsTab.isVisible().catch(()=>false)?"✅":"❌","CHARTS sub-tab in ProgressScreen");
await chartsTab.click(); await page.waitForTimeout(600);
await shot("08_charts_empty");

// Demo data check — should have exercises with 2+ sessions
const firstPill=page.locator("button").filter({hasText:/Barbell Bench Press|Barbell Squat|Barbell Row|Lat Pulldown/i}).first();
const hasPills=await firstPill.isVisible({timeout:2000}).catch(()=>false);
log(hasPills?"✅":"⚠️","Exercise pills visible (demo data has repeated exercises)");

if(hasPills){
  const pillTxt=await firstPill.innerText();
  await firstPill.click(); await page.waitForTimeout(700);
  await shot("09_charts_selected");
  log(await page.locator("text=BEST SET WEIGHT").isVisible().catch(()=>false)?"✅":"❌","BEST SET WEIGHT chart");
  log(await page.locator("text=ESTIMATED 1RM TREND").isVisible().catch(()=>false)?"✅":"❌","ESTIMATED 1RM TREND chart");
  log(await page.locator("text=TOTAL SESSION VOLUME").isVisible().catch(()=>false)?"✅":"❌","TOTAL SESSION VOLUME chart");
  const svgCount=await page.locator("svg").count();
  log(svgCount>=3?"✅":"⚠️",`SVG charts count: ${svgCount} for '${pillTxt}'`);
  // Month labels
  const hasMonth=await page.locator("div").filter({hasText:/^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/}).first().isVisible().catch(()=>false);
  log(hasMonth?"✅":"🔍","Month labels on x-axis");
} else {
  const emptyMsg=await page.locator("text=/TAP AN EXERCISE|LOG SESSIONS/i").isVisible().catch(()=>false);
  log(emptyMsg?"✅":"⚠️","Charts empty-state shown when no repeated exercises");
}

// Remaining sub-tabs still work
await page.locator("button",{hasText:/^STATS$/i}).first().click(); await page.waitForTimeout(300);
log(await page.locator("text=SESSIONS").first().isVisible().catch(()=>false)?"✅":"❌","STATS sub-tab still works");
await page.locator("button",{hasText:/^MAP$/i}).first().click(); await page.waitForTimeout(400);
log(await page.locator("svg").first().isVisible().catch(()=>false)?"✅":"⚠️","MAP (heatmap) sub-tab works");
await page.locator("button",{hasText:/^STREAK$/i}).first().click(); await page.waitForTimeout(300);
log(await page.locator("text=/STREAK|FREEZE/i").first().isVisible().catch(()=>false)?"✅":"🔍","STREAK sub-tab (probe)");
await shot("10_stats_tabs");

// ═══ MORE ═══
await goTab("more");
log(await page.locator("text=MY BADGES").first().isVisible().catch(()=>false)?"✅":"⚠️","MY BADGES tile in MoreScreen");
await shot("11_more");

// ═══ FUEL ═══
await goTab("nutrition");
await page.waitForTimeout(400);
log(await page.locator("text=/📋 LOG|SCAN|SEARCH/i").first().isVisible().catch(()=>false)?"✅":"⚠️","FUEL screen renders");

// ═══ SQUAD ═══
await goTab("feed");
await page.waitForTimeout(500);
log(await page.locator("text=/FOLLOWING|DISCOVER/i").first().isVisible().catch(()=>false)?"✅":"⚠️","SQUAD feed renders");

// 🔍 Probe: rapid sub-tab switch
await goTab("progress");
for(let i=0;i<4;i++){
  await page.locator("button",{hasText:/^CHARTS$/i}).first().click(); await page.waitForTimeout(60);
  await page.locator("button",{hasText:/^STATS$/i}).first().click(); await page.waitForTimeout(60);
}
await page.waitForTimeout(400);
const rapidErrs=errs.filter(e=>!e.includes("supabase")&&!e.includes("fetch")&&!e.includes("ERR_")).length;
log(rapidErrs===0?"✅":"⚠️","Rapid sub-tab switching doesn't crash (probe)");

// Console errors
const appErrs=errs.filter(e=>!e.includes("supabase")&&!e.includes("fetch")&&!e.includes("ERR_")&&!e.includes("net::"));
log(appErrs.length===0?"✅":"⚠️",`JS errors (non-network): ${appErrs.length}`);
if(appErrs.length) appErrs.slice(0,5).forEach(e=>console.log("  ERR:",e.slice(0,150)));

await br.close();
console.log(`\n══ ${P} ✅  ${F} ❌  ${W} ⚠️ ══`);
console.log("Screenshots:", shots.join(", "));
