import { useState, useEffect, useRef } from "react";
import logoImg from "./assets/logo.jpg";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hcrhoccdgdelmbsmbrba.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcmhvY2NkZ2RlbG1ic21icmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzAyMzcsImV4cCI6MjA5NDU0NjIzN30.Ulcfa_LbgVsqsSt47M1bvDbgLW6nuvVzM-1sEUKj624"
);

const G = {
  gold: "#FDB927",
  goldHot: "#FFD060",
  goldDark: "#C9941A",
  goldDim: "rgba(253,185,39,0.15)",
  goldGlow: "0 0 20px rgba(253,185,39,0.6), 0 0 40px rgba(253,185,39,0.2)",
  goldGlow2: "0 0 8px rgba(253,185,39,0.8)",
  purple: "#552583",
  purpleBright: "#7B35C4",
  purpleLight: "#9B59D0",
  purpleDim: "rgba(85,37,131,0.3)",
  purpleGlow: "0 0 20px rgba(85,37,131,0.7), 0 0 40px rgba(85,37,131,0.3)",
  bg: "#06060E",
  bg2: "#0B0B18",
  bg3: "#100F20",
  chrome: "rgba(255,255,255,0.06)",
  chrome2: "rgba(255,255,255,0.10)",
  border: "rgba(253,185,39,0.2)",
  borderB: "rgba(253,185,39,0.08)",
  text: "#F2E8FF",
  textMid: "#8B7AA8",
  textDim: "#3D3360",
  green: "#00FF88",
  red: "#FF3D5A",
  blue: "#4DA6FF",
};

const FONT = {
  display: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
  body: "'Barlow Condensed', 'Arial Narrow', 'Arial', sans-serif",
  mono: "'Courier New', monospace",
};

const EXERCISES = [
  "Barbell Bench Press","Incline Dumbbell Press","Cable Flyes","Dumbbell Flyes",
  "Barbell Deadlift","Romanian Deadlift","Barbell Row","Lat Pulldown","Pull-Ups",
  "Barbell Squat","Hack Squat","Leg Press","Bulgarian Split Squat","Leg Curl",
  "Barbell Overhead Press","Arnold Press","Lateral Raises","Rear Delt Flyes",
  "Barbell Curl","Hammer Curl","Preacher Curl","Tricep Pushdown","Skull Crushers",
  "Plank","Ab Wheel","Hanging Leg Raises","Russian Twists",
  "Kettlebell Swing","Box Jumps","Jump Rope","Assault Bike",
];

const FEED_DATA = [
  { id:"f1", user:"MARCUS J.", av:"MJ", time:"2H AGO", txt:"315lb deadlift PR. 5 sets of 3. The iron never lies. 🔥", likes:47, liked:false, comments:3, type:"pr", tag:"315LBS DEADLIFT" },
  { id:"f2", user:"SOFIA R.", av:"SR", time:"4H AGO", txt:"100 logged workouts on SFC. This community keeps me showing up every single day.", likes:89, liked:true, comments:12, type:"milestone", tag:"100 SESSIONS" },
  { id:"f3", user:"DEVON K.", av:"DK", time:"YESTERDAY", txt:"Consistency over motivation. Always.", likes:34, liked:false, comments:6, type:"post", tag:null },
];

const MACROS_GOAL = { cal:2200, pro:180, carb:220, fat:65 };
const FOODS = [
  { name:"Chicken Breast 100g", cat:"PROTEIN", cal:165, pro:31, carb:0, fat:3.6 },
  { name:"Salmon Fillet 100g", cat:"PROTEIN", cal:208, pro:20, carb:0, fat:13 },
  { name:"Tuna (canned) 85g", cat:"PROTEIN", cal:100, pro:22, carb:0, fat:0.5 },
  { name:"Egg (1 large)", cat:"PROTEIN", cal:72, pro:6, carb:0.4, fat:5 },
  { name:"Egg Whites 100g", cat:"PROTEIN", cal:52, pro:11, carb:0.7, fat:0.2 },
  { name:"Ground Beef 93% 100g", cat:"PROTEIN", cal:152, pro:26, carb:0, fat:5.5 },
  { name:"Turkey Breast 100g", cat:"PROTEIN", cal:135, pro:30, carb:0, fat:1 },
  { name:"Shrimp 100g", cat:"PROTEIN", cal:99, pro:24, carb:0, fat:0.3 },
  { name:"Tilapia 100g", cat:"PROTEIN", cal:96, pro:20, carb:0, fat:2 },
  { name:"Cottage Cheese 226g", cat:"PROTEIN", cal:180, pro:24, carb:7, fat:5 },
  { name:"Greek Yogurt 170g", cat:"DAIRY", cal:100, pro:17, carb:6, fat:0.7 },
  { name:"Whole Milk 240ml", cat:"DAIRY", cal:149, pro:8, carb:12, fat:8 },
  { name:"Cheddar Cheese 28g", cat:"DAIRY", cal:113, pro:7, carb:0.4, fat:9 },
  { name:"Low-Fat Milk 240ml", cat:"DAIRY", cal:102, pro:8, carb:12, fat:2.4 },
  { name:"Brown Rice 100g", cat:"CARBS", cal:112, pro:2.6, carb:24, fat:0.9 },
  { name:"White Rice 100g", cat:"CARBS", cal:130, pro:2.7, carb:28, fat:0.3 },
  { name:"Oatmeal 40g", cat:"CARBS", cal:150, pro:5, carb:27, fat:2.5 },
  { name:"Sweet Potato 100g", cat:"CARBS", cal:86, pro:1.6, carb:20, fat:0.1 },
  { name:"White Potato 100g", cat:"CARBS", cal:77, pro:2, carb:17, fat:0.1 },
  { name:"Whole Wheat Bread 1sl", cat:"CARBS", cal:69, pro:3.6, carb:12, fat:1 },
  { name:"White Bread 1 slice", cat:"CARBS", cal:79, pro:2.7, carb:15, fat:1 },
  { name:"Pasta (cooked) 100g", cat:"CARBS", cal:158, pro:5.8, carb:31, fat:0.9 },
  { name:"Quinoa (cooked) 100g", cat:"CARBS", cal:120, pro:4.4, carb:21, fat:1.9 },
  { name:"Corn Tortilla (1)", cat:"CARBS", cal:52, pro:1.4, carb:11, fat:0.7 },
  { name:"Banana", cat:"FRUIT", cal:89, pro:1.1, carb:23, fat:0.3 },
  { name:"Apple (medium)", cat:"FRUIT", cal:95, pro:0.5, carb:25, fat:0.3 },
  { name:"Blueberries 100g", cat:"FRUIT", cal:57, pro:0.7, carb:14, fat:0.3 },
  { name:"Strawberries 100g", cat:"FRUIT", cal:32, pro:0.7, carb:8, fat:0.3 },
  { name:"Avocado half", cat:"FAT", cal:120, pro:1.5, carb:6, fat:11 },
  { name:"Broccoli 100g", cat:"VEG", cal:34, pro:2.8, carb:7, fat:0.4 },
  { name:"Spinach 100g", cat:"VEG", cal:23, pro:2.9, carb:3.6, fat:0.4 },
  { name:"Mixed Greens 100g", cat:"VEG", cal:20, pro:2, carb:3, fat:0.3 },
  { name:"Almonds 28g", cat:"NUTS", cal:164, pro:6, carb:6, fat:14 },
  { name:"Peanut Butter 2 tbsp", cat:"NUTS", cal:190, pro:8, carb:6, fat:16 },
  { name:"Almond Butter 2 tbsp", cat:"NUTS", cal:196, pro:7, carb:6, fat:18 },
  { name:"Walnuts 28g", cat:"NUTS", cal:185, pro:4.3, carb:3.9, fat:18.5 },
  { name:"Olive Oil 1 tbsp", cat:"FAT", cal:119, pro:0, carb:0, fat:13.5 },
  { name:"Coconut Oil 1 tbsp", cat:"FAT", cal:121, pro:0, carb:0, fat:13.5 },
  { name:"Whey Protein Shake", cat:"SUPPLEMENT", cal:120, pro:24, carb:3, fat:2 },
  { name:"Casein Protein 1 scoop", cat:"SUPPLEMENT", cal:110, pro:23, carb:3, fat:1 },
  { name:"Mass Gainer 1 scoop", cat:"SUPPLEMENT", cal:650, pro:50, carb:85, fat:8 },
  { name:"BCAA Drink 360ml", cat:"SUPPLEMENT", cal:10, pro:5, carb:0, fat:0 },
  { name:"McDonald's Big Mac", cat:"FAST FOOD", cal:550, pro:25, carb:46, fat:29 },
  { name:"Chipotle Chicken Bowl", cat:"RESTAURANT", cal:670, pro:51, carb:73, fat:14 },
  { name:"Subway 6in Turkey", cat:"RESTAURANT", cal:280, pro:18, carb:46, fat:3.5 },
  { name:"Chick-fil-A Sandwich", cat:"FAST FOOD", cal:470, pro:28, carb:39, fat:20 },
  { name:"Starbucks Latte 12oz", cat:"BEVERAGE", cal:190, pro:12, carb:19, fat:7 },
  { name:"Pizza Slice (cheese)", cat:"FAST FOOD", cal:285, pro:12, carb:36, fat:10 },
  { name:"Burrito (beef, large)", cat:"RESTAURANT", cal:850, pro:42, carb:92, fat:30 },
  { name:"KIND Bar (Almond)", cat:"SNACK", cal:200, pro:6, carb:18, fat:15 },
  { name:"Quest Bar (Choc Chip)", cat:"SNACK", cal:190, pro:21, carb:22, fat:7 },
  { name:"Rx Bar Chocolate", cat:"SNACK", cal:210, pro:12, carb:23, fat:9 },
  { name:"Clif Bar (Choc Chip)", cat:"SNACK", cal:250, pro:9, carb:44, fat:5 },
  { name:"Fairlife Milk 240ml", cat:"BRAND", cal:80, pro:13, carb:6, fat:2.5 },
  { name:"Chobani Plain 0% 170g", cat:"BRAND", cal:90, pro:16, carb:6, fat:0 },
  { name:"Siggi's Yogurt 150g", cat:"BRAND", cal:110, pro:15, carb:8, fat:0 },
  { name:"Fairlife Core Power", cat:"BRAND", cal:230, pro:42, carb:7, fat:3.5 },
  { name:"Premier Protein Shake", cat:"BRAND", cal:160, pro:30, carb:5, fat:3 },
  { name:"Muscle Milk 330ml", cat:"BRAND", cal:150, pro:25, carb:9, fat:3 },
];
const FOOD_CATS = ["ALL","PROTEIN","CARBS","DAIRY","FRUIT","VEG","NUTS","FAT","SUPPLEMENT","FAST FOOD","RESTAURANT","SNACK","BRAND","BEVERAGE"];
const BARCODE_DB = {
  "012345678901": {name:"Quest Bar Chocolate Chip",cal:190,pro:21,carb:22,fat:7,brand:"Quest Nutrition"},
  "049000028911": {name:"Coca-Cola 355ml",cal:140,pro:0,carb:39,fat:0,brand:"Coca-Cola"},
  "041196050120": {name:"Fairlife Core Power",cal:230,pro:42,carb:7,fat:3.5,brand:"Fairlife"},
  "016000275287": {name:"Nature Valley Granola Bar",cal:190,pro:4,carb:29,fat:7,brand:"Nature Valley"},
  "722252101587": {name:"KIND Dark Chocolate Almond",cal:200,pro:6,carb:18,fat:15,brand:"KIND"},
  "070038631552": {name:"Clif Bar Chocolate Chip",cal:250,pro:9,carb:44,fat:5,brand:"Clif Bar"},
  "611247531888": {name:"Rx Bar Chocolate Sea Salt",cal:210,pro:12,carb:23,fat:9,brand:"RxBar"},
  "036632008794": {name:"Premier Protein Shake",cal:160,pro:30,carb:5,fat:3,brand:"Premier Protein"},
};
const REST_OPTIONS = [
  { label:"45S", sec:45 }, { label:"1 MIN", sec:60 },
  { label:"1:30", sec:90 }, { label:"2 MIN", sec:120 },
];
const WEEKLY_VOLUME = [18400, 12200, 22100, 19800, 0, 24600, 16300];
const DAYS_SHORT = ["M","T","W","T","F","S","S"];

