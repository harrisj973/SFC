import { useState, useEffect, useRef, Component } from "react";
import logoImg from "./assets/logo.jpg";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hcrhoccdgdelmbsmbrba.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcmhvY2NkZ2RlbG1ic21icmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzAyMzcsImV4cCI6MjA5NDU0NjIzN30.Ulcfa_LbgVsqsSt47M1bvDbgLW6nuvVzM-1sEUKj624"
);

const ADMIN_EMAIL = "harrisj1025@gmail.com";

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

const EXERCISE_CATS = {
  "CHEST":     ["Barbell Bench Press","Incline Dumbbell Press","Cable Flyes","Dumbbell Flyes"],
  "BACK":      ["Barbell Row","Lat Pulldown","Pull-Ups","Barbell Deadlift","Romanian Deadlift"],
  "LEGS":      ["Barbell Squat","Hack Squat","Leg Press","Bulgarian Split Squat","Leg Curl","Kettlebell Swing"],
  "SHOULDERS": ["Barbell Overhead Press","Arnold Press","Lateral Raises","Rear Delt Flyes"],
  "ARMS":      ["Barbell Curl","Hammer Curl","Preacher Curl","Tricep Pushdown","Skull Crushers"],
  "CORE":      ["Plank","Ab Wheel","Hanging Leg Raises","Russian Twists"],
  "CARDIO":    ["Jump Rope","Assault Bike","Box Jumps"],
};
const EX_CAT_LOOKUP = {};
Object.entries(EXERCISE_CATS).forEach(([cat, arr]) => arr.forEach(n => { EX_CAT_LOOKUP[n] = cat; }));

const REACTIONS = ["🔥","💪","👊","⚡","🙌"];


const MACROS_GOAL = { cal:2200, pro:180, carb:220, fat:65 };

const SESSION_TYPES = [
  { id:"push",     label:"PUSH",      color:"#FF6B6B" },
  { id:"pull",     label:"PULL",      color:"#4ECDC4" },
  { id:"legs",     label:"LEGS",      color:"#A29BFE" },
  { id:"upper",    label:"UPPER",     color:"#74B9FF" },
  { id:"lower",    label:"LOWER",     color:"#FDCB6E" },
  { id:"full",     label:"FULL BODY", color:"#55EFC4" },
  { id:"cardio",   label:"CARDIO",    color:"#FF7675" },
  { id:"core",     label:"CORE",      color:"#FD79A8" },
  { id:"recovery", label:"RECOVERY",  color:"#B2BEC3" },
];

const MACRO_COACH_KEY = "sfc_macro_coach";

const DAILY_MESSAGES = [
  { msg: "Champions are made in the moments they want to quit.", sub: "Show up anyway." },
  { msg: "Your only competition is who you were yesterday.", sub: "Outwork your past self." },
  { msg: "Progress, not perfection.", sub: "One rep at a time." },
  { msg: "The pain you feel today is the strength you'll feel tomorrow.", sub: "Trust the process." },
  { msg: "Discipline is choosing between what you want now and what you want most.", sub: "Stay locked in." },
  { msg: "You don't have to be extreme. Just be consistent.", sub: "Show up every day." },
  { msg: "Strong is built, not born.", sub: "Every session counts." },
  { msg: "The body achieves what the mind believes.", sub: "Believe in your potential." },
  { msg: "Rest days are part of the plan. Hard days are too.", sub: "Honor both." },
  { msg: "No one regrets a workout. Ever.", sub: "Get it done." },
  { msg: "The gym is the one place where you always win if you show up.", sub: "Walk in. Win." },
  { msg: "Sweat is just your body crying happy tears.", sub: "Make it cry today." },
  { msg: "Excuses don't build muscle.", sub: "Neither does yesterday. Go." },
  { msg: "Small steps taken consistently create massive results.", sub: "Keep stacking." },
  { msg: "You are stronger than your excuses.", sub: "Prove it today." },
  { msg: "Every rep is a vote for who you're becoming.", sub: "Cast your vote." },
  { msg: "Motivation gets you started. Habit keeps you going.", sub: "Build the habit." },
  { msg: "The hardest part is lacing up your shoes.", sub: "You're already past the hard part." },
  { msg: "Your future self is watching. Make them proud.", sub: "Work for that version of you." },
  { msg: "One workout at a time. One day at a time.", sub: "Stay present." },
  { msg: "The difference between try and triumph is a little umph.", sub: "Add the umph today." },
  { msg: "Greatness isn't given. It's earned every single day.", sub: "Go earn it." },
  { msg: "Push through the discomfort. Comfort never built anyone great.", sub: "Embrace the grind." },
  { msg: "You have survived 100% of your hardest days.", sub: "Today is no different." },
  { msg: "Results don't lie. Neither does effort.", sub: "Put in the real work." },
  { msg: "A year from now you'll wish you started today.", sub: "Today is that day." },
  { msg: "The gym doesn't care about your mood. It just works.", sub: "Go work." },
  { msg: "Consistency beats intensity every time.", sub: "Show up, show out." },
  { msg: "Pain is temporary. PRs are forever.", sub: "Chase the record." },
  { msg: "The iron never lies. What are you made of?", sub: "Time to find out." },
  { msg: "Your goals don't care how you feel this morning.", sub: "Get up and go." },
  { msg: "Every rep you do is one your competition skipped.", sub: "Stay ahead." },
  { msg: "Build a body your mind can rely on.", sub: "Strength is security." },
  { msg: "Train hard. Rest smart. Repeat forever.", sub: "That's the formula." },
  { msg: "The weight doesn't get lighter. You get stronger.", sub: "Keep lifting." },
  { msg: "Nobody who ever gave their best regretted it.", sub: "Give your best today." },
  { msg: "Showing up is 80% of the battle.", sub: "You're already winning." },
  { msg: "Today's effort is tomorrow's result.", sub: "Invest wisely." },
  { msg: "What you do in the dark shows up in the light.", sub: "Put in the work." },
  { msg: "Your body is your most important investment.", sub: "Protect it. Strengthen it." },
  { msg: "Fall in love with the process and the results will follow.", sub: "Enjoy the grind." },
  { msg: "Set the bar. Then raise it.", sub: "You're capable of more." },
  { msg: "Tired? Good. That means you're working.", sub: "Push through it." },
  { msg: "Champions train. Everyone else wishes.", sub: "Be a champion." },
];

function DailyMotivModal({ onClose }) {
  const [nowMs] = useState(() => Date.now());
  const dateLabel = new Date(nowMs).toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" }).toUpperCase();
  const dayOfYear = Math.floor((nowMs - new Date(new Date(nowMs).getFullYear(), 0, 0)) / 86400000);
  const { msg, sub } = DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px", animation:"motivFadeIn 0.4s ease" }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(6,6,14,0.88)", backdropFilter:"blur(8px)" }}/>
      <div onClick={e => e.stopPropagation()}
        style={{ position:"relative", background:"linear-gradient(145deg,#110D28,#0A0819)", border:`1px solid ${G.gold}55`, borderRadius:18, padding:"32px 28px 28px", maxWidth:380, width:"100%", boxShadow:`0 0 60px ${G.gold}22, 0 24px 64px rgba(0,0,0,0.7)`, textAlign:"center" }}>
        <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:4, color:G.gold, textTransform:"uppercase", marginBottom:18, opacity:0.8 }}>
          {dateLabel}
        </div>
        <div style={{ fontSize:36, marginBottom:14, lineHeight:1 }}>💪</div>
        <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:1.5, color:"#fff", lineHeight:1.35, marginBottom:12, textTransform:"uppercase" }}>
          {msg}
        </div>
        <div style={{ fontFamily:FONT.body, fontSize:13, letterSpacing:2, color:G.gold, textTransform:"uppercase", marginBottom:28, opacity:0.9 }}>
          {sub}
        </div>
        <div style={{ width:48, height:2, background:`linear-gradient(90deg,transparent,${G.gold},transparent)`, margin:"0 auto 28px", borderRadius:1 }}/>
        <button onClick={onClose}
          style={{ background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:10, padding:"13px 36px", color:"#0A0810", fontFamily:FONT.display, fontSize:14, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", fontWeight:700, width:"100%", boxShadow:`0 4px 20px ${G.gold}44` }}>
          LET'S GO ◆
        </button>
      </div>
    </div>
  );
}

function loadMacroCoach() {
  try { return JSON.parse(localStorage.getItem(MACRO_COACH_KEY) || "null"); } catch { return null; }
}
function getActiveMacroTargets() {
  const d = loadMacroCoach();
  if (d?.setupComplete) return { cal: d.calories, pro: d.protein, carb: d.carbs, fat: d.fat };
  return MACROS_GOAL;
}
function calcTDEE(sex, age, heightIn, weightLbs, activity) {
  const kg = weightLbs * 0.453592;
  const cm = heightIn * 2.54;
  const bmr = sex === "male"
    ? 10 * kg + 6.25 * cm - 5 * age + 5
    : 10 * kg + 6.25 * cm - 5 * age - 161;
  const m = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, very_active:1.9 };
  return Math.round(bmr * (m[activity] || 1.55));
}
function calcMacrosFromCalories(calories, weightLbs) {
  const protein = Math.round(weightLbs * 1.0);
  const fat = Math.round(Math.max(40, weightLbs * 0.35));
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { protein, fat, carbs };
}
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
  "049000028911": {name:"Coca-Cola 355ml",cal:140,pro:0,carb:39,fat:0,brand:"Coca-Cola"},
  "049000050043": {name:"Coca-Cola Zero Sugar 355ml",cal:0,pro:0,carb:0,fat:0,brand:"Coca-Cola"},
  "041196050120": {name:"Fairlife Core Power 11.5oz",cal:230,pro:42,carb:7,fat:3.5,brand:"Fairlife"},
  "016000275287": {name:"Nature Valley Oats 'n Honey Bar",cal:190,pro:4,carb:29,fat:7,brand:"Nature Valley"},
  "722252101587": {name:"KIND Dark Chocolate Almond Bar",cal:200,pro:6,carb:18,fat:15,brand:"KIND"},
  "070038631552": {name:"Clif Bar Chocolate Chip",cal:250,pro:9,carb:44,fat:5,brand:"Clif Bar"},
  "611247531888": {name:"Rx Bar Chocolate Sea Salt",cal:210,pro:12,carb:23,fat:9,brand:"RxBar"},
  "036632008794": {name:"Premier Protein Chocolate Shake",cal:160,pro:30,carb:5,fat:3,brand:"Premier Protein"},
  "722252010260": {name:"Clif Bar Chocolate Brownie",cal:240,pro:9,carb:42,fat:5,brand:"Clif Bar"},
  "888849000265": {name:"Quest Bar Chocolate Chip Cookie Dough",cal:190,pro:21,carb:22,fat:7,brand:"Quest Nutrition"},
  "860133003069": {name:"Rx Bar Chocolate Peanut Butter",cal:210,pro:12,carb:24,fat:9,brand:"RxBar"},
  "021908512716": {name:"Larabar Apple Pie",cal:190,pro:4,carb:29,fat:8,brand:"Larabar"},
  "050000396473": {name:"Gatorade Fruit Punch 20oz",cal:130,pro:0,carb:34,fat:0,brand:"Gatorade"},
  "052000047832": {name:"Gatorade Zero Glacier Cherry 20oz",cal:10,pro:0,carb:3,fat:0,brand:"Gatorade"},
  "818290011103": {name:"Chobani Vanilla Non-Fat Greek Yogurt",cal:120,pro:12,carb:16,fat:0,brand:"Chobani"},
  "036987002610": {name:"Fage Total 0% Greek Yogurt 7oz",cal:100,pro:18,carb:7,fat:0,brand:"Fage"},
  "850022890179": {name:"Siggi's Vanilla Yogurt 5.3oz",cal:110,pro:15,carb:8,fat:0,brand:"Siggi's"},
  "852013006439": {name:"Bang Blue Razz Energy Drink",cal:0,pro:0,carb:0,fat:0,brand:"Bang Energy"},
  "070847811695": {name:"Monster Energy Original 16oz",cal:210,pro:0,carb:54,fat:0,brand:"Monster"},
  "611269991692": {name:"Red Bull Energy Drink 8.4oz",cal:110,pro:1,carb:28,fat:0,brand:"Red Bull"},
  "643843918522": {name:"Premier Protein Vanilla Shake",cal:160,pro:30,carb:5,fat:3,brand:"Premier Protein"},
  "036632034006": {name:"Muscle Milk Chocolate Shake",cal:150,pro:25,carb:9,fat:3,brand:"Muscle Milk"},
  "748927025798": {name:"ON Gold Standard Whey Chocolate",cal:120,pro:24,carb:3,fat:1.5,brand:"Optimum Nutrition"},
  "796504028193": {name:"Kodiak Cakes Protein Waffles",cal:230,pro:12,carb:31,fat:5,brand:"Kodiak Cakes"},
  "853643007104": {name:"Good Culture Cottage Cheese 5.3oz",cal:110,pro:14,carb:5,fat:4,brand:"Good Culture"},
  "096619250486": {name:"Kirkland Protein Bar Chocolate Brownie",cal:190,pro:21,carb:21,fat:7,brand:"Kirkland"},
};
const SUPP_TYPES = ["ALL","PROTEIN","AMINO","PRE-WORKOUT","VITAMIN","MINERAL","STRENGTH","ENERGY","RECOVERY","SLEEP","ADAPTOGEN","HYDRATION","OMEGA"];
const SUPP_TYPE_COLOR = { PROTEIN:G.gold, AMINO:G.purpleLight, "PRE-WORKOUT":"#FF6B00", VITAMIN:"#00FF88", MINERAL:G.blue, STRENGTH:G.gold, ENERGY:"#FF3D5A", RECOVERY:G.purpleLight, SLEEP:G.blue, ADAPTOGEN:"#00FF88", HYDRATION:G.blue, OMEGA:"#4DA6FF" };
const SUPPLEMENTS_DB = [
  { name:"Whey Protein",        type:"PROTEIN",     serving:"1 scoop (30g)", cal:120, pro:24, carb:3,   fat:1.5, brand:"Generic" },
  { name:"Casein Protein",      type:"PROTEIN",     serving:"1 scoop (33g)", cal:110, pro:23, carb:3,   fat:1,   brand:"Generic" },
  { name:"Plant Protein",       type:"PROTEIN",     serving:"1 scoop (30g)", cal:110, pro:20, carb:5,   fat:2,   brand:"Generic" },
  { name:"Mass Gainer",         type:"PROTEIN",     serving:"3 scoops (250g)",cal:1250,pro:50, carb:248, fat:3.5, brand:"Generic" },
  { name:"Creatine Monohydrate",type:"STRENGTH",    serving:"5g",            cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Pre-Workout",         type:"PRE-WORKOUT", serving:"1 scoop (15g)", cal:10,  pro:1,  carb:2,   fat:0,   brand:"Generic" },
  { name:"BCAAs",               type:"AMINO",       serving:"7g",            cal:20,  pro:5,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Glutamine",         type:"AMINO",       serving:"5g",            cal:20,  pro:5,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Citrulline",        type:"AMINO",       serving:"6g",            cal:24,  pro:6,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Beta-Alanine",        type:"PRE-WORKOUT", serving:"3.2g",          cal:8,   pro:2,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Caffeine",            type:"ENERGY",      serving:"200mg cap",     cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Fish Oil (Omega-3)",  type:"OMEGA",       serving:"2 softgels",    cal:20,  pro:0,  carb:0,   fat:2,   brand:"Generic" },
  { name:"Vitamin D3",          type:"VITAMIN",     serving:"1 capsule",     cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Vitamin C",           type:"VITAMIN",     serving:"500mg tab",     cal:2,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Vitamin B12",         type:"VITAMIN",     serving:"1 tablet",      cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Multivitamin",        type:"VITAMIN",     serving:"1 tablet",      cal:5,   pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Magnesium Glycinate", type:"MINERAL",     serving:"400mg",         cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Zinc",                type:"MINERAL",     serving:"25mg cap",      cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Electrolytes",        type:"HYDRATION",   serving:"1 packet",      cal:10,  pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Collagen Peptides",   type:"RECOVERY",    serving:"10g",           cal:40,  pro:9,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Ashwagandha",         type:"ADAPTOGEN",   serving:"600mg cap",     cal:5,   pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Melatonin",           type:"SLEEP",       serving:"5mg tablet",    cal:0,   pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Turmeric/Curcumin",   type:"ADAPTOGEN",   serving:"500mg cap",     cal:5,   pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"CoQ10",               type:"RECOVERY",    serving:"100mg softgel", cal:5,   pro:0,  carb:0,   fat:0.5, brand:"Generic" },
  { name:"Probiotics",          type:"RECOVERY",    serving:"1 capsule",     cal:5,   pro:0,  carb:1,   fat:0,   brand:"Generic" },
];
const REST_OPTIONS = [
  { label:"45S", sec:45 }, { label:"1 MIN", sec:60 },
  { label:"1:30", sec:90 }, { label:"2 MIN", sec:120 },
];
const DAYS_SHORT = ["M","T","W","T","F","S","S"];

function calcBestWeekVolume(sessions) {
  const byWeek = {};
  for (const sess of sessions) {
    if (!sess.createdAt) continue;
    const d = new Date(sess.createdAt);
    const dayOfWeek = (d.getDay() + 6) % 7;
    const weekStart = new Date(d);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(d.getDate() - dayOfWeek);
    const key = weekStart.toISOString().slice(0, 10);
    byWeek[key] = (byWeek[key] || 0) + (sess.vol || 0);
  }
  return Object.values(byWeek).reduce((a, v) => Math.max(a, v), 0);
}

function calcWeeklyVolume(sessions) {
  const days = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0=Mon … 6=Sun
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  for (const sess of sessions) {
    if (!sess.createdAt) continue;
    const d = new Date(sess.createdAt);
    if (d >= startOfWeek && d <= now) {
      days[(d.getDay() + 6) % 7] += sess.vol || 0;
    }
  }
  return days;
}

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
      const sets = ex.sets.filter(s => s.r && s.w && s.type !== "warmup").length || 1;
      const vol  = ex.sets.filter(s => s.type !== "warmup").reduce((s,set) => s + (parseFloat(set.w)||0)*(parseInt(set.r)||0), 0);
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


function calcPRs(sessions) {
  const prs = {};
  for (const sess of sessions) {
    for (const ex of (sess.exs || [])) {
      if (!ex.name) continue;
      for (const set of (ex.sets || [])) {
        if (set.type === "warmup") continue;
        const w = parseFloat(set.w) || 0;
        const r = parseInt(set.r) || 0;
        if (!w || !r) continue;
        const est1rm = Math.round(w * (1 + r / 30));
        if (!prs[ex.name] || est1rm > prs[ex.name].est1rm) {
          prs[ex.name] = { weight: w, reps: r, est1rm, date: sess.date };
        }
      }
    }
  }
  return prs;
}

function getLastExercisePerformance(exName, sessions) {
  if (!exName) return null;
  for (const sess of sessions) {
    const ex = (sess.exs || []).find(e => e.name === exName);
    if (ex) {
      const validSets = (ex.sets || []).filter(s => s.r && s.w && s.type !== "warmup");
      if (validSets.length > 0) return { date: sess.date || (sess.createdAt || "").slice(0, 10), sets: validSets };
    }
  }
  return null;
}

function progressWeight(w) {
  const base = parseFloat(w) || 0;
  return Math.round((base + 5) / 2.5) * 2.5;
}

function getExerciseHistory(exName, sessions) {
  const out = [];
  const chrono = [...sessions].reverse();
  for (const sess of chrono) {
    const ex = (sess.exs || []).find(e => e.name === exName);
    if (!ex) continue;
    let maxEst = 0; let bestSet = null;
    for (const set of (ex.sets || [])) {
      if (set.type === "warmup") continue;
      const w = parseFloat(set.w) || 0; const r = parseInt(set.r) || 0;
      if (!w || !r) continue;
      const est = Math.round(w * (1 + r / 30));
      if (est > maxEst) { maxEst = est; bestSet = { w, r }; }
    }
    if (bestSet) out.push({ date: sess.date || (sess.createdAt || "").slice(0,10), weight: bestSet.w, reps: bestSet.r, est1rm: maxEst });
  }
  return out;
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.65));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image failed to load")); };
    img.src = url;
  });
}

function extractFrames(videoFile) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    const positions = [0.2, 0.5, 0.8];
    const frames = [];
    let idx = 0;

    const captureFrame = () => {
      const MAX = 640;
      const scale = Math.min(1, MAX / Math.max(video.videoWidth || 640, video.videoHeight || 480));
      const w = Math.round((video.videoWidth || 640) * scale);
      const h = Math.round((video.videoHeight || 480) * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(video, 0, 0, w, h);
      return canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
    };

    const seekNext = () => {
      if (idx >= positions.length) {
        URL.revokeObjectURL(url);
        resolve(frames);
        return;
      }
      video.currentTime = video.duration * positions[idx];
    };

    video.addEventListener("seeked", () => {
      frames.push(captureFrame());
      idx++;
      seekNext();
    });

    video.addEventListener("loadedmetadata", () => seekNext());
    video.addEventListener("error", () => { URL.revokeObjectURL(url); reject(new Error("Video failed to load")); });
    video.load();
  });
}