const EXERCISE_MUSCLE_MAP = {
  "Barbell Bench Press":      { chest:1.0, front_delt:0.5, tricep:0.4 },
  "Incline Dumbbell Press":   { chest:0.85, front_delt:0.65, tricep:0.3 },
  "Cable Flyes":              { chest:0.95, front_delt:0.15 },
  "Dumbbell Flyes":           { chest:0.95, front_delt:0.15 },
  "Barbell Deadlift":         { lower_back:0.9, glute:0.8, hamstring:0.75, trap:0.6, lat:0.5, quad:0.4 },
  "Romanian Deadlift":        { hamstring:1.0, glute:0.85, lower_back:0.7 },
  "Barbell Row":              { lat:1.0, mid_back:0.9, rear_delt:0.6, bicep:0.5, trap:0.4 },
  "Lat Pulldown":             { lat:0.95, mid_back:0.6, bicep:0.55, rear_delt:0.4 },
  "Pull-Ups":                 { lat:1.0, mid_back:0.65, bicep:0.6, rear_delt:0.4 },
  "Barbell Squat":            { quad:1.0, glute:0.8, hamstring:0.5, lower_back:0.4 },
  "Hack Squat":               { quad:1.0, glute:0.6, hamstring:0.35 },
  "Leg Press":                { quad:0.9, glute:0.7, hamstring:0.3 },
  "Bulgarian Split Squat":    { quad:0.95, glute:0.9, hamstring:0.45 },
  "Leg Curl":                 { hamstring:1.0, glute:0.3 },
  "Barbell Overhead Press":   { front_delt:1.0, mid_delt:0.65, tricep:0.6, trap:0.35 },
  "Arnold Press":             { front_delt:0.85, mid_delt:0.85, rear_delt:0.4, tricep:0.5 },
  "Lateral Raises":           { mid_delt:1.0, rear_delt:0.3, trap:0.2 },
  "Rear Delt Flyes":          { rear_delt:1.0, mid_back:0.45, trap:0.3 },
  "Barbell Curl":             { bicep:1.0, forearm:0.4 },
  "Hammer Curl":              { bicep:0.85, forearm:0.8 },
  "Preacher Curl":            { bicep:1.0, forearm:0.25 },
  "Tricep Pushdown":          { tricep:1.0, forearm:0.2 },
  "Skull Crushers":           { tricep:1.0 },
  "Plank":                    { upper_abs:0.8, lower_abs:0.65, oblique:0.6, lower_back:0.45 },
  "Ab Wheel":                 { upper_abs:0.95, lower_abs:0.9, oblique:0.5, lower_back:0.3 },
  "Hanging Leg Raises":       { lower_abs:1.0, hip_flexor:0.85, upper_abs:0.5 },
  "Russian Twists":           { oblique:1.0, upper_abs:0.5 },
  "Kettlebell Swing":         { glute:0.95, hamstring:0.8, lower_back:0.7, quad:0.4 },
  "Box Jumps":                { quad:0.8, glute:0.8, calf:0.65, hamstring:0.45 },
  "Jump Rope":                { calf:1.0, quad:0.4, forearm:0.25 },
  "Assault Bike":             { quad:0.75, glute:0.5, front_delt:0.35, upper_abs:0.35 },
};

const MUSCLE_LABELS = {
  chest:"Chest", front_delt:"Front Delts", mid_delt:"Side Delts", rear_delt:"Rear Delts",
  bicep:"Biceps", tricep:"Triceps", forearm:"Forearms", trap:"Traps",
  lat:"Lats", mid_back:"Mid Back", lower_back:"Lower Back",
  upper_abs:"Upper Abs", lower_abs:"Lower Abs", oblique:"Obliques", hip_flexor:"Hip Flexors",
  quad:"Quads", hamstring:"Hamstrings", glute:"Glutes", calf:"Calves",
};

function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1),16), bh = parseInt(b.slice(1),16);
  const ar=(ah>>16)&255,ag=(ah>>8)&255,ab=ah&255;
  const br=(bh>>16)&255,bg=(bh>>8)&255,bb=bh&255;
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab+(bb-ab)*t)})`;
}

function getHeatColor(score) {
  if (score <= 0)  return "#0A1628";
  if (score <= 30) return lerpColor("#1B4FBF","#4DA6FF", score/30);
  if (score <= 60) return lerpColor("#4DA6FF","#FFD700",(score-30)/30);
  if (score <= 85) return lerpColor("#FFD700","#FF6B00",(score-60)/25);
  return lerpColor("#FF6B00","#FF1744",Math.min(1,(score-85)/15));
}

function getHeatGlow(score, color) {
  if (score < 10) return "none";
  const r = Math.round(2 + score * 0.25);
  return `drop-shadow(0 0 ${r}px ${color}CC)`;
}

function calcMuscleScores(sessions) {
  const raw = {};
  for (const sess of sessions) {
    for (const ex of (sess.exs || [])) {
      const map = EXERCISE_MUSCLE_MAP[ex.name];
      if (!map) continue;
      const sets = ex.sets.filter(s => s.r && s.w).length || 1;
      const vol  = ex.sets.reduce((s,set) => s + (parseFloat(set.w)||0)*(parseInt(set.r)||0), 0);
      for (const [muscle, factor] of Object.entries(map)) {
        raw[muscle] = (raw[muscle]||0) + (sets*12 + vol*0.04) * factor;
      }
    }
  }
  const max = Math.max(...Object.values(raw), 1);
  const out = {};
  for (const [k,v] of Object.entries(raw)) out[k] = Math.min(100, (v/max)*100);
  return out;
}


function SectionLabel({ children, accent = true }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      {accent && <div style={{ width:3, height:18, background:G.gold, boxShadow:G.goldGlow2, borderRadius:1 }} />}
      <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:3, color:G.gold, textTransform:"uppercase" }}>
        {children}
      </div>
    </div>
  );
}

function ChromeCard({ children, glow = false, gold = false, style = {} }) {
  return (
    <div style={{
      background: gold
        ? `linear-gradient(135deg, rgba(253,185,39,0.07) 0%, rgba(85,37,131,0.15) 100%)`
        : `linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(10,8,24,0.8) 100%)`,
      border: `1px solid ${gold ? G.gold+"55" : G.border}`,
      borderRadius: 10,
      boxShadow: glow ? (gold ? `0 4px 24px rgba(253,185,39,0.15), inset 0 1px 0 rgba(255,255,255,0.08)` : G.purpleGlow) : `inset 0 1px 0 rgba(255,255,255,0.06)`,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

function NeonBtn({ children, onClick, full = false, outline = false, small = false, disabled = false, color = G.gold, style = {} }) {
  const bg = outline
    ? "transparent"
    : disabled
    ? "rgba(255,255,255,0.04)"
    : `linear-gradient(135deg, ${color} 0%, ${color === G.gold ? G.goldDark : G.purpleBright} 100%)`;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        background: bg,
        border: `1px solid ${disabled ? G.textDim : color}`,
        borderRadius: 6,
        padding: small ? "7px 14px" : full ? "14px 20px" : "11px 20px",
        color: outline ? color : disabled ? G.textDim : (color === G.gold ? "#0A0810" : "#fff"),
        fontFamily: FONT.display,
        fontSize: small ? 13 : 15,
        letterSpacing: 2,
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        width: full ? "100%" : undefined,
        opacity: disabled ? 0.4 : 1,
        boxShadow: (!outline && !disabled) ? `0 0 14px ${color}44, 0 2px 8px rgba(0,0,0,0.4)` : "none",
        transition: "all 0.15s",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function NeonOutlineBtn({ children, onClick, small = false, style = {} }) {
  return <NeonBtn onClick={onClick} outline small={small} style={style}>{children}</NeonBtn>;
}

function StatPill({ label, value, color = G.gold, icon }) {
  return (
    <div style={{
      background: `rgba(255,255,255,0.04)`,
      border: `1px solid ${G.borderB}`,
      borderTop: `1px solid ${color}33`,
      borderRadius: 8, padding: "12px 10px", textAlign: "center", flex: 1,
    }}>
      {icon && <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>}
      <div style={{ fontFamily: FONT.display, fontSize: 22, color, letterSpacing: 1, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: FONT.body, fontSize: 10, color: G.textMid, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3 }}>{label}</div>
    </div>
  );
}

function AvatarBadge({ initials, size = 42, gold = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: gold
        ? `linear-gradient(135deg, ${G.gold} 0%, ${G.goldDark} 100%)`
        : `linear-gradient(135deg, ${G.purple} 0%, ${G.purpleBright} 100%)`,
      border: `1.5px solid ${gold ? G.gold+"88" : G.purple+"88"}`,
      boxShadow: gold ? G.goldGlow2 : `0 0 8px ${G.purple}88`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT.display, fontSize: size * 0.35, letterSpacing: 1,
      color: gold ? "#0A0810" : G.gold,
    }}>
      {initials}
    </div>
  );
}

function Chip({ label, color = G.gold, small = false }) {
  return (
    <span style={{
      background: `${color}15`, border: `1px solid ${color}44`,
      borderRadius: 4, padding: small ? "2px 8px" : "3px 10px",
      fontFamily: FONT.body, fontSize: small ? 10 : 11,
      letterSpacing: 1, color, textTransform: "uppercase",
    }}>
      {label}
    </span>
  );
}

function RingMeter({ pct, size = 70, strokeW = 5, color = G.gold, label, value }) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeW}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={circ*(1-Math.min(1,pct/100))}
          strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease", filter:`drop-shadow(0 0 4px ${color})`}}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        {value && <div style={{ fontFamily:FONT.display, fontSize:size*0.22, color, lineHeight:1 }}>{value}</div>}
        {label && <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>}
      </div>
    </div>
  );
}

function GridBg() {
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.07 }}>
        <defs>
          <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke={G.gold} strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#smallGrid)"/>
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke={G.gold} strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, transparent 40%, #06060E 90%)" }}/>
      <div style={{ position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)", width:600, height:300, background:"radial-gradient(ellipse, rgba(85,37,131,0.25) 0%, transparent 70%)", borderRadius:"50%" }}/>
      <div style={{ position:"absolute", bottom:-80, right:"-10%", width:400, height:200, background:"radial-gradient(ellipse, rgba(253,185,39,0.08) 0%, transparent 70%)" }}/>
    </div>
  );
}

function RestTimer({ sec, onDone }) {
  const [rem, setRem] = useState(sec);
  useEffect(() => {
    setRem(sec); // eslint-disable-line react-hooks/set-state-in-effect
    const t = setInterval(() => setRem(r => { if (r <= 1) { clearInterval(t); onDone(); return 0; } return r - 1; }), 1000);
    return () => clearInterval(t);
  }, [sec, onDone]);
  const pct = (rem / sec) * 100;
  const m = Math.floor(rem / 60);
  const s = (rem % 60).toString().padStart(2, "0");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.97)", zIndex:900, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
      <GridBg/>
      <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:6, color:G.textMid, textTransform:"uppercase", zIndex:1 }}>REST PERIOD</div>
      <div style={{ position:"relative", zIndex:1 }}>
        <RingMeter pct={pct} size={180} strokeW={8} color={G.gold} value={`${m}:${s}`}/>
      </div>
      <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:2, textTransform:"uppercase", zIndex:1 }}>Next set incoming</div>
      <NeonOutlineBtn onClick={onDone} style={{ zIndex:1 }}>Skip Rest</NeonOutlineBtn>
    </div>
  );
}

function HomeScreen({ sessions, leaderboard, onQuickStart, showToast, profile }) {
  const [period, setPeriod] = useState("weekly");
  const maxVol = Math.max(...WEEKLY_VOLUME);
  const myRank = leaderboard.find(u => u.isMe)?.rank || 3;
  const myPts = profile?.points ?? leaderboard.find(u => u.isMe)?.pts ?? 3650;

  return (
    <div style={{ padding:"22px 18px 0" }}>
      <div style={{ marginBottom:24, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <img
          src={logoImg}
          alt="Social Fit Club"
          style={{ width:160, height:160, borderRadius:"50%", objectFit:"cover", objectPosition:"center top", boxShadow:`0 0 30px rgba(253,185,39,0.5), 0 0 60px rgba(85,37,131,0.4), 0 8px 32px rgba(0,0,0,0.7)`, border:`3px solid ${G.gold}88` }}
        />
        <div style={{ fontFamily:FONT.body, fontSize:11, letterSpacing:3, color:G.textMid, textTransform:"uppercase", marginTop:10 }}>
          ◆ &nbsp;STRENGTH IN COMMUNITY&nbsp; ◆
        </div>
      </div>

      <ChromeCard gold glow style={{ padding:"16px", marginBottom:14 }}>
        <div style={{ position:"absolute", top:0, right:0, width:80, height:80, overflow:"hidden", borderRadius:"0 10px 0 0" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:40, background:G.gold, transform:"rotate(45deg)", opacity:0.12 }}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <AvatarBadge initials={profile?.avatar_initials || "ME"} size={52} gold/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>YOUR STATS</div>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{sessions.length} sessions logged</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:FONT.display, fontSize:32, color:G.gold, letterSpacing:1, textShadow:G.goldGlow2, lineHeight:1 }}>{myPts.toLocaleString()}</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>POINTS</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          {[{l:"RANK",v:`#${myRank}`,ico:"👑"},{l:"STREAK",v:`${profile?.streak||0}D`,ico:"🔥"},{l:"THIS WK",v:`${sessions.length}`,ico:"💪"}].map(s=>(
            <div key={s.l} style={{ flex:1, background:"rgba(0,0,0,0.3)", borderRadius:6, padding:"9px 6px", textAlign:"center", border:`1px solid rgba(253,185,39,0.15)` }}>
              <div style={{ fontSize:14, marginBottom:3 }}>{s.ico}</div>
              <div style={{ fontFamily:FONT.display, fontSize:18, color:G.gold, letterSpacing:1 }}>{s.v}</div>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </ChromeCard>

      <ChromeCard style={{ padding:"14px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <SectionLabel>Weekly Volume</SectionLabel>
          <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>LBS</div>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:60 }}>
          {WEEKLY_VOLUME.map((v, i) => {
            const pct = v / maxVol;
            const isToday = i === 6;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{
                  width:"100%", height: Math.max(3, pct * 52),
                  background: isToday
                    ? `linear-gradient(180deg, ${G.goldHot} 0%, ${G.gold} 100%)`
                    : `linear-gradient(180deg, ${G.purple}cc 0%, ${G.purple}44 100%)`,
                  borderRadius:"3px 3px 0 0",
                  boxShadow: isToday ? G.goldGlow2 : `0 0 6px ${G.purple}66`,
                  transition:"height 0.6s ease",
                }}/>
                <div style={{ fontFamily:FONT.mono, fontSize:9, color: isToday ? G.gold : G.textDim, letterSpacing:1 }}>{DAYS_SHORT[i]}</div>
              </div>
            );
          })}
        </div>
      </ChromeCard>

      <SectionLabel>Quick Start</SectionLabel>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:18 }}>
        {[
          { name:"PUSH DAY", ico:"💪", color:G.gold, sub:"CHEST · SHOULDERS · TRIS", exs:["Barbell Bench Press","Incline Dumbbell Press","Lateral Raises","Tricep Pushdown"] },
          { name:"PULL DAY", ico:"🏋️", color:G.purpleLight, sub:"BACK · BICEPS", exs:["Barbell Deadlift","Barbell Row","Lat Pulldown","Barbell Curl"] },
          { name:"LEG DAY", ico:"🦵", color:"#FF3D5A", sub:"QUADS · HAMS · GLUTES", exs:["Barbell Squat","Leg Press","Romanian Deadlift","Leg Curl"] },
          { name:"FULL BODY", ico:"⚡", color:G.gold, sub:"COMPOUND MOVEMENTS", exs:["Barbell Squat","Barbell Bench Press","Barbell Deadlift","Barbell Row"] },
        ].map(w => (
          <div key={w.name} onClick={() => { onQuickStart(w); showToast(`${w.ico} ${w.name} — loading in Train tab!`); }}
            style={{ background:`${w.color}0C`, border:`1px solid ${w.color}30`, borderRadius:9, padding:"14px 12px", cursor:"pointer", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-8, right:-8, fontSize:40, opacity:0.15 }}>{w.ico}</div>
            <div style={{ fontFamily:FONT.display, fontSize:17, color:"#fff", letterSpacing:2, textTransform:"uppercase", lineHeight:1, marginBottom:4 }}>{w.name}</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:w.color, letterSpacing:1.5, textTransform:"uppercase" }}>{w.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <SectionLabel>Leaderboard</SectionLabel>
        <div style={{ display:"flex", background:"rgba(0,0,0,0.4)", borderRadius:6, border:`1px solid ${G.borderB}`, padding:3, gap:2 }}>
          {["WEEKLY","ALL TIME"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p.toLowerCase())} style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, padding:"4px 9px", borderRadius:4, border:"none", background:period===p.toLowerCase()?G.gold:"transparent", color:period===p.toLowerCase()?"#0A0810":G.textMid, cursor:"pointer", textTransform:"uppercase" }}>{p}</button>
          ))}
        </div>
      </div>

      {leaderboard.length >= 3 && (
      <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:12, justifyContent:"center" }}>
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
          const order = [1,0,2][i];
          const ht = [88, 112, 70][i];
          const col = ["#C0C0C0", G.gold, "#CD7F32"][order];
          return (
            <div key={u.name} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              {u.isMe && <div style={{ fontFamily:FONT.body, fontSize:8, color:G.gold, letterSpacing:2, textTransform:"uppercase" }}>YOU</div>}
              <AvatarBadge initials={u.av} size={order===0?48:40} gold={order===0}/>
              <div style={{ fontFamily:FONT.display, fontSize:11, color:"#fff", letterSpacing:2, textAlign:"center", textTransform:"uppercase", maxWidth:60, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.name.split(" ")[0]}</div>
              <div style={{ width:"100%", height:ht, background:`${col}18`, border:`1px solid ${col}44`, borderRadius:"6px 6px 0 0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:`0 0 12px ${col}22` }}>
                <div style={{ fontFamily:FONT.display, fontSize:20, color:col, textShadow:`0 0 10px ${col}` }}>{"🥇🥈🥉"[order]}</div>
                <div style={{ fontFamily:FONT.display, fontSize:13, color:col, letterSpacing:1 }}>{u.pts.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {leaderboard.slice(3).map(u => (
        <ChromeCard key={u.rank} gold={u.isMe} style={{ padding:"10px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontFamily:FONT.mono, fontSize:12, color:G.textDim, width:18 }}>#{u.rank}</div>
          <AvatarBadge initials={u.av} size={32} gold={u.isMe}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:u.isMe?G.gold:"#fff", textTransform:"uppercase" }}>{u.name}</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, textTransform:"uppercase" }}>{u.sessions} sessions · {u.streak}d streak</div>
          </div>
          <div style={{ fontFamily:FONT.display, fontSize:16, color:u.isMe?G.gold:"#fff", letterSpacing:1 }}>{u.pts.toLocaleString()}</div>
        </ChromeCard>
      ))}
    </div>
  );
}

function TrainScreen({ showToast, onSave, quickStart, onClearQuickStart, sessions = [] }) {
  const [subTab, setSubTab] = useState("track");
  const [sessName, setSessName] = useState("");
  const [exs, setExs] = useState([{ id:1, name:"", sets:[{r:"",w:""}], rest:60, q:"", sugg:false }]);
  const [restSec, setRestSec] = useState(null);
  const [saving, setSaving] = useState(false);
  const nextIdRef = useRef(2);

  useEffect(() => {
    if (quickStart) {
      setSessName(quickStart.name); // eslint-disable-line react-hooks/set-state-in-effect
      setExs(quickStart.exs.map((name, i) => ({ id: i+1, name, sets:[{r:"",w:""}], rest:60, q:name, sugg:false })));
      setSubTab("track");
      if (onClearQuickStart) onClearQuickStart();
      showToast(`✓ ${quickStart.name} loaded — add your sets!`);
    }
  }, [quickStart]); // eslint-disable-line react-hooks/exhaustive-deps

  const totSets = exs.reduce((a,e) => a + e.sets.filter(s=>s.r&&s.w).length, 0);
  const totVol = exs.reduce((a,e) => a + e.sets.reduce((b,s) => b+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0),0);
  const pts = totSets * 10 + Math.floor(totVol / 100) * 5;
  const getSugg = q => !q || q.length < 2 ? [] : EXERCISES.filter(e => e.toLowerCase().includes(q.toLowerCase())).slice(0,5);
  const updEx = (id, f, v) => setExs(p => p.map(e => e.id===id ? {...e,[f]:v} : e));
  const updSet = (xid, si, f, v) => setExs(p => p.map(e => e.id!==xid ? e : {...e, sets:e.sets.map((s,i)=>i===si?{...s,[f]:v}:s)}));

  const doSave = () => {
    const valid = exs.filter(e => e.name && e.sets.some(s=>s.r||s.w));
    if (!valid.length) { showToast("Add at least one exercise."); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave({ name:sessName||"CUSTOM SESSION", exs:valid, sets:totSets, vol:totVol, pts, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}) });
      setExs([{id:1,name:"",sets:[{r:"",w:""}],rest:60,q:"",sugg:false}]);
      setSessName("");
      setSubTab("log");
    }, 900);
  };

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"9px 11px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" };
  const SUB_TABS = [{ id:"track", l:"TRACK" }, { id:"log", l:"HISTORY" }, { id:"programs", l:"PROGRAMS" }];

  return (
    <div style={{ padding:"20px 18px 0" }}>
      {restSec && <RestTimer sec={restSec} onDone={() => { setRestSec(null); showToast("✓ REST COMPLETE"); }}/>}
      <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:16 }}>
        TRAINING <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>HUB</span>
      </div>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:18, border:`1px solid ${G.borderB}` }}>
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{ flex:1, padding:"9px 4px", borderRadius:5, border:"none", background: subTab===t.id ? `linear-gradient(135deg,${G.gold},${G.goldDark})` : "transparent", color: subTab===t.id ? "#0A0810" : G.textMid, fontFamily:FONT.display, fontSize:13, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
        ))}
      </div>

      {subTab==="track" && (
        <div>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:6 }}>SESSION NAME</div>
            <input placeholder="e.g. PUSH DAY · CHEST FOCUS" value={sessName} onChange={e=>setSessName(e.target.value)} style={{ ...inp, fontSize:18, fontFamily:FONT.display, letterSpacing:3, background:"transparent", border:"none", borderBottom:`1px solid ${G.border}`, borderRadius:0, padding:"8px 0", color:G.gold }}/>
          </div>

          {totSets > 0 && (
            <ChromeCard gold style={{ padding:"11px 14px", marginBottom:16, display:"flex" }}>
              {[{l:"SETS",v:totSets},{l:"VOLUME",v:`${totVol.toLocaleString()} LBS`},{l:"PTS",v:`+${pts}`}].map((s,i) => (
                <div key={s.l} style={{ flex:1, textAlign:"center", borderRight: i<2 ? `1px solid ${G.borderB}` : "none" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:20, color:G.gold, letterSpacing:1 }}>{s.v}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>{s.l}</div>
                </div>
              ))}
            </ChromeCard>
          )}

          {exs.map((ex, xi) => {
            const sugg = getSugg(ex.q);
            return (
              <ChromeCard key={ex.id} style={{ marginBottom:12, overflow:"visible" }}>
                <div style={{ padding:"12px 12px 0", position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:6 }}>
                    <div style={{ width:22, height:22, borderRadius:4, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.display, fontSize:12, color:"#0A0810", flexShrink:0 }}>{xi+1}</div>
                    <input value={ex.q||ex.name} onChange={e=>{const v=e.target.value;updEx(ex.id,"q",v);updEx(ex.id,"name",v);updEx(ex.id,"sugg",v.length>=2);}} onBlur={()=>setTimeout(()=>updEx(ex.id,"sugg",false),160)} placeholder="EXERCISE NAME" style={{ ...inp, background:"transparent", border:"none", padding:"3px 0", fontFamily:FONT.display, fontSize:15, letterSpacing:2, flex:1, width:"auto", color:"#fff" }}/>
                    {exs.length > 1 && <button onClick={()=>setExs(p=>p.filter(e=>e.id!==ex.id))} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:16, padding:"2px 4px", flexShrink:0 }}>✕</button>}
                  </div>
                  {ex.sugg && sugg.length > 0 && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#0F0E22", border:`1px solid ${G.gold}55`, borderRadius:"0 0 8px 8px", zIndex:200, boxShadow:`0 8px 32px rgba(0,0,0,0.7)` }}>
                      {sugg.map((s)=>(
                        <div key={s} onMouseDown={()=>{updEx(ex.id,"name",s);updEx(ex.id,"q",s);updEx(ex.id,"sugg",false);}} style={{ padding:"10px 14px", cursor:"pointer", fontFamily:FONT.body, fontSize:13, letterSpacing:1.5, textTransform:"uppercase", color:G.text, borderBottom:`1px solid ${G.borderB}` }}>
                          ▸ &nbsp;{s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"28px 1fr 1fr 28px", gap:6, padding:"6px 12px 3px", alignItems:"center" }}>
                  {["SET","REPS","WEIGHT",""].map((h,i)=>(
                    <div key={i} style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase" }}>{h}</div>
                  ))}
                </div>

                {ex.sets.map((set,si)=>(
                  <div key={si} style={{ display:"grid", gridTemplateColumns:"28px 1fr 1fr 28px", gap:6, padding:"3px 12px", alignItems:"center" }}>
                    <div style={{ width:22, height:22, borderRadius:4, background: set.r&&set.w ? `linear-gradient(135deg,${G.gold},${G.goldDark})` : "rgba(255,255,255,0.05)", border:`1px solid ${set.r&&set.w ? G.gold+"88" : G.borderB}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.display, fontSize:11, color: set.r&&set.w ? "#0A0810" : G.textDim }}>{si+1}</div>
                    <input type="number" inputMode="numeric" placeholder="—" value={set.r} onChange={e=>updSet(ex.id,si,"r",e.target.value)} style={{ ...inp, padding:"8px 8px", fontFamily:FONT.display, fontSize:15, letterSpacing:1, textAlign:"center", color: set.r ? G.gold : G.textDim }}/>
                    <input type="number" inputMode="decimal" placeholder="—" value={set.w} onChange={e=>updSet(ex.id,si,"w",e.target.value)} style={{ ...inp, padding:"8px 8px", fontFamily:FONT.display, fontSize:15, letterSpacing:1, textAlign:"center", color: set.w ? G.gold : G.textDim }}/>
                    <button onClick={()=>{if(ex.sets.length>1)setExs(p=>p.map(e=>e.id!==ex.id?e:{...e,sets:e.sets.filter((_,j)=>j!==si)}));}} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13 }}>✕</button>
                  </div>
                ))}

                <div style={{ padding:"9px 12px 12px" }}>
                  <button onClick={()=>setExs(p=>p.map(e=>e.id===ex.id?{...e,sets:[...e.sets,{r:"",w:""}]}:e))} style={{ background:"transparent", border:`1px dashed ${G.borderB}`, borderRadius:5, padding:"6px", width:"100%", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:2, cursor:"pointer", marginBottom:9, textTransform:"uppercase" }}>+ ADD SET</button>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1.5, flexShrink:0, textTransform:"uppercase" }}>Rest:</div>
                    <div style={{ display:"flex", gap:4, flex:1 }}>
                      {REST_OPTIONS.map(r => (
                        <button key={r.label} onClick={()=>updEx(ex.id,"rest",r.sec)} style={{ flex:1, padding:"5px 2px", borderRadius:5, border:`1px solid ${ex.rest===r.sec ? G.gold : G.borderB}`, background: ex.rest===r.sec ? `${G.gold}20` : "transparent", color: ex.rest===r.sec ? G.gold : G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{r.label}</button>
                      ))}
                    </div>
                    <button onClick={()=>setRestSec(ex.rest)} style={{ background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, border:`1px solid ${G.purpleLight}55`, borderRadius:5, padding:"5px 10px", color:G.gold, fontFamily:FONT.display, fontSize:12, letterSpacing:1, cursor:"pointer", flexShrink:0 }}>▶</button>
                  </div>
                </div>
              </ChromeCard>
            );
          })}

          <button onClick={()=>{const newId=nextIdRef.current++;setExs(p=>[...p,{id:newId,name:"",sets:[{r:"",w:""}],rest:60,q:"",sugg:false}]);}} style={{ width:"100%", padding:"12px", borderRadius:8, border:`1px dashed ${G.gold}44`, background:`${G.gold}06`, color:G.gold, fontFamily:FONT.display, fontSize:14, letterSpacing:3, cursor:"pointer", marginBottom:16, textTransform:"uppercase" }}>+ ADD EXERCISE</button>

          <ChromeCard gold style={{ padding:"14px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>Save Session</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{totSets} sets · {totVol.toLocaleString()} lbs volume</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:FONT.display, fontSize:28, color:G.gold, textShadow:G.goldGlow2, letterSpacing:1 }}>+{pts}</div>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>POINTS</div>
              </div>
            </div>
            <NeonBtn onClick={doSave} full disabled={saving}>{saving ? "SAVING..." : "SAVE & EARN POINTS ◆"}</NeonBtn>
          </ChromeCard>
        </div>
      )}

      {subTab==="log" && (
        <div>
          <SectionLabel>Session History</SectionLabel>
          {sessions.length === 0 ? (
            <div style={{ textAlign:"center", padding:"44px 0", color:G.textDim }}>
              <div style={{ fontFamily:FONT.display, fontSize:36, letterSpacing:4, marginBottom:8 }}>NO SESSIONS</div>
              <div style={{ fontFamily:FONT.body, fontSize:12, letterSpacing:2, textTransform:"uppercase" }}>Log your first workout to see history</div>
              <NeonBtn onClick={()=>setSubTab("track")} style={{ marginTop:20 }}>START TRACKING</NeonBtn>
            </div>
          ) : sessions.map((s, i) => (
            <ChromeCard key={i} style={{ padding:"12px 14px", marginBottom:9, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{s.date} · {s.sets} sets · {(s.vol||0).toLocaleString()} lbs</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:FONT.display, fontSize:16, color:G.gold, letterSpacing:1 }}>+{s.pts}</div>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>PTS</div>
              </div>
            </ChromeCard>
          ))}
        </div>
      )}

      {subTab==="programs" && (
        <div>
          <SectionLabel>Training Programs</SectionLabel>
          {[
            { name:"GOLDEN ERA HYPERTROPHY", type:"BODYBUILDING", level:"INTERMEDIATE", weeks:12, desc:"Classic high-volume bodybuilding. The Arnold blueprint.", ico:"🏆" },
            { name:"RAW STRENGTH FOUNDATION", type:"POWERLIFTING", level:"BEGINNER", weeks:8, desc:"Linear progression for squat, bench, and deadlift.", ico:"🏋️" },
            { name:"EXPLOSIVE ATHLETE", type:"ATHLETICS", level:"ADVANCED", weeks:10, desc:"Speed, power, and sport conditioning.", ico:"⚡" },
            { name:"FAT LOSS ACCELERATOR", type:"WEIGHT LOSS", level:"BEGINNER", weeks:8, desc:"Metabolic training to maximize fat burn.", ico:"🔥" },
          ].map((p,i) => (
            <ChromeCard key={i} style={{ padding:"14px", marginBottom:11 }}>
              <div style={{ display:"flex", gap:12, marginBottom:10 }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{p.ico}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:5 }}>{p.name}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:5 }}>
                    <Chip label={p.type} small/><Chip label={p.level} color={G.purpleLight} small/><Chip label={`${p.weeks}WK`} color={G.textMid} small/>
                  </div>
                  <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.5 }}>{p.desc}</div>
                </div>
              </div>
              <NeonBtn onClick={()=>showToast(`Enrolled in ${p.name}`)} full small>ENROLL — $29.99/MO</NeonBtn>
            </ChromeCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Muscle Heat Map ────────────────────────────────────────────────────────

const MUSCLE_SUGGEST = {
  chest:"Barbell Bench Press", front_delt:"Barbell Overhead Press", mid_delt:"Lateral Raises",
  rear_delt:"Rear Delt Flyes", bicep:"Barbell Curl", tricep:"Skull Crushers",
  forearm:"Hammer Curl", trap:"Barbell Deadlift", lat:"Pull-Ups",
  mid_back:"Barbell Row", lower_back:"Romanian Deadlift", upper_abs:"Ab Wheel",
  lower_abs:"Hanging Leg Raises", oblique:"Russian Twists", hip_flexor:"Hanging Leg Raises",
  quad:"Barbell Squat", hamstring:"Leg Curl", glute:"Bulgarian Split Squat", calf:"Jump Rope",
};

// Body silhouette shapes shared by front+back
function BodyBase() {
  const c = "#0D0B1E";
  return (
    <>
      <circle cx="100" cy="34" r="21" fill={c}/>
      <rect x="93" y="53" width="14" height="20" rx="5" fill={c}/>
      <rect x="45" y="70" width="110" height="30" rx="15" fill={c}/>
      <rect x="66" y="88" width="68" height="72" rx="11" fill={c}/>
      <rect x="70" y="154" width="60" height="50" rx="9" fill={c}/>
      <rect x="67" y="197" width="66" height="48" rx="15" fill={c}/>
      <rect x="38" y="80" width="23" height="90" rx="11" fill={c}/>
      <rect x="139" y="80" width="23" height="90" rx="11" fill={c}/>
      <rect x="30" y="167" width="21" height="68" rx="10" fill={c}/>
      <rect x="149" y="167" width="21" height="68" rx="10" fill={c}/>
      <ellipse cx="39" cy="244" rx="11" ry="15" fill={c}/>
      <ellipse cx="161" cy="244" rx="11" ry="15" fill={c}/>
      <rect x="68" y="238" width="29" height="88" rx="13" fill={c}/>
      <rect x="103" y="238" width="29" height="88" rx="13" fill={c}/>
      <ellipse cx="82" cy="326" rx="15" ry="11" fill={c}/>
      <ellipse cx="118" cy="326" rx="15" ry="11" fill={c}/>
      <rect x="70" y="334" width="24" height="70" rx="11" fill={c}/>
      <rect x="106" y="334" width="24" height="70" rx="11" fill={c}/>
      <ellipse cx="80" cy="413" rx="16" ry="9" fill={c}/>
      <ellipse cx="120" cy="413" rx="16" ry="9" fill={c}/>
    </>
  );
}

function MuscleHeatMap({ sessions }) {
  const [view, setView] = useState("front");
  const [period, setPeriod] = useState("week");
  const [sel, setSel] = useState(null);

  const rawScores = calcMuscleScores(sessions);
  const factor = period === "month" ? 0.45 : 1;
  const scores = Object.fromEntries(Object.entries(rawScores).map(([k,v]) => [k, v * factor]));

  const sc = key => scores[key] || 0;
  const col = key => getHeatColor(sc(key));
  const op = key => { const s = sc(key); return s < 3 ? 0.14 : 0.45 + (s/100)*0.55; };
  const glow = key => { const s = sc(key); return s > 15 ? getHeatGlow(s, col(key)) : "none"; };

  const patch = (key, shapeEl) => {
    const s = sc(key);
    const anim = s > 75 ? "heatPulse 2s ease-in-out infinite" : "none";
    return (
      <g key={key} onClick={() => setSel(sel===key ? null : key)}
         style={{ cursor:"pointer", filter: glow(key), animation: anim }}>
        {shapeEl(col(key), op(key))}
      </g>
    );
  };

  // ── Total sets per muscle from sessions ──────────────────────────────────
  const muscleSets = key => {
    let total = 0;
    for (const sess of sessions) {
      for (const ex of (sess.exs||[])) {
        const map = EXERCISE_MUSCLE_MAP[ex.name];
        if (map && map[key]) total += ex.sets.filter(s=>s.r&&s.w).length;
      }
    }
    return total;
  };
  const lastTrained = key => {
    for (const sess of sessions) {
      for (const ex of (sess.exs||[])) {
        if (EXERCISE_MUSCLE_MAP[ex.name]?.[key]) return sess.date||"—";
      }
    }
    return "—";
  };

  // ── Insights — always based on rawScores so period toggle doesn't affect alerts ──
  const allKeys = Object.keys(MUSCLE_LABELS);
  const raw = key => rawScores[key] || 0;
  const maxRaw = Math.max(...allKeys.map(k=>raw(k)), 1);
  const minRaw = Math.min(...allKeys.filter(k=>raw(k)>0).map(k=>raw(k)), 100);
  const overKeys = allKeys.filter(k => raw(k) > 80);
  const underKeys = allKeys.filter(k => raw(k) < 15).slice(0,3);
  const imbalanced = maxRaw - (minRaw < 100 ? minRaw : 0) > 55;

  return (
    <div>
      {/* Header controls */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["front","FRONT VIEW"],["back","BACK VIEW"]].map(([v,l]) => (
          <button key={v} onClick={()=>{
            setView(v);
            const frontM=["chest","front_delt","mid_delt","bicep","forearm","upper_abs","lower_abs","oblique","hip_flexor","quad","calf"];
            const backM=["trap","rear_delt","lat","mid_back","lower_back","tricep","forearm","glute","hamstring","calf"];
            const vis=v==="front"?frontM:backM;
            if(sel&&!vis.includes(sel))setSel(null);
          }} style={{
            flex:1, padding:"9px 4px", borderRadius:6, border:`1px solid ${view===v?G.gold:G.borderB}`,
            background: view===v ? `${G.gold}22` : "transparent",
            color: view===v ? G.gold : G.textMid,
            fontFamily:FONT.display, fontSize:12, letterSpacing:2, cursor:"pointer"
          }}>{l}</button>
        ))}
        {[["week","WEEK"],["month","MONTH"]].map(([p,l]) => (
          <button key={p} onClick={()=>setPeriod(p)} style={{
            padding:"9px 10px", borderRadius:6, border:`1px solid ${period===p?G.purpleLight:G.borderB}`,
            background: period===p ? `${G.purpleLight}22` : "transparent",
            color: period===p ? G.purpleLight : G.textMid,
            fontFamily:FONT.display, fontSize:12, letterSpacing:2, cursor:"pointer"
          }}>{l}</button>
        ))}
      </div>

      {/* SVG Body */}
      <div style={{ position:"relative", display:"flex", justifyContent:"center" }}>
        <svg viewBox="0 0 200 440" width="200" height="440"
             style={{ filter:"drop-shadow(0 0 30px rgba(85,37,131,0.25))" }}>

          <BodyBase/>

          {view === "front" ? (
            <g>
              {/* Chest */}
              {patch("chest", (c,o) => <>
                <rect x="70" y="92" width="28" height="52" rx="8" fill={c} fillOpacity={o}/>
                <rect x="102" y="92" width="28" height="52" rx="8" fill={c} fillOpacity={o}/>
              </>)}
              {/* Front delts */}
              {patch("front_delt", (c,o) => <>
                <ellipse cx="52" cy="92" rx="13" ry="18" fill={c} fillOpacity={o}/>
                <ellipse cx="148" cy="92" rx="13" ry="18" fill={c} fillOpacity={o}/>
              </>)}
              {/* Side delts */}
              {patch("mid_delt", (c,o) => <>
                <ellipse cx="41" cy="95" rx="8" ry="12" fill={c} fillOpacity={o}/>
                <ellipse cx="159" cy="95" rx="8" ry="12" fill={c} fillOpacity={o}/>
              </>)}
              {/* Biceps */}
              {patch("bicep", (c,o) => <>
                <rect x="39" y="102" width="20" height="58" rx="9" fill={c} fillOpacity={o}/>
                <rect x="141" y="102" width="20" height="58" rx="9" fill={c} fillOpacity={o}/>
              </>)}
              {/* Forearms */}
              {patch("forearm", (c,o) => <>
                <rect x="31" y="169" width="18" height="55" rx="8" fill={c} fillOpacity={o}/>
                <rect x="151" y="169" width="18" height="55" rx="8" fill={c} fillOpacity={o}/>
              </>)}
              {/* Upper abs (4-pack) */}
              {patch("upper_abs", (c,o) => <>
                <rect x="80" y="150" width="18" height="20" rx="5" fill={c} fillOpacity={o}/>
                <rect x="102" y="150" width="18" height="20" rx="5" fill={c} fillOpacity={o}/>
                <rect x="80" y="173" width="18" height="20" rx="5" fill={c} fillOpacity={o}/>
                <rect x="102" y="173" width="18" height="20" rx="5" fill={c} fillOpacity={o}/>
              </>)}
              {/* Lower abs */}
              {patch("lower_abs", (c,o) => <>
                <rect x="80" y="196" width="18" height="18" rx="5" fill={c} fillOpacity={o}/>
                <rect x="102" y="196" width="18" height="18" rx="5" fill={c} fillOpacity={o}/>
              </>)}
              {/* Obliques */}
              {patch("oblique", (c,o) => <>
                <path d="M68 148 Q64 168 66 205 Q72 213 80 209 L80 196 L80 148 Z" fill={c} fillOpacity={o}/>
                <path d="M132 148 Q136 168 134 205 Q128 213 120 209 L120 196 L120 148 Z" fill={c} fillOpacity={o}/>
              </>)}
              {/* Hip flexors */}
              {patch("hip_flexor", (c,o) => <>
                <rect x="70" y="215" width="24" height="24" rx="8" fill={c} fillOpacity={o}/>
                <rect x="106" y="215" width="24" height="24" rx="8" fill={c} fillOpacity={o}/>
              </>)}
              {/* Quads */}
              {patch("quad", (c,o) => <>
                <rect x="70" y="240" width="26" height="80" rx="11" fill={c} fillOpacity={o}/>
                <rect x="104" y="240" width="26" height="80" rx="11" fill={c} fillOpacity={o}/>
              </>)}
              {/* Calves front */}
              {patch("calf", (c,o) => <>
                <rect x="72" y="334" width="21" height="62" rx="9" fill={c} fillOpacity={o}/>
                <rect x="107" y="334" width="21" height="62" rx="9" fill={c} fillOpacity={o}/>
              </>)}
            </g>
          ) : (
            <g>
              {/* Traps */}
              {patch("trap", (c,o) => <>
                <path d="M88 72 L50 90 L55 118 L90 110 Z" fill={c} fillOpacity={o}/>
                <path d="M112 72 L150 90 L145 118 L110 110 Z" fill={c} fillOpacity={o}/>
              </>)}
              {/* Rear delts */}
              {patch("rear_delt", (c,o) => <>
                <ellipse cx="50" cy="96" rx="13" ry="18" fill={c} fillOpacity={o}/>
                <ellipse cx="150" cy="96" rx="13" ry="18" fill={c} fillOpacity={o}/>
              </>)}
              {/* Lats */}
              {patch("lat", (c,o) => <>
                <path d="M64 108 L50 148 L53 205 L72 202 L74 148 L68 113 Z" fill={c} fillOpacity={o}/>
                <path d="M136 108 L150 148 L147 205 L128 202 L126 148 L132 113 Z" fill={c} fillOpacity={o}/>
              </>)}
              {/* Mid back */}
              {patch("mid_back", (c,o) =>
                <rect x="77" y="118" width="46" height="42" rx="9" fill={c} fillOpacity={o}/>
              )}
              {/* Lower back */}
              {patch("lower_back", (c,o) =>
                <rect x="78" y="163" width="44" height="36" rx="10" fill={c} fillOpacity={o}/>
              )}
              {/* Triceps */}
              {patch("tricep", (c,o) => <>
                <rect x="39" y="98" width="20" height="64" rx="9" fill={c} fillOpacity={o}/>
                <rect x="141" y="98" width="20" height="64" rx="9" fill={c} fillOpacity={o}/>
              </>)}
              {/* Rear forearms */}
              {patch("forearm", (c,o) => <>
                <rect x="31" y="169" width="18" height="55" rx="8" fill={c} fillOpacity={o}/>
                <rect x="151" y="169" width="18" height="55" rx="8" fill={c} fillOpacity={o}/>
              </>)}
              {/* Glutes */}
              {patch("glute", (c,o) => <>
                <rect x="69" y="204" width="28" height="44" rx="13" fill={c} fillOpacity={o}/>
                <rect x="103" y="204" width="28" height="44" rx="13" fill={c} fillOpacity={o}/>
              </>)}
              {/* Hamstrings */}
              {patch("hamstring", (c,o) => <>
                <rect x="70" y="250" width="26" height="70" rx="11" fill={c} fillOpacity={o}/>
                <rect x="104" y="250" width="26" height="70" rx="11" fill={c} fillOpacity={o}/>
              </>)}
              {/* Calves back */}
              {patch("calf", (c,o) => <>
                <rect x="72" y="330" width="21" height="66" rx="9" fill={c} fillOpacity={o}/>
                <rect x="107" y="330" width="21" height="66" rx="9" fill={c} fillOpacity={o}/>
              </>)}
            </g>
          )}
        </svg>

        {/* Selected muscle tooltip overlay */}
        {sel && (
          <div style={{ position:"absolute", bottom:8, left:0, right:0, margin:"0 4px",
            background:`linear-gradient(135deg,rgba(10,8,24,0.97),rgba(85,37,131,0.18))`,
            border:`1px solid ${col(sel)}55`, borderRadius:10, padding:"12px 14px",
            backdropFilter:"blur(12px)", boxShadow:`0 8px 32px rgba(0,0,0,0.6)`,
            animation:"toastIn 0.2s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:3, color:col(sel),
                textShadow:`0 0 12px ${col(sel)}88` }}>{MUSCLE_LABELS[sel]?.toUpperCase()}</div>
              <button onClick={()=>setSel(null)} style={{ background:"none", border:"none",
                color:G.textMid, cursor:"pointer", fontSize:16 }}>✕</button>
            </div>
            {/* Heat bar */}
            <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.08)", marginBottom:10, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${sc(sel)}%`, borderRadius:3,
                background:`linear-gradient(90deg,#1B4FBF,#4DA6FF,#FFD700,${col(sel)})`,
                boxShadow:`0 0 8px ${col(sel)}` }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:6 }}>
              {[
                ["HEAT",`${Math.round(sc(sel))}%`],
                ["SETS",muscleSets(sel)],
                ["RECOVERY",`${Math.max(0,Math.round(100-(rawScores[sel]||0)*1.2))}%`],
                ["LAST",lastTrained(sel)],
              ].map(([l,v])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:14, color:G.gold, letterSpacing:1 }}>{v}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", alignItems:"center", gap:10, margin:"12px 0 16px" }}>
        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", flexShrink:0 }}>COLD</div>
        <div style={{ flex:1, height:6, borderRadius:3, background:"linear-gradient(90deg,#1B4FBF,#4DA6FF,#FFD700,#FF6B00,#FF1744)" }}/>
        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", flexShrink:0 }}>HOT</div>
      </div>

      {/* AI Insights */}
      <SectionLabel>AI Recovery Intel</SectionLabel>

      {sessions.length === 0 && (
        <ChromeCard style={{ padding:"14px", marginBottom:10, textAlign:"center" }}>
          <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textMid }}>LOG A WORKOUT TO SEE YOUR MUSCLE MAP</div>
        </ChromeCard>
      )}

      {overKeys.length > 0 && (
        <ChromeCard style={{ padding:"12px 14px", marginBottom:10, border:`1px solid ${G.red}44` }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:18, flexShrink:0 }}>🔥</div>
            <div>
              <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.red, marginBottom:3 }}>OVERTRAINING DETECTED</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>
                {overKeys.map(k=>MUSCLE_LABELS[k]).join(", ")} — take 48–72 hrs rest
              </div>
            </div>
          </div>
        </ChromeCard>
      )}

      {imbalanced && (
        <ChromeCard style={{ padding:"12px 14px", marginBottom:10, border:`1px solid ${G.gold}44` }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:18, flexShrink:0 }}>⚖️</div>
            <div>
              <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.gold, marginBottom:3 }}>MUSCLE IMBALANCE</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>
                Large gap between your most and least trained groups — target neglected muscles
              </div>
            </div>
          </div>
        </ChromeCard>
      )}

      {underKeys.length > 0 && (
        <ChromeCard style={{ padding:"12px 14px", marginBottom:10 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:18, flexShrink:0 }}>💡</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.purpleLight, marginBottom:6 }}>UNDERTRAINED — ADD THESE</div>
              {underKeys.map(k => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>{MUSCLE_LABELS[k]}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:1, color:G.gold, textTransform:"uppercase" }}>→ {MUSCLE_SUGGEST[k]}</div>
                </div>
              ))}
            </div>
          </div>
        </ChromeCard>
      )}
    </div>
  );
}