function FormCheckModal({ onClose }) {
  const [exercise, setExercise] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [frames, setFrames] = useState([]);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const previewUrlRef = useRef(null);

  useEffect(() => () => { if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current); }, []);

  const handleVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { setError("Please select a video file."); return; }
    if (file.size > 100 * 1024 * 1024) { setError("Video must be under 100 MB."); return; }
    setVideoFile(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setFrames([]);
    setResult(null);
    setError(null);
    setExtracting(true);
    try {
      const extracted = await extractFrames(file);
      setFrames(extracted);
    } catch {
      setError("Could not extract frames from video. Try a different format (MP4 recommended).");
    } finally {
      setExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (frames.length === 0) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data: json, error: fnErr } = await supabase.functions.invoke("form-check", {
        body: { frames, exercise: exercise.trim() },
      });
      if (fnErr) throw new Error(fnErr.message);
      if (json?.error) throw new Error(json.error);
      setResult(json);
    } catch (e) {
      setError(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 8 ? G.green : s >= 6 ? G.gold : "#FF6B6B";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1000, display:"flex", flexDirection:"column", overflowY:"auto" }}>
      <div style={{ background:`linear-gradient(180deg,${G.bg3},${G.bg2})`, border:`1px solid ${G.gold}33`, borderRadius:"16px 16px 0 0", marginTop:"auto", padding:"20px 18px 32px", minHeight:"60vh" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:24, letterSpacing:4, color:"#fff" }}>FORM CHECK</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>◆ &nbsp;AI MOVEMENT ANALYSIS</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textMid, fontSize:22, cursor:"pointer", padding:4 }}>✕</button>
        </div>

        {!result && (
          <>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:6 }}>Exercise Name (optional)</div>
              <input
                value={exercise}
                onChange={e => setExercise(e.target.value)}
                placeholder="e.g. Back Squat, Bench Press, Deadlift..."
                maxLength={60}
                style={{ width:"100%", background:G.chrome, border:`1px solid ${G.border}`, borderRadius:8, padding:"10px 12px", fontFamily:FONT.body, fontSize:13, color:"#fff", outline:"none", boxSizing:"border-box" }}
              />
            </div>

            <label style={{ display:"block", marginBottom:14, cursor:"pointer" }}>
              <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:6 }}>Upload Video</div>
              <div style={{ background:G.chrome, border:`2px dashed ${G.gold}55`, borderRadius:10, padding:"20px 16px", textAlign:"center" }}>
                {videoFile ? (
                  <div>
                    <video src={previewUrl} style={{ width:"100%", maxHeight:160, borderRadius:7, objectFit:"cover" }} muted playsInline/>
                    <div style={{ fontFamily:FONT.body, fontSize:11, color:G.gold, letterSpacing:1, marginTop:8 }}>
                      {extracting ? "⏳ EXTRACTING FRAMES..." : frames.length > 0 ? `✓ ${frames.length} FRAMES READY` : ""}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize:32, marginBottom:6 }}>🎬</div>
                    <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", marginBottom:4 }}>TAP TO SELECT VIDEO</div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1 }}>MP4 · MOV · Up to 100 MB</div>
                  </div>
                )}
              </div>
              <input type="file" accept="video/*" capture="environment" onChange={handleVideo} style={{ display:"none" }}/>
            </label>

            {frames.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Sampled Frames</div>
                <div style={{ display:"flex", gap:6 }}>
                  {frames.map((f, i) => (
                    <img key={i} src={`data:image/jpeg;base64,${f}`} alt={`Frame ${i+1}`} style={{ flex:1, height:72, objectFit:"cover", borderRadius:6, border:`1px solid ${G.border}` }}/>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ background:"rgba(255,107,107,0.12)", border:"1px solid rgba(255,107,107,0.35)", borderRadius:8, padding:"10px 12px", fontFamily:FONT.body, fontSize:12, color:"#FF6B6B", marginBottom:14 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={frames.length === 0 || loading || extracting}
              style={{ width:"100%", background: frames.length > 0 && !loading && !extracting ? `linear-gradient(135deg,${G.gold},${G.goldDark})` : G.chrome, border:"none", borderRadius:10, padding:"14px", fontFamily:FONT.display, fontSize:16, letterSpacing:3, color: frames.length > 0 && !loading && !extracting ? "#0A0810" : G.textDim, cursor: frames.length > 0 && !loading && !extracting ? "pointer" : "not-allowed", textTransform:"uppercase", boxShadow: frames.length > 0 ? G.goldGlow2 : "none", transition:"all 0.2s" }}
            >
              {loading ? "⚡ ANALYZING FORM..." : "ANALYZE MY FORM"}
            </button>
          </>
        )}

        {result && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:14, background:G.chrome, border:`1px solid ${G.border}`, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:`${scoreColor(result.score)}22`, border:`2px solid ${scoreColor(result.score)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:FONT.display, fontSize:22, color:scoreColor(result.score) }}>{result.score}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:scoreColor(result.score), textTransform:"uppercase", marginBottom:3 }}>FORM SCORE / 10</div>
                <div style={{ fontFamily:FONT.body, fontSize:13, color:"#fff", lineHeight:1.4 }}>{result.summary}</div>
              </div>
            </div>

            {result.safety && (
              <div style={{ background:"rgba(255,107,107,0.1)", border:"1px solid rgba(255,107,107,0.35)", borderRadius:9, padding:"10px 12px", marginBottom:14, display:"flex", gap:8, alignItems:"flex-start" }}>
                <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
                <div style={{ fontFamily:FONT.body, fontSize:12, color:"#FF6B6B", lineHeight:1.5 }}>{result.safety}</div>
              </div>
            )}

            {result.strengths?.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.green, textTransform:"uppercase", marginBottom:8 }}>✓ &nbsp;WHAT YOU'RE DOING WELL</div>
                {result.strengths.map((s, i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                    <span style={{ color:G.green, fontSize:13, flexShrink:0 }}>•</span>
                    <div style={{ fontFamily:FONT.body, fontSize:13, color:"#fff", lineHeight:1.4 }}>{s}</div>
                  </div>
                ))}
              </div>
            )}

            {result.corrections?.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.gold, textTransform:"uppercase", marginBottom:8 }}>🔧 &nbsp;CORRECTIONS</div>
                {result.corrections.map((c, i) => (
                  <div key={i} style={{ background:`${G.gold}0A`, border:`1px solid ${G.gold}22`, borderRadius:8, padding:"10px 12px", marginBottom:7 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, color:G.gold, marginBottom:3 }}>{c.issue}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, lineHeight:1.5 }}>{c.fix}</div>
                  </div>
                ))}
              </div>
            )}

            {result.cues?.length > 0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.purpleLight, textTransform:"uppercase", marginBottom:8 }}>💬 &nbsp;COACHING CUES</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {result.cues.map((cue, i) => (
                    <div key={i} style={{ background:`${G.purple}33`, border:`1px solid ${G.purpleLight}44`, borderRadius:20, padding:"5px 12px", fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, color:G.purpleLight, textTransform:"uppercase" }}>{cue}</div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { setResult(null); setFrames([]); setVideoFile(null); setPreviewUrl(null); setExercise(""); setError(null); }}
              style={{ width:"100%", background:G.chrome, border:`1px solid ${G.border}`, borderRadius:10, padding:"13px", fontFamily:FONT.display, fontSize:14, letterSpacing:3, color:"#fff", cursor:"pointer", textTransform:"uppercase", marginBottom:8 }}
            >
              CHECK ANOTHER VIDEO
            </button>
            <button
              onClick={onClose}
              style={{ width:"100%", background:"none", border:"none", fontFamily:FONT.body, fontSize:12, color:G.textDim, cursor:"pointer", padding:"8px" }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
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

function AvatarBadge({ initials, size = 42, gold = false, url = null }) {
  if (url) return (
    <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0, overflow:"hidden", border:`1.5px solid ${gold ? G.gold+"88" : G.purple+"88"}`, boxShadow: gold ? G.goldGlow2 : `0 0 8px ${G.purple}88` }}>
      <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
    </div>
  );
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
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }); // keep ref current without restarting timer
  useEffect(() => {
    setRem(sec); // eslint-disable-line react-hooks/set-state-in-effect
    const t = setInterval(() => setRem(r => { if (r <= 1) { clearInterval(t); onDoneRef.current(); return 0; } return r - 1; }), 1000);
    return () => clearInterval(t);
  }, [sec]);
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

function SwipeWidget({ title, extra, onDismiss, onMoveUp, onMoveDown, canMoveUp, canMoveDown, children }) {
  const [dx, setDx] = useState(0);
  const [dismissing, setDismissing] = useState(false);
  const startXRef = useRef(null);

  const handlePointerDown = e => { startXRef.current = e.clientX; };
  const handlePointerMove = e => {
    if (startXRef.current === null) return;
    const d = e.clientX - startXRef.current;
    if (d < -6) setDx(Math.max(d, -220));
  };
  const handlePointerUp = () => {
    if (dx < -90) { setDismissing(true); setTimeout(onDismiss, 280); }
    else setDx(0);
    startXRef.current = null;
  };
  const dismiss = () => { setDismissing(true); setTimeout(onDismiss, 280); };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: dismissing ? "translateX(-110%)" : `translateX(${dx}px)`,
        opacity: dismissing ? 0 : dx < -30 ? Math.max(0.3, 1 + (dx + 30) / 140) : 1,
        transition: (dx === 0 || dismissing) ? "transform 0.28s ease, opacity 0.28s ease" : "none",
        touchAction: "pan-y", userSelect: "none",
        marginBottom: 18, position: "relative",
      }}
    >
      {dx < -24 && !dismissing && (
        <div style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", background:"rgba(255,61,90,0.14)", border:"1px solid rgba(255,61,90,0.4)", borderRadius:6, padding:"4px 10px", color:"#FF3D5A", fontFamily:FONT.display, fontSize:11, letterSpacing:2, opacity:Math.min(1,(Math.abs(dx)-24)/66), pointerEvents:"none", zIndex:1, textTransform:"uppercase" }}>← HIDE</div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:3, height:18, background:G.gold, boxShadow:G.goldGlow2, borderRadius:1, flexShrink:0 }}/>
          <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:3, color:G.gold, textTransform:"uppercase" }}>{title}</div>
          {extra}
        </div>
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          {canMoveUp && <button onClick={e=>{e.stopPropagation();onMoveUp();}} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:12, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center" }}>↑</button>}
          {canMoveDown && <button onClick={e=>{e.stopPropagation();onMoveDown();}} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:12, width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center" }}>↓</button>}
          <button onClick={e=>{e.stopPropagation();dismiss();}} style={{ background:"rgba(255,61,90,0.08)", border:"1px solid rgba(255,61,90,0.25)", borderRadius:5, color:"#FF3D5A", cursor:"pointer", fontSize:11, padding:"4px 8px", fontFamily:FONT.body, letterSpacing:0.5, lineHeight:1 }}>✕ HIDE</button>
        </div>
      </div>
      {children}
    </div>
  );
}

function HomeScreen({ sessions, leaderboard, onQuickStart, showToast, profile }) {
  const weeklyVol = calcWeeklyVolume(sessions);
  const maxVol = Math.max(...weeklyVol, 1);
  const myRank = leaderboard.find(u => u.isMe)?.rank ?? "—";
  const myPts = profile?.points ?? leaderboard.find(u => u.isMe)?.pts ?? 0;
  const thisWeekSessions = (() => {
    const now = new Date();
    const dow = (now.getDay() + 6) % 7;
    const weekStart = new Date(now); weekStart.setHours(0,0,0,0); weekStart.setDate(now.getDate()-dow);
    return sessions.filter(s => s.createdAt && new Date(s.createdAt) >= weekStart).length;
  })();

  const [widgetOrder, setWidgetOrder] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_home_widgets") || "{}").order || ["quickstart","leaderboard"]; } catch { return ["quickstart","leaderboard"]; }
  });
  const [hiddenWidgets, setHiddenWidgets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_home_widgets") || "{}").hidden || []; } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem("sfc_home_widgets", JSON.stringify({ order: widgetOrder, hidden: hiddenWidgets }));
  }, [widgetOrder, hiddenWidgets]);

  const hideWidget = id => setHiddenWidgets(p => [...p, id]);
  const restoreWidget = id => setHiddenWidgets(p => p.filter(x => x !== id));
  const moveWidget = (id, dir) => setWidgetOrder(p => {
    const i = p.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= p.length) return p;
    const next = [...p];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  const visibleWidgets = widgetOrder.filter(id => !hiddenWidgets.includes(id));

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
          {[{l:"RANK",v:`#${myRank}`,ico:"👑"},{l:"STREAK",v:`${profile?.streak||0}D`,ico:"🔥"},{l:"THIS WK",v:`${thisWeekSessions}`,ico:"💪"}].map(s=>(
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
          {weeklyVol.map((v, i) => {
            const todayIdx = (new Date().getDay() + 6) % 7;
            const pct = v / maxVol;
            const isToday = i === todayIdx;
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

      {visibleWidgets.map((id) => {
        const visIdx = visibleWidgets.indexOf(id);
        const canUp = visIdx > 0;
        const canDown = visIdx < visibleWidgets.length - 1;
        const wProps = {
          onDismiss: () => hideWidget(id),
          onMoveUp: () => moveWidget(id, -1),
          onMoveDown: () => moveWidget(id, 1),
          canMoveUp: canUp,
          canMoveDown: canDown,
        };

        if (id === "quickstart") return (
          <SwipeWidget key={id} {...wProps} title="Quick Start">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
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
          </SwipeWidget>
        );

        if (id === "leaderboard") return (
          <SwipeWidget key={id} {...wProps} title="Leaderboard" extra={<div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textDim, textTransform:"uppercase" }}>ALL TIME</div>}>
            {leaderboard.length >= 3 && (
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, marginBottom:12, justifyContent:"center" }}>
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((u, i) => {
                  const order = [1,0,2][i];
                  const ht = [88, 112, 70][i];
                  const col = ["#C0C0C0", G.gold, "#CD7F32"][order];
                  return (
                    <div key={u.name} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                      {u.isMe && <div style={{ fontFamily:FONT.body, fontSize:8, color:G.gold, letterSpacing:2, textTransform:"uppercase" }}>YOU</div>}
                      <AvatarBadge initials={u.av} url={u.url} size={order===0?48:40} gold={order===0}/>
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
                <AvatarBadge initials={u.av} url={u.url} size={32} gold={u.isMe}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:u.isMe?G.gold:"#fff", textTransform:"uppercase" }}>{u.name}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, textTransform:"uppercase" }}>{u.sessions} sessions · {u.streak}d streak</div>
                </div>
                <div style={{ fontFamily:FONT.display, fontSize:16, color:u.isMe?G.gold:"#fff", letterSpacing:1 }}>{u.pts.toLocaleString()}</div>
              </ChromeCard>
            ))}
          </SwipeWidget>
        );

        return null;
      })}

      {hiddenWidgets.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textDim, textTransform:"uppercase", marginBottom:10 }}>◆ HIDDEN WIDGETS</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {hiddenWidgets.map(id => (
              <button key={id} onClick={() => restoreWidget(id)} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"10px 16px", cursor:"pointer", fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.textMid, display:"flex", alignItems:"center", gap:7, textTransform:"uppercase" }}>
                <span style={{ color:G.gold }}>+</span>
                {id === "quickstart" ? "QUICK START" : "LEADERBOARD"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExercisePicker({ onSelect, onClose }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ALL");
  const cats = ["ALL", ...Object.keys(EXERCISE_CATS)];

  const filtered = EXERCISES.filter(e => {
    const matchCat = cat === "ALL" || EX_CAT_LOOKUP[e] === cat;
    const matchQ = !q || e.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:7, padding:"10px 14px 10px 38px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1.5, textTransform:"uppercase" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)" }}/>
      <div style={{ position:"relative", background:"#0F0E22", borderRadius:"18px 18px 0 0", border:`1px solid ${G.borderB}`, borderBottom:"none", maxHeight:"80vh", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px 12px" }}>
          <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:G.gold }}>BROWSE EXERCISES</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
        </div>

        <div style={{ padding:"0 18px 10px", position:"relative" }}>
          <span style={{ position:"absolute", left:30, top:"50%", transform:"translateY(-50%)", color:G.textDim, fontSize:14, pointerEvents:"none" }}>🔍</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="SEARCH EXERCISES..." style={inp}/>
          {q && <button onClick={()=>setQ("")} style={{ position:"absolute", right:28, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13 }}>✕</button>}
        </div>

        <div style={{ display:"flex", gap:6, padding:"0 18px 12px", overflowX:"auto", scrollbarWidth:"none" }}>
          {cats.map(c => (
            <button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:`1px solid ${cat===c ? G.gold : G.borderB}`, background: cat===c ? `${G.gold}20` : "transparent", color: cat===c ? G.gold : G.textMid, fontFamily:FONT.body, fontSize:10, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{c}</button>
          ))}
        </div>

        <div style={{ overflowY:"auto", flex:1, paddingBottom:24 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px 18px", color:G.textDim, fontFamily:FONT.body, fontSize:12, letterSpacing:2 }}>NO EXERCISES FOUND</div>
          )}
          {filtered.map(e => {
            const exCat = EX_CAT_LOOKUP[e];
            const primaryMuscle = Object.entries(EXERCISE_MUSCLE_MAP[e] || {}).sort((a,b)=>b[1]-a[1])[0];
            return (
              <div key={e} onClick={()=>{ onSelect(e); onClose(); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 18px", borderBottom:`1px solid ${G.borderB}`, cursor:"pointer", transition:"background 0.15s" }}
                onMouseEnter={ev=>ev.currentTarget.style.background=`${G.gold}10`}
                onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{ fontFamily:FONT.body, fontSize:14, letterSpacing:1.5, color:"#fff", textTransform:"uppercase" }}>{e}</div>
                  {primaryMuscle && <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:1, color:G.textMid, marginTop:2 }}>{MUSCLE_LABELS[primaryMuscle[0]]}</div>}
                </div>
                {exCat && <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, color:G.purple, background:`${G.purple}22`, border:`1px solid ${G.purple}44`, borderRadius:4, padding:"3px 7px", textTransform:"uppercase", flexShrink:0 }}>{exCat}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlateCalculatorModal({ onClose, initialWeight = "" }) {
  const [target, setTarget] = useState(String(initialWeight));
  const [barWeight, setBarWeight] = useState(45);

  const PLATE_SIZES = [45, 35, 25, 10, 5, 2.5];
  const PLATE_META = {
    45:  { color:"#C0392B", border:"#922B21", thick:20 },
    35:  { color:"#C8A908", border:"#9A7D0A", thick:17 },
    25:  { color:"#1E8449", border:"#145A32", thick:14 },
    10:  { color:"#BDC3C7", border:"#7F8C8D", thick:9  },
    5:   { color:"#2471A3", border:"#1A5276", thick:7  },
    2.5: { color:"#2C3E50", border:"#34495E", thick:5  },
  };

  const targetNum = parseFloat(target) || 0;
  const perSide = (targetNum - barWeight) / 2;
  const plates = (() => {
    if (perSide <= 0) return [];
    const result = [];
    let rem = perSide;
    for (const size of PLATE_SIZES) {
      while (rem >= size - 0.01) {
        result.push(size);
        rem = Math.round((rem - size) * 100) / 100;
      }
    }
    return result;
  })();
  const totalLoaded = barWeight + plates.reduce((a, p) => a + p, 0) * 2;
  const impossible = targetNum > 0 && targetNum < barWeight;
  const nonStandard = targetNum > 0 && !impossible && Math.abs(totalLoaded - targetNum) > 0.09;
  const plateCounts = plates.reduce((acc, p) => ({ ...acc, [p]: (acc[p] || 0) + 1 }), {});

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.92)", zIndex:500, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"16px 16px 0 0", padding:"22px 18px 48px", border:`1px solid ${G.border}`, borderBottom:"none" }}>
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"0 auto 18px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>PLATE CALCULATOR</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
        </div>

        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:7 }}>BAR WEIGHT</div>
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {[{l:"STANDARD",v:45},{l:"WOMEN'S",v:35},{l:"TRAP/HEX",v:60},{l:"EZ-CURL",v:25}].map(b => (
            <button key={b.v} onClick={() => setBarWeight(b.v)} style={{ flex:1, padding:"7px 4px", borderRadius:6, border:`1px solid ${barWeight===b.v ? G.gold : G.borderB}`, background:barWeight===b.v ? `${G.gold}18` : "transparent", color:barWeight===b.v ? G.gold : G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1, cursor:"pointer", textTransform:"uppercase", lineHeight:1.4 }}>
              <div>{b.l}</div><div style={{ fontSize:12, marginTop:2 }}>{b.v} LB</div>
            </button>
          ))}
        </div>

        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:7 }}>TARGET WEIGHT (LBS)</div>
        <input type="number" inputMode="decimal" value={target} onChange={e => setTarget(e.target.value)} placeholder="E.G. 225" autoFocus
          style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:7, padding:"12px 14px", color:"#fff", fontSize:22, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.display, letterSpacing:3, marginBottom:6, textAlign:"center" }}/>

        {impossible && (
          <div style={{ color:"#FF3D5A", fontFamily:FONT.body, fontSize:11, letterSpacing:1, textAlign:"center", marginTop:4 }}>
            Target is less than bar weight ({barWeight} lbs)
          </div>
        )}

        {targetNum > 0 && !impossible && (
          <>
            {/* Bar diagram */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:76, margin:"14px 0 10px", overflow:"hidden" }}>
              <div style={{ width:6, height:18, background:"#999", borderRadius:"3px 0 0 3px", flexShrink:0 }}/>
              {[...plates].reverse().map((p, i) => {
                const m = PLATE_META[p];
                return <div key={i} style={{ width:m.thick, height:58, background:m.color, border:`1px solid ${m.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {m.thick >= 12 && <div style={{ fontFamily:FONT.display, fontSize:7, color:"rgba(255,255,255,0.9)", writingMode:"vertical-rl", transform:"rotate(180deg)", letterSpacing:0.5 }}>{p}</div>}
                </div>;
              })}
              <div style={{ width:3, height:22, background:"#aaa", flexShrink:0 }}/>
              <div style={{ width:Math.max(24, 52 - plates.length * 3), height:12, background:"linear-gradient(180deg,#ccc,#999)", flexShrink:0 }}/>
              <div style={{ width:36, height:9, background:"linear-gradient(180deg,#bbb,#777)", borderRadius:1, flexShrink:0 }}/>
              <div style={{ width:Math.max(24, 52 - plates.length * 3), height:12, background:"linear-gradient(180deg,#ccc,#999)", flexShrink:0 }}/>
              <div style={{ width:3, height:22, background:"#aaa", flexShrink:0 }}/>
              {plates.map((p, i) => {
                const m = PLATE_META[p];
                return <div key={i} style={{ width:m.thick, height:58, background:m.color, border:`1px solid ${m.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {m.thick >= 12 && <div style={{ fontFamily:FONT.display, fontSize:7, color:"rgba(255,255,255,0.9)", writingMode:"vertical-rl", letterSpacing:0.5 }}>{p}</div>}
                </div>;
              })}
              <div style={{ width:6, height:18, background:"#999", borderRadius:"0 3px 3px 0", flexShrink:0 }}/>
            </div>

            {/* Per-side list */}
            <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:10 }}>EACH SIDE</div>
            {plates.length === 0 ? (
              <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, marginBottom:14, textAlign:"center" }}>Bar only — no plates needed</div>
            ) : (
              <div style={{ marginBottom:14 }}>
                {Object.entries(plateCounts).map(([p, count]) => {
                  const m = PLATE_META[parseFloat(p)];
                  return (
                    <div key={p} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:9 }}>
                      <div style={{ width:34, height:34, borderRadius:5, background:m.color, border:`2px solid ${m.border}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ fontFamily:FONT.display, fontSize:11, color:"#fff", letterSpacing:0.5 }}>{p}</div>
                      </div>
                      <div style={{ flex:1, fontFamily:FONT.display, fontSize:15, color:"#fff", letterSpacing:2, textTransform:"uppercase" }}>{p} LB PLATE</div>
                      <div style={{ fontFamily:FONT.display, fontSize:22, color:G.gold, letterSpacing:1 }}>×{count}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <ChromeCard gold style={{ padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>TOTAL ON BAR</div>
              <div style={{ fontFamily:FONT.display, fontSize:22, color:G.gold, letterSpacing:2 }}>{totalLoaded} LBS</div>
            </ChromeCard>
            {nonStandard && (
              <div style={{ fontFamily:FONT.body, fontSize:10, color:"#FF6B00", letterSpacing:1, textAlign:"center", marginTop:8 }}>
                Closest loadable: {totalLoaded} lbs
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TrainScreen({ showToast, onSave, onDelete, onEdit, quickStart, onClearQuickStart, sessions = [] }) {
  const [subTab, setSubTab] = useState("track");
  const [sessName, setSessName] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_wip_session") || "{}").name || ""; } catch { return ""; }
  });
  const [sessTag, setSessTag] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_wip_session") || "{}").tag || null; } catch { return null; }
  });
  const [historyFilter, setHistoryFilter] = useState(null);
  const [exs, setExs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sfc_wip_session") || "{}").exs;
      return saved?.length ? saved : [{ id:1, name:"", sets:[{r:"",w:"",type:"working"}], rest:60, q:"", sugg:false }];
    } catch { return [{ id:1, name:"", sets:[{r:"",w:"",type:"working"}], rest:60, q:"", sugg:false }]; }
  });
  const [restSec, setRestSec] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [templates, setTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_templates") || "[]"); } catch { return []; }
  });
  const [selectedPrEx, setSelectedPrEx] = useState(null);
  const [restWarnDismissed, setRestWarnDismissed] = useState(false);
  const [plateCalcOpen, setPlateCalcOpen] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState("");
  const nextIdRef = useRef(2);

  useEffect(() => {
    localStorage.setItem("sfc_wip_session", JSON.stringify({ name: sessName, exs, tag: sessTag }));
  }, [sessName, exs, sessTag]);

  useEffect(() => {
    if (quickStart) {
      setSessName(quickStart.name); // eslint-disable-line react-hooks/set-state-in-effect
      setExs(quickStart.exs.map((name, i) => ({ id: i+1, name, sets:[{r:"",w:"",type:"working"}], rest:60, q:name, sugg:false })));
      setSubTab("track");
      if (onClearQuickStart) onClearQuickStart();
      showToast(`✓ ${quickStart.name} loaded — add your sets!`);
    }
  }, [quickStart]); // eslint-disable-line react-hooks/exhaustive-deps

  const totSets = exs.reduce((a,e) => a + e.sets.filter(s=>s.r&&s.w&&s.type!=="warmup").length, 0);
  const totVol = exs.reduce((a,e) => a + e.sets.filter(s=>s.type!=="warmup").reduce((b,s) => b+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0),0);
  const pts = totSets * 10 + Math.floor(totVol / 100) * 5;
  const prs = calcPRs(sessions);
  const overloadedMuscles = (() => {
    const scores = calcMuscleScores(sessions);
    const targeted = new Set();
    for (const ex of exs) {
      const map = EXERCISE_MUSCLE_MAP[ex.name];
      if (!map) continue;
      for (const [muscle, factor] of Object.entries(map)) {
        if (factor >= 0.6) targeted.add(muscle);
      }
    }
    return [...targeted].filter(m => (scores[m] || 0) > 80).map(m => MUSCLE_LABELS[m] || m);
  })();
  const getSugg = q => !q || q.length < 2 ? [] : EXERCISES.filter(e => e.toLowerCase().includes(q.toLowerCase())).slice(0,5);
  const updEx = (id, f, v) => setExs(p => p.map(e => e.id===id ? {...e,[f]:v} : e));
  const updSet = (xid, si, f, v) => setExs(p => p.map(e => e.id!==xid ? e : {...e, sets:e.sets.map((s,i)=>i===si?{...s,[f]:v}:s)}));

  const saveTemplate = (s) => {
    const exNames = (s.exs || []).map(e => e.name).filter(Boolean);
    if (!exNames.length) { showToast("No exercises to save"); return; }
    const tmpl = { id: Date.now(), name: s.name, exs: exNames };
    const next = [tmpl, ...templates];
    setTemplates(next);
    localStorage.setItem("sfc_templates", JSON.stringify(next));
    showToast("✓ TEMPLATE SAVED!");
  };
  const loadTemplate = (tmpl) => {
    setSessName(tmpl.name);
    setExs(tmpl.exs.map((name, i) => ({ id: i+1, name, sets:[{r:"",w:"",type:"working"}], rest:60, q:name, sugg:false })));
    nextIdRef.current = tmpl.exs.length + 1;
    setSubTab("track");
    showToast(`✓ ${tmpl.name} loaded!`);
  };
  const deleteTemplate = (id) => {
    const next = templates.filter(t => t.id !== id);
    setTemplates(next);
    localStorage.setItem("sfc_templates", JSON.stringify(next));
  };

  const selectExercise = (exId, name) => {
    const last = getLastExercisePerformance(name, sessions);
    if (last && last.sets.length > 0) {
      const progressed = last.sets.map(s => ({ r: String(s.r), w: String(progressWeight(s.w)) }));
      setExs(p => p.map(e => e.id !== exId ? e : { ...e, name, q: name, sugg: false, sets: progressed }));
      showToast(`⚡ Loaded with +5 lbs progression from ${last.date}`);
    } else {
      updEx(exId, "name", name); updEx(exId, "q", name); updEx(exId, "sugg", false);
    }
  };

  const loadLastWithProgress = (exId, last) => {
    const progressed = last.sets.map(s => ({ r: String(s.r), w: String(progressWeight(s.w)) }));
    setExs(p => p.map(e => e.id !== exId ? e : { ...e, sets: progressed }));
    showToast("⚡ +5 lbs progression loaded!");
  };

  const loadLastSame = (exId, last) => {
    const same = last.sets.map(s => ({ r: String(s.r), w: String(s.w) }));
    setExs(p => p.map(e => e.id !== exId ? e : { ...e, sets: same }));
    showToast("✓ Last session loaded");
  };

  const doSave = () => {
    const valid = exs.filter(e => e.name && e.sets.some(s=>s.r||s.w));
    if (!valid.length) { showToast("Add at least one exercise."); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave({ name:sessName||"CUSTOM SESSION", exs:valid, sets:totSets, vol:totVol, pts, tag: sessTag, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}) });
      setExs([{id:1,name:"",sets:[{r:"",w:""}],rest:60,q:"",sugg:false}]);
      setSessName(""); setSessTag(null);
      localStorage.removeItem("sfc_wip_session");
      setSubTab("log");
    }, 900);
  };

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"9px 11px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" };
  const SUB_TABS = [{ id:"track", l:"TRACK" }, { id:"log", l:"HISTORY" }, { id:"prs", l:"PRs" }, { id:"programs", l:"PROGRAMS" }];

  return (
    <div style={{ padding:"20px 18px 0" }}>
      {pickerFor && <ExercisePicker onSelect={name=>{ selectExercise(pickerFor, name); }} onClose={()=>setPickerFor(null)}/>}
      {restSec && <RestTimer sec={restSec} onDone={() => { setRestSec(null); showToast("✓ REST COMPLETE"); }}/>}
      {plateCalcOpen && <PlateCalculatorModal initialWeight={plateCalcWeight} onClose={() => setPlateCalcOpen(false)}/>}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
        <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>
          TRAINING <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>HUB</span>
        </div>
        <button onClick={() => { setPlateCalcWeight(""); setPlateCalcOpen(true); }} style={{ background:`${G.gold}14`, border:`1px solid ${G.gold}44`, borderRadius:8, padding:"8px 12px", color:G.gold, fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", display:"flex", alignItems:"center", gap:5, textTransform:"uppercase", flexShrink:0, marginBottom:2 }}>
          ⚖️ PLATES
        </button>
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
            <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textDim, textTransform:"uppercase", marginBottom:7, marginTop:14 }}>SESSION TYPE</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {SESSION_TYPES.map(t => {
                const active = sessTag === t.id;
                return (
                  <button key={t.id} onClick={()=>setSessTag(active ? null : t.id)} style={{ background: active ? t.color : "rgba(0,0,0,0.35)", border:`1px solid ${active ? t.color : G.borderB}`, borderRadius:20, padding:"5px 12px", color: active ? "#0A0810" : G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", fontWeight: active ? 700 : 400, transition:"all 0.15s", boxShadow: active ? `0 0 8px ${t.color}66` : "none" }}>{t.label}</button>
                );
              })}
            </div>
          </div>

          {!restWarnDismissed && overloadedMuscles.length > 0 && (
            <div style={{ background:"linear-gradient(135deg,rgba(255,107,0,0.12),rgba(255,23,68,0.12))", border:"1px solid rgba(255,107,0,0.45)", borderRadius:10, padding:"12px 14px", marginBottom:16, display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>🔥</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:"#FF6B00", marginBottom:3, textTransform:"uppercase" }}>Recovery Alert</div>
                <div style={{ fontFamily:FONT.body, fontSize:12, color:G.text, letterSpacing:0.5, lineHeight:1.4 }}>
                  {overloadedMuscles.join(" · ")} {overloadedMuscles.length === 1 ? "is" : "are"} overloaded from recent sessions. Consider a rest day or keep it light.
                </div>
              </div>
              <button onClick={() => setRestWarnDismissed(true)} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:16, padding:"0 2px", flexShrink:0, lineHeight:1 }}>✕</button>
            </div>
          )}

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
            const liveNewPr = ex.name ? (() => {
              for (const set of ex.sets) {
                if (set.type === "warmup") continue;
                const w = parseFloat(set.w) || 0;
                const r = parseInt(set.r) || 0;
                if (!w || !r) continue;
                const est = Math.round(w * (1 + r / 30));
                const existing = prs[ex.name];
                if (!existing || est > existing.est1rm) return true;
              }
              return false;
            })() : false;
            return (
              <ChromeCard key={ex.id} style={{ marginBottom:12, overflow:"visible" }}>
                {liveNewPr && (
                  <div style={{ background:`linear-gradient(135deg,${G.gold}28,${G.goldDark}18)`, borderBottom:`1px solid ${G.gold}44`, borderRadius:"10px 10px 0 0", padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:13 }}>🏆</span>
                    <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.gold, textShadow:G.goldGlow2 }}>NEW PERSONAL RECORD</div>
                  </div>
                )}
                <div style={{ padding:"12px 12px 0", position:"relative" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:6 }}>
                    <div style={{ width:22, height:22, borderRadius:4, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.display, fontSize:12, color:"#0A0810", flexShrink:0 }}>{xi+1}</div>
                    <input value={ex.q||ex.name} onChange={e=>{const v=e.target.value;updEx(ex.id,"q",v);updEx(ex.id,"name",v);updEx(ex.id,"sugg",v.length>=2);}} onBlur={()=>setTimeout(()=>updEx(ex.id,"sugg",false),160)} placeholder="EXERCISE NAME" style={{ ...inp, background:"transparent", border:"none", padding:"3px 0", fontFamily:FONT.display, fontSize:15, letterSpacing:2, flex:1, width:"auto", color:"#fff" }}/>
                    <button onClick={()=>setPickerFor(ex.id)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:13, padding:"3px 7px", flexShrink:0, lineHeight:1 }} title="Browse exercises">⊞</button>
                    {exs.length > 1 && <button onClick={()=>setExs(p=>p.filter(e=>e.id!==ex.id))} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:16, padding:"2px 4px", flexShrink:0 }}>✕</button>}
                  </div>
                  {ex.sugg && sugg.length > 0 && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#0F0E22", border:`1px solid ${G.gold}55`, borderRadius:"0 0 8px 8px", zIndex:200, boxShadow:`0 8px 32px rgba(0,0,0,0.7)` }}>
                      {sugg.map((s)=>(
                        <div key={s} onMouseDown={()=>selectExercise(ex.id, s)} style={{ padding:"10px 14px", cursor:"pointer", fontFamily:FONT.body, fontSize:13, letterSpacing:1.5, textTransform:"uppercase", color:G.text, borderBottom:`1px solid ${G.borderB}` }}>
                          ▸ &nbsp;{s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {(() => {
                  const lastPerf = getLastExercisePerformance(ex.name, sessions);
                  const alreadyLoaded = lastPerf && ex.sets.length === lastPerf.sets.length &&
                    ex.sets.every(s => s.r || s.w);
                  return lastPerf ? (
                    <div style={{ margin:"4px 12px 6px", background:`linear-gradient(135deg,${G.purpleLight}0D,${G.purple}09)`, border:`1px solid ${G.purpleLight}30`, borderRadius:8 }}>
                      <div style={{ padding:"9px 12px", display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontFamily:FONT.body, fontSize:8, color:G.purpleLight, letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>LAST SESSION · {lastPerf.date}</div>
                          <div style={{ fontFamily:FONT.display, fontSize:12, color:G.textMid, letterSpacing:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {lastPerf.sets.map(s => `${s.r}×${s.w}`).join("  ·  ")}
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:5, flexShrink:0 }}>
                          <button onClick={()=>loadLastWithProgress(ex.id, lastPerf)} style={{ background:`linear-gradient(135deg,${G.purpleLight},${G.purple})`, border:"none", borderRadius:6, padding:"6px 10px", color:"#fff", fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>+5 LBS ⬆</button>
                          <button onClick={()=>loadLastSame(ex.id, lastPerf)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"6px 8px", color:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>SAME</button>
                        </div>
                      </div>
                      {!alreadyLoaded && (
                        <div style={{ borderTop:`1px solid ${G.purpleLight}15`, padding:"5px 12px 6px", display:"flex", gap:4, alignItems:"center" }}>
                          <div style={{ width:5, height:5, borderRadius:"50%", background:G.purpleLight, boxShadow:`0 0 4px ${G.purpleLight}` }}/>
                          <div style={{ fontFamily:FONT.body, fontSize:9, color:G.purpleLight, letterSpacing:1.5, textTransform:"uppercase" }}>
                            Suggested: {lastPerf.sets.map(s => `${s.r} reps @ ${progressWeight(s.w)} lbs`).join("  ·  ")}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null;
                })()}

                <div style={{ display:"grid", gridTemplateColumns:"30px 1fr 1fr 30px", gap:6, padding:"6px 12px 3px", alignItems:"center" }}>
                  {["TYPE","REPS","WEIGHT (LBS)",""].map((h,i)=>(
                    <div key={i} style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase" }}>{h}</div>
                  ))}
                </div>

                {ex.sets.map((set,si)=>{
                  const lastPerf2 = getLastExercisePerformance(ex.name, sessions);
                  const prevSet = lastPerf2?.sets[si];
                  const setType = set.type || "working";
                  const typeOrder = ["working","warmup","drop"];
                  const nextType = typeOrder[(typeOrder.indexOf(setType)+1) % typeOrder.length];
                  const badgeCfg = setType==="warmup"
                    ? { bg:"#74B9FF", border:"#74B9FF88", label:"W", color:"#0A0810" }
                    : setType==="drop"
                    ? { bg:"#FF7675", border:"#FF767588", label:"D", color:"#fff" }
                    : { bg: set.r&&set.w ? `linear-gradient(135deg,${G.gold},${G.goldDark})` : "rgba(255,255,255,0.05)", border: set.r&&set.w ? G.gold+"88" : G.borderB, label: String(si+1), color: set.r&&set.w ? "#0A0810" : G.textDim };
                  const inputColor = setType==="warmup" ? "#74B9FF" : setType==="drop" ? "#FF7675" : (set.r||set.w) ? G.gold : G.textDim;
                  return (
                    <div key={si}>
                      <div style={{ display:"grid", gridTemplateColumns:"30px 1fr 1fr 30px", gap:6, padding:"3px 12px", alignItems:"center" }}>
                        <button onClick={()=>updSet(ex.id,si,"type",nextType)} title={`Tap to change: ${nextType}`} style={{ width:24, height:24, borderRadius:4, background:badgeCfg.bg, border:`1px solid ${badgeCfg.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.display, fontSize:11, color:badgeCfg.color, cursor:"pointer", padding:0 }}>{badgeCfg.label}</button>
                        <input type="number" inputMode="numeric" placeholder={prevSet ? String(prevSet.r) : "—"} value={set.r} onChange={e=>updSet(ex.id,si,"r",e.target.value)} style={{ ...inp, padding:"8px 8px", fontFamily:FONT.display, fontSize:15, letterSpacing:1, textAlign:"center", color:inputColor }}/>
                        <input type="number" inputMode="decimal" placeholder={prevSet ? String(progressWeight(prevSet.w)) : "—"} value={set.w} onChange={e=>updSet(ex.id,si,"w",e.target.value)} style={{ ...inp, padding:"8px 8px", fontFamily:FONT.display, fontSize:15, letterSpacing:1, textAlign:"center", color:inputColor }}/>
                        <button onClick={()=>{if(ex.sets.length>1)setExs(p=>p.map(e=>e.id!==ex.id?e:{...e,sets:e.sets.filter((_,j)=>j!==si)}));}} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13 }}>✕</button>
                      </div>
                      {setType==="warmup" && <div style={{ paddingLeft:48, paddingBottom:1, fontFamily:FONT.body, fontSize:9, color:"#74B9FF", letterSpacing:1.5, textTransform:"uppercase" }}>warm-up · not counted in volume</div>}
                      {setType==="drop" && <div style={{ paddingLeft:48, paddingBottom:1, fontFamily:FONT.body, fontSize:9, color:"#FF7675", letterSpacing:1.5, textTransform:"uppercase" }}>drop set · no rest</div>}
                    </div>
                  );
                })}

                <div style={{ padding:"9px 12px 12px" }}>
                  <button onClick={()=>{ const last=ex.sets[ex.sets.length-1]; setExs(p=>p.map(e=>e.id===ex.id?{...e,sets:[...e.sets,{r:"",w:"",type:"working"}]}:e)); if(last.r&&last.w) setRestSec(ex.rest); }} style={{ background:"transparent", border:`1px dashed ${G.borderB}`, borderRadius:5, padding:"6px", width:"100%", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:2, cursor:"pointer", marginBottom:9, textTransform:"uppercase" }}>+ ADD SET</button>
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

          <button onClick={()=>{const newId=nextIdRef.current++;setExs(p=>[...p,{id:newId,name:"",sets:[{r:"",w:"",type:"working"}],rest:60,q:"",sugg:false}]);}} style={{ width:"100%", padding:"12px", borderRadius:8, border:`1px dashed ${G.gold}44`, background:`${G.gold}06`, color:G.gold, fontFamily:FONT.display, fontSize:14, letterSpacing:3, cursor:"pointer", marginBottom:16, textTransform:"uppercase" }}>+ ADD EXERCISE</button>

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
          {(() => {
            const usedTypes = SESSION_TYPES.filter(t => sessions.some(s => s.tag === t.id));
            if (!usedTypes.length) return null;
            return (
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                <button onClick={()=>setHistoryFilter(null)} style={{ background:!historyFilter?G.gold:"rgba(0,0,0,0.35)", border:`1px solid ${!historyFilter?G.gold:G.borderB}`, borderRadius:20, padding:"4px 11px", color:!historyFilter?"#0A0810":G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, cursor:"pointer" }}>ALL</button>
                {usedTypes.map(t => (
                  <button key={t.id} onClick={()=>setHistoryFilter(historyFilter===t.id?null:t.id)} style={{ background:historyFilter===t.id?t.color:"rgba(0,0,0,0.35)", border:`1px solid ${historyFilter===t.id?t.color:G.borderB}`, borderRadius:20, padding:"4px 11px", color:historyFilter===t.id?"#0A0810":G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, cursor:"pointer", boxShadow:historyFilter===t.id?`0 0 6px ${t.color}55`:"none" }}>{t.label}</button>
                ))}
              </div>
            );
          })()}
          {sessions.length === 0 ? (
            <div style={{ textAlign:"center", padding:"44px 0", color:G.textDim }}>
              <div style={{ fontFamily:FONT.display, fontSize:36, letterSpacing:4, marginBottom:8 }}>NO SESSIONS</div>
              <div style={{ fontFamily:FONT.body, fontSize:12, letterSpacing:2, textTransform:"uppercase" }}>Log your first workout to see history</div>
              <NeonBtn onClick={()=>setSubTab("track")} style={{ marginTop:20 }}>START TRACKING</NeonBtn>
            </div>
          ) : sessions.filter(s => !historyFilter || s.tag === historyFilter).map((s, i) => {
            const sid = s.id;
            const isDeleting = deletingId === sid;
            const isEditing = editingId === sid;
            const canAct = !!sid;
            return (
              <ChromeCard key={i} style={{ padding:"12px 14px", marginBottom:9 }}>
                {isDeleting ? (
                  <div>
                    <div style={{ fontFamily:FONT.body, fontSize:11, letterSpacing:2, color:G.red, textTransform:"uppercase", marginBottom:10 }}>DELETE "{s.name}"?</div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginBottom:12 }}>This will remove the session and deduct {s.pts} points from your total.</div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setDeletingId(null)} style={{ flex:1, padding:"9px", borderRadius:6, border:`1px solid ${G.borderB}`, background:"transparent", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>CANCEL</button>
                      <button onClick={()=>{ onDelete(sid); setDeletingId(null); }} style={{ flex:1, padding:"9px", borderRadius:6, border:`1px solid ${G.red}`, background:`${G.red}18`, color:G.red, fontFamily:FONT.display, fontSize:13, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>DELETE</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={e=>setEditName(e.target.value)}
                          onKeyDown={e=>{ if(e.key==="Enter"&&editName.trim()){onEdit(sid,editName.trim());setEditingId(null);} if(e.key==="Escape")setEditingId(null); }}
                          onBlur={()=>{ if(editName.trim()&&editName.trim()!==s.name)onEdit(sid,editName.trim()); setEditingId(null); }}
                          style={{ background:"transparent", border:"none", borderBottom:`1px solid ${G.gold}`, padding:"2px 0", color:G.gold, fontFamily:FONT.display, fontSize:15, letterSpacing:2, width:"100%", outline:"none", textTransform:"uppercase" }}/>
                      ) : (
                        <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                          <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                          {s.tag && (() => { const t = SESSION_TYPES.find(x=>x.id===s.tag); return t ? <span style={{ background:`${t.color}22`, border:`1px solid ${t.color}66`, borderRadius:20, padding:"1px 8px", fontFamily:FONT.display, fontSize:9, letterSpacing:1.5, color:t.color, flexShrink:0 }}>{t.label}</span> : null; })()}
                        </div>
                      )}
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{s.date} · {s.sets} sets · {(s.vol||0).toLocaleString()} lbs</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:16, color:G.gold, letterSpacing:1 }}>+{s.pts}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>PTS</div>
                    </div>
                    {canAct && (
                      <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
                        <button onClick={()=>saveTemplate(s)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:12, padding:"4px 7px", lineHeight:1 }} title="Save as template">📋</button>
                        <button onClick={()=>{ setEditingId(sid); setEditName(s.name); }} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:12, padding:"4px 7px", lineHeight:1 }} title="Rename">✏️</button>
                        <button onClick={()=>setDeletingId(sid)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:12, padding:"4px 7px", lineHeight:1 }} title="Delete">🗑️</button>
                      </div>
                    )}
                  </div>
                )}
              </ChromeCard>
            );
          })}
        </div>
      )}

      {subTab==="prs" && !selectedPrEx && (
        <div>
          <SectionLabel>Personal Records</SectionLabel>
          {Object.keys(prs).length === 0 ? (
            <div style={{ textAlign:"center", padding:"44px 0", color:G.textDim }}>
              <div style={{ fontFamily:FONT.display, fontSize:36, letterSpacing:4, marginBottom:8 }}>NO PRs YET</div>
              <div style={{ fontFamily:FONT.body, fontSize:12, letterSpacing:2, textTransform:"uppercase" }}>Log workouts to set your first records</div>
              <NeonBtn onClick={()=>setSubTab("track")} style={{ marginTop:20 }}>START TRAINING</NeonBtn>
            </div>
          ) : (
            Object.entries(prs)
              .sort(([,a],[,b]) => b.est1rm - a.est1rm)
              .map(([name, pr]) => (
                <button key={name} onClick={()=>setSelectedPrEx(name)} style={{ width:"100%", background:"none", border:"none", padding:0, marginBottom:8, cursor:"pointer", textAlign:"left" }}>
                  <ChromeCard style={{ padding:"12px 14px", display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ fontSize:22, flexShrink:0 }}>🏆</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{name}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{pr.weight} lbs × {pr.reps} reps · {pr.date}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:FONT.display, fontSize:20, color:G.gold, textShadow:G.goldGlow2, letterSpacing:1 }}>{pr.est1rm}</div>
                        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>1RM EST</div>
                      </div>
                      <div style={{ color:G.textDim, fontSize:13 }}>›</div>
                    </div>
                  </ChromeCard>
                </button>
              ))
          )}
        </div>
      )}

      {subTab==="prs" && selectedPrEx && (() => {
        const history = getExerciseHistory(selectedPrEx, sessions);
        const pr = prs[selectedPrEx];
        const firstEst = history[0]?.est1rm || 0;
        const gain = pr ? pr.est1rm - firstEst : 0;
        const W = 300; const H = 80;
        const vals = history.map(h => h.est1rm);
        const minV = Math.min(...vals) * 0.97;
        const maxV = Math.max(...vals) * 1.03;
        const range = maxV - minV || 1;
        const coords = history.map((h, i) => ({
          x: history.length > 1 ? (i / (history.length - 1)) * W : W / 2,
          y: H - ((h.est1rm - minV) / range) * (H - 14) - 7,
          est: h.est1rm, date: h.date,
        }));
        const polyPts = coords.map(c => `${c.x},${c.y}`).join(" ");

        return (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <button onClick={()=>setSelectedPrEx(null)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:7, padding:"6px 11px", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:1, cursor:"pointer", flexShrink:0 }}>← PRs</button>
              <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selectedPrEx}</div>
            </div>

            {/* PR badge */}
            <ChromeCard gold glow style={{ padding:"16px 18px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>PERSONAL RECORD</div>
                <div style={{ fontFamily:FONT.display, fontSize:34, color:G.gold, textShadow:G.goldGlow, letterSpacing:1, lineHeight:1 }}>{pr?.est1rm} <span style={{ fontSize:16, color:G.textMid }}>lbs 1RM</span></div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:4 }}>{pr?.weight} lbs × {pr?.reps} reps · {pr?.date}</div>
              </div>
              {history.length > 1 && (
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:22, color:gain>=0?G.green:G.red, textShadow:`0 0 10px ${gain>=0?G.green:G.red}88`, letterSpacing:1 }}>{gain>=0?"+":""}{gain} lbs</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>since first session</div>
                </div>
              )}
            </ChromeCard>

            {/* Strength trend chart */}
            {history.length >= 2 ? (
              <ChromeCard style={{ padding:"14px", marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>ESTIMATED 1RM TREND</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{history.length} sessions</div>
                </div>
                <svg width="100%" viewBox={`-4 0 ${W+8} ${H}`} style={{ overflow:"visible", display:"block" }}>
                  <defs>
                    <linearGradient id="prGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={G.gold} stopOpacity="0.3"/>
                      <stop offset="100%" stopColor={G.gold} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {coords.length > 1 && <polygon points={`${coords[0].x},${H} ${polyPts} ${coords[coords.length-1].x},${H}`} fill="url(#prGrad)"/>}
                  {coords.length > 1 && <polyline points={polyPts} fill="none" stroke={G.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 4px ${G.gold})` }}/>}
                  {coords.map((c, i) => (
                    <g key={i}>
                      <circle cx={c.x} cy={c.y} r={i===coords.length-1?5:3} fill={i===coords.length-1?G.gold:"#0A0810"} stroke={G.gold} strokeWidth="2"/>
                      {(i===0 || i===coords.length-1) && (
                        <text x={c.x} y={c.y - 9} textAnchor={i===0?"start":"end"} fill={G.gold} fontSize="10" fontFamily={FONT.display} letterSpacing="1">{c.est}</text>
                      )}
                    </g>
                  ))}
                </svg>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{history[0]?.date}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{history[history.length-1]?.date}</div>
                </div>
              </ChromeCard>
            ) : (
              <ChromeCard style={{ padding:"14px", marginBottom:12, textAlign:"center" }}>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>Log more sessions with this exercise to see your strength trend chart</div>
              </ChromeCard>
            )}

            {/* Session-by-session history */}
            <SectionLabel>Session History</SectionLabel>
            {[...history].reverse().map((h, i) => {
              const isPr = h.est1rm === pr?.est1rm;
              return (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background: isPr?`${G.gold}08`:"rgba(255,255,255,0.02)", borderRadius:7, marginBottom:5, border:`1px solid ${isPr?G.gold+"33":G.borderB}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {isPr && <span style={{ fontSize:12 }}>🏆</span>}
                    <div>
                      <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>{h.date}</div>
                      <div style={{ fontFamily:FONT.display, fontSize:13, color:"#fff", letterSpacing:1, marginTop:1 }}>{h.weight} lbs × {h.reps} reps</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:FONT.display, fontSize:16, color:isPr?G.gold:G.textMid, letterSpacing:1 }}>{h.est1rm}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>1RM EST</div>
                  </div>
                </div>
              );
            })}

            <NeonBtn onClick={()=>{ selectExercise(exs[0]?.id || 1, selectedPrEx); setSubTab("track"); }} full style={{ marginTop:10 }}>TRAIN THIS EXERCISE ◆</NeonBtn>
          </div>
        );
      })()}

      {subTab==="programs" && (
        <div>
          {templates.length > 0 && (
            <>
              <SectionLabel>My Templates</SectionLabel>
              {templates.map(tmpl => (
                <ChromeCard key={tmpl.id} style={{ padding:"12px 14px", marginBottom:9 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ fontSize:22, flexShrink:0 }}>📋</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tmpl.name}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{tmpl.exs.length} exercises</div>
                    </div>
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <button onClick={()=>loadTemplate(tmpl)} style={{ background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:5, padding:"6px 12px", color:"#0A0810", fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>LOAD</button>
                      <button onClick={()=>deleteTemplate(tmpl.id)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"6px 8px", color:G.textDim, fontFamily:FONT.body, fontSize:11, cursor:"pointer" }}>✕</button>
                    </div>
                  </div>
                </ChromeCard>
              ))}
            </>
          )}
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
        if (map && map[key]) total += ex.sets.filter(s=>s.r&&s.w&&s.type!=="warmup").length;
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
  const [freezes, setFreezes] = useState(() => {
    try { return Number(localStorage.getItem("sfc_streak_freezes") ?? 2); } catch { return 2; }
  });
  const [bodyLog, setBodyLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_body_log") || "[]"); } catch { return []; }
  });
  const [showLogForm, setShowLogForm] = useState(false);
  const [logWeight, setLogWeight] = useState("");
  const [logBf, setLogBf] = useState("");
  const [logPhoto, setLogPhoto] = useState(null);
  const [logPhotoLoading, setLogPhotoLoading] = useState(false);
  const [photoLightbox, setPhotoLightbox] = useState(null);

  const saveBodyEntry = () => {
    const w = parseFloat(logWeight);
    if (isNaN(w) || w <= 0) { showToast("⚠️ Enter a valid weight"); return; }
    const bf = parseFloat(logBf) || null;
    const entry = { date: new Date().toISOString().slice(0, 10), weight: w, bf, photo: logPhoto || undefined };
    const next = [entry, ...bodyLog];
    setBodyLog(next);
    localStorage.setItem("sfc_body_log", JSON.stringify(next));
    setLogWeight(""); setLogBf(""); setLogPhoto(null); setShowLogForm(false);
    showToast("📊 CHECK-IN SAVED!");
  };

  const MILESTONES = [7,14,30,60,90,180,365];
  const nextMs = MILESTONES.find(m => m > streak) || 365;
  const totalVol = sessions.reduce((a,s) => a + (s.vol||0), 0);
  const bestWeekVol = calcBestWeekVolume(sessions);
  const fmtVol = v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v);

  const latest = bodyLog[0] || null;
  const first = bodyLog.length > 1 ? bodyLog[bodyLog.length - 1] : null;
  const weightDelta = latest && first ? +(latest.weight - first.weight).toFixed(1) : null;
  const bfDelta = latest?.bf != null && first?.bf != null ? +(latest.bf - first.bf).toFixed(1) : null;
  const weightPct = latest && first ? Math.max(10, Math.min(100, (latest.weight / first.weight) * 100)) : 0;
  const bfPct = latest?.bf != null && first?.bf != null && first.bf > 0
    ? Math.max(0, Math.min(100, ((first.bf - latest.bf) / first.bf) * 100))
    : 0;

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"10px 12px", color:"#fff", fontSize:14, outline:"none", flex:1, fontFamily:FONT.body, letterSpacing:1 };
  return (
    <div style={{ padding:"20px 18px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:16 }}>
        PROGRESS <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>VAULT</span>
      </div>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:18, border:`1px solid ${G.borderB}` }}>
        {[{id:"stats",l:"STATS"},{id:"streak",l:"STREAK"},{id:"heatmap",l:"HEAT MAP"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ flex:1, padding:"8px 2px", borderRadius:5, border:"none", background:activeTab===t.id?`linear-gradient(135deg,${G.gold},${G.goldDark})`:"transparent", color:activeTab===t.id?"#0A0810":G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
        ))}
      </div>

      {activeTab==="stats" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
            {[{l:"SESSIONS",v:String(sessions.length),ico:"🏋️"},{l:"TOTAL VOL",v:fmtVol(Math.round(totalVol)),ico:"⚡"},{l:"BEST WEEK",v:bestWeekVol>0?fmtVol(Math.round(bestWeekVol)):"—",ico:"📈"}].map(s=>(
              <StatPill key={s.l} label={s.l} value={s.v} icon={s.ico}/>
            ))}
          </div>
          {(() => {
            const avgSets = sessions.length > 0 ? (sessions.reduce((a,s)=>a+(s.sets||0),0)/sessions.length).toFixed(1) : "—";
            const avgVol  = sessions.length > 0 ? fmtVol(Math.round(sessions.reduce((a,s)=>a+(s.vol||0),0)/sessions.length)) : "—";
            const exCounts = {};
            sessions.forEach(s=>(s.exs||[]).forEach(e=>{ if(e.name) exCounts[e.name]=(exCounts[e.name]||0)+1; }));
            const topEx = Object.entries(exCounts).sort(([,a],[,b])=>b-a)[0]?.[0] || "—";
            const now = new Date();
            const monthSessions = sessions.filter(s=>{
              if(!s.createdAt) return false;
              const d = new Date(s.createdAt);
              return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
            }).length;
            const todayNutrition = (() => {
              try {
                const saved = JSON.parse(localStorage.getItem("sfc_nutrition_log")||"null");
                if(saved?.date===now.toISOString().slice(0,10)) return saved.items||[];
              } catch { /* ignore */ }
              return [];
            })();
            const todayCal = todayNutrition.reduce((a,i)=>a+(i.cal||0),0);
            const todayPro = todayNutrition.reduce((a,i)=>a+(i.pro||0),0);
            const todayWaterOz = (() => {
              try {
                const s = JSON.parse(localStorage.getItem("sfc_water_log")||"null");
                if(s?.date===now.toISOString().slice(0,10)) return (s.entries||[]).reduce((a,v)=>a+v,0);
              } catch { /* ignore */ }
              return 0;
            })();
            const stats2 = [
              { l:"AVG SETS/SESSION", v:avgSets,              ico:"💪" },
              { l:"AVG VOL/SESSION",  v:`${avgVol} lbs`,      ico:"⚡" },
              { l:"THIS MONTH",       v:`${monthSessions} sessions`, ico:"📅" },
              { l:"TOP EXERCISE",     v:topEx,                ico:"🏋️" },
              { l:"TODAY'S CALS",     v:todayCal>0?`${todayCal} kcal`:"—", ico:"🔥" },
              { l:"TODAY'S PROTEIN",  v:todayPro>0?`${todayPro}g`:"—", ico:"🥩" },
              { l:"TODAY'S WATER",    v:todayWaterOz>0?`${todayWaterOz}oz`:"—", ico:"💧" },
            ];
            return (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {stats2.map(s=>(
                  <ChromeCard key={s.l} style={{ padding:"12px 10px", display:"flex", gap:9, alignItems:"center" }}>
                    <div style={{ fontSize:20 }}>{s.ico}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:1, color:G.gold, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.v}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{s.l}</div>
                    </div>
                  </ChromeCard>
                ))}
              </div>
            );
          })()}
          <SectionLabel>Body Composition</SectionLabel>
          {latest ? (
            <ChromeCard gold style={{ padding:"16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center", marginBottom:14 }}>
                <RingMeter pct={weightPct} size={80} strokeW={6} color={G.gold} value={String(latest.weight)} label="LBS"/>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:4 }}>Since Start</div>
                  {weightDelta !== null ? (
                    <>
                      <div style={{ fontFamily:FONT.display, fontSize:26, color:weightDelta <= 0 ? G.green : G.red, letterSpacing:1, textShadow:`0 0 12px ${weightDelta <= 0 ? G.green : G.red}` }}>{weightDelta > 0 ? "+" : ""}{weightDelta} lbs</div>
                      {bfDelta !== null && <div style={{ fontFamily:FONT.display, fontSize:14, color:bfDelta <= 0 ? G.green : G.red, letterSpacing:1, marginTop:2 }}>{bfDelta > 0 ? "+" : ""}{bfDelta}% BF</div>}
                    </>
                  ) : (
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, textTransform:"uppercase", maxWidth:60 }}>Log more to see trend</div>
                  )}
                </div>
                <RingMeter pct={bfPct} size={80} strokeW={6} color={G.purpleLight} value={latest.bf != null ? `${latest.bf}%` : "—"} label="BODY FAT"/>
              </div>
              <button onClick={()=>setShowLogForm(v=>!v)} style={{ width:"100%", background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"8px", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>{showLogForm ? "✕ CANCEL" : "＋ LOG CHECK-IN"}</button>
            </ChromeCard>
          ) : (
            <ChromeCard style={{ padding:"20px", marginBottom:10, textAlign:"center", border:`1px dashed ${G.borderB}` }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📊</div>
              <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:6 }}>NO DATA YET</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1, marginBottom:14 }}>Log your weight and body fat % to track your progress over time.</div>
              <button onClick={()=>setShowLogForm(v=>!v)} style={{ background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:6, padding:"10px 20px", color:"#0A0810", fontFamily:FONT.display, fontSize:13, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>LOG FIRST CHECK-IN</button>
            </ChromeCard>
          )}
          {showLogForm && (
            <ChromeCard style={{ padding:"14px", marginBottom:10 }}>
              <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>NEW CHECK-IN · {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
              <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                <input type="number" placeholder="Weight (lbs)" value={logWeight} onChange={e=>setLogWeight(e.target.value)} style={inp}/>
                <input type="number" placeholder="Body fat % (opt)" value={logBf} onChange={e=>setLogBf(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveBodyEntry()} style={inp}/>
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, cursor:"pointer" }}>
                <div style={{ flex:1, background:"rgba(0,0,0,0.4)", border:`1px solid ${logPhoto?G.gold:G.borderB}`, borderRadius:6, padding:"9px 12px", color:logPhoto?G.gold:logPhotoLoading?"#74B9FF":G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:1, textTransform:"uppercase", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{logPhotoLoading?"⏳":"📷"}</span>
                  {logPhotoLoading ? "COMPRESSING..." : logPhoto ? "PHOTO ADDED ✓" : "ADD PROGRESS PHOTO (OPT)"}
                </div>
                <input type="file" accept="image/*" capture="environment" style={{ display:"none" }} disabled={logPhotoLoading} onChange={async e=>{
                  const f=e.target.files?.[0]; if(!f) return;
                  setLogPhotoLoading(true);
                  try { const b64=await compressImage(f); setLogPhoto(b64); }
                  catch { /* ignore — user sees no change */ }
                  finally { setLogPhotoLoading(false); }
                }}/>
              </label>
              {logPhoto && (
                <div style={{ position:"relative", marginBottom:8, borderRadius:6, overflow:"hidden", border:`1px solid ${G.gold}44` }}>
                  <img src={logPhoto} alt="preview" style={{ width:"100%", maxHeight:180, objectFit:"cover", display:"block" }}/>
                  <button onClick={()=>setLogPhoto(null)} style={{ position:"absolute", top:6, right:6, background:"rgba(0,0,0,0.7)", border:"none", borderRadius:4, padding:"2px 7px", color:"#fff", fontFamily:FONT.body, fontSize:11, cursor:"pointer" }}>✕</button>
                </div>
              )}
              <button onClick={saveBodyEntry} style={{ width:"100%", background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:6, padding:"10px", color:"#0A0810", fontFamily:FONT.display, fontSize:14, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>SAVE</button>
            </ChromeCard>
          )}
          {bodyLog.length >= 3 && (() => {
            const pts2 = [...bodyLog].reverse();
            const weights = pts2.map(e => e.weight);
            const minW = Math.min(...weights);
            const maxW = Math.max(...weights);
            const range = maxW - minW || 1;
            const W = 280; const H = 52;
            const coords = pts2.map((e, i) => ({
              x: (i / (pts2.length - 1)) * W,
              y: H - ((e.weight - minW) / range) * (H - 10) - 5,
            }));
            const polyPts = coords.map(c => `${c.x},${c.y}`).join(" ");
            return (
              <ChromeCard style={{ padding:"14px", marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>WEIGHT TREND</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{bodyLog.length} entries</div>
                </div>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={G.gold} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={G.gold} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polygon points={`0,${H} ${polyPts} ${W},${H}`} fill="url(#wGrad)"/>
                  <polyline points={polyPts} fill="none" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 3px ${G.gold})` }}/>
                  {coords.map((c, i) => (
                    <circle key={i} cx={c.x} cy={c.y} r={i===coords.length-1?4:2.5} fill={i===coords.length-1?G.gold:"#0A0810"} stroke={G.gold} strokeWidth="1.5"/>
                  ))}
                </svg>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{pts2[0]?.date}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{pts2[pts2.length-1]?.date}</div>
                </div>
              </ChromeCard>
            );
          })()}
          {bodyLog.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>HISTORY</div>
              {bodyLog.slice(0, 4).map((entry, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 10px", background:i===0?`${G.gold}08`:"transparent", borderRadius:5, marginBottom:3, border:`1px solid ${i===0?G.borderB:"transparent"}` }}>
                  <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>{entry.date}</div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ fontFamily:FONT.display, fontSize:13, color:i===0?G.gold:"#fff", letterSpacing:1 }}>{entry.weight} lbs</div>
                    {entry.bf != null && <div style={{ fontFamily:FONT.display, fontSize:13, color:i===0?G.purpleLight:G.textMid, letterSpacing:1 }}>{entry.bf}% BF</div>}
                    {entry.photo && (
                      <button onClick={()=>setPhotoLightbox(entry)} style={{ background:"none", border:"none", padding:0, cursor:"pointer", borderRadius:4, overflow:"hidden", width:32, height:32, flexShrink:0 }}>
                        <img src={entry.photo} alt={entry.date} style={{ width:32, height:32, objectFit:"cover", display:"block", borderRadius:4, border:`1px solid ${i===0?G.gold:G.borderB}` }}/>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {(() => {
            const photosWithData = bodyLog.filter(e => e.photo);
            if (photosWithData.length < 2) return null;
            const first = photosWithData[photosWithData.length - 1];
            const latest = photosWithData[0];
            return (
              <ChromeCard gold style={{ padding:"14px", marginBottom:14 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>BEFORE / AFTER</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[{ label:"BEFORE", entry:first }, { label:"LATEST", entry:latest }].map(({ label, entry }) => (
                    <button key={label} onClick={()=>setPhotoLightbox(entry)} style={{ background:"none", border:"none", padding:0, cursor:"pointer", borderRadius:8, overflow:"hidden", position:"relative" }}>
                      <img src={entry.photo} alt={label} style={{ width:"100%", aspectRatio:"3/4", objectFit:"cover", display:"block", borderRadius:8, border:`1px solid ${G.gold}44` }}/>
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.7)", padding:"4px 6px", textAlign:"center" }}>
                        <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>{label}</div>
                        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1 }}>{entry.date}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {first.weight && latest.weight && (
                  <div style={{ marginTop:10, textAlign:"center", fontFamily:FONT.display, fontSize:13, letterSpacing:2, color: latest.weight <= first.weight ? G.green : G.red }}>
                    {latest.weight <= first.weight ? "▼" : "▲"} {Math.abs(+(latest.weight - first.weight).toFixed(1))} lbs {latest.weight <= first.weight ? "lost" : "gained"}
                  </div>
                )}
              </ChromeCard>
            );
          })()}
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
            <NeonBtn onClick={()=>{if(freezes>0){const n=freezes-1;setFreezes(n);localStorage.setItem("sfc_streak_freezes",String(n));showToast("🧊 STREAK FREEZE USED!");}}} outline color={G.blue} full small disabled={freezes<=0}>USE FREEZE ({freezes} REMAINING)</NeonBtn>
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

      {activeTab==="heatmap" && (
        <MuscleHeatMap sessions={sessions} showToast={showToast}/>
      )}

      {photoLightbox && (
        <div onClick={()=>setPhotoLightbox(null)} style={{ position:"fixed", inset:0, zIndex:999, background:"rgba(0,0,0,0.92)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <button onClick={()=>setPhotoLightbox(null)} style={{ position:"absolute", top:20, right:20, background:"rgba(255,255,255,0.12)", border:"none", borderRadius:50, width:38, height:38, color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <img src={photoLightbox.photo} alt={photoLightbox.date} onClick={e=>e.stopPropagation()} style={{ maxWidth:"92vw", maxHeight:"72vh", objectFit:"contain", borderRadius:10, border:`1px solid ${G.gold}44`, display:"block" }}/>
          <div style={{ marginTop:16, textAlign:"center" }}>
            <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:3, color:G.gold, textShadow:G.goldGlow2 }}>{photoLightbox.date}</div>
            <div style={{ display:"flex", gap:20, justifyContent:"center", marginTop:6 }}>
              <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff" }}>{photoLightbox.weight} lbs</div>
              {photoLightbox.bf != null && <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:G.purpleLight }}>{photoLightbox.bf}% BF</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NutritionScreen({ showToast }) {
  const [view, setView] = useState("log");
  const today = new Date().toISOString().slice(0, 10);
  const savedLog = (() => {
    try {
      const s = localStorage.getItem("sfc_nutrition_log");
      if (!s) return [];
      const parsed = JSON.parse(s);
      return parsed.date === today ? parsed.items : [];
    } catch { return []; }
  })();
  const [log, setLog] = useState(savedLog);
  const savedSuppLog = (() => {
    try {
      const s = localStorage.getItem("sfc_supplement_log");
      if (!s) return [];
      const parsed = JSON.parse(s);
      return parsed.date === today ? parsed.items : [];
    } catch { return []; }
  })();
  const [suppLog, setSuppLog] = useState(savedSuppLog);
  const [suppSearch, setSuppSearch] = useState("");
  const [suppTypeFilter, setSuppTypeFilter] = useState("ALL");
  const [scanTarget, setScanTarget] = useState("food");

  const savedWater = (() => {
    try {
      const s = localStorage.getItem("sfc_water_log");
      if (!s) return [];
      const p = JSON.parse(s);
      return p.date === today ? (p.entries || []) : [];
    } catch { return []; }
  })();
  const [waterEntries, setWaterEntries] = useState(savedWater);
  const [waterGoal, setWaterGoal] = useState(() => {
    try { return Number(localStorage.getItem("sfc_water_goal") || 64) || 64; } catch { return 64; }
  });
  const [waterCustom, setWaterCustom] = useState("");
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState("");

  useEffect(() => {
    localStorage.setItem("sfc_nutrition_log", JSON.stringify({ date: today, items: log }));
  }, [log, today]);
  useEffect(() => {
    localStorage.setItem("sfc_supplement_log", JSON.stringify({ date: today, items: suppLog }));
  }, [suppLog, today]);
  useEffect(() => {
    localStorage.setItem("sfc_water_log", JSON.stringify({ date: today, entries: waterEntries }));
  }, [waterEntries, today]);

  const waterOz = waterEntries.reduce((a, v) => a + v, 0);
  const waterPct = Math.min(100, (waterOz / waterGoal) * 100);
  const addWater = (oz) => { if (oz <= 0) return; setWaterEntries(p => [...p, oz]); showToast(`💧 +${oz}oz logged!`); };
  const undoWater = () => setWaterEntries(p => p.slice(0, -1));
  const saveGoal = () => {
    const g = Math.max(8, parseInt(goalDraft) || 64);
    setWaterGoal(g);
    localStorage.setItem("sfc_water_goal", String(g));
    setEditingGoal(false);
  };
  const [selMeal, setSelMeal] = useState("LUNCH");
  const [mealTemplates, setMealTemplates] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_meal_templates") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("sfc_meal_templates", JSON.stringify(mealTemplates)); }, [mealTemplates]);
  const saveMealTemplate = (meal) => {
    const name = templateNameDraft.trim().toUpperCase();
    if (!name) return;
    const items = log.filter(f => f.meal === meal).map(({ name: n, cal, pro, carb, fat, brand }) => ({ name: n, cal, pro, carb, fat, brand }));
    if (!items.length) return;
    setMealTemplates(p => [...p, { id: Date.now().toString(), name, items }]);
    setSavingTemplateFor(null);
    setTemplateNameDraft("");
    showToast(`✓ "${name}" saved as template`);
  };
  const loadTemplate = (tmpl) => {
    const toAdd = tmpl.items.map(item => ({ ...item, id: Date.now() + Math.random(), meal: selMeal }));
    setLog(p => [...p, ...toAdd]);
    showToast(`✓ ${tmpl.name} loaded into ${selMeal}`);
  };
  const deleteTemplate = (id) => setMealTemplates(p => p.filter(t => t.id !== id));
  const [savingTemplateFor, setSavingTemplateFor] = useState(null);
  const [templateNameDraft, setTemplateNameDraft] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [scanMode, setScanMode] = useState("idle");
  const [scanResult, setScanResult] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLabel, setScanLabel] = useState("");
  const [manualEntry, setManualEntry] = useState({ name:"", cal:"", pro:"", carb:"", fat:"" });
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
  const macroTargets = getActiveMacroTargets();
  const macroCoachActive = !!loadMacroCoach()?.setupComplete;
  const totals = log.reduce((a,f)=>({cal:a.cal+(f.cal||0),pro:a.pro+(f.pro||0),carb:a.carb+(f.carb||0),fat:a.fat+(f.fat||0)}),{cal:0,pro:0,carb:0,fat:0});
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
    setScanMode("analyzing"); setScanLabel("LOOKING UP BARCODE..."); setScanProgress(25);
    const showManual = (prefillName = "", prefillBrand = "") => {
      setScanProgress(0);
      setManualEntry({ name: prefillName, brand: prefillBrand, cal:"", pro:"", carb:"", fat:"" });
      setScanMode("barcode_not_found");
    };
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      setScanProgress(60);
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
        return;
      }
      if (BARCODE_DB[code]) {
        setScanProgress(100);
        setScanResult({ ...BARCODE_DB[code], confidence: 99 });
        setScanMode("barcode_result");
        return;
      }
      setScanLabel("SEARCHING SECONDARY DATABASE...");
      setScanProgress(75);
      try {
        const res2 = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
        const data2 = await res2.json();
        if (data2.items?.length > 0) {
          const item = data2.items[0];
          showManual(item.title || item.brand || "", item.brand || "");
          return;
        }
      } catch { /* ignore secondary lookup failure */ }
      showManual();
    } catch {
      showManual();
    }
  };

  const resetScan = () => { stopCamera(); clearInterval(scanTimerRef.current); setScanMode("idle"); setScanResult(null); setBarcodeInput(""); setScanProgress(0); setManualEntry({ name:"", cal:"", pro:"", carb:"", fat:"" }); setScanTarget("food"); };
  const addScanResult = () => {
    if (!scanResult) return;
    if (scanTarget === "supplement") {
      setSuppLog(p=>[...p,{...scanResult,id:Date.now(),type:"SCANNED"}]);
      resetScan(); setView("supps");
      showToast(`✓ ${scanResult.name} added to supplements`);
    } else {
      setLog(p=>[...p,{...scanResult,id:Date.now(),meal:selMeal}]);
      resetScan(); setView("log");
      showToast(`✓ ${scanResult.name} added to ${selMeal}`);
    }
  };
  const addManualEntry = () => {
    const name = manualEntry.name.trim();
    if (!name) { showToast("Enter a product name"); return; }
    const item = { name, brand: manualEntry.brand || "", cal: parseInt(manualEntry.cal)||0, pro: parseFloat(manualEntry.pro)||0, carb: parseFloat(manualEntry.carb)||0, fat: parseFloat(manualEntry.fat)||0 };
    if (scanTarget === "supplement") {
      setSuppLog(p=>[...p,{...item,id:Date.now(),type:"MANUAL"}]);
      resetScan(); setView("supps");
      showToast(`✓ ${item.name} added to supplements`);
    } else {
      setLog(p=>[...p,{...item,id:Date.now(),meal:selMeal}]);
      resetScan(); setView("log");
      showToast(`✓ ${item.name} added to ${selMeal}`);
    }
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
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff" }}>TODAY</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {macroCoachActive && <div style={{ background:`${G.gold}20`, border:`1px solid ${G.gold}44`, borderRadius:4, padding:"2px 6px", fontFamily:FONT.body, fontSize:8, letterSpacing:1.5, color:G.gold, textTransform:"uppercase" }}>⚡ ADAPTIVE</div>}
          </div>
        </div>
        {(() => {
          const calPct = Math.min(100, Math.round((totals.cal / macroTargets.cal) * 100));
          const calRemaining = macroTargets.cal - totals.cal;
          const over = calRemaining < 0;
          const ringColor = calPct >= 100 ? "#FF3D5A" : calPct >= 85 ? "#FF6B00" : G.gold;
          return (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:16 }}>
              <div style={{ position:"relative" }}>
                <RingMeter pct={calPct} size={140} strokeW={10} color={ringColor} value={Math.abs(calRemaining).toLocaleString()} label={over ? "CAL OVER" : "CAL LEFT"}/>
                <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>
                  {totals.cal.toLocaleString()} / {macroTargets.cal.toLocaleString()} KCAL
                </div>
              </div>
            </div>
          );
        })()}
        <div style={{ display:"flex", gap:8 }}>
          {[{l:"PROTEIN",v:totals.pro,m:macroTargets.pro,col:G.purpleLight},{l:"CARBS",v:totals.carb,m:macroTargets.carb,col:G.gold},{l:"FAT",v:totals.fat,m:macroTargets.fat,col:"#FF3D5A"}].map(b=>(
            <div key={b.l} style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{b.l}</div>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:b.col, letterSpacing:1 }}>{b.v}g</div>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${Math.min(100,(b.v/b.m)*100)}%`, background:b.col, borderRadius:2, boxShadow:`0 0 4px ${b.col}88`, transition:"width 0.5s" }}/>
              </div>
              <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1, marginTop:2, textTransform:"uppercase" }}>{b.m}g goal</div>
            </div>
          ))}
        </div>
      </ChromeCard>

      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:14, border:`1px solid ${G.borderB}` }}>
        {[{id:"log",l:"📋 LOG"},{id:"scan",l:"📷 SCAN"},{id:"search",l:"🔍 SEARCH"},{id:"supps",l:"💊 SUPPS"}].map(t=>(
          <button key={t.id} onClick={()=>{ setView(t.id); if(t.id==="scan"&&scanMode==="idle") startCameraScan(); }} style={{ flex:1, padding:"8px 4px", borderRadius:5, border:"none", background:view===t.id?`linear-gradient(135deg,${G.gold},${G.goldDark})`:"transparent", color:view===t.id?"#0A0810":G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
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
              {scanMode==="barcode_not_found" && (
                <div style={{ padding:"16px", width:"100%", boxSizing:"border-box" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:G.gold, boxShadow:`0 0 8px ${G.gold}` }}/>
                    <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:3, color:G.gold, textTransform:"uppercase" }}>NOT IN DATABASE — ENTER MACROS</div>
                  </div>
                  {[
                    { field:"name", label:"PRODUCT NAME", placeholder:"e.g. Protein Bar Vanilla" },
                    { field:"cal",  label:"CALORIES",     placeholder:"e.g. 200" },
                    { field:"pro",  label:"PROTEIN (G)",  placeholder:"e.g. 20" },
                    { field:"carb", label:"CARBS (G)",    placeholder:"e.g. 25" },
                    { field:"fat",  label:"FAT (G)",      placeholder:"e.g. 7" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field} style={{ marginBottom:8 }}>
                      <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:3 }}>{label}</div>
                      <input
                        type={field==="name"?"text":"number"}
                        inputMode={field==="name"?"text":"decimal"}
                        value={manualEntry[field]}
                        onChange={e=>setManualEntry(p=>({...p,[field]:e.target.value}))}
                        placeholder={placeholder}
                        style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"8px 10px", color:"#fff", fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.body, letterSpacing:1 }}/>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding:"12px", borderTop:`1px solid ${G.borderB}` }}>
              {scanMode==="idle" && (
                scanTarget === "supplement" ? (
                  <NeonBtn onClick={startBarcodeScan} full>📊 SCAN SUPPLEMENT BARCODE</NeonBtn>
                ) : (
                  <div style={{ display:"flex", gap:9 }}>
                    <NeonBtn onClick={startCameraScan} style={{ flex:2 }}>📷 SCAN MEAL</NeonBtn>
                    <NeonBtn onClick={startBarcodeScan} outline style={{ flex:1, fontSize:12 }}>📊 BARCODE</NeonBtn>
                  </div>
                )
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
                  {scanTarget === "food" && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                      {MEALS.map(m=>(
                        <button key={m} onClick={()=>setSelMeal(m)} style={{ padding:"4px 9px", borderRadius:4, border:`1px solid ${selMeal===m?G.gold:G.borderB}`, background:selMeal===m?`${G.gold}18`:"transparent", color:selMeal===m?G.gold:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>{m}</button>
                      ))}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:9 }}>
                    <NeonBtn onClick={resetScan} outline style={{ flex:1 }}>RESCAN</NeonBtn>
                    <NeonBtn onClick={addScanResult} style={{ flex:2 }}>{scanTarget==="supplement"?"ADD TO SUPPLEMENTS ◆":`ADD TO ${selMeal} ◆`}</NeonBtn>
                  </div>
                </div>
              )}
              {scanMode==="barcode_not_found" && (
                <div>
                  {scanTarget === "food" && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                      {MEALS.map(m=>(
                        <button key={m} onClick={()=>setSelMeal(m)} style={{ padding:"4px 9px", borderRadius:4, border:`1px solid ${selMeal===m?G.gold:G.borderB}`, background:selMeal===m?`${G.gold}18`:"transparent", color:selMeal===m?G.gold:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>{m}</button>
                      ))}
                    </div>
                  )}
                  <div style={{ display:"flex", gap:9 }}>
                    <NeonBtn onClick={resetScan} outline style={{ flex:1 }}>CANCEL</NeonBtn>
                    <NeonBtn onClick={addManualEntry} style={{ flex:2 }}>{scanTarget==="supplement"?"ADD TO SUPPLEMENTS ◆":`ADD TO ${selMeal} ◆`}</NeonBtn>
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

      {view==="log" && (
        <div style={{ background:`linear-gradient(135deg,rgba(77,166,255,0.07),rgba(10,8,24,0.9))`, border:`1px solid ${G.blue}44`, borderRadius:10, padding:"16px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:24 }}>💧</div>
              <div>
                <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:2, color:"#fff" }}>WATER INTAKE</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.blue, letterSpacing:1.5, textTransform:"uppercase", marginTop:1 }}>
                  {waterOz} oz · {(waterOz / 8).toFixed(1)} cups
                </div>
              </div>
            </div>
            {editingGoal ? (
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <input autoFocus type="number" inputMode="numeric" value={goalDraft} onChange={e=>setGoalDraft(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveGoal()} style={{ width:58, background:"rgba(0,0,0,0.5)", border:`1px solid ${G.blue}66`, borderRadius:5, padding:"5px 8px", color:G.blue, fontSize:14, outline:"none", fontFamily:FONT.display, letterSpacing:1 }}/>
                <span style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim }}>oz</span>
                <button onClick={saveGoal} style={{ background:G.blue, border:"none", borderRadius:5, padding:"5px 10px", color:"#0A0810", fontFamily:FONT.display, fontSize:12, letterSpacing:1, cursor:"pointer" }}>✓</button>
                <button onClick={()=>setEditingGoal(false)} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:14 }}>✕</button>
              </div>
            ) : (
              <button onClick={()=>{ setGoalDraft(String(waterGoal)); setEditingGoal(true); }} style={{ background:`${G.blue}12`, border:`1px solid ${G.blue}33`, borderRadius:6, padding:"5px 10px", color:G.blue, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>
                GOAL: {waterGoal}oz ✏
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ position:"relative", height:10, background:`${G.blue}14`, borderRadius:5, marginBottom:4, overflow:"hidden", border:`1px solid ${G.blue}22` }}>
            <div style={{ height:"100%", width:`${waterPct}%`, background:`linear-gradient(90deg,${G.blue}88,${G.blue})`, borderRadius:5, boxShadow:`0 0 10px ${G.blue}55`, transition:"width 0.5s ease" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.blue, letterSpacing:1 }}>{waterOz}oz</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:waterPct>=100?G.blue:G.textDim, letterSpacing:1, fontWeight:waterPct>=100?"bold":"normal" }}>
              {waterPct >= 100 ? "✓ GOAL REACHED" : `${waterGoal - waterOz}oz remaining`}
            </div>
          </div>

          {/* Quick-add buttons */}
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            {[8, 12, 16, 20].map(oz => (
              <button key={oz} onClick={()=>addWater(oz)} style={{ flex:1, padding:"9px 4px", borderRadius:7, border:`1px solid ${G.blue}44`, background:`${G.blue}12`, color:G.blue, fontFamily:FONT.display, fontSize:14, letterSpacing:1, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
                +{oz}
                <span style={{ fontFamily:FONT.body, fontSize:8, letterSpacing:1, textTransform:"uppercase", color:`${G.blue}AA` }}>oz</span>
              </button>
            ))}
          </div>

          {/* Custom amount + undo */}
          <div style={{ display:"flex", gap:7 }}>
            <input type="number" inputMode="numeric" placeholder="Custom oz" value={waterCustom} onChange={e=>setWaterCustom(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ const v=parseInt(waterCustom); if(v>0){addWater(v);setWaterCustom("");}} }} style={{ flex:1, background:"rgba(0,0,0,0.4)", border:`1px solid ${G.blue}33`, borderRadius:6, padding:"8px 10px", color:G.blue, fontSize:14, outline:"none", fontFamily:FONT.display, letterSpacing:1, minWidth:0 }}/>
            <button onClick={()=>{ const v=parseInt(waterCustom); if(v>0){addWater(v);setWaterCustom("");} }} style={{ background:`${G.blue}20`, border:`1px solid ${G.blue}44`, borderRadius:6, padding:"8px 14px", color:G.blue, fontFamily:FONT.display, fontSize:12, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>ADD</button>
            {waterEntries.length > 0 && (
              <button onClick={undoWater} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"8px 10px", color:G.textDim, fontFamily:FONT.body, fontSize:11, letterSpacing:1, cursor:"pointer" }}>UNDO</button>
            )}
          </div>
        </div>
      )}

      {view==="log" && mealTemplates.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:3, height:18, background:G.gold, boxShadow:G.goldGlow2, borderRadius:1 }}/>
            <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:3, color:G.gold, textTransform:"uppercase" }}>MY TEMPLATES</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>→ {selMeal}</div>
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
            {mealTemplates.map(t => {
              const tmplCal = t.items.reduce((a, f) => a + (f.cal || 0), 0);
              const tmplPro = t.items.reduce((a, f) => a + (f.pro || 0), 0);
              return (
                <div key={t.id} style={{ flexShrink:0, background:`${G.gold}0C`, border:`1px solid ${G.gold}30`, borderRadius:10, padding:"12px 13px", minWidth:140, position:"relative" }}>
                  <button onClick={() => deleteTemplate(t.id)} style={{ position:"absolute", top:6, right:7, background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:12, lineHeight:1, padding:0 }}>✕</button>
                  <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", marginBottom:3, paddingRight:14, lineHeight:1.2 }}>{t.name}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>{t.items.length} items · {tmplCal} kcal · P:{tmplPro}g</div>
                  <button onClick={() => loadTemplate(t)} style={{ width:"100%", background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:6, padding:"7px 0", color:"#0A0810", fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>LOG ◆</button>
                </div>
              );
            })}
          </div>
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
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                {mealCal>0 && <div style={{ fontFamily:FONT.mono, fontSize:10, color:G.textDim }}>{mealCal} kcal</div>}
                {items.length > 0 && savingTemplateFor === meal ? (
                  <>
                    <input autoFocus value={templateNameDraft} onChange={e=>setTemplateNameDraft(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") saveMealTemplate(meal); if(e.key==="Escape") setSavingTemplateFor(null); }} placeholder="TEMPLATE NAME" style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.gold}66`, borderRadius:5, padding:"4px 8px", color:G.gold, fontSize:11, outline:"none", fontFamily:FONT.display, letterSpacing:1, textTransform:"uppercase", width:120 }}/>
                    <button onClick={()=>saveMealTemplate(meal)} style={{ background:`${G.gold}20`, border:`1px solid ${G.gold}55`, borderRadius:5, padding:"4px 8px", color:G.gold, fontFamily:FONT.display, fontSize:11, cursor:"pointer", lineHeight:1 }}>✓</button>
                    <button onClick={()=>setSavingTemplateFor(null)} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13, lineHeight:1 }}>✕</button>
                  </>
                ) : (
                  <>
                    {items.length > 0 && <button onClick={()=>{ setSavingTemplateFor(meal); setTemplateNameDraft(meal); }} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"4px 8px", color:G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>💾</button>}
                    <NeonBtn onClick={()=>{setSelMeal(meal);setView("search");}} small outline color={G.gold}>+ ADD</NeonBtn>
                  </>
                )}
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

      {view==="supps" && (() => {
        const filteredSupps = SUPPLEMENTS_DB.filter(s => {
          const matchType = suppTypeFilter==="ALL" || s.type===suppTypeFilter;
          const matchQ = !suppSearch || s.name.toLowerCase().includes(suppSearch.toLowerCase());
          return matchType && matchQ;
        });
        const suppTotals = suppLog.reduce((a,s)=>({ cal:a.cal+(s.cal||0), pro:a.pro+(s.pro||0) }),{ cal:0, pro:0 });
        return (
          <div>
            {/* Today summary */}
            <ChromeCard style={{ padding:"13px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ fontSize:30 }}>💊</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", marginBottom:3 }}>TODAY'S SUPPLEMENTS</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>
                  {suppLog.length} logged · {suppTotals.pro}G protein · {suppTotals.cal} cal
                </div>
              </div>
              <NeonBtn onClick={()=>{ setScanTarget("supplement"); setView("scan"); startBarcodeScan(); }} small>📊 SCAN</NeonBtn>
            </ChromeCard>

            {/* Logged supplements */}
            {suppLog.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>LOGGED TODAY</div>
                {suppLog.map(s => {
                  const col = SUPP_TYPE_COLOR[s.type] || G.purpleLight;
                  return (
                    <ChromeCard key={s.id} style={{ padding:"10px 12px", marginBottom:6, display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:col, boxShadow:`0 0 6px ${col}`, flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:1 }}>
                          {s.serving || "1 serving"}{s.brand && s.brand !== "Generic" ? ` · ${s.brand}` : ""} · {s.cal} cal · P:{s.pro}g
                        </div>
                      </div>
                      {s.type && <span style={{ fontFamily:FONT.body, fontSize:8, letterSpacing:1.5, color:col, background:`${col}18`, border:`1px solid ${col}33`, borderRadius:4, padding:"2px 7px", flexShrink:0, textTransform:"uppercase" }}>{s.type}</span>}
                      <button onClick={()=>setSuppLog(p=>p.filter(x=>x.id!==s.id))} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:14, padding:"2px 5px", flexShrink:0 }}>✕</button>
                    </ChromeCard>
                  );
                })}
              </div>
            )}

            {/* Browse / search */}
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>ADD SUPPLEMENT</div>
            <div style={{ position:"relative", marginBottom:10 }}>
              <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:G.textDim, pointerEvents:"none" }}>🔍</span>
              <input value={suppSearch} onChange={e=>setSuppSearch(e.target.value)} placeholder="SEARCH SUPPLEMENTS..." style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"9px 12px 9px 34px", color:"#fff", fontSize:12, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1.5, textTransform:"uppercase" }}/>
              {suppSearch && <button onClick={()=>setSuppSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13 }}>✕</button>}
            </div>
            <div style={{ display:"flex", overflowX:"auto", gap:5, marginBottom:12, scrollbarWidth:"none" }}>
              {SUPP_TYPES.map(t => (
                <button key={t} onClick={()=>setSuppTypeFilter(t)} style={{ flexShrink:0, padding:"4px 10px", borderRadius:4, border:`1px solid ${suppTypeFilter===t?(SUPP_TYPE_COLOR[t]||G.gold):G.borderB}`, background:suppTypeFilter===t?`${SUPP_TYPE_COLOR[t]||G.gold}18`:"transparent", color:suppTypeFilter===t?(SUPP_TYPE_COLOR[t]||G.gold):G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{t}</button>
              ))}
            </div>
            {filteredSupps.map(s => {
              const col = SUPP_TYPE_COLOR[s.type] || G.purpleLight;
              return (
                <ChromeCard key={s.name} style={{ padding:"10px 12px", marginBottom:7, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                      <span style={{ fontFamily:FONT.body, fontSize:8, letterSpacing:1, color:col, background:`${col}15`, border:`1px solid ${col}33`, borderRadius:3, padding:"1px 5px", flexShrink:0, textTransform:"uppercase" }}>{s.type}</span>
                    </div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{s.serving} · {s.cal} cal · P:{s.pro}g · C:{s.carb}g · F:{s.fat}g</div>
                  </div>
                  <NeonBtn onClick={()=>{ setSuppLog(p=>[...p,{...s,id:Date.now()}]); showToast(`✓ ${s.name} logged`); }} small>+</NeonBtn>
                </ChromeCard>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}

function getChallengeProgress(ch, sessions) {
  const since = new Date(ch.created);
  const relevant = sessions.filter(s => new Date(s.createdAt || s.date) >= since);
  if (ch.type === "pr") {
    let best = 0;
    for (const sess of relevant) {
      for (const ex of (sess.exs || [])) {
        if (ex.name !== ch.exercise) continue;
        for (const set of ex.sets) {
          if (set.type === "warmup") continue;
          const w = parseFloat(set.w) || 0, r = parseInt(set.r) || 0;
          if (w && r) best = Math.max(best, Math.round(w * (1 + r / 30)));
        }
      }
    }
    return { current: best, pct: Math.min(100, ch.target ? (best / ch.target) * 100 : 0), unit: "LB EST. 1RM" };
  }
  if (ch.type === "vol") {
    const current = relevant.reduce((a, s) => a + (s.vol || 0), 0);
    return { current, pct: Math.min(100, ch.target ? (current / ch.target) * 100 : 0), unit: "LBS VOLUME" };
  }
  const current = relevant.length;
  return { current, pct: Math.min(100, ch.target ? (current / ch.target) * 100 : 0), unit: "SESSIONS" };
}

function FeedScreen({ showToast, profile, sessions = [] }) {
  const [feed, setFeed] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sfc_feed") || "null");
      return saved || [];
    } catch { return []; }
  });
  const [activeComment, setActiveComment] = useState(null);
  const [cTxt, setCTxt] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [newTxt, setNewTxt] = useState("");
  const [newType, setNewType] = useState("post");
  const [newTag, setNewTag] = useState("");
  const [challenges, setChallenges] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_challenges") || "[]"); } catch { return []; }
  });
  const [newChalType, setNewChalType] = useState("pr");
  const [newChalExercise, setNewChalExercise] = useState("");
  const [newChalTarget, setNewChalTarget] = useState("");

  useEffect(() => {
    localStorage.setItem("sfc_feed", JSON.stringify(feed));
  }, [feed]);

  useEffect(() => {
    localStorage.setItem("sfc_challenges", JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    const incomplete = challenges.filter(ch => !ch.completed);
    if (!incomplete.length) return;
    const nowMs = Date.now();
    const completions = [];
    const updated = challenges.map(ch => {
      if (ch.completed) return ch;
      const { pct } = getChallengeProgress(ch, sessions);
      if (pct < 100) return ch;
      completions.push(ch);
      return { ...ch, completed: true, completedAt: new Date(nowMs).toISOString() };
    });
    if (!completions.length) return;
    // Deferred to avoid setState-in-effect cascading renders
    setTimeout(() => {
      setChallenges(updated);
      setFeed(p => [
        ...completions.map(ch => ({
          id: `ch_done_${ch.id}`,
          user: profile?.username || "YOU",
          av: profile?.avatar_initials || "ME",
          time: "JUST NOW",
          txt: ch.type === "pr"
            ? `Challenge complete! Hit a ${ch.target}lb ${ch.exercise} 1RM. 🏆`
            : ch.type === "vol"
            ? `Challenge complete! Moved ${Number(ch.target).toLocaleString()}lbs of volume in 7 days. 💪`
            : `Challenge complete! Logged ${ch.target} sessions in 7 days. 🔥`,
          likes: 0, liked: false, commentList: [],
          type: "milestone", tag: "CHALLENGE COMPLETE",
          reactions: { "🔥":0, "💪":0, "👊":0, "⚡":0, "🙌":0 }, myReactions: [],
        })),
        ...p,
      ]);
      completions.forEach(() => showToast("🏆 CHALLENGE COMPLETE!"));
    }, 0);
  }, [sessions]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLike = id => setFeed(p => p.map(post =>
    post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
  ));

  const submitComment = (postId) => {
    if (!cTxt.trim()) return;
    const comment = { user: profile?.username || "YOU", av: profile?.avatar_initials || "ME", txt: cTxt.trim(), time: "JUST NOW" };
    setFeed(p => p.map(x => x.id === postId
      ? { ...x, commentList: [...(x.commentList || []), comment] }
      : x
    ));
    setCTxt("");
  };

  const toggleReaction = (id, emoji) => setFeed(p => p.map(post => {
    if (post.id !== id) return post;
    const reactions = { ...(post.reactions || {}) };
    const myReactions = [...(post.myReactions || [])];
    const hasIt = myReactions.includes(emoji);
    if (hasIt) {
      myReactions.splice(myReactions.indexOf(emoji), 1);
      reactions[emoji] = Math.max(0, (reactions[emoji] || 0) - 1);
    } else {
      myReactions.push(emoji);
      reactions[emoji] = (reactions[emoji] || 0) + 1;
    }
    return { ...post, reactions, myReactions };
  }));

  const submitPost = () => {
    if (!newTxt.trim()) return;
    const tag = (newType !== "post" && newTag.trim()) ? newTag.trim().toUpperCase() : null;
    setFeed(p => [{
      id: Date.now().toString(),
      user: profile?.username || "YOU",
      av: profile?.avatar_initials || "ME",
      time: "JUST NOW",
      txt: newTxt.trim(),
      likes: 0, liked: false,
      commentList: [],
      type: newType,
      tag,
      reactions: { "🔥":0, "💪":0, "👊":0, "⚡":0, "🙌":0 },
      myReactions: [],
    }, ...p]);
    setNewTxt(""); setNewTag(""); setNewType("post"); setShowPost(false);
    showToast("🔥 POST SHARED WITH THE SQUAD!");
  };

  const submitChallenge = () => {
    const target = parseFloat(newChalTarget);
    if (!target || target <= 0) return showToast("Enter a valid target");
    if (newChalType === "pr" && !newChalExercise.trim()) return showToast("Enter an exercise name");
    const id = `ch_${Date.now()}`;
    const created = new Date().toISOString();
    const deadline = new Date(Date.now() + 7 * 86400000).toISOString();
    const ch = { id, type: newChalType, exercise: newChalType === "pr" ? newChalExercise.trim() : null, target, created, deadline, completed: false, completedAt: null };
    setChallenges(p => [...p, ch]);
    const txt = newChalType === "pr"
      ? `Can I hit a ${target}lb ${newChalExercise.trim()} 1RM in 7 days? The challenge is on. 💪`
      : newChalType === "vol"
      ? `Can I move ${Number(target).toLocaleString()}lbs of total volume in 7 days? Let's find out. ⚡`
      : `Can I log ${target} sessions in 7 days? Holding myself accountable. 🔥`;
    setFeed(p => [{
      id: `ch_post_${id}`,
      user: profile?.username || "YOU",
      av: profile?.avatar_initials || "ME",
      time: "JUST NOW",
      txt,
      likes: 0, liked: false, commentList: [],
      type: "challenge",
      tag: newChalType === "pr" ? `${newChalExercise.trim().toUpperCase()} PR CHALLENGE` : newChalType === "vol" ? "VOLUME CHALLENGE" : "SESSION CHALLENGE",
      challengeId: id,
      reactions: { "🔥":0, "💪":0, "👊":0, "⚡":0, "🙌":0 }, myReactions: [],
    }, ...p]);
    setNewChalExercise(""); setNewChalTarget(""); setNewChalType("pr"); setShowPost(false);
    showToast("⚔️ CHALLENGE LAUNCHED!");
  };

  const typeConfig = {
    pr: { color: G.gold, ico: "🏆", label: "PR ALERT" },
    milestone: { color: G.purpleLight, ico: "⭐", label: "MILESTONE" },
    post: { color: G.textMid, ico: "📢", label: "POST" },
    challenge: { color: "#00D4FF", ico: "⚔️", label: "CHALLENGE" },
  };

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"9px 12px", color:"#fff", fontSize:13, outline:"none", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" };

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
        const comments = post.commentList || [];
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

            {post.type === "challenge" && post.challengeId && (() => {
              const ch = challenges.find(c => c.id === post.challengeId);
              if (!ch) return null;
              const { current, pct, unit } = getChallengeProgress(ch, sessions);
              const daysLeft = Math.max(0, Math.ceil((new Date(ch.deadline) - Date.now()) / 86400000));
              const done = ch.completed || pct >= 100;
              return (
                <div style={{ margin:"10px 13px 0", background:"rgba(0,212,255,0.06)", border:"1px solid rgba(0,212,255,0.2)", borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:"#00D4FF", letterSpacing:1.5, textTransform:"uppercase" }}>MY CHALLENGE</div>
                    {done
                      ? <span style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, color:G.gold, background:`${G.gold}18`, border:`1px solid ${G.gold}44`, borderRadius:10, padding:"2px 8px" }}>✓ COMPLETE</span>
                      : <span style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, color: daysLeft <= 2 ? "#FF6B00" : G.textMid, background:"rgba(0,0,0,0.3)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"2px 8px" }}>{daysLeft}D LEFT</span>
                    }
                  </div>
                  <div style={{ height:6, background:"rgba(255,255,255,0.08)", borderRadius:3, overflow:"hidden", marginBottom:6 }}>
                    <div style={{ height:"100%", width:`${pct}%`, background: done ? `linear-gradient(90deg,${G.gold},${G.goldDark})` : "linear-gradient(90deg,#00D4FF,#0088FF)", borderRadius:3, transition:"width 0.5s ease", boxShadow: done ? G.goldGlow2 : "0 0 6px #00D4FF66" }}/>
                  </div>
                  <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1, textTransform:"uppercase" }}>
                    {current.toLocaleString()} / {Number(ch.target).toLocaleString()} {unit}
                  </div>
                </div>
              );
            })()}

            <div style={{ padding:"8px 13px 0", display:"flex", gap:5, flexWrap:"wrap" }}>
              {REACTIONS.map(emoji => {
                const count = (post.reactions || {})[emoji] || 0;
                const mine = (post.myReactions || []).includes(emoji);
                return (
                  <button key={emoji} onClick={() => toggleReaction(post.id, emoji)} style={{ display:"flex", alignItems:"center", gap:3, background: mine ? `${G.gold}1A` : "rgba(255,255,255,0.04)", border:`1px solid ${mine ? G.gold+"55" : G.borderB}`, borderRadius:16, padding:"4px 9px", cursor:"pointer", transition:"all 0.15s", boxShadow: mine ? `0 0 6px ${G.gold}44` : "none" }}>
                    <span style={{ fontSize:14, lineHeight:1 }}>{emoji}</span>
                    {count > 0 && <span style={{ fontFamily:FONT.display, fontSize:11, color: mine ? G.gold : G.textMid, letterSpacing:0.5 }}>{count}</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ padding:"10px 13px 12px", display:"flex", gap:6, alignItems:"center" }}>
              <button onClick={()=>toggleLike(post.id)} style={{ display:"flex", alignItems:"center", gap:5, background:post.liked?`${G.gold}15`:"transparent", border:`1px solid ${post.liked?G.gold+"55":G.borderB}`, borderRadius:20, padding:"5px 11px", color:post.liked?G.gold:G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, cursor:"pointer", transition:"all 0.2s" }}>
                {post.liked ? "❤️" : "🤍"} {post.likes}
              </button>
              <button onClick={()=>{ setActiveComment(activeComment===post.id?null:post.id); setCTxt(""); }} style={{ display:"flex", alignItems:"center", gap:5, background:activeComment===post.id?`${G.purpleLight}15`:"transparent", border:`1px solid ${activeComment===post.id?G.purpleLight+"55":G.borderB}`, borderRadius:20, padding:"5px 11px", color:activeComment===post.id?G.purpleLight:G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, cursor:"pointer" }}>
                💬 {comments.length}
              </button>
              <button onClick={()=>showToast("💬 DM feature coming soon")} style={{ marginLeft:"auto", background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:20, padding:"5px 11px", color:G.textMid, fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, cursor:"pointer" }}>✉️ DM</button>
            </div>

            {activeComment === post.id && (
              <div style={{ borderTop:`1px solid ${G.borderB}`, padding:"11px 13px" }}>
                {comments.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    {comments.map((c, i) => (
                      <div key={i} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                        <AvatarBadge initials={c.av} size={26}/>
                        <div style={{ flex:1, background:"rgba(0,0,0,0.3)", borderRadius:8, padding:"6px 10px" }}>
                          <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, color:G.gold, textTransform:"uppercase", marginBottom:2 }}>{c.user} · <span style={{ color:G.textDim, fontSize:9 }}>{c.time}</span></div>
                          <div style={{ fontFamily:FONT.body, fontSize:12, color:G.text, letterSpacing:0.3 }}>{c.txt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display:"flex", gap:8 }}>
                  <input value={cTxt} onChange={e=>setCTxt(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") submitComment(post.id); }} placeholder="ADD A COMMENT..." style={{ flex:1, background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:20, padding:"8px 13px", color:"#fff", fontSize:12, outline:"none", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" }}/>
                  <button onClick={()=>submitComment(post.id)} style={{ width:38, height:38, borderRadius:"50%", background:cTxt.trim()?`linear-gradient(135deg,${G.gold},${G.goldDark})`:"rgba(255,255,255,0.06)", border:"none", color:cTxt.trim()?"#0A0810":G.textDim, cursor:cTxt.trim()?"pointer":"default", fontSize:16, flexShrink:0 }}>↑</button>
                </div>
              </div>
            )}
          </ChromeCard>
        );
      })}

      {showPost && (
        <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.95)", zIndex:300, display:"flex", alignItems:"flex-end" }} onClick={()=>setShowPost(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"16px 16px 0 0", padding:"22px 18px 0", border:`1px solid ${G.border}`, borderBottom:"none", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)", overflowY:"auto", maxHeight:"85vh" }}>
            <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"0 auto 18px" }}/>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:14 }}>SHARE WITH THE SQUAD</div>

            {/* Post type selector */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {[{id:"post",l:"📢 POST"},{id:"pr",l:"🏆 PR"},{id:"milestone",l:"⭐ MILESTONE"},{id:"challenge",l:"⚔️ CHALLENGE"}].map(t => (
                <button key={t.id} onClick={()=>setNewType(t.id)} style={{ flex:"1 1 calc(50% - 3px)", padding:"8px 4px", borderRadius:6, border:`1px solid ${newType===t.id?G.gold:G.borderB}`, background:newType===t.id?`${G.gold}18`:"transparent", color:newType===t.id?G.gold:G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
              ))}
            </div>

            {newType === "challenge" ? (
              <div>
                <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>CHALLENGE TYPE</div>
                <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                  {[{id:"pr",l:"🏋️ PR"},{id:"vol",l:"📦 VOLUME"},{id:"sessions",l:"📅 SESSIONS"}].map(t => (
                    <button key={t.id} onClick={()=>setNewChalType(t.id)} style={{ flex:1, padding:"8px 4px", borderRadius:6, border:`1px solid ${newChalType===t.id?"#00D4FF":G.borderB}`, background:newChalType===t.id?"rgba(0,212,255,0.12)":"transparent", color:newChalType===t.id?"#00D4FF":G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
                  ))}
                </div>
                {newChalType === "pr" && (
                  <input value={newChalExercise} onChange={e=>setNewChalExercise(e.target.value)} placeholder="EXERCISE (E.G. BARBELL BENCH PRESS)" style={{ ...inp, width:"100%", boxSizing:"border-box", marginBottom:10 }}/>
                )}
                <input type="number" inputMode="decimal" value={newChalTarget} onChange={e=>setNewChalTarget(e.target.value)} placeholder={newChalType==="pr" ? "TARGET 1RM (LBS)" : newChalType==="vol" ? "TARGET VOLUME (LBS)" : "TARGET SESSIONS"} style={{ ...inp, width:"100%", boxSizing:"border-box", marginBottom:13 }}/>
                <NeonBtn onClick={submitChallenge} full>LAUNCH CHALLENGE ◆</NeonBtn>
              </div>
            ) : (
              <>
                {newType !== "post" && (
                  <input value={newTag} onChange={e=>setNewTag(e.target.value)} placeholder={newType==="pr" ? "E.G. 315LBS DEADLIFT" : "E.G. 100 SESSIONS"} style={{ ...inp, width:"100%", boxSizing:"border-box", marginBottom:10 }}/>
                )}
                <textarea value={newTxt} onChange={e=>setNewTxt(e.target.value)} placeholder="WHAT DID YOU CRUSH TODAY..." style={{ width:"100%", padding:"12px 13px", borderRadius:7, background:"rgba(0,0,0,0.5)", border:`1px solid ${G.borderB}`, color:"#fff", fontSize:13, outline:"none", resize:"none", height:90, boxSizing:"border-box", lineHeight:1.5, marginBottom:13, fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" }}/>
                <NeonBtn onClick={submitPost} full>POST TO SQUAD ◆</NeonBtn>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AiCoachModal({ profile, sessions, muscleScores, onClose }) {
  const [state, setState] = useState("idle"); // idle | loading | result | error
  const [result, setResult] = useState(null);

  const fetchCoach = async () => {
    setState("loading");
    try {
      const { data, error } = await supabase.functions.invoke("ai-coach", {
        body: { sessions, profile, muscleScores },
      });
      if (error || data?.error) throw new Error(error?.message || data?.error);
      setResult(data);
      setState("result");
    } catch {
      setState("error");
    }
  };

  useEffect(() => { fetchCoach(); }, []); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  const typeColors = { workout: G.gold, recovery: G.blue, nutrition: G.green };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:400, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.gold}44`, borderBottom:"none", maxHeight:"88vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)" }}>

        {/* Handle bar */}
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"14px auto 0" }}/>

        {/* Header */}
        <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:G.purpleGlow, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>AI COACH</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Powered by Claude · Personalized for you</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontSize:18, padding:"4px 6px", flexShrink:0 }}>✕</button>
        </div>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.gold}44,transparent)`, marginBottom:18 }}/>

        {/* Loading */}
        {state === "loading" && (
          <div style={{ padding:"48px 18px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:14 }}>🤖</div>
            <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:G.gold, textTransform:"uppercase", marginBottom:8 }}>ANALYZING YOUR TRAINING...</div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>Claude is reviewing your sessions & muscle data</div>
            <div style={{ width:160, height:3, background:"rgba(255,255,255,0.07)", borderRadius:2, margin:"20px auto 0", overflow:"hidden" }}>
              <div style={{ height:"100%", width:"60%", background:`linear-gradient(90deg,${G.purple},${G.gold})`, borderRadius:2, animation:"scanLine 1.5s ease-in-out infinite" }}/>
            </div>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div style={{ padding:"32px 18px", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>⚠️</div>
            <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:G.red, textTransform:"uppercase", marginBottom:8 }}>COACH UNAVAILABLE</div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1, marginBottom:20 }}>Check your connection and try again.</div>
            <NeonBtn onClick={fetchCoach} full>RETRY</NeonBtn>
          </div>
        )}

        {/* Result */}
        {state === "result" && result && (
          <div style={{ padding:"0 18px" }}>

            {/* Greeting */}
            <div style={{ background:`linear-gradient(135deg,${G.purple}33,${G.purpleBright}22)`, border:`1px solid ${G.purpleLight}44`, borderRadius:12, padding:"16px", marginBottom:14 }}>
              <div style={{ fontFamily:FONT.body, fontSize:14, color:G.text, letterSpacing:0.5, lineHeight:1.6 }}>{result.greeting}</div>
            </div>

            {/* Today's focus */}
            <ChromeCard gold glow style={{ padding:"14px 16px", marginBottom:14 }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>TODAY'S RECOMMENDED FOCUS</div>
              <div style={{ fontFamily:FONT.display, fontSize:26, color:G.gold, letterSpacing:3, textShadow:G.goldGlow2, textTransform:"uppercase" }}>{result.todayFocus}</div>
            </ChromeCard>

            {/* Recommendations */}
            <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:3, color:G.textMid, textTransform:"uppercase", marginBottom:10 }}>YOUR PERSONALIZED PLAN</div>
            {(result.recommendations || []).map((rec, i) => {
              const col = typeColors[rec.type] || G.gold;
              return (
                <ChromeCard key={i} style={{ padding:"13px 14px", marginBottom:9, borderLeft:`3px solid ${col}` }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ fontSize:20, flexShrink:0 }}>{rec.icon}</div>
                    <div>
                      <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:col, textTransform:"uppercase", marginBottom:4 }}>{rec.title}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.5, lineHeight:1.55 }}>{rec.text}</div>
                    </div>
                  </div>
                </ChromeCard>
              );
            })}

            {/* Motivational */}
            <div style={{ textAlign:"center", padding:"16px 0 4px" }}>
              <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:3, color:"#fff", textTransform:"uppercase", lineHeight:1.4 }}>{result.motivational}</div>
            </div>

            {/* Refresh */}
            <NeonBtn onClick={fetchCoach} full outline style={{ marginTop:16 }}>🔄 REFRESH COACHING</NeonBtn>
          </div>
        )}
      </div>
    </div>
  );
}