function ProgressScreen({ showToast, sessions = [], profile }) {
  const [activeTab, setActiveTab] = useState("stats");
  const streak = profile?.streak || 0;
  const [freezes, setFreezes] = useState(2);
  const MILESTONES = [7,14,30,60,90,180,365];
  const nextMs = MILESTONES.find(m => m > streak) || 365;
  const totalVol = sessions.reduce((a,s) => a + (s.vol||0), 0);
  const fmtVol = v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v);
  const PHOTOS = [
    { date:"JAN 6", wk:1, wt:198, bf:22.0, ms:false },
    { date:"FEB 3", wk:5, wt:192, bf:20.1, ms:true, msTxt:"FIRST 5LBS LOST 🎉" },
    { date:"MAR 3", wk:9, wt:186, bf:17.8, ms:true, msTxt:"DEADLIFT PR 225LBS 🏆" },
    { date:"APR 1", wk:13, wt:181, bf:15.2, ms:true, msTxt:"15LBS DOWN · 7% BF LOST 👑" },
  ];

  return (
    <div style={{ padding:"20px 18px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:16 }}>
        PROGRESS <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>VAULT</span>
      </div>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:18, border:`1px solid ${G.borderB}` }}>
        {[{id:"stats",l:"STATS"},{id:"streak",l:"STREAK"},{id:"transform",l:"BODY"},{id:"heatmap",l:"HEAT MAP"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ flex:1, padding:"8px 2px", borderRadius:5, border:"none", background:activeTab===t.id?`linear-gradient(135deg,${G.gold},${G.goldDark})`:"transparent", color:activeTab===t.id?"#0A0810":G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
        ))}
      </div>

      {activeTab==="stats" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
            {[{l:"SESSIONS",v:String(sessions.length),ico:"🏋️"},{l:"TOTAL VOL",v:fmtVol(Math.round(totalVol)),ico:"⚡"},{l:"BEST WEEK",v:fmtVol(Math.round(totalVol)),ico:"📈"}].map(s=>(
              <StatPill key={s.l} label={s.l} value={s.v} icon={s.ico}/>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {[{l:"CALORIES TRACKED",v:"1,840 avg",ico:"🔥"},{l:"PROTEIN GOAL",v:"87%",ico:"🥩"},{l:"SLEEP AVERAGE",v:"7.4 HRS",ico:"🌙"},{l:"HRV SCORE",v:"48 ms",ico:"📊"}].map(s=>(
              <ChromeCard key={s.l} style={{ padding:"12px 10px", display:"flex", gap:9, alignItems:"center" }}>
                <div style={{ fontSize:20 }}>{s.ico}</div>
                <div>
                  <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:1, color:G.gold }}>{s.v}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{s.l}</div>
                </div>
              </ChromeCard>
            ))}
          </div>
          <SectionLabel>Body Composition</SectionLabel>
          <ChromeCard gold style={{ padding:"16px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
              <RingMeter pct={(181/198)*100} size={80} strokeW={6} color={G.gold} value="181" label="LBS"/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:6 }}>Progress</div>
                <div style={{ fontFamily:FONT.display, fontSize:28, color:"#00FF88", letterSpacing:1, textShadow:`0 0 12px #00FF88` }}>-17 LBS</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>since start</div>
              </div>
              <RingMeter pct={((22-15.2)/22)*100} size={80} strokeW={6} color={G.purpleLight} value="15.2%" label="BODY FAT"/>
            </div>
          </ChromeCard>
        </div>
      )}

      {activeTab==="streak" && (
        <div>
          <div style={{ background:`linear-gradient(135deg,rgba(253,185,39,0.1),rgba(85,37,131,0.15))`, border:`1px solid ${G.gold}44`, borderRadius:12, padding:"24px", marginBottom:14, textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.04, fontFamily:FONT.display, fontSize:180, color:G.gold, pointerEvents:"none" }}>🔥</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>CURRENT STREAK</div>
            <div style={{ fontFamily:FONT.display, fontSize:88, color:G.gold, letterSpacing:-2, lineHeight:1, textShadow:G.goldGlow, position:"relative" }}>{streak}</div>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:4, color:"#fff", marginBottom:14 }}>DAYS 🔥</div>
            <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:8 }}>
              <div style={{ height:"100%", width:`${(streak/nextMs)*100}%`, background:`linear-gradient(90deg,${G.goldDark},${G.gold})`, borderRadius:2, boxShadow:G.goldGlow2 }}/>
            </div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{nextMs-streak} days to {nextMs}-day milestone</div>
          </div>
          <ChromeCard style={{ padding:"14px", marginBottom:12, border:`1px solid ${G.blue}33` }}>
            <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
              <div style={{ fontSize:26 }}>🧊</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>Streak Freezes</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>Protect your streak on rest days</div>
              </div>
              <div style={{ fontFamily:FONT.display, fontSize:32, color:G.blue, textShadow:`0 0 12px ${G.blue}` }}>{freezes}</div>
            </div>
            <NeonBtn onClick={()=>{if(freezes>0){setFreezes(f=>f-1);showToast("🧊 STREAK FREEZE USED!");} }} outline color={G.blue} full small disabled={freezes<=0}>USE FREEZE ({freezes} REMAINING)</NeonBtn>
          </ChromeCard>
          <SectionLabel>Milestone Road</SectionLabel>
          {MILESTONES.map((ms, i) => {
            const achieved = streak >= ms;
            const current = ms === nextMs;
            const labels = ["FIRST WEEK","TWO-WEEK WARRIOR","MONTHLY CHAMPION","TWO-MONTH BEAST","90-DAY TRANSFORMER","HALF-YEAR LEGEND","ONE YEAR CHAMPION"];
            return (
              <div key={ms} style={{ background: achieved ? `rgba(0,255,136,0.06)` : current ? `${G.gold}08` : G.chrome, border:`1px solid ${achieved?"#00FF8844":current?G.gold+"44":G.borderB}`, borderRadius:8, padding:"11px 13px", marginBottom:7, display:"flex", gap:11, alignItems:"center" }}>
                <div style={{ width:30, height:30, borderRadius:6, background: achieved ? `linear-gradient(135deg,#00FF88,#00CC66)` : current ? `${G.gold}20` : "rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, boxShadow: achieved ? `0 0 8px #00FF8866` : "none" }}>{achieved?"✓":current?"🎯":"🔒"}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color: achieved ? "#00FF88" : current ? G.gold : G.textMid, textTransform:"uppercase" }}>{ms}-Day Streak</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, textTransform:"uppercase" }}>{labels[i]}</div>
                </div>
                {achieved && <Chip label="DONE ✓" color="#00FF88" small/>}
                {current && <Chip label={`${nextMs-streak}D LEFT`} small/>}
              </div>
            );
          })}
        </div>
      )}

      {activeTab==="transform" && (
        <div>
          <ChromeCard gold style={{ padding:"14px", marginBottom:14 }}>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>13-WEEK TRANSFORMATION</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[{l:"WEIGHT LOST",v:"17 LBS",col:"#00FF88"},{l:"BODY FAT",v:"-6.8%",col:G.gold},{l:"CHECK-INS",v:"4",col:G.purpleLight}].map(s=>(
                <div key={s.l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:22, color:s.col, textShadow:`0 0 10px ${s.col}66`, letterSpacing:1 }}>{s.v}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginTop:3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </ChromeCard>
          <SectionLabel>Timeline</SectionLabel>
          {PHOTOS.map((ph,i) => (
            <div key={ph.wk} style={{ display:"flex", gap:11, marginBottom:5 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:26, flexShrink:0 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background: ph.ms ? `linear-gradient(135deg,${G.gold},${G.goldDark})` : G.bg3, border:`2px solid ${ph.ms?G.gold:G.borderB}`, flexShrink:0, boxShadow:ph.ms?G.goldGlow2:"none" }}/>
                {i<PHOTOS.length-1 && <div style={{ width:1, flex:1, background:`linear-gradient(180deg,${G.borderB},transparent)`, marginTop:3, marginBottom:3, minHeight:16 }}/>}
              </div>
              <div style={{ flex:1, paddingBottom: i<PHOTOS.length-1 ? 6 : 0 }}>
                {ph.ms && <div style={{ background:`${G.gold}15`, border:`1px solid ${G.gold}44`, borderRadius:5, padding:"4px 10px", marginBottom:5, display:"inline-flex", gap:6, alignItems:"center" }}><span style={{ fontFamily:FONT.display, fontSize:11, color:G.gold, letterSpacing:1.5, textTransform:"uppercase" }}>{ph.msTxt}</span></div>}
                <ChromeCard style={{ padding:"10px", display:"flex", gap:10 }}>
                  <div style={{ width:54, height:66, borderRadius:6, background:`linear-gradient(135deg,${G.bg3},${G.purple}33)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1px solid ${G.borderB}`, fontSize:22 }}>📸</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff" }}>WEEK {ph.wk}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1 }}>{ph.date}</div>
                    </div>
                    <div style={{ display:"flex", gap:5 }}>
                      <Chip label={`${ph.wt} LBS`} color={G.purpleLight} small/>
                      <Chip label={`${ph.bf}% BF`} color={G.textMid} small/>
                    </div>
                  </div>
                </ChromeCard>
              </div>
            </div>
          ))}
          <NeonBtn onClick={()=>showToast("📸 Photo upload would open on device")} full outline style={{ marginTop:8 }}>+ ADD THIS WEEK'S CHECK-IN</NeonBtn>
        </div>
      )}

      {activeTab==="heatmap" && (
        <MuscleHeatMap sessions={sessions} showToast={showToast}/>
      )}
    </div>
  );
}