function GoalsModal({ sessions, profile, onClose }) {
  const totalVol = sessions.reduce((a, s) => a + (s.vol || 0), 0);
  const streak = profile?.streak || 0;
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_goals") || "{}"); } catch { return {}; }
  });
  const [editing, setEditing] = useState(null);
  const [tmp, setTmp] = useState("");

  const saveGoal = (key) => {
    const val = parseInt(tmp, 10);
    if (!isNaN(val) && val > 0) {
      const next = { ...goals, [key]: val };
      setGoals(next);
      localStorage.setItem("sfc_goals", JSON.stringify(next));
    }
    setEditing(null);
  };

  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  const recentCount = sessions.filter(s => s.createdAt && new Date(s.createdAt) >= fourWeeksAgo).length;
  const weeklyAvg = +(recentCount / 4).toFixed(1);

  const items = [
    { key:"weekly", ico:"📅", label:"WEEKLY SESSIONS", current:weeklyAvg, target:goals.weekly||4, unit:"/wk", col:G.gold, hint:"avg last 4 weeks" },
    { key:"volume", ico:"⚡", label:"VOLUME MILESTONE", current:+(totalVol/1000).toFixed(1), target:goals.volume||100, unit:"K lbs", col:G.purpleLight, hint:`${Math.round(totalVol).toLocaleString()} lbs total` },
    { key:"streak", ico:"🔥", label:"STREAK TARGET", current:streak, target:goals.streak||30, unit:" days", col:G.green, hint:"current streak" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:400, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.gold}44`, borderBottom:"none", maxHeight:"88vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)" }}>
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"14px auto 0" }}/>
        <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:G.goldGlow, flexShrink:0 }}>🎯</div>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>GOALS</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Set targets · Track progress</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontSize:18, padding:"4px 6px", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.gold}44,transparent)`, marginBottom:18 }}/>
        <div style={{ padding:"0 18px" }}>
          {items.map(item => {
            const pct = Math.min(100, (item.current / item.target) * 100);
            const done = item.current >= item.target;
            return (
              <ChromeCard key={item.key} style={{ padding:"14px", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ fontSize:22 }}>{item.ico}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{item.label}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>{item.hint}</div>
                  </div>
                  {done
                    ? <Chip label="ACHIEVED ✓" color={G.green} small/>
                    : <div style={{ fontFamily:FONT.display, fontSize:12, color:item.col }}>{item.current}{item.unit} / {item.target}{item.unit}</div>}
                </div>
                <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2, marginBottom:8, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${item.col}99,${item.col})`, borderRadius:2, transition:"width 0.4s ease", boxShadow:`0 0 6px ${item.col}66` }}/>
                </div>
                {editing === item.key ? (
                  <div style={{ display:"flex", gap:8 }}>
                    <input autoFocus value={tmp} onChange={e=>setTmp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")saveGoal(item.key);if(e.key==="Escape")setEditing(null);}} type="number" placeholder={`Target (e.g. ${item.target})`} style={{ flex:1, background:"rgba(0,0,0,0.4)", border:`1px solid ${item.col}66`, borderRadius:5, padding:"7px 10px", color:"#fff", fontFamily:FONT.body, fontSize:12, outline:"none" }}/>
                    <button onClick={()=>saveGoal(item.key)} style={{ padding:"7px 14px", borderRadius:5, background:item.col, border:"none", color:"#0A0810", fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer" }}>SAVE</button>
                    <button onClick={()=>setEditing(null)} style={{ padding:"7px 10px", borderRadius:5, background:"transparent", border:`1px solid ${G.borderB}`, color:G.textMid, fontFamily:FONT.body, fontSize:11, cursor:"pointer" }}>✕</button>
                  </div>
                ) : (
                  <button onClick={()=>{setEditing(item.key);setTmp(String(item.target));}} style={{ background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"6px 12px", color:G.textMid, fontFamily:FONT.body, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>✏️ EDIT TARGET</button>
                )}
              </ChromeCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function WeeklyReportModal({ sessions, muscleScores, onClose }) {
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setHours(0, 0, 0, 0);
  startOfThisWeek.setDate(now.getDate() - dayOfWeek);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const thisSessions = sessions.filter(s => s.createdAt && new Date(s.createdAt) >= startOfThisWeek);
  const lastSessions = sessions.filter(s => {
    if (!s.createdAt) return false;
    const d = new Date(s.createdAt);
    return d >= startOfLastWeek && d < startOfThisWeek;
  });

  const thisVol = thisSessions.reduce((a, s) => a + (s.vol || 0), 0);
  const lastVol = lastSessions.reduce((a, s) => a + (s.vol || 0), 0);
  const thisSets = thisSessions.reduce((a, s) => a + (s.sets || 0), 0);
  const volDiff = lastVol > 0 ? Math.round(((thisVol - lastVol) / lastVol) * 100) : null;

  const exCounts = {};
  thisSessions.forEach(s => (s.exs || []).forEach(ex => { if (ex.name) exCounts[ex.name] = (exCounts[ex.name] || 0) + 1; }));
  const topEx = Object.entries(exCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
  const topMuscle = Object.entries(muscleScores).sort(([, a], [, b]) => b - a)[0]?.[0];

  const DAYS = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const daysWithSession = new Set(thisSessions.map(s => (new Date(s.createdAt).getDay() + 6) % 7));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:400, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.purpleLight}44`, borderBottom:"none", maxHeight:"88vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)" }}>
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"14px auto 0" }}/>
        <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${G.purpleLight},${G.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:G.purpleGlow, flexShrink:0 }}>📋</div>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>WEEKLY REPORT</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Current week · Mon → Sun</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontSize:18, padding:"4px 6px", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.purpleLight}44,transparent)`, marginBottom:18 }}/>
        <div style={{ padding:"0 18px" }}>
          <ChromeCard style={{ padding:"14px", marginBottom:12 }}>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>THIS WEEK</div>
            <div style={{ display:"flex", gap:5, justifyContent:"space-between" }}>
              {DAYS.map((d, i) => {
                const active = daysWithSession.has(i);
                const today = i === dayOfWeek;
                return (
                  <div key={d} style={{ flex:1, textAlign:"center" }}>
                    <div style={{ width:"100%", aspectRatio:"1", borderRadius:6, background: active ? `linear-gradient(135deg,${G.gold},${G.goldDark})` : today ? `${G.gold}18` : "rgba(255,255,255,0.05)", border:`1px solid ${active?G.gold:today?G.gold+"44":G.borderB}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, marginBottom:4, boxShadow:active?G.goldGlow2:"none" }}>{active ? "✓" : today ? "·" : ""}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:8, color:active?G.gold:G.textDim, letterSpacing:1 }}>{d}</div>
                  </div>
                );
              })}
            </div>
          </ChromeCard>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
            {[
              { l:"SESSIONS", v:String(thisSessions.length), ico:"🏋️" },
              { l:"VOLUME", v:`${+(thisVol/1000).toFixed(1)}K`, ico:"⚡" },
              { l:"SETS", v:String(thisSets), ico:"💪" },
            ].map(s => <StatPill key={s.l} label={s.l} value={s.v} icon={s.ico}/>)}
          </div>
          {lastSessions.length > 0 && volDiff !== null && (
            <ChromeCard style={{ padding:"12px 14px", marginBottom:12, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ fontSize:22 }}>{volDiff >= 0 ? "📈" : "📉"}</div>
              <div>
                <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:volDiff >= 0 ? G.green : G.red, textTransform:"uppercase" }}>{volDiff >= 0 ? "+" : ""}{volDiff}% VS LAST WEEK</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>Last week: {lastSessions.length} sessions · {Math.round(lastVol).toLocaleString()} lbs</div>
              </div>
            </ChromeCard>
          )}
          {topEx && (
            <ChromeCard style={{ padding:"12px 14px", marginBottom:10, borderLeft:`3px solid ${G.gold}` }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>TOP EXERCISE THIS WEEK</div>
              <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>{topEx}</div>
            </ChromeCard>
          )}
          {topMuscle && (
            <ChromeCard style={{ padding:"12px 14px", marginBottom:10, borderLeft:`3px solid ${G.purpleLight}` }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>MOST TRAINED MUSCLE (ALL TIME)</div>
              <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:G.purpleLight, textTransform:"uppercase" }}>{MUSCLE_LABELS[topMuscle] || topMuscle}</div>
            </ChromeCard>
          )}
          {thisSessions.length === 0 && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>📋</div>
              <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>NO SESSIONS THIS WEEK YET</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1, marginTop:6 }}>Log your first workout to see your weekly report.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountabilityModal({ sessions, profile, onClose }) {
  const [pledge, setPledge] = useState(() => {
    try { return parseInt(localStorage.getItem("sfc_pledge") || "4", 10); } catch { return 4; }
  });
  const [editing, setEditing] = useState(false);

  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  const thisWeek = sessions.filter(s => s.createdAt && new Date(s.createdAt) >= startOfWeek);
  const completed = thisWeek.length;
  const pct = Math.min(100, (completed / pledge) * 100);
  const onTrack = completed >= Math.floor(((dayOfWeek + 1) / 7) * pledge);

  const savePledge = (val) => {
    const n = Math.max(1, Math.min(7, val));
    setPledge(n);
    localStorage.setItem("sfc_pledge", String(n));
    setEditing(false);
  };

  const msgs = [
    "Every rep is a promise kept to yourself.",
    "Consistency beats intensity every time.",
    "Show up. The results take care of themselves.",
    "Your future self is counting on you.",
    "Champions are built in the sessions nobody sees.",
  ];
  const msg = msgs[(profile?.sessions_count || 0) % msgs.length];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:400, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.green}44`, borderBottom:"none", maxHeight:"88vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)" }}>
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"14px auto 0" }}/>
        <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${G.green}22`, border:`1px solid ${G.green}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🤝</div>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>ACCOUNTABILITY</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Commit · Track · Deliver</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontSize:18, padding:"4px 6px", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.green}44,transparent)`, marginBottom:18 }}/>
        <div style={{ padding:"0 18px" }}>
          <ChromeCard gold style={{ padding:"18px", marginBottom:14, textAlign:"center" }}>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>YOUR WEEKLY PLEDGE</div>
            {editing ? (
              <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:4 }}>
                {[1,2,3,4,5,6,7].map(n => (
                  <button key={n} onClick={()=>savePledge(n)} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${n===pledge?G.gold:G.borderB}`, background:n===pledge?`${G.gold}22`:"transparent", color:n===pledge?G.gold:"#fff", fontFamily:FONT.display, fontSize:16, cursor:"pointer" }}>{n}</button>
                ))}
              </div>
            ) : (
              <>
                <div style={{ fontFamily:FONT.display, fontSize:72, color:G.gold, letterSpacing:-2, lineHeight:1, textShadow:G.goldGlow }}>{pledge}</div>
                <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:4, color:"#fff", marginBottom:14 }}>DAYS / WEEK</div>
                <button onClick={()=>setEditing(true)} style={{ background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"6px 16px", color:G.textMid, fontFamily:FONT.body, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>✏️ CHANGE PLEDGE</button>
              </>
            )}
          </ChromeCard>
          <ChromeCard style={{ padding:"14px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>THIS WEEK</div>
              <Chip label={onTrack ? "ON TRACK ✓" : "BEHIND"} color={onTrack ? G.green : G.red} small/>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"baseline", marginBottom:10 }}>
              <div style={{ fontFamily:FONT.display, fontSize:40, color:completed >= pledge ? G.green : "#fff", lineHeight:1 }}>{completed}</div>
              <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:1 }}>/ {pledge} sessions pledged</div>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:completed>=pledge?`linear-gradient(90deg,${G.green}99,${G.green})`:`linear-gradient(90deg,${G.gold}99,${G.gold})`, borderRadius:3, transition:"width 0.4s ease" }}/>
            </div>
          </ChromeCard>
          <div style={{ background:`${G.green}08`, border:`1px solid ${G.green}22`, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
            <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.green, textTransform:"uppercase", lineHeight:1.5 }}>{msg}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthConnectModal({ onClose }) {
  const [status, setStatus] = useState("idle"); // idle | scanning | connected | error | unsupported
  const [heartRate, setHeartRate] = useState(null);
  const [deviceName, setDeviceName] = useState(() => {
    try { return localStorage.getItem("sfc_ble_device") || null; } catch { return null; }
  });
  const [errorMsg, setErrorMsg] = useState("");
  const charRef = useRef(null);
  const deviceRef = useRef(null);

  const supported = typeof navigator !== "undefined" && !!navigator.bluetooth;

  const parseHeartRate = (value) => {
    const flags = value.getUint8(0);
    return (flags & 0x01) ? value.getUint16(1, true) : value.getUint8(1);
  };

  const connect = async () => {
    if (!supported) { setStatus("unsupported"); return; }
    setStatus("scanning"); setErrorMsg("");
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: ["battery_service", "device_information"],
      });
      deviceRef.current = device;
      device.addEventListener("gattserverdisconnected", () => {
        setStatus("idle"); setHeartRate(null);
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService("heart_rate");
      const char = await service.getCharacteristic("heart_rate_measurement");
      charRef.current = char;
      await char.startNotifications();
      char.addEventListener("characteristicvaluechanged", (e) => {
        setHeartRate(parseHeartRate(e.target.value));
      });
      const name = device.name || "BLE Device";
      setDeviceName(name);
      localStorage.setItem("sfc_ble_device", name);
      setStatus("connected");
    } catch (e) {
      if (e.name === "NotFoundError") { setStatus("idle"); return; } // user cancelled
      setErrorMsg(e.message || "Connection failed");
      setStatus("error");
    }
  };

  const disconnect = async () => {
    if (charRef.current) { try { await charRef.current.stopNotifications(); } catch { /* ignore */ } }
    if (deviceRef.current?.gatt?.connected) deviceRef.current.gatt.disconnect();
    setStatus("idle"); setHeartRate(null);
  };

  useEffect(() => () => { disconnect(); }, []);

  const hrColor = heartRate
    ? heartRate > 160 ? G.red : heartRate > 120 ? G.gold : G.green
    : G.textMid;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:400, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.blue}44`, borderBottom:"none", maxHeight:"88vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)" }}>
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"14px auto 0" }}/>
        <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`${G.blue}22`, border:`1px solid ${G.blue}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>⌚</div>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>HEALTH CONNECT</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>BLE heart rate · fitness devices</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontSize:18, padding:"4px 6px", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.blue}44,transparent)`, marginBottom:18 }}/>

        <div style={{ padding:"0 18px" }}>
          {/* Live heart rate display */}
          {status === "connected" && (
            <ChromeCard style={{ padding:"20px", marginBottom:14, textAlign:"center", border:`1px solid ${hrColor}44` }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>LIVE HEART RATE</div>
              <div style={{ fontFamily:FONT.display, fontSize:80, letterSpacing:-2, lineHeight:1, color:hrColor, textShadow:`0 0 20px ${hrColor}88` }}>
                {heartRate ?? "—"}
              </div>
              <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:3, color:hrColor, marginBottom:12 }}>BPM</div>
              <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>
                {heartRate ? (heartRate > 160 ? "⚡ HIGH INTENSITY" : heartRate > 120 ? "🔥 MODERATE" : "💚 RESTING ZONE") : "Waiting for data…"}
              </div>
              <NeonBtn onClick={disconnect} full outline color={G.red} small>DISCONNECT</NeonBtn>
            </ChromeCard>
          )}

          {/* Device status */}
          {status === "connected" && (
            <ChromeCard style={{ padding:"12px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:G.green, boxShadow:`0 0 8px ${G.green}`, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{deviceName}</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>Connected via Bluetooth</div>
              </div>
            </ChromeCard>
          )}

          {/* Idle / scan prompt */}
          {(status === "idle" || status === "error") && (
            <>
              {deviceName && status === "idle" && (
                <ChromeCard style={{ padding:"12px 14px", marginBottom:12, display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:G.textDim, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>{deviceName}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, textTransform:"uppercase" }}>Last paired device · not connected</div>
                  </div>
                </ChromeCard>
              )}
              {status === "error" && (
                <ChromeCard style={{ padding:"12px 14px", marginBottom:12, borderLeft:`3px solid ${G.red}` }}>
                  <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.red, textTransform:"uppercase", marginBottom:4 }}>CONNECTION FAILED</div>
                  <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:0.5 }}>{errorMsg}</div>
                </ChromeCard>
              )}
              <NeonBtn onClick={connect} full style={{ marginBottom:16 }}>
                {deviceName ? "🔄 RECONNECT DEVICE" : "🔍 SCAN FOR DEVICES"}
              </NeonBtn>
              <ChromeCard style={{ padding:"14px", marginBottom:12 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>COMPATIBLE DEVICES</div>
                {[
                  { ico:"❤️", name:"Heart Rate Monitors", eg:"Polar H10, Garmin HRM, Wahoo TICKR" },
                  { ico:"⌚", name:"Smartwatches", eg:"Garmin, Polar, Suunto (BLE HR mode)" },
                  { ico:"🚴", name:"Fitness Equipment", eg:"BLE-enabled bikes, rowers, treadmills" },
                ].map(d => (
                  <div key={d.name} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ fontSize:18, flexShrink:0 }}>{d.ico}</div>
                    <div>
                      <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, color:"#fff", textTransform:"uppercase" }}>{d.name}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:0.5 }}>{d.eg}</div>
                    </div>
                  </div>
                ))}
              </ChromeCard>
            </>
          )}

          {/* Scanning */}
          {status === "scanning" && (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>📡</div>
              <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:G.blue, textTransform:"uppercase", marginBottom:8 }}>SCANNING…</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>Select your device from the browser prompt</div>
            </div>
          )}

          {/* Not supported */}
          {status === "unsupported" && (
            <ChromeCard style={{ padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>⚠️</div>
              <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:G.gold, textTransform:"uppercase", marginBottom:8 }}>BROWSER NOT SUPPORTED</div>
              <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.5, lineHeight:1.6, marginBottom:16 }}>Web Bluetooth requires Chrome or Edge on Android or desktop. Safari and Firefox do not support it.</div>
              <Chip label="Use Chrome or Edge" color={G.blue}/>
            </ChromeCard>
          )}

          {/* Requirements note */}
          {status !== "unsupported" && status !== "scanning" && (
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, textAlign:"center", lineHeight:1.6 }}>
              Requires Chrome or Edge · Bluetooth must be enabled · Tap Scan, then select your device from the browser prompt
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardModal({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const { data: profiles, error: e } = await supabase
        .from("profiles")
        .select("id, username, avatar_initials, points, streak, sessions_count")
        .order("points", { ascending: false });
      if (e) { setError(e.message); return; }
      setData(profiles || []);
    } catch (err) {
      setError(err?.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const totalUsers    = data?.length || 0;
  const totalSessions = data?.reduce((a, p) => a + (p.sessions_count || 0), 0) || 0;
  const totalPoints   = data?.reduce((a, p) => a + (p.points || 0), 0) || 0;
  const activeUsers   = data?.filter(p => (p.sessions_count || 0) > 0).length || 0;
  const streakUsers   = data?.filter(p => (p.streak || 0) > 0).length || 0;
  const avgSessions   = totalUsers > 0 ? (totalSessions / totalUsers).toFixed(1) : "0";
  const topUser       = data?.[0];

  const overviewStats = [
    { l:"TOTAL USERS",   v: String(totalUsers),    ico:"👥" },
    { l:"ACTIVE USERS",  v: String(activeUsers),   ico:"🏋️" },
    { l:"TOTAL SESSIONS",v: String(totalSessions), ico:"📅" },
    { l:"TOTAL POINTS",  v: totalPoints >= 1000 ? `${(totalPoints/1000).toFixed(1)}K` : String(totalPoints), ico:"⚡" },
    { l:"AVG SESSIONS",  v: avgSessions,           ico:"📈" },
    { l:"ON STREAKS",    v: String(streakUsers),   ico:"🔥" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.98)", zIndex:500, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${G.purple}44,rgba(0,0,0,0.8))`, borderBottom:`1px solid ${G.gold}33`, padding:"16px 18px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:G.goldGlow, flexShrink:0 }}>👑</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:G.gold, textTransform:"uppercase", textShadow:G.goldGlow2 }}>ADMIN DASHBOARD</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Social Fit Club · Platform Analytics</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:8, color:G.textMid, cursor:"pointer", fontSize:16, padding:"6px 10px" }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"18px 18px 48px", maxWidth:480, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:G.gold, textTransform:"uppercase" }}>LOADING DATA...</div>
          </div>
        )}
        {error && (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:G.red, textTransform:"uppercase", marginBottom:12 }}>FAILED TO LOAD</div>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, marginBottom:20 }}>{error}</div>
            <NeonBtn onClick={load} full>RETRY</NeonBtn>
          </div>
        )}

        {data && (
          <>
            {/* Overview grid */}
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>PLATFORM OVERVIEW</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
              {overviewStats.map(s => (
                <ChromeCard key={s.l} style={{ padding:"12px 10px", textAlign:"center" }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{s.ico}</div>
                  <div style={{ fontFamily:FONT.display, fontSize:20, color:G.gold, letterSpacing:1 }}>{s.v}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{s.l}</div>
                </ChromeCard>
              ))}
            </div>

            {/* Engagement bar */}
            {totalUsers > 0 && (
              <>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>ENGAGEMENT</div>
                <ChromeCard style={{ padding:"14px", marginBottom:18 }}>
                  {[
                    { l:"ACTIVATION RATE", pct: Math.round((activeUsers/totalUsers)*100), col:G.green, sub:`${activeUsers} of ${totalUsers} users have logged a session` },
                    { l:"STREAK RETENTION", pct: Math.round((streakUsers/totalUsers)*100), col:G.gold, sub:`${streakUsers} users currently on a streak` },
                    { l:"CHURN (0 SESSIONS)", pct: Math.round(((totalUsers-activeUsers)/totalUsers)*100), col:G.red, sub:`${totalUsers-activeUsers} users never logged a workout` },
                  ].map(row => (
                    <div key={row.l} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, color:"#fff", textTransform:"uppercase" }}>{row.l}</div>
                        <div style={{ fontFamily:FONT.display, fontSize:13, color:row.col }}>{row.pct}%</div>
                      </div>
                      <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:2, overflow:"hidden", marginBottom:3 }}>
                        <div style={{ height:"100%", width:`${row.pct}%`, background:row.col, borderRadius:2, transition:"width 0.6s ease" }}/>
                      </div>
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:0.5 }}>{row.sub}</div>
                    </div>
                  ))}
                </ChromeCard>
              </>
            )}

            {/* Top performer */}
            {topUser && (
              <>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>TOP PERFORMER</div>
                <ChromeCard gold glow style={{ padding:"14px 16px", marginBottom:18, display:"flex", gap:12, alignItems:"center" }}>
                  <AvatarBadge initials={topUser.avatar_initials || "?"} size={48} gold/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>{topUser.username}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:3 }}>
                      {topUser.points} pts · {topUser.sessions_count} sessions · {topUser.streak}d streak
                    </div>
                  </div>
                  <div style={{ fontSize:28 }}>🥇</div>
                </ChromeCard>
              </>
            )}

            {/* Full user table */}
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>ALL USERS ({totalUsers})</div>
            <ChromeCard style={{ padding:0, overflow:"hidden", marginBottom:18 }}>
              {/* Table header */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 60px 54px 44px", gap:0, padding:"8px 12px", background:"rgba(0,0,0,0.4)", borderBottom:`1px solid ${G.borderB}` }}>
                {["ATHLETE","PTS","SESS","STRK"].map(h => (
                  <div key={h} style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:2, textTransform:"uppercase", textAlign: h==="ATHLETE"?"left":"right" }}>{h}</div>
                ))}
              </div>
              {data.map((p, i) => (
                <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 60px 54px 44px", gap:0, padding:"9px 12px", borderBottom: i < data.length-1 ? `1px solid ${G.borderB}` : "none", background: i===0 ? `${G.gold}06` : "transparent", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", minWidth:0 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:10, color: i===0?G.gold:G.textDim, letterSpacing:1, flexShrink:0, width:16 }}>{i+1}</div>
                    <AvatarBadge initials={p.avatar_initials || "?"} size={28} gold={i===0}/>
                    <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, color: i===0?"#fff":G.textMid, textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.username || "—"}</div>
                  </div>
                  <div style={{ fontFamily:FONT.display, fontSize:12, color:G.gold, letterSpacing:1, textAlign:"right" }}>{(p.points||0).toLocaleString()}</div>
                  <div style={{ fontFamily:FONT.display, fontSize:12, color:"#fff", letterSpacing:1, textAlign:"right" }}>{p.sessions_count||0}</div>
                  <div style={{ fontFamily:FONT.display, fontSize:12, color: (p.streak||0)>0?G.green:G.textDim, letterSpacing:1, textAlign:"right" }}>{p.streak||0}d</div>
                </div>
              ))}
              {data.length === 0 && (
                <div style={{ padding:"24px", textAlign:"center", fontFamily:FONT.body, fontSize:12, color:G.textDim }}>No users found.</div>
              )}
            </ChromeCard>
          </>
        )}
      </div>
    </div>
  );
}

function TogglePill({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:44, height:24, borderRadius:12, background: on ? G.gold : "rgba(255,255,255,0.12)", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left: on ? 22 : 3, width:18, height:18, borderRadius:"50%", background: on ? "#0A0810" : G.textDim, transition:"left 0.2s" }}/>
    </div>
  );
}

const NOTIF_KEY = "sfc_notif_prefs";
function loadNotifPrefs() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "null") || { enabled: false, reminderTime: "08:00", streakAlert: true }; }
  catch { return { enabled: false, reminderTime: "08:00", streakAlert: true }; }
}

async function scheduleReminder(prefs, swReg) {
  if (!swReg || !prefs.enabled) return;
  const [h, m] = (prefs.reminderTime || "08:00").split(":").map(Number);
  const now = new Date();
  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next - now;
  swReg.active?.postMessage({ type: "SCHEDULE_NOTIFICATION", id: "daily-reminder", title: "Social Fit Club 💪", body: "Time to train! Log today's session and keep your streak alive.", delay });
}

function NotificationsModal({ onClose, sessions }) {
  const [prefs, setPrefs] = useState(loadNotifPrefs);
  const [permission, setPermission] = useState(() => ("Notification" in window ? Notification.permission : "denied"));
  const [swReg, setSwReg] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(reg => setSwReg(reg)).catch(() => {});
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      const next = { ...prefs, enabled: true };
      setPrefs(next);
      localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      scheduleReminder(next, swReg);
    }
  };

  const save = (updates) => {
    const next = { ...prefs, ...updates };
    setPrefs(next);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
    if (next.enabled && permission === "granted") scheduleReminder(next, swReg);
    if (!next.enabled && swReg) swReg.active?.postMessage({ type: "CANCEL_NOTIFICATION", id: "daily-reminder" });
  };

  const todayKey = new Date().toISOString().slice(0, 10);
  const loggedToday = sessions.some(s => (s.createdAt || "").slice(0, 10) === todayKey);
  const hasStreak = sessions.length > 0;

  const toggle = { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid ${G.borderB}` };
  const label = { fontFamily:FONT.body, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase" };
  const sub = { fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginTop:2 };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)" }}/>
      <div style={{ position:"relative", background:"#0F0E22", borderRadius:"18px 18px 0 0", border:`1px solid ${G.borderB}`, borderBottom:"none", maxHeight:"88vh", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 18px 14px" }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:G.gold }}>NOTIFICATIONS</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        <div style={{ overflowY:"auto", flex:1, padding:"0 18px 32px" }}>

          {/* Permission status */}
          {permission !== "granted" ? (
            <ChromeCard style={{ padding:"16px", marginBottom:18, textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🔔</div>
              <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff", marginBottom:6 }}>ENABLE NOTIFICATIONS</div>
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1, marginBottom:14 }}>
                {permission === "denied" ? "Notifications are blocked. Please allow them in your browser settings, then return here." : "Allow SFC to send workout reminders and streak alerts."}
              </div>
              {permission !== "denied" && <NeonBtn onClick={requestPermission} full>ALLOW NOTIFICATIONS</NeonBtn>}
              {permission === "denied" && <div style={{ fontFamily:FONT.body, fontSize:10, color:G.red, letterSpacing:1 }}>BLOCKED IN BROWSER SETTINGS</div>}
            </ChromeCard>
          ) : (
            <ChromeCard style={{ padding:"12px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:G.green, boxShadow:`0 0 8px ${G.green}`, flexShrink:0 }}/>
              <div style={{ fontFamily:FONT.body, fontSize:11, letterSpacing:1.5, color:G.green, textTransform:"uppercase" }}>NOTIFICATIONS ALLOWED</div>
            </ChromeCard>
          )}

          {/* Today's status */}
          {hasStreak && (
            <ChromeCard style={{ padding:"13px 14px", marginBottom:18, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:22 }}>{loggedToday ? "✅" : "⚠️"}</div>
              <div>
                <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color: loggedToday ? G.green : G.gold, textTransform:"uppercase" }}>
                  {loggedToday ? "TRAINED TODAY — STREAK SAFE" : "NOT TRAINED TODAY — STREAK AT RISK"}
                </div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginTop:2 }}>
                  {loggedToday ? "Great work! Your streak is secured." : "Log a session today to keep your streak alive."}
                </div>
              </div>
            </ChromeCard>
          )}

          {/* Settings — only active if permission granted */}
          <div style={{ opacity: permission === "granted" ? 1 : 0.4, pointerEvents: permission === "granted" ? "auto" : "none" }}>
            <div style={toggle}>
              <div>
                <div style={label}>DAILY REMINDER</div>
                <div style={sub}>Remind me to train every day</div>
              </div>
              <TogglePill on={prefs.enabled} onToggle={()=>save({ enabled: !prefs.enabled })}/>
            </div>

            {prefs.enabled && (
              <div style={{ padding:"13px 0", borderBottom:`1px solid ${G.borderB}` }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={label}>REMINDER TIME</div>
                    <div style={sub}>Daily notification at this time</div>
                  </div>
                  <input
                    type="time"
                    value={prefs.reminderTime}
                    onChange={e=>save({ reminderTime: e.target.value })}
                    style={{ background:"rgba(0,0,0,0.5)", border:`1px solid ${G.gold}55`, borderRadius:6, padding:"6px 10px", color:G.gold, fontSize:15, outline:"none", fontFamily:FONT.mono, letterSpacing:2, colorScheme:"dark" }}/>
                </div>
              </div>
            )}

            <div style={toggle}>
              <div>
                <div style={label}>STREAK ALERTS</div>
                <div style={sub}>Warn me before my streak breaks</div>
              </div>
              <TogglePill on={prefs.streakAlert} onToggle={()=>save({ streakAlert: !prefs.streakAlert })}/>
            </div>
          </div>

          <div style={{ marginTop:18, fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, lineHeight:1.6 }}>
            Notifications are scheduled locally and fire even when SFC is running in the background. They require your browser to remain open.
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroCoachModal({ onClose }) {
  const existing = loadMacroCoach();
  const bodyLog = (() => { try { return JSON.parse(localStorage.getItem("sfc_body_log") || "[]"); } catch { return []; } })();

  const [phase, setPhase] = useState(existing?.setupComplete ? "dashboard" : "setup");
  const [sex, setSex] = useState(existing?.sex || "male");
  const [age, setAge] = useState(existing?.age ? String(existing.age) : "");
  const [heightFt, setHeightFt] = useState(existing?.heightIn ? String(Math.floor(existing.heightIn / 12)) : "");
  const [heightIn2, setHeightIn2] = useState(existing?.heightIn ? String(existing.heightIn % 12) : "");
  const [weightLbs, setWeightLbs] = useState(existing?.weightLbs ? String(existing.weightLbs) : "");
  const [activity, setActivity] = useState(existing?.activityLevel || "moderate");
  const [goal, setGoal] = useState(existing?.goal || "fat_loss");
  const [rate, setRate] = useState(existing?.targetWeeklyChange ?? -0.5);
  const [data, setData] = useState(existing);
  const [checkInWeight, setCheckInWeight] = useState(bodyLog[0]?.weight ? String(bodyLog[0].weight) : "");
  const [checkInPhase, setCheckInPhase] = useState(false);
  const [adjustment, setAdjustment] = useState(null);
  const [setupError, setSetupError] = useState("");
  const [nowMs] = useState(() => Date.now());

  const daysSinceCheckIn = data?.lastAdjustment ? (nowMs - new Date(data.lastAdjustment).getTime()) / 86400000 : 999;
  const canCheckIn = !!(data?.setupComplete && daysSinceCheckIn >= 7);

  const doSetup = () => {
    const a = parseInt(age); const w = parseFloat(weightLbs);
    const h = parseInt(heightFt) * 12 + parseInt(heightIn2 || "0");
    if (!a || a < 10 || a > 100) { setSetupError("Enter a valid age (10–100)"); return; }
    if (!h || h < 48 || h > 96) { setSetupError("Enter a valid height"); return; }
    if (!w || w < 50 || w > 700) { setSetupError("Enter a valid weight"); return; }
    const tdee = calcTDEE(sex, a, h, w, activity);
    const goalDelta = goal === "fat_loss" ? Math.round(rate * -3500 / 7) : goal === "muscle_gain" ? 300 : 0;
    const calories = Math.max(1200, tdee - goalDelta);
    const { protein, fat, carbs } = calcMacrosFromCalories(calories, w);
    const newData = { sex, age:a, heightIn:h, weightLbs:w, activityLevel:activity, goal, targetWeeklyChange:rate,
      tdee, calories, protein, carbs, fat, setupComplete:true,
      lastAdjustment: new Date().toISOString().slice(0,10), weekStartWeight:w, history:[] };
    localStorage.setItem(MACRO_COACH_KEY, JSON.stringify(newData));
    setData(newData); setPhase("dashboard"); setSetupError("");
  };

  const calcAdjustment = () => {
    const w = parseFloat(checkInWeight);
    if (!w || !data) return;
    const daysSince = data.lastAdjustment ? (Date.now() - new Date(data.lastAdjustment).getTime()) / 86400000 : 7;
    const wks = Math.max(daysSince / 7, 0.5);
    const expectedChange = +(data.targetWeeklyChange * wks).toFixed(2);
    const actualChange = +(w - (data.weekStartWeight || data.weightLbs)).toFixed(2);
    const diff = actualChange - expectedChange;
    const dailyAdj = Math.max(-200, Math.min(200, Math.round((-diff * 3500) / 7)));
    const newCal = Math.max(1200, data.calories + dailyAdj);
    const { protein, fat, carbs } = calcMacrosFromCalories(newCal, w);
    setAdjustment({ currentWeight:w, actualChange, expectedChange, dailyAdj, newCal, protein, carbs, fat });
  };

  const applyAdjustment = () => {
    if (!adjustment || !data) return;
    const newData = { ...data, calories:adjustment.newCal, protein:adjustment.protein, carbs:adjustment.carbs, fat:adjustment.fat,
      weightLbs:adjustment.currentWeight, weekStartWeight:adjustment.currentWeight,
      lastAdjustment: new Date().toISOString().slice(0,10),
      history: [...(data.history||[]), { date:new Date().toISOString().slice(0,10), weight:adjustment.currentWeight, calories:adjustment.newCal, adj:adjustment.dailyAdj }].slice(-8) };
    localStorage.setItem(MACRO_COACH_KEY, JSON.stringify(newData));
    setData(newData); setAdjustment(null); setCheckInPhase(false); setCheckInWeight(bodyLog[0]?.weight ? String(bodyLog[0].weight) : "");
  };

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"10px 12px", color:"#fff", fontSize:14, outline:"none", fontFamily:FONT.body, letterSpacing:1, width:"100%", boxSizing:"border-box" };
  const selBtn = (active, col=G.gold) => ({ flex:1, padding:"9px 6px", borderRadius:6, border:`1px solid ${active?col+"88":G.borderB}`, background:active?`${col}18`:"transparent", color:active?col:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" });

  const GOAL_OPTS = [
    { id:"fat_loss", l:"FAT LOSS", ico:"🔥", rates:[-0.5,-0.75,-1.0] },
    { id:"maintenance", l:"MAINTAIN", ico:"⚖️", rates:[0] },
    { id:"muscle_gain", l:"MUSCLE GAIN", ico:"💪", rates:[0.25,0.5] },
  ];
  const ACTIVITY_OPTS = [
    { id:"sedentary", l:"SEDENTARY", sub:"desk job, no exercise" },
    { id:"light", l:"LIGHT", sub:"1–3 days/wk" },
    { id:"moderate", l:"MODERATE", sub:"3–5 days/wk" },
    { id:"active", l:"ACTIVE", sub:"6–7 days/wk" },
    { id:"very_active", l:"VERY ACTIVE", sub:"2× daily or physical job" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.97)", zIndex:800, display:"flex", flexDirection:"column", overflowY:"auto" }}>
      <GridBg/>
      <div style={{ position:"relative", zIndex:1, padding:"24px 18px 40px", maxWidth:480, margin:"0 auto", width:"100%" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:7, padding:"6px 10px", color:G.textMid, cursor:"pointer", fontSize:13 }}>✕</button>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>
            MACRO <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>COACH</span>
          </div>
          {data?.setupComplete && phase==="dashboard" && (
            <button onClick={()=>{ setPhase("setup"); setSetupError(""); }} style={{ marginLeft:"auto", background:"none", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"4px 10px", color:G.textMid, fontFamily:FONT.body, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>RECONFIGURE</button>
          )}
        </div>

        {phase === "setup" && (
          <div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginBottom:18 }}>
              Tell us about yourself and we'll calculate your personalised daily targets using the Mifflin-St Jeor formula.
            </div>

            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>BIOLOGICAL SEX</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <button onClick={()=>setSex("male")} style={selBtn(sex==="male")}>♂ MALE</button>
              <button onClick={()=>setSex("female")} style={selBtn(sex==="female")}>♀ FEMALE</button>
            </div>

            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>AGE</div>
            <input type="number" inputMode="numeric" placeholder="e.g. 28" value={age} onChange={e=>setAge(e.target.value)} style={{ ...inp, marginBottom:16 }}/>

            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>HEIGHT</div>
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              <div style={{ flex:1, position:"relative" }}>
                <input type="number" inputMode="numeric" placeholder="5" value={heightFt} onChange={e=>setHeightFt(e.target.value)} style={{ ...inp }}/>
                <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontFamily:FONT.body, fontSize:10, color:G.textDim, pointerEvents:"none" }}>FT</div>
              </div>
              <div style={{ flex:1, position:"relative" }}>
                <input type="number" inputMode="numeric" placeholder="10" value={heightIn2} onChange={e=>setHeightIn2(e.target.value)} style={{ ...inp }}/>
                <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontFamily:FONT.body, fontSize:10, color:G.textDim, pointerEvents:"none" }}>IN</div>
              </div>
            </div>

            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>CURRENT WEIGHT (LBS)</div>
            <input type="number" inputMode="decimal" placeholder="e.g. 185" value={weightLbs} onChange={e=>setWeightLbs(e.target.value)} style={{ ...inp, marginBottom:16 }}/>

            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>ACTIVITY LEVEL</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
              {ACTIVITY_OPTS.map(a => (
                <button key={a.id} onClick={()=>setActivity(a.id)} style={{ ...selBtn(activity===a.id), display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left", padding:"10px 12px" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2 }}>{a.l}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:activity===a.id?G.gold:G.textDim, letterSpacing:1, textTransform:"none" }}>{a.sub}</div>
                </button>
              ))}
            </div>

            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>GOAL</div>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {GOAL_OPTS.map(g => (
                <button key={g.id} onClick={()=>{ setGoal(g.id); setRate(g.rates[0]); }} style={{ ...selBtn(goal===g.id), flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 4px" }}>
                  <div style={{ fontSize:18 }}>{g.ico}</div>
                  <div style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:1.5 }}>{g.l}</div>
                </button>
              ))}
            </div>

            {goal !== "maintenance" && (
              <>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>TARGET RATE (LBS/WEEK)</div>
                <div style={{ display:"flex", gap:6, marginBottom:16 }}>
                  {GOAL_OPTS.find(g=>g.id===goal)?.rates.map(r => (
                    <button key={r} onClick={()=>setRate(r)} style={selBtn(rate===r)}>{Math.abs(r)} lbs/wk</button>
                  ))}
                </div>
              </>
            )}

            {setupError && <div style={{ fontFamily:FONT.body, fontSize:11, color:G.red, letterSpacing:1, marginBottom:12 }}>⚠ {setupError}</div>}

            <NeonBtn onClick={doSetup} full>CALCULATE MY TARGETS ◆</NeonBtn>
          </div>
        )}

        {phase === "dashboard" && data && (
          <div>
            <ChromeCard gold glow style={{ padding:"20px", marginBottom:14, textAlign:"center" }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:6 }}>DAILY CALORIE TARGET</div>
              <div style={{ fontFamily:FONT.display, fontSize:68, color:G.gold, textShadow:G.goldGlow, letterSpacing:-1, lineHeight:1 }}>{data.calories}</div>
              <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>TDEE: {data.tdee} kcal · {data.goal==="fat_loss"?"DEFICIT":data.goal==="muscle_gain"?"SURPLUS":"MAINTENANCE"}</div>
            </ChromeCard>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
              {[{l:"PROTEIN",v:data.protein,u:"G",col:G.purpleLight},{l:"CARBS",v:data.carbs,u:"G",col:G.gold},{l:"FAT",v:data.fat,u:"G",col:"#FF6B35"}].map(m=>(
                <ChromeCard key={m.l} style={{ padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:28, color:m.col, textShadow:`0 0 8px ${m.col}88`, letterSpacing:0 }}>{m.v}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:m.col, letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{m.u}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>{m.l}</div>
                </ChromeCard>
              ))}
            </div>

            <ChromeCard style={{ padding:"12px 14px", marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>
                    {GOAL_OPTS.find(g=>g.id===data.goal)?.ico} {GOAL_OPTS.find(g=>g.id===data.goal)?.l}
                  </div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginTop:2 }}>
                    {data.goal!=="maintenance" ? `Target: ${Math.abs(data.targetWeeklyChange)} lbs/wk ${data.targetWeeklyChange<0?"loss":"gain"}` : "Maintain current weight"}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, textTransform:"uppercase" }}>Last adjusted</div>
                  <div style={{ fontFamily:FONT.display, fontSize:12, color:G.textMid, letterSpacing:1 }}>{data.lastAdjustment || "Today"}</div>
                </div>
              </div>
            </ChromeCard>

            {!checkInPhase ? (
              <NeonBtn onClick={()=>setCheckInPhase(true)} full disabled={!canCheckIn}>
                {canCheckIn ? "WEEKLY CHECK-IN & ADJUST ◆" : `CHECK-IN AVAILABLE IN ${Math.max(0, 7 - Math.floor(daysSinceCheckIn))} DAYS`}
              </NeonBtn>
            ) : (
              <ChromeCard style={{ padding:"16px", marginBottom:12 }}>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>WEEKLY CHECK-IN</div>
                <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1, marginBottom:10 }}>
                  Enter your current weight. The algorithm will compare your actual progress to your goal and adjust your targets.
                </div>
                <div style={{ position:"relative", marginBottom:12 }}>
                  <input type="number" inputMode="decimal" placeholder="Current weight (lbs)" value={checkInWeight} onChange={e=>setCheckInWeight(e.target.value)} style={{ ...inp }}/>
                </div>
                {adjustment && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                      {[
                        { l:"EXPECTED CHANGE", v:`${adjustment.expectedChange>0?"+":""}${adjustment.expectedChange} lbs`, col:G.textMid },
                        { l:"ACTUAL CHANGE", v:`${adjustment.actualChange>0?"+":""}${adjustment.actualChange} lbs`, col:adjustment.actualChange<=adjustment.expectedChange?G.green:G.red },
                        { l:"CALORIE ADJUSTMENT", v:`${adjustment.dailyAdj>0?"+":""}${adjustment.dailyAdj} cal/day`, col:adjustment.dailyAdj===0?G.textMid:adjustment.dailyAdj>0?G.green:G.gold },
                        { l:"NEW DAILY TARGET", v:`${adjustment.newCal} kcal`, col:G.gold },
                      ].map(s=>(
                        <div key={s.l} style={{ background:`${s.col}08`, border:`1px solid ${s.col}22`, borderRadius:7, padding:"10px" }}>
                          <div style={{ fontFamily:FONT.display, fontSize:14, color:s.col, letterSpacing:1 }}>{s.v}</div>
                          <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginBottom:12 }}>
                      New macros → P: {adjustment.protein}g · C: {adjustment.carbs}g · F: {adjustment.fat}g
                    </div>
                    <NeonBtn onClick={applyAdjustment} full>APPLY NEW TARGETS ◆</NeonBtn>
                  </div>
                )}
                {!adjustment && (
                  <div style={{ display:"flex", gap:8 }}>
                    <NeonBtn onClick={calcAdjustment} full>CALCULATE ADJUSTMENT</NeonBtn>
                    <button onClick={()=>{ setCheckInPhase(false); setAdjustment(null); }} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:7, padding:"10px 14px", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:1, cursor:"pointer" }}>CANCEL</button>
                  </div>
                )}
              </ChromeCard>
            )}

            {(data.history||[]).length > 0 && (
              <div style={{ marginTop:16 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>ADJUSTMENT HISTORY</div>
                {[...(data.history)].reverse().slice(0,4).map((h,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 10px", background:"rgba(255,255,255,0.02)", borderRadius:5, marginBottom:4, border:`1px solid ${G.borderB}` }}>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1 }}>{h.date}</div>
                    <div style={{ display:"flex", gap:12 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:12, color:"#fff", letterSpacing:1 }}>{h.weight} lbs</div>
                      <div style={{ fontFamily:FONT.display, fontSize:12, color:G.gold, letterSpacing:1 }}>{h.calories} kcal</div>
                      {h.adj !== 0 && <div style={{ fontFamily:FONT.display, fontSize:11, color:h.adj>0?G.green:G.red, letterSpacing:1 }}>{h.adj>0?"+":""}{h.adj}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MoreScreen({ showToast, profile, onSignOut, onProfileUpdate, sessions, muscleScores, isAdmin, userId }) {
  const [aiCoachOpen, setAiCoachOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [accountabilityOpen, setAccountabilityOpen] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [macroCoachOpen, setMacroCoachOpen] = useState(false);
  const [formCheckOpen, setFormCheckOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const FEATURES = [
    {id:"merch", l:"SFC MERCH", ico:"👕", desc:"Official gear & member drops", col:G.gold},
    {id:"reports", l:"WEEKLY REPORTS", ico:"📋", desc:"Personalized coaching notes", col:G.purpleLight, hot:true},
    {id:"macro", l:"MACRO COACH", ico:"⚡", desc:"Adaptive calorie & macro targets", col:G.gold, hot:true},
    {id:"health", l:"HEALTH CONNECT", ico:"⌚", desc:"BLE heart rate & fitness devices", col:G.blue, hot:true},
    {id:"ai", l:"AI COACH", ico:"🤖", desc:"Smart daily recommendations", col:G.gold, hot:true},
    {id:"partners", l:"ACCOUNTABILITY", ico:"🤝", desc:"Train together, stay consistent", col:G.green},
    {id:"goals", l:"GOALS", ico:"🎯", desc:"Track your fitness targets", col:G.gold},
    {id:"notif", l:"NOTIFICATIONS", ico:"🔔", desc:"Reminders & streak alerts", col:G.purpleLight, hot:true},
    {id:"form", l:"FORM CHECK", ico:"🏋️", desc:"AI feedback on your lifts", col:G.gold, hot:true},
  ];

  const handleTile = (id) => {
    if (id === "ai") setAiCoachOpen(true);
    else if (id === "goals") setGoalsOpen(true);
    else if (id === "reports") setReportsOpen(true);
    else if (id === "partners") setAccountabilityOpen(true);
    else if (id === "health") setHealthOpen(true);
    else if (id === "notif") setNotifOpen(true);
    else if (id === "macro") setMacroCoachOpen(true);
    else if (id === "form") setFormCheckOpen(true);
    else showToast(`${FEATURES.find(f=>f.id===id)?.ico} ${FEATURES.find(f=>f.id===id)?.l} — COMING SOON`);
  };
  const handleEditProfile = () => setProfileOpen(true);

  return (
    <div style={{ padding:"20px 18px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:30, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:6 }}>
        MORE <span style={{ color:G.gold, textShadow:G.goldGlow2 }}>TOOLS</span>
      </div>
      <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:18 }}>◆ &nbsp;ALL FEATURES</div>
      {aiCoachOpen && <AiCoachModal profile={profile} sessions={sessions} muscleScores={muscleScores} onClose={()=>setAiCoachOpen(false)}/>}
      {goalsOpen && <GoalsModal sessions={sessions} profile={profile} onClose={()=>setGoalsOpen(false)}/>}
      {reportsOpen && <WeeklyReportModal sessions={sessions} muscleScores={muscleScores} onClose={()=>setReportsOpen(false)}/>}
      {accountabilityOpen && <AccountabilityModal sessions={sessions} profile={profile} onClose={()=>setAccountabilityOpen(false)}/>}
      {healthOpen && <HealthConnectModal onClose={()=>setHealthOpen(false)}/>}
      {adminOpen && <AdminDashboardModal onClose={()=>setAdminOpen(false)}/>}
      {notifOpen && <NotificationsModal sessions={sessions} onClose={()=>setNotifOpen(false)}/>}
      {macroCoachOpen && <MacroCoachModal onClose={()=>setMacroCoachOpen(false)}/>}
      {formCheckOpen && <FormCheckModal onClose={()=>setFormCheckOpen(false)}/>}
      {profileOpen && <ProfileModal profile={profile} userId={userId} onClose={()=>setProfileOpen(false)} onSave={onProfileUpdate}/>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:20 }}>
        {FEATURES.map(f => (
          <button key={f.id} onClick={()=>handleTile(f.id)} style={{ background:f.hot?`${f.col}0C`:"rgba(255,255,255,0.03)", border:`1px solid ${f.hot?f.col+"33":G.borderB}`, borderRadius:9, padding:"14px 12px", cursor:"pointer", textAlign:"left", position:"relative", overflow:"hidden" }}>
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
      <ChromeCard gold style={{ padding:"13px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={handleEditProfile}>
        <AvatarBadge initials={profile?.avatar_initials||"ME"} url={profile?.avatar_url||null} size={44} gold/>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{profile?.username||"ATHLETE"}</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginTop:2 }}>{profile?.points||0} pts · MEMBER</div>
        </div>
        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.gold, letterSpacing:2, textTransform:"uppercase", border:`1px solid ${G.gold}44`, borderRadius:6, padding:"4px 8px" }}>EDIT ✎</div>
      </ChromeCard>
      {isAdmin && (
        <div onClick={()=>setAdminOpen(true)} style={{ background:`linear-gradient(135deg,${G.gold}10,${G.purple}08)`, border:`1px solid ${G.gold}44`, borderRadius:10, padding:"12px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer", boxShadow:G.goldGlow2 }}>
          <span style={{ fontSize:18, flexShrink:0 }}>👑</span>
          <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>ADMIN DASHBOARD</div>
          <span style={{ color:G.gold, fontSize:13 }}>›</span>
        </div>
      )}
      {[{l:"PRIVACY & SECURITY",ico:"🔒",col:G.textMid},{l:"HELP & SUPPORT",ico:"❓",col:G.textMid}].map((item)=>(
        <div key={item.l} onClick={()=>showToast(item.l)} style={{ background:`linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(10,8,24,0.8) 100%)`, border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>{item.ico}</span>
          <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:item.col, textTransform:"uppercase" }}>{item.l}</div>
          <span style={{ color:G.textDim, fontSize:13 }}>›</span>
        </div>
      ))}
      <div onClick={()=>setNotifOpen(true)} style={{ background:`linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(10,8,24,0.8) 100%)`, border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🔔</span>
        <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>NOTIFICATION SETTINGS</div>
        <span style={{ color:G.textDim, fontSize:13 }}>›</span>
      </div>
      <div onClick={onSignOut} style={{ background:"rgba(255,61,90,0.07)", border:`1px solid ${G.red}33`, borderRadius:10, padding:"13px 14px", marginTop:4, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🚪</span>
        <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.red, textTransform:"uppercase" }}>SIGN OUT</div>
        <span style={{ color:G.red, fontSize:13, opacity:0.6 }}>›</span>
      </div>
    </div>
  );
}

function ResetPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true); setError(null);
    const { error: e } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (e) setError(e.message);
    else setDone(true);
  };

  const inp = { background:"rgba(0,0,0,0.45)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"13px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.body, letterSpacing:1.5 };

  return (
    <div style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, maxWidth:480, margin:"0 auto" }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
          <div style={{ fontFamily:FONT.display, fontSize:28, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>SET NEW PASSWORD</div>
          <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:1.5, marginTop:6, textTransform:"uppercase" }}>Choose a strong password</div>
        </div>
        {done ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:G.green, textTransform:"uppercase", marginBottom:10 }}>PASSWORD UPDATED</div>
            <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, marginBottom:24 }}>You're all set. Sign in with your new password.</div>
            <button onClick={onDone} style={{ width:"100%", padding:"14px", borderRadius:8, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", color:"#0A0810", fontFamily:FONT.display, fontSize:16, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", boxShadow:G.goldGlow2 }}>CONTINUE TO APP</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} style={inp}/>
            <input type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp}/>
            {error && <div style={{ fontFamily:FONT.body, fontSize:12, color:G.red, letterSpacing:1, textAlign:"center" }}>{error}</div>}
            <button onClick={submit} disabled={loading} style={{ width:"100%", padding:"14px", borderRadius:8, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", color:"#0A0810", fontFamily:FONT.display, fontSize:16, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", boxShadow:G.goldGlow2, opacity:loading?0.7:1 }}>{loading ? "SAVING..." : "UPDATE PASSWORD"}</button>
          </div>
        )}
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
  const [forgotSent, setForgotSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inp = { background:"rgba(0,0,0,0.45)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"13px 14px", color:"#fff", fontSize:14, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.body, letterSpacing:1.5 };

  const sendForgot = async () => {
    if (!email.trim()) { setError("Enter your email first."); return; }
    setLoading(true); setError(null);
    const { error: e } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (e) setError(e.message);
    else setForgotSent(true);
  };

  const resendConfirm = async () => {
    setResendLoading(true);
    await supabase.auth.resend({ type: "signup", email: email.trim() });
    setResendLoading(false);
  };

  const submit = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    setLoading(true); setError(null);
    try {
      if (mode === "signup") {
        const name = displayName.trim().toUpperCase() || email.trim().split("@")[0].toUpperCase();
        const { data, error: e } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { display_name: name.slice(0, 20) } },
        });
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
        <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.6, marginBottom:20 }}>
          We sent a confirmation link to<br/>
          <span style={{ color:G.gold }}>{email}</span><br/>
          Click it to activate your account, then sign in.
        </div>
        <NeonBtn onClick={()=>{ setAwaitingConfirm(false); setMode("signin"); }} full style={{ marginBottom:10 }}>BACK TO SIGN IN</NeonBtn>
        <NeonBtn onClick={resendConfirm} full outline disabled={resendLoading}>{resendLoading ? "SENDING..." : "RESEND CONFIRMATION EMAIL"}</NeonBtn>
      </div>
    </div>
  );

  if (forgotSent) return (
    <div style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
      <GridBg/>
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🔑</div>
        <div style={{ fontFamily:FONT.display, fontSize:26, letterSpacing:4, color:"#fff", marginBottom:10 }}>CHECK YOUR EMAIL</div>
        <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.6, marginBottom:28 }}>
          A password reset link was sent to<br/>
          <span style={{ color:G.gold }}>{email}</span>
        </div>
        <NeonBtn onClick={()=>setForgotSent(false)} full>BACK TO SIGN IN</NeonBtn>
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

        <div style={{ textAlign:"center", marginTop:18, display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={()=>{ setMode(m=>m==="signin"?"signup":"signin"); setError(null); }} style={{ background:"none", border:"none", fontFamily:FONT.body, fontSize:12, letterSpacing:2, color:G.textMid, textTransform:"uppercase", cursor:"pointer" }}>
            {mode==="signin" ? "New here? Create an account" : "Already a member? Sign in"}
          </button>
          {mode==="signin" && (
            <button onClick={sendForgot} disabled={loading} style={{ background:"none", border:"none", fontFamily:FONT.body, fontSize:11, letterSpacing:2, color:G.textDim, textTransform:"uppercase", cursor:"pointer" }}>
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:"100vh", background:"#06060E", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
          <div style={{ fontFamily:"'Bebas Neue','Impact','Arial Black',sans-serif", fontSize:28, letterSpacing:4, color:"#FDB927", textTransform:"uppercase", marginBottom:8 }}>SOMETHING WENT WRONG</div>
          <div style={{ fontFamily:"'Barlow Condensed','Arial Narrow',Arial,sans-serif", fontSize:13, color:"#8B7AA8", letterSpacing:1, marginBottom:24, maxWidth:320 }}>An unexpected error occurred. Reload the page to continue — your saved data won't be lost.</div>
          <button onClick={()=>window.location.reload()} style={{ background:"#FDB927", border:"none", borderRadius:8, padding:"12px 28px", fontFamily:"'Bebas Neue','Impact','Arial Black',sans-serif", fontSize:16, letterSpacing:3, color:"#0A0810", cursor:"pointer", textTransform:"uppercase" }}>RELOAD APP</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const _D = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("demo") === "1";
const _DS = [{id:"d1",name:"PUSH DAY",exs:[{id:1,name:"Barbell Bench Press",sets:[{r:"5",w:"185",type:"working"},{r:"5",w:"185",type:"working"},{r:"5",w:"185",type:"working"}],rest:90}],sets:3,vol:2775,pts:80,date:"May 17",createdAt:new Date(Date.now()-86400000).toISOString(),tag:"push"},{id:"d2",name:"PULL DAY",exs:[{id:1,name:"Barbell Deadlift",sets:[{r:"3",w:"315",type:"working"},{r:"3",w:"315",type:"working"}],rest:120}],sets:2,vol:1890,pts:60,date:"May 15",createdAt:new Date(Date.now()-3*86400000).toISOString()},{id:"d3",name:"LEG DAY",exs:[{id:1,name:"Barbell Squat",sets:[{r:"5",w:"225",type:"working"},{r:"5",w:"225",type:"working"},{r:"5",w:"225",type:"working"}],rest:120}],sets:3,vol:3375,pts:90,date:"May 13",createdAt:new Date(Date.now()-5*86400000).toISOString()},{id:"d4",name:"PUSH DAY 2",exs:[{id:1,name:"Barbell Bench Press",sets:[{r:"5",w:"190",type:"working"},{r:"5",w:"190",type:"working"},{r:"5",w:"190",type:"working"}],rest:90},{id:2,name:"Incline Dumbbell Press",sets:[{r:"10",w:"60",type:"working"},{r:"10",w:"60",type:"working"}],rest:60}],sets:5,vol:3900,pts:100,date:"May 11",createdAt:new Date(Date.now()-7*86400000).toISOString(),tag:"push"},{id:"d5",name:"LEG DAY 2",exs:[{id:1,name:"Barbell Squat",sets:[{r:"5",w:"230",type:"working"},{r:"5",w:"230",type:"working"},{r:"5",w:"230",type:"working"}],rest:120},{id:2,name:"Leg Press",sets:[{r:"12",w:"270",type:"working"},{r:"12",w:"270",type:"working"}],rest:90}],sets:5,vol:9990,pts:110,date:"May 9",createdAt:new Date(Date.now()-9*86400000).toISOString(),tag:"legs"}];
const _DP = {id:"demo",username:"DEMOUSER",avatar_initials:"DU",points:1650,streak:7,sessions_count:5};
const _DL = [{rank:1,name:"DEMOUSER",pts:1650,sessions:5,streak:7,av:"DU",isMe:true},{rank:2,name:"MARCUS J",pts:1200,sessions:9,streak:3,av:"MJ",isMe:false},{rank:3,name:"SARAH K",pts:980,sessions:7,streak:5,av:"SK",isMe:false},{rank:4,name:"ALEX T",pts:750,sessions:5,streak:2,av:"AT",isMe:false}];

function ProfileModal({ profile, userId, onClose, onSave }) {
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const fileRef = useRef(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr(null);
    try {
      const base64 = await compressImage(file);
      const res = await fetch(base64);
      const blob = await res.blob();
      const { error: upErr } = await supabase.storage.from("avatars").upload(`${userId}.jpg`, blob, { upsert: true, contentType: "image/jpeg" });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(`${userId}.jpg`);
      setAvatarUrl(publicUrl + "?t=" + Date.now());
    } catch (e2) {
      setErr(e2?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true); setErr(null);
    const trimmed = username.trim().toUpperCase().slice(0, 20) || "ATHLETE";
    const initials = trimmed.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2) || "ME";
    const updates = { username: trimmed, avatar_initials: initials };
    if (avatarUrl) updates.avatar_url = avatarUrl;
    const { error: e2 } = await supabase.from("profiles").update(updates).eq("id", userId);
    setSaving(false);
    if (e2) { setErr(e2.message); return; }
    onSave({ ...profile, ...updates });
    onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:500, display:"flex", flexDirection:"column" }}>
      <div style={{ background:`linear-gradient(135deg,${G.purple}44,rgba(0,0,0,0.8))`, borderBottom:`1px solid ${G.gold}33`, padding:"16px 18px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:G.goldGlow, flexShrink:0 }}>👤</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:G.gold, textTransform:"uppercase", textShadow:G.goldGlow2 }}>EDIT PROFILE</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Update your info & photo</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:8, color:G.textMid, cursor:"pointer", fontSize:16, padding:"6px 10px" }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"32px 24px 48px", maxWidth:480, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
        {/* Avatar */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:32 }}>
          <div style={{ position:"relative", cursor:"pointer" }} onClick={() => !uploading && fileRef.current?.click()}>
            <AvatarBadge initials={profile?.avatar_initials||"ME"} url={avatarUrl} size={90} gold/>
            <div style={{ position:"absolute", bottom:0, right:0, width:28, height:28, borderRadius:"50%", background:G.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, boxShadow:G.goldGlow, border:`2px solid #06060E` }}>📷</div>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginTop:10 }}>
            {uploading ? "UPLOADING..." : "TAP TO CHANGE PHOTO"}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>
        </div>

        {/* Username */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>USERNAME</div>
          <input
            value={username}
            onChange={e => setUsername(e.target.value.toUpperCase().slice(0, 20))}
            placeholder="YOUR NAME"
            maxLength={20}
            style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontFamily:FONT.display, fontSize:16, letterSpacing:3, boxSizing:"border-box", outline:"none" }}
          />
          <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, marginTop:5 }}>{username.length}/20 characters</div>
        </div>

        {err && <div style={{ fontFamily:FONT.body, fontSize:11, color:G.red, letterSpacing:1, marginBottom:16, textAlign:"center" }}>{err}</div>}

        <NeonBtn onClick={handleSave} full disabled={saving || uploading}>
          {saving ? "SAVING..." : "SAVE CHANGES ◆"}
        </NeonBtn>
      </div>
    </div>
  );
}