function NutritionScreen({ showToast }) {
  const [view, setView] = useState("log");
  const [log, setLog] = useState([
    { id:1, meal:"PRE-WORKOUT", name:"Oatmeal 40g", cal:150, pro:5, carb:27, fat:2.5 },
    { id:2, meal:"LUNCH", name:"Chicken Breast 100g", cal:165, pro:31, carb:0, fat:3.6 },
  ]);
  const [selMeal, setSelMeal] = useState("LUNCH");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [scanMode, setScanMode] = useState("idle");
  const [scanResult, setScanResult] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLabel, setScanLabel] = useState("");
  const scanTimerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanAnimRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    cancelAnimationFrame(scanAnimRef.current);
  };

  useEffect(() => () => { stopCamera(); clearInterval(scanTimerRef.current); }, []);

  const MEALS = ["BREAKFAST","PRE-WORKOUT","LUNCH","POST-WORKOUT","DINNER","LATE SNACK"];
  const totals = log.reduce((a,f)=>({cal:a.cal+f.cal,pro:a.pro+f.pro,carb:a.carb+f.carb,fat:a.fat+f.fat}),{cal:0,pro:0,carb:0,fat:0});
  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" };

  const captureMealFrame = () => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
  };

  const startCameraScan = async () => {
    setScanMode("camera"); setScanProgress(0); setScanLabel("REQUESTING CAMERA...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"environment", width:{ideal:1280}, height:{ideal:720} } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setScanLabel("POINT CAMERA AT YOUR MEAL — TAP TO SCAN");
    } catch {
      setScanMode("idle");
      showToast("Camera access denied");
    }
  };

  const captureAndAnalyze = async () => {
    const image = captureMealFrame();
    if (!image) return;
    stopCamera();
    setScanMode("analyzing"); setScanLabel("ANALYZING WITH AI..."); setScanProgress(30);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-meal", { body: { image } });
      setScanProgress(100);
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setScanResult(data);
      setScanMode("result");
    } catch (e) {
      setScanMode("idle");
      showToast(e.message === "No food detected" ? "No food detected — try again" : "Scan failed — check connection");
    }
  };

  const startBarcodeScan = async () => {
    setScanMode("barcode_scanning"); setScanProgress(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      if ("BarcodeDetector" in window) {
        const detector = new window.BarcodeDetector({ formats:["ean_13","upc_a","upc_e","ean_8","code_128","code_39"] });
        const detect = async () => {
          if (!videoRef.current || !streamRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) { stopCamera(); lookupBarcode(codes[0].rawValue); return; }
          } catch { /* detection error — skip frame and retry */ }
          scanAnimRef.current = requestAnimationFrame(detect);
        };
        scanAnimRef.current = requestAnimationFrame(detect);
      }
    } catch {
      showToast("Camera access denied — enter barcode manually");
    }
  };

  const lookupBarcode = async (code) => {
    setScanMode("analyzing"); setScanLabel("LOOKING UP BARCODE..."); setScanProgress(30);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      setScanProgress(80);
      if (data.status === 1 && data.product) {
        const p = data.product;
        const n = p.nutriments || {};
        const serving = p.serving_quantity ? Number(p.serving_quantity) : 100;
        const factor = serving / 100;
        const found = {
          name: p.product_name || p.generic_name || "Unknown Product",
          brand: p.brands || "",
          cal: Math.round((n["energy-kcal_100g"] || n["energy-kcal"] || 0) * factor),
          pro: Math.round((n.proteins_100g || 0) * factor * 10) / 10,
          carb: Math.round((n.carbohydrates_100g || 0) * factor * 10) / 10,
          fat: Math.round((n.fat_100g || 0) * factor * 10) / 10,
        };
        setScanProgress(100);
        setScanResult({ ...found, confidence: 99 });
        setScanMode("barcode_result");
      } else if (BARCODE_DB[code]) {
        setScanProgress(100);
        setScanResult({ ...BARCODE_DB[code], confidence: 99 });
        setScanMode("barcode_result");
      } else {
        setScanProgress(0);
        setScanMode("barcode_scanning");
        showToast("Product not found — try another barcode");
      }
    } catch {
      setScanProgress(0);
      setScanMode("barcode_scanning");
      showToast("Lookup failed — check your connection");
    }
  };

  const resetScan = () => { stopCamera(); clearInterval(scanTimerRef.current); setScanMode("idle"); setScanResult(null); setBarcodeInput(""); setScanProgress(0); };
  const addScanResult = () => {
    if (!scanResult) return;
    setLog(p=>[...p,{...scanResult,id:Date.now(),meal:selMeal}]);
    resetScan(); setView("log");
    showToast(`✓ ${scanResult.name} added to ${selMeal}`);
  };

  const filteredFoods = FOODS.filter(f => {
    const matchCat = catFilter==="ALL" || f.cat===catFilter;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || (f.brand||"").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ padding:"20px 18px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:16 }}>
        NUTRITION <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>LAB</span>
      </div>

      <ChromeCard gold glow style={{ padding:"16px", marginBottom:14 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <RingMeter pct={Math.min(100,Math.round((totals.cal/MACROS_GOAL.cal)*100))} size={76} strokeW={6} color={G.gold} value={totals.cal} label="KCAL"/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff" }}>TODAY</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{MACROS_GOAL.cal-totals.cal} cal left</div>
            </div>
            {[{l:"PROTEIN",v:totals.pro,m:MACROS_GOAL.pro,col:G.purpleLight},{l:"CARBS",v:totals.carb,m:MACROS_GOAL.carb,col:G.gold},{l:"FAT",v:totals.fat,m:MACROS_GOAL.fat,col:"#FF3D5A"}].map(b=>(
              <div key={b.l} style={{ marginBottom:5 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>{b.l}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:b.col, letterSpacing:1 }}>{b.v}G</div>
                </div>
                <div style={{ height:3, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${Math.min(100,(b.v/b.m)*100)}%`, background:b.col, borderRadius:2, boxShadow:`0 0 4px ${b.col}88`, transition:"width 0.5s" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChromeCard>

      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:14, border:`1px solid ${G.borderB}` }}>
        {[{id:"log",l:"📋 LOG"},{id:"scan",l:"📷 SCAN"},{id:"search",l:"🔍 SEARCH"}].map(t=>(
          <button key={t.id} onClick={()=>{ setView(t.id); if(t.id==="scan"&&scanMode==="idle") startCameraScan(); }} style={{ flex:1, padding:"8px 4px", borderRadius:5, border:"none", background:view===t.id?`linear-gradient(135deg,${G.gold},${G.goldDark})`:"transparent", color:view===t.id?"#0A0810":G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
        ))}
      </div>

      {view==="scan" && (
        <div>
          <ChromeCard style={{ overflow:"hidden", marginBottom:12 }}>
            <div style={{ minHeight:200, height:scanMode==="camera"||scanMode==="barcode_scanning"?"auto":240, background:`linear-gradient(135deg,#04020A,${G.purple}55)`, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", position:"relative", overflow:"hidden", padding: scanMode==="camera"||scanMode==="barcode_scanning" ? "10px" : 0 }}>
              {scanMode==="idle" && (
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>📷</div>
                  <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>CAMERA SCAN</div>
                  <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginTop:4 }}>AI identifies food &amp; estimates portions</div>
                </div>
              )}
              {(scanMode==="camera"||scanMode==="barcode_scanning") && (
                <div style={{ width:"100%", position:"relative" }}>
                  <video ref={videoRef} autoPlay playsInline muted
                    style={{ width:"100%", height:scanMode==="camera"?200:160, objectFit:"cover", display:"block", borderRadius:8, background:"#000" }}/>
                  {/* Scanning overlay */}
                  <div style={{ position:"absolute", inset:0, borderRadius:8, pointerEvents:"none",
                    border:`2px solid ${scanMode==="camera"?G.gold+"88":G.gold+"66"}` }}>
                    {scanMode==="camera" && (
                      <div style={{ position:"absolute", left:0, right:0, height:2,
                        background:`linear-gradient(90deg,transparent,${G.gold},transparent)`,
                        animation:"scanLine 1.8s linear infinite" }}/>
                    )}
                    {scanMode==="barcode_scanning" && (
                      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ width:200, height:56, border:`2px solid ${G.gold}`, borderRadius:4, position:"relative", overflow:"hidden" }}>
                          <div style={{ position:"absolute", left:0, right:0, height:2,
                            background:`linear-gradient(90deg,transparent,${G.gold},transparent)`,
                            animation:"scanLine 1.2s linear infinite" }}/>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Label + progress below video */}
                  <div style={{ marginTop:8 }}>
                    {scanMode==="camera" && <>
                      <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:3, color:G.gold, textTransform:"uppercase", textAlign:"center", marginBottom:8 }}>{scanLabel}</div>
                      <NeonBtn onClick={captureAndAnalyze} full>📸 CAPTURE & ANALYZE</NeonBtn>
                    </>}
                    {scanMode==="barcode_scanning" && <>
                      <div style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:2, color:G.gold, textTransform:"uppercase", textAlign:"center", marginBottom:6 }}>
                        {"BarcodeDetector" in window ? "ALIGN BARCODE IN BOX — AUTO-DETECTING" : "ENTER BARCODE MANUALLY"}
                      </div>
                      <input value={barcodeInput} onChange={e=>setBarcodeInput(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&barcodeInput.length>=6&&lookupBarcode(barcodeInput)}
                        placeholder="012345678901"
                        style={{ background:"rgba(0,0,0,0.5)", border:`1px solid ${G.gold}55`, borderRadius:7, padding:"8px 10px", color:G.gold, fontSize:15, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.mono, letterSpacing:3, textAlign:"center" }}/>
                    </>}
                  </div>
                </div>
              )}
              {scanMode==="analyzing" && (
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:8, display:"inline-block" }}>🔍</div>
                  <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:3, color:G.gold, textTransform:"uppercase", marginBottom:8 }}>{scanLabel}</div>
                  <div style={{ width:160, height:3, background:"rgba(255,255,255,0.1)", borderRadius:2, margin:"0 auto" }}>
                    <div style={{ height:"100%", width:`${scanProgress}%`, background:`linear-gradient(90deg,${G.gold},${G.green})`, borderRadius:2, transition:"width 0.15s" }}/>
                  </div>
                </div>
              )}
              {(scanMode==="result"||scanMode==="barcode_result") && scanResult && (
                <div style={{ padding:"16px", width:"100%", boxSizing:"border-box" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:G.green, boxShadow:`0 0 8px ${G.green}` }}/>
                    <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:3, color:G.green, textTransform:"uppercase" }}>
                      {scanMode==="barcode_result"?"BARCODE MATCH":"AI SCAN RESULT"} — {scanResult.confidence}% MATCH
                    </div>
                  </div>
                  {scanResult.brand && <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>{scanResult.brand}</div>}
                  <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:10 }}>{scanResult.name}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                    {[{l:"CAL",v:scanResult.cal,col:G.gold},{l:"PROTEIN",v:`${scanResult.pro}G`,col:G.purpleLight},{l:"CARBS",v:`${scanResult.carb}G`,col:G.blue},{l:"FAT",v:`${scanResult.fat}G`,col:G.red}].map(m=>(
                      <div key={m.l} style={{ background:`${m.col}15`, border:`1px solid ${m.col}33`, borderRadius:6, padding:"8px 4px", textAlign:"center" }}>
                        <div style={{ fontFamily:FONT.display, fontSize:15, color:m.col, letterSpacing:1 }}>{m.v}</div>
                        <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding:"12px", borderTop:`1px solid ${G.borderB}` }}>
              {scanMode==="idle" && (
                <div style={{ display:"flex", gap:9 }}>
                  <NeonBtn onClick={startCameraScan} style={{ flex:2 }}>📷 SCAN MEAL</NeonBtn>
                  <NeonBtn onClick={startBarcodeScan} outline style={{ flex:1, fontSize:12 }}>📊 BARCODE</NeonBtn>
                </div>
              )}
              {scanMode==="camera" && <NeonBtn onClick={resetScan} outline full>CANCEL</NeonBtn>}
              {scanMode==="barcode_scanning" && (
                <div style={{ display:"flex", gap:9 }}>
                  <NeonBtn onClick={()=>lookupBarcode(barcodeInput||Object.keys(BARCODE_DB)[Math.floor(Math.random()*Object.keys(BARCODE_DB).length)])} style={{ flex:2 }}>🔍 LOOK UP</NeonBtn>
                  <NeonBtn onClick={resetScan} outline style={{ flex:1 }}>CANCEL</NeonBtn>
                </div>
              )}
              {(scanMode==="result"||scanMode==="barcode_result") && (
                <div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                    {MEALS.map(m=>(
                      <button key={m} onClick={()=>setSelMeal(m)} style={{ padding:"4px 9px", borderRadius:4, border:`1px solid ${selMeal===m?G.gold:G.borderB}`, background:selMeal===m?`${G.gold}18`:"transparent", color:selMeal===m?G.gold:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>{m}</button>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:9 }}>
                    <NeonBtn onClick={resetScan} outline style={{ flex:1 }}>RESCAN</NeonBtn>
                    <NeonBtn onClick={addScanResult} style={{ flex:2 }}>ADD TO {selMeal} ◆</NeonBtn>
                  </div>
                </div>
              )}
            </div>
          </ChromeCard>
        </div>
      )}

      {view==="search" && (
        <div>
          <div style={{ position:"relative", marginBottom:10 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="SEARCH 60+ FOODS, BRANDS, RESTAURANTS..." style={{ ...inp, paddingLeft:36, paddingRight:search?36:12 }}/>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, color:G.textDim }}>🔍</span>
            {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:14 }}>✕</button>}
          </div>
          <div style={{ display:"flex", overflowX:"auto", gap:5, marginBottom:12, paddingBottom:2 }}>
            {FOOD_CATS.map(cat=>(
              <button key={cat} onClick={()=>setCatFilter(cat)} style={{ padding:"4px 10px", borderRadius:4, border:`1px solid ${catFilter===cat?G.gold:G.borderB}`, background:catFilter===cat?`${G.gold}18`:"transparent", color:catFilter===cat?G.gold:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap", flexShrink:0 }}>{cat}</button>
            ))}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
            {MEALS.map(m=>(
              <button key={m} onClick={()=>setSelMeal(m)} style={{ padding:"4px 9px", borderRadius:4, border:`1px solid ${selMeal===m?G.gold:G.borderB}`, background:selMeal===m?`${G.gold}18`:"transparent", color:selMeal===m?G.gold:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>{m}</button>
            ))}
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>
            {filteredFoods.length} RESULTS{catFilter!=="ALL"?` · ${catFilter}`:""}
          </div>
          {filteredFoods.slice(0,25).map((f)=>(
            <ChromeCard key={f.name} style={{ padding:"10px 12px", marginBottom:7, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                  {f.cat && <span style={{ background:`${G.purpleLight}15`, border:`1px solid ${G.purpleLight}33`, borderRadius:3, padding:"1px 6px", fontFamily:FONT.body, fontSize:8, color:G.purpleLight, letterSpacing:1, textTransform:"uppercase", flexShrink:0 }}>{f.cat}</span>}
                </div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{f.cal} CAL · P:{f.pro}G · C:{f.carb}G · F:{f.fat}G</div>
              </div>
              <NeonBtn onClick={()=>{setLog(p=>[...p,{...f,id:Date.now(),meal:selMeal}]);showToast(`✓ Added to ${selMeal}`);}} small>+</NeonBtn>
            </ChromeCard>
          ))}
        </div>
      )}

      {view==="log" && MEALS.map(meal => {
        const items = log.filter(f=>f.meal===meal);
        const mealCal = items.reduce((a,f)=>a+f.cal,0);
        return (
          <div key={meal} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:2, height:14, background:G.gold, boxShadow:G.goldGlow2, borderRadius:1 }}/>
                <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>{meal}</div>
              </div>
              <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                {mealCal>0 && <div style={{ fontFamily:FONT.mono, fontSize:10, color:G.textDim }}>{mealCal} kcal</div>}
                <NeonBtn onClick={()=>{setSelMeal(meal);setView("search");}} small outline color={G.gold}>+ ADD</NeonBtn>
              </div>
            </div>
            {items.length===0 ? (
              <div style={{ background:`rgba(255,255,255,0.02)`, border:`1px dashed ${G.borderB}`, borderRadius:6, padding:"9px 12px", textAlign:"center" }}>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>Nothing logged</div>
              </div>
            ) : items.map(f=>(
              <ChromeCard key={f.id} style={{ padding:"9px 12px", marginBottom:5, display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{f.cal} CAL · P:{f.pro}G</div>
                </div>
                <button onClick={()=>setLog(p=>p.filter(x=>x.id!==f.id))} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:14, padding:"2px 5px", flexShrink:0 }}>✕</button>
              </ChromeCard>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function FeedScreen({ showToast, profile }) {
  const [feed, setFeed] = useState(FEED_DATA);
  const [activeComment, setActiveComment] = useState(null);
  const [cTxt, setCTxt] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [newTxt, setNewTxt] = useState("");

  const toggleLike = id => setFeed(p=>p.map(post=>post.id===id?{...post,liked:!post.liked,likes:post.liked?post.likes-1:post.likes+1}:post));

  const typeConfig = {
    pr: { color:G.gold, ico:"🏆", label:"PR ALERT" },
    milestone: { color:G.purpleLight, ico:"⭐", label:"MILESTONE" },
    post: { color:G.textMid, ico:"📢", label:"POST" },
  };

  return (
    <div style={{ padding:"20px 18px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
        <div>
          <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", lineHeight:1 }}>
            SQUAD <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>FEED</span>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginTop:3 }}>STRENGTH IN COMMUNITY</div>
        </div>
        <NeonBtn onClick={()=>setShowPost(true)} small>+ POST</NeonBtn>
      </div>

      {/* Instagram follow card */}
      <div onClick={()=>window.open("https://www.instagram.com/thesocialfitclub26","_blank")}
           style={{ background:"linear-gradient(135deg,rgba(131,58,180,0.18),rgba(253,29,29,0.12),rgba(252,176,69,0.15))", border:"1px solid rgba(253,29,29,0.28)", borderRadius:10, padding:"13px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:12, cursor:"pointer", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(131,58,180,0.06),rgba(252,176,69,0.04))", pointerEvents:"none" }}/>
        <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, boxShadow:"0 0 14px rgba(253,29,29,0.4)" }}>📸</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase", lineHeight:1.1 }}>FOLLOW US ON INSTAGRAM</div>
          <div style={{ fontFamily:FONT.body, fontSize:11, color:"rgba(252,176,69,0.85)", letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>@THESOCIALFITCLUB26</div>
        </div>
        <div style={{ background:"linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)", borderRadius:6, padding:"7px 12px", fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:"#fff", flexShrink:0, textTransform:"uppercase", boxShadow:"0 0 10px rgba(253,29,29,0.35)" }}>FOLLOW</div>
      </div>

      {feed.map(post => {
        const tc = typeConfig[post.type] || typeConfig.post;
        return (
          <ChromeCard key={post.id} style={{ marginBottom:13, overflow:"hidden" }}>
            <div style={{ height:2, background:`linear-gradient(90deg,${tc.color},transparent)`, boxShadow:`0 0 8px ${tc.color}66` }}/>
            <div style={{ padding:"12px 13px 0", display:"flex", alignItems:"center", gap:10 }}>
              <AvatarBadge initials={post.av} size={38}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{post.user}</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>{post.time}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <span style={{ fontFamily:FONT.body, fontSize:16 }}>{tc.ico}</span>
                <Chip label={tc.label} color={tc.color} small/>
              </div>
            </div>

            {post.tag && (
              <div style={{ margin:"10px 13px 0", background:`${G.gold}12`, border:`1px solid ${G.gold}33`, borderRadius:5, padding:"6px 10px", display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:3, height:14, background:G.gold, boxShadow:G.goldGlow2, borderRadius:1 }}/>
                <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>{post.tag}</div>
              </div>
            )}

            <div style={{ padding:"10px 13px 0", fontFamily:FONT.body, fontSize:14, color:G.text, lineHeight:1.55, letterSpacing:0.3 }}>{post.txt}</div>

            <div style={{ padding:"10px 13px 12px", display:"flex", gap:6, alignItems:"center" }}>
              <button onClick={()=>toggleLike(post.id)} style={{ display:"flex", alignItems:"center", gap:5, background: post.liked?`${G.gold}15`:"transparent", border:`1px solid ${post.liked?G.gold+"55":G.borderB}`, borderRadius:20, padding:"5px 11px", color:post.liked?G.gold:G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, cursor:"pointer", transition:"all 0.2s" }}>
                {post.liked?"❤️":"🤍"} {post.likes}
              </button>
              <button onClick={()=>setActiveComment(activeComment===post.id?null:post.id)} style={{ display:"flex", alignItems:"center", gap:5, background: activeComment===post.id?`${G.purpleLight}15`:"transparent", border:`1px solid ${activeComment===post.id?G.purpleLight+"55":G.borderB}`, borderRadius:20, padding:"5px 11px", color:activeComment===post.id?G.purpleLight:G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, cursor:"pointer" }}>
                💬 {post.comments}
              </button>
              <button style={{ marginLeft:"auto", background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:20, padding:"5px 11px", color:G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, cursor:"pointer" }}>✉️ DM</button>
            </div>

            {activeComment===post.id && (
              <div style={{ borderTop:`1px solid ${G.borderB}`, padding:"11px 13px" }}>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={cTxt} onChange={e=>setCTxt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&cTxt.trim()){setFeed(p=>p.map(x=>x.id===post.id?{...x,comments:x.comments+1}:x));setCTxt("");}}} placeholder="YOUR COMMENT..." style={{ flex:1, background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:20, padding:"8px 13px", color:"#fff", fontSize:12, outline:"none", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" }}/>
                  <button onClick={()=>{if(!cTxt.trim())return;setFeed(p=>p.map(x=>x.id===post.id?{...x,comments:x.comments+1}:x));setCTxt("");}} style={{ width:38, height:38, borderRadius:"50%", background:cTxt.trim()?`linear-gradient(135deg,${G.gold},${G.goldDark})`:"rgba(255,255,255,0.06)", border:"none", color:cTxt.trim()?"#0A0810":G.textDim, cursor:cTxt.trim()?"pointer":"default", fontSize:16, flexShrink:0 }}>↑</button>
                </div>
              </div>
            )}
          </ChromeCard>
        );
      })}

      {showPost && (
        <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.95)", zIndex:300, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowPost(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"16px 16px 0 0", padding:"22px 18px 48px", border:`1px solid ${G.border}`, borderBottom:"none" }}>
            <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"0 auto 18px" }}/>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:14 }}>SHARE WITH THE SQUAD</div>
            <textarea value={newTxt} onChange={e=>setNewTxt(e.target.value)} placeholder="WHAT DID YOU CRUSH TODAY..." style={{ width:"100%", padding:"12px 13px", borderRadius:7, background:"rgba(0,0,0,0.5)", border:`1px solid ${G.borderB}`, color:"#fff", fontSize:13, outline:"none", resize:"none", height:90, boxSizing:"border-box", lineHeight:1.5, marginBottom:13, fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" }}/>
            <NeonBtn onClick={()=>{if(!newTxt.trim())return;setFeed(p=>[{id:Date.now().toString(),user:profile?.username||"YOU",av:profile?.avatar_initials||"ME",time:"JUST NOW",txt:newTxt,likes:0,liked:false,comments:0,type:"post",tag:null},...p]);setNewTxt("");setShowPost(false);showToast("POST SHARED!");}} full>POST TO SQUAD ◆</NeonBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function MoreScreen({ showToast, profile, onSignOut }) {
  const FEATURES = [
    {id:"live", l:"LIVE TRAINING", ico:"🎥", desc:"Virtual 1-on-1 · from $29/mo", col:G.gold, hot:true},
    {id:"merch", l:"SFC MERCH", ico:"👕", desc:"Official gear & member drops", col:G.gold},
    {id:"reports", l:"WEEKLY REPORTS", ico:"📋", desc:"Personalized coaching notes", col:G.purpleLight, hot:true},
    {id:"form", l:"FORM CHECK", ico:"🏋️", desc:"Expert feedback on your lifts", col:G.gold},
    {id:"health", l:"HEALTH CONNECT", ico:"⌚", desc:"Sync Apple Health & wearables", col:G.blue},
    {id:"ai", l:"AI COACH", ico:"🤖", desc:"Smart daily recommendations", col:G.gold, hot:true},
    {id:"book", l:"BOOK SESSION", ico:"📅", desc:"In-person & online PT sessions", col:G.purpleLight},
    {id:"partners", l:"ACCOUNTABILITY", ico:"🤝", desc:"Train together, stay consistent", col:G.green},
    {id:"goals", l:"GOALS", ico:"🎯", desc:"Track your fitness targets", col:G.gold},
  ];
  return (
    <div style={{ padding:"20px 18px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:6 }}>
        MORE <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>TOOLS</span>
      </div>
      <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:18 }}>◆ &nbsp;ALL FEATURES</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:20 }}>
        {FEATURES.map(f => (
          <button key={f.id} onClick={()=>showToast(`${f.ico} ${f.l} — COMING SOON`)} style={{ background:f.hot?`${f.col}0C`:"rgba(255,255,255,0.03)", border:`1px solid ${f.hot?f.col+"33":G.borderB}`, borderRadius:9, padding:"14px 12px", cursor:"pointer", textAlign:"left", position:"relative", overflow:"hidden" }}>
            {f.hot && <div style={{ position:"absolute", top:7, right:8, width:6, height:6, borderRadius:"50%", background:f.col, boxShadow:`0 0 6px ${f.col}, 0 0 12px ${f.col}44` }}/>}
            <div style={{ position:"absolute", top:-6, right:-6, fontSize:36, opacity:0.12 }}>{f.ico}</div>
            <div style={{ fontSize:22, marginBottom:7 }}>{f.ico}</div>
            <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", textTransform:"uppercase", lineHeight:1.2, marginBottom:4 }}>{f.l}</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:f.hot?f.col:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>{f.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.borderB},transparent)`, marginBottom:16 }}/>
      <SectionLabel>Connect</SectionLabel>
      <div onClick={()=>window.open("https://www.instagram.com/thesocialfitclub26","_blank")}
           style={{ background:"linear-gradient(135deg,rgba(131,58,180,0.14),rgba(252,176,69,0.10))", border:"1px solid rgba(253,29,29,0.25)", borderRadius:10, padding:"12px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>📸</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>INSTAGRAM</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:"rgba(252,176,69,0.8)", letterSpacing:1.5, textTransform:"uppercase" }}>@THESOCIALFITCLUB26</div>
        </div>
        <span style={{ color:G.textDim, fontSize:13 }}>›</span>
      </div>
      <SectionLabel>Account</SectionLabel>
      {/* Logged-in user card */}
      <ChromeCard gold style={{ padding:"13px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
        <AvatarBadge initials={profile?.avatar_initials||"ME"} size={44} gold/>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{profile?.username||"ATHLETE"}</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginTop:2 }}>{profile?.points||0} pts · MEMBER</div>
        </div>
        <div style={{ fontFamily:FONT.display, fontSize:22, color:G.gold, letterSpacing:1 }}>💪</div>
      </ChromeCard>
      {[{l:"ADMIN DASHBOARD",ico:"👑",col:G.gold},{l:"NOTIFICATION SETTINGS",ico:"🔔",col:G.textMid},{l:"PRIVACY & SECURITY",ico:"🔒",col:G.textMid},{l:"HELP & SUPPORT",ico:"❓",col:G.textMid}].map((item)=>(
        <div key={item.l} onClick={()=>showToast(item.l)} style={{ background:`linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(10,8,24,0.8) 100%)`, border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>{item.ico}</span>
          <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:item.col, textTransform:"uppercase" }}>{item.l}</div>
          <span style={{ color:G.textDim, fontSize:13 }}>›</span>
        </div>
      ))}
      <div onClick={onSignOut} style={{ background:"rgba(255,61,90,0.07)", border:`1px solid ${G.red}33`, borderRadius:10, padding:"13px 14px", marginTop:4, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🚪</span>
        <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.red, textTransform:"uppercase" }}>SIGN OUT</div>
        <span style={{ color:G.red, fontSize:13, opacity:0.6 }}>›</span>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  const inp = { background:"rgba(0,0,0,0.45)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"13px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.body, letterSpacing:1.5 };

  const submit = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError(null);
    try {
      if (mode === "signup") {
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password });
        if (e) throw e;
        if (data.session === null) setAwaitingConfirm(true);
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (e) throw e;
      }
    } catch (e) {
      setError(e.message === "Invalid login credentials" ? "Incorrect email or password." : e.message);
    } finally { setLoading(false); }
  };

  const errMap = { "Email not confirmed": "Please confirm your email first, then sign in." };

  if (awaitingConfirm) return (
    <div style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
      <GridBg/>
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>📧</div>
        <div style={{ fontFamily:FONT.display, fontSize:26, letterSpacing:4, color:"#fff", marginBottom:10 }}>CHECK YOUR EMAIL</div>
        <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.6, marginBottom:28 }}>
          We sent a confirmation link to<br/>
          <span style={{ color:G.gold }}>{email}</span><br/>
          Click it to activate your account, then sign in.
        </div>
        <NeonBtn onClick={()=>{ setAwaitingConfirm(false); setMode("signin"); }} full>BACK TO SIGN IN</NeonBtn>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
      <GridBg/>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
          <img src={logoImg} alt="Social Fit Club" style={{ width:110, height:110, borderRadius:"50%", objectFit:"cover", objectPosition:"center top", boxShadow:`0 0 30px rgba(253,185,39,0.45), 0 0 60px rgba(85,37,131,0.35)`, border:`3px solid ${G.gold}88` }}/>
        </div>
        <div style={{ fontFamily:FONT.display, fontSize:28, letterSpacing:4, color:"#fff", textAlign:"center", marginBottom:4 }}>
          {mode==="signup" ? "JOIN THE CLUB" : "WELCOME BACK"}
        </div>
        <div style={{ fontFamily:FONT.body, fontSize:11, letterSpacing:3, color:G.textMid, textAlign:"center", textTransform:"uppercase", marginBottom:28 }}>
          ◆ &nbsp;SOCIAL FIT CLUB&nbsp; ◆
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          {mode==="signup" && (
            <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="DISPLAY NAME" style={inp}/>
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="EMAIL" type="email" autoCapitalize="none" style={inp}/>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="PASSWORD" type="password" style={inp}
            onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>

        {error && (
          <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(255,61,90,0.1)", border:`1px solid ${G.red}44`, borderRadius:7, fontFamily:FONT.body, fontSize:12, color:G.red, letterSpacing:1 }}>
            {errMap[error]||error}
          </div>
        )}

        <div style={{ marginTop:18 }}>
          <NeonBtn onClick={submit} full disabled={loading}>
            {loading ? "LOADING..." : mode==="signup" ? "CREATE ACCOUNT ◆" : "SIGN IN ◆"}
          </NeonBtn>
        </div>

        <div style={{ textAlign:"center", marginTop:18 }}>
          <button onClick={()=>{ setMode(m=>m==="signin"?"signup":"signin"); setError(null); }} style={{ background:"none", border:"none", fontFamily:FONT.body, fontSize:12, letterSpacing:2, color:G.textMid, textTransform:"uppercase", cursor:"pointer" }}>
            {mode==="signin" ? "New here? Create an account" : "Already a member? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SocialFitClub() {
  const [tab, setTab] = useState("home");
  const [sessions, setSessions] = useState([]);
  const [quickStartWorkout, setQuickStartWorkout] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const toastTimer = useRef(null);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("id, username, avatar_initials, points, streak, sessions_count").eq("id", userId).single();
    if (data) { setProfile(data); return data; }
    return null;
  };

  const loadSessions = async (userId) => {
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setSessions(data.map(s => ({ name:s.name, exs:s.exercises, sets:s.sets, vol:s.volume, pts:s.points, date:s.date })));
  };

  const loadLeaderboard = async (currentUserId) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar_initials, points, sessions_count, streak")
      .order("points", { ascending: false })
      .limit(20);
    if (data) {
      setLeaderboard(data.map((p, i) => ({
        rank: i + 1,
        name: p.username || "ANONYMOUS",
        pts: p.points || 0,
        sessions: p.sessions_count || 0,
        streak: p.streak || 0,
        av: p.avatar_initials || "?",
        isMe: p.id === currentUserId,
      })));
    }
  };

  const ensureProfile = async (u) => {
    const existing = await loadProfile(u.id);
    if (!existing) {
      const base = u.email.split("@")[0].replace(/[^a-zA-Z0-9 ]/g, " ").trim().toUpperCase().slice(0, 20);
      const initials = base.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2) || "ME";
      const { data } = await supabase.from("profiles").insert({ id: u.id, username: base || "ATHLETE", avatar_initials: initials, points: 0, streak: 0, sessions_count: 0 }).select().single();
      if (data) setProfile(data);
    }
    await loadSessions(u.id);
    await loadLeaderboard(u.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { loadProfile(session.user.id); loadSessions(session.user.id); loadLeaderboard(session.user.id); }
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await ensureProfile(session.user);
      else { setProfile(null); setSessions([]); }
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    const lbChannel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadLeaderboard(user.id);
      })
      .subscribe();
    return () => supabase.removeChannel(lbChannel);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTab("home");
    setSessions([]);
    setProfile(null);
  };

  const showToast = msg => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const handleSave = async (sess) => {
    // Optimistic local update
    setSessions(p => [sess, ...p]);
    const newPts = (profile?.points || 0) + sess.pts;
    const newSessionsCount = (profile?.sessions_count || 0) + 1;
    setProfile(p => ({ ...p, points: newPts, sessions_count: newSessionsCount }));
    setLeaderboard(p =>
      p.map(u => u.isMe ? { ...u, pts: newPts, sessions: u.sessions + 1 } : u)
       .sort((a,b) => b.pts - a.pts)
       .map((u,i) => ({ ...u, rank: i+1 }))
    );
    showToast(`🏆 SESSION SAVED · +${sess.pts} POINTS`);

    // Persist to Supabase
    const [{ error: sErr }, { error: pErr }] = await Promise.all([
      supabase.from("sessions").insert({
        user_id: user.id,
        name: sess.name,
        exercises: sess.exs,
        sets: sess.sets,
        volume: sess.vol,
        points: sess.pts,
        date: sess.date,
      }),
      supabase.from("profiles").update({ points: newPts, sessions_count: newSessionsCount }).eq("id", user.id),
    ]);
    if (sErr || pErr) showToast("⚠️ SYNC ERROR — DATA MAY NOT BE SAVED");
  };

  const handleQuickStart = (workout) => {
    setTab("train");
    setQuickStartWorkout(workout);
  };

  const TABS = [
    { id:"home", ico:"⬡", l:"HOME" },
    { id:"train", ico:"🏋️", l:"TRAIN" },
    { id:"progress", ico:"📈", l:"STATS" },
    { id:"nutrition", ico:"🥗", l:"FUEL" },
    { id:"feed", ico:"👥", l:"SQUAD" },
    { id:"more", ico:"⋯", l:"MORE" },
  ];

  if (!authReady) return <div style={{ minHeight:"100vh", background:G.bg }}/>;
  if (!user || !profile) return <LoginScreen/>;

  return (
    <div style={{ minHeight:"100vh", background:G.bg, color:G.text, fontFamily:FONT.body, maxWidth:480, margin:"0 auto", position:"relative", userSelect:"none" }}>
      <GridBg/>

      {toast && (
        <div style={{ position:"fixed", top:18, left:"50%", transform:"translateX(-50%)", background:G.bg3, border:`1px solid ${G.gold}55`, borderRadius:7, padding:"10px 18px", zIndex:9999, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.gold, boxShadow:`${G.goldGlow}, 0 8px 32px rgba(0,0,0,0.6)`, whiteSpace:"nowrap", textTransform:"uppercase", animation:"toastIn 0.25s ease" }}>{toast}</div>
      )}

      <div style={{ paddingBottom:82, position:"relative", zIndex:2, minHeight:"100vh" }}>
        {tab==="home" && <HomeScreen sessions={sessions} leaderboard={leaderboard} onStartWorkout={()=>setTab("train")} onQuickStart={handleQuickStart} showToast={showToast} profile={profile}/>}
        {tab==="train" && <TrainScreen showToast={showToast} onSave={handleSave} quickStart={quickStartWorkout} onClearQuickStart={()=>setQuickStartWorkout(null)} sessions={sessions}/>}
        {tab==="progress" && <ProgressScreen showToast={showToast} sessions={sessions} profile={profile}/>}
        {tab==="nutrition" && <NutritionScreen showToast={showToast}/>}
        {tab==="feed" && <FeedScreen showToast={showToast} profile={profile}/>}
        {tab==="more" && <MoreScreen showToast={showToast} profile={profile} onSignOut={handleSignOut}/>}
      </div>

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:50 }}>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.gold}66,${G.gold},${G.gold}66,transparent)`, boxShadow:`0 0 10px ${G.gold}55` }}/>
        <div style={{ background:`linear-gradient(180deg,rgba(6,6,14,0.97) 0%,rgba(8,8,16,1) 100%)`, backdropFilter:"blur(20px)", display:"flex", padding:"8px 0 20px" }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 0", position:"relative" }}>
                {active && <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:30, height:2, background:G.gold, borderRadius:1, boxShadow:G.goldGlow2 }}/>}
                <span style={{ fontSize:18, filter: active ? `drop-shadow(0 0 6px ${G.gold})` : "none", transition:"filter 0.2s", marginTop:4 }}>{t.ico}</span>
                <span style={{ fontFamily:FONT.display, fontSize:9, letterSpacing:2, textTransform:"uppercase", color: active ? G.gold : G.textDim, transition:"color 0.2s" }}>{t.l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translate(-50%,-10px)} to{opacity:1;transform:translate(-50%,0)} }
        @keyframes heatPulse { 0%,100%{opacity:1} 50%{opacity:0.65} }
        @keyframes scanLine { from{top:0} to{top:100%} }
        * { -webkit-tap-highlight-color: transparent; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        input::placeholder, textarea::placeholder { color: #3D3360; letter-spacing: 1px; }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}