function SocialFitClubInner() {
  const [tab, setTab] = useState("home");
  const [sessions, setSessions] = useState(_D ? _DS : []);
  const [quickStartWorkout, setQuickStartWorkout] = useState(null);
  const [leaderboard, setLeaderboard] = useState(_D ? _DL : []);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(_D ? {id:"demo",email:"demo@demo.com"} : null);
  const [profile, setProfile] = useState(_D ? _DP : null);
  const [authReady, setAuthReady] = useState(_D ? true : false);
  const [dataLoadFailed, setDataLoadFailed] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [showDailyMotiv, setShowDailyMotiv] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    try { return localStorage.getItem("sfc_daily_motiv") !== today; } catch { return true; }
  });
  const toastTimer = useRef(null);

  const loadProfile = async (userId) => {
    const { data, error } = await supabase.from("profiles").select("id, username, avatar_initials, avatar_url, points, streak, sessions_count").eq("id", userId).single();
    if (data) { setProfile(data); return data; }
    if (error) {
      if (error.code === "PGRST116") return null; // row not found — new user
      // Column may not be migrated yet — retry with safe baseline columns
      const { data: d2, error: e2 } = await supabase.from("profiles").select("id, username, avatar_initials, points, streak, sessions_count").eq("id", userId).single();
      if (d2) { setProfile(d2); return d2; }
      if (e2) {
        if (e2.code === "PGRST116") return null;
        // sessions_count may also be missing — retry with absolute minimum
        const { data: d3, error: e3 } = await supabase.from("profiles").select("id, username, avatar_initials, points, streak").eq("id", userId).single();
        if (d3) { setProfile(d3); return d3; }
        if (e3 && e3.code !== "PGRST116") setDataLoadFailed(true);
        return null;
      }
    }
    return null;
  };

  const loadSessions = async (userId) => {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) {
      const tagMap = (() => { try { return JSON.parse(localStorage.getItem("sfc_session_tags") || "{}"); } catch { return {}; } })();
      const mapped = data.map(s => ({ id:s.id, name:s.name, exs:s.exercises, sets:s.sets, vol:s.volume, pts:s.points, date:s.date, createdAt:s.created_at, tag: tagMap[s.id] || undefined }));
      // Prune stale tag entries for sessions that no longer exist
      const validIds = new Set(data.map(s => String(s.id)));
      const pruned = Object.fromEntries(Object.entries(tagMap).filter(([k]) => validIds.has(k)));
      try { localStorage.setItem("sfc_session_tags", JSON.stringify(pruned)); } catch { /* ignore */ }
      setSessions(mapped);
    }
    else if (error) setDataLoadFailed(true);
  };

  const loadLeaderboard = async (currentUserId) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, avatar_initials, avatar_url, points, sessions_count, streak")
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
        url: p.avatar_url || null,
        isMe: p.id === currentUserId,
      })));
    }
  };

  const ensureProfile = async (u) => {
    const existing = await loadProfile(u.id);
    if (!existing) {
      const raw = u.user_metadata?.display_name || u.email.split("@")[0].replace(/[^a-zA-Z0-9 ]/g, " ").trim().toUpperCase();
      const base = raw.slice(0, 20);
      const initials = base.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2) || "ME";
      const { data } = await supabase.from("profiles").insert({ id: u.id, username: base || "ATHLETE", avatar_initials: initials, points: 0, streak: 0, sessions_count: 0 }).select().single();
      if (data) setProfile(data);
    }
    await loadSessions(u.id);
    await loadLeaderboard(u.id);
  };

  useEffect(() => {
    if (_D) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) { loadProfile(session.user.id); loadSessions(session.user.id); loadLeaderboard(session.user.id); }
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") { setPasswordRecovery(true); return; }
      setUser(session?.user ?? null);
      if (session?.user) await ensureProfile(session.user);
      else { setProfile(null); setSessions([]); }
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user || _D) return;
    const lbChannel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadLeaderboard(user.id);
      })
      .subscribe();
    return () => supabase.removeChannel(lbChannel);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!profile || !sessions) return;
    const notifPrefs = loadNotifPrefs();
    if (!notifPrefs.enabled || !notifPrefs.streakAlert) return;
    if ("Notification" in window && Notification.permission !== "granted") return;
    const todayKey = new Date().toISOString().slice(0, 10);
    const loggedToday = sessions.some(s => (s.createdAt || "").slice(0, 10) === todayKey);
    if (!loggedToday && (profile.streak || 0) > 0) {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(reg => {
          reg.active?.postMessage({ type: "SCHEDULE_NOTIFICATION", id: "streak-alert", title: "Streak Alert 🔥", body: `Your ${profile.streak}-day streak is at risk! Log a session today to keep it going.`, delay: 5000 });
        }).catch(() => {});
      }
    }
  }, [profile?.streak, sessions?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear all user-specific localStorage so the next user on this device starts clean
    ["sfc_feed","sfc_body_log","sfc_goals","sfc_macro_coach","sfc_pledge","sfc_streak_freezes",
     "sfc_notif_prefs","sfc_session_tags","sfc_templates","sfc_wip_session",
     "sfc_nutrition_log","sfc_supplement_log","sfc_water_log","sfc_water_goal",
     "sfc_challenges","sfc_meal_templates","sfc_daily_motiv"].forEach(k => localStorage.removeItem(k));
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
    // Calculate new streak: check if most recent prior session was today or yesterday
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lastDate = sessions[0]?.createdAt?.slice(0, 10) || sessions[0]?.date;
    let newStreak;
    if (lastDate === todayStr) {
      newStreak = profile?.streak || 1; // already logged today, streak unchanged
    } else if (lastDate === yesterdayStr) {
      newStreak = (profile?.streak || 0) + 1;
    } else {
      newStreak = 1; // first session or gap > 1 day
    }

    // Optimistic local update
    setSessions(p => [{ ...sess, createdAt: new Date().toISOString() }, ...p]);
    const newPts = (profile?.points || 0) + sess.pts;
    const newSessionsCount = (profile?.sessions_count || 0) + 1;
    setProfile(p => ({ ...p, points: newPts, sessions_count: newSessionsCount, streak: newStreak }));
    setLeaderboard(p =>
      p.map(u => u.isMe ? { ...u, pts: newPts, sessions: u.sessions + 1, streak: newStreak } : u)
       .sort((a,b) => b.pts - a.pts)
       .map((u,i) => ({ ...u, rank: i+1 }))
    );
    showToast(`🏆 SESSION SAVED · +${sess.pts} POINTS`);

    // Persist to Supabase
    const [{ data: sData, error: sErr }, { error: pErr }] = await Promise.all([
      supabase.from("sessions").insert({
        user_id: user.id,
        name: sess.name,
        exercises: sess.exs,
        sets: sess.sets,
        volume: sess.vol,
        points: sess.pts,
        date: sess.date,
      }).select("id").single(),
      supabase.from("profiles").update({ points: newPts, sessions_count: newSessionsCount, streak: newStreak }).eq("id", user.id),
    ]);
    if (sErr || pErr) showToast("⚠️ SYNC ERROR — DATA MAY NOT BE SAVED");
    if (sData?.id && sess.tag) {
      try {
        const tagMap = JSON.parse(localStorage.getItem("sfc_session_tags") || "{}");
        tagMap[sData.id] = sess.tag;
        localStorage.setItem("sfc_session_tags", JSON.stringify(tagMap));
      } catch { /* ignore */ }
    }
  };

  const handleDeleteSession = async (sessId) => {
    const removed = sessions.find(s => s.id === sessId);
    if (!removed) return;
    setSessions(p => p.filter(s => s.id !== sessId));
    const newPts = Math.max(0, (profile?.points || 0) - (removed.pts || 0));
    const newCount = Math.max(0, (profile?.sessions_count || 0) - 1);
    setProfile(p => ({ ...p, points: newPts, sessions_count: newCount }));
    setLeaderboard(p =>
      p.map(u => u.isMe ? { ...u, pts: newPts, sessions: Math.max(0, u.sessions - 1) } : u)
       .sort((a,b) => b.pts - a.pts)
       .map((u,i) => ({ ...u, rank: i+1 }))
    );
    showToast("Session deleted");
    const [{ error: sErr }, { error: pErr }] = await Promise.all([
      supabase.from("sessions").delete().eq("id", sessId),
      supabase.from("profiles").update({ points: newPts, sessions_count: newCount }).eq("id", user.id),
    ]);
    if (sErr || pErr) showToast("⚠️ SYNC ERROR — please reload");
  };

  const handleEditSession = async (sessId, newName) => {
    setSessions(p => p.map(s => s.id === sessId ? { ...s, name: newName } : s));
    const { error } = await supabase.from("sessions").update({ name: newName }).eq("id", sessId);
    if (error) showToast("⚠️ SYNC ERROR — name may not be saved");
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
  if (passwordRecovery) return <ResetPasswordScreen onDone={() => setPasswordRecovery(false)}/>;
  if (!user) return <LoginScreen/>;
  if (!profile && dataLoadFailed) {
    const retry = () => { setDataLoadFailed(false); ensureProfile(user); };
    return (
      <div style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📡</div>
        <div style={{ fontFamily:FONT.display, fontSize:26, letterSpacing:4, color:"#fff", textTransform:"uppercase", marginBottom:8 }}>CONNECTION ERROR</div>
        <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, marginBottom:28, maxWidth:280 }}>Couldn't reach the server. Check your connection and try again.</div>
        <button onClick={retry} style={{ background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:8, padding:"13px 32px", fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:"#0A0810", cursor:"pointer", textTransform:"uppercase", boxShadow:G.goldGlow2 }}>RETRY</button>
      </div>
    );
  }
  if (!profile) return <div style={{ minHeight:"100vh", background:G.bg }}/>;

  return (
    <div style={{ minHeight:"100vh", background:G.bg, color:G.text, fontFamily:FONT.body, maxWidth:480, margin:"0 auto", position:"relative", userSelect:"none" }}>
      <GridBg/>

      {toast && (
        <div style={{ position:"fixed", top:18, left:"50%", transform:"translateX(-50%)", background:G.bg3, border:`1px solid ${G.gold}55`, borderRadius:7, padding:"10px 18px", zIndex:9999, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.gold, boxShadow:`${G.goldGlow}, 0 8px 32px rgba(0,0,0,0.6)`, whiteSpace:"nowrap", textTransform:"uppercase", animation:"toastIn 0.25s ease" }}>{toast}</div>
      )}

      {showDailyMotiv && <DailyMotivModal onClose={() => {
        const today = new Date().toISOString().slice(0, 10);
        try { localStorage.setItem("sfc_daily_motiv", today); } catch { /* ignore */ }
        setShowDailyMotiv(false);
      }}/>}

      <div style={{ paddingBottom:82, position:"relative", zIndex:2, minHeight:"100vh" }}>
        {tab==="home" && <HomeScreen sessions={sessions} leaderboard={leaderboard} onQuickStart={handleQuickStart} showToast={showToast} profile={profile}/>}
        {tab==="train" && <TrainScreen showToast={showToast} onSave={handleSave} onDelete={handleDeleteSession} onEdit={handleEditSession} quickStart={quickStartWorkout} onClearQuickStart={()=>setQuickStartWorkout(null)} sessions={sessions}/>}
        {tab==="progress" && <ProgressScreen showToast={showToast} sessions={sessions} profile={profile}/>}
        {tab==="nutrition" && <NutritionScreen showToast={showToast}/>}
        {tab==="feed" && <FeedScreen showToast={showToast} profile={profile} sessions={sessions}/>}
        {tab==="more" && <MoreScreen showToast={showToast} profile={profile} onSignOut={handleSignOut} onProfileUpdate={p => setProfile(p)} userId={user?.id} sessions={sessions} muscleScores={calcMuscleScores(sessions)} isAdmin={user?.email?.toLowerCase()===ADMIN_EMAIL}/>}
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
        @keyframes motivFadeIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
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

export default function SocialFitClub() {
  return <ErrorBoundary><SocialFitClubInner/></ErrorBoundary>;
}
