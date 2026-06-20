import { useState, useEffect, useRef, useCallback, Component } from "react";
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

const EXERCISE_CATS = {
  "CHEST": [
    "Barbell Bench Press","Incline Barbell Press","Decline Bench Press","Dumbbell Bench Press",
    "Incline Dumbbell Press","Decline Dumbbell Press","Cable Flyes","Dumbbell Flyes",
    "Incline Cable Flyes","Pec Deck Machine","Push-Ups","Chest Dip",
    "Machine Chest Press","Low Cable Crossover","Cable Chest Press","Dumbbell Pullover",
    "Barbell Floor Press","Dumbbell Floor Press","Svend Press",
    "Smith Machine Bench Press","Smith Machine Incline Press",
    "Wide-Grip Push-Ups","Diamond Push-Ups","Incline Push-Ups","Decline Push-Ups","Hex Press",
  ],
  "BACK": [
    "Barbell Deadlift","Romanian Deadlift","Trap Bar Deadlift","Rack Pull",
    "Barbell Row","Pendlay Row","Dumbbell Row","T-Bar Row","Chest-Supported Row",
    "Seated Cable Row","Single-Arm Cable Row","Wide-Grip Seated Cable Row",
    "Lat Pulldown","Close-Grip Lat Pulldown","Pull-Ups","Chin-Ups",
    "Straight-Arm Pulldown","Hyperextensions",
    "Renegade Row","Dumbbell Deadlift","Dumbbell Good Mornings",
    "Barbell Good Mornings","Sumo Deadlift","Landmine Row","Landmine Romanian Deadlift","Meadows Row",
    "Inverted Row","Seal Row","Cable Pullover","Deficit Deadlift","Neutral Grip Pull-Ups","Single-Arm Lat Pulldown",
  ],
  "LEGS": [
    "Barbell Squat","Front Squat","Hack Squat","Goblet Squat","Box Squat",
    "Leg Press","Single Leg Press","Bulgarian Split Squat",
    "Walking Lunges","Reverse Lunges","Dumbbell Lunge","Step-Ups",
    "Leg Extension","Leg Curl","Seated Leg Curl","Nordic Hamstring Curl",
    "Hip Thrust","Glute Bridge","Calf Raise","Seated Calf Raise",
    "Cable Pull-Through","Cable Glute Kickback","Cable Hip Abduction","Cable Romanian Deadlift",
    "Dumbbell Romanian Deadlift","Dumbbell Hip Thrust","Dumbbell Sumo Squat","Dumbbell Calf Raise",
    "Landmine Squat","Landmine Split Squat","Pistol Squat","Sissy Squat","Reverse Hypers","Hip Abductor Machine",
    "Smith Machine Squat","Pause Squat","Zercher Squat","Lateral Lunge","Curtsy Lunge","Jump Lunge",
    "Single-Leg Romanian Deadlift","Leg Adductor Machine","Donkey Calf Raise",
  ],
  "SHOULDERS": [
    "Barbell Overhead Press","Seated Dumbbell Press","Machine Shoulder Press",
    "Arnold Press","Push Press",
    "Lateral Raises","Cable Lateral Raises","Front Raises",
    "Rear Delt Flyes","Machine Rear Delt Flyes","Cable Face Pulls",
    "Upright Row","Barbell Shrugs","Dumbbell Shrugs",
    "Cable Upright Row","Dumbbell Upright Row",
    "Landmine Press","Landmine Lateral Raise","Bradford Press","Cable Y-Raise",
    "Pike Push-Ups","Handstand Push-Ups","Machine Lateral Raise","Plate Front Raise","Cable Front Raise","Dumbbell Y-Raise",
  ],
  "ARMS": [
    "Barbell Curl","Dumbbell Curl","Hammer Curl","Preacher Curl",
    "Concentration Curl","Incline Dumbbell Curl","Cable Curl","EZ Bar Curl",
    "Zottman Curl","Reverse Curl",
    "Tricep Pushdown","Rope Pushdown","Skull Crushers","Close-Grip Bench Press",
    "Tricep Overhead Extension","Cable Overhead Tricep Extension",
    "Tricep Kickback","Dips",
    "Dumbbell Skull Crushers","Dumbbell Overhead Tricep Extension",
    "Spider Curl","Cross-Body Hammer Curl","Overhead Cable Curl",
    "Cable Hammer Curl","Drag Curl","Scott Curl","Wide-Grip Barbell Curl",
    "JM Press","Tate Press","Reverse Grip Tricep Pushdown","Single-Arm Tricep Pushdown","Machine Tricep Press",
  ],
  "CORE": [
    "Plank","Side Plank","Ab Wheel","Hanging Leg Raises","Leg Raises",
    "Russian Twists","Bicycle Crunches","Crunch","Decline Crunches","Sit-Ups",
    "Cable Crunch","V-Ups","Dragon Flag","Dead Bug","Pallof Press",
    "Flutter Kicks","Mountain Climbers","Cable Woodchop",
    "Landmine Rotation","Hollow Body Hold","Toes-to-Bar","Windshield Wipers","Suitcase Carry",
    "Reverse Crunch","Toe Touches","Superman","Bird Dog","Copenhagen Plank","Medicine Ball Slam","Weighted Sit-Up",
  ],
  "CARDIO": [
    "Jump Rope","Assault Bike","Box Jumps","Burpees","Battle Ropes",
    "Sled Push","Rowing Machine","Treadmill Run","Stair Climber",
    "Jump Squats","High Knees","Bear Crawl","Farmer's Walk",
    "Ski Erg","Sled Drag","Prowler Push","Sprint Intervals",
    "Elliptical","Stationary Bike","Incline Walk","Echo Bike","Cycling","Versa Climber",
  ],
  "KETTLEBELL": [
    "Kettlebell Swing","Kettlebell Clean","Kettlebell Press","Kettlebell Snatch",
    "Kettlebell Turkish Get-Up","Kettlebell Goblet Squat","Kettlebell Deadlift",
    "Kettlebell Row","Kettlebell Windmill","Kettlebell Halo",
    "Kettlebell Clean and Press","Kettlebell Front Squat","Kettlebell Lunge",
    "Kettlebell Figure Eight","Kettlebell Thruster","Kettlebell Renegade Row",
    "Kettlebell Farmers Carry","Bottoms-Up Press","Kettlebell Sumo Deadlift","Kettlebell Jump Squat",
  ],
};
const EXERCISES = Object.values(EXERCISE_CATS).flat();
const EX_CAT_LOOKUP = {};
Object.entries(EXERCISE_CATS).forEach(([cat, arr]) => arr.forEach(n => { EX_CAT_LOOKUP[n] = cat; }));

const EXERCISE_SUBCATS = {
  "BACK": {
    "LATS": [
      "Lat Pulldown","Close-Grip Lat Pulldown","Pull-Ups","Chin-Ups",
      "Straight-Arm Pulldown","Barbell Row","Dumbbell Row","Single-Arm Cable Row",
      "Renegade Row",
      "Neutral Grip Pull-Ups","Single-Arm Lat Pulldown","Cable Pullover","Inverted Row",
    ],
    "MID BACK": [
      "Barbell Row","Pendlay Row","T-Bar Row","Chest-Supported Row",
      "Seated Cable Row","Wide-Grip Seated Cable Row","Single-Arm Cable Row",
      "Barbell Deadlift","Trap Bar Deadlift","Rack Pull","Hyperextensions",
      "Dumbbell Deadlift","Dumbbell Good Mornings",
      "Seal Row","Inverted Row",
    ],
  },
  "LEGS": {
    "QUADS": [
      "Barbell Squat","Front Squat","Hack Squat","Goblet Squat","Box Squat",
      "Leg Press","Single Leg Press","Bulgarian Split Squat",
      "Walking Lunges","Reverse Lunges","Dumbbell Lunge","Step-Ups",
      "Leg Extension","Calf Raise","Seated Calf Raise",
      "Dumbbell Sumo Squat","Kettlebell Goblet Squat","Kettlebell Front Squat",
      "Smith Machine Squat","Pause Squat","Zercher Squat","Lateral Lunge","Curtsy Lunge","Jump Lunge",
    ],
    "HAMSTRINGS": [
      "Romanian Deadlift","Leg Curl","Seated Leg Curl","Nordic Hamstring Curl",
      "Hip Thrust","Glute Bridge",
      "Cable Pull-Through","Cable Glute Kickback","Cable Romanian Deadlift",
      "Dumbbell Romanian Deadlift","Dumbbell Hip Thrust",
      "Kettlebell Swing",
      "Single-Leg Romanian Deadlift",
    ],
  },
};

// Cross-category equipment filters. CABLES and DUMBBELLS span multiple
// muscle-group categories; filtering by equipment uses this lookup instead
// of EX_CAT_LOOKUP so exercises keep their muscle-group badge.
const EQUIPMENT_CATS = {
  "CABLES": [
    // CHEST
    "Cable Flyes","Incline Cable Flyes","Low Cable Crossover","Cable Chest Press",
    // BACK
    "Seated Cable Row","Single-Arm Cable Row","Wide-Grip Seated Cable Row",
    "Lat Pulldown","Close-Grip Lat Pulldown","Straight-Arm Pulldown",
    // LEGS
    "Cable Pull-Through","Cable Glute Kickback","Cable Hip Abduction","Cable Romanian Deadlift",
    // SHOULDERS
    "Cable Lateral Raises","Cable Face Pulls","Cable Upright Row",
    // ARMS
    "Cable Curl","Rope Pushdown","Tricep Pushdown","Cable Overhead Tricep Extension",
    // CORE
    "Cable Crunch","Pallof Press","Cable Woodchop",
    // New cable exercises
    "Cable Pullover","Cable Front Raise","Single-Arm Lat Pulldown",
    "Single-Arm Tricep Pushdown","Reverse Grip Tricep Pushdown",
  ],
  "LANDMINE": [
    "Landmine Press","Landmine Lateral Raise",
    "Landmine Row","Landmine Romanian Deadlift",
    "Landmine Squat","Landmine Split Squat",
    "Landmine Rotation",
  ],
  "DUMBBELLS": [
    // CHEST
    "Dumbbell Bench Press","Incline Dumbbell Press","Decline Dumbbell Press",
    "Dumbbell Flyes","Dumbbell Pullover",
    // BACK
    "Dumbbell Row","Renegade Row","Dumbbell Deadlift","Dumbbell Good Mornings",
    // LEGS
    "Goblet Squat","Dumbbell Lunge","Dumbbell Romanian Deadlift",
    "Dumbbell Hip Thrust","Dumbbell Sumo Squat","Dumbbell Calf Raise",
    // SHOULDERS
    "Seated Dumbbell Press","Arnold Press","Lateral Raises","Rear Delt Flyes",
    "Front Raises","Dumbbell Shrugs","Dumbbell Upright Row",
    // ARMS
    "Dumbbell Curl","Hammer Curl","Concentration Curl","Incline Dumbbell Curl",
    "Zottman Curl","Reverse Curl","Tricep Kickback",
    "Dumbbell Skull Crushers","Dumbbell Overhead Tricep Extension",
    // New dumbbell exercises
    "Hex Press","Tate Press","Dumbbell Y-Raise",
  ],
};

// Maps cardio exercise names to their two input fields.
// a = primary field (left col), b = secondary field (right col).
// r stores field-a value, w stores field-b value (same set structure).
const CARDIO_SET_CONFIG = {
  "Treadmill Run":  { a:{ label:"TIME",    unit:"MIN",  mode:"decimal" }, b:{ label:"INCLINE", unit:"%",   mode:"decimal" } },
  "Stair Climber":  { a:{ label:"TIME",    unit:"MIN",  mode:"decimal" }, b:{ label:"SPEED",   unit:"LVL", mode:"decimal" } },
  "Assault Bike":   { a:{ label:"TIME",    unit:"MIN",  mode:"decimal" }, b:{ label:"LEVEL",   unit:"",    mode:"numeric"  } },
  "Rowing Machine": { a:{ label:"TIME",    unit:"MIN",  mode:"decimal" }, b:{ label:"DIST",    unit:"M",   mode:"numeric"  } },
  "Jump Rope":      { a:{ label:"TIME",    unit:"MIN",  mode:"decimal" }, b:{ label:"ROUNDS",  unit:"",    mode:"numeric"  } },
  "Battle Ropes":   { a:{ label:"TIME",    unit:"SEC",  mode:"numeric"  }, b:{ label:"ROUNDS",  unit:"",    mode:"numeric"  } },
  "Sled Push":      { a:{ label:"SETS",    unit:"",     mode:"numeric"  }, b:{ label:"DIST",    unit:"YDS", mode:"numeric"  } },
  "Burpees":        { a:{ label:"TIME",    unit:"MIN",  mode:"decimal" }, b:{ label:"REPS",    unit:"",    mode:"numeric"  } },
  "Box Jumps":      { a:{ label:"SETS",    unit:"",     mode:"numeric"  }, b:{ label:"REPS",    unit:"",    mode:"numeric"  } },
  "Jump Squats":    { a:{ label:"SETS",    unit:"",     mode:"numeric"  }, b:{ label:"REPS",    unit:"",    mode:"numeric"  } },
  "High Knees":     { a:{ label:"TIME",    unit:"SEC",  mode:"numeric"  }, b:{ label:"ROUNDS",  unit:"",    mode:"numeric"  } },
  "Bear Crawl":     { a:{ label:"TIME",    unit:"SEC",  mode:"numeric"  }, b:{ label:"ROUNDS",  unit:"",    mode:"numeric"  } },
  "Farmer's Walk":  { a:{ label:"DIST",    unit:"YDS",  mode:"numeric"  }, b:{ label:"WEIGHT",  unit:"LBS", mode:"decimal" } },
  "Ski Erg":        { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"DIST",    unit:"M",   mode:"numeric"  } },
  "Sled Drag":      { a:{ label:"DIST",    unit:"YDS",  mode:"numeric"  }, b:{ label:"WEIGHT",  unit:"LBS", mode:"decimal" } },
  "Prowler Push":   { a:{ label:"DIST",    unit:"YDS",  mode:"numeric"  }, b:{ label:"WEIGHT",  unit:"LBS", mode:"decimal" } },
  "Sprint Intervals":{ a:{ label:"TIME",   unit:"SEC",  mode:"numeric"  }, b:{ label:"ROUNDS",  unit:"",    mode:"numeric"  } },
  "Suitcase Carry": { a:{ label:"DIST",    unit:"YDS",  mode:"numeric"  }, b:{ label:"WEIGHT",  unit:"LBS", mode:"decimal" } },
  "Elliptical":      { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"RESISTANCE", unit:"LVL", mode:"numeric" } },
  "Stationary Bike": { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"RESISTANCE", unit:"LVL", mode:"numeric" } },
  "Echo Bike":       { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"LEVEL",      unit:"",    mode:"numeric" } },
  "Incline Walk":    { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"INCLINE",    unit:"%",   mode:"decimal" } },
  "Cycling":         { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"DIST",       unit:"MI",  mode:"decimal" } },
  "Versa Climber":   { a:{ label:"TIME",    unit:"MIN",  mode:"decimal"  }, b:{ label:"DIST",       unit:"FT",  mode:"numeric" } },
};

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

function GuidedTourOverlay({ onDone }) {
  useScrollLock();
  const [stepIdx, setStepIdx] = useState(0);
  const [spotRect, setSpotRect] = useState(null);

  const STEPS = [
    { sel: null,                    ico: "🏋️",  title: "WELCOME TO SFC",   body: "Let us walk you through the key features. It'll only take a minute." },
    { sel: "[data-tour='nav']",     ico: "⌂",   title: "NAVIGATION",       body: "These 6 tabs are your home base — tap any icon to switch sections.", pad: 8 },
    { sel: "[data-tour='tab-train']",     ico: "⊞",  title: "TRAIN",       body: "Log workouts, track every set, hit personal records, and follow structured programs.", pad: 10 },
    { sel: "[data-tour='tab-progress']",  ico: "⤴",  title: "STATS",       body: "See your progress over time, view your streak, and explore the muscle heat map.", pad: 10 },
    { sel: "[data-tour='tab-nutrition']", ico: "◉",  title: "FUEL",        body: "Log meals, scan barcodes, and hit your daily calorie and macro targets.", pad: 10 },
    { sel: "[data-tour='tab-feed']",      ico: "⚇",  title: "SQUAD",       body: "Share your PRs, post updates, send challenges, and connect with your crew.", pad: 10 },
    { sel: "[data-tour='tab-more']",      ico: "···", title: "MORE TOOLS",  body: "Get your AI Coach report, set weekly goals, check weekly reports, and much more.", pad: 10 },
  ];

  const current = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const PAD = current.pad || 0;

  useEffect(() => {
    if (!current.sel) { setTimeout(() => setSpotRect(null), 0); return; }
    const measure = () => {
      const el = document.querySelector(current.sel);
      if (!el) { setTimeout(() => setSpotRect(null), 0); return; }
      const r = el.getBoundingClientRect();
      setSpotRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    const t = setTimeout(measure, 120);
    return () => clearTimeout(t);
  }, [stepIdx, current.sel]);

  const next = () => { if (isLast) finish(); else setStepIdx(i => i + 1); };
  const finish = () => { try { localStorage.setItem("sfc_tour_done", "1"); } catch { /* ignore */ } onDone(); };

  const tooltipAbove = spotRect ? (spotRect.top > window.innerHeight * 0.5) : false;
  const tooltipBottom = tooltipAbove ? (window.innerHeight - spotRect.top + PAD + 16) : undefined;
  const tooltipTop = !tooltipAbove && spotRect ? (spotRect.top + spotRect.height + PAD + 16) : undefined;

  const dots = (
    <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:14 }}>
      {STEPS.map((_, i) => (
        <div key={i} style={{ width: i===stepIdx ? 16 : 6, height:6, borderRadius:3, background: i===stepIdx ? G.purple : G.textDim, transition:"all 0.25s", boxShadow: i===stepIdx ? `0 0 8px ${G.purple}` : "none" }}/>
      ))}
    </div>
  );

  const btns = (
    <div style={{ display:"flex", gap:10 }}>
      <button onClick={finish} style={{ flex:1, background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"11px 0", fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.textDim, cursor:"pointer" }}>SKIP</button>
      <button onClick={next} style={{ flex:2, background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, border:"none", borderRadius:8, padding:"11px 0", fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", cursor:"pointer", boxShadow:`0 0 16px ${G.purple}55` }}>
        {isLast ? "DONE ✓" : "NEXT →"}
      </button>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9100 }}>
      {/* click-blocker — transparent but catches all taps behind the tooltip */}
      <div style={{ position:"absolute", inset:0, background:"transparent" }}/>

      {/* spotlight ring with box-shadow dim */}
      {spotRect && (
        <div style={{
          position:"fixed",
          top: spotRect.top - PAD,
          left: spotRect.left - PAD,
          width: spotRect.width + PAD * 2,
          height: spotRect.height + PAD * 2,
          borderRadius: 12,
          border: `2px solid ${G.purple}`,
          boxShadow: `0 0 0 9999px rgba(6,6,14,0.84), 0 0 28px ${G.purple}99, inset 0 0 16px ${G.purple}22`,
          pointerEvents: "none",
          transition: "top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease",
          zIndex: 9101,
        }}/>
      )}

      {/* welcome card (step 0, no spotlight) */}
      {!spotRect && (
        <div style={{
          position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:"min(320px, 88vw)", background:G.bg2,
          border:`1px solid ${G.purple}55`, borderRadius:16,
          padding:"28px 24px 22px", textAlign:"center",
          boxShadow:`${G.purpleGlow}, 0 24px 64px rgba(0,0,0,0.8)`,
          animation:"tourFadeIn 0.3s ease", zIndex:9102,
        }}>
          <div style={{ fontSize:44, marginBottom:14 }}>{current.ico}</div>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", marginBottom:8 }}>
            WELCOME TO <span style={{ color:G.purple, textShadow:`0 0 12px ${G.purple}` }}>SFC</span>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.65, marginBottom:22 }}>
            {current.body}
          </div>
          {dots}
          {btns}
        </div>
      )}

      {/* feature tooltip */}
      {spotRect && (
        <div style={{
          position:"fixed",
          left:"50%", transform:"translateX(-50%)",
          ...(tooltipAbove ? { bottom: tooltipBottom } : { top: tooltipTop }),
          width:"min(300px, 86vw)", background:G.bg2,
          border:`1px solid ${G.purple}44`, borderRadius:14,
          padding:"18px 20px 16px",
          boxShadow:`${G.purpleGlow}, 0 16px 48px rgba(0,0,0,0.75)`,
          animation:"tourTipIn 0.22s ease", zIndex:9102,
        }}>
          {/* arrow */}
          <div style={{
            position:"absolute",
            ...(tooltipAbove ? { bottom:-7 } : { top:-7 }),
            left:"50%", transform:"translateX(-50%)",
            width:0, height:0,
            borderLeft:"7px solid transparent",
            borderRight:"7px solid transparent",
            ...(tooltipAbove
              ? { borderTop:`7px solid ${G.purple}55` }
              : { borderBottom:`7px solid ${G.purple}55` }),
          }}/>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
            <span style={{ color:G.purple, fontSize:16 }}>{current.ico}</span>
            <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:"#fff" }}>{current.title}</div>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.6, marginBottom:16 }}>
            {current.body}
          </div>
          {dots}
          {btns}
        </div>
      )}

      <style>{`
        @keyframes tourFadeIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.95)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes tourTipIn { from{opacity:0;transform:translateX(-50%) scale(0.96)} to{opacity:1;transform:translateX(-50%) scale(1)} }
      `}</style>
    </div>
  );
}

function OnboardingModal({ onDone }) {
  useScrollLock();
  const [slide, setSlide] = useState(0);

  const SLIDES = [
    {
      icon: "💪",
      titleTop: "WELCOME TO",
      titleBottom: "SOCIAL FIT CLUB",
      accent: G.purple,
      sub: "Your all-in-one fitness community. Train hard, track progress, and connect with your squad.",
      features: null,
    },
    {
      icon: null,
      titleTop: "EVERYTHING YOU NEED",
      titleBottom: "TO LEVEL UP",
      accent: G.purpleBright,
      sub: null,
      features: [
        { ico: "🏋️", label: "TRAIN & TRACK", desc: "Log workouts & hit PRs" },
        { ico: "🥗", label: "NUTRITION", desc: "Macros, AI meal scan & more" },
        { ico: "📊", label: "PROGRESS", desc: "Stats, streaks & heat maps" },
        { ico: "🤝", label: "SQUAD", desc: "Compete & share with crew" },
      ],
    },
    {
      icon: "🏆",
      titleTop: "EARN POINTS.",
      titleBottom: "CLIMB THE RANKS.",
      accent: G.gold,
      sub: "Every workout earns points. Hit streaks, set PRs, and compete on the live leaderboard.",
      features: null,
    },
  ];

  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:850, background:"rgba(6,6,14,0.99)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between", padding:"calc(env(safe-area-inset-top,0px) + 36px) 28px calc(env(safe-area-inset-bottom,0px) + 36px)", animation:"motivFadeIn 0.35s ease" }}>
      {/* Skip */}
      <div style={{ width:"100%", display:"flex", justifyContent:"flex-end" }}>
        <button onClick={onDone} style={{ background:"none", border:"none", color:G.textDim, fontFamily:FONT.body, fontSize:12, letterSpacing:2.5, cursor:"pointer", padding:"4px 0", textTransform:"uppercase" }}>SKIP</button>
      </div>

      {/* Content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:20, width:"100%" }}>
        {s.icon && (
          <div style={{ fontSize:76, lineHeight:1, filter:`drop-shadow(0 0 24px ${s.accent}99)` }}>{s.icon}</div>
        )}

        {s.features && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, width:"100%", marginBottom:4 }}>
            {s.features.map(f => (
              <div key={f.label} style={{ background:`linear-gradient(135deg,${G.purple}20,rgba(255,255,255,0.03))`, border:`1px solid ${G.purple}44`, borderRadius:14, padding:"18px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:30 }}>{f.ico}</span>
                <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{f.label}</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:1, color:G.textMid, textTransform:"uppercase", lineHeight:1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:4, color:"#fff", textTransform:"uppercase", opacity:0.7 }}>{s.titleTop}</div>
          <div style={{ fontFamily:FONT.display, fontSize:32, letterSpacing:3, color:s.accent, textTransform:"uppercase", textShadow:`0 0 24px ${s.accent}88`, lineHeight:1.05 }}>{s.titleBottom}</div>
        </div>

        {s.sub && (
          <div style={{ fontFamily:FONT.body, fontSize:14, letterSpacing:0.5, color:G.textMid, lineHeight:1.65, maxWidth:310 }}>{s.sub}</div>
        )}
      </div>

      {/* Dot indicators */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{ width:i===slide?22:7, height:7, borderRadius:4, background:i===slide?s.accent:G.borderB, transition:"all 0.3s ease", boxShadow:i===slide?`0 0 8px ${s.accent}`:"none" }}/>
        ))}
      </div>

      {/* Nav buttons */}
      <div style={{ width:"100%", display:"flex", gap:10 }}>
        {slide > 0 && (
          <button onClick={()=>setSlide(p=>p-1)} style={{ flex:1, background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:12, padding:"14px", color:G.textMid, fontFamily:FONT.display, fontSize:13, letterSpacing:3, cursor:"pointer", textTransform:"uppercase" }}>← BACK</button>
        )}
        <button
          onClick={isLast ? onDone : ()=>setSlide(p=>p+1)}
          style={{ flex:2, background:isLast?`linear-gradient(135deg,${G.gold},${G.goldDark})`:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, border:"none", borderRadius:12, padding:"16px", color:isLast?"#0A0810":"#fff", fontFamily:FONT.display, fontSize:15, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", boxShadow:isLast?G.goldGlow:G.purpleGlow }}
        >
          {isLast ? "LET'S GET STARTED ◆" : "NEXT →"}
        </button>
      </div>
    </div>
  );
}

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
  // ── Breakfast ──────────────────────────────────────────────────────────────
  { name:"Breakfast Burrito (large)", cat:"BREAKFAST", cal:490, pro:23, carb:52, fat:22 },
  { name:"Scrambled Eggs (2 large)", cat:"BREAKFAST", cal:182, pro:12, carb:1.6, fat:14 },
  { name:"Omelette (3-egg, plain)", cat:"BREAKFAST", cal:215, pro:18, carb:1, fat:15 },
  { name:"French Toast (2 slices)", cat:"BREAKFAST", cal:300, pro:10, carb:43, fat:10 },
  { name:"Pancakes (2 medium)", cat:"BREAKFAST", cal:350, pro:9, carb:56, fat:10 },
  { name:"Waffles (2, frozen)", cat:"BREAKFAST", cal:310, pro:7, carb:49, fat:9 },
  { name:"Bagel (plain, large)", cat:"BREAKFAST", cal:270, pro:10, carb:55, fat:1.5 },
  { name:"Bagel w/ Cream Cheese", cat:"BREAKFAST", cal:370, pro:12, carb:55, fat:13 },
  { name:"Blueberry Muffin", cat:"BREAKFAST", cal:426, pro:6, carb:72, fat:14 },
  { name:"Croissant (plain)", cat:"BREAKFAST", cal:231, pro:5, carb:26, fat:12 },
  { name:"Granola 100g", cat:"BREAKFAST", cal:450, pro:10, carb:64, fat:17 },
  { name:"Cheerios 40g", cat:"BREAKFAST", cal:150, pro:4, carb:32, fat:2 },
  { name:"Frosted Flakes 40g", cat:"BREAKFAST", cal:150, pro:2, carb:37, fat:0 },
  { name:"Oatmeal w/ Berries", cat:"BREAKFAST", cal:220, pro:7, carb:42, fat:3.5 },
  { name:"Breakfast Sandwich (egg, ch, bac)", cat:"BREAKFAST", cal:450, pro:25, carb:36, fat:22 },
  { name:"Hash Browns (fast food)", cat:"BREAKFAST", cal:150, pro:2, carb:20, fat:7 },
  { name:"Avocado Toast (2 slices)", cat:"BREAKFAST", cal:330, pro:9, carb:35, fat:18 },
  { name:"Yogurt Parfait (med)", cat:"BREAKFAST", cal:290, pro:13, carb:48, fat:5 },
  { name:"Acai Bowl (med)", cat:"BREAKFAST", cal:410, pro:8, carb:68, fat:12 },
  // ── More Proteins ──────────────────────────────────────────────────────────
  { name:"Cod Fillet 100g", cat:"PROTEIN", cal:82, pro:18, carb:0, fat:0.7 },
  { name:"Halibut 100g", cat:"PROTEIN", cal:110, pro:23, carb:0, fat:2.3 },
  { name:"Mahi-Mahi 100g", cat:"PROTEIN", cal:109, pro:24, carb:0, fat:0.9 },
  { name:"Sardines (canned) 92g", cat:"PROTEIN", cal:191, pro:23, carb:0, fat:11 },
  { name:"Canned Salmon 85g", cat:"PROTEIN", cal:130, pro:20, carb:0, fat:5 },
  { name:"Pork Tenderloin 100g", cat:"PROTEIN", cal:143, pro:26, carb:0, fat:3.5 },
  { name:"Pork Chop 100g", cat:"PROTEIN", cal:172, pro:24, carb:0, fat:8 },
  { name:"Ribeye Steak 100g", cat:"PROTEIN", cal:291, pro:24, carb:0, fat:21 },
  { name:"Sirloin Steak 100g", cat:"PROTEIN", cal:207, pro:26, carb:0, fat:11 },
  { name:"Ground Turkey 93% 100g", cat:"PROTEIN", cal:148, pro:20, carb:0, fat:7.8 },
  { name:"Rotisserie Chicken 100g", cat:"PROTEIN", cal:185, pro:24, carb:0, fat:10 },
  { name:"Beef Jerky 28g", cat:"PROTEIN", cal:116, pro:9.4, carb:7.3, fat:7.3 },
  { name:"Deli Turkey 56g", cat:"PROTEIN", cal:61, pro:11, carb:1.5, fat:0.9 },
  { name:"Deli Ham 56g", cat:"PROTEIN", cal:73, pro:11, carb:2, fat:2 },
  { name:"Lamb Chop 100g", cat:"PROTEIN", cal:258, pro:25, carb:0, fat:17 },
  { name:"Bison 100g", cat:"PROTEIN", cal:143, pro:28, carb:0, fat:3 },
  // ── More Carbs / Grains ────────────────────────────────────────────────────
  { name:"Flour Tortilla (10in)", cat:"CARBS", cal:218, pro:5.7, carb:36, fat:5.4 },
  { name:"Whole Wheat Tortilla (10in)", cat:"CARBS", cal:200, pro:6, carb:34, fat:5 },
  { name:"Pita Bread (1 piece)", cat:"CARBS", cal:165, pro:5.5, carb:33, fat:0.7 },
  { name:"Couscous (cooked) 100g", cat:"CARBS", cal:112, pro:3.8, carb:23, fat:0.2 },
  { name:"Bulgur (cooked) 100g", cat:"CARBS", cal:83, pro:3.1, carb:19, fat:0.2 },
  { name:"Barley (cooked) 100g", cat:"CARBS", cal:123, pro:2.3, carb:28, fat:0.4 },
  { name:"Grits (cooked) 100g", cat:"CARBS", cal:59, pro:1.4, carb:13, fat:0.3 },
  { name:"English Muffin", cat:"CARBS", cal:134, pro:4.4, carb:26, fat:1.1 },
  { name:"Sourdough Bread 1 slice", cat:"CARBS", cal:93, pro:4, carb:18, fat:0.6 },
  { name:"Dinner Roll", cat:"CARBS", cal:87, pro:2.7, carb:15, fat:1.9 },
  { name:"Crackers (5 Triscuits)", cat:"CARBS", cal:120, pro:3, carb:20, fat:4 },
  { name:"Rice Cakes (2 plain)", cat:"CARBS", cal:70, pro:1.4, carb:15, fat:0.5 },
  // ── More Dairy ─────────────────────────────────────────────────────────────
  { name:"String Cheese (1 stick)", cat:"DAIRY", cal:80, pro:7, carb:1, fat:5 },
  { name:"Cream Cheese 2 tbsp", cat:"DAIRY", cal:100, pro:2, carb:2, fat:10 },
  { name:"Sour Cream 2 tbsp", cat:"DAIRY", cal:60, pro:0.9, carb:1.2, fat:5.9 },
  { name:"Butter 1 tbsp", cat:"DAIRY", cal:102, pro:0.1, carb:0, fat:11.5 },
  { name:"Heavy Cream 1 tbsp", cat:"DAIRY", cal:51, pro:0.3, carb:0.4, fat:5.4 },
  { name:"Full-Fat Greek Yogurt 170g", cat:"DAIRY", cal:160, pro:15, carb:6, fat:8 },
  { name:"Kefir 240ml", cat:"DAIRY", cal:150, pro:10, carb:12, fat:5 },
  { name:"Ricotta Cheese 60g", cat:"DAIRY", cal:107, pro:7, carb:2, fat:8 },
  { name:"Mozzarella 28g", cat:"DAIRY", cal:85, pro:6.3, carb:0.6, fat:6.3 },
  // ── More Fruits ────────────────────────────────────────────────────────────
  { name:"Orange (medium)", cat:"FRUIT", cal:62, pro:1.2, carb:15, fat:0.2 },
  { name:"Mango (cup, 165g)", cat:"FRUIT", cal:99, pro:1.4, carb:25, fat:0.6 },
  { name:"Peach (medium)", cat:"FRUIT", cal:58, pro:1.4, carb:14, fat:0.4 },
  { name:"Grapes (cup, 151g)", cat:"FRUIT", cal:104, pro:1.1, carb:27, fat:0.2 },
  { name:"Watermelon (cup, 152g)", cat:"FRUIT", cal:46, pro:0.9, carb:11.5, fat:0.2 },
  { name:"Pineapple (cup, 165g)", cat:"FRUIT", cal:82, pro:0.9, carb:22, fat:0.2 },
  { name:"Kiwi (1 medium)", cat:"FRUIT", cal:42, pro:0.8, carb:10, fat:0.4 },
  { name:"Grapefruit (half)", cat:"FRUIT", cal:52, pro:0.9, carb:13, fat:0.2 },
  { name:"Raspberries (cup, 123g)", cat:"FRUIT", cal:64, pro:1.5, carb:15, fat:0.8 },
  { name:"Blackberries (cup, 144g)", cat:"FRUIT", cal:62, pro:2, carb:14, fat:0.7 },
  { name:"Cherries (cup, 138g)", cat:"FRUIT", cal:87, pro:1.5, carb:22, fat:0.3 },
  { name:"Pear (medium)", cat:"FRUIT", cal:101, pro:0.6, carb:27, fat:0.2 },
  // ── More Vegetables ────────────────────────────────────────────────────────
  { name:"Bell Pepper (1 medium)", cat:"VEG", cal:31, pro:1, carb:7, fat:0.3 },
  { name:"Cucumber 100g", cat:"VEG", cal:15, pro:0.7, carb:3.6, fat:0.1 },
  { name:"Asparagus (5 spears)", cat:"VEG", cal:20, pro:2.2, carb:3.7, fat:0.2 },
  { name:"Zucchini 100g", cat:"VEG", cal:17, pro:1.2, carb:3.1, fat:0.3 },
  { name:"Kale 100g", cat:"VEG", cal:49, pro:4.3, carb:9, fat:0.9 },
  { name:"Cauliflower 100g", cat:"VEG", cal:25, pro:1.9, carb:5, fat:0.3 },
  { name:"Brussels Sprouts 100g", cat:"VEG", cal:43, pro:3.4, carb:9, fat:0.3 },
  { name:"Mushrooms 100g", cat:"VEG", cal:22, pro:3.1, carb:3.3, fat:0.3 },
  { name:"Tomato (medium)", cat:"VEG", cal:22, pro:1.1, carb:4.8, fat:0.2 },
  { name:"Carrot (1 medium)", cat:"VEG", cal:25, pro:0.6, carb:6, fat:0.1 },
  { name:"Green Beans 100g", cat:"VEG", cal:31, pro:1.8, carb:7, fat:0.1 },
  { name:"Edamame (shelled) 100g", cat:"VEG", cal:121, pro:11, carb:9, fat:5.2 },
  { name:"Celery (2 stalks)", cat:"VEG", cal:14, pro:0.7, carb:3, fat:0.2 },
  { name:"Onion 100g", cat:"VEG", cal:40, pro:1.1, carb:9.3, fat:0.1 },
  // ── More Nuts & Seeds ──────────────────────────────────────────────────────
  { name:"Cashews 28g", cat:"NUTS", cal:157, pro:5.2, carb:8.6, fat:12.4 },
  { name:"Pistachios 28g", cat:"NUTS", cal:159, pro:5.7, carb:7.7, fat:12.9 },
  { name:"Pecans 28g", cat:"NUTS", cal:196, pro:2.6, carb:3.9, fat:20.4 },
  { name:"Macadamia Nuts 28g", cat:"NUTS", cal:204, pro:2.2, carb:3.9, fat:21.5 },
  { name:"Chia Seeds 1 tbsp", cat:"NUTS", cal:58, pro:2, carb:5, fat:3.7 },
  { name:"Sunflower Seeds 28g", cat:"NUTS", cal:166, pro:5.8, carb:6.8, fat:14.4 },
  { name:"Pumpkin Seeds 28g", cat:"NUTS", cal:151, pro:8.5, carb:5, fat:13 },
  { name:"Flaxseed 1 tbsp", cat:"NUTS", cal:55, pro:1.9, carb:3, fat:4.3 },
  { name:"Hemp Seeds 3 tbsp", cat:"NUTS", cal:166, pro:9.5, carb:2.6, fat:14.6 },
  // ── Fast Food Additions ────────────────────────────────────────────────────
  { name:"BK Whopper", cat:"FAST FOOD", cal:657, pro:28, carb:49, fat:40 },
  { name:"Wendy's Dave's Single", cat:"FAST FOOD", cal:590, pro:34, carb:39, fat:34 },
  { name:"Taco Bell Chicken Burrito", cat:"FAST FOOD", cal:510, pro:22, carb:68, fat:16 },
  { name:"Taco Bell Crunchy Taco", cat:"FAST FOOD", cal:170, pro:8, carb:13, fat:9 },
  { name:"Chick-fil-A Nuggets 8pc", cat:"FAST FOOD", cal:260, pro:26, carb:14, fat:12 },
  { name:"McDonald's McDouble", cat:"FAST FOOD", cal:400, pro:22, carb:34, fat:19 },
  { name:"McDonald's Fries (med)", cat:"FAST FOOD", cal:320, pro:4.4, carb:44, fat:15 },
  { name:"Domino's Pepperoni Slice", cat:"FAST FOOD", cal:300, pro:13, carb:35, fat:12 },
  { name:"Papa John's Cheese Slice", cat:"FAST FOOD", cal:290, pro:12, carb:36, fat:11 },
  // ── Restaurant Additions ───────────────────────────────────────────────────
  { name:"Panera Chicken Avocado Melt", cat:"RESTAURANT", cal:620, pro:45, carb:54, fat:24 },
  { name:"Panera Bread Mac & Cheese", cat:"RESTAURANT", cal:970, pro:34, carb:105, fat:46 },
  { name:"Panda Express Orange Chicken", cat:"RESTAURANT", cal:420, pro:14, carb:57, fat:20 },
  { name:"Panda Express Chow Mein", cat:"RESTAURANT", cal:510, pro:14, carb:80, fat:21 },
  { name:"Chipotle Steak Bowl", cat:"RESTAURANT", cal:710, pro:53, carb:72, fat:18 },
  { name:"Chipotle Burrito (full)", cat:"RESTAURANT", cal:1075, pro:51, carb:114, fat:36 },
  { name:"Sushi Roll (California, 6pc)", cat:"RESTAURANT", cal:255, pro:9, carb:38, fat:7 },
  { name:"Sushi Roll (Spicy Tuna, 6pc)", cat:"RESTAURANT", cal:290, pro:14, carb:32, fat:11 },
  { name:"Pad Thai (restaurant, 1 cup)", cat:"RESTAURANT", cal:400, pro:20, carb:54, fat:11 },
  { name:"Chicken Fried Rice (1 cup)", cat:"RESTAURANT", cal:343, pro:17, carb:55, fat:6.5 },
  { name:"Beef & Broccoli (1 cup)", cat:"RESTAURANT", cal:336, pro:24, carb:22, fat:17 },
  { name:"Chicken Tikka Masala (1 cup)", cat:"RESTAURANT", cal:310, pro:26, carb:12, fat:18 },
  { name:"Beef Tacos (2, hard shell)", cat:"RESTAURANT", cal:370, pro:18, carb:34, fat:17 },
  { name:"Cheese Quesadilla (1 large)", cat:"RESTAURANT", cal:520, pro:22, carb:52, fat:26 },
  { name:"Pasta Primavera (1 cup)", cat:"RESTAURANT", cal:330, pro:12, carb:51, fat:9 },
  // ── More Snacks ────────────────────────────────────────────────────────────
  { name:"Popcorn (3 cups, air-pop)", cat:"SNACK", cal:93, pro:3, carb:19, fat:1.1 },
  { name:"Potato Chips 28g", cat:"SNACK", cal:152, pro:2, carb:15, fat:10 },
  { name:"Pretzels 28g", cat:"SNACK", cal:108, pro:2.6, carb:23, fat:0.8 },
  { name:"Dark Chocolate 28g", cat:"SNACK", cal:170, pro:2, carb:13, fat:12 },
  { name:"Granola Bar (generic)", cat:"SNACK", cal:193, pro:4, carb:29, fat:7.6 },
  { name:"Cheese & Crackers (snack pk)", cat:"SNACK", cal:210, pro:6, carb:24, fat:11 },
  { name:"Trail Mix 28g", cat:"SNACK", cal:131, pro:3.7, carb:12, fat:8.3 },
  { name:"Hummus 2 tbsp", cat:"SNACK", cal:70, pro:2, carb:8, fat:3 },
  { name:"Rice Cake with PB", cat:"SNACK", cal:165, pro:5, carb:19, fat:8 },
  { name:"Banana Chips 28g", cat:"SNACK", cal:147, pro:0.7, carb:17, fat:9.5 },
  { name:"Dried Mango 40g", cat:"SNACK", cal:128, pro:0.8, carb:33, fat:0.2 },
  { name:"Gummy Bears 10 pieces", cat:"SNACK", cal:87, pro:2, carb:20, fat:0 },
  // ── More Beverages ─────────────────────────────────────────────────────────
  { name:"Orange Juice 240ml", cat:"BEVERAGE", cal:112, pro:1.7, carb:26, fat:0.5 },
  { name:"Apple Juice 240ml", cat:"BEVERAGE", cal:114, pro:0.1, carb:28, fat:0.3 },
  { name:"Sports Drink (Gatorade) 590ml", cat:"BEVERAGE", cal:140, pro:0, carb:36, fat:0 },
  { name:"Almond Milk (unsweetened) 240ml", cat:"BEVERAGE", cal:30, pro:1, carb:1, fat:2.5 },
  { name:"Oat Milk 240ml", cat:"BEVERAGE", cal:120, pro:3, carb:16, fat:5 },
  { name:"Protein Coffee 355ml", cat:"BEVERAGE", cal:160, pro:20, carb:16, fat:2.5 },
  { name:"Green Tea 240ml", cat:"BEVERAGE", cal:2, pro:0, carb:0, fat:0 },
  { name:"Black Coffee 240ml", cat:"BEVERAGE", cal:5, pro:0.3, carb:0, fat:0 },
  { name:"Cold Brew 355ml", cat:"BEVERAGE", cal:30, pro:1.5, carb:3, fat:0 },
  { name:"Kombucha 355ml", cat:"BEVERAGE", cal:70, pro:0, carb:18, fat:0 },
  // ── More Brands ────────────────────────────────────────────────────────────
  { name:"Kirkland Chicken Breast 100g", cat:"BRAND", cal:130, pro:27, carb:0, fat:2 },
  { name:"Dannon Light & Fit 150g", cat:"BRAND", cal:80, pro:12, carb:9, fat:0 },
  { name:"Yoplait Original 170g", cat:"BRAND", cal:170, pro:5, carb:33, fat:1.5 },
  { name:"Fairlife 2% Milk 240ml", cat:"BRAND", cal:80, pro:13, carb:6, fat:2.5 },
  { name:"Good Culture Cottage 226g", cat:"BRAND", cal:180, pro:25, carb:6, fat:5 },
  { name:"Oikos Pro Yogurt 150g", cat:"BRAND", cal:130, pro:20, carb:6, fat:2 },
  { name:"Built Bar (Choc Mint)", cat:"BRAND", cal:130, pro:17, carb:14, fat:2.5 },
  { name:"Kirkland Protein Bar", cat:"BRAND", cal:190, pro:21, carb:20, fat:7 },
  { name:"Lenny & Larry's Cookie", cat:"BRAND", cal:420, pro:16, carb:66, fat:12 },
  { name:"Special K Protein Bar", cat:"BRAND", cal:170, pro:12, carb:24, fat:4 },
];
const FOOD_CATS = ["ALL","BREAKFAST","PROTEIN","CARBS","DAIRY","FRUIT","VEG","NUTS","FAT","SUPPLEMENT","FAST FOOD","RESTAURANT","SNACK","BRAND","BEVERAGE"];
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
  // ── PROTEIN ──
  { name:"Whey Protein",           type:"PROTEIN",     serving:"1 scoop (30g)",   cal:120,  pro:24, carb:3,   fat:1.5, brand:"Generic" },
  { name:"Whey Isolate",           type:"PROTEIN",     serving:"1 scoop (30g)",   cal:110,  pro:27, carb:1,   fat:0.5, brand:"Generic" },
  { name:"Casein Protein",         type:"PROTEIN",     serving:"1 scoop (33g)",   cal:110,  pro:23, carb:3,   fat:1,   brand:"Generic" },
  { name:"Plant Protein",          type:"PROTEIN",     serving:"1 scoop (30g)",   cal:110,  pro:20, carb:5,   fat:2,   brand:"Generic" },
  { name:"Egg White Protein",      type:"PROTEIN",     serving:"1 scoop (28g)",   cal:100,  pro:22, carb:2,   fat:0.5, brand:"Generic" },
  { name:"Beef Protein Isolate",   type:"PROTEIN",     serving:"1 scoop (30g)",   cal:120,  pro:25, carb:2,   fat:1.5, brand:"Generic" },
  { name:"Mass Gainer",            type:"PROTEIN",     serving:"3 scoops (250g)", cal:1250, pro:50, carb:248, fat:3.5, brand:"Generic" },
  { name:"Protein Bar",            type:"PROTEIN",     serving:"1 bar (60g)",     cal:210,  pro:20, carb:21,  fat:7,   brand:"Generic" },

  // ── AMINO ACIDS ──
  { name:"BCAAs",                  type:"AMINO",       serving:"7g",              cal:20,   pro:5,  carb:0,   fat:0,   brand:"Generic" },
  { name:"EAAs",                   type:"AMINO",       serving:"10g",             cal:35,   pro:9,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Glutamine",            type:"AMINO",       serving:"5g",              cal:20,   pro:5,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Citrulline",           type:"AMINO",       serving:"6g",              cal:24,   pro:6,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Arginine",             type:"AMINO",       serving:"3g",              cal:12,   pro:3,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Leucine",              type:"AMINO",       serving:"5g",              cal:20,   pro:5,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Carnitine",            type:"AMINO",       serving:"1g",              cal:4,    pro:1,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Tyrosine",             type:"AMINO",       serving:"500mg",           cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Taurine",                type:"AMINO",       serving:"2g",              cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Beta-Alanine",           type:"AMINO",       serving:"3.2g",            cal:8,    pro:2,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Glycine",                type:"AMINO",       serving:"3g",              cal:12,   pro:3,  carb:0,   fat:0,   brand:"Generic" },

  // ── PRE-WORKOUT ──
  { name:"Pre-Workout",            type:"PRE-WORKOUT", serving:"1 scoop (15g)",   cal:10,   pro:1,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Pre-Workout (Stim-Free)",type:"PRE-WORKOUT", serving:"1 scoop (14g)",   cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Nitric Oxide Booster",   type:"PRE-WORKOUT", serving:"1 scoop (10g)",   cal:5,    pro:1,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Pump Formula",           type:"PRE-WORKOUT", serving:"1 scoop (8g)",    cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },

  // ── STRENGTH ──
  { name:"Creatine Monohydrate",   type:"STRENGTH",    serving:"5g",              cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Creatine HCL",           type:"STRENGTH",    serving:"2g",              cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Creatine Gummies",       type:"STRENGTH",    serving:"2 gummies (5g cr)",cal:15,  pro:0,  carb:4,   fat:0,   brand:"Generic" },
  { name:"HMB",                    type:"STRENGTH",    serving:"3g",              cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Testosterone Booster",   type:"STRENGTH",    serving:"2 capsules",      cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },

  // ── ENERGY ──
  { name:"Caffeine",               type:"ENERGY",      serving:"200mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Energy Drink (Sugar-Free)",type:"ENERGY",    serving:"1 can (16oz)",    cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Green Tea Extract",      type:"ENERGY",      serving:"500mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Yerba Mate",             type:"ENERGY",      serving:"1 serving",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },

  // ── RECOVERY ──
  { name:"Collagen Peptides",      type:"RECOVERY",    serving:"10g",             cal:40,   pro:9,  carb:0,   fat:0,   brand:"Generic" },
  { name:"CoQ10",                  type:"RECOVERY",    serving:"100mg softgel",   cal:5,    pro:0,  carb:0,   fat:0.5, brand:"Generic" },
  { name:"Probiotics",             type:"RECOVERY",    serving:"1 capsule",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Glutathione",            type:"RECOVERY",    serving:"500mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"CBD Oil",                type:"RECOVERY",    serving:"1 dropper (1ml)", cal:5,    pro:0,  carb:0,   fat:0.5, brand:"Generic" },
  { name:"Tart Cherry Extract",    type:"RECOVERY",    serving:"480mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Joint Support",          type:"RECOVERY",    serving:"3 capsules",      cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Glucosamine & Chondroitin",type:"RECOVERY",  serving:"2 tablets",       cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },

  // ── VITAMINS ──
  { name:"Vitamin D3",             type:"VITAMIN",     serving:"1 capsule",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Vitamin D3 + K2",        type:"VITAMIN",     serving:"1 capsule",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Vitamin C",              type:"VITAMIN",     serving:"500mg tab",       cal:2,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Vitamin B12",            type:"VITAMIN",     serving:"1 tablet",        cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Vitamin B Complex",      type:"VITAMIN",     serving:"1 capsule",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Vitamin E",              type:"VITAMIN",     serving:"400 IU softgel",  cal:10,   pro:0,  carb:0,   fat:1,   brand:"Generic" },
  { name:"Vitamin A",              type:"VITAMIN",     serving:"1 softgel",       cal:5,    pro:0,  carb:0,   fat:0.5, brand:"Generic" },
  { name:"Vitamin K2 (MK-7)",      type:"VITAMIN",     serving:"100mcg cap",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Folate (B9)",            type:"VITAMIN",     serving:"400mcg tab",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Biotin (B7)",            type:"VITAMIN",     serving:"5000mcg cap",     cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Multivitamin",           type:"VITAMIN",     serving:"1 tablet",        cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Men's Multivitamin",     type:"VITAMIN",     serving:"2 tablets",       cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Women's Multivitamin",   type:"VITAMIN",     serving:"2 tablets",       cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Prenatal Vitamin",       type:"VITAMIN",     serving:"1 tablet",        cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },

  // ── MINERALS ──
  { name:"Magnesium Glycinate",    type:"MINERAL",     serving:"400mg",           cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Magnesium Malate",       type:"MINERAL",     serving:"400mg",           cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Magnesium Citrate",      type:"MINERAL",     serving:"200mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Zinc",                   type:"MINERAL",     serving:"25mg cap",        cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Zinc + Magnesium (ZMA)", type:"MINERAL",     serving:"3 capsules",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Iron",                   type:"MINERAL",     serving:"18mg tab",        cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Calcium",                type:"MINERAL",     serving:"500mg tab",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Potassium",              type:"MINERAL",     serving:"99mg cap",        cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Iodine",                 type:"MINERAL",     serving:"150mcg tab",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Chromium Picolinate",    type:"MINERAL",     serving:"200mcg cap",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Selenium",               type:"MINERAL",     serving:"200mcg cap",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },

  // ── OMEGA / FATS ──
  { name:"Fish Oil (Omega-3)",     type:"OMEGA",       serving:"2 softgels",      cal:20,   pro:0,  carb:0,   fat:2,   brand:"Generic" },
  { name:"Krill Oil",              type:"OMEGA",       serving:"2 softgels",      cal:25,   pro:0,  carb:0,   fat:2.5, brand:"Generic" },
  { name:"Algae Omega-3 (Vegan)",  type:"OMEGA",       serving:"2 softgels",      cal:15,   pro:0,  carb:0,   fat:1.5, brand:"Generic" },
  { name:"CLA",                    type:"OMEGA",       serving:"2 softgels",      cal:25,   pro:0,  carb:0,   fat:2.5, brand:"Generic" },
  { name:"MCT Oil",                type:"OMEGA",       serving:"1 tbsp (14ml)",   cal:115,  pro:0,  carb:0,   fat:14,  brand:"Generic" },
  { name:"Flaxseed Oil",           type:"OMEGA",       serving:"1 tbsp",          cal:120,  pro:0,  carb:0,   fat:14,  brand:"Generic" },

  // ── HYDRATION ──
  { name:"Electrolytes",           type:"HYDRATION",   serving:"1 packet",        cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Coconut Water Powder",   type:"HYDRATION",   serving:"1 scoop (10g)",   cal:40,   pro:0,  carb:9,   fat:0,   brand:"Generic" },
  { name:"Sodium Tablets",         type:"HYDRATION",   serving:"1 tablet",        cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"LMNT Electrolytes",      type:"HYDRATION",   serving:"1 packet",        cal:0,    pro:0,  carb:0,   fat:0,   brand:"LMNT" },
  { name:"Liquid IV",              type:"HYDRATION",   serving:"1 stick pack",    cal:45,   pro:0,  carb:11,  fat:0,   brand:"Liquid IV" },
  { name:"Nuun Tablets",           type:"HYDRATION",   serving:"1 tablet",        cal:10,   pro:0,  carb:2,   fat:0,   brand:"Nuun" },

  // ── SLEEP ──
  { name:"Melatonin",              type:"SLEEP",       serving:"5mg tablet",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Melatonin (Low Dose)",   type:"SLEEP",       serving:"0.5mg tablet",    cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Magnesium Glycinate (Sleep)",type:"SLEEP",   serving:"400mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"L-Theanine",             type:"SLEEP",       serving:"200mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"GABA",                   type:"SLEEP",       serving:"750mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"5-HTP",                  type:"SLEEP",       serving:"100mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Valerian Root",          type:"SLEEP",       serving:"450mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"ZMA",                    type:"SLEEP",       serving:"3 capsules",      cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
  { name:"Sleep Support Complex",  type:"SLEEP",       serving:"2 capsules",      cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },

  // ── ADAPTOGEN ──
  { name:"Ashwagandha",            type:"ADAPTOGEN",   serving:"600mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Ashwagandha KSM-66",     type:"ADAPTOGEN",   serving:"300mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Turmeric/Curcumin",      type:"ADAPTOGEN",   serving:"500mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Rhodiola Rosea",         type:"ADAPTOGEN",   serving:"400mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Lion's Mane",            type:"ADAPTOGEN",   serving:"500mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Reishi Mushroom",        type:"ADAPTOGEN",   serving:"500mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Chaga Mushroom",         type:"ADAPTOGEN",   serving:"500mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Cordyceps",              type:"ADAPTOGEN",   serving:"500mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Holy Basil (Tulsi)",     type:"ADAPTOGEN",   serving:"400mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Maca Root",              type:"ADAPTOGEN",   serving:"1500mg cap",      cal:10,   pro:0,  carb:2,   fat:0,   brand:"Generic" },
  { name:"Ginseng",                type:"ADAPTOGEN",   serving:"200mg cap",       cal:5,    pro:0,  carb:1,   fat:0,   brand:"Generic" },
  { name:"Berberine",              type:"ADAPTOGEN",   serving:"500mg cap",       cal:0,    pro:0,  carb:0,   fat:0,   brand:"Generic" },
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
  // CHEST
  "Barbell Bench Press":           { chest:1.0, front_delt:0.5, tricep:0.4 },
  "Incline Barbell Press":         { chest:0.9, front_delt:0.7, tricep:0.35 },
  "Decline Bench Press":           { chest:0.95, front_delt:0.35, tricep:0.45 },
  "Dumbbell Bench Press":          { chest:0.95, front_delt:0.5, tricep:0.4 },
  "Incline Dumbbell Press":        { chest:0.85, front_delt:0.65, tricep:0.3 },
  "Decline Dumbbell Press":        { chest:0.9, front_delt:0.3, tricep:0.4 },
  "Cable Flyes":                   { chest:0.95, front_delt:0.15 },
  "Dumbbell Flyes":                { chest:0.95, front_delt:0.15 },
  "Incline Cable Flyes":           { chest:0.9, front_delt:0.25 },
  "Pec Deck Machine":              { chest:1.0, front_delt:0.1 },
  "Push-Ups":                      { chest:0.8, front_delt:0.5, tricep:0.5 },
  "Chest Dip":                     { chest:0.85, front_delt:0.45, tricep:0.55 },
  "Machine Chest Press":           { chest:0.95, front_delt:0.4, tricep:0.35 },
  "Low Cable Crossover":           { chest:0.95, front_delt:0.2 },
  // BACK
  "Barbell Deadlift":              { lower_back:0.9, glute:0.8, hamstring:0.75, trap:0.6, lat:0.5, quad:0.4 },
  "Romanian Deadlift":             { hamstring:1.0, glute:0.85, lower_back:0.7 },
  "Trap Bar Deadlift":             { quad:0.9, glute:0.75, hamstring:0.55, lower_back:0.6, trap:0.5 },
  "Rack Pull":                     { lower_back:0.85, trap:0.75, lat:0.4, glute:0.5, hamstring:0.4 },
  "Barbell Row":                   { lat:1.0, mid_back:0.9, rear_delt:0.6, bicep:0.5, trap:0.4 },
  "Pendlay Row":                   { lat:0.95, mid_back:0.95, rear_delt:0.65, bicep:0.55, trap:0.45 },
  "Dumbbell Row":                  { lat:0.9, mid_back:0.8, rear_delt:0.5, bicep:0.55 },
  "T-Bar Row":                     { lat:0.9, mid_back:0.95, rear_delt:0.55, bicep:0.5, trap:0.45 },
  "Chest-Supported Row":           { mid_back:1.0, lat:0.7, rear_delt:0.6, bicep:0.45 },
  "Seated Cable Row":              { lat:0.85, mid_back:0.9, rear_delt:0.5, bicep:0.5 },
  "Single-Arm Cable Row":          { lat:0.85, mid_back:0.8, rear_delt:0.45, bicep:0.5 },
  "Wide-Grip Seated Cable Row":    { lat:0.9, mid_back:0.75, rear_delt:0.55, bicep:0.4 },
  "Lat Pulldown":                  { lat:0.95, mid_back:0.6, bicep:0.55, rear_delt:0.4 },
  "Close-Grip Lat Pulldown":       { lat:0.9, mid_back:0.5, bicep:0.7, rear_delt:0.35 },
  "Pull-Ups":                      { lat:1.0, mid_back:0.65, bicep:0.6, rear_delt:0.4 },
  "Chin-Ups":                      { lat:0.9, mid_back:0.6, bicep:0.85, rear_delt:0.35 },
  "Straight-Arm Pulldown":         { lat:1.0, mid_back:0.4, tricep:0.3 },
  "Hyperextensions":               { lower_back:1.0, glute:0.6, hamstring:0.5 },
  // LEGS
  "Barbell Squat":                 { quad:1.0, glute:0.8, hamstring:0.5, lower_back:0.4 },
  "Front Squat":                   { quad:1.0, glute:0.65, lower_back:0.3 },
  "Hack Squat":                    { quad:1.0, glute:0.6, hamstring:0.35 },
  "Goblet Squat":                  { quad:0.85, glute:0.7, lower_back:0.25 },
  "Box Squat":                     { quad:0.85, glute:0.85, hamstring:0.55, lower_back:0.45 },
  "Leg Press":                     { quad:0.9, glute:0.7, hamstring:0.3 },
  "Single Leg Press":              { quad:0.85, glute:0.65, hamstring:0.3 },
  "Bulgarian Split Squat":         { quad:0.95, glute:0.9, hamstring:0.45 },
  "Walking Lunges":                { quad:0.85, glute:0.85, hamstring:0.4 },
  "Reverse Lunges":                { quad:0.8, glute:0.9, hamstring:0.45 },
  "Dumbbell Lunge":                { quad:0.8, glute:0.85, hamstring:0.4 },
  "Step-Ups":                      { quad:0.75, glute:0.9, hamstring:0.35 },
  "Leg Extension":                 { quad:1.0 },
  "Leg Curl":                      { hamstring:1.0, glute:0.3 },
  "Seated Leg Curl":               { hamstring:1.0, glute:0.25 },
  "Nordic Hamstring Curl":         { hamstring:1.0, glute:0.4, lower_back:0.25 },
  "Hip Thrust":                    { glute:1.0, hamstring:0.5 },
  "Glute Bridge":                  { glute:1.0, hamstring:0.4 },
  "Kettlebell Swing":              { glute:0.95, hamstring:0.8, lower_back:0.7, quad:0.4 },
  "Calf Raise":                    { calf:1.0 },
  "Seated Calf Raise":             { calf:1.0 },
  // SHOULDERS
  "Barbell Overhead Press":        { front_delt:1.0, mid_delt:0.65, tricep:0.6, trap:0.35 },
  "Seated Dumbbell Press":         { front_delt:0.85, mid_delt:0.75, tricep:0.5, trap:0.3 },
  "Machine Shoulder Press":        { front_delt:0.8, mid_delt:0.7, tricep:0.5 },
  "Arnold Press":                  { front_delt:0.85, mid_delt:0.85, rear_delt:0.4, tricep:0.5 },
  "Push Press":                    { front_delt:0.9, mid_delt:0.6, tricep:0.55, trap:0.4, quad:0.35 },
  "Lateral Raises":                { mid_delt:1.0, rear_delt:0.3, trap:0.2 },
  "Cable Lateral Raises":          { mid_delt:0.95, rear_delt:0.25, trap:0.15 },
  "Front Raises":                  { front_delt:1.0, mid_delt:0.3 },
  "Rear Delt Flyes":               { rear_delt:1.0, mid_back:0.45, trap:0.3 },
  "Machine Rear Delt Flyes":       { rear_delt:1.0, mid_back:0.4, trap:0.25 },
  "Cable Face Pulls":              { rear_delt:0.9, mid_back:0.5, trap:0.35 },
  "Upright Row":                   { mid_delt:0.85, trap:0.85, front_delt:0.4, bicep:0.35 },
  "Barbell Shrugs":                { trap:1.0, mid_delt:0.2 },
  "Dumbbell Shrugs":               { trap:1.0, mid_delt:0.2 },
  // ARMS
  "Barbell Curl":                  { bicep:1.0, forearm:0.4 },
  "Dumbbell Curl":                 { bicep:1.0, forearm:0.35 },
  "Hammer Curl":                   { bicep:0.85, forearm:0.8 },
  "Preacher Curl":                 { bicep:1.0, forearm:0.25 },
  "Concentration Curl":            { bicep:1.0, forearm:0.2 },
  "Incline Dumbbell Curl":         { bicep:1.0, forearm:0.3 },
  "Cable Curl":                    { bicep:0.95, forearm:0.3 },
  "EZ Bar Curl":                   { bicep:0.95, forearm:0.4 },
  "Zottman Curl":                  { bicep:0.85, forearm:0.9 },
  "Reverse Curl":                  { forearm:0.95, bicep:0.6 },
  "Tricep Pushdown":               { tricep:1.0, forearm:0.2 },
  "Rope Pushdown":                 { tricep:1.0, forearm:0.25 },
  "Skull Crushers":                { tricep:1.0 },
  "Close-Grip Bench Press":        { tricep:0.95, chest:0.5, front_delt:0.4 },
  "Tricep Overhead Extension":     { tricep:1.0 },
  "Cable Overhead Tricep Extension":{ tricep:1.0 },
  "Tricep Kickback":               { tricep:0.9, forearm:0.15 },
  "Dips":                          { tricep:0.9, chest:0.6, front_delt:0.4 },
  // CORE
  "Plank":                         { upper_abs:0.8, lower_abs:0.65, oblique:0.6, lower_back:0.45 },
  "Side Plank":                    { oblique:1.0, lower_back:0.5, hip_flexor:0.3 },
  "Ab Wheel":                      { upper_abs:0.95, lower_abs:0.9, oblique:0.5, lower_back:0.3 },
  "Hanging Leg Raises":            { lower_abs:1.0, hip_flexor:0.85, upper_abs:0.5 },
  "Leg Raises":                    { lower_abs:0.95, hip_flexor:0.8, upper_abs:0.4 },
  "Russian Twists":                { oblique:1.0, upper_abs:0.5 },
  "Bicycle Crunches":              { oblique:0.95, upper_abs:0.75, lower_abs:0.5 },
  "Crunch":                        { upper_abs:0.95, lower_abs:0.5 },
  "Decline Crunches":              { upper_abs:1.0, lower_abs:0.55 },
  "Sit-Ups":                       { upper_abs:0.9, lower_abs:0.7, hip_flexor:0.5 },
  "Cable Crunch":                  { upper_abs:1.0, lower_abs:0.65, oblique:0.4 },
  "V-Ups":                         { upper_abs:0.9, lower_abs:0.9, hip_flexor:0.5 },
  "Dragon Flag":                   { upper_abs:0.95, lower_abs:0.95, lower_back:0.4 },
  "Dead Bug":                      { upper_abs:0.75, lower_abs:0.8, hip_flexor:0.6 },
  "Pallof Press":                  { oblique:0.9, upper_abs:0.6, lower_back:0.4 },
  "Flutter Kicks":                 { lower_abs:0.9, hip_flexor:0.85, upper_abs:0.4 },
  "Mountain Climbers":             { upper_abs:0.7, lower_abs:0.6, hip_flexor:0.8, quad:0.4 },
  // CARDIO
  "Jump Rope":                     { calf:1.0, quad:0.4, forearm:0.25 },
  "Assault Bike":                  { quad:0.75, glute:0.5, front_delt:0.35, upper_abs:0.35 },
  "Box Jumps":                     { quad:0.8, glute:0.8, calf:0.65, hamstring:0.45 },
  "Burpees":                       { quad:0.7, glute:0.6, chest:0.5, front_delt:0.4, upper_abs:0.5 },
  "Battle Ropes":                  { front_delt:0.85, mid_delt:0.65, bicep:0.4, forearm:0.6, upper_abs:0.45 },
  "Sled Push":                     { quad:0.9, glute:0.8, lower_back:0.5, front_delt:0.4 },
  "Rowing Machine":                { lat:0.8, mid_back:0.7, bicep:0.5, quad:0.6, glute:0.4 },
  "Treadmill Run":                 { quad:0.7, hamstring:0.5, glute:0.6, calf:0.8 },
  "Stair Climber":                 { quad:0.8, glute:0.85, calf:0.7, hamstring:0.4 },
  "Jump Squats":                   { quad:0.85, glute:0.8, calf:0.5, hamstring:0.4 },
  "High Knees":                    { hip_flexor:0.85, quad:0.65, calf:0.6 },
  "Bear Crawl":                    { chest:0.55, front_delt:0.5, tricep:0.4, upper_abs:0.6, lower_abs:0.4 },
  "Farmer's Walk":                 { trap:0.9, forearm:0.85, lower_back:0.6, glute:0.4 },
  // CHEST additions
  "Cable Chest Press":             { chest:0.95, front_delt:0.4, tricep:0.35 },
  "Dumbbell Pullover":             { chest:0.7, lat:0.8, tricep:0.3 },
  "Barbell Floor Press":           { chest:0.9, tricep:0.7, front_delt:0.35 },
  "Dumbbell Floor Press":          { chest:0.85, tricep:0.65, front_delt:0.3 },
  "Svend Press":                   { chest:1.0, front_delt:0.2 },
  // BACK additions
  "Renegade Row":                  { lat:0.8, mid_back:0.7, bicep:0.45, upper_abs:0.5 },
  "Dumbbell Deadlift":             { lower_back:0.75, glute:0.7, hamstring:0.6, quad:0.5 },
  "Dumbbell Good Mornings":        { lower_back:0.9, hamstring:0.7, glute:0.5 },
  "Barbell Good Mornings":         { lower_back:0.95, hamstring:0.75, glute:0.5 },
  "Sumo Deadlift":                 { glute:0.95, quad:0.8, hamstring:0.65, lower_back:0.6, trap:0.4 },
  "Landmine Row":                  { lat:0.9, mid_back:0.85, rear_delt:0.55, bicep:0.5 },
  "Landmine Romanian Deadlift":    { hamstring:0.95, glute:0.9, lower_back:0.65 },
  "Meadows Row":                   { lat:0.95, mid_back:0.8, rear_delt:0.5, bicep:0.55 },
  // LEGS additions
  "Landmine Squat":                { quad:0.9, glute:0.8, lower_back:0.3 },
  "Landmine Split Squat":          { quad:0.9, glute:0.85, hamstring:0.45 },
  "Pistol Squat":                  { quad:1.0, glute:0.8, hamstring:0.4, hip_flexor:0.5 },
  "Sissy Squat":                   { quad:1.0, hip_flexor:0.5 },
  "Reverse Hypers":                { glute:0.9, hamstring:0.7, lower_back:0.65 },
  "Hip Abductor Machine":          { glute:0.9, hip_flexor:0.5 },
  "Cable Pull-Through":            { glute:0.9, hamstring:0.65, lower_back:0.5 },
  "Cable Glute Kickback":          { glute:1.0, hamstring:0.3 },
  "Cable Hip Abduction":           { glute:0.85, hip_flexor:0.4 },
  "Cable Romanian Deadlift":       { hamstring:0.95, glute:0.8, lower_back:0.65 },
  "Dumbbell Romanian Deadlift":    { hamstring:1.0, glute:0.8, lower_back:0.65 },
  "Dumbbell Hip Thrust":           { glute:1.0, hamstring:0.45 },
  "Dumbbell Sumo Squat":           { quad:0.7, glute:0.9, hamstring:0.4 },
  "Dumbbell Calf Raise":           { calf:1.0 },
  // SHOULDERS additions
  "Cable Upright Row":             { mid_delt:0.85, trap:0.8, front_delt:0.35, bicep:0.3 },
  "Dumbbell Upright Row":          { mid_delt:0.8, trap:0.75, front_delt:0.3, bicep:0.3 },
  "Landmine Press":                { front_delt:0.85, mid_delt:0.55, chest:0.4, tricep:0.45 },
  "Landmine Lateral Raise":        { mid_delt:0.95, rear_delt:0.3, trap:0.2 },
  "Bradford Press":                { front_delt:0.9, mid_delt:0.75, trap:0.4, tricep:0.35 },
  "Cable Y-Raise":                 { rear_delt:0.85, mid_back:0.55, trap:0.4 },
  // ARMS additions
  "Dumbbell Skull Crushers":       { tricep:1.0 },
  "Dumbbell Overhead Tricep Extension": { tricep:1.0 },
  "Spider Curl":                   { bicep:1.0, forearm:0.3 },
  "Cross-Body Hammer Curl":        { bicep:0.85, forearm:0.85 },
  "Overhead Cable Curl":           { bicep:1.0, forearm:0.25 },
  // CORE additions
  "Cable Woodchop":                { oblique:1.0, upper_abs:0.7, lower_back:0.3 },
  "Landmine Rotation":             { oblique:1.0, upper_abs:0.65, lower_back:0.35 },
  "Hollow Body Hold":              { upper_abs:0.9, lower_abs:0.95, hip_flexor:0.6 },
  "Toes-to-Bar":                   { lower_abs:1.0, hip_flexor:0.9, upper_abs:0.5 },
  "Windshield Wipers":             { oblique:1.0, lower_abs:0.85, hip_flexor:0.6 },
  "Suitcase Carry":                { oblique:0.9, lower_back:0.65, trap:0.75, forearm:0.7 },
  // KETTLEBELL
  "Kettlebell Clean":              { glute:0.8, hamstring:0.6, lat:0.5, trap:0.6, bicep:0.4 },
  "Kettlebell Press":              { front_delt:0.9, mid_delt:0.6, tricep:0.5, trap:0.3 },
  "Kettlebell Snatch":             { glute:1.0, hamstring:0.8, lat:0.6, trap:0.5, front_delt:0.5 },
  "Kettlebell Turkish Get-Up":     { glute:0.7, quad:0.6, front_delt:0.8, upper_abs:0.6, oblique:0.7 },
  "Kettlebell Goblet Squat":       { quad:0.85, glute:0.75, lower_back:0.3 },
  "Kettlebell Deadlift":           { lower_back:0.8, glute:0.75, hamstring:0.7, quad:0.4 },
  "Kettlebell Row":                { lat:0.85, mid_back:0.75, bicep:0.5, rear_delt:0.4 },
  "Kettlebell Windmill":           { oblique:0.9, glute:0.6, front_delt:0.5, lower_back:0.5 },
  "Kettlebell Halo":               { mid_delt:0.7, front_delt:0.6, rear_delt:0.5, upper_abs:0.4 },
  "Kettlebell Clean and Press":    { glute:0.75, hamstring:0.5, front_delt:0.85, mid_delt:0.55, tricep:0.45, trap:0.55 },
  "Kettlebell Front Squat":        { quad:0.95, glute:0.65, lower_back:0.3 },
  "Kettlebell Lunge":              { quad:0.8, glute:0.85, hamstring:0.4 },
  "Kettlebell Figure Eight":       { oblique:0.7, lower_back:0.5, hip_flexor:0.55, glute:0.5 },
  "Kettlebell Thruster":           { quad:0.9, glute:0.8, front_delt:0.75, tricep:0.5, lower_back:0.35 },
  "Kettlebell Renegade Row":       { lat:0.85, mid_back:0.7, upper_abs:0.6, bicep:0.45 },
  // CARDIO additions
  "Ski Erg":                       { lat:0.8, front_delt:0.6, upper_abs:0.55, quad:0.4 },
  "Sled Drag":                     { quad:0.85, hamstring:0.7, glute:0.65, calf:0.5 },
  "Prowler Push":                  { quad:0.9, glute:0.75, lower_back:0.45, front_delt:0.4 },
  "Sprint Intervals":              { quad:0.85, hamstring:0.7, glute:0.65, calf:0.8 },
  // CHEST new
  "Smith Machine Bench Press":     { chest:0.95, front_delt:0.5, tricep:0.4 },
  "Smith Machine Incline Press":   { chest:0.85, front_delt:0.65, tricep:0.35 },
  "Wide-Grip Push-Ups":            { chest:0.85, front_delt:0.4, tricep:0.4 },
  "Diamond Push-Ups":              { tricep:0.9, chest:0.6, front_delt:0.4 },
  "Incline Push-Ups":              { chest:0.7, front_delt:0.6, tricep:0.45 },
  "Decline Push-Ups":              { chest:0.9, front_delt:0.35, tricep:0.5 },
  "Hex Press":                     { chest:1.0, front_delt:0.3, tricep:0.35 },
  // BACK new
  "Inverted Row":                  { lat:0.8, mid_back:0.85, rear_delt:0.55, bicep:0.5 },
  "Seal Row":                      { mid_back:1.0, lat:0.6, rear_delt:0.65, bicep:0.45 },
  "Cable Pullover":                { lat:0.95, mid_back:0.45, tricep:0.3 },
  "Deficit Deadlift":              { lower_back:0.9, glute:0.8, hamstring:0.8, quad:0.5, trap:0.5 },
  "Neutral Grip Pull-Ups":         { lat:0.95, mid_back:0.65, bicep:0.7, rear_delt:0.4 },
  "Single-Arm Lat Pulldown":       { lat:0.9, mid_back:0.55, bicep:0.6, rear_delt:0.35 },
  // LEGS new
  "Smith Machine Squat":           { quad:0.95, glute:0.75, hamstring:0.45, lower_back:0.35 },
  "Pause Squat":                   { quad:1.0, glute:0.85, hamstring:0.55, lower_back:0.45 },
  "Zercher Squat":                 { quad:0.9, glute:0.8, upper_abs:0.5, lower_back:0.4 },
  "Lateral Lunge":                 { quad:0.8, glute:0.85, hamstring:0.5 },
  "Curtsy Lunge":                  { quad:0.75, glute:0.95, hamstring:0.45 },
  "Jump Lunge":                    { quad:0.85, glute:0.85, hamstring:0.45, calf:0.5 },
  "Single-Leg Romanian Deadlift":  { hamstring:1.0, glute:0.9, lower_back:0.6 },
  "Leg Adductor Machine":          { glute:0.6, hip_flexor:0.4 },
  "Donkey Calf Raise":             { calf:1.0 },
  // SHOULDERS new
  "Pike Push-Ups":                 { front_delt:0.9, mid_delt:0.6, tricep:0.5 },
  "Handstand Push-Ups":            { front_delt:1.0, mid_delt:0.7, tricep:0.6, trap:0.4 },
  "Machine Lateral Raise":         { mid_delt:0.95, rear_delt:0.2, trap:0.1 },
  "Plate Front Raise":             { front_delt:1.0, mid_delt:0.25 },
  "Cable Front Raise":             { front_delt:0.95, mid_delt:0.2 },
  "Dumbbell Y-Raise":              { rear_delt:0.9, mid_back:0.6, trap:0.5 },
  // ARMS new
  "Cable Hammer Curl":             { bicep:0.85, forearm:0.85 },
  "Drag Curl":                     { bicep:1.0, forearm:0.2 },
  "Scott Curl":                    { bicep:1.0, forearm:0.3 },
  "Wide-Grip Barbell Curl":        { bicep:0.9, forearm:0.45 },
  "JM Press":                      { tricep:1.0, chest:0.3 },
  "Tate Press":                    { tricep:1.0, forearm:0.2 },
  "Reverse Grip Tricep Pushdown":  { tricep:0.95, forearm:0.35 },
  "Single-Arm Tricep Pushdown":    { tricep:1.0, forearm:0.2 },
  "Machine Tricep Press":          { tricep:1.0, chest:0.2 },
  // CORE new
  "Reverse Crunch":                { lower_abs:1.0, hip_flexor:0.7, upper_abs:0.4 },
  "Toe Touches":                   { upper_abs:0.85, lower_abs:0.7 },
  "Superman":                      { lower_back:1.0, glute:0.65, hamstring:0.4 },
  "Bird Dog":                      { lower_back:0.8, glute:0.55, upper_abs:0.5, oblique:0.4 },
  "Copenhagen Plank":              { oblique:0.9, hip_flexor:0.7, lower_abs:0.5 },
  "Medicine Ball Slam":            { upper_abs:0.9, lower_abs:0.6, front_delt:0.55, lat:0.5 },
  "Weighted Sit-Up":               { upper_abs:0.95, lower_abs:0.65, hip_flexor:0.55 },
  // CARDIO new
  "Elliptical":                    { quad:0.65, glute:0.55, hamstring:0.45, calf:0.5 },
  "Stationary Bike":               { quad:0.8, glute:0.65, hamstring:0.4, calf:0.55 },
  "Incline Walk":                  { quad:0.6, glute:0.8, hamstring:0.5, calf:0.6 },
  "Echo Bike":                     { quad:0.8, glute:0.55, front_delt:0.4, upper_abs:0.4 },
  "Cycling":                       { quad:0.85, glute:0.7, hamstring:0.45, calf:0.6 },
  "Versa Climber":                 { quad:0.7, glute:0.6, lat:0.5, front_delt:0.45 },
  // KETTLEBELL new
  "Kettlebell Farmers Carry":      { trap:0.95, forearm:0.85, lower_back:0.65, glute:0.4 },
  "Bottoms-Up Press":              { front_delt:0.8, mid_delt:0.55, tricep:0.5, forearm:0.6 },
  "Kettlebell Sumo Deadlift":      { glute:0.9, quad:0.75, hamstring:0.6, lower_back:0.55 },
  "Kettlebell Jump Squat":         { quad:0.9, glute:0.85, calf:0.55, hamstring:0.4 },
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

const BODYWEIGHT_EXERCISES = new Set([
  // Upper body pulling
  "Pull-Ups", "Chin-Ups",
  // Upper body pushing
  "Push-Ups", "Chest Dip", "Dips",
  // Core — no equipment needed
  "Plank", "Side Plank", "Ab Wheel", "Hanging Leg Raises", "Leg Raises",
  "Russian Twists", "Bicycle Crunches", "Crunch", "Decline Crunches", "Sit-Ups",
  "V-Ups", "Dragon Flag", "Dead Bug", "Flutter Kicks", "Mountain Climbers",
  "Hollow Body Hold", "Toes-to-Bar", "Windshield Wipers",
  // New bodyweight exercises
  "Wide-Grip Push-Ups", "Diamond Push-Ups", "Incline Push-Ups", "Decline Push-Ups",
  "Inverted Row", "Neutral Grip Pull-Ups",
  "Pike Push-Ups", "Handstand Push-Ups",
  "Jump Lunge",
  "Reverse Crunch", "Toe Touches", "Superman", "Bird Dog", "Copenhagen Plank",
]);
function getLoggedBodyWeight() {
  try {
    const log = JSON.parse(localStorage.getItem("sfc_body_log") || "[]");
    const w = parseFloat(log[0]?.weight);
    return isNaN(w) ? null : w;
  } catch { return null; }
}

function progressWeight(w) {
  const base = parseFloat(w) || 0;
  return Math.round((base + 5) / 2.5) * 2.5;
}

// MET values (Metabolic Equivalents) for active set time.
// Sources: Compendium of Physical Activities (Ainsworth et al. 2011) + ACSM resistance training data.
const EXERCISE_MET = {
  // Heavy compound lifts — ~6 MET
  "Barbell Squat":6.0,"Front Squat":6.0,"Hack Squat":5.5,"Sumo Deadlift":6.0,
  "Deadlift":6.0,"Romanian Deadlift":5.5,"Trap Bar Deadlift":6.0,
  "Bench Press":5.5,"Incline Bench Press":5.5,"Decline Bench Press":5.5,
  "Barbell Row":5.5,"Pendlay Row":5.5,"Barbell Good Mornings":5.0,
  "Overhead Press":5.5,"Push Press":6.0,
  // Moderate compound — ~5 MET
  "Bulgarian Split Squat":5.0,"Leg Press":4.5,"Lunge":4.5,"Walking Lunges":5.0,
  "Step-Ups":5.0,"Leg Curl":3.5,"Leg Extension":3.5,"Hip Thrust":4.5,
  "Glute Bridge":3.5,"Nordic Curl":4.5,"Seated Leg Curl":3.5,
  "Dumbbell Press":4.5,"Incline Dumbbell Press":4.5,"Decline Dumbbell Press":4.5,
  "Dumbbell Row":4.5,"Chest-Supported Row":4.5,"Seated Cable Row":4.0,
  "T-Bar Row":5.0,"Landmine Row":4.5,"Meadows Row":4.5,
  "Arnold Press":4.5,"Dumbbell Shoulder Press":4.5,"Military Press":5.0,
  "Pull-Ups":5.0,"Chin-Ups":5.0,"Lat Pulldown":4.0,"Assisted Pull-Ups":4.0,
  "Cable Row":4.0,"Machine Row":3.5,
  "Dips":4.5,"Chest Dip":4.5,"Push-Ups":4.0,
  "Romanian Deadlift (Dumbbell)":5.0,"Single-Leg RDL":4.5,
  "Goblet Squat":4.5,"Dumbbell Squat":4.5,"Dumbbell Lunge":4.5,
  "Sumo Squat":4.5,"Box Step-Ups":5.0,
  // Isolation — ~3.5 MET
  "Bicep Curl":3.5,"Barbell Curl":3.5,"Hammer Curl":3.5,"Preacher Curl":3.5,
  "Concentration Curl":3.0,"Cable Curl":3.5,"EZ-Bar Curl":3.5,
  "Incline Dumbbell Curl":3.5,"Spider Curl":3.5,"Cross-Body Hammer Curl":3.0,
  "Overhead Cable Curl":3.5,
  "Tricep Pushdown":3.5,"Overhead Tricep Extension":3.5,"Skull Crushers":3.5,
  "Tricep Dips":4.0,"Close-Grip Bench Press":4.5,"Diamond Push-Ups":4.0,
  "Tricep Kickback":3.0,
  "Lateral Raise":3.0,"Front Raise":3.0,"Rear Delt Fly":3.0,
  "Cable Lateral Raise":3.0,"Face Pulls":3.5,"Upright Row":4.0,
  "Shrugs":3.5,"Cable Y-Raise":3.0,"Bradford Press":4.0,
  "Landmine Press":4.5,"Landmine Lateral Raise":3.5,
  "Chest Fly":3.5,"Dumbbell Fly":3.5,"Cable Fly":3.5,"Cable Crossover":3.5,
  "Pec Deck Machine":3.5,"Incline Cable Flyes":3.5,"Svend Press":3.0,
  "Barbell Floor Press":4.5,"Dumbbell Floor Press":4.5,
  "Calf Raises":3.0,"Seated Calf Raises":3.0,"Single-Leg Calf Raise":3.0,
  "Hip Abductor Machine":3.0,"Reverse Hypers":3.5,
  "Landmine Squat":5.0,"Landmine Split Squat":4.5,"Pistol Squat":5.0,
  "Sissy Squat":4.0,
  // Core — 3.5-4 MET
  "Plank":3.5,"Side Plank":3.5,"Ab Wheel":4.5,"Hanging Leg Raises":4.5,
  "Leg Raises":4.0,"Russian Twists":4.0,"Bicycle Crunches":4.5,"Crunch":3.5,
  "Decline Crunches":4.0,"Sit-Ups":4.0,"Cable Crunch":3.5,"V-Ups":4.5,
  "Dragon Flag":5.0,"Dead Bug":3.5,"Pallof Press":3.5,
  "Flutter Kicks":4.0,"Mountain Climbers":8.0,"Cable Woodchop":4.0,
  "Landmine Rotation":4.0,"Hollow Body Hold":3.5,"Toes-to-Bar":5.0,
  "Windshield Wipers":5.0,"Suitcase Carry":5.0,
  // Cardio — MET during active time
  "Jump Rope":12.0,"Assault Bike":10.0,"Box Jumps":10.0,"Burpees":10.0,
  "Battle Ropes":10.0,"Sled Push":9.0,"Rowing Machine":7.0,
  "Treadmill Run":9.0,"Stair Climber":8.0,"Jump Squats":7.5,
  "High Knees":8.0,"Bear Crawl":7.0,"Farmer's Walk":5.5,
  "Ski Erg":8.5,"Sled Drag":8.0,"Prowler Push":9.0,"Sprint Intervals":12.0,
  // Kettlebell — 6-8 MET
  "Kettlebell Swing":8.0,"Kettlebell Clean":8.0,"Kettlebell Press":6.0,
  "Kettlebell Snatch":9.5,"Kettlebell Turkish Get-Up":6.5,"Kettlebell Goblet Squat":6.5,
  "Kettlebell Deadlift":6.0,"Kettlebell Row":6.0,"Kettlebell Windmill":6.0,
  "Kettlebell Halo":5.5,"Kettlebell Clean and Press":8.0,"Kettlebell Front Squat":6.5,
  "Kettlebell Lunge":6.5,"Kettlebell Figure Eight":7.0,"Kettlebell Thruster":9.0,
  "Kettlebell Renegade Row":7.0,
  // New exercises
  "Smith Machine Bench Press":5.5,"Smith Machine Incline Press":5.0,
  "Wide-Grip Push-Ups":4.0,"Incline Push-Ups":3.5,"Decline Push-Ups":4.0,"Hex Press":4.0,
  "Inverted Row":4.5,"Seal Row":4.5,"Cable Pullover":3.5,"Deficit Deadlift":6.0,"Neutral Grip Pull-Ups":5.0,"Single-Arm Lat Pulldown":4.0,
  "Smith Machine Squat":5.5,"Pause Squat":6.0,"Zercher Squat":5.5,"Lateral Lunge":4.5,"Curtsy Lunge":4.5,"Jump Lunge":7.0,"Single-Leg Romanian Deadlift":4.5,"Leg Adductor Machine":3.0,"Donkey Calf Raise":3.0,
  "Pike Push-Ups":4.0,"Handstand Push-Ups":5.0,"Machine Lateral Raise":3.0,"Plate Front Raise":3.0,"Cable Front Raise":3.0,"Dumbbell Y-Raise":3.0,
  "Cable Hammer Curl":3.5,"Drag Curl":3.5,"Scott Curl":3.5,"Wide-Grip Barbell Curl":3.5,"JM Press":4.0,"Tate Press":3.5,"Reverse Grip Tricep Pushdown":3.5,"Single-Arm Tricep Pushdown":3.5,"Machine Tricep Press":3.5,
  "Reverse Crunch":3.5,"Toe Touches":3.5,"Superman":3.5,"Bird Dog":3.0,"Copenhagen Plank":3.5,"Medicine Ball Slam":8.0,"Weighted Sit-Up":4.0,
  "Elliptical":6.0,"Stationary Bike":7.0,"Incline Walk":5.0,"Echo Bike":10.0,"Cycling":8.0,"Versa Climber":9.0,
  "Kettlebell Farmers Carry":5.5,"Bottoms-Up Press":5.0,"Kettlebell Sumo Deadlift":6.0,"Kettlebell Jump Squat":8.0,
};
const EXERCISE_TIPS = {
  // CHEST
  "Barbell Bench Press":{ cues:["Retract and depress shoulder blades into the bench","Bar touches lower chest — not your neck","Drive feet into the floor; press bar in a slight arc back toward the rack"], err:"Elbows flared 90°, bouncing bar off chest, or lifting hips off the bench" },
  "Incline Barbell Press":{ cues:["Set bench 30–45°; steeper angles shift load to front delts","Grip slightly narrower than flat bench","Controlled descent; touch upper chest, not collarbone"], err:"Bench too steep (>45°), bar drifting toward the neck" },
  "Incline Barbell Bench Press":{ cues:["Set bench 30–45°; steeper angles shift load to front delts","Grip slightly narrower than flat bench","Controlled descent; touch upper chest, not collarbone"], err:"Bench too steep (>45°), bar drifting toward the neck" },
  "Decline Bench Press":{ cues:["Feet secured; grip slightly wider than shoulder-width","Bar descends to lower chest/sternum","Controlled eccentric — resist the urge to bounce"], err:"Excessive arch, bar crashing into chest, elbows flaring wide" },
  "Dumbbell Bench Press":{ cues:["Let elbows flare naturally — not pinned to sides","Squeeze at the top but keep a slight bend in elbows","Control the descent; don't let shoulders roll forward"], err:"Dumbbells dropping too fast or excessive lower-back arch" },
  "Incline Dumbbell Press":{ cues:["30–45° incline; keep upper back tight","Neutral or slightly pronated grip at the top","Full stretch at the bottom — feel the pec stretch"], err:"Excessive elbow flare or rushing the eccentric" },
  "Decline Dumbbell Press":{ cues:["Feet secured under pad; brace core throughout","Dumbbells lower to bottom of chest in a controlled arc","Press straight up; don't let dumbbells drift toward face"], err:"Losing core tension, dumbbells drifting too wide on descent" },
  "Cable Flyes":{ cues:["Slight forward lean; think hugging a large tree","Keep a soft bend in the elbows throughout","Lead with your elbows, not your hands"], err:"Arms going straight (turns it into a press) or using too much weight" },
  "Cable Fly":{ cues:["Slight forward lean; think hugging a large tree","Keep a soft bend in the elbows throughout","Lead with your elbows, not your hands"], err:"Arms going straight (turns it into a press) or using too much weight" },
  "Dumbbell Flyes":{ cues:["Wide arc down; elbows stay slightly bent throughout","Feel a full stretch at the bottom without shoulder pain","Squeeze pecs at the top — don't clink the weights together"], err:"Locking elbows out or going too heavy and losing control" },
  "Incline Cable Flyes":{ cues:["Cables set low; lean back on 30–45° incline bench","Arc upward and together, squeezing pecs at the top","Keep soft elbow bend; don't turn it into a press"], err:"Straightening arms (makes it a press) or bench angle too steep" },
  "Pec Deck Machine":{ cues:["Elbows at shoulder height on the pads","Squeeze pecs to bring pads together; hold 1 sec","Slow controlled return — don't let weight slam back"], err:"Elbows dropping below pad level or using shoulder momentum" },
  "Push-Ups":{ cues:["Hands slightly wider than shoulders; fingers forward","Brace core and glutes — body stays rigid throughout","Chest touches the floor; elbows at ~45° to torso"], err:"Hips sagging, elbows flaring 90°, or doing partial range reps" },
  "Chest Dip":{ cues:["Lean torso forward ~30° to shift load to chest","Lower until upper arms are parallel to floor","Press through palms; don't lock out aggressively"], err:"Staying too upright (hits triceps only) or going dangerously deep" },
  "Machine Chest Press":{ cues:["Seat height so handles are at mid-chest","Press forward in a straight line; don't arc up","Slow eccentric — feel the pecs stretch on the way back"], err:"Seat too high or low causing shoulder impingement, slamming the stack" },
  "Low Cable Crossover":{ cues:["Cables set at floor level; lean slightly forward","Arc up and together — hands meet above chest level","Squeeze pecs at the top; control the return"], err:"Standing too upright or letting cables pull arms back too far" },
  "Cable Chest Press":{ cues:["Stand staggered or parallel; cables at chest height","Press forward to full extension; slight elbow bend at lockout","Control the eccentric — cables pull back, resist them"], err:"Flaring elbows too wide or leaning excessively into the cables" },
  "Dumbbell Pullover":{ cues:["Lie perpendicular on bench; hips drop below bench level","Lower dumbbell in arc behind head until lats stretch","Pull through lats and pecs to return — not just arms"], err:"Bending elbows too much (makes it a tricep exercise) or losing core" },
  "Barbell Floor Press":{ cues:["Lie flat; elbows rest on floor at the bottom of each rep","Press bar in a slight arc; pause at the floor","Brace hard — no leg drive, upper body only"], err:"Bouncing off the floor or letting elbows flare wide" },
  "Dumbbell Floor Press":{ cues:["Lie flat; knees bent, feet flat for stability","Elbows touch floor each rep — full range","Press dumbbells up; slight inward arc at the top"], err:"Elbows not reaching the floor, losing shoulder blade retraction" },
  "Svend Press":{ cues:["Press two plates together hard throughout the movement","Arms extend forward at chest height — isometric squeeze","Slow the return; maintain plate pressure the entire set"], err:"Releasing plate pressure at any point or using too heavy a plate" },
  "Smith Machine Bench Press":{ cues:["Position yourself so bar touches lower chest at bottom","Use the same cues as barbell bench — retract scapulae","Unrack with a slight rotation; rack safely after the set"], err:"Bar path locked in a straight line — allow slight arc naturally" },
  "Smith Machine Incline Press":{ cues:["30–45° incline; bar should touch upper chest at bottom","Retract shoulder blades onto the pad","Control the descent; slow the eccentric"], err:"Bench angle too steep or bar drifting toward the neck" },
  "Wide-Grip Push-Ups":{ cues:["Hands 1.5× shoulder-width apart; fingers angled slightly out","Elbows flare more than standard push-up — that's intended","Chest to floor; full range of motion every rep"], err:"Hips sagging or not reaching full depth due to wide grip tension" },
  "Diamond Push-Ups":{ cues:["Index fingers and thumbs form a diamond under sternum","Elbows track back along the body — not flared","Lower chest to hands; press back to full extension"], err:"Elbows flaring wide (loses tricep focus) or wrist pain from poor alignment" },
  "Incline Push-Ups":{ cues:["Hands on an elevated surface; body forms a straight line","Lower chest to the surface in a controlled arc","Elbows at ~45° — same mechanics as a standard push-up"], err:"Hips piking up or sagging, partial range of motion" },
  "Decline Push-Ups":{ cues:["Feet elevated; hands on floor shoulder-width apart","More upper chest emphasis than standard push-up","Keep core rigid; lower until chest nearly touches floor"], err:"Hips hiking up breaking the straight line of the body" },
  "Hex Press":{ cues:["Press two dumbbells together throughout the entire movement","Arms extend straight up; squeeze dumbbells together hard","Control the descent — don't let them separate"], err:"Releasing dumbbell pressure at the top or going too heavy" },
  // BACK
  "Barbell Deadlift":{ cues:["Bar over mid-foot; hinge at hips to grip with neutral spine","Brace hard — 360° core tension before breaking the floor","Push the floor away; hips and chest rise together"], err:"Bar drifting forward, rounding lower back, or jerking the bar off the floor" },
  "Romanian Deadlift":{ cues:["Soft knee bend; hinge until you feel hamstring tension","Bar stays in contact with thighs the whole way down","Drive hips forward to return; squeeze glutes at the top"], err:"Squatting the weight down, rounding lower back, or knees caving" },
  "Trap Bar Deadlift":{ cues:["Stand centered in the trap bar; neutral grip handles","Hinge and grip; brace core; push floor away","Hips and shoulders rise together; full lockout at top"], err:"Rising hips before shoulders (turning it into a stiff-leg deadlift)" },
  "Rack Pull":{ cues:["Set pins at knee height or just below; bar over mid-foot","Brace full core; pull bar in a straight line close to body","Focus on lockout strength — squeeze glutes at the top"], err:"Rounding upper back or setting the pins so high range is minimal" },
  "Barbell Row":{ cues:["Hinge until torso is 45–70° from floor","Bar starts under shoulder blades — pull to lower chest/navel","Squeeze shoulder blades together at the top"], err:"Too upright (turns it into a shrug), not retracting scapula, or jerking" },
  "Pendlay Row":{ cues:["Torso nearly parallel to floor; bar starts on the floor each rep","Explosive pull to lower chest; hold for 1 sec","Lower bar all the way to floor — full reset every rep"], err:"Torso rising during the pull, using momentum instead of explosive strength" },
  "Dumbbell Row":{ cues:["Brace hand on bench; torso parallel to floor","Pull elbow straight back past the hip","Retract shoulder blade at the top; full stretch at the bottom"], err:"Rotating torso (using momentum) or not reaching the full stretch" },
  "T-Bar Row":{ cues:["Chest pad supports torso or hinge 45° free-standing","Pull handles to lower chest; drive elbows back","Squeeze shoulder blades together at the top; control the return"], err:"Using lower back momentum or letting plates touch the ground between reps" },
  "Chest-Supported Row":{ cues:["Lie face down on incline pad; no lower back involvement","Pull handles to chest level; drive elbows back and together","Slow the eccentric — let arms fully extend at the bottom"], err:"Lifting chest off pad (defeats the isolation purpose)" },
  "Seated Cable Row":{ cues:["Sit tall; hinge slightly forward on the stretch","Pull handle to lower abdomen — elbows past torso","Squeeze shoulder blades together; slow the eccentric"], err:"Rounding forward excessively or using lower back momentum" },
  "Single-Arm Cable Row":{ cues:["Stand or sit; pull handle to hip level with one arm","Rotate torso slightly to allow full lat stretch","Drive elbow back past the hip; hold the contraction"], err:"Using too much body rotation to compensate for heavy weight" },
  "Wide-Grip Seated Cable Row":{ cues:["Wide bar attachment; pull to upper abdomen","Elbows flare out — targets upper back and rear delts","Retract shoulder blades; control the return fully"], err:"Leaning back excessively or not reaching full arm extension" },
  "Lat Pulldown":{ cues:["Lean back slightly; drive elbows to your sides","Bar to upper chest — don't pull to neck or behind head","Slow the eccentric — feel the lats stretch"], err:"Leaning back too far (turns it into a row) or pulling bar behind the head" },
  "Close-Grip Lat Pulldown":{ cues:["Neutral grip handles; sit upright with slight lean back","Pull to upper chest driving elbows toward hips","Full arm extension at the top — stretch the lats"], err:"Leaning back excessively or not reaching full extension" },
  "Pull-Ups":{ cues:["Dead hang with shoulder blades slightly retracted before pulling","Drive elbows to hips — not just down and back","Chin clears the bar; lower under full control"], err:"Kipping without a base of strength, partial range, or shrugging shoulders" },
  "Chin-Ups":{ cues:["Supinated (underhand) grip; shoulder-width apart","Biceps and lats work together — feel both contracting","Full dead hang at the bottom; don't short the range"], err:"Using momentum, not reaching full extension at the bottom" },
  "Straight-Arm Pulldown":{ cues:["Arms straight with soft elbow bend; bar at eye level to start","Pull bar down to hips using lats only — no arm bend","Hold at the bottom; slow controlled return to start"], err:"Bending elbows and turning it into a pulldown row" },
  "Hyperextensions":{ cues:["Hips on the pad; start with torso parallel to floor","Extend until body forms a straight line — not past neutral","Hold at the top for 1 sec; lower under control"], err:"Hyperextending past neutral or rounding lower back on the way down" },
  "Renegade Row":{ cues:["Push-up position with dumbbells; feet wide for stability","Row one dumbbell to hip while resisting rotation","Squeeze lat at the top; keep hips square to the floor"], err:"Hips rotating or rising during the row" },
  "Dumbbell Deadlift":{ cues:["Dumbbells at sides; hinge like a barbell deadlift","Neutral spine; push floor away to stand","Squeeze glutes at lockout; lower under control"], err:"Rounding lower back or letting dumbbells drift away from the legs" },
  "Dumbbell Good Mornings":{ cues:["Dumbbells on shoulders; slight knee bend","Hinge forward until torso is near parallel; feel hamstring stretch","Drive hips forward to return; keep back flat throughout"], err:"Rounding lower back or squatting the movement instead of hinging" },
  "Barbell Good Mornings":{ cues:["Bar on upper traps; brace core hard","Hinge forward with flat back until hamstrings are fully stretched","Drive hips through to return to standing; squeeze glutes"], err:"Rounding the lower back or using too much weight" },
  "Sumo Deadlift":{ cues:["Wide stance; toes angled out 30–45°","Grip inside the legs; torso more upright than conventional","Push knees out; drive through the floor to lockout"], err:"Knees caving inward or hips rising faster than the chest" },
  "Landmine Row":{ cues:["Hinge at hips; grip sleeve end with one or both hands","Pull to lower chest; drive elbow back past torso","Squeeze lat at the top; control the descent"], err:"Standing too upright or using too much bicep pull" },
  "Landmine Romanian Deadlift":{ cues:["Grip sleeve end; hinge back with soft knee bend","Bar arcs down as you hinge; feel the hamstring stretch","Drive hips through to return; squeeze glutes at top"], err:"Rounding the lower back or squatting rather than hinging" },
  "Meadows Row":{ cues:["Stand perpendicular to the landmine; stagger your feet","Row the sleeve to hip with a pronated grip","Rotate slightly to allow full stretch; squeeze lat hard at top"], err:"Using too much torso rotation or not reaching full arm extension" },
  "Inverted Row":{ cues:["Bar at hip height; body straight from head to heels","Pull chest to bar; drive elbows back","Elevate feet to increase difficulty; keep body rigid"], err:"Hips sagging or not pulling high enough for full contraction" },
  "Seal Row":{ cues:["Lie face down on elevated bench; arms hang freely","Pull dumbbells or bar to chest; squeeze shoulder blades","Slow the eccentric — full stretch at the bottom"], err:"Lifting torso off the bench or using momentum" },
  "Cable Pullover":{ cues:["Face away from cable set high; arms extended overhead","Pull cable arc down to hips with lat engagement","Keep arms straight with soft elbows; control the return"], err:"Bending arms excessively or using too much body lean" },
  "Deficit Deadlift":{ cues:["Stand on 1–2\" plates; increases range of motion off the floor","Brace hard; maintain neutral spine through the extended range","Bar path stays close to shins; push floor away"], err:"Rounding lower back due to increased range — drop weight if needed" },
  "Neutral Grip Pull-Ups":{ cues:["Parallel grip handles; shoulder-width or narrower","Pull chest toward handles; drive elbows to hips","Full dead hang at the bottom; no kipping"], err:"Partial range of motion or not achieving full arm extension" },
  "Single-Arm Lat Pulldown":{ cues:["Grip handle with one hand; sit tall or kneel","Pull handle to shoulder; drive elbow toward hip","Feel the lat fully contract; slow controlled return"], err:"Leaning excessively to one side or rotating the torso" },
  // LEGS
  "Barbell Squat":{ cues:["Bar on upper traps; brace your core hard before descent","Knees track over toes; don't cave inward","Drive hips up and back out of the hole — chest stays up"], err:"Knees caving, excessive forward lean, or half reps" },
  "Front Squat":{ cues:["High elbow position (parallel to floor) to keep bar in the rack position","Stay upright; torso more vertical than back squat","Knees out; don't let elbows drop at the bottom"], err:"Elbows dropping, excessive forward lean, or wrist pain from poor rack position" },
  "Hack Squat":{ cues:["Feet shoulder-width on the platform; toes angled slightly out","Lower until thighs are parallel; don't let hips tuck under","Press through heels to return; don't lock knees hard at top"], err:"Hips tucking under (butt wink) or knees caving inward" },
  "Goblet Squat":{ cues:["Hold dumbbell or kettlebell at chest; elbows inside knees at the bottom","Squat to depth; use elbows to push knees out","Stay upright; heels flat; drive up through mid-foot"], err:"Elbows caving in, heels rising, or not reaching parallel" },
  "Box Squat":{ cues:["Sit back onto the box; don't just touch and bounce","Pause briefly on the box — no relaxing the core","Sit back with wide stance; drive through heels explosively"], err:"Bouncing off the box or relaxing at the bottom" },
  "Leg Press":{ cues:["Foot position controls emphasis: high = glutes/hams, low = quads","Lower until quads are at 90° without hips tucking under","Don't lock knees hard at the top — keep slight tension"], err:"Lower back peeling off the pad, knees caving, or locking out hard" },
  "Single Leg Press":{ cues:["One foot centered on the platform at comfortable height","Lower under control until 90° knee angle","Press through mid-foot; keep hips flat on the pad"], err:"Hip rotating off the seat or knee caving inward" },
  "Bulgarian Split Squat":{ cues:["Front foot far enough forward so shin stays vertical at bottom","Back knee drives toward the floor — not behind you","Push through the heel of the front foot to drive up"], err:"Front foot too close, knee caving inward, or leaning excessively forward" },
  "Walking Lunges":{ cues:["Step long enough so front shin stays vertical at bottom","Rear knee drives toward the floor with control","Push through front heel to drive forward into next step"], err:"Front knee shooting past toes or torso leaning excessively forward" },
  "Lunges":{ cues:["Take a stride big enough so front shin stays vertical","Rear knee just above the floor without slamming down","Push through front heel to drive back up"], err:"Front knee shooting past toes or torso leaning forward" },
  "Reverse Lunges":{ cues:["Step back and lower rear knee toward the floor","Front shin stays vertical; knee tracks over toes","Push through front heel to return to standing"], err:"Front knee caving or stepping back too short causing forward lean" },
  "Dumbbell Lunge":{ cues:["Dumbbells at sides; step forward into lunge position","Front shin vertical; rear knee near the floor","Push through front heel to return; keep torso upright"], err:"Torso leaning forward or front knee collapsing inward" },
  "Step-Ups":{ cues:["Step onto the box with full foot contact — heel included","Drive through the heel of the working leg to stand up","Lower the trailing leg under control — don't just drop it"], err:"Pushing off the trailing foot (reduces the working-leg stimulus)" },
  "Leg Extension":{ cues:["Sit fully back; pad rests on lower shin above the ankle","Extend to full lockout; squeeze quads hard at the top","Slow the eccentric — 2–3 seconds down"], err:"Leaning back at the top or using momentum to swing the weight" },
  "Leg Curl":{ cues:["Lie prone; pad sits just above the heel/Achilles","Curl heel toward glutes; squeeze hamstrings at full contraction","Slow the eccentric; hips stay flat on the pad"], err:"Hips rising off the pad or arching the lower back to assist" },
  "Seated Leg Curl":{ cues:["Sit with thighs fully supported; pad above ankles","Curl through full range to maximum contraction","Slow the return — resist the weight on the way back"], err:"Raising hips off the seat or short-stroking the range" },
  "Nordic Hamstring Curl":{ cues:["Kneel with feet anchored; lower your torso slowly toward floor","Control the fall — hamstrings work eccentrically","Push up with hands to assist the return if needed"], err:"Dropping quickly without eccentric control (defeats the purpose)" },
  "Hip Thrust":{ cues:["Bench at mid-scapula height; feet flat, hip-width apart","Drive through heels; squeeze glutes hard at the top","Full range — all the way down, chin tucked throughout"], err:"Hyperextending the lower back at lockout or neck craning upward" },
  "Glute Bridge":{ cues:["Lie flat; knees bent, feet hip-width; drive through heels","Squeeze glutes hard at the top — tuck pelvis slightly","Hold 1–2 seconds at peak contraction; lower under control"], err:"Hyperextending lumbar spine or driving through the toes" },
  "Calf Raise":{ cues:["Full range: stretch at the bottom; full peak contraction at top","Pause 1 sec at the top; slow 3-sec eccentric","Keep knees straight for gastrocnemius focus"], err:"Bouncing at the bottom or only doing partial range" },
  "Seated Calf Raise":{ cues:["Pad sits just above the knee; balls of feet on the edge","Full stretch at the bottom; peak contraction at top","Slow eccentric — 3 seconds down targets soleus"], err:"Short range of motion or not achieving full plantarflexion at top" },
  "Cable Pull-Through":{ cues:["Cable at floor level; hinge back through your legs to the cable","Drive hips forward; squeeze glutes at full extension","Think hip hinge — not a squat movement"], err:"Squatting instead of hinging or losing core bracing" },
  "Cable Glute Kickback":{ cues:["Slight forward lean; kick working leg back and up","Squeeze glute at peak extension; control the return","Keep the movement in the hip, not the lower back"], err:"Hyperextending the lower back or swinging the leg with momentum" },
  "Cable Hip Abduction":{ cues:["Stand sideways; cable attached to the outer ankle","Kick leg out to the side; squeeze glute med at top","Control return — don't let cable pull leg across midline"], err:"Leaning excessively to one side or using torso rotation" },
  "Cable Romanian Deadlift":{ cues:["Cables at low pulley; hinge back maintaining tension throughout","Hamstring stretch at the bottom; drive hips forward to return","Bar (or handle) stays close to thighs throughout"], err:"Rounding the lower back or squatting instead of hinging" },
  "Dumbbell Romanian Deadlift":{ cues:["Soft knee bend; hinge forward until you feel the hamstring stretch","Dumbbells stay close to legs all the way down","Drive hips forward; squeeze glutes at the top"], err:"Rounding lower back or letting dumbbells drift away from the body" },
  "Dumbbell Hip Thrust":{ cues:["Dumbbell on the crease of the hip; bench at mid-scapula","Drive through heels; squeeze glutes hard at the top","Chin tucked; ribcage down — don't hyperextend the back"], err:"Hyperextending the lower back or the dumbbell rolling during the movement" },
  "Dumbbell Sumo Squat":{ cues:["Wide stance; toes angled out; hold dumbbell between legs","Lower until thighs are parallel; knees track over toes","Drive through heels; keep chest up throughout"], err:"Knees caving or not reaching parallel depth" },
  "Dumbbell Calf Raise":{ cues:["Stand on one foot or both; ball of foot on edge for full range","Full stretch at the bottom; peak contraction at top","Slow eccentric — 3 seconds down for maximum benefit"], err:"Bouncing at the bottom or partial range" },
  "Landmine Squat":{ cues:["Hold sleeve end at chest; wide stance, toes out","Squat to depth; stay upright using the landmine for counter-balance","Drive through heels; keep chest up to the barbell"], err:"Allowing the barbell to pull you forward out of position" },
  "Landmine Split Squat":{ cues:["Hold sleeve end at chest; front foot forward, rear foot back","Lower rear knee toward the floor; front shin stays vertical","Drive through front heel to return; keep torso upright"], err:"Front knee caving or losing balance due to the landmine arc" },
  "Pistol Squat":{ cues:["Extend one leg forward as you lower; arms out for balance","Lower to full depth on the working leg","Drive through the heel to stand; don't lean excessively forward"], err:"Not reaching full depth or collapsing the knee inward" },
  "Sissy Squat":{ cues:["Hold something for balance; lean back as you lower","Knees travel far forward — this is intentional for quad isolation","Lower until thighs parallel; drive through the balls of the feet"], err:"Going too fast, losing knee tracking, or not holding support" },
  "Reverse Hypers":{ cues:["Hips on the pad; legs hang down at the start","Swing legs back and up to hip extension — squeeze glutes","Control the return; feel a stretch in glutes and hamstrings"], err:"Using momentum to swing rather than controlled hip extension" },
  "Hip Abductor Machine":{ cues:["Sit with back flat; pads on the outside of the knees","Push legs outward through full range; squeeze at peak","Slow the return — resist the weight on the way in"], err:"Leaning forward or using torso momentum to assist the movement" },
  "Smith Machine Squat":{ cues:["Walk feet slightly forward to allow vertical bar path","Brace core; squat to parallel maintaining neutral spine","Drive through heels; don't lean back into the bar"], err:"Feet too far back forcing unnatural knee angle" },
  "Pause Squat":{ cues:["Squat to depth; hold 2–3 seconds at the bottom","Stay braced and tense throughout the pause — don't relax","Drive explosively out of the hole after the pause"], err:"Relaxing core tension during the pause or bouncing out" },
  "Zercher Squat":{ cues:["Bar in the crook of your elbows; keep elbows high","Squat to depth; torso stays more upright than back squat","Drive up through the whole foot; squeeze glutes at top"], err:"Elbows dropping or letting the bar roll forward during the squat" },
  "Lateral Lunge":{ cues:["Step wide to one side; push hips back over the bent leg","Opposite leg stays straight; both feet flat on the floor","Push through the heel of the bent leg to return to center"], err:"Knee caving inward or not sitting the hips back enough" },
  "Curtsy Lunge":{ cues:["Step one leg behind and across the body into a curtsy","Front knee stays aligned over front toes","Drive through front heel to return; keep torso upright"], err:"Excessive forward lean or front knee collapsing inward" },
  "Jump Lunge":{ cues:["Lunge position; explode up switching legs in the air","Land softly in the opposite lunge position","Absorb impact through the hips and knees, not the joints"], err:"Landing stiff-legged or allowing knees to cave on the landing" },
  "Single-Leg Romanian Deadlift":{ cues:["Balance on one leg; hinge forward, opposite leg extends back","Keep hips square — don't let the hip of the raised leg open up","Soft bend in the standing knee; feel the hamstring stretch"], err:"Hips rotating open or losing balance by reaching too far forward" },
  "Leg Adductor Machine":{ cues:["Sit with back flat; pads on the inside of the knees","Squeeze legs together through full range; hold 1 sec at peak","Slow the return — resist the machine opening your legs"], err:"Using momentum or letting the machine open too fast on the return" },
  "Donkey Calf Raise":{ cues:["Hinge forward with upper body supported; balls of feet on edge","Full stretch at the bottom; peak contraction at top","Slow 3-second eccentric — maximum time under tension"], err:"Bouncing at the bottom or not achieving full range" },
  // SHOULDERS
  "Barbell Overhead Press":{ cues:["Bar starts just below chin on collarbones","Press in a vertical line; tuck chin as bar passes your face","Lock out overhead; glutes and abs braced throughout"], err:"Bar pressing forward instead of straight up or lower-back hyperextension" },
  "Seated Dumbbell Press":{ cues:["Dumbbells at ear level; neutral or slightly pronated grip","Press overhead and slightly together — don't slam at top","Control the descent back to ear level — full range"], err:"Arching lower back excessively or elbows too far forward" },
  "Dumbbell Shoulder Press":{ cues:["Dumbbells at ear level; neutral or slightly pronated grip","Press overhead and slightly together — don't slam at top","Control the descent back to ear level — full range"], err:"Arching lower back excessively or elbows too far forward" },
  "Machine Shoulder Press":{ cues:["Adjust seat so handles are at shoulder height","Press straight overhead; don't lock out hard at the top","Slow the eccentric — control the descent back to start"], err:"Seat too low causing impingement or pressing at an angle" },
  "Arnold Press":{ cues:["Start with palms facing you at chin height; rotate as you press","At the top, palms face forward — reverse on the way down","Full range of motion; keep core braced throughout"], err:"Rushing the rotation or using too heavy a weight that limits range" },
  "Push Press":{ cues:["Slight knee dip; explode legs to initiate the press","Punch bar overhead using leg drive; lock out at the top","Receive the bar on collarbones in a controlled descent"], err:"Dipping too low (turns into a jerk) or not locking out overhead" },
  "Lateral Raises":{ cues:["Slight bend in elbows; lead with elbows, not hands","Raise to shoulder height — no higher than parallel","Slow the eccentric — 2–3 seconds down"], err:"Swinging the weight up, shrugging, or raising too high" },
  "Lateral Raise":{ cues:["Slight bend in elbows; lead with elbows, not hands","Raise to shoulder height — no higher than parallel","Slow the eccentric — 2–3 seconds down"], err:"Swinging the weight up, shrugging, or raising too high" },
  "Cable Lateral Raises":{ cues:["Cable at floor level; arm slightly in front of body","Raise to shoulder height; slight elbow bend throughout","Slow the eccentric — cable provides constant tension"], err:"Shrugging shoulder or pulling with the elbow too close to the body" },
  "Front Raises":{ cues:["Slight elbow bend; raise directly in front to shoulder height","Avoid swinging; use strict controlled movement","Slow the eccentric — resist the weight on the way down"], err:"Swinging the torso or raising too high causing shoulder impingement" },
  "Rear Delt Flyes":{ cues:["Hinge to 45° or higher; arms hang straight down","Raise arms out to the side in a reverse-fly arc","Squeeze rear delts at the top; slow controlled descent"], err:"Bending elbows too much (engages more upper back than rear delts)" },
  "Machine Rear Delt Flyes":{ cues:["Chest against pad; grip handles with arms extended","Pull handles back in a wide arc; squeeze rear delts at peak","Slow controlled return — don't let the stack drop"], err:"Using too much trap engagement or partial range of motion" },
  "Cable Face Pulls":{ cues:["Rope at upper-chest/forehead height; pull to face level","External rotate at the end — hands end beside ears","Keep elbows high throughout the pull"], err:"Pulling too low, losing elbow height, or going too heavy" },
  "Face Pull":{ cues:["Rope at upper-chest/forehead height; pull to face level","External rotate at the end — hands end beside ears","Keep elbows high throughout the pull"], err:"Pulling too low, losing elbow height, or going too heavy" },
  "Upright Row":{ cues:["Grip slightly wider than shoulder-width; elbows lead the pull","Pull to chin level; elbows stay higher than wrists","Lower under control; keep bar close to the body"], err:"Narrow grip increasing impingement risk; pulling too high" },
  "Barbell Shrugs":{ cues:["Grip just outside hips; shrug straight up — not forward or back","Hold at the top for 1 sec; fully lower between reps","Don't roll the shoulders — straight up and down"], err:"Rolling shoulders (increases injury risk) or using too much momentum" },
  "Dumbbell Shrugs":{ cues:["Dumbbells at sides; shrug straight up squeezing traps","Hold 1 sec at the top; full depression between reps","No shoulder roll — pure vertical movement"], err:"Rolling the shoulders or only doing a partial contraction" },
  "Cable Upright Row":{ cues:["Cable at floor level; grip with elbows flaring out","Pull to chin level; elbows stay above hands","Slow the eccentric — cable maintains constant tension"], err:"Pulling with hands (wrists above elbows) or going too heavy" },
  "Dumbbell Upright Row":{ cues:["Dumbbells in front of thighs; elbows lead the pull","Pull to chin height; elbows stay above wrists throughout","Lower under control; don't swing the weight"], err:"Narrow grip causing shoulder impingement or using momentum" },
  "Landmine Press":{ cues:["Stand perpendicular; hold sleeve end at shoulder","Press up and slightly forward in the arc of the bar","Full lockout; control the descent back to shoulder"], err:"Pressing at an angle that strains the shoulder or losing elbow alignment" },
  "Landmine Lateral Raise":{ cues:["Stand to one side; hold sleeve end with one hand at hip","Raise arm out to the side following the bar's arc","Squeeze delt at peak; slow controlled return"], err:"Using body lean to assist or rotating the torso" },
  "Bradford Press":{ cues:["Press bar just over your head to behind it, then reverse","Alternate front to back in a continuous fluid arc","Light weight only — shoulder mobility is the limiter here"], err:"Going too heavy or lifting too high over the head (increases impingement risk)" },
  "Cable Y-Raise":{ cues:["Cables at floor; pull both arms up and out in a Y shape","Thumbs up; raise to above shoulder height","Squeeze rear delts and traps at the top; slow return"], err:"Using too much weight or bending the elbows during the raise" },
  "Pike Push-Ups":{ cues:["Hips high in an inverted V; hands shoulder-width","Lower head toward the floor between your hands","Press back up; feel the front delts and triceps working"], err:"Hips dropping (turning it into a push-up) or hands too wide" },
  "Handstand Push-Ups":{ cues:["Kick up against the wall; hands shoulder-width, fingers forward","Lower head toward the floor in a controlled descent","Press explosively to full lockout; keep core braced"], err:"Elbows flaring wide or collapsing into a banana back position" },
  "Machine Lateral Raise":{ cues:["Adjust pad to elbow height; sit upright","Push elbows up and out to shoulder level; squeeze at peak","Slow controlled descent — resist the weight on the way down"], err:"Using momentum or not reaching shoulder-height peak contraction" },
  "Plate Front Raise":{ cues:["Grip plate at 3 and 9 o'clock; raise directly forward","Stop at shoulder height; avoid swinging the torso","Slow the eccentric — feel the front delt resist the plate"], err:"Swinging with the lower back or raising beyond shoulder height" },
  "Cable Front Raise":{ cues:["Cable at floor; grip handle and raise directly forward","Stop at shoulder height; slight elbow bend throughout","Slow the eccentric — cable provides constant tension throughout"], err:"Swinging the torso or using too heavy a weight" },
  "Dumbbell Y-Raise":{ cues:["Lie prone on incline bench or hinge forward; thumbs up","Raise arms up and out in a Y pattern to shoulder height","Squeeze rear delts and lower traps at the top; slow return"], err:"Bending elbows or pulling the arms too high turning it into a shrug" },
  // ARMS
  "Barbell Curl":{ cues:["Elbows pinned to sides; don't let them drift forward","Full supination at the top — rotate the pinky up","Slow the eccentric — feel the stretch at the bottom"], err:"Swinging the torso, elbows drifting forward, or partial range" },
  "Dumbbell Curl":{ cues:["Supinate as you curl — palm faces ceiling at top","Keep upper arm still; only the forearm moves","Full extension at the bottom every rep"], err:"Using momentum, not fully extending, or not supinating at the top" },
  "Hammer Curl":{ cues:["Neutral (thumbs up) grip throughout the movement","Elbows stay at sides; forearm does all the work","Slow, controlled descent — no swinging"], err:"Swinging torso or letting elbows move forward during the curl" },
  "Preacher Curl":{ cues:["Upper arm flat on the pad; elbow lines up with the axis","Curl to full contraction; lower with full control","Don't bounce at the bottom — keep the negative controlled"], err:"Bouncing at the bottom to generate momentum instead of muscle" },
  "Concentration Curl":{ cues:["Elbow braced against inner thigh; sit upright","Curl to full contraction; squeeze bicep at the top","Lower fully — no rocking the torso"], err:"Swinging the torso or not reaching full extension at the bottom" },
  "Incline Dumbbell Curl":{ cues:["Recline on 45° bench; arms hang straight down to stretch bicep","Curl with strict form; don't swing shoulders forward","Lower fully for maximum bicep stretch"], err:"Swinging the shoulders forward at the top to compensate for the stretch" },
  "Cable Curl":{ cues:["Cable at floor; curl with elbows pinned at sides","Full supination at the top; squeeze bicep hard","Slow the eccentric — cable provides constant tension"], err:"Elbows drifting forward or using body sway to help the weight up" },
  "EZ Bar Curl":{ cues:["Semi-supinated grip reduces wrist strain","Elbows pinned to sides; curl to peak contraction","Slow 3-sec eccentric; full extension at bottom"], err:"Swinging the torso or elbows drifting forward" },
  "Zottman Curl":{ cues:["Curl up with supinated (palms up) grip","Rotate to pronated (palms down) at the top","Lower slowly in pronated grip for forearm eccentric"], err:"Rushing the rotation at the top or skipping the slow eccentric" },
  "Reverse Curl":{ cues:["Pronated (overhand) grip; elbows pinned to sides","Curl to chin level; keep wrists neutral","Slow the descent; feel brachialis and forearm extensors working"], err:"Letting wrists flex backward or swinging to compensate for the harder angle" },
  "Tricep Pushdown":{ cues:["Elbows pinned to sides; only forearms move","Full extension at the bottom — squeeze triceps hard","Slow the return — don't let the stack pull your arms up"], err:"Elbows drifting forward or flaring, or not reaching full extension" },
  "Rope Pushdown":{ cues:["Split the rope at the bottom; spread ends apart at lockout","Elbows pinned to sides; push down and slightly out","Squeeze hard at lockout; slow controlled return"], err:"Elbows drifting forward or not splitting the rope at the bottom" },
  "Skull Crushers":{ cues:["Bar lowers to just ABOVE the forehead — not to it","Elbows stay pointed at the ceiling throughout","Slow eccentric; explode back to lockout"], err:"Elbows flaring wide or lowering the bar to the forehead (risk of injury)" },
  "Close-Grip Bench Press":{ cues:["Grip shoulder-width or slightly narrower — not super close","Elbows at ~45° to torso; lower bar to lower chest","Press in a slight arc; squeeze triceps at the top"], err:"Grip too narrow causing wrist strain or elbows flaring wide" },
  "Tricep Overhead Extension":{ cues:["Dumbbell or EZ bar held overhead; elbows point to the ceiling","Lower behind head until forearms touch biceps","Press to full extension; keep elbows from flaring"], err:"Elbows flaring wide or excessively arching the lower back" },
  "Cable Overhead Tricep Extension":{ cues:["Cable set high; face away; elbows pointed forward","Extend arms forward to full lockout; squeeze triceps","Slow the return — feel the long head stretch"], err:"Elbows flaring wide or leaning too far forward" },
  "Tricep Kickback":{ cues:["Hinge forward; upper arm parallel to floor throughout","Extend forearm back to full lockout; squeeze at peak","Lower under control — upper arm stays perfectly still"], err:"Swinging the upper arm or not achieving full extension at the top" },
  "Dips":{ cues:["Lean slightly forward for chest; stay upright for triceps","Lower until upper arm is at or below parallel to floor","Press through palms to return; keep control throughout"], err:"Going too deep causing shoulder strain or fully locking out repeatedly" },
  "Dumbbell Skull Crushers":{ cues:["Dumbbells lower to sides of head — not straight back","Elbows track toward ceiling throughout the movement","Slow eccentric; press to full lockout"], err:"Elbows flaring wide or rotating the dumbbells in an uncontrolled arc" },
  "Dumbbell Overhead Tricep Extension":{ cues:["One dumbbell held by both hands overhead; elbows in","Lower dumbbell behind head; forearms touch biceps","Press to full extension; keep elbows pointing forward"], err:"Elbows flaring out wide or using too heavy a weight" },
  "Spider Curl":{ cues:["Lie prone on incline bench; arms hang perpendicular to floor","Curl to full peak contraction; squeeze biceps hard","Slow the eccentric — gravity provides maximum stretch"], err:"Using momentum or not reaching full extension at the bottom" },
  "Cross-Body Hammer Curl":{ cues:["Neutral grip; curl dumbbell across the body to opposite shoulder","Keep upper arm still; isolate the brachialis","Alternate arms; lower under full control"], err:"Swinging the torso or using momentum to throw the dumbbell across" },
  "Overhead Cable Curl":{ cues:["Cables at shoulder height; curl both hands toward temples","Elbows stay high and in line with shoulders","Squeeze biceps at peak; slow the return"], err:"Letting elbows drop or using shoulder momentum to assist" },
  "Cable Hammer Curl":{ cues:["Rope attachment at floor; neutral grip throughout","Curl to peak contraction with thumbs up","Elbows stay pinned to sides; slow the eccentric"], err:"Letting elbows drift forward or swinging the torso" },
  "Drag Curl":{ cues:["Drag the bar up the body — elbows go back, not forward","Bar stays in contact with your torso as you curl","Lower by reversing the drag; full extension at the bottom"], err:"Letting elbows come forward (turns it into a standard curl)" },
  "Scott Curl":{ cues:["Like a preacher curl but with an angled pad; upper arm supported","Full range — complete extension at the bottom","Squeeze bicep hard at peak contraction; slow the negative"], err:"Bouncing at the bottom or not achieving full extension" },
  "Wide-Grip Barbell Curl":{ cues:["Grip wider than shoulder-width to emphasize short head of bicep","Elbows out slightly; curl to peak contraction","Slow the descent; full extension at the bottom"], err:"Swinging torso or elbows drifting too far forward" },
  "JM Press":{ cues:["Start like close-grip bench; lower bar to upper chest/chin area","Bar tracks like a skull crusher at the bottom half","Press back up in a bench press arc; elbows close to body"], err:"Going too heavy before mastering the hybrid movement pattern" },
  "Tate Press":{ cues:["Dumbbells start at lockout; elbows flare to the sides","Lower dumbbells to the chest with elbows pointing out","Press by extending elbows while keeping them flared"], err:"Elbows drifting back toward normal bench press position" },
  "Reverse Grip Tricep Pushdown":{ cues:["Supinated (underhand) grip; elbows pinned to sides","Push bar down to full extension; squeeze triceps","Slow the return — resist the bar pulling arms back up"], err:"Elbows drifting forward or wrists collapsing during the movement" },
  "Single-Arm Tricep Pushdown":{ cues:["One hand on handle; elbow pinned to side","Push to full extension; squeeze tricep hard at lockout","Slow the eccentric; keep torso stable throughout"], err:"Rotating the torso to assist or elbow drifting away from the body" },
  "Machine Tricep Press":{ cues:["Adjust seat; grips at chest level at the start","Press to full extension; squeeze triceps at lockout","Slow the return — feel the tricep stretch at the top"], err:"Not reaching full extension or slamming the weight stack" },
  // CORE
  "Plank":{ cues:["Forearms flat; elbows under shoulders","Squeeze everything: core, glutes, quads simultaneously","Neutral spine — don't let hips sag or pike up"], err:"Hips sagging, head drooping, or holding your breath" },
  "Side Plank":{ cues:["Elbow directly under shoulder; body forms a straight line","Lift hips — don't let them sag toward the floor","Stack feet or stagger for stability; brace the obliques hard"], err:"Hips drooping or rotating forward (losing the side-plank position)" },
  "Ab Wheel":{ cues:["Start from knees; roll out until back is flat (not arched)","Squeeze abs hard before rolling back in","Only go as far as you can maintain a hollow-body position"], err:"Hyperextending lower back on the roll-out or going too far too soon" },
  "Hanging Leg Raises":{ cues:["Dead hang; initiate with posterior pelvic tilt before raising legs","Raise legs to parallel or beyond; squeeze abs at top","Slow the eccentric — don't swing back to the start"], err:"Swinging the body or using hip flexors only without spinal flexion" },
  "Leg Raises":{ cues:["Lie flat; hands under lower glutes for support","Lower back stays pressed to the floor throughout","Raise legs to vertical; lower slowly without touching the floor"], err:"Lower back arching off the floor or letting momentum drop the legs" },
  "Russian Twists":{ cues:["Lean back 45°; lift feet; rotate with the thoracic spine","Touch weight to the floor on each side","Control the rotation — don't swing with the arms"], err:"Rotating only the arms while the torso stays still" },
  "Bicycle Crunches":{ cues:["Opposite elbow to knee; full rotation of the torso","Extend the opposite leg straight while rotating","Slow and controlled — 2 sec per rep; don't rush"], err:"Pulling the neck forward with the hands or not rotating the thorax" },
  "Crunch":{ cues:["Hands behind head or crossed on chest; don't pull neck","Curl the upper back off the floor — not a sit-up","Hold peak contraction 1 sec; lower under control"], err:"Pulling the neck with hands or coming all the way up (removes tension)" },
  "Decline Crunches":{ cues:["Feet secured on decline bench; hands behind head lightly","Curl upper back off the pad; thoracic flexion only","Slow the eccentric — resist gravity all the way down"], err:"Pulling the neck or sitting all the way up and losing tension" },
  "Sit-Ups":{ cues:["Feet anchored; curl all the way up to sitting position","Lower under control — 3 sec eccentric","Brace core on the way up; exhale at the top"], err:"Jerking up with momentum or not lowering fully under control" },
  "Cable Crunch":{ cues:["Kneel facing cable; rope behind head at forehead level","Crunch by curling the spine down — hips stay still","Hold peak contraction 1 sec; resist the cable on the way back"], err:"Pulling with the arms or hinging at the hips instead of crunching the spine" },
  "V-Ups":{ cues:["Lie flat; simultaneously raise legs and torso to a V position","Touch toes at the top if mobility allows","Lower both ends simultaneously under control — don't drop"], err:"Bending the knees to compensate for lack of hip flexor strength" },
  "Dragon Flag":{ cues:["Hold bench behind head; keep body rigid from neck to heels","Lower body as one stiff unit — don't pike at the hips","Control the descent fully; explode back to vertical"], err:"Piking at the hips or losing spinal rigidity during the lowering phase" },
  "Dead Bug":{ cues:["Lower back flat to floor throughout — never let it arch","Extend opposite arm and leg slowly; breathe out as you extend","Return to start; alternate sides with full control"], err:"Allowing the lower back to arch off the floor during extension" },
  "Pallof Press":{ cues:["Cable at chest height; stand perpendicular with slight knee bend","Press handle straight out; resist rotation the entire time","Bring back to chest; don't let the cable pull you sideways"], err:"Letting the cable rotate your torso (defeats the anti-rotation purpose)" },
  "Flutter Kicks":{ cues:["Lie flat; hands under glutes; lower back pressed down","Small alternating kicks — legs just above the floor","Breathe steadily; maintain lower back contact throughout"], err:"Lower back arching off the floor or kicking too high" },
  "Mountain Climbers":{ cues:["Push-up position; drive knees to chest alternately","Keep hips level — don't let them pike up","Engage the core throughout; move with control or at cardio pace"], err:"Hips piking up or bouncing the hips with each knee drive" },
  "Cable Woodchop":{ cues:["Cable at high position; rotate from hip to opposite hip","Power comes from thoracic rotation, not just arms","Resist the return — slow eccentric rotation"], err:"Using only the arms to chop instead of rotating through the whole torso" },
  "Landmine Rotation":{ cues:["Grip sleeve end; stand with feet shoulder-width","Rotate the bar from hip to hip in a wide arc","Engage obliques throughout; brace core before each rep"], err:"Using arm strength only instead of thoracic and hip rotation" },
  "Hollow Body Hold":{ cues:["Lower back pressed to floor; arms overhead, legs extended low","Find the lowest leg angle where back stays flat","Hold without compensation; breathe steadily throughout"], err:"Lower back arching off the floor or bending knees to compensate" },
  "Toes-to-Bar":{ cues:["Dead hang; initiate with a posterior pelvic tilt","Pull toes to the bar using lat and core engagement","Lower under control — don't let legs swing"], err:"Swinging the legs with momentum or not achieving contact with the bar" },
  "Windshield Wipers":{ cues:["Hang from bar; raise legs to parallel or vertical","Rotate legs side to side in a controlled arc","Control the rotation — don't let gravity swing legs"], err:"Using momentum to swing rather than controlled lateral rotation" },
  "Suitcase Carry":{ cues:["Hold weight at one side; stand completely upright","Resist the lateral lean — core fights to stay tall","Walk with normal gait; shoulders stay level"], err:"Leaning toward the weight side or letting the shoulder hike up" },
  "Reverse Crunch":{ cues:["Lie flat; knees bent; hands at sides for support","Curl hips up off the floor — posterior pelvic tilt","Lower hips slowly back down; don't just drop them"], err:"Using momentum to swing hips up instead of curling the lower spine" },
  "Toe Touches":{ cues:["Lie flat; raise legs to vertical; reach fingers toward toes","Lift shoulder blades off the floor with each reach","Lower legs and upper body under control between reps"], err:"Swinging the arms instead of curling the upper back off the floor" },
  "Superman":{ cues:["Lie prone; simultaneously lift arms, chest, and legs off the floor","Squeeze glutes and back extensors at the top","Hold 2 sec at peak; lower under control"], err:"Only lifting the arms without lifting the chest and legs together" },
  "Bird Dog":{ cues:["On all fours; extend opposite arm and leg simultaneously","Keep hips perfectly square — don't let them rotate","Return to start; alternate sides with full control"], err:"Rotating the hips or arching the lower back during the extension" },
  "Copenhagen Plank":{ cues:["Top foot on a bench; body in a straight side-plank line","Lift the bottom leg to meet the top (or hold it in the air)","Hold or perform reps; brace the inner thigh and core"], err:"Hips sagging or rolling forward out of the side-plank alignment" },
  "Medicine Ball Slam":{ cues:["Raise ball fully overhead; go up on your toes","Slam down explosively through the entire range of motion","Squat slightly to pick it up; maintain back position"], err:"Only throwing with the arms rather than using full-body power" },
  "Weighted Sit-Up":{ cues:["Hold weight at chest or overhead; feet anchored","Curl all the way up; keep weight close to body","Lower under control — 3–4 sec eccentric for maximum abs work"], err:"Jerking up with momentum or craning the neck forward" },
  // CARDIO
  "Jump Rope":{ cues:["Small jumps — just enough to clear the rope","Wrists do most of the turning, not the shoulders","Land on balls of feet with soft knees; stay on your toes"], err:"Jumping too high, using shoulder rotation, or landing flat-footed" },
  "Assault Bike":{ cues:["Drive both arms and legs simultaneously for max power","Stay seated for steady state; stand to sprint for intervals","Control your breath — don't go anaerobic too fast"], err:"Only pedaling with the legs and ignoring the arms entirely" },
  "Box Jumps":{ cues:["Full hip extension on the takeoff — jump up, not just out","Land softly with knees bent, absorbing through hips","Step down from the box — don't jump down for training sets"], err:"Landing stiff-legged or jumping down repeatedly (high impact risk)" },
  "Burpees":{ cues:["Controlled descent into plank; full push-up is optional","Jump or step feet to hands; stand and jump at the top","Maintain a consistent pace — don't rush and break form"], err:"Collapsing the lower back during the plank phase" },
  "Battle Ropes":{ cues:["Slight knee bend and athletic stance; hinge slightly forward","Drive from the hips and core — not just the arms","Control your breathing; alternate between wave patterns"], err:"Using only arm strength while keeping the rest of the body rigid" },
  "Sled Push":{ cues:["Lean into the sled at roughly 45°; drive with your legs","Short powerful strides; push through the full leg extension","Stay low throughout — don't stand up as fatigue sets in"], err:"Standing too upright and losing power transfer through the legs" },
  "Rowing Machine":{ cues:["Sequence: legs → lean back → pull arms to lower chest","Return: extend arms → hinge forward → bend knees","Drive legs first — 60% of power comes from the legs"], err:"Pulling with arms first instead of initiating with a powerful leg drive" },
  "Treadmill Run":{ cues:["Slight forward lean from ankles — not the waist","Midfoot strike under your center of mass; not a heel strike","Relax the shoulders and hands; breathe rhythmically"], err:"Holding the handrails, overstriding, or hunching the upper back" },
  "Stair Climber":{ cues:["Step with the full foot — don't just use the ball of the foot","Keep torso upright; use handrails only lightly for balance","Drive through the glutes on each step; control the descent"], err:"Leaning heavily on the handrails (reduces the cardiovascular demand)" },
  "Jump Squats":{ cues:["Squat to parallel; explode upward off both feet","Reach arms overhead at the top for full extension","Land softly with knees bent; absorb through the whole leg"], err:"Shallow squats or landing stiff-legged with straight knees" },
  "High Knees":{ cues:["Drive knees up to hip height with each step","Pump arms in opposition to your legs","Stay on the balls of your feet; keep a quick cadence"], err:"Leaning back or not driving knees high enough to get the benefit" },
  "Bear Crawl":{ cues:["Move opposite hand and foot simultaneously","Hips stay at knee level — don't let them rise up","Keep core tight; move with control before adding speed"], err:"Hips rising too high turning it into a crawl walk" },
  "Farmer's Walk":{ cues:["Stand tall; weights hang at sides without touching legs","Take short powerful steps; keep core braced throughout","Look straight ahead; shoulders stay packed and level"], err:"Leaning to one side, hunching the upper back, or letting shoulders shrug" },
  "Ski Erg":{ cues:["Start with arms overhead; pull ropes down explosively","Hinge at hips and bend knees to add power to the pull","Return arms overhead smoothly and quickly for the next stroke"], err:"Using only arms without engaging the hips and lower body" },
  "Sled Drag":{ cues:["Lean back against the resistance; drive legs into the ground","Short powerful strides; keep tension on the sled throughout","Stay low; use full leg extension on each step"], err:"Standing too upright and losing the backward lean needed for power" },
  "Prowler Push":{ cues:["Low handles: lean forward at 45°; high handles: more upright","Drive through the legs; short explosive steps","Stay low — let the legs do the work, not the upper body"], err:"Standing too tall and pushing with the upper body instead of the legs" },
  "Sprint Intervals":{ cues:["Full effort on the sprint; recover fully before the next one","Drive knees high; pump arms in opposition","Lean slightly forward; push off the balls of your feet"], err:"Not recovering enough between intervals, turning sprints into a slow jog" },
  "Elliptical":{ cues:["Light grip on handles; let legs drive the motion","Full range of motion — don't chop the stride short","Keep an upright posture; don't lean on the handlebars"], err:"Leaning heavily on the handlebars or using a very short choppy stride" },
  "Stationary Bike":{ cues:["Seat at hip height when standing; slight knee bend at the bottom","Pedal in smooth circles; push and pull through the full rotation","Engage your core; sit upright or lean forward for power"], err:"Seat too low causing knee strain or bouncing in the saddle" },
  "Incline Walk":{ cues:["Don't hold the handrails — let your arms swing naturally","Drive through the heel; engage glutes on each step","Set a pace where you can still hold a conversation"], err:"Holding the handrails (reduces calorie burn and reduces the challenge)" },
  "Echo Bike":{ cues:["Drive both arms and legs simultaneously for max output","Maintain steady power output rather than sprinting then dying","Control your breathing; set a pace you can sustain"], err:"Going too hard immediately and fading badly for the rest of the interval" },
  "Cycling":{ cues:["Seat height so there's a slight knee bend at the bottom of the stroke","Pedal in smooth circles — push, pull, and lift through","Stay relaxed in the upper body; power comes from the legs"], err:"Seat too low causing knee strain or bouncing in the saddle" },
  "Versa Climber":{ cues:["Opposite hand and foot move together — like climbing","Drive from both arms and legs equally","Keep a steady cadence; don't rush and lose coordination"], err:"Only pulling with the arms while the legs barely contribute" },
  // KETTLEBELL
  "Kettlebell Swing":{ cues:["Hip hinge — this is NOT a squat; knees only bend slightly","Snap hips forward explosively; the bell floats to shoulder height","Hike the bell back like a hiking a football; brace at the top"], err:"Squatting the swing or using arm strength instead of hip drive" },
  "Kettlebell Clean":{ cues:["Hinge to swing the bell; pull it close and flip the wrist","The bell should land softly in the rack — not crash onto the forearm","Keep the elbow tight to the body during the pull"], err:"Letting the bell arc away from the body and crash onto the forearm" },
  "Kettlebell Press":{ cues:["Rack position: bell rests on forearm against the shoulder","Press straight overhead; engage lat to support the shoulder","Lower under control back to rack; don't drop the bell"], err:"Pressing with the bell away from the forearm or flaring the elbow wide" },
  "Kettlebell Snatch":{ cues:["Hinge and hike the bell; pull it straight up close to the body","Punch through at the top so it lands on the back of the forearm gently","Lock out overhead; bell, wrist, elbow, shoulder in a straight line"], err:"Letting the bell flip over the hand too early or crashing onto the wrist" },
  "Kettlebell Turkish Get-Up":{ cues:["Keep your eyes on the bell the entire movement","Work through the stages: roll to elbow, post to hand, sweep, lunge, stand","Reverse each step on the way back down — 7 steps total"], err:"Rushing through the stages or letting the bell tip out of vertical alignment" },
  "Kettlebell Goblet Squat":{ cues:["Hold the bell by the horns at chest height; elbows inside knees","Squat to full depth; use elbows to push knees out at the bottom","Drive up through mid-foot; stay upright throughout"], err:"Elbows caving in, heels rising, or not reaching full depth" },
  "Kettlebell Deadlift":{ cues:["Bell between feet; hinge like a barbell deadlift","Brace core; push floor away as with a barbell deadlift","Squeeze glutes at lockout; lower under control"], err:"Rounding lower back or squatting the weight up rather than hinging" },
  "Kettlebell Row":{ cues:["Hinge 45°; pull bell to hip with elbow tracking back","Retract shoulder blade at the top of the pull","Lower under control; reach full arm extension at the bottom"], err:"Rotating the torso to gain momentum or not fully retracting the shoulder blade" },
  "Kettlebell Windmill":{ cues:["Bell locked out overhead; push hip toward the bell side","Lower opposite hand to the floor with eyes on the bell","Return to standing — bell stays locked out the whole time"], err:"Bending the overhead arm or losing the bell's locked-out position" },
  "Kettlebell Halo":{ cues:["Circle the bell around your head in a controlled arc","Keep the bell close to your head; elbows point down","Move slowly; feel the shoulder mobility through the full circle"], err:"Moving too fast or letting the bell drift far from the head" },
  "Kettlebell Clean and Press":{ cues:["Hinge and hike to clean the bell to the rack position","Without pausing, press overhead to full lockout","Lower back to rack; then to swing for the next clean"], err:"Letting the bell crash onto the forearm during the clean phase" },
  "Kettlebell Front Squat":{ cues:["Hold bell in rack position; keep elbows up throughout","Squat to full depth; stay upright using the rack as a counterbalance","Drive up through mid-foot; maintain rack position all the way up"], err:"Elbows dropping or the bell pulling you into forward lean" },
  "Kettlebell Lunge":{ cues:["Rack position or bell at sides; lunge forward or backward","Front shin stays vertical; rear knee toward the floor","Push through front heel to return; keep torso upright"], err:"Front knee caving inward or torso leaning forward excessively" },
  "Kettlebell Figure Eight":{ cues:["Wide stance; hinge slightly forward and pass bell between legs","Grab bell from behind and pass to the other hand in front","Maintain hinge throughout; keep a smooth continuous arc"], err:"Standing too upright or stopping the flow of the movement" },
  "Kettlebell Thruster":{ cues:["Front rack position; squat to depth with elbows up","Drive up explosively and use momentum to press bell overhead","Lower bell to rack as you descend into the next squat — fluid"], err:"Pressing separately from the squat instead of using squat drive" },
  "Kettlebell Renegade Row":{ cues:["Push-up position on two kettlebells; feet wide for stability","Row one bell to hip while resisting rotation","Alternate sides; keep hips square and level throughout"], err:"Hips rotating or rising during the row phase" },
  "Kettlebell Farmers Carry":{ cues:["Stand tall with bells at sides; shoulders packed down and back","Take short controlled steps; keep core braced throughout","Look straight ahead; maintain upright posture the entire walk"], err:"Leaning to one side or letting shoulders shrug up toward the ears" },
  "Bottoms-Up Press":{ cues:["Bell flipped upside down; grip tight to stabilize it","Press overhead slowly — the instability demands shoulder control","Lower under control; grip intensity must not waver"], err:"Letting the bell tip before achieving full lockout" },
  "Kettlebell Sumo Deadlift":{ cues:["Wide stance with bell between feet; toes angled out","Hinge and grip the handle; neutral spine before the pull","Drive knees out; push floor away to stand; lockout with glutes"], err:"Knees caving inward or rounding lower back at the setup" },
  "Kettlebell Jump Squat":{ cues:["Bell held at chest or between legs; squat to parallel","Explode upward off both feet; fully extend hips and knees","Land softly with knees bent; absorb through the whole leg"], err:"Landing stiff-legged or not squatting deep enough before the jump" },
  // ALIASES
  "Hip Thrust (Bodyweight)":{ cues:["Bench at mid-scapula; feet flat hip-width apart","Full range of motion — all the way down","Squeeze glutes hard at the top; chin tucked throughout"], err:"Hyperextending lower back at lockout" },
};

const DEFAULT_MET = 4.5; // fallback for unlisted exercises
const SECS_PER_REP = 3.5; // avg time-under-tension per rep (resistance training)
const REST_MET = 1.3;     // seated rest between sets

// Returns estimated kcal for a completed exercise (all sets), given body weight in lbs.
// Formula: Calories = MET × weight_kg × duration_hours
function calcExerciseCalories(sets, exerciseName, bodyWeightLbs) {
  if (!bodyWeightLbs || bodyWeightLbs <= 0) return 0;
  const bwKg = bodyWeightLbs * 0.453592;
  const met = EXERCISE_MET[exerciseName] ?? DEFAULT_MET;
  const isCardio = !!CARDIO_SET_CONFIG[exerciseName];
  let totalActiveSecs = 0;
  let totalRestSecs = 0;
  sets.forEach((set, i) => {
    if (set.type === "warmup") return;
    if (isCardio) {
      // For cardio, `r` field holds time in minutes (TIME label)
      const mins = parseFloat(set.r) || 0;
      totalActiveSecs += mins * 60;
    } else {
      const reps = parseInt(set.r) || 0;
      totalActiveSecs += reps * SECS_PER_REP;
    }
    // Add rest period after each set (except the last)
    if (i < sets.length - 1) totalRestSecs += 90;
  });
  const activeHrs = totalActiveSecs / 3600;
  const restHrs = totalRestSecs / 3600;
  return Math.round(met * bwKg * activeHrs + REST_MET * bwKg * restHrs);
}

// Returns total estimated kcal for a full session's exercise array.
function calcSessionCalories(exs, bodyWeightLbs) {
  if (!bodyWeightLbs || !exs) return 0;
  return exs.reduce((sum, ex) => {
    const workingSets = (ex.sets || []).filter(s => s.r && s.type !== "warmup");
    return sum + calcExerciseCalories(workingSets, ex.name, bodyWeightLbs);
  }, 0);
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
  useScrollLock();
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

function ChromeCard({ children, glow = false, gold = false, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
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
  const [imgErr, setImgErr] = useState(false);
  if (url && !imgErr) return (
    <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0, overflow:"hidden", border:`1.5px solid ${gold ? G.gold+"88" : G.purple+"88"}`, boxShadow: gold ? G.goldGlow2 : `0 0 8px ${G.purple}88` }}>
      <img src={url} alt="" onError={()=>setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
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

function useScrollLock() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
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


function UserProfileModal({ user, currentUserId, onClose }) {
  useScrollLock();
  const [prof, setProf] = useState(null);
  const [userSessions, setUserSessions] = useState(null);
  const [err, setErr] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [followListMode, setFollowListMode] = useState(null);
  const [subUser, setSubUser] = useState(null);

  useEffect(() => {
    async function load() {
      const [profRes, sessRes, followRes, follCountRes, follwCountRes] = await Promise.all([
        supabase.from("profiles").select("username, avatar_initials, avatar_url, points, streak, sessions_count, location").eq("id", user.id).single(),
        supabase.from("sessions").select("id, name, exercises, sets, volume, points, date, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(200),
        currentUserId ? supabase.from("follows").select("following_id").eq("follower_id", currentUserId).eq("following_id", user.id) : Promise.resolve({ data: [] }),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user.id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
      ]);
      if (profRes.error || !profRes.data) {
        setErr("Could not load profile");
        setProf({});
        setUserSessions([]);
        return;
      }
      setProf(profRes.data);
      if (sessRes.data) {
        setUserSessions(sessRes.data.map(s => ({ id: s.id, name: s.name, exs: s.exercises, sets: s.sets, vol: s.volume, pts: s.points, date: s.date, createdAt: s.created_at })));
      } else if (sessRes.error) {
        setErr("Workouts are private");
        setUserSessions([]);
      }
      if (followRes.data?.length > 0) setIsFollowing(true);
      setFollowersCount(follCountRes.count ?? 0);
      setFollowingCount(follwCountRes.count ?? 0);
    }
    load();
  }, [user.id, currentUserId]);

  const toggleFollow = async () => {
    if (!currentUserId || followLoading) return;
    setFollowLoading(true);
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", user.id);
      setIsFollowing(false);
      setFollowersCount(c => Math.max(0, (c || 0) - 1));
    } else {
      await supabase.from("follows").insert({ follower_id: currentUserId, following_id: user.id });
      setIsFollowing(true);
      setFollowersCount(c => (c || 0) + 1);
    }
    setFollowLoading(false);
  };

  const prs = userSessions ? calcPRs(userSessions) : {};
  const topPrs = Object.entries(prs).sort(([, a], [, b]) => b.est1rm - a.est1rm).slice(0, 10);
  const loading = prof === null;
  const P = G.purple;

  return (
    <>
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.97)", zIndex:780, overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 32px)" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"calc(env(safe-area-inset-top,0px) + 16px) 18px 0" }}>
        <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textMid, fontSize:22, cursor:"pointer", padding:"4px 8px 4px 0", lineHeight:1 }}>←</button>
          <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>ATHLETE <span style={{ color:P, textShadow:`0 0 12px ${P}` }}>PROFILE</span></div>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 0", fontFamily:FONT.body, fontSize:12, color:G.textDim, letterSpacing:2 }}>LOADING...</div>
        ) : (
          <>
            {/* Avatar + name */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, marginBottom:28 }}>
              <AvatarBadge initials={prof?.avatar_initials || user.av} url={prof?.avatar_url || user.url} size={90} gold/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>{prof?.username || user.name}</div>
                {prof?.location && <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2, marginTop:4, textTransform:"uppercase" }}>📍 {prof.location}</div>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                {user.rank && <div style={{ background:`${P}22`, border:`1px solid ${P}44`, borderRadius:20, padding:"4px 14px", fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:P }}>#{user.rank} RANKED</div>}
                {currentUserId && !user.isMe && (
                  <button onClick={toggleFollow} disabled={followLoading} style={{ padding:"6px 18px", borderRadius:20, border:`1px solid ${isFollowing ? G.borderB : P}`, background: isFollowing ? "transparent" : `${P}22`, color: isFollowing ? G.textMid : P, fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>
                    {followLoading ? "..." : isFollowing ? "✓ FOLLOWING" : "FOLLOW +"}
                  </button>
                )}
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:10 }}>
              {[
                { label:"POINTS", val:(prof?.points ?? user.pts ?? 0).toLocaleString() },
                { label:"STREAK", val:`${prof?.streak ?? user.streak ?? 0}d` },
                { label:"SESSIONS", val:prof?.sessions_count ?? user.sessions ?? 0 },
              ].map(({ label, val }) => (
                <div key={label} style={{ background:"rgba(20,18,40,0.95)", border:`1px solid ${P}22`, borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:18, color:"#fff", letterSpacing:1 }}>{val}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginTop:3 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Followers / Following pills */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
              {[
                { label:"FOLLOWERS", count:followersCount, mode:"followers" },
                { label:"FOLLOWING", count:followingCount, mode:"following" },
              ].map(({ label, count, mode }) => (
                <button key={mode} onClick={() => setFollowListMode(mode)} style={{ background:"rgba(20,18,40,0.95)", border:`1px solid ${P}22`, borderRadius:10, padding:"11px 8px", textAlign:"center", cursor:"pointer" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:20, color:P, letterSpacing:1 }}>{count ?? "—"}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginTop:3 }}>{label}</div>
                </button>
              ))}
            </div>

            {/* PRs */}
            <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:3, color:G.gold, textTransform:"uppercase", marginBottom:12 }}>◆ TOP PRs</div>
            {err && userSessions?.length === 0 ? (
              <div style={{ background:"rgba(20,18,40,0.8)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:20, textAlign:"center", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1.5 }}>
                WORKOUTS ARE PRIVATE
              </div>
            ) : userSessions === null ? (
              <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1.5, textAlign:"center", padding:20 }}>LOADING...</div>
            ) : topPrs.length === 0 ? (
              <div style={{ background:"rgba(20,18,40,0.8)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:20, textAlign:"center", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1.5 }}>
                NO PRs YET
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {topPrs.map(([exName, pr], i) => (
                  <div key={exName} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(20,18,40,0.95)", border:`1px solid ${i === 0 ? G.gold + "44" : G.borderB}`, borderRadius:10, padding:"11px 14px" }}>
                    <div style={{ fontFamily:FONT.display, fontSize:13, color: i === 0 ? G.gold : G.textDim, width:20 }}>#{i+1}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:13, color:"#fff", letterSpacing:1, textTransform:"uppercase" }}>{exName}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, marginTop:2 }}>{pr.weight} lbs × {pr.reps} reps · {pr.date}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                      <div style={{ fontFamily:FONT.display, fontSize:20, color: i === 0 ? G.gold : "#fff", textShadow: i === 0 ? G.goldGlow2 : "none", letterSpacing:1 }}>{pr.est1rm}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>EST 1RM</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {followListMode && (
      <FollowListModal
        userId={user.id}
        mode={followListMode}
        onClose={() => setFollowListMode(null)}
        onViewProfile={u => { setFollowListMode(null); setSubUser({ id: u.id, av: u.avatar_initials || "?", url: u.avatar_url || null, name: u.username || "ATHLETE", rank: null }); }}
      />
    )}

    {subUser && (
      <UserProfileModal
        user={subUser}
        currentUserId={currentUserId}
        onClose={() => setSubUser(null)}
      />
    )}
    </>
  );
}
function HomeScreen({ sessions, leaderboard, onQuickStart, showToast, profile, onViewProfile }) {
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
  const [lbExpanded, setLbExpanded] = useState(false);
  const [qsExpanded, setQsExpanded] = useState(true);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const unlockedBadges = getUnlockedBadges(sessions, profile);

  const WORKOUTS = [
    { name:"PUSH DAY", ico:"⊞", iconBg:"#4A2BE2", sub:"Chest · Shoulders · Tris", exs:["Barbell Bench Press","Incline Dumbbell Press","Lateral Raises","Tricep Pushdown"] },
    { name:"PULL DAY", ico:"◎", iconBg:"#1A6FD4", sub:"Back · Biceps", exs:["Barbell Deadlift","Barbell Row","Lat Pulldown","Barbell Curl"] },
    { name:"LEG DAY", ico:"◈", iconBg:"#C4520A", sub:"Legs · Glutes · Calves", exs:["Barbell Squat","Leg Press","Romanian Deadlift","Leg Curl"] },
    { name:"FULL BODY", ico:"⚡", iconBg:"#16873A", sub:"Total Strength", exs:["Barbell Squat","Barbell Bench Press","Barbell Deadlift","Barbell Row"] },
  ];

  const P = G.purple;

  return (
    <div style={{ padding:"calc(env(safe-area-inset-top, 0px) + 10px) 0 0", minHeight:"100vh" }}>

      {/* ── Header ── */}
      <div style={{ display:"flex", alignItems:"center", padding:"0 18px", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
          <img src={logoImg} alt="SFC" style={{ width:46, height:46, borderRadius:"50%", objectFit:"cover", objectPosition:"center top", border:`2px solid ${P}66`, boxShadow:`0 0 14px ${P}55` }}/>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:26, letterSpacing:3, color:"#fff", lineHeight:1, textTransform:"uppercase" }}>SOCIAL</div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:1 }}>
              <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${P},transparent)`, width:14 }}/>
              <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:3, color:P, textTransform:"uppercase" }}>FIT CLUB</div>
              <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${P})`, width:14 }}/>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:38, height:38, border:`1.5px solid ${P}66`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, position:"relative", background:`${P}15` }}>
            🔔
            {sessions.length === 0 && <div style={{ position:"absolute", top:2, right:2, width:8, height:8, borderRadius:"50%", background:P, boxShadow:`0 0 6px ${P}` }}/>}
          </div>
          <div style={{ width:38, height:38, border:`1.5px solid ${P}88`, borderRadius:"50%", overflow:"hidden", background:`linear-gradient(135deg,${P},${G.purpleBright})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              : <span style={{ fontFamily:FONT.display, fontSize:16, color:"#fff", letterSpacing:1 }}>{(profile?.avatar_initials||"ME")[0]}</span>
            }
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div style={{ padding:"0 18px", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:P, boxShadow:`0 0 8px ${P}` }}/>
        <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Strength in Community</div>
      </div>

      {/* ── Stats Card ── */}
      <div style={{ margin:"0 16px 12px", background:"rgba(20,18,40,0.95)", border:`1px solid ${P}33`, borderRadius:14, padding:"16px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:`${P}15`, pointerEvents:"none" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <div style={{ width:50, height:50, borderRadius:"50%", border:`2px solid ${P}66`, overflow:"hidden", background:`linear-gradient(135deg,${P}44,${G.purpleBright}44)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              : <span style={{ fontFamily:FONT.display, fontSize:20, color:"#fff" }}>{(profile?.avatar_initials||"ME")[0]}</span>
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>YOUR STATS</div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>{sessions.length} sessions logged</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:FONT.display, fontSize:30, color:P, letterSpacing:1, lineHeight:1, textShadow:`0 0 16px ${P}` }}>{myPts.toLocaleString()}</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>POINTS</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[{l:"RANK",v:`#${myRank}`,ico:"👑"},{l:"DAY STREAK",v:`${profile?.streak||0}`,ico:"🔥"},{l:"THIS WEEK",v:`${thisWeekSessions}`,ico:"💪"}].map(s=>(
            <div key={s.l} style={{ flex:1, background:"rgba(0,0,0,0.35)", borderRadius:9, padding:"10px 4px", textAlign:"center", border:`1px solid ${P}22` }}>
              <div style={{ fontSize:14, marginBottom:4 }}>{s.ico}</div>
              <div style={{ fontFamily:FONT.display, fontSize:19, color:"#fff", letterSpacing:1 }}>{s.v}</div>
              <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Weekly Volume ── */}
      <div style={{ margin:"0 16px 12px", background:"rgba(20,18,40,0.95)", border:`1px solid ${P}22`, borderRadius:14, padding:"14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ fontSize:15 }}>📊</span>
            <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>Weekly Volume</div>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1 }}>LBS</div>
        </div>
        {/* Line-style chart */}
        <div style={{ position:"relative", height:64 }}>
          <svg width="100%" height="64" style={{ overflow:"visible" }}>
            {weeklyVol.map((v, i) => {
              const x = `${(i / 6) * 100}%`;
              const y = 52 - Math.max(0, (v / maxVol) * 48);
              const todayIdx = (new Date().getDay() + 6) % 7;
              return (
                <g key={i}>
                  {i < 6 && (() => {
                    const x2 = `${((i+1) / 6) * 100}%`;
                    const y2 = 52 - Math.max(0, (weeklyVol[i+1] / maxVol) * 48);
                    return <line x1={x} y1={y} x2={x2} y2={y2} stroke={`${P}88`} strokeWidth="1.5" strokeDasharray="3,2"/>;
                  })()}
                  <circle cx={x} cy={y} r={i === todayIdx ? 5 : 3.5}
                    fill={i === todayIdx ? P : `${P}66`}
                    stroke={i === todayIdx ? "#fff" : "none"} strokeWidth="1.5"/>
                </g>
              );
            })}
          </svg>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            {DAYS_SHORT.map((d, i) => {
              const todayIdx = (new Date().getDay() + 6) % 7;
              return <div key={i} style={{ fontFamily:FONT.mono, fontSize:9, color: i===todayIdx ? P : G.textDim, letterSpacing:1, flex:1, textAlign:"center" }}>{d}</div>;
            })}
          </div>
        </div>
      </div>

      {/* ── Badges ── */}
      <div onClick={() => setBadgesOpen(true)} style={{ margin:"0 16px 12px", background:"rgba(20,18,40,0.95)", border:`1px solid ${G.gold}33`, borderRadius:14, padding:"14px 16px", cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: unlockedBadges.size > 0 ? 12 : 0 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:`${G.gold}20`, border:`1px solid ${G.gold}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏆</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>MY BADGES</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1 }}>{unlockedBadges.size} of {ACHIEVEMENTS.length} unlocked</div>
          </div>
          <div style={{ fontFamily:FONT.mono, fontSize:18, color:G.textDim }}>›</div>
        </div>
        {unlockedBadges.size > 0 && (
          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
            {ACHIEVEMENTS.filter(a => unlockedBadges.has(a.id)).slice(0, 9).map(a => (
              <div key={a.id} style={{ width:36, height:36, borderRadius:9, background:`${G.gold}15`, border:`1px solid ${G.gold}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 8px ${G.gold}22` }}>{a.ico}</div>
            ))}
            {unlockedBadges.size > 9 && (
              <div style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.display, fontSize:10, color:G.textMid, letterSpacing:0.5 }}>+{unlockedBadges.size - 9}</div>
            )}
          </div>
        )}
        {unlockedBadges.size === 0 && (
          <div style={{ display:"flex", gap:7 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{ width:36, height:36, borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, opacity:0.4 }}>🔒</div>
            ))}
            <div style={{ flex:1, display:"flex", alignItems:"center", paddingLeft:4 }}>
              <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1 }}>Log your first session to unlock!</div>
            </div>
          </div>
        )}
      </div>
      {badgesOpen && <AchievementsModal sessions={sessions} profile={profile} onClose={() => setBadgesOpen(false)}/>}

      {/* ── Leaderboard row ── */}
      <div style={{ margin:"0 16px 8px" }}>
        <div onClick={()=>setLbExpanded(p=>!p)} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(20,18,40,0.95)", border:`1px solid ${P}22`, borderRadius:lbExpanded ? "14px 14px 0 0" : 14, padding:"14px 16px", cursor:"pointer" }}>
          <div style={{ width:36, height:36, borderRadius:9, background:`${P}25`, border:`1px solid ${P}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏆</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>LEADERBOARD</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1 }}>All time</div>
          </div>
          <div style={{ fontFamily:FONT.mono, fontSize:18, color:G.textDim, transform: lbExpanded ? "rotate(90deg)" : "none", transition:"transform 0.2s" }}>›</div>
        </div>
        {lbExpanded && (
          <div style={{ background:"rgba(16,14,34,0.98)", border:`1px solid ${P}22`, borderTop:"none", borderRadius:"0 0 14px 14px", padding:"8px 12px 12px" }}>
            {leaderboard.length === 0 && <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1, textAlign:"center", padding:"16px 0" }}>No users yet</div>}
            {leaderboard.slice(0, 5).map(u => (
              <div key={u.rank} onClick={() => !u.isMe && onViewProfile && onViewProfile(u)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 4px", borderBottom:`1px solid ${P}11`, cursor: u.isMe ? "default" : "pointer" }}>
                <div style={{ fontFamily:FONT.mono, fontSize:11, color:G.textDim, width:20 }}>#{u.rank}</div>
                <AvatarBadge initials={u.av} url={u.url} size={32} gold={u.isMe}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:u.isMe?P:"#fff", textTransform:"uppercase" }}>{u.name}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{u.sessions} sessions · {u.streak}d streak</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:14, color:u.isMe?P:G.textMid }}>{u.pts.toLocaleString()}</div>
                  {!u.isMe && <div style={{ fontSize:10, color:G.textDim }}>›</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Start row ── */}
      <div style={{ margin:"0 16px 16px" }}>
        <div onClick={()=>setQsExpanded(p=>!p)} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(20,18,40,0.95)", border:`1px solid ${P}22`, borderRadius:qsExpanded ? "14px 14px 0 0" : 14, padding:"14px 16px", cursor:"pointer" }}>
          <div style={{ width:36, height:36, borderRadius:9, background:`${P}25`, border:`1px solid ${P}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚡</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>QUICK START</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1 }}>Start a workout</div>
          </div>
          <div style={{ fontFamily:FONT.mono, fontSize:18, color:G.textDim, transform: qsExpanded ? "rotate(90deg)" : "none", transition:"transform 0.2s" }}>›</div>
        </div>
        {qsExpanded && (
          <div style={{ background:"rgba(16,14,34,0.98)", border:`1px solid ${P}22`, borderTop:"none", borderRadius:"0 0 14px 14px", padding:"10px 12px 12px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              {WORKOUTS.map(w => (
                <div key={w.name} onClick={() => { onQuickStart(w); showToast(`${w.name} — loading in Train tab!`); }}
                  style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(0,0,0,0.3)", border:`1px solid rgba(255,255,255,0.07)`, borderLeft:`3px solid ${w.iconBg}`, borderRadius:10, padding:"12px 10px", cursor:"pointer" }}>
                  <div style={{ width:36, height:36, borderRadius:8, background:w.iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"#fff", flexShrink:0 }}>{w.ico}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:12, color:"#fff", letterSpacing:1.5, textTransform:"uppercase", lineHeight:1.2 }}>{w.name}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:0.5, marginTop:2 }}>{w.sub}</div>
                  </div>
                  <div style={{ color:G.textDim, fontSize:14, flexShrink:0 }}>›</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseDemoModal({ name, onClose }) {
  useScrollLock();
  const tips = EXERCISE_TIPS[name];
  const cat = EX_CAT_LOOKUP[name];
  const primaryMuscle = Object.entries(EXERCISE_MUSCLE_MAP[name] || {}).sort((a,b)=>b[1]-a[1])[0];
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " proper form technique")}`;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.72)" }}/>
      <div style={{ position:"relative", background:"#0F0E22", borderRadius:"18px 18px 0 0", border:`1px solid ${G.borderB}`, borderBottom:"none", maxHeight:"80vh", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"18px 18px 12px" }}>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:3 }}>{name}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {cat && <span style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, color:G.purple, background:`${G.purple}22`, border:`1px solid ${G.purple}44`, borderRadius:4, padding:"2px 7px", textTransform:"uppercase" }}>{cat}</span>}
              {primaryMuscle && MUSCLE_LABELS[primaryMuscle[0]]?.toUpperCase() !== cat?.toUpperCase() && <span style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, color:G.textDim, background:`rgba(255,255,255,0.06)`, borderRadius:4, padding:"2px 7px", textTransform:"uppercase" }}>{MUSCLE_LABELS[primaryMuscle[0]]}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20, lineHeight:1, padding:"2px 4px", flexShrink:0 }}>✕</button>
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"0 18px 24px", WebkitOverflowScrolling:"touch" }}>
          {tips ? (
            <>
              <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:10 }}>FORM CUES</div>
              {tips.cues.map((cue, i) => (
                <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:`${G.gold}22`, border:`1px solid ${G.gold}55`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:10, color:G.gold }}>{i+1}</div>
                  </div>
                  <div style={{ fontFamily:FONT.body, fontSize:13, color:"#fff", letterSpacing:0.5, lineHeight:1.5 }}>{cue}</div>
                </div>
              ))}
              <div style={{ marginTop:14, background:"rgba(255,107,0,0.08)", border:"1px solid rgba(255,107,0,0.25)", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontFamily:FONT.body, fontSize:8, letterSpacing:2, color:"#FF6B00", textTransform:"uppercase", marginBottom:4 }}>⚠ COMMON MISTAKES</div>
                <div style={{ fontFamily:FONT.body, fontSize:12, color:"#FF9B55", lineHeight:1.5 }}>{tips.err}</div>
              </div>
            </>
          ) : (
            <div style={{ padding:"12px 0", fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.6 }}>
              No form guide available for this exercise yet. Search YouTube for a walkthrough:
            </div>
          )}
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:18, background:"rgba(255,0,0,0.12)", border:"1px solid rgba(255,0,0,0.3)", borderRadius:10, padding:"12px", textDecoration:"none" }}>
            <span style={{ fontSize:18 }}>▶</span>
            <span style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#FF4444", textTransform:"uppercase" }}>WATCH ON YOUTUBE</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function ExercisePicker({ onSelect, onClose }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("ALL");
  const [subCat, setSubCat] = useState(null);
  const [demoEx, setDemoEx] = useState(null);
  const muscleCats = ["ALL", ...Object.keys(EXERCISE_CATS)];
  const equipCats = Object.keys(EQUIPMENT_CATS);
  const subCats = cat !== "ALL" ? EXERCISE_SUBCATS[cat] : null;

  const handleCatChange = (c) => { setCat(c); setSubCat(null); };

  const filtered = EXERCISES.filter(e => {
    const matchCat = cat === "ALL" ? true
      : EQUIPMENT_CATS[cat] ? EQUIPMENT_CATS[cat].includes(e)
      : EX_CAT_LOOKUP[e] === cat;
    const matchSub = !subCat || (subCats && subCats[subCat]?.includes(e));
    const matchQ = !q || e.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchSub && matchQ;
  });

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:7, padding:"10px 14px 10px 38px", color:"#fff", fontSize:13, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1.5, textTransform:"uppercase" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)" }}/>
      <div
        onTouchStart={e => e.stopPropagation()}
        style={{ position:"relative", background:"#0F0E22", borderRadius:"18px 18px 0 0", border:`1px solid ${G.borderB}`, borderBottom:"none", maxHeight:"92vh", display:"flex", flexDirection:"column", minHeight:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px 12px", flexShrink:0 }}>
          <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:G.gold }}>BROWSE EXERCISES</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
        </div>

        <div style={{ padding:"0 18px 10px", position:"relative", flexShrink:0 }}>
          <span style={{ position:"absolute", left:30, top:"50%", transform:"translateY(-50%)", color:G.textDim, fontSize:14, pointerEvents:"none" }}>🔍</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="SEARCH EXERCISES..." style={inp}/>
          {q && <button onClick={()=>setQ("")} style={{ position:"absolute", right:28, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13 }}>✕</button>}
        </div>

        <div style={{ display:"flex", gap:6, padding:"0 18px 4px", overflowX:"auto", scrollbarWidth:"none", flexShrink:0 }}>
          {muscleCats.map(c => (
            <button key={c} onClick={()=>handleCatChange(c)} style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:`1px solid ${cat===c ? G.gold : G.borderB}`, background: cat===c ? `${G.gold}20` : "transparent", color: cat===c ? G.gold : G.textMid, fontFamily:FONT.body, fontSize:10, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:6, padding:"0 18px 8px", overflowX:"auto", scrollbarWidth:"none", alignItems:"center", flexShrink:0 }}>
          <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:2, textTransform:"uppercase", flexShrink:0, marginRight:2 }}>EQUIPMENT</div>
          {equipCats.map(c => (
            <button key={c} onClick={()=>handleCatChange(c)} style={{ flexShrink:0, padding:"4px 11px", borderRadius:20, border:`1px solid ${cat===c ? G.purpleLight : G.borderB}`, background: cat===c ? `${G.purple}30` : "transparent", color: cat===c ? G.purpleLight : G.textDim, fontFamily:FONT.body, fontSize:10, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{c}</button>
          ))}
        </div>
        {subCats && (
          <div style={{ display:"flex", gap:5, padding:"0 18px 8px", overflowX:"auto", scrollbarWidth:"none", alignItems:"center", flexShrink:0 }}>
            <div style={{ width:3, height:3, borderRadius:"50%", background:G.purple, flexShrink:0 }}/>
            <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:2, textTransform:"uppercase", flexShrink:0, marginRight:2 }}>FOCUS</div>
            <button onClick={()=>setSubCat(null)} style={{ flexShrink:0, padding:"3px 10px", borderRadius:20, border:`1px solid ${!subCat ? G.purple : G.borderB}`, background: !subCat ? `${G.purple}25` : "transparent", color: !subCat ? G.purpleLight : G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>ALL</button>
            {Object.keys(subCats).map(sc => (
              <button key={sc} onClick={()=>setSubCat(sc)} style={{ flexShrink:0, padding:"3px 10px", borderRadius:20, border:`1px solid ${subCat===sc ? G.purple : G.borderB}`, background: subCat===sc ? `${G.purple}25` : "transparent", color: subCat===sc ? G.purpleLight : G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{sc}</button>
            ))}
          </div>
        )}

        <div style={{ overflowY:"auto", flex:1, minHeight:0, paddingBottom:24, WebkitOverflowScrolling:"touch", overscrollBehavior:"contain" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px 18px", color:G.textDim, fontFamily:FONT.body, fontSize:12, letterSpacing:2 }}>NO EXERCISES FOUND</div>
          )}
          {filtered.map(e => {
            const exCat = EX_CAT_LOOKUP[e];
            const primaryMuscle = Object.entries(EXERCISE_MUSCLE_MAP[e] || {}).sort((a,b)=>b[1]-a[1])[0];
            return (
              <div key={e} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 18px", borderBottom:`1px solid ${G.borderB}`, transition:"background 0.15s" }}
                onMouseEnter={ev=>ev.currentTarget.style.background=`${G.gold}10`}
                onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                <div onClick={()=>{ onSelect(e); onClose(); }} style={{ flex:1, cursor:"pointer", minWidth:0 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:14, letterSpacing:1.5, color:"#fff", textTransform:"uppercase" }}>{e}</div>
                  {primaryMuscle && <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:1, color:G.textMid, marginTop:2 }}>{MUSCLE_LABELS[primaryMuscle[0]]}</div>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                  <button onClick={ev=>{ ev.stopPropagation(); setDemoEx(e); }} style={{ background:`${G.gold}15`, border:`1px solid ${G.gold}33`, borderRadius:5, color:G.gold, cursor:"pointer", fontSize:11, fontFamily:FONT.body, letterSpacing:1, padding:"3px 7px", lineHeight:1 }}>📹</button>
                  {exCat && <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:1.5, color:G.purple, background:`${G.purple}22`, border:`1px solid ${G.purple}44`, borderRadius:4, padding:"3px 7px", textTransform:"uppercase" }}>{exCat}</div>}
                </div>
              </div>
            );
          })}
          {demoEx && <ExerciseDemoModal name={demoEx} onClose={()=>setDemoEx(null)}/>}
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
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"16px 16px 0 0", border:`1px solid ${G.border}`, borderBottom:"none", maxHeight:"calc(100vh - 60px)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"22px 18px 0", flexShrink:0 }}>
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"0 auto 18px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>PLATE CALCULATOR</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
        </div>
        </div>

        <div style={{ overflowY:"auto", flex:1, padding:"0 18px", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 100px)" }}>

        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:7 }}>BAR WEIGHT</div>
        <div style={{ display:"flex", gap:6, marginBottom:16 }}>
          {[{l:"STANDARD",v:45},{l:"WOMEN'S",v:35},{l:"TRAP/HEX",v:60},{l:"EZ-CURL",v:25}].map(b => (
            <button key={b.v} onClick={() => setBarWeight(b.v)} style={{ flex:1, padding:"7px 4px", borderRadius:6, border:`1px solid ${barWeight===b.v ? G.gold : G.borderB}`, background:barWeight===b.v ? `${G.gold}18` : "transparent", color:barWeight===b.v ? G.gold : G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1, cursor:"pointer", textTransform:"uppercase", lineHeight:1.4 }}>
              <div>{b.l}</div><div style={{ fontSize:12, marginTop:2 }}>{b.v} LB</div>
            </button>
          ))}
        </div>

        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:7 }}>TARGET WEIGHT (LBS)</div>
        <input type="number" inputMode="decimal" value={target} onChange={e => setTarget(e.target.value)} placeholder="E.G. 225"
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
    </div>
  );
}

function TrainingMaxModal({ onClose }) {
  useScrollLock();
  const [mode, setMode] = useState("1rm");
  const [rm, setRm] = useState("");
  const [calcW, setCalcW] = useState("");
  const [calcR, setCalcR] = useState("");
  const est1rm = mode === "calc" && calcW && calcR
    ? Math.round(parseFloat(calcW) * (1 + parseInt(calcR)/30))
    : parseFloat(rm) || 0;
  const pcts = [50,55,60,65,70,75,80,85,90,92,95];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.92)", zIndex:700, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:G.bg2, border:`1px solid ${G.borderB}`, borderRadius:"16px 16px 0 0", width:"100%", maxWidth:480, maxHeight:"85vh", overflowY:"auto", padding:"20px 18px", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 100px)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:2, color:G.gold }}>⚡ TRAINING MAX CALC</div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:6, color:G.textMid, cursor:"pointer", fontSize:14, padding:"4px 9px" }}>✕</button>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[["1rm","ENTER 1RM"],["calc","ESTIMATE FROM SET"]].map(([m,l]) => (
            <button key={m} onClick={()=>setMode(m)} style={{ flex:1, padding:"8px", borderRadius:8, border:`1px solid ${mode===m?G.gold:G.borderB}`, background:mode===m?`${G.gold}18`:"transparent", color:mode===m?G.gold:G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{l}</button>
          ))}
        </div>
        {mode === "1rm" ? (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>YOUR 1RM (LBS)</div>
            <input type="number" inputMode="decimal" value={rm} onChange={e=>setRm(e.target.value)} placeholder="e.g. 315"
              style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"11px 13px", color:"#fff", fontFamily:FONT.body, fontSize:18, outline:"none" }}/>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            {[["calcW","WEIGHT (LBS)","e.g. 275"],["calcR","REPS","e.g. 3"]].map(([st,l,ph]) => (
              <div key={st}>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>{l}</div>
                <input type="number" inputMode="decimal" value={st==="calcW"?calcW:calcR} onChange={e=>st==="calcW"?setCalcW(e.target.value):setCalcR(e.target.value)} placeholder={ph}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"11px 13px", color:"#fff", fontFamily:FONT.body, fontSize:16, outline:"none" }}/>
              </div>
            ))}
          </div>
        )}
        {est1rm > 0 && (
          <>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>
              {mode==="calc" ? `EST. 1RM: ${est1rm} LBS · ` : ""}PERCENTAGE TARGETS
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {pcts.map(pct => (
                <ChromeCard key={pct} style={{ padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:1 }}>{pct}%</div>
                  <div style={{ fontFamily:FONT.display, fontSize:16, color:G.gold, letterSpacing:1 }}>{Math.round(est1rm * pct/100 / 2.5) * 2.5} lbs</div>
                </ChromeCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeloadModal({ onClose, onConfirm }) {
  useScrollLock();
  const DELOAD_TIPS = [
    { ico:"⚖️", title:"REDUCE WEIGHT", body:"Use 40–60% of your normal training weights. The goal is blood flow and technique practice, not stimulus." },
    { ico:"📉", title:"CUT VOLUME IN HALF", body:"If you normally do 4 sets per exercise, do 2. Keep the same exercises — just less of everything." },
    { ico:"🎯", title:"FOCUS ON FORM", body:"Use lighter loads to drill technique on your weakest movements. Film yourself. Fix the little things." },
    { ico:"😴", title:"PRIORITIZE SLEEP", body:"This week is when adaptation actually happens. 8+ hours of sleep and active recovery (walks, stretching, foam rolling) are the workout." },
    { ico:"🔋", title:"COME BACK STRONGER", body:"Studies show a planned deload every 4–6 weeks produces more long-term strength gains than grinding continuously. Trust the process." },
  ];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:950, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.75)" }}/>
      <div style={{ position:"relative", background:"#0F0E22", borderRadius:"18px 18px 0 0", border:`1px solid ${G.purple}55`, borderBottom:"none", maxHeight:"85vh", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 18px 4px" }}>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:G.purpleLight, textTransform:"uppercase" }}>🔄 DELOAD WEEK</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textDim, textTransform:"uppercase", marginTop:2 }}>Train smart · recover harder</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"12px 18px", WebkitOverflowScrolling:"touch" }}>
          <div style={{ background:`${G.purple}18`, border:`1px solid ${G.purple}33`, borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.5, lineHeight:1.5 }}>
              You've trained hard for <span style={{ color:G.purpleLight, fontFamily:FONT.display }}>4+ consecutive weeks</span>. A deload lets your joints, tendons, and nervous system catch up — and you'll come back setting PRs.
            </div>
          </div>
          {DELOAD_TIPS.map((t, i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:`${G.purple}22`, border:`1px solid ${G.purple}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{t.ico}</div>
              <div>
                <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:3 }}>{t.title}</div>
                <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.3, lineHeight:1.5 }}>{t.body}</div>
              </div>
            </div>
          ))}
          <button onClick={onConfirm} style={{ width:"100%", marginTop:8, background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, border:"none", borderRadius:10, padding:"14px", color:"#fff", fontFamily:FONT.display, fontSize:14, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", boxShadow:`0 4px 20px ${G.purple}55` }}>
            START DELOAD WEEK ◆
          </button>
          <button onClick={onClose} style={{ width:"100%", marginTop:10, marginBottom:8, background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>
            NOT YET
          </button>
        </div>
      </div>
    </div>
  );
}

function TrainScreen({ showToast, onSave, onDelete, onEdit, quickStart, onClearQuickStart, sessions = [], onShareSession, unit = "lbs", onShareTemplate }) {
  const [subTab, setSubTab] = useState("track");
  const [sessName, setSessName] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_wip_session") || "{}").name || ""; } catch { return ""; }
  });
  const [sessTag, setSessTag] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_wip_session") || "{}").tag || null; } catch { return null; }
  });
  const [sessNotes, setSessNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_wip_session") || "{}").notes || ""; } catch { return ""; }
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
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [progFilter, setProgFilter] = useState("ALL");
  const [autoRest, setAutoRest] = useState(() => localStorage.getItem("sfc_auto_rest") === "1");
  const [tmCalcOpen, setTmCalcOpen] = useState(false);
  const [trainDemoEx, setTrainDemoEx] = useState(null);
  const [deloadOpen, setDeloadOpen] = useState(false);
  const [deloadDismissed, setDeloadDismissed] = useState(() => {
    try {
      const d = localStorage.getItem("sfc_last_deload");
      if (!d) return false;
      return (Date.now() - new Date(d).getTime()) < 28 * 24 * 60 * 60 * 1000;
    } catch { return false; }
  });

  const deloadNeeded = (() => {
    if (deloadDismissed) return false;
    const getWeekMonday = d => {
      const day = new Date(d); const dow = day.getDay();
      day.setDate(day.getDate() - (dow === 0 ? 6 : dow - 1));
      return day.toISOString().slice(0, 10);
    };
    const today = new Date();
    const weeksWithSessions = new Set(sessions.map(s => getWeekMonday(s.createdAt || s.date)));
    let consecutive = 0;
    for (let i = 1; i <= 5; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i * 7);
      if (weeksWithSessions.has(getWeekMonday(d))) consecutive++;
      else break;
    }
    return consecutive >= 4;
  })();

  const nextIdRef = useRef(2);

  useEffect(() => {
    localStorage.setItem("sfc_wip_session", JSON.stringify({ name: sessName, exs, tag: sessTag, notes: sessNotes }));
  }, [sessName, exs, sessTag, sessNotes]);

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
  const totVol = exs.reduce((a,e) => {
    if (CARDIO_SET_CONFIG[e.name]) return a;
    return a + e.sets.filter(s=>s.type!=="warmup").reduce((b,s) => b+(parseFloat(s.w)||0)*(parseInt(s.r)||0),0);
  },0);
  const totCardioMin = exs.reduce((a,e) => {
    const conf = CARDIO_SET_CONFIG[e.name];
    if (!conf || conf.a.unit !== "MIN") return a;
    return a + e.sets.filter(s=>s.type!=="warmup").reduce((b,s) => b+(parseFloat(s.r)||0),0);
  },0);
  const totKcal = calcSessionCalories(exs, getLoggedBodyWeight());
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

  const repeatSession = (s) => {
    const srcExs = (s.exs || []).filter(e => e.name?.trim());
    if (!srcExs.length) { showToast("No exercises to repeat"); return; }
    setSessName(s.name || "");
    setSessTag(s.tag || null);
    let nextId = 1;
    setExs(srcExs.map(ex => {
      // Keep last session's weights as starting suggestion (already progressed +5)
      const sets = (ex.sets || []).filter(st => st.type !== "warmup").map(st => ({
        r: String(st.r || ""),
        w: String(progressWeight(parseFloat(st.w) || 0) || st.w || ""),
        type: "working",
      }));
      return { id: nextId++, name: ex.name, sets: sets.length ? sets : [{ r:"", w:"", type:"working" }], rest: ex.rest || 60, q: ex.name, sugg: false };
    }));
    nextIdRef.current = srcExs.length + 1;
    setSubTab("track");
    showToast(`🔄 ${s.name} loaded — weights set +5 lbs!`);
  };

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
    } else if (BODYWEIGHT_EXERCISES.has(name)) {
      const bw = getLoggedBodyWeight();
      const defaultSets = [{ r: "", w: bw ? String(bw) : "", type: "working" }];
      setExs(p => p.map(e => e.id !== exId ? e : { ...e, name, q: name, sugg: false, sets: defaultSets }));
      if (bw) showToast(`⚖️ Body weight (${bw} lbs) auto-filled`);
      else showToast("💡 Log your weight in STATS → body check-in to auto-fill");
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

  const doSave = async () => {
    const valid = exs.filter(e => e.name && e.sets.some(s=>s.r||s.w));
    if (!valid.length) { showToast("Add at least one exercise."); return; }
    setSaving(true);
    const ok = await onSave({ name:sessName||"CUSTOM SESSION", exs:valid, sets:totSets, vol:totVol, pts, tag: sessTag, notes: sessNotes, date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}) });
    setSaving(false);
    if (ok !== false) {
      setExs([{id:1,name:"",sets:[{r:"",w:"",type:"working"}],rest:60,q:"",sugg:false}]);
      setSessName(""); setSessTag(null); setSessNotes("");
      localStorage.removeItem("sfc_wip_session");
      setSubTab("log");
    }
  };

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"9px 11px", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", width:"100%", fontFamily:FONT.body, letterSpacing:1, textTransform:"uppercase" };
  const SUB_TABS = [{ id:"track", l:"TRACK" }, { id:"log", l:"HISTORY" }, { id:"prs", l:"PRs" }, { id:"programs", l:"PROGRAMS" }];

  return (
    <div style={{ padding:"calc(env(safe-area-inset-top, 0px) + 20px) 18px 0" }}>
      {tmCalcOpen && <TrainingMaxModal onClose={()=>setTmCalcOpen(false)}/>}
      {trainDemoEx && <ExerciseDemoModal name={trainDemoEx} onClose={()=>setTrainDemoEx(null)}/>}
      {deloadOpen && <DeloadModal onClose={()=>setDeloadOpen(false)} onConfirm={() => { setDeloadOpen(false); setDeloadDismissed(true); try { localStorage.setItem("sfc_last_deload", new Date().toISOString()); } catch {} showToast("🔄 Deload week started — train light this week!"); }}/>}
      {pickerFor && <ExercisePicker onSelect={name=>{ selectExercise(pickerFor, name); }} onClose={()=>setPickerFor(null)}/>}
      {restSec && <RestTimer sec={restSec} onDone={() => { setRestSec(null); showToast("✓ REST COMPLETE"); }}/>}
      {plateCalcOpen && <PlateCalculatorModal initialWeight={plateCalcWeight} onClose={() => setPlateCalcOpen(false)}/>}
      {selectedProgram && <ProgramDetailModal program={selectedProgram} sessions={sessions} onClose={()=>setSelectedProgram(null)} onStartDay={(prog, dayIdx) => {
        const day = prog.days[dayIdx];
        setSessName(`${prog.name} — DAY ${dayIdx+1}`);
        setExs(day.exs.map((ex, i) => ({ id: i+1, name: ex.name, sets:[{r:"",w:"",type:"working"}], rest:60, q:ex.name, sugg:false })));
        setSubTab("track");
        setSelectedProgram(null);
        showToast(`✓ ${day.name} loaded — add your weights!`);
      }} onStartGuided={(name, exs) => {
        setSessName(name);
        setExs(exs);
        setSubTab("track");
        setSelectedProgram(null);
        showToast("✓ Guided workout done — review and save!");
      }}/>}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>
            TRAINING <span style={{ color:G.purple, textShadow:`0 0 12px ${G.purple}` }}>HUB</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:G.purple, boxShadow:`0 0 8px ${G.purple}` }}/>
            <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Track · Log · Progress</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
          <button onClick={()=>setTmCalcOpen(true)} style={{ background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"5px 10px", color:G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>⚡ TM</button>
          <button onClick={() => { setPlateCalcWeight(""); setPlateCalcOpen(true); }} style={{ background:`${G.purple}15`, border:`1px solid ${G.purple}44`, borderRadius:8, padding:"8px 12px", color:G.purple, fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", display:"flex", alignItems:"center", gap:5, textTransform:"uppercase", flexShrink:0, marginBottom:2 }}>
            ⚖️ PLATES
          </button>
        </div>
      </div>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:18, border:`1px solid ${G.borderB}` }}>
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{ flex:1, padding:"9px 4px", borderRadius:5, border:"none", background: subTab===t.id ? `linear-gradient(135deg,${G.purple},${G.purpleBright})` : "transparent", color: subTab===t.id ? "#fff" : G.textMid, fontFamily:FONT.display, fontSize:13, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
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
                  <button key={t.id} onClick={() => setSessTag(active ? null : t.id)} style={{ background: active ? t.color : "rgba(0,0,0,0.35)", border:`1px solid ${active ? t.color : G.borderB}`, borderRadius:20, padding:"5px 12px", color: active ? "#0A0810" : G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", fontWeight: active ? 700 : 400, transition:"all 0.15s", boxShadow: active ? `0 0 8px ${t.color}66` : "none" }}>{t.label}</button>
                );
              })}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, padding:"8px 12px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:`1px solid ${G.borderB}` }}>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>AUTO REST TIMER</div>
            <button onClick={() => { const v = !autoRest; setAutoRest(v); localStorage.setItem("sfc_auto_rest", v ? "1" : "0"); }}
              style={{ background: autoRest ? `linear-gradient(135deg,${G.purple},${G.purpleBright})` : "rgba(255,255,255,0.05)", border:`1px solid ${autoRest ? G.purple : G.borderB}`, borderRadius:12, padding:"4px 12px", color: autoRest ? "#fff" : G.textDim, fontFamily:FONT.body, fontSize:10, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>
              {autoRest ? "ON" : "OFF"}
            </button>
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

          {deloadNeeded && (
            <div style={{ background:"linear-gradient(135deg,rgba(85,37,131,0.18),rgba(85,37,131,0.08))", border:`1px solid ${G.purple}55`, borderRadius:10, padding:"12px 14px", marginBottom:16, display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>🔄</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.purpleLight, marginBottom:3, textTransform:"uppercase" }}>Deload Week Recommended</div>
                <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:0.5, lineHeight:1.4, marginBottom:8 }}>You've trained consistently for 4+ weeks. A planned deload prevents burnout and lets your body supercompensate.</div>
                <button onClick={() => setDeloadOpen(true)} style={{ background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, border:"none", borderRadius:6, padding:"6px 14px", color:"#fff", fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>VIEW DELOAD PLAN ◆</button>
              </div>
              <button onClick={() => { setDeloadDismissed(true); try { localStorage.setItem("sfc_last_deload", new Date().toISOString()); } catch {} }} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:16, padding:"0 2px", flexShrink:0, lineHeight:1 }}>✕</button>
            </div>
          )}

          {totSets > 0 && (
            <ChromeCard gold style={{ padding:"11px 14px", marginBottom:16, display:"flex" }}>
              {[
                {l:"SETS",v:String(totSets)},
                {l:"VOLUME",v:`${totVol.toLocaleString()} ${unit.toUpperCase()}`},
                {l:"PTS",v:`+${pts}`},
                ...(totKcal > 0 ? [{l:"KCAL 🔥",v:`~${totKcal}`}] : []),
              ].map((s,i,arr) => (
                <div key={s.l} style={{ flex:1, textAlign:"center", borderRight: i<arr.length-1 ? `1px solid ${G.borderB}` : "none" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:totKcal > 0 ? 17 : 20, color:G.gold, letterSpacing:1 }}>{s.v}</div>
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
                    {ex.name && <button onClick={()=>setTrainDemoEx(ex.name)} style={{ background:`${G.gold}15`, border:`1px solid ${G.gold}33`, borderRadius:6, color:G.gold, cursor:"pointer", fontSize:12, padding:"4px 7px", flexShrink:0, lineHeight:1 }} title="Form guide">📹</button>}
                    <button onClick={()=>setPickerFor(ex.id)} style={{ background:`linear-gradient(135deg,${G.purple}33,${G.purple}18)`, border:`1px solid ${G.purple}66`, borderRadius:6, color:G.purple, cursor:"pointer", fontSize:10, fontFamily:FONT.body, letterSpacing:1.5, padding:"4px 9px", flexShrink:0, lineHeight:1, display:"flex", alignItems:"center", gap:4 }}>⊞ BROWSE</button>
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

                {BODYWEIGHT_EXERCISES.has(ex.name) && (() => {
                  const bw = getLoggedBodyWeight();
                  const fillBW = () => {
                    if (!bw) { showToast("💡 Log your weight in STATS → body check-in first"); return; }
                    setExs(p => p.map(e => e.id !== ex.id ? e : { ...e, sets: e.sets.map(s => ({ ...s, w: String(bw) })) }));
                    showToast(`⚖️ All sets filled with ${bw} lbs`);
                  };
                  return (
                    <div style={{ margin:"0 12px 6px", background:"rgba(85,239,196,0.07)", border:"1px solid rgba(85,239,196,0.25)", borderRadius:8, padding:"7px 12px", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:14 }}>⚖️</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:"#55EFC4", textTransform:"uppercase" }}>BODYWEIGHT EXERCISE</div>
                        {bw
                          ? <div style={{ fontFamily:FONT.display, fontSize:12, color:"#55EFC4", letterSpacing:1, marginTop:1 }}>YOUR WEIGHT: {bw} LBS</div>
                          : <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, marginTop:1 }}>Log weight in STATS to auto-fill</div>
                        }
                      </div>
                      {bw && (
                        <button onClick={fillBW} style={{ background:"rgba(85,239,196,0.15)", border:"1px solid rgba(85,239,196,0.4)", borderRadius:6, padding:"5px 10px", color:"#55EFC4", fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", flexShrink:0 }}>USE BW</button>
                      )}
                    </div>
                  );
                })()}

                {(() => {
                  const cardioConf = CARDIO_SET_CONFIG[ex.name];
                  const hA = cardioConf ? `${cardioConf.a.label}${cardioConf.a.unit ? ` (${cardioConf.a.unit})` : ""}` : "REPS";
                  const hB = cardioConf ? `${cardioConf.b.label}${cardioConf.b.unit ? ` (${cardioConf.b.unit})` : ""}` : (BODYWEIGHT_EXERCISES.has(ex.name) ? `WEIGHT (${unit.toUpperCase()}) ⚖️` : `WEIGHT (${unit.toUpperCase()})`);
                  return (
                    <div style={{ display:"grid", gridTemplateColumns:"30px 1fr 1fr auto 30px", gap:6, padding:"6px 12px 3px", alignItems:"center" }}>
                      {["TYPE", hA, hB, "", ""].map((h,i)=>(
                        <div key={i} style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase" }}>{h}</div>
                      ))}
                    </div>
                  );
                })()}

                {ex.sets.map((set,si)=>{
                  const cardioConf = CARDIO_SET_CONFIG[ex.name];
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
                  const inputColor = cardioConf ? G.purpleLight : setType==="warmup" ? "#74B9FF" : setType==="drop" ? "#FF7675" : (set.r||set.w) ? G.gold : G.textDim;
                  return (
                    <div key={si}>
                      <div style={{ display:"grid", gridTemplateColumns:"30px 1fr 1fr auto 30px", gap:6, padding:"3px 12px", alignItems:"center" }}>
                        <button onClick={()=>updSet(ex.id,si,"type",nextType)} title={`Tap to change: ${nextType}`} style={{ width:24, height:24, borderRadius:4, background:badgeCfg.bg, border:`1px solid ${badgeCfg.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT.display, fontSize:11, color:badgeCfg.color, cursor:"pointer", padding:0 }}>{badgeCfg.label}</button>
                        <input type="number" inputMode={cardioConf ? cardioConf.a.mode : "numeric"} placeholder={cardioConf ? "0" : (prevSet ? String(prevSet.r) : "—")} value={set.r} onChange={e=>updSet(ex.id,si,"r",e.target.value)} style={{ ...inp, padding:"8px 8px", fontFamily:FONT.display, fontSize:15, letterSpacing:1, textAlign:"center", color:inputColor }}/>
                        <input type="number" inputMode={cardioConf ? cardioConf.b.mode : "decimal"} placeholder={cardioConf ? "0" : (prevSet ? String(progressWeight(prevSet.w)) : (BODYWEIGHT_EXERCISES.has(ex.name) ? String(getLoggedBodyWeight() || "BW") : "—"))} value={set.w} onChange={e=>updSet(ex.id,si,"w",e.target.value)} style={{ ...inp, padding:"8px 8px", fontFamily:FONT.display, fontSize:15, letterSpacing:1, textAlign:"center", color:inputColor }}/>
                        <button onClick={() => { const rpeVals = [null,6,7,8,9,10]; const cur = set.rpe ?? null; const idx = rpeVals.indexOf(cur); const next = rpeVals[(idx + 1) % rpeVals.length]; updSet(ex.id,si,"rpe",next); }} title="RPE" style={{ background: set.rpe ? `${G.purple}33` : "transparent", border:`1px solid ${set.rpe ? G.purple : G.borderB}`, borderRadius:4, padding:"2px 5px", color: set.rpe ? G.purpleLight : G.textDim, fontFamily:FONT.body, fontSize:9, letterSpacing:1, cursor:"pointer", flexShrink:0, minWidth:38, textAlign:"center" }}>{set.rpe ? `@${set.rpe}` : "RPE"}</button>
                        <button onClick={()=>{if(ex.sets.length>1)setExs(p=>p.map(e=>e.id!==ex.id?e:{...e,sets:e.sets.filter((_,j)=>j!==si)}));}} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:13 }}>✕</button>
                      </div>
                      {!cardioConf && setType==="warmup" && <div style={{ paddingLeft:48, paddingBottom:1, fontFamily:FONT.body, fontSize:9, color:"#74B9FF", letterSpacing:1.5, textTransform:"uppercase" }}>warm-up · not counted in volume</div>}
                      {!cardioConf && setType==="drop" && <div style={{ paddingLeft:48, paddingBottom:1, fontFamily:FONT.body, fontSize:9, color:"#FF7675", letterSpacing:1.5, textTransform:"uppercase" }}>drop set · no rest</div>}
                    </div>
                  );
                })}

                <div style={{ padding:"9px 12px 12px" }}>
                  <button onClick={()=>{ const last=ex.sets[ex.sets.length-1]; setExs(p=>p.map(e=>e.id===ex.id?{...e,sets:[...e.sets,{r:"",w:"",type:"working"}]}:e)); if(autoRest && last.r&&last.w && last.type!=="warmup") setRestSec(ex.rest); }} style={{ background:"transparent", border:`1px dashed ${G.borderB}`, borderRadius:5, padding:"6px", width:"100%", color:G.textMid, fontFamily:FONT.body, fontSize:11, letterSpacing:2, cursor:"pointer", marginBottom:9, textTransform:"uppercase" }}>+ ADD SET</button>
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
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{totSets} sets{totVol > 0 ? ` · ${totVol.toLocaleString()} ${unit}` : ""}{totCardioMin > 0 ? ` · ${totCardioMin} min cardio` : ""}{totKcal > 0 ? ` · ~${totKcal} kcal` : ""}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:FONT.display, fontSize:28, color:G.gold, textShadow:G.goldGlow2, letterSpacing:1 }}>+{pts}</div>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>POINTS</div>
              </div>
            </div>
            <textarea
              value={sessNotes}
              onChange={e => setSessNotes(e.target.value)}
              placeholder="SESSION NOTES (OPTIONAL)..."
              rows={2}
              style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.3)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"9px 11px", color:G.textMid, fontFamily:FONT.body, fontSize:12, letterSpacing:1, resize:"none", outline:"none", marginBottom:10 }}
            />
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
                      <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>
                        {s.date} · {s.sets} sets · {(s.vol||0).toLocaleString()} lbs
                        {(() => { const k = calcSessionCalories(s.exs, getLoggedBodyWeight()); return k > 0 ? ` · 🔥 ~${k} kcal` : ""; })()}
                      </div>
                      {s.notes && <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:0.5, marginTop:4, fontStyle:"italic", lineHeight:1.4 }}>"{s.notes}"</div>}
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:16, color:G.gold, letterSpacing:1 }}>+{s.pts}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>PTS</div>
                    </div>
                    {canAct && (
                      <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
                        <button onClick={()=>repeatSession(s)} style={{ background:`${G.purple}22`, border:`1px solid ${G.purple}66`, borderRadius:5, color:G.purpleLight, cursor:"pointer", fontSize:12, padding:"4px 7px", lineHeight:1 }} title="Repeat this session">🔄</button>
                        <button onClick={()=>{ const lines = [`💪 ${s.name}`, `${s.date} · ${s.sets} sets · ${(s.vol||0).toLocaleString()} lbs`]; if(s.exs?.length) lines.push(s.exs.map(e=>e.name).join(", ")); onShareSession?.(lines.join("\n")); }} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, color:G.textMid, cursor:"pointer", fontSize:12, padding:"4px 7px", lineHeight:1 }} title="Share to Squad">🔗</button>
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
                      {onShareTemplate && <button onClick={()=>onShareTemplate(tmpl)} style={{ background:`${G.purple}22`, border:`1px solid ${G.purple}55`, borderRadius:5, padding:"6px 9px", color:G.purpleLight, fontFamily:FONT.body, fontSize:13, cursor:"pointer" }} title="Share to Squad">📤</button>}
                      <button onClick={()=>deleteTemplate(tmpl.id)} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:5, padding:"6px 8px", color:G.textDim, fontFamily:FONT.body, fontSize:11, cursor:"pointer" }}>✕</button>
                    </div>
                  </div>
                </ChromeCard>
              ))}
            </>
          )}
          <SectionLabel>Training Programs</SectionLabel>
          {/* Category filter chips */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:10, WebkitOverflowScrolling:"touch", marginBottom:6 }}>
            {["ALL","BODYBUILDING","POWERLIFTING","HYPERTROPHY","CALISTHENICS","FUNCTIONAL","ATHLETICS","SPORTS","CORRECTIVE","WEIGHT LOSS"].map(cat => (
              <button key={cat} onClick={()=>setProgFilter(cat)}
                style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:`1px solid ${progFilter===cat ? G.purple : G.borderB}`, background:progFilter===cat ? `linear-gradient(135deg,${G.purple},${G.purpleBright})` : "transparent", color:progFilter===cat ? "#fff" : G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                {cat}
              </button>
            ))}
          </div>
          {PROGRAMS_DATA.filter(p => progFilter==="ALL" || p.type===progFilter).map((p,i) => (
            <ChromeCard key={i} onClick={()=>setSelectedProgram(p)} style={{ padding:"14px", marginBottom:11, cursor:"pointer" }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:10, background:`${p.col}18`, border:`1px solid ${p.col}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{p.ico}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:5 }}>{p.name}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}>
                    <Chip label={p.type} small color={p.col}/><Chip label={p.level} small/><Chip label={`${p.weeks}WK`} small color={G.textMid}/><Chip label={`${p.daysPerWeek}x/WK`} small color={G.textMid}/>
                  </div>
                  <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.5 }}>{p.desc}</div>
                </div>
                <div style={{ color:p.col, fontSize:16, flexShrink:0 }}>›</div>
              </div>
            </ChromeCard>
          ))}
        </div>
      )}
    </div>
  );
}

const PROGRAMS_DATA = [
  {
    id:"golden-era", name:"GOLDEN ERA HYPERTROPHY", type:"BODYBUILDING", level:"INTERMEDIATE",
    weeks:12, daysPerWeek:5, ico:"🏆", col:"#FDB927",
    desc:"Classic high-volume bodybuilding. The Arnold blueprint.",
    goal:"Build maximum muscle size and definition using time-tested techniques from the golden era of bodybuilding.",
    equipment:["Barbell","Dumbbells","Cable Machine","Bench","Pull-Up Bar"],
    schedule:["Chest & Tris","Back & Bis","Shoulders & Abs","Legs","Arms","Rest","Rest"],
    days:[
      { name:"CHEST & TRICEPS", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8–12" },
        { name:"Incline Dumbbell Press", sets:4, reps:"10–12" },
        { name:"Cable Flyes", sets:3, reps:"12–15" },
        { name:"Skull Crushers", sets:3, reps:"10–12" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
      ]},
      { name:"BACK & BICEPS", tag:"pull", exs:[
        { name:"Pull-Ups", sets:4, reps:"6–10" },
        { name:"Barbell Row", sets:4, reps:"8–10" },
        { name:"Lat Pulldown", sets:3, reps:"10–12" },
        { name:"Barbell Curl", sets:3, reps:"10–12" },
        { name:"Hammer Curl", sets:3, reps:"12" },
      ]},
      { name:"SHOULDERS & ABS", tag:"push", exs:[
        { name:"Barbell Overhead Press", sets:4, reps:"8–10" },
        { name:"Arnold Press", sets:3, reps:"10–12" },
        { name:"Lateral Raises", sets:4, reps:"12–15" },
        { name:"Rear Delt Flyes", sets:3, reps:"12–15" },
        { name:"Ab Wheel", sets:3, reps:"10–15" },
      ]},
      { name:"LEGS", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"8–10" },
        { name:"Romanian Deadlift", sets:4, reps:"10–12" },
        { name:"Leg Press", sets:4, reps:"12–15" },
        { name:"Leg Curl", sets:3, reps:"12–15" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
      { name:"ARMS", tag:"pull", exs:[
        { name:"Barbell Curl", sets:4, reps:"10–12" },
        { name:"Preacher Curl", sets:3, reps:"10–12" },
        { name:"Hammer Curl", sets:3, reps:"12" },
        { name:"Skull Crushers", sets:4, reps:"10–12" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
      ]},
    ],
  },
  {
    id:"raw-strength", name:"RAW STRENGTH FOUNDATION", type:"POWERLIFTING", level:"BEGINNER",
    weeks:8, daysPerWeek:3, ico:"🏋️", col:"#A29BFE",
    desc:"Linear progression for squat, bench, and deadlift.",
    goal:"Build a foundation of raw strength through proven linear progression on the three competition lifts.",
    equipment:["Barbell","Power Rack","Bench"],
    schedule:["Squat Focus","Rest","Bench Focus","Rest","Deadlift Focus","Rest","Rest"],
    days:[
      { name:"SQUAT FOCUS", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"5" },
        { name:"Barbell Bench Press", sets:3, reps:"5" },
        { name:"Barbell Row", sets:3, reps:"5" },
        { name:"Romanian Deadlift", sets:3, reps:"8" },
      ]},
      { name:"BENCH FOCUS", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:5, reps:"5" },
        { name:"Barbell Overhead Press", sets:3, reps:"5" },
        { name:"Barbell Squat", sets:3, reps:"5" },
        { name:"Lat Pulldown", sets:3, reps:"8" },
      ]},
      { name:"DEADLIFT FOCUS", tag:"pull", exs:[
        { name:"Barbell Deadlift", sets:1, reps:"5" },
        { name:"Barbell Squat", sets:3, reps:"5" },
        { name:"Barbell Bench Press", sets:3, reps:"5" },
        { name:"Barbell Row", sets:3, reps:"5" },
      ]},
    ],
  },
  {
    id:"explosive-athlete", name:"EXPLOSIVE ATHLETE", type:"ATHLETICS", level:"ADVANCED",
    weeks:10, daysPerWeek:4, ico:"⚡", col:"#00CEC9",
    desc:"Speed, power, and sport conditioning.",
    goal:"Develop elite athleticism — power output, explosive speed, and conditioning that translates to any sport.",
    equipment:["Barbell","Box","Kettlebell","Jump Rope","Assault Bike"],
    schedule:["Power","Upper Strength","Rest","Lower Speed","Conditioning","Rest","Rest"],
    days:[
      { name:"POWER", tag:"full", exs:[
        { name:"Barbell Deadlift", sets:5, reps:"3" },
        { name:"Box Jumps", sets:4, reps:"5" },
        { name:"Barbell Squat", sets:4, reps:"4" },
        { name:"Kettlebell Swing", sets:4, reps:"10" },
      ]},
      { name:"UPPER STRENGTH", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:5, reps:"4" },
        { name:"Barbell Row", sets:4, reps:"4" },
        { name:"Barbell Overhead Press", sets:3, reps:"5" },
        { name:"Pull-Ups", sets:4, reps:"6–8" },
      ]},
      { name:"LOWER SPEED", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"3" },
        { name:"Bulgarian Split Squat", sets:3, reps:"8" },
        { name:"Romanian Deadlift", sets:3, reps:"6" },
        { name:"Box Jumps", sets:5, reps:"5" },
      ]},
      { name:"CONDITIONING", tag:"cardio", exs:[
        { name:"Assault Bike", sets:6, reps:"30s on / 30s off" },
        { name:"Kettlebell Swing", sets:5, reps:"15" },
        { name:"Jump Rope", sets:5, reps:"60s" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
    ],
  },
  {
    id:"fat-loss", name:"FAT LOSS ACCELERATOR", type:"WEIGHT LOSS", level:"BEGINNER",
    weeks:8, daysPerWeek:4, ico:"🔥", col:"#FF7675",
    desc:"Metabolic training to maximize fat burn.",
    goal:"Torch body fat through high-intensity circuit training that keeps your metabolism elevated long after the workout.",
    equipment:["Dumbbells","Kettlebell","Jump Rope"],
    schedule:["Circuit A","Cardio & Core","Circuit B","Rest","Cardio & Core","Rest","Rest"],
    days:[
      { name:"CIRCUIT A — FULL BODY", tag:"full", exs:[
        { name:"Barbell Squat", sets:3, reps:"15" },
        { name:"Barbell Row", sets:3, reps:"12" },
        { name:"Barbell Overhead Press", sets:3, reps:"12" },
        { name:"Romanian Deadlift", sets:3, reps:"15" },
        { name:"Plank", sets:3, reps:"45s" },
      ]},
      { name:"CARDIO & CORE", tag:"cardio", exs:[
        { name:"Jump Rope", sets:4, reps:"90s" },
        { name:"Kettlebell Swing", sets:4, reps:"20" },
        { name:"Ab Wheel", sets:3, reps:"12" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
        { name:"Russian Twists", sets:3, reps:"20" },
      ]},
      { name:"CIRCUIT B — FULL BODY", tag:"full", exs:[
        { name:"Bulgarian Split Squat", sets:3, reps:"12 each" },
        { name:"Incline Dumbbell Press", sets:3, reps:"12" },
        { name:"Lat Pulldown", sets:3, reps:"12" },
        { name:"Kettlebell Swing", sets:3, reps:"20" },
        { name:"Russian Twists", sets:3, reps:"20" },
      ]},
      { name:"CARDIO BLAST", tag:"cardio", exs:[
        { name:"Assault Bike", sets:5, reps:"45s on / 15s off" },
        { name:"Box Jumps", sets:4, reps:"10" },
        { name:"Jump Rope", sets:4, reps:"60s" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
    ],
  },

  // ── ADDITIONAL PROGRAMS ─────────────────────────────────────────
  {
    id:"push-pull-legs", name:"PUSH PULL LEGS (PPL)", type:"HYPERTROPHY", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:6, ico:"💪", col:"#6C5CE7",
    desc:"Train each muscle group twice a week for maximum growth.",
    goal:"Hit every muscle group with double-frequency volume using the most proven hypertrophy split. Six training days, full recovery built in.",
    equipment:["Barbell","Dumbbells","Cable Machine","Pull-Up Bar","Bench"],
    schedule:["Push","Pull","Legs","Push","Pull","Legs","Rest"],
    days:[
      { name:"PUSH DAY", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8–12" },
        { name:"Incline Dumbbell Press", sets:4, reps:"10–12" },
        { name:"Cable Flyes", sets:3, reps:"12–15" },
        { name:"Barbell Overhead Press", sets:3, reps:"8–10" },
        { name:"Lateral Raises", sets:3, reps:"15–20" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
      ]},
      { name:"PULL DAY", tag:"pull", exs:[
        { name:"Barbell Deadlift", sets:3, reps:"5" },
        { name:"Pull-Ups", sets:4, reps:"6–10" },
        { name:"Barbell Row", sets:4, reps:"8–10" },
        { name:"Lat Pulldown", sets:3, reps:"10–12" },
        { name:"Barbell Curl", sets:3, reps:"12" },
        { name:"Hammer Curl", sets:3, reps:"12" },
      ]},
      { name:"LEG DAY", tag:"legs", exs:[
        { name:"Barbell Squat", sets:4, reps:"8–12" },
        { name:"Romanian Deadlift", sets:3, reps:"10–12" },
        { name:"Leg Press", sets:3, reps:"12–15" },
        { name:"Leg Curl", sets:3, reps:"12–15" },
        { name:"Calf Raise", sets:4, reps:"20" },
        { name:"Ab Wheel", sets:3, reps:"12" },
      ]},
    ],
  },
  {
    id:"kettlebell-warrior", name:"KETTLEBELL WARRIOR", type:"FUNCTIONAL", level:"BEGINNER",
    weeks:8, daysPerWeek:3, ico:"🔔", col:"#FDCB6E",
    desc:"Total-body strength and conditioning with just a kettlebell.",
    goal:"Build functional strength, explosive power, and full-body conditioning using the most versatile training tool on earth — a single kettlebell.",
    equipment:["Kettlebell"],
    schedule:["Strength", "Rest", "Power", "Rest", "Conditioning", "Rest", "Rest"],
    days:[
      { name:"STRENGTH", tag:"full", exs:[
        { name:"Kettlebell Swing", sets:5, reps:"20" },
        { name:"Kettlebell Goblet Squat", sets:4, reps:"12" },
        { name:"Kettlebell Press", sets:4, reps:"8 each" },
        { name:"Kettlebell Row", sets:4, reps:"10 each" },
        { name:"Kettlebell Turkish Get-Up", sets:3, reps:"3 each" },
      ]},
      { name:"POWER", tag:"full", exs:[
        { name:"Kettlebell Clean and Press", sets:4, reps:"5 each" },
        { name:"Kettlebell Snatch", sets:4, reps:"8 each" },
        { name:"Kettlebell Front Squat", sets:4, reps:"10" },
        { name:"Kettlebell Swing", sets:4, reps:"15" },
        { name:"Kettlebell Windmill", sets:3, reps:"5 each" },
      ]},
      { name:"CONDITIONING", tag:"full", exs:[
        { name:"Kettlebell Swing", sets:6, reps:"15" },
        { name:"Kettlebell Clean", sets:4, reps:"8 each" },
        { name:"Kettlebell Lunge", sets:3, reps:"10 each" },
        { name:"Kettlebell Halo", sets:3, reps:"8 each way" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
    ],
  },
  {
    id:"calisthenics-mastery", name:"CALISTHENICS MASTERY", type:"CALISTHENICS", level:"BEGINNER",
    weeks:10, daysPerWeek:4, ico:"🤸", col:"#00B894",
    desc:"Master bodyweight movement. Zero equipment required.",
    goal:"Build real-world strength, body control, and endurance using only your bodyweight — anywhere, anytime, no gym needed.",
    equipment:["Pull-Up Bar (optional)","None"],
    schedule:["Upper Push", "Lower Body", "Upper Pull", "Full Body", "Rest", "Rest", "Rest"],
    days:[
      { name:"UPPER PUSH", tag:"push", exs:[
        { name:"Push-Ups", sets:4, reps:"15–20" },
        { name:"Chest Dip", sets:4, reps:"8–12" },
        { name:"Dips", sets:3, reps:"10–15" },
        { name:"Plank", sets:3, reps:"60s" },
        { name:"Mountain Climbers", sets:3, reps:"30s" },
      ]},
      { name:"LOWER BODY", tag:"legs", exs:[
        { name:"Walking Lunges", sets:4, reps:"20 steps" },
        { name:"Bulgarian Split Squat", sets:3, reps:"10 each" },
        { name:"Glute Bridge", sets:4, reps:"20" },
        { name:"Step-Ups", sets:3, reps:"12 each" },
        { name:"Calf Raise", sets:4, reps:"25" },
      ]},
      { name:"UPPER PULL", tag:"pull", exs:[
        { name:"Pull-Ups", sets:4, reps:"6–10" },
        { name:"Chin-Ups", sets:3, reps:"8" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
        { name:"Dead Bug", sets:3, reps:"10 each" },
        { name:"Bicycle Crunches", sets:3, reps:"20" },
      ]},
      { name:"FULL BODY POWER", tag:"full", exs:[
        { name:"Burpees", sets:4, reps:"10" },
        { name:"Jump Squats", sets:4, reps:"15" },
        { name:"Push-Ups", sets:3, reps:"15" },
        { name:"Pull-Ups", sets:3, reps:"8" },
        { name:"Bear Crawl", sets:3, reps:"20m" },
      ]},
    ],
  },

  // ── CORRECTIVE PROGRAMS ─────────────────────────────────────────
  {
    id:"posture-reset", name:"POSTURE RESET", type:"CORRECTIVE", level:"BEGINNER",
    weeks:6, daysPerWeek:3, ico:"🧘", col:"#55EFC4",
    desc:"Fix desk posture, rounded shoulders, and tight hips.",
    goal:"Rebalance chronic postural imbalances — forward head, rounded shoulders, anterior pelvic tilt — through targeted corrective movements and activation drills.",
    equipment:["Cable Machine","Dumbbells","Resistance Band (optional)"],
    schedule:["Upper Posture", "Hip & Spine", "Full Reset", "Rest", "Upper Posture", "Hip & Spine", "Rest"],
    days:[
      { name:"UPPER POSTURE", tag:"pull", exs:[
        { name:"Cable Face Pulls", sets:4, reps:"20–25" },
        { name:"Rear Delt Flyes", sets:4, reps:"20" },
        { name:"Dead Bug", sets:3, reps:"10 each" },
        { name:"Lateral Raises", sets:3, reps:"15" },
        { name:"Pallof Press", sets:3, reps:"15 each" },
        { name:"Plank", sets:4, reps:"45s" },
      ]},
      { name:"HIP & SPINE", tag:"legs", exs:[
        { name:"Glute Bridge", sets:4, reps:"20" },
        { name:"Hip Thrust", sets:4, reps:"15" },
        { name:"Cable Pull-Through", sets:4, reps:"15" },
        { name:"Hyperextensions", sets:3, reps:"15" },
        { name:"Cable Hip Abduction", sets:3, reps:"15 each" },
        { name:"Side Plank", sets:3, reps:"30s each" },
      ]},
      { name:"FULL RESET", tag:"full", exs:[
        { name:"Cable Face Pulls", sets:3, reps:"20" },
        { name:"Dead Bug", sets:3, reps:"10 each" },
        { name:"Glute Bridge", sets:3, reps:"20" },
        { name:"Hip Thrust", sets:3, reps:"15" },
        { name:"Pallof Press", sets:3, reps:"12 each" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
    ],
  },
  {
    id:"shoulder-prehab", name:"SHOULDER HEALTH & PREHAB", type:"CORRECTIVE", level:"BEGINNER",
    weeks:6, daysPerWeek:3, ico:"🩺", col:"#81ECEC",
    desc:"Rebuild shoulder stability and prevent injury. Great for all lifters.",
    goal:"Restore shoulder stability, fix rotator cuff imbalances, and build the foundational strength to press and pull pain-free for life.",
    equipment:["Dumbbells","Cable Machine"],
    schedule:["Stability Focus", "Strength Building", "Recovery Circuit", "Rest", "Stability Focus", "Strength Building", "Rest"],
    days:[
      { name:"STABILITY FOCUS", tag:"push", exs:[
        { name:"Cable Face Pulls", sets:4, reps:"25" },
        { name:"Rear Delt Flyes", sets:4, reps:"20" },
        { name:"Machine Rear Delt Flyes", sets:3, reps:"20" },
        { name:"Lateral Raises", sets:3, reps:"15" },
        { name:"Dead Bug", sets:3, reps:"12 each" },
        { name:"Side Plank", sets:3, reps:"30s each" },
      ]},
      { name:"STRENGTH BUILDING", tag:"push", exs:[
        { name:"Seated Dumbbell Press", sets:4, reps:"10" },
        { name:"Arnold Press", sets:3, reps:"12" },
        { name:"Cable Lateral Raises", sets:3, reps:"15" },
        { name:"Rear Delt Flyes", sets:3, reps:"15" },
        { name:"Dumbbell Row", sets:3, reps:"12" },
        { name:"Plank", sets:3, reps:"45s" },
      ]},
      { name:"RECOVERY CIRCUIT", tag:"full", exs:[
        { name:"Cable Face Pulls", sets:3, reps:"20" },
        { name:"Machine Rear Delt Flyes", sets:3, reps:"20" },
        { name:"Lateral Raises", sets:3, reps:"15" },
        { name:"Dead Bug", sets:3, reps:"10 each" },
        { name:"Pallof Press", sets:3, reps:"12 each" },
        { name:"Flutter Kicks", sets:3, reps:"20s" },
      ]},
    ],
  },

  // ── SPORTS PROGRAMS ─────────────────────────────────────────────
  {
    id:"basketball-performance", name:"BASKETBALL PERFORMANCE", type:"SPORTS", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:4, ico:"🏀", col:"#E17055",
    desc:"Dominate the court — vertical, first-step speed, and endurance.",
    goal:"Build the explosive vertical leap, lateral quickness, and relentless conditioning every basketball player needs to dominate on the court.",
    equipment:["Barbell","Dumbbells","Box","Jump Rope","Assault Bike"],
    schedule:["Lower Power", "Upper Strength", "Rest", "Speed & Agility", "Conditioning", "Rest", "Rest"],
    days:[
      { name:"LOWER POWER", tag:"legs", exs:[
        { name:"Barbell Squat", sets:4, reps:"5" },
        { name:"Box Jumps", sets:5, reps:"5" },
        { name:"Bulgarian Split Squat", sets:3, reps:"8 each" },
        { name:"Romanian Deadlift", sets:3, reps:"8" },
        { name:"Jump Squats", sets:4, reps:"12" },
        { name:"Calf Raise", sets:4, reps:"20" },
      ]},
      { name:"UPPER STRENGTH", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8" },
        { name:"Barbell Row", sets:4, reps:"8" },
        { name:"Barbell Overhead Press", sets:3, reps:"8" },
        { name:"Pull-Ups", sets:4, reps:"8" },
        { name:"Cable Face Pulls", sets:3, reps:"20" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
      { name:"SPEED & AGILITY", tag:"cardio", exs:[
        { name:"Jump Rope", sets:5, reps:"60s" },
        { name:"Box Jumps", sets:5, reps:"5" },
        { name:"Jump Squats", sets:4, reps:"15" },
        { name:"High Knees", sets:4, reps:"30s" },
        { name:"Bear Crawl", sets:4, reps:"20m" },
        { name:"Mountain Climbers", sets:4, reps:"30s" },
      ]},
      { name:"CONDITIONING", tag:"cardio", exs:[
        { name:"Assault Bike", sets:6, reps:"30s on / 30s off" },
        { name:"Battle Ropes", sets:5, reps:"30s" },
        { name:"Jump Rope", sets:5, reps:"60s" },
        { name:"Burpees", sets:4, reps:"12" },
        { name:"Russian Twists", sets:3, reps:"20" },
      ]},
    ],
  },
  {
    id:"football-power", name:"FOOTBALL POWER PROGRAM", type:"SPORTS", level:"ADVANCED",
    weeks:12, daysPerWeek:4, ico:"🏈", col:"#D63031",
    desc:"Size, strength, and explosive power for the field.",
    goal:"Develop the raw strength, power output, and physicality that separates great football players — mass, explosiveness, and relentless conditioning.",
    equipment:["Barbell","Power Rack","Box","Sled","Battle Ropes"],
    schedule:["Lower Power", "Upper Power", "Rest", "Dynamic Effort", "Conditioning", "Rest", "Rest"],
    days:[
      { name:"LOWER POWER", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"5" },
        { name:"Barbell Deadlift", sets:4, reps:"3" },
        { name:"Romanian Deadlift", sets:4, reps:"6" },
        { name:"Hip Thrust", sets:4, reps:"10" },
        { name:"Box Jumps", sets:4, reps:"5" },
        { name:"Calf Raise", sets:4, reps:"15" },
      ]},
      { name:"UPPER POWER", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:5, reps:"5" },
        { name:"Barbell Row", sets:5, reps:"5" },
        { name:"Push Press", sets:4, reps:"5" },
        { name:"Pull-Ups", sets:4, reps:"6" },
        { name:"Barbell Overhead Press", sets:3, reps:"8" },
        { name:"Dips", sets:3, reps:"10" },
      ]},
      { name:"DYNAMIC EFFORT", tag:"full", exs:[
        { name:"Box Jumps", sets:5, reps:"5" },
        { name:"Sled Push", sets:6, reps:"20m" },
        { name:"Kettlebell Swing", sets:5, reps:"15" },
        { name:"Jump Squats", sets:4, reps:"10" },
        { name:"Battle Ropes", sets:4, reps:"30s" },
        { name:"Farmer's Walk", sets:4, reps:"30m" },
      ]},
      { name:"CONDITIONING", tag:"cardio", exs:[
        { name:"Assault Bike", sets:5, reps:"60s on / 60s off" },
        { name:"Sled Push", sets:5, reps:"30m" },
        { name:"Battle Ropes", sets:4, reps:"45s" },
        { name:"Burpees", sets:3, reps:"15" },
        { name:"Rowing Machine", sets:3, reps:"500m" },
      ]},
    ],
  },
  {
    id:"combat-sports", name:"COMBAT SPORTS CONDITIONING", type:"SPORTS", level:"ADVANCED",
    weeks:10, daysPerWeek:5, ico:"🥊", col:"#B2BEC3",
    desc:"Build a fighter's body — power, endurance, and mental toughness.",
    goal:"Forge the conditioning, explosive power, and full-body strength demanded by MMA, boxing, wrestling, and all combat sports.",
    equipment:["Barbell","Dumbbells","Kettlebell","Battle Ropes","Jump Rope","Rowing Machine"],
    schedule:["Strength", "Conditioning", "Strength", "Cardio", "Full Circuit", "Rest", "Rest"],
    days:[
      { name:"STRENGTH", tag:"full", exs:[
        { name:"Barbell Deadlift", sets:4, reps:"5" },
        { name:"Barbell Bench Press", sets:4, reps:"6" },
        { name:"Barbell Row", sets:4, reps:"6" },
        { name:"Barbell Overhead Press", sets:3, reps:"8" },
        { name:"Pull-Ups", sets:4, reps:"8" },
        { name:"Farmer's Walk", sets:3, reps:"30m" },
      ]},
      { name:"CONDITIONING", tag:"cardio", exs:[
        { name:"Assault Bike", sets:8, reps:"30s on / 30s off" },
        { name:"Battle Ropes", sets:6, reps:"30s" },
        { name:"Burpees", sets:5, reps:"15" },
        { name:"Jump Rope", sets:5, reps:"90s" },
        { name:"Mountain Climbers", sets:4, reps:"45s" },
      ]},
      { name:"CARDIO BASE", tag:"cardio", exs:[
        { name:"Rowing Machine", sets:5, reps:"2 min" },
        { name:"Jump Rope", sets:6, reps:"90s" },
        { name:"High Knees", sets:5, reps:"30s" },
        { name:"Stair Climber", sets:4, reps:"3 min" },
        { name:"Bear Crawl", sets:4, reps:"30m" },
      ]},
      { name:"FULL CIRCUIT", tag:"full", exs:[
        { name:"Kettlebell Swing", sets:4, reps:"20" },
        { name:"Box Jumps", sets:4, reps:"8" },
        { name:"Barbell Deadlift", sets:3, reps:"5" },
        { name:"Battle Ropes", sets:4, reps:"30s" },
        { name:"Burpees", sets:4, reps:"12" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
    ],
  },
  {
    id:"soccer-performance", name:"SOCCER PERFORMANCE", type:"SPORTS", level:"INTERMEDIATE",
    weeks:8, daysPerWeek:4, ico:"⚽", col:"#74B9FF",
    desc:"Endurance, sprint speed, and lower-body power for the pitch.",
    goal:"Develop the aerobic base, explosive sprint speed, and leg strength that separates good soccer players from great ones.",
    equipment:["Barbell","Dumbbells","Jump Rope","Treadmill","Assault Bike"],
    schedule:["Lower Strength", "Conditioning", "Rest", "Upper Strength", "Speed & Power", "Rest", "Rest"],
    days:[
      { name:"LOWER STRENGTH", tag:"legs", exs:[
        { name:"Barbell Squat", sets:4, reps:"8" },
        { name:"Romanian Deadlift", sets:3, reps:"10" },
        { name:"Bulgarian Split Squat", sets:3, reps:"10 each" },
        { name:"Hip Thrust", sets:3, reps:"15" },
        { name:"Nordic Hamstring Curl", sets:3, reps:"8" },
        { name:"Calf Raise", sets:4, reps:"20" },
      ]},
      { name:"CONDITIONING", tag:"cardio", exs:[
        { name:"Treadmill Run", sets:3, reps:"10 min" },
        { name:"Jump Rope", sets:4, reps:"2 min" },
        { name:"High Knees", sets:4, reps:"45s" },
        { name:"Assault Bike", sets:4, reps:"60s" },
        { name:"Step-Ups", sets:3, reps:"12 each" },
      ]},
      { name:"UPPER STRENGTH", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:3, reps:"10" },
        { name:"Barbell Row", sets:3, reps:"10" },
        { name:"Barbell Overhead Press", sets:3, reps:"10" },
        { name:"Pull-Ups", sets:3, reps:"8" },
        { name:"Cable Face Pulls", sets:3, reps:"15" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"SPEED & POWER", tag:"full", exs:[
        { name:"Box Jumps", sets:5, reps:"5" },
        { name:"Jump Squats", sets:4, reps:"15" },
        { name:"Jump Rope", sets:5, reps:"60s" },
        { name:"Battle Ropes", sets:4, reps:"30s" },
        { name:"Barbell Squat", sets:3, reps:"5" },
        { name:"Walking Lunges", sets:3, reps:"20 steps" },
      ]},
    ],
  },

  // ── SPECIALIZATION PROGRAMS ──────────────────────────────────────
  {
    id:"chest-back-specialization", name:"CHEST & BACK SPECIALIZATION", type:"BODYBUILDING", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:4, ico:"🎯", col:"#0984E3",
    desc:"Paired antagonist training for maximum chest and back thickness.",
    goal:"Build a wide, thick upper body by hammering chest and back with dedicated volume days plus paired antagonist supersets for maximum time under tension.",
    equipment:["Barbell","Dumbbells","Cable Machine","Pull-Up Bar","Bench","T-Bar Row"],
    schedule:["Chest Heavy","Back Heavy","Rest","Chest + Back","Arms","Rest","Rest"],
    days:[
      { name:"CHEST HEAVY", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:5, reps:"5–8" },
        { name:"Incline Barbell Press", sets:4, reps:"8–10" },
        { name:"Incline Dumbbell Press", sets:4, reps:"10–12" },
        { name:"Cable Flyes", sets:3, reps:"12–15" },
        { name:"Pec Deck Machine", sets:3, reps:"15" },
        { name:"Chest Dip", sets:3, reps:"10–12" },
      ]},
      { name:"BACK HEAVY", tag:"pull", exs:[
        { name:"Barbell Deadlift", sets:4, reps:"5" },
        { name:"Pull-Ups", sets:4, reps:"6–10" },
        { name:"Barbell Row", sets:4, reps:"8–10" },
        { name:"T-Bar Row", sets:3, reps:"10–12" },
        { name:"Lat Pulldown", sets:3, reps:"10–12" },
        { name:"Seated Cable Row", sets:3, reps:"12–15" },
      ]},
      { name:"CHEST + BACK VOLUME", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8–10" },
        { name:"Barbell Row", sets:4, reps:"8–10" },
        { name:"Incline Dumbbell Press", sets:3, reps:"12" },
        { name:"Lat Pulldown", sets:3, reps:"12" },
        { name:"Dumbbell Flyes", sets:3, reps:"12–15" },
        { name:"Seated Cable Row", sets:3, reps:"15" },
      ]},
      { name:"ARMS SUPPORT", tag:"pull", exs:[
        { name:"Barbell Curl", sets:4, reps:"10–12" },
        { name:"Hammer Curl", sets:3, reps:"12" },
        { name:"Skull Crushers", sets:4, reps:"10–12" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
        { name:"Dips", sets:3, reps:"12" },
        { name:"Cable Face Pulls", sets:3, reps:"20" },
      ]},
    ],
  },
  {
    id:"hamstring-dominance", name:"HAMSTRING DOMINANCE", type:"HYPERTROPHY", level:"INTERMEDIATE",
    weeks:8, daysPerWeek:4, ico:"🦵", col:"#E84393",
    desc:"Target the posterior chain — hamstrings, glutes, and lower back.",
    goal:"Build thick, powerful hamstrings and a bulletproof posterior chain through heavy hinge patterns, eccentric-focused curls, and high-volume glute work.",
    equipment:["Barbell","Dumbbells","Cable Machine","Leg Curl Machine"],
    schedule:["Hamstring Heavy","Upper Push","Rest","Posterior Chain","Upper Pull","Rest","Rest"],
    days:[
      { name:"HAMSTRING HEAVY", tag:"legs", exs:[
        { name:"Romanian Deadlift", sets:5, reps:"6–8" },
        { name:"Barbell Deadlift", sets:4, reps:"4–6" },
        { name:"Nordic Hamstring Curl", sets:4, reps:"6–8" },
        { name:"Leg Curl", sets:4, reps:"12–15" },
        { name:"Cable Romanian Deadlift", sets:3, reps:"12" },
        { name:"Glute Bridge", sets:3, reps:"15" },
      ]},
      { name:"UPPER PUSH", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8" },
        { name:"Incline Dumbbell Press", sets:3, reps:"10–12" },
        { name:"Barbell Overhead Press", sets:3, reps:"10" },
        { name:"Lateral Raises", sets:3, reps:"15" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"POSTERIOR CHAIN", tag:"legs", exs:[
        { name:"Trap Bar Deadlift", sets:4, reps:"6" },
        { name:"Dumbbell Romanian Deadlift", sets:4, reps:"12" },
        { name:"Seated Leg Curl", sets:4, reps:"15" },
        { name:"Hip Thrust", sets:4, reps:"12" },
        { name:"Dumbbell Hip Thrust", sets:3, reps:"15" },
        { name:"Hyperextensions", sets:3, reps:"15" },
      ]},
      { name:"UPPER PULL + FINISHER", tag:"pull", exs:[
        { name:"Pull-Ups", sets:4, reps:"6–10" },
        { name:"Barbell Row", sets:4, reps:"8–10" },
        { name:"Lat Pulldown", sets:3, reps:"10–12" },
        { name:"Barbell Curl", sets:3, reps:"12" },
        { name:"Romanian Deadlift", sets:3, reps:"10" },
        { name:"Leg Curl", sets:3, reps:"15" },
      ]},
    ],
  },
  {
    id:"quad-destroyer", name:"QUAD DESTROYER", type:"HYPERTROPHY", level:"INTERMEDIATE",
    weeks:8, daysPerWeek:4, ico:"⚡", col:"#F39C12",
    desc:"Build massive quads with high-frequency, high-volume squat patterns.",
    goal:"Develop thick, powerful quadriceps through relentless squat variations, leg press volume, and isolation work — the blueprint for dominant front-of-leg development.",
    equipment:["Barbell","Dumbbells","Leg Press","Hack Squat Machine","Leg Extension Machine"],
    schedule:["Quad Heavy","Upper Body","Rest","Quad Accessory","Lower Support","Rest","Rest"],
    days:[
      { name:"QUAD HEAVY", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"5–8" },
        { name:"Front Squat", sets:4, reps:"6–8" },
        { name:"Hack Squat", sets:4, reps:"10–12" },
        { name:"Leg Press", sets:4, reps:"12–15" },
        { name:"Leg Extension", sets:3, reps:"15–20" },
        { name:"Walking Lunges", sets:3, reps:"20 steps" },
      ]},
      { name:"UPPER BODY", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8" },
        { name:"Barbell Row", sets:4, reps:"8" },
        { name:"Barbell Overhead Press", sets:3, reps:"10" },
        { name:"Pull-Ups", sets:3, reps:"8" },
        { name:"Barbell Curl", sets:3, reps:"12" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"QUAD ACCESSORY", tag:"legs", exs:[
        { name:"Front Squat", sets:4, reps:"8" },
        { name:"Bulgarian Split Squat", sets:4, reps:"10 each" },
        { name:"Single Leg Press", sets:3, reps:"12 each" },
        { name:"Leg Extension", sets:4, reps:"15–20" },
        { name:"Step-Ups", sets:3, reps:"12 each" },
        { name:"Jump Squats", sets:3, reps:"15" },
      ]},
      { name:"LOWER SUPPORT", tag:"legs", exs:[
        { name:"Romanian Deadlift", sets:3, reps:"10" },
        { name:"Leg Curl", sets:3, reps:"15" },
        { name:"Hip Thrust", sets:3, reps:"15" },
        { name:"Reverse Lunges", sets:3, reps:"12 each" },
        { name:"Calf Raise", sets:4, reps:"20" },
        { name:"Goblet Squat", sets:3, reps:"15" },
      ]},
    ],
  },
  {
    id:"shoulder-arms-blueprint", name:"SHOULDER & ARMS BLUEPRINT", type:"BODYBUILDING", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:4, ico:"💫", col:"#FD79A8",
    desc:"Dedicated shoulder, bicep, and tricep volume for serious size.",
    goal:"Build boulder shoulders, peaked biceps, and horseshoe triceps through targeted high-volume training — the aesthetic physique trifecta.",
    equipment:["Barbell","Dumbbells","Cable Machine","EZ Bar","Bench"],
    schedule:["Shoulders","Biceps & Triceps","Rest","Shoulders + Arms","Arms Accessory","Rest","Rest"],
    days:[
      { name:"SHOULDERS", tag:"push", exs:[
        { name:"Barbell Overhead Press", sets:4, reps:"8–10" },
        { name:"Seated Dumbbell Press", sets:4, reps:"10–12" },
        { name:"Arnold Press", sets:3, reps:"12" },
        { name:"Lateral Raises", sets:4, reps:"15–20" },
        { name:"Rear Delt Flyes", sets:3, reps:"15–20" },
        { name:"Cable Face Pulls", sets:3, reps:"20–25" },
      ]},
      { name:"BICEPS & TRICEPS", tag:"pull", exs:[
        { name:"Barbell Curl", sets:4, reps:"10–12" },
        { name:"Preacher Curl", sets:3, reps:"12" },
        { name:"Incline Dumbbell Curl", sets:3, reps:"12" },
        { name:"Hammer Curl", sets:3, reps:"15" },
        { name:"Skull Crushers", sets:4, reps:"10–12" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
        { name:"Dips", sets:3, reps:"12" },
        { name:"Cable Overhead Tricep Extension", sets:3, reps:"15" },
      ]},
      { name:"SHOULDERS + ARMS VOLUME", tag:"push", exs:[
        { name:"Seated Dumbbell Press", sets:3, reps:"12" },
        { name:"Lateral Raises", sets:4, reps:"15–20" },
        { name:"Front Raises", sets:3, reps:"12" },
        { name:"EZ Bar Curl", sets:3, reps:"12" },
        { name:"Cable Curl", sets:3, reps:"15" },
        { name:"Rope Pushdown", sets:3, reps:"15" },
        { name:"Tricep Overhead Extension", sets:3, reps:"15" },
      ]},
      { name:"ARMS ACCESSORY", tag:"pull", exs:[
        { name:"Concentration Curl", sets:3, reps:"15 each" },
        { name:"Zottman Curl", sets:3, reps:"12" },
        { name:"EZ Bar Curl", sets:3, reps:"12" },
        { name:"Close-Grip Bench Press", sets:4, reps:"10" },
        { name:"Dumbbell Skull Crushers", sets:3, reps:"12" },
        { name:"Tricep Kickback", sets:3, reps:"15 each" },
      ]},
    ],
  },

  // ── POWERLIFTING INTERMEDIATE & ADVANCED ─────────────────────────
  {
    id:"upper-lower-power", name:"UPPER LOWER POWER SPLIT", type:"POWERLIFTING", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:4, ico:"⚖️", col:"#A29BFE",
    desc:"4-day upper/lower strength and hypertrophy blend.",
    goal:"Build real strength on the main lifts while adding muscle through a proven upper/lower frequency split — the perfect bridge between beginner linear progress and advanced programming.",
    equipment:["Barbell","Dumbbells","Power Rack","Cable Machine","Bench"],
    schedule:["Upper Strength","Lower Strength","Rest","Upper Hypertrophy","Lower Hypertrophy","Rest","Rest"],
    days:[
      { name:"UPPER STRENGTH", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:5, reps:"5" },
        { name:"Barbell Row", sets:5, reps:"5" },
        { name:"Barbell Overhead Press", sets:3, reps:"5" },
        { name:"Lat Pulldown", sets:3, reps:"8" },
        { name:"Dips", sets:3, reps:"8" },
      ]},
      { name:"LOWER STRENGTH", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"5" },
        { name:"Barbell Deadlift", sets:3, reps:"5" },
        { name:"Romanian Deadlift", sets:3, reps:"8" },
        { name:"Leg Press", sets:3, reps:"10" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"UPPER HYPERTROPHY", tag:"upper", exs:[
        { name:"Incline Barbell Press", sets:4, reps:"10–12" },
        { name:"Barbell Row", sets:4, reps:"10–12" },
        { name:"Lateral Raises", sets:4, reps:"15" },
        { name:"Hammer Curl", sets:3, reps:"12" },
        { name:"Tricep Pushdown", sets:3, reps:"12–15" },
        { name:"Cable Face Pulls", sets:3, reps:"20" },
      ]},
      { name:"LOWER HYPERTROPHY", tag:"legs", exs:[
        { name:"Bulgarian Split Squat", sets:4, reps:"10 each" },
        { name:"Leg Curl", sets:4, reps:"12–15" },
        { name:"Hip Thrust", sets:4, reps:"12" },
        { name:"Leg Extension", sets:3, reps:"15" },
        { name:"Calf Raise", sets:4, reps:"20" },
      ]},
    ],
  },
  {
    id:"power-peaking", name:"ADVANCED POWERLIFTING PEAK", type:"POWERLIFTING", level:"ADVANCED",
    weeks:12, daysPerWeek:5, ico:"🏋️", col:"#6C5CE7",
    desc:"Max effort / dynamic effort periodization for competition prep.",
    goal:"Peak your squat, bench, and deadlift to their absolute maximum through conjugate-inspired max effort and speed work — built for lifters chasing PRs on the platform.",
    equipment:["Barbell","Power Rack","Bench","Specialty Bars (optional)"],
    schedule:["Squat Max Effort","Bench Max Effort","Deadlift Focus","Rest","Squat Accessory","Bench Accessory","Rest"],
    days:[
      { name:"SQUAT MAX EFFORT", tag:"legs", exs:[
        { name:"Barbell Squat", sets:5, reps:"3–5" },
        { name:"Pause Squat", sets:3, reps:"3" },
        { name:"Box Squat", sets:3, reps:"5" },
        { name:"Barbell Good Mornings", sets:3, reps:"8" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"BENCH MAX EFFORT", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:5, reps:"3–5" },
        { name:"Close-Grip Bench Press", sets:3, reps:"5" },
        { name:"Skull Crushers", sets:3, reps:"8" },
        { name:"Lat Pulldown", sets:3, reps:"10" },
        { name:"Cable Face Pulls", sets:3, reps:"20" },
      ]},
      { name:"DEADLIFT FOCUS", tag:"pull", exs:[
        { name:"Barbell Deadlift", sets:5, reps:"3–5" },
        { name:"Deficit Deadlift", sets:3, reps:"3" },
        { name:"Romanian Deadlift", sets:3, reps:"8" },
        { name:"Barbell Row", sets:3, reps:"8" },
        { name:"Hyperextensions", sets:3, reps:"12" },
      ]},
      { name:"SQUAT ACCESSORY", tag:"legs", exs:[
        { name:"Front Squat", sets:4, reps:"5" },
        { name:"Walking Lunges", sets:3, reps:"12" },
        { name:"Leg Press", sets:3, reps:"12" },
        { name:"Leg Curl", sets:3, reps:"12" },
        { name:"Hip Thrust", sets:3, reps:"12" },
      ]},
      { name:"BENCH ACCESSORY", tag:"push", exs:[
        { name:"Incline Barbell Press", sets:4, reps:"8" },
        { name:"Dips", sets:3, reps:"10" },
        { name:"Tricep Pushdown", sets:3, reps:"12" },
        { name:"Pull-Ups", sets:3, reps:"8" },
        { name:"Barbell Curl", sets:3, reps:"12" },
      ]},
    ],
  },

  // ── HYPERTROPHY BEGINNER ─────────────────────────────────────────
  {
    id:"german-volume", name:"GERMAN VOLUME TRAINING", type:"HYPERTROPHY", level:"INTERMEDIATE",
    weeks:6, daysPerWeek:4, ico:"🔟", col:"#E17055",
    desc:"10 sets of 10 reps. The original high-volume shock protocol.",
    goal:"Rapidly pack on muscle mass by flooding your muscles with unprecedented volume — 10 sets of 10 reps on primary movements forces adaptation like nothing else.",
    equipment:["Barbell","Dumbbells","Cable Machine","Pull-Up Bar","Bench"],
    schedule:["Chest & Back","Legs & Abs","Rest","Arms & Shoulders","Full Body Accessory","Rest","Rest"],
    days:[
      { name:"CHEST & BACK", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:10, reps:"10" },
        { name:"Barbell Row", sets:10, reps:"10" },
        { name:"Dips", sets:3, reps:"10–12" },
        { name:"Lat Pulldown", sets:3, reps:"10–12" },
      ]},
      { name:"LEGS & ABS", tag:"legs", exs:[
        { name:"Barbell Squat", sets:10, reps:"10" },
        { name:"Romanian Deadlift", sets:10, reps:"10" },
        { name:"Calf Raise", sets:3, reps:"15" },
        { name:"Ab Wheel", sets:3, reps:"12" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
      { name:"ARMS & SHOULDERS", tag:"push", exs:[
        { name:"Barbell Curl", sets:10, reps:"10" },
        { name:"Skull Crushers", sets:10, reps:"10" },
        { name:"Lateral Raises", sets:3, reps:"15" },
        { name:"Cable Face Pulls", sets:3, reps:"20" },
      ]},
      { name:"FULL BODY ACCESSORY", tag:"full", exs:[
        { name:"Incline Dumbbell Press", sets:4, reps:"10–12" },
        { name:"Pull-Ups", sets:4, reps:"8" },
        { name:"Leg Press", sets:4, reps:"12" },
        { name:"Dumbbell Row", sets:4, reps:"10" },
        { name:"Rear Delt Flyes", sets:3, reps:"15" },
      ]},
    ],
  },
  {
    id:"glute-builder", name:"GLUTE BUILDER PROGRAM", type:"HYPERTROPHY", level:"BEGINNER",
    weeks:8, daysPerWeek:3, ico:"🍑", col:"#E84393",
    desc:"Maximum glute growth through hip hinge and isolation patterns.",
    goal:"Build strong, full glutes through a science-backed combination of heavy hip thrusts, Romanian deadlifts, and targeted isolation — the definitive posterior chain program.",
    equipment:["Barbell","Dumbbells","Cable Machine","Bench"],
    schedule:["Glute Focus","Lower & Core","Glute + Upper","Rest","Rest","Rest","Rest"],
    days:[
      { name:"GLUTE FOCUS", tag:"legs", exs:[
        { name:"Hip Thrust", sets:5, reps:"10" },
        { name:"Romanian Deadlift", sets:4, reps:"10" },
        { name:"Bulgarian Split Squat", sets:3, reps:"10 each" },
        { name:"Cable Glute Kickback", sets:3, reps:"15 each" },
        { name:"Glute Bridge", sets:3, reps:"20" },
        { name:"Calf Raise", sets:3, reps:"20" },
      ]},
      { name:"LOWER & CORE", tag:"legs", exs:[
        { name:"Barbell Squat", sets:4, reps:"10" },
        { name:"Leg Press", sets:3, reps:"12" },
        { name:"Leg Curl", sets:4, reps:"12" },
        { name:"Walking Lunges", sets:3, reps:"12 each" },
        { name:"Plank", sets:3, reps:"60s" },
        { name:"Hanging Leg Raises", sets:3, reps:"12" },
      ]},
      { name:"GLUTE & UPPER", tag:"full", exs:[
        { name:"Dumbbell Hip Thrust", sets:4, reps:"12" },
        { name:"Cable Pull-Through", sets:4, reps:"15" },
        { name:"Step-Ups", sets:3, reps:"12 each" },
        { name:"Barbell Row", sets:3, reps:"10" },
        { name:"Lat Pulldown", sets:3, reps:"10" },
        { name:"Lateral Raises", sets:3, reps:"15" },
      ]},
    ],
  },

  // ── CALISTHENICS INTERMEDIATE ────────────────────────────────────
  {
    id:"bodyweight-mastery", name:"BODYWEIGHT MASTERY", type:"CALISTHENICS", level:"INTERMEDIATE",
    weeks:8, daysPerWeek:4, ico:"🤸", col:"#00CEC9",
    desc:"Advanced push, pull, and leg skills — no gym needed.",
    goal:"Progress to harder bodyweight skills — archer push-ups, weighted pull-up variations, and pistol squats — building elite body control and raw strength from anywhere.",
    equipment:["Pull-Up Bar","Dip Bars (optional)"],
    schedule:["Push Skills","Pull Skills","Legs & Core","Full Body Power","Rest","Rest","Rest"],
    days:[
      { name:"PUSH SKILLS", tag:"push", exs:[
        { name:"Diamond Push-Ups", sets:4, reps:"12" },
        { name:"Wide-Grip Push-Ups", sets:4, reps:"15" },
        { name:"Pike Push-Ups", sets:4, reps:"10" },
        { name:"Dips", sets:4, reps:"10" },
        { name:"Decline Push-Ups", sets:3, reps:"12" },
      ]},
      { name:"PULL SKILLS", tag:"pull", exs:[
        { name:"Pull-Ups", sets:5, reps:"8" },
        { name:"Chin-Ups", sets:4, reps:"8" },
        { name:"Neutral Grip Pull-Ups", sets:3, reps:"8" },
        { name:"Inverted Row", sets:4, reps:"12" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
      { name:"LEGS & CORE", tag:"legs", exs:[
        { name:"Pistol Squat", sets:4, reps:"5 each" },
        { name:"Jump Lunge", sets:4, reps:"10" },
        { name:"Walking Lunges", sets:4, reps:"16" },
        { name:"Glute Bridge", sets:4, reps:"20" },
        { name:"Calf Raise", sets:4, reps:"25" },
        { name:"Ab Wheel", sets:3, reps:"12" },
      ]},
      { name:"FULL BODY POWER", tag:"full", exs:[
        { name:"Burpees", sets:4, reps:"10" },
        { name:"Mountain Climbers", sets:4, reps:"30s" },
        { name:"Push-Ups", sets:3, reps:"20" },
        { name:"Pull-Ups", sets:3, reps:"8" },
        { name:"Bear Crawl", sets:3, reps:"30m" },
      ]},
    ],
  },

  // ── FUNCTIONAL INTERMEDIATE ──────────────────────────────────────
  {
    id:"functional-strength", name:"FUNCTIONAL STRENGTH", type:"FUNCTIONAL", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:4, ico:"⚙️", col:"#FDCB6E",
    desc:"Real-world strength through carries, hinges, and conditioning.",
    goal:"Build the kind of strength that actually matters — deadlifts, carries, presses, and pulls combined with conditioning work that makes you capable in every situation life throws at you.",
    equipment:["Barbell","Dumbbells","Kettlebell","Battle Ropes","Pull-Up Bar"],
    schedule:["Power & Hinge","Push & Horizontal Pull","Vertical Pull & Carry","Conditioning","Rest","Rest","Rest"],
    days:[
      { name:"POWER & HINGE", tag:"full", exs:[
        { name:"Barbell Deadlift", sets:4, reps:"5" },
        { name:"Kettlebell Swing", sets:5, reps:"15" },
        { name:"Box Jumps", sets:4, reps:"8" },
        { name:"Farmer's Walk", sets:4, reps:"30m" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"PUSH & HORIZONTAL PULL", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8" },
        { name:"Push Press", sets:3, reps:"8" },
        { name:"Barbell Row", sets:4, reps:"8" },
        { name:"Landmine Press", sets:3, reps:"10" },
        { name:"Battle Ropes", sets:4, reps:"30s" },
      ]},
      { name:"VERTICAL PULL & CARRY", tag:"pull", exs:[
        { name:"Pull-Ups", sets:5, reps:"6–8" },
        { name:"Lat Pulldown", sets:3, reps:"10" },
        { name:"Kettlebell Clean", sets:4, reps:"8 each" },
        { name:"Suitcase Carry", sets:3, reps:"30m each" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
      { name:"CONDITIONING", tag:"cardio", exs:[
        { name:"Assault Bike", sets:5, reps:"60s" },
        { name:"Kettlebell Thruster", sets:4, reps:"12" },
        { name:"Burpees", sets:4, reps:"10" },
        { name:"Jump Rope", sets:5, reps:"90s" },
        { name:"Mountain Climbers", sets:3, reps:"45s" },
      ]},
    ],
  },

  // ── WEIGHT LOSS INTERMEDIATE ─────────────────────────────────────
  {
    id:"metabolic-shred", name:"METABOLIC SHRED", type:"WEIGHT LOSS", level:"INTERMEDIATE",
    weeks:8, daysPerWeek:5, ico:"💥", col:"#FF7675",
    desc:"High-frequency strength + cardio to maximize fat loss.",
    goal:"Strip body fat fast with a relentless 5-day program combining strength training and metabolic conditioning — every session leaves your metabolism burning for hours after.",
    equipment:["Barbell","Dumbbells","Kettlebell","Battle Ropes","Jump Rope","Assault Bike"],
    schedule:["Upper Burn","Lower Burn","Cardio","Full Circuit","HIIT Finisher","Rest","Rest"],
    days:[
      { name:"UPPER BURN", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"12" },
        { name:"Barbell Row", sets:4, reps:"12" },
        { name:"Incline Dumbbell Press", sets:3, reps:"12" },
        { name:"Lat Pulldown", sets:3, reps:"12" },
        { name:"Battle Ropes", sets:4, reps:"30s" },
        { name:"Mountain Climbers", sets:3, reps:"30s" },
      ]},
      { name:"LOWER BURN", tag:"legs", exs:[
        { name:"Barbell Squat", sets:4, reps:"12" },
        { name:"Romanian Deadlift", sets:4, reps:"12" },
        { name:"Bulgarian Split Squat", sets:3, reps:"12 each" },
        { name:"Leg Press", sets:3, reps:"15" },
        { name:"Jump Squats", sets:4, reps:"15" },
        { name:"High Knees", sets:4, reps:"30s" },
      ]},
      { name:"CARDIO BASE", tag:"cardio", exs:[
        { name:"Assault Bike", sets:5, reps:"60s" },
        { name:"Rowing Machine", sets:4, reps:"2 min" },
        { name:"Jump Rope", sets:5, reps:"90s" },
        { name:"Stair Climber", sets:3, reps:"3 min" },
      ]},
      { name:"FULL CIRCUIT", tag:"full", exs:[
        { name:"Kettlebell Swing", sets:5, reps:"20" },
        { name:"Box Jumps", sets:4, reps:"10" },
        { name:"Burpees", sets:4, reps:"12" },
        { name:"Battle Ropes", sets:4, reps:"30s" },
        { name:"Plank", sets:3, reps:"60s" },
      ]},
      { name:"HIIT FINISHER", tag:"cardio", exs:[
        { name:"Sprint Intervals", sets:8, reps:"30s on / 30s off" },
        { name:"Sled Push", sets:5, reps:"20m" },
        { name:"Jump Rope", sets:5, reps:"60s" },
        { name:"Bear Crawl", sets:4, reps:"30m" },
        { name:"Mountain Climbers", sets:4, reps:"45s" },
      ]},
    ],
  },

  // ── ATHLETICS BEGINNER ───────────────────────────────────────────
  {
    id:"runners-strength", name:"STRENGTH FOR RUNNERS", type:"ATHLETICS", level:"BEGINNER",
    weeks:8, daysPerWeek:3, ico:"🏃", col:"#55EFC4",
    desc:"Injury-proof legs and a stronger stride through targeted lifting.",
    goal:"Prevent the most common running injuries and dramatically improve your stride power by building the posterior chain, core stability, and single-leg strength every runner needs.",
    equipment:["Barbell","Dumbbells","Pull-Up Bar","Jump Rope"],
    schedule:["Lower Power","Upper & Core","Speed & Plyos","Rest","Rest","Rest","Rest"],
    days:[
      { name:"LOWER POWER", tag:"legs", exs:[
        { name:"Barbell Squat", sets:3, reps:"8" },
        { name:"Romanian Deadlift", sets:3, reps:"10" },
        { name:"Hip Thrust", sets:3, reps:"12" },
        { name:"Single-Leg Romanian Deadlift", sets:3, reps:"10 each" },
        { name:"Leg Curl", sets:3, reps:"12" },
        { name:"Calf Raise", sets:4, reps:"25" },
      ]},
      { name:"UPPER & CORE", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:3, reps:"10" },
        { name:"Barbell Row", sets:3, reps:"10" },
        { name:"Plank", sets:4, reps:"60s" },
        { name:"Dead Bug", sets:3, reps:"12 each" },
        { name:"Pallof Press", sets:3, reps:"15 each" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
      { name:"SPEED & PLYOS", tag:"cardio", exs:[
        { name:"Box Jumps", sets:5, reps:"5" },
        { name:"Jump Squats", sets:4, reps:"12" },
        { name:"Jump Lunge", sets:3, reps:"10" },
        { name:"High Knees", sets:5, reps:"30s" },
        { name:"Jump Rope", sets:5, reps:"90s" },
        { name:"Step-Ups", sets:3, reps:"12 each" },
      ]},
    ],
  },

  // ── SPORTS ──────────────────────────────────────────────────────
  {
    id:"baseball-performance", name:"BASEBALL PERFORMANCE", type:"SPORTS", level:"INTERMEDIATE",
    weeks:10, daysPerWeek:4, ico:"⚾", col:"#74B9FF",
    desc:"Rotational power, arm strength, and explosive first step.",
    goal:"Develop the rotational power, hip-to-shoulder separation, and explosive lower body strength that produces elite bat speed, throwing velocity, and field agility.",
    equipment:["Barbell","Dumbbells","Cable Machine","Kettlebell","Box"],
    schedule:["Lower Power","Rotational Upper","Speed & Agility","Upper Power","Rest","Rest","Rest"],
    days:[
      { name:"LOWER POWER", tag:"legs", exs:[
        { name:"Barbell Squat", sets:4, reps:"6" },
        { name:"Barbell Deadlift", sets:3, reps:"5" },
        { name:"Hip Thrust", sets:4, reps:"10" },
        { name:"Box Jumps", sets:4, reps:"5" },
        { name:"Calf Raise", sets:4, reps:"20" },
      ]},
      { name:"ROTATIONAL UPPER", tag:"upper", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8" },
        { name:"Barbell Row", sets:4, reps:"8" },
        { name:"Landmine Rotation", sets:4, reps:"12 each" },
        { name:"Cable Woodchop", sets:4, reps:"12 each" },
        { name:"Farmer's Walk", sets:3, reps:"30m" },
      ]},
      { name:"SPEED & AGILITY", tag:"cardio", exs:[
        { name:"Jump Squats", sets:5, reps:"10" },
        { name:"Box Jumps", sets:4, reps:"8" },
        { name:"High Knees", sets:5, reps:"30s" },
        { name:"Jump Rope", sets:5, reps:"60s" },
        { name:"Bear Crawl", sets:4, reps:"20m" },
      ]},
      { name:"UPPER POWER", tag:"upper", exs:[
        { name:"Push Press", sets:4, reps:"5" },
        { name:"Pull-Ups", sets:4, reps:"8" },
        { name:"Barbell Overhead Press", sets:3, reps:"8" },
        { name:"Cable Face Pulls", sets:3, reps:"20" },
        { name:"Dumbbell Row", sets:3, reps:"12" },
      ]},
    ],
  },
  {
    id:"swim-strength", name:"SWIM PERFORMANCE", type:"SPORTS", level:"INTERMEDIATE",
    weeks:8, daysPerWeek:3, ico:"🏊", col:"#4DA6FF",
    desc:"Lat, shoulder, and core strength built for the water.",
    goal:"Build the lat width, shoulder stability, and explosive hip drive that translates directly to faster splits in every stroke — the dryland strength program for serious swimmers.",
    equipment:["Barbell","Dumbbells","Cable Machine","Pull-Up Bar"],
    schedule:["Pull Power","Push & Core","Full Body Power","Rest","Rest","Rest","Rest"],
    days:[
      { name:"PULL POWER", tag:"pull", exs:[
        { name:"Pull-Ups", sets:5, reps:"8" },
        { name:"Lat Pulldown", sets:4, reps:"10" },
        { name:"Barbell Row", sets:4, reps:"8" },
        { name:"Straight-Arm Pulldown", sets:4, reps:"12" },
        { name:"Barbell Curl", sets:3, reps:"12" },
        { name:"Plank", sets:4, reps:"60s" },
      ]},
      { name:"PUSH & CORE", tag:"push", exs:[
        { name:"Barbell Bench Press", sets:4, reps:"8" },
        { name:"Barbell Overhead Press", sets:4, reps:"8" },
        { name:"Incline Dumbbell Press", sets:3, reps:"10" },
        { name:"Cable Woodchop", sets:4, reps:"12 each" },
        { name:"Ab Wheel", sets:3, reps:"15" },
        { name:"Pallof Press", sets:3, reps:"15 each" },
      ]},
      { name:"FULL BODY POWER", tag:"full", exs:[
        { name:"Barbell Deadlift", sets:4, reps:"5" },
        { name:"Box Jumps", sets:4, reps:"8" },
        { name:"Kettlebell Swing", sets:4, reps:"15" },
        { name:"Farmer's Walk", sets:4, reps:"30m" },
        { name:"Hip Thrust", sets:3, reps:"12" },
        { name:"Hanging Leg Raises", sets:3, reps:"15" },
      ]},
    ],
  },
];

function GuidedWorkoutModal({ program, day, sessions, onClose, onFinish }) {
  useScrollLock();
  const totalExs = day.exs.length;
  const [exIdx, setExIdx] = useState(0);
  const [phase, setPhase] = useState("set"); // "set" | "resting" | "done"
  const [restSec, setRestSec] = useState(90);
  const [loggedSets, setLoggedSets] = useState(() => day.exs.map(() => []));
  const [inputW, setInputW] = useState(() => {
    const last = getLastExercisePerformance(day.exs[0]?.name, sessions);
    const best = last?.sets.find(s => s.w);
    return best ? String(progressWeight(best.w)) : "";
  });
  const [inputR, setInputR] = useState(() => String(day.exs[0]?.reps || ""));
  const [voiceOn, setVoiceOn] = useState(() => "speechSynthesis" in window);
  const timerRef = useRef(null);

  const curEx = day.exs[exIdx];
  const curSets = loggedSets[exIdx] || [];
  const curSetNum = curSets.length + 1;
  const totalSets = curEx?.sets || 3;
  const overallPct = Math.round(((exIdx * (curEx?.sets || 3) + curSets.length) / day.exs.reduce((s,e)=>s+e.sets,0)) * 100);
  const lastPerf = curEx ? getLastExercisePerformance(curEx.name, sessions) : null;

  const speak = useCallback((text) => {
    if (!voiceOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }, [voiceOn]);

  useEffect(() => {
    if (phase !== "resting") return;
    if (restSec <= 0) {
      setTimeout(() => setPhase("set"), 0);
      speak("Rest complete — next set!");
      return;
    }
    timerRef.current = setTimeout(() => setRestSec(s => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [phase, restSec, speak]);

  const completeSet = () => {
    const w = parseFloat(inputW) || 0;
    const r = parseInt(inputR) || (curEx?.reps || 0);
    const newSets = [...curSets, { r: String(r), w: String(w), type: "working" }];
    const newLoggedSets = loggedSets.map((s, i) => i === exIdx ? newSets : s);
    setLoggedSets(newLoggedSets);

    const isLastSet = newSets.length >= totalSets;
    const isLastEx  = exIdx >= totalExs - 1;

    if (isLastSet && isLastEx) {
      speak("Amazing work — workout complete!");
      setPhase("done");
    } else if (isLastSet) {
      const nextEx = day.exs[exIdx + 1];
      speak(`${curEx.name} done. Next up: ${nextEx?.name}.`);
      const nextLast = getLastExercisePerformance(nextEx?.name, sessions);
      const nextBest = nextLast?.sets.find(s => s.w);
      setInputW(nextBest ? String(progressWeight(nextBest.w)) : "");
      setInputR(String(nextEx?.reps || ""));
      setExIdx(i => i + 1);
      setPhase("set");
    } else {
      speak(`Set ${curSetNum} complete. Rest ${Math.round(90/60)} minute.`);
      setRestSec(90);
      setPhase("resting");
    }
  };

  const skipRest = () => {
    clearTimeout(timerRef.current);
    setPhase("set");
  };

  const saveWorkout = () => {
    const exs = day.exs.map((ex, i) => ({
      id: i + 1, name: ex.name, q: ex.name, sugg: false, rest: 90,
      sets: loggedSets[i].length > 0
        ? loggedSets[i]
        : Array.from({ length: ex.sets }, () => ({ r: String(ex.reps), w: "", type: "working" }))
    }));
    onFinish(`${program.name} — ${day.name}`, exs);
  };

  const col = program.col;
  const mins = Math.floor(restSec / 60);
  const secs = String(restSec % 60).padStart(2, "0");

  if (phase === "done") {
    const totalLogged = loggedSets.reduce((s, sets) => s + sets.length, 0);
    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.98)", zIndex:700, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 24px calc(env(safe-area-inset-bottom,0px) + 24px)" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🏆</div>
        <div style={{ fontFamily:FONT.display, fontSize:26, letterSpacing:4, color:G.gold, textTransform:"uppercase", marginBottom:6 }}>WORKOUT DONE</div>
        <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:24 }}>{totalExs} exercises · {totalLogged} sets completed</div>
        <div style={{ width:"100%", maxWidth:420, marginBottom:20 }}>
          {day.exs.map((ex, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", marginBottom:6, background:"rgba(255,255,255,0.04)", borderRadius:8 }}>
              <div style={{ fontFamily:FONT.body, fontSize:12, color:"#fff", letterSpacing:0.5, textTransform:"uppercase", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ex.name}</div>
              <div style={{ fontFamily:FONT.display, fontSize:12, color:col, letterSpacing:1, flexShrink:0, marginLeft:10 }}>
                {loggedSets[i].map(s => `${s.r}×${s.w||"BW"}`).join("  ")}
              </div>
            </div>
          ))}
        </div>
        <button onClick={saveWorkout} style={{ width:"100%", maxWidth:420, padding:"16px", background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:12, color:"#0A0810", fontFamily:FONT.display, fontSize:15, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", marginBottom:10 }}>
          SAVE SESSION ◆
        </button>
        <button onClick={onClose} style={{ background:"none", border:"none", color:G.textDim, fontFamily:FONT.body, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>DISCARD</button>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.98)", zIndex:700, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ paddingTop:"calc(env(safe-area-inset-top,0px) + 14px)", padding:"calc(env(safe-area-inset-top,0px) + 14px) 18px 12px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:7, color:G.textDim, cursor:"pointer", fontSize:14, padding:"5px 10px", flexShrink:0 }}>✕</button>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.max(2, overallPct)}%`, background:`linear-gradient(90deg,${col},${col}cc)`, borderRadius:2, transition:"width 0.4s" }}/>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>EX {exIdx+1}/{totalExs} · {overallPct}% COMPLETE</div>
        </div>
        <button onClick={()=>setVoiceOn(v=>!v)} style={{ background:voiceOn?`${col}22`:"transparent", border:`1px solid ${voiceOn?col:G.borderB}`, borderRadius:7, color:voiceOn?col:G.textDim, cursor:"pointer", fontSize:14, padding:"5px 10px", flexShrink:0 }}>
          {voiceOn?"🔊":"🔇"}
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px calc(env(safe-area-inset-bottom,0px) + 24px)" }}>
        {phase === "resting" ? (
          <>
            <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:4, color:G.textMid, textTransform:"uppercase", marginBottom:16 }}>REST</div>
            <div style={{ fontFamily:FONT.display, fontSize:72, color:col, letterSpacing:2, lineHeight:1, textShadow:`0 0 40px ${col}66`, marginBottom:8 }}>{mins}:{secs}</div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:32 }}>
              NEXT: SET {curSets.length + 1} · {curEx?.name}
            </div>
            <button onClick={skipRest} style={{ background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 32px", color:G.textMid, fontFamily:FONT.display, fontSize:13, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>
              SKIP REST →
            </button>
          </>
        ) : (
          <>
            <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:4, color:col, textTransform:"uppercase", marginBottom:10 }}>
              SET {curSetNum} OF {totalSets}
            </div>
            <div style={{ fontFamily:FONT.display, fontSize:28, letterSpacing:3, color:"#fff", textTransform:"uppercase", textAlign:"center", lineHeight:1.2, marginBottom:16 }}>{curEx?.name}</div>

            {lastPerf && (
              <div style={{ background:`${col}12`, border:`1px solid ${col}33`, borderRadius:8, padding:"6px 14px", marginBottom:20, flexShrink:0 }}>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:col, letterSpacing:1.5, textTransform:"uppercase", textAlign:"center" }}>
                  LAST: {lastPerf.sets.slice(0,3).map(s=>`${s.r}×${s.w}`).join("  ·  ")}
                </div>
              </div>
            )}

            <div style={{ display:"flex", gap:16, marginBottom:28, width:"100%", maxWidth:300 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6, textAlign:"center" }}>WEIGHT (LBS)</div>
                <input type="number" inputMode="decimal" value={inputW} onChange={e=>setInputW(e.target.value)}
                  placeholder="—"
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.5)", border:`1px solid ${col}55`, borderRadius:10, padding:"14px 12px", color:"#fff", fontFamily:FONT.display, fontSize:26, letterSpacing:2, textAlign:"center", outline:"none" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6, textAlign:"center" }}>REPS</div>
                <input type="number" inputMode="numeric" value={inputR} onChange={e=>setInputR(e.target.value)}
                  style={{ width:"100%", boxSizing:"border-box", background:"rgba(0,0,0,0.5)", border:`1px solid ${col}55`, borderRadius:10, padding:"14px 12px", color:"#fff", fontFamily:FONT.display, fontSize:26, letterSpacing:2, textAlign:"center", outline:"none" }}/>
              </div>
            </div>

            <button onClick={completeSet} style={{ width:"100%", maxWidth:360, padding:"18px", background:`linear-gradient(135deg,${col},${col}bb)`, border:"none", borderRadius:14, color:"#0A0810", fontFamily:FONT.display, fontSize:16, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", boxShadow:`0 6px 28px ${col}55`, marginBottom:16 }}>
              ✓ SET COMPLETE
            </button>

            {curSets.length > 0 && (
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
                {curSets.map((s, i) => (
                  <div key={i} style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, background:"rgba(255,255,255,0.06)", borderRadius:5, padding:"3px 8px", letterSpacing:1 }}>
                    {s.r}×{s.w||"BW"}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProgramDetailModal({ program, onClose, onStartDay, onStartGuided, sessions = [] }) {
  useScrollLock();
  const [activeDay, setActiveDay] = useState(0);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const day = program.days[activeDay];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.97)", zIndex:600, display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${program.col}22,rgba(0,0,0,0.7))`, borderBottom:`1px solid ${program.col}33`, padding:"16px 18px", paddingTop:"calc(env(safe-area-inset-top, 0px) + 16px)", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ fontSize:28, flexShrink:0 }}>{program.ico}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:2, color:"#fff", textTransform:"uppercase", lineHeight:1.2 }}>{program.name}</div>
          <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
            <Chip label={program.type} small color={program.col}/>
            <Chip label={program.level} small/>
            <Chip label={`${program.weeks}WK`} small/>
            <Chip label={`${program.daysPerWeek}x/WK`} small/>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:8, color:G.textMid, cursor:"pointer", fontSize:16, padding:"6px 10px", flexShrink:0 }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"20px 18px", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 100px)", maxWidth:480, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>

        {/* Goal */}
        <ChromeCard style={{ padding:"14px 16px", marginBottom:14 }}>
          <div style={{ fontFamily:FONT.body, fontSize:11, letterSpacing:2, color:program.col, textTransform:"uppercase", marginBottom:6 }}>PROGRAM GOAL</div>
          <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:0.5, lineHeight:1.6 }}>{program.goal}</div>
        </ChromeCard>

        {/* Overview row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[
            { label:"DURATION", val:`${program.weeks} WKS` },
            { label:"FREQUENCY", val:`${program.daysPerWeek}x / WK` },
            { label:"EQUIPMENT", val:`${program.equipment.length} ITEMS` },
          ].map(s => (
            <ChromeCard key={s.label} style={{ padding:"10px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:FONT.display, fontSize:16, color:program.col, letterSpacing:1 }}>{s.val}</div>
              <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase", marginTop:3 }}>{s.label}</div>
            </ChromeCard>
          ))}
        </div>

        {/* Weekly schedule */}
        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>WEEKLY SCHEDULE</div>
        <ChromeCard style={{ padding:"12px 14px", marginBottom:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {["M","T","W","T","F","S","S"].map((d,i) => {
              const isRest = program.schedule[i] === "Rest";
              return (
                <div key={i} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:9, color:G.textDim, letterSpacing:1, marginBottom:4 }}>{d}</div>
                  <div style={{ width:"100%", aspectRatio:"1", borderRadius:6, background:isRest ? "rgba(255,255,255,0.04)" : `${program.col}22`, border:`1px solid ${isRest ? G.borderB : program.col+"55"}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ fontFamily:FONT.display, fontSize:7, color:isRest ? G.textDim : program.col, letterSpacing:0.5, textTransform:"uppercase", padding:"1px 2px", textAlign:"center", lineHeight:1.2 }}>
                      {isRest ? "–" : program.schedule[i].split(" ")[0].slice(0,4)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ChromeCard>

        {/* Day selector */}
        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>SELECT WORKOUT DAY</div>
        <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
          {program.days.map((d,i) => (
            <button key={i} onClick={()=>setActiveDay(i)}
              style={{ flex:1, minWidth:0, padding:"8px 6px", borderRadius:8, border:`1px solid ${activeDay===i ? program.col : G.borderB}`, background:activeDay===i ? `${program.col}18` : "transparent", color:activeDay===i ? program.col : G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1, cursor:"pointer", textTransform:"uppercase", textAlign:"center", lineHeight:1.3 }}>
              <div style={{ fontSize:8, opacity:0.7, marginBottom:2 }}>DAY {i+1}</div>
              {d.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Day workout */}
        <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:10 }}>
          DAY {activeDay+1} — {day.name}
        </div>
        {day.exs.map((ex, i) => (
          <ChromeCard key={i} style={{ padding:"11px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:26, height:26, borderRadius:6, background:`${program.col}22`, border:`1px solid ${program.col}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <div style={{ fontFamily:FONT.display, fontSize:11, color:program.col }}>{i+1}</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:FONT.body, fontSize:13, color:"#fff", letterSpacing:0.5, textTransform:"uppercase" }}>{ex.name}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontFamily:FONT.display, fontSize:14, color:program.col, letterSpacing:1 }}>{ex.sets}×{ex.reps}</div>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, marginTop:1 }}>SETS × REPS</div>
            </div>
          </ChromeCard>
        ))}

        {/* Equipment */}
        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase", marginTop:16, marginBottom:8 }}>EQUIPMENT NEEDED</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
          {program.equipment.map(e => <Chip key={e} label={e} small color={G.textMid}/>)}
        </div>

        {/* CTA */}
        <button onClick={()=>onStartDay(program, activeDay)}
          style={{ width:"100%", padding:"15px", background:`linear-gradient(135deg,${program.col},${program.col}cc)`, border:"none", borderRadius:10, color:"#0A0810", fontFamily:FONT.display, fontSize:15, letterSpacing:3, textTransform:"uppercase", cursor:"pointer", boxShadow:`0 4px 20px ${program.col}55`, marginBottom:10 }}>
          LOG DAY {activeDay+1} WORKOUT ◆
        </button>
        {onStartGuided && (
          <button onClick={()=>setGuidedOpen(true)}
            style={{ width:"100%", padding:"14px", background:"transparent", border:`1px solid ${program.col}66`, borderRadius:10, color:program.col, fontFamily:FONT.display, fontSize:14, letterSpacing:3, textTransform:"uppercase", cursor:"pointer" }}>
            🎯 GUIDED MODE
          </button>
        )}
      </div>
      {guidedOpen && (
        <GuidedWorkoutModal
          program={program}
          day={day}
          sessions={sessions}
          onClose={()=>setGuidedOpen(false)}
          onFinish={(name, exs) => { setGuidedOpen(false); onStartGuided(name, exs); onClose(); }}
        />
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

function ProgressScreen({ showToast, sessions = [], profile, unit = "lbs" }) {
  const [activeTab, setActiveTab] = useState("stats");
  const [chartsEx, setChartsEx] = useState(null);
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
  const [logMeas, setLogMeas] = useState({ chest:"", waist:"", hips:"", arms:"", thighs:"", calves:"" });
  const [showMeasForm, setShowMeasForm] = useState(false);

  const saveBodyEntry = () => {
    const w = parseFloat(logWeight);
    if (isNaN(w) || w <= 0) { showToast("⚠️ Enter a valid weight"); return; }
    const bf = parseFloat(logBf) || null;
    const hasMeas = Object.values(logMeas).some(v => v);
    const entry = { date: new Date().toISOString().slice(0, 10), weight: w, bf, photo: logPhoto || undefined, ...(hasMeas ? { meas: logMeas } : {}) };
    const next = [entry, ...bodyLog];
    setBodyLog(next);
    localStorage.setItem("sfc_body_log", JSON.stringify(next));
    setLogWeight(""); setLogBf(""); setLogPhoto(null); setShowLogForm(false);
    setLogMeas({ chest:"", waist:"", hips:"", arms:"", thighs:"", calves:"" }); setShowMeasForm(false);
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
    <div style={{ padding:"calc(env(safe-area-inset-top, 0px) + 20px) 18px 0" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>
          PROGRESS <span style={{ color:G.purple, textShadow:`0 0 12px ${G.purple}` }}>VAULT</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:G.purple, boxShadow:`0 0 8px ${G.purple}` }}/>
          <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Stats · Charts · Streak · Heat Map</div>
        </div>
      </div>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.5)", borderRadius:7, padding:3, gap:3, marginBottom:18, border:`1px solid ${G.borderB}` }}>
        {[{id:"stats",l:"STATS"},{id:"streak",l:"STREAK"},{id:"charts",l:"CHARTS"},{id:"heatmap",l:"MAP"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ flex:1, padding:"8px 2px", borderRadius:5, border:"none", background:activeTab===t.id?`linear-gradient(135deg,${G.purple},${G.purpleBright})`:"transparent", color:activeTab===t.id?"#fff":G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
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
                const today = now.toISOString().slice(0,10);
                // Handle both array format [{date,items}] and legacy single-object format
                if (Array.isArray(saved)) return (saved.find(e => e.date === today)?.items) || [];
                if (saved?.date === today) return saved.items || [];
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
              { l:"AVG VOL/SESSION",  v:`${avgVol} ${unit}`,      ico:"⚡" },
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
              <button onClick={()=>setShowMeasForm(v=>!v)} style={{ width:"100%", background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"7px", color:G.textMid, fontFamily:FONT.body, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", marginBottom:8 }}>{showMeasForm ? "▲ HIDE MEASUREMENTS" : "▼ ADD MEASUREMENTS (OPT)"}</button>
              {showMeasForm && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, marginBottom:8 }}>
                  {[["chest","CHEST (IN)"],["waist","WAIST (IN)"],["hips","HIPS (IN)"],["arms","ARMS (IN)"],["thighs","THIGHS (IN)"],["calves","CALVES (IN)"]].map(([k,l]) => (
                    <div key={k}>
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{l}</div>
                      <input type="number" inputMode="decimal" placeholder="—" value={logMeas[k]} onChange={e=>setLogMeas(p=>({...p,[k]:e.target.value}))} style={{ ...inp, padding:"8px 10px", fontSize:13 }}/>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={saveBodyEntry} style={{ width:"100%", background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", borderRadius:6, padding:"10px", color:"#0A0810", fontFamily:FONT.display, fontSize:14, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>SAVE</button>
            </ChromeCard>
          )}
          {bodyLog.length >= 2 && (() => {
            const pts2 = [...bodyLog].reverse();
            const weights = pts2.map(e => e.weight);
            const minW = Math.min(...weights);
            const maxW = Math.max(...weights);
            const range = maxW - minW || 1;
            const W = 280; const H = 64;
            const PAD = 8;
            const coords = pts2.map((e, i) => ({
              x: PAD + (i / Math.max(pts2.length - 1, 1)) * (W - PAD * 2),
              y: H - ((e.weight - minW) / range) * (H - 16) - 8,
            }));
            const polyPts = coords.map(c => `${c.x},${c.y}`).join(" ");
            const delta = pts2[pts2.length - 1].weight - pts2[0].weight;
            const absDelta = Math.abs(delta).toFixed(1);
            const trendUp = delta > 0;
            const trendColor = delta === 0 ? G.textMid : trendUp ? G.purpleLight : "#4ADE80";
            const trendLabel = delta === 0 ? "NO CHANGE" : `${trendUp ? "+" : "−"}${absDelta} LBS`;
            const fmtDate = d => { try { const [,m,day] = d.split("-"); return `${["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][+m-1]} ${+day}`; } catch { return d; } };
            return (
              <ChromeCard style={{ padding:"14px", marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>WEIGHT TREND</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1, color:trendColor }}>{delta > 0 ? "↑" : delta < 0 ? "↓" : "→"} {trendLabel}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{bodyLog.length} entries</div>
                  </div>
                </div>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={G.gold} stopOpacity="0.2"/>
                      <stop offset="100%" stopColor={G.gold} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polygon points={`${coords[0].x},${H} ${polyPts} ${coords[coords.length-1].x},${H}`} fill="url(#wGrad)"/>
                  <polyline points={polyPts} fill="none" stroke={G.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 3px ${G.gold})` }}/>
                  {coords.map((c, i) => (
                    <circle key={i} cx={c.x} cy={c.y} r={i===0||i===coords.length-1?4:2} fill={i===coords.length-1?G.gold:"#0A0810"} stroke={G.gold} strokeWidth="1.5"/>
                  ))}
                  <text x={coords[0].x} y={coords[0].y - 6} textAnchor="middle" fill={G.textDim} fontSize="7" fontFamily="sans-serif">{pts2[0].weight}</text>
                  <text x={coords[coords.length-1].x} y={coords[coords.length-1].y - 6} textAnchor="middle" fill={G.gold} fontSize="8" fontFamily="sans-serif" fontWeight="bold">{pts2[pts2.length-1].weight}</text>
                </svg>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{fmtDate(pts2[0]?.date)}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1 }}>{fmtDate(pts2[pts2.length-1]?.date)}</div>
                </div>
              </ChromeCard>
            );
          })()}
          {bodyLog.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>HISTORY</div>
              {bodyLog.slice(0, 4).map((entry, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 10px", background:i===0?`${G.gold}08`:"transparent", borderRadius:5, marginBottom:3, border:`1px solid ${i===0?G.borderB:"transparent"}` }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>{entry.date}</div>
                    {entry.meas && Object.values(entry.meas).some(v=>v) && (
                      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>
                        {Object.entries(entry.meas).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}"`).join("  ·  ")}
                      </div>
                    )}
                  </div>
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
        <MuscleHeatMap sessions={sessions}/>
      )}

      {activeTab==="charts" && (() => {
        const exFreq = {};
        sessions.forEach(s => (s.exs||[]).forEach(e => { if (e.name) exFreq[e.name] = (exFreq[e.name]||0) + 1; }));
        const trackedExs = Object.entries(exFreq).filter(([,c]) => c >= 2).sort(([,a],[,b]) => b-a).map(([n]) => n);

        const bestHistory = chartsEx ? getExerciseHistory(chartsEx, sessions) : [];
        const volHistory = chartsEx ? (() => {
          const out = [];
          const chrono = [...sessions].reverse();
          for (const sess of chrono) {
            const ex = (sess.exs||[]).find(e => e.name === chartsEx);
            if (!ex) continue;
            let vol = 0;
            for (const set of (ex.sets||[])) {
              if (set.type === "warmup") continue;
              const w = parseFloat(set.w)||0, r = parseInt(set.r)||0;
              if (w && r) vol += w * r;
            }
            if (vol > 0) out.push({ date: sess.date || (sess.createdAt||"").slice(0,10), vol });
          }
          return out;
        })() : [];

        const ExChart = ({ data, valueKey, label, color, fmt }) => {
          const vals = data.map(d => d[valueKey]);
          if (vals.length < 2) return null;
          const minV = Math.min(...vals); const maxV = Math.max(...vals);
          const range = maxV - minV || 1;
          const W = 300; const H = 90;
          const coords = data.map((d, i) => ({
            x: (i / (data.length - 1)) * W,
            y: H - ((d[valueKey] - minV) / range) * (H - 16) - 8,
            val: d[valueKey], date: d.date,
          }));
          const poly = coords.map(c => `${c.x},${c.y}`).join(" ");
          const months = [];
          let lastMo = null;
          data.forEach((d, i) => {
            if (!d.date) return;
            const mo = new Date(d.date + "T12:00:00").toLocaleString("en-US", { month: "short" }).toUpperCase();
            if (mo !== lastMo) { months.push({ mo, pct: (i/(data.length-1))*100 }); lastMo = mo; }
          });
          const fmtVal = v => fmt ? fmt(v) : Math.round(v);
          return (
            <ChromeCard style={{ padding:"14px 16px", marginBottom:12 }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>{label}</div>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", right:0, top:0, bottom:16, display:"flex", flexDirection:"column", justifyContent:"space-between", pointerEvents:"none" }}>
                  <div style={{ fontFamily:FONT.mono, fontSize:9, color:G.textDim, letterSpacing:0.5 }}>{fmtVal(maxV)}</div>
                  <div style={{ fontFamily:FONT.mono, fontSize:9, color:G.textDim, letterSpacing:0.5 }}>{fmtVal(minV)}</div>
                </div>
                <svg width="100%" viewBox={`-4 0 ${W+8} ${H}`} style={{ overflow:"visible", display:"block" }}>
                  <defs>
                    <linearGradient id={`grad-${label}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
                      <stop offset="100%" stopColor={color} stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[0.25, 0.5, 0.75].map(f => <line key={f} x1="0" y1={H*f} x2={W} y2={H*f} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
                  {coords.length > 1 && <polygon points={`${coords[0].x},${H} ${poly} ${coords[coords.length-1].x},${H}`} fill={`url(#grad-${label})`}/>}
                  {coords.length > 1 && <polyline points={poly} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 4px ${color}88)` }}/>}
                  {coords.map((c, i) => (
                    <circle key={i} cx={c.x} cy={c.y} r={i===coords.length-1?5:3} fill={color} stroke="#0A0810" strokeWidth="1.5" style={{ filter:i===coords.length-1?`drop-shadow(0 0 5px ${color})`:"none" }}/>
                  ))}
                </svg>
                <div style={{ position:"relative", height:14, marginTop:2 }}>
                  {months.slice(0,4).map((m, i) => (
                    <div key={i} style={{ position:"absolute", left:`${m.pct}%`, transform:"translateX(-50%)", fontFamily:FONT.mono, fontSize:9, color:G.textDim, letterSpacing:0.5, whiteSpace:"nowrap" }}>{m.mo}</div>
                  ))}
                </div>
              </div>
            </ChromeCard>
          );
        };

        if (sessions.length === 0) return (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
            <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:G.textMid }}>LOG SESSIONS TO SEE CHARTS</div>
          </div>
        );

        return (
          <div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>SELECT EXERCISE</div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:12, WebkitOverflowScrolling:"touch", marginBottom:4 }}>
              {trackedExs.length === 0
                ? <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1 }}>Log 2+ sessions with the same exercise to unlock charts.</div>
                : trackedExs.map(ex => (
                  <button key={ex} onClick={() => setChartsEx(ex)} style={{ flexShrink:0, padding:"6px 13px", borderRadius:20, border:`1px solid ${chartsEx===ex ? G.purple : G.borderB}`, background:chartsEx===ex ? `linear-gradient(135deg,${G.purple},${G.purpleBright})` : "transparent", color:chartsEx===ex ? "#fff" : G.textMid, fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap" }}>{ex}</button>
                ))
              }
            </div>

            {chartsEx && bestHistory.length < 2 && (
              <ChromeCard style={{ padding:"18px", textAlign:"center", marginTop:8 }}>
                <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>Log at least 2 sessions with {chartsEx} to see your charts.</div>
              </ChromeCard>
            )}

            {chartsEx && bestHistory.length >= 2 && (
              <>
                <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:12, marginTop:4 }}>
                  {chartsEx} <span style={{ color:G.purple, textShadow:`0 0 10px ${G.purple}` }}>· ANALYTICS</span>
                </div>
                <ExChart data={bestHistory} valueKey="weight" label="BEST SET WEIGHT (LBS)" color={G.purple}/>
                <ExChart data={bestHistory} valueKey="est1rm" label="ESTIMATED 1RM TREND" color={G.gold}/>
                <ExChart data={volHistory} valueKey="vol" label="TOTAL SESSION VOLUME (LBS)" color="#4ADE80"
                  fmt={v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : Math.round(v)}/>
              </>
            )}

            {!chartsEx && trackedExs.length > 0 && (
              <div style={{ textAlign:"center", padding:"32px 0" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>📈</div>
                <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>TAP AN EXERCISE ABOVE</div>
                <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:1, marginTop:6 }}>to see your Best Set, 1RM trend,<br/>and volume over time</div>
              </div>
            )}
          </div>
        );
      })()}

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

function NutritionScreen({ showToast, sessions = [] }) {
  const [view, setView] = useState("log");
  const today = new Date().toISOString().slice(0, 10);
  const nutritionHistory = (() => {
    try {
      const s = localStorage.getItem("sfc_nutrition_log");
      if (!s) return [];
      const p = JSON.parse(s);
      if (Array.isArray(p)) return p;
      if (p?.date) return [{ date: p.date, items: p.items || [] }];
      return [];
    } catch { return []; }
  })();
  const [log, setLog] = useState(() => nutritionHistory.find(e => e.date === today)?.items || []);
  const suppHistory = (() => {
    try {
      const s = localStorage.getItem("sfc_supplement_log");
      if (!s) return [];
      const p = JSON.parse(s);
      if (Array.isArray(p)) return p;
      if (p?.date) return [{ date: p.date, items: p.items || [] }];
      return [];
    } catch { return []; }
  })();
  const [suppLog, setSuppLog] = useState(() => suppHistory.find(e => e.date === today)?.items || []);
  const pastFoodDays = nutritionHistory.filter(e => e.date !== today).slice(0, 7);
  const [expandedFoodDay, setExpandedFoodDay] = useState(null);
  const [suppSearch, setSuppSearch] = useState("");
  const [suppTypeFilter, setSuppTypeFilter] = useState("ALL");
  const [scanTarget, setScanTarget] = useState("food");
  const [foodFavs, setFoodFavs] = useState(() => { try { return JSON.parse(localStorage.getItem("sfc_food_favorites") || "[]"); } catch { return []; } });

  const toggleFoodFav = (food) => {
    setFoodFavs(prev => {
      const exists = prev.some(f => f.name === food.name);
      const next = exists ? prev.filter(f => f.name !== food.name) : [food, ...prev].slice(0, 30);
      localStorage.setItem("sfc_food_favorites", JSON.stringify(next));
      return next;
    });
  };

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
    const s = localStorage.getItem("sfc_nutrition_log");
    let history = [];
    try {
      const p = JSON.parse(s || "null");
      if (Array.isArray(p)) history = p;
      else if (p?.date) history = [{ date: p.date, items: p.items || [] }];
    } catch { /* ignore parse errors */ }
    const updated = [{ date: today, items: log }, ...history.filter(e => e.date !== today)].slice(0, 30);
    localStorage.setItem("sfc_nutrition_log", JSON.stringify(updated));
  }, [log, today]);
  useEffect(() => {
    const s = localStorage.getItem("sfc_supplement_log");
    let history = [];
    try {
      const p = JSON.parse(s || "null");
      if (Array.isArray(p)) history = p;
      else if (p?.date) history = [{ date: p.date, items: p.items || [] }];
    } catch { /* ignore parse errors */ }
    const updated = [{ date: today, items: suppLog }, ...history.filter(e => e.date !== today)].slice(0, 30);
    localStorage.setItem("sfc_supplement_log", JSON.stringify(updated));
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
  const [showSearchManual, setShowSearchManual] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiSearched, setApiSearched] = useState(false);
  const [addingFood, setAddingFood] = useState(null);   // food item being quantity-picked
  const [foodQty, setFoodQty] = useState(1);            // fraction/amount per unit (e.g. 0.5, 1, 2)
  const [foodCount, setFoodCount] = useState(1);        // whole-number quantity (e.g. 2 eggs)
  const [foodUnit, setFoodUnit] = useState("serving");  // "serving" | "cup"

  // Lock body scroll when the serving picker sheet is open (iOS Safari fix)
  useEffect(() => {
    if (addingFood) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [addingFood]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanAnimRef = useRef(null);
  const zxingControlsRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    cancelAnimationFrame(scanAnimRef.current);
    if (zxingControlsRef.current) { try { zxingControlsRef.current.stop(); } catch { /* ignore */ } zxingControlsRef.current = null; }
  };

  useEffect(() => () => { stopCamera(); }, []);

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
      if (e.message === "No food detected") showToast("No food detected — try again");
      else if (e.message?.includes("API key") || e.message?.includes("not configured")) showToast("⚠️ AI scan not set up — use BARCODE tab instead");
      else showToast("Scan failed — check connection");
    }
  };

  const startBarcodeScan = async () => {
    setScanMode("barcode_scanning"); setScanProgress(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      if ("BarcodeDetector" in window) {
        // Native BarcodeDetector — Chrome and Safari 17+
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
      } else {
        // ZXing fallback — works on iOS Safari and all other browsers
        try {
          const { BrowserMultiFormatReader } = await import("@zxing/browser");
          const codeReader = new BrowserMultiFormatReader();
          const controls = await codeReader.decodeFromVideoElementContinuously(videoRef.current, (result) => {
            if (result) {
              zxingControlsRef.current = null;
              controls.stop();
              stopCamera();
              lookupBarcode(result.getText());
            }
          });
          zxingControlsRef.current = controls;
        } catch {
          // ZXing failed to load — manual entry input is still visible
        }
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

  const resetScan = () => { stopCamera(); setScanMode("idle"); setScanResult(null); setBarcodeInput(""); setScanProgress(0); setManualEntry({ name:"", cal:"", pro:"", carb:"", fat:"" }); setScanTarget("food"); };

  // Open the serving-size sheet for any food item
  const openFoodAdd = (food) => { setAddingFood(food); setFoodQty(1); setFoodCount(1); setFoodUnit("serving"); };
  const confirmFoodAdd = () => {
    if (!addingFood) return;
    const frac = parseFloat(foodQty) || 1;
    const cnt  = Math.max(1, parseInt(foodCount) || 1);
    const q = frac * cnt;
    const fracLabel = frac === 1 ? "" : `${frac} `;
    const unitLabel = foodUnit === "cup" ? "cup" : "serving";
    const qtyLabel  = cnt > 1 ? `${cnt} × ${fracLabel}${unitLabel}` : `${fracLabel}${unitLabel}`;
    const scaled = {
      ...addingFood,
      id: Date.now(),
      meal: selMeal,
      cal:  Math.round((addingFood.cal  || 0) * q),
      pro:  Math.round((addingFood.pro  || 0) * q * 10) / 10,
      carb: Math.round((addingFood.carb || 0) * q * 10) / 10,
      fat:  Math.round((addingFood.fat  || 0) * q * 10) / 10,
      servingLabel: qtyLabel,
    };
    setLog(p => [...p, scaled]);
    showToast(`✓ ${addingFood.name} added to ${selMeal}`);
    setAddingFood(null);
  };
  const addScanResult = () => {
    if (!scanResult) return;
    if (scanTarget === "supplement") {
      setSuppLog(p=>[...p,{...scanResult,id:Date.now(),type:"SCANNED"}]);
      resetScan(); setView("supps");
      showToast(`✓ ${scanResult.name} added to supplements`);
    } else {
      openFoodAdd(scanResult);
      resetScan(); setView("search");
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

  const addSearchManual = () => {
    const name = (manualEntry.name || search).trim();
    if (!name) { showToast("⚠️ Enter a food name"); return; }
    const item = { name, cal: parseInt(manualEntry.cal)||0, pro: parseFloat(manualEntry.pro)||0, carb: parseFloat(manualEntry.carb)||0, fat: parseFloat(manualEntry.fat)||0 };
    setLog(p => [...p, { ...item, id: Date.now(), meal: selMeal }]);
    showToast(`✓ ${name} added to ${selMeal}`);
    setManualEntry({ name:"", cal:"", pro:"", carb:"", fat:"" });
    setShowSearchManual(false);
    setView("log");
  };

  const searchOnline = async () => {
    if (!search.trim() || apiLoading) return;
    setApiLoading(true);
    setApiSearched(true);
    setApiResults([]);
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(search.trim())}&search_simple=1&action=process&json=1&page_size=20&fields=product_name,brands,nutriments`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      const mapped = (data.products || [])
        .filter(p => p.product_name && p.nutriments?.["energy-kcal_100g"] != null)
        .map(p => ({
          name: [p.product_name, p.brands ? `(${p.brands.split(",")[0].trim()})` : ""].filter(Boolean).join(" "),
          cal: Math.round(p.nutriments["energy-kcal_100g"] || 0),
          pro: Math.round((p.nutriments["proteins_100g"] || 0) * 10) / 10,
          carb: Math.round((p.nutriments["carbohydrates_100g"] || 0) * 10) / 10,
          fat: Math.round((p.nutriments["fat_100g"] || 0) * 10) / 10,
          cat: "BRAND",
          per100g: true,
        }))
        .filter(p => p.cal > 0 && p.name.length > 2)
        .slice(0, 12);
      setApiResults(mapped);
    } catch {
      showToast("⚠️ Couldn't reach the food database. Check your connection.");
    }
    setApiLoading(false);
  };

  const filteredFoods = FOODS.filter(f => {
    const matchCat = catFilter==="ALL" || f.cat===catFilter;
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || (f.brand||"").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
    <div style={{ padding:"calc(env(safe-area-inset-top, 0px) + 20px) 18px 0" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>
          NUTRITION <span style={{ color:G.purple, textShadow:`0 0 12px ${G.purple}` }}>LAB</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:G.purple, boxShadow:`0 0 8px ${G.purple}` }}/>
          <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Log · Scan · Search</div>
        </div>
      </div>

      <ChromeCard gold glow style={{ padding:"16px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff" }}>TODAY</div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {macroCoachActive && <div style={{ background:`${G.gold}20`, border:`1px solid ${G.gold}44`, borderRadius:4, padding:"2px 6px", fontFamily:FONT.body, fontSize:8, letterSpacing:1.5, color:G.gold, textTransform:"uppercase" }}>⚡ ADAPTIVE</div>}
          </div>
        </div>
        {(() => {
          const bw = getLoggedBodyWeight();
          const todayWorkoutKcal = bw ? sessions.filter(s => (s.createdAt||"").slice(0,10) === today).reduce((sum, s) => sum + calcSessionCalories(s.exs, bw), 0) : 0;
          const adjustedBudget = macroTargets.cal + Math.round(todayWorkoutKcal);
          const budget = todayWorkoutKcal > 0 ? adjustedBudget : macroTargets.cal;
          const calPct = Math.min(100, Math.round((totals.cal / budget) * 100));
          const calRemaining = budget - totals.cal;
          const over = calRemaining < 0;
          const ringColor = calPct >= 100 ? "#FF3D5A" : calPct >= 85 ? "#FF6B00" : G.gold;
          return (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:16 }}>
              <div style={{ position:"relative" }}>
                <RingMeter pct={calPct} size={140} strokeW={10} color={ringColor} value={Math.abs(calRemaining).toLocaleString()} label={over ? "CAL OVER" : "CAL LEFT"}/>
                <div style={{ position:"absolute", bottom:-4, left:"50%", transform:"translateX(-50%)", whiteSpace:"nowrap", fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>
                  {totals.cal.toLocaleString()} / {budget.toLocaleString()} KCAL
                </div>
              </div>
              {todayWorkoutKcal > 0 && (
                <div style={{ marginTop:16, background:`rgba(255,61,90,0.1)`, border:`1px solid rgba(255,61,90,0.25)`, borderRadius:8, padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14 }}>🔥</span>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:"#FF6B6B", letterSpacing:1.5, textTransform:"uppercase" }}>
                    Workout burned ~{Math.round(todayWorkoutKcal)} kcal · Budget adjusted to {adjustedBudget.toLocaleString()}
                  </div>
                </div>
              )}
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
          <button key={t.id} onClick={()=>{ setView(t.id); if(t.id==="scan"&&scanMode==="idle") startCameraScan(); }} style={{ flex:1, padding:"8px 4px", borderRadius:5, border:"none", background:view===t.id?`linear-gradient(135deg,${G.purple},${G.purpleBright})`:"transparent", color:view===t.id?"#fff":G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
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
            <input value={search} onChange={e=>{ setSearch(e.target.value); setApiResults([]); setApiSearched(false); }} placeholder="SEARCH 250+ FOODS, BRANDS, RESTAURANTS..." style={{ ...inp, paddingLeft:36, paddingRight:search?36:12 }}/>
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
          {foodFavs.length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.gold, textTransform:"uppercase", marginBottom:8 }}>★ FAVORITES</div>
              {foodFavs.map(food => (
                <ChromeCard key={food.name} style={{ padding:"10px 12px", marginBottom:7, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                      <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{food.name}</div>
                      {food.cat && <span style={{ background:`${G.purpleLight}15`, border:`1px solid ${G.purpleLight}33`, borderRadius:3, padding:"1px 6px", fontFamily:FONT.body, fontSize:8, color:G.purpleLight, letterSpacing:1, textTransform:"uppercase", flexShrink:0 }}>{food.cat}</span>}
                    </div>
                    <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{food.cal} CAL · P:{food.pro}G · C:{food.carb}G · F:{food.fat}G</div>
                  </div>
                  <button onClick={() => toggleFoodFav(food)} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", padding:"4px 6px", color:G.gold }}>★</button>
                  <NeonBtn onClick={()=>openFoodAdd(food)} small>+</NeonBtn>
                </ChromeCard>
              ))}
            </div>
          )}
          {filteredFoods.slice(0,25).map((f)=>(
            <ChromeCard key={f.name} style={{ padding:"10px 12px", marginBottom:7, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                  {f.cat && <span style={{ background:`${G.purpleLight}15`, border:`1px solid ${G.purpleLight}33`, borderRadius:3, padding:"1px 6px", fontFamily:FONT.body, fontSize:8, color:G.purpleLight, letterSpacing:1, textTransform:"uppercase", flexShrink:0 }}>{f.cat}</span>}
                </div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{f.cal} CAL · P:{f.pro}G · C:{f.carb}G · F:{f.fat}G</div>
              </div>
              <button onClick={() => toggleFoodFav(f)} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", padding:"4px 6px", color: foodFavs.some(fv=>fv.name===f.name) ? G.gold : G.textDim }}>
                {foodFavs.some(fv=>fv.name===f.name) ? "★" : "☆"}
              </button>
              <NeonBtn onClick={()=>openFoodAdd(f)} small>+</NeonBtn>
            </ChromeCard>
          ))}

          {search.trim() && filteredFoods.length === 0 && (
            <div style={{ marginTop:4 }}>
              {/* Online search section */}
              {!apiSearched ? (
                <NeonBtn onClick={searchOnline} full outline disabled={apiLoading} style={{ marginBottom:10 }}>
                  🌐 SEARCH ONLINE DATABASE
                </NeonBtn>
              ) : (
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                    <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>
                      {apiLoading ? "SEARCHING ONLINE..." : `${apiResults.length} ONLINE RESULTS (per 100g)`}
                    </div>
                    {!apiLoading && <button onClick={() => { setApiResults([]); setApiSearched(false); }} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:11, fontFamily:FONT.body, letterSpacing:1 }}>CLEAR</button>}
                  </div>
                  {apiLoading && (
                    <ChromeCard style={{ padding:"20px", textAlign:"center" }}>
                      <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:2 }}>SEARCHING...</div>
                    </ChromeCard>
                  )}
                  {apiResults.map((f, i) => (
                    <ChromeCard key={i} style={{ padding:"10px 12px", marginBottom:7, display:"flex", alignItems:"center", gap:10, border:`1px solid ${G.purple}33` }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{f.name}</div>
                        <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, textTransform:"uppercase" }}>{f.cal} CAL · P:{f.pro}G · C:{f.carb}G · F:{f.fat}G</div>
                      </div>
                      <NeonBtn onClick={() => openFoodAdd(f)} small>+</NeonBtn>
                    </ChromeCard>
                  ))}
                  {!apiLoading && apiResults.length === 0 && (
                    <ChromeCard style={{ padding:"14px", textAlign:"center" }}>
                      <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5 }}>No online results found. Log manually below.</div>
                    </ChromeCard>
                  )}
                </div>
              )}

              {/* Manual entry section */}
              {!showSearchManual ? (
                <ChromeCard style={{ padding:"16px 16px", textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", marginBottom:4, textTransform:"uppercase" }}>LOG MANUALLY</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginBottom:12, lineHeight:1.6 }}>
                    Enter custom macros for <span style={{ color:"#fff" }}>"{search}"</span>
                  </div>
                  <NeonBtn onClick={() => { setManualEntry(p => ({ ...p, name: search })); setShowSearchManual(true); }} full outline>+ CUSTOM ENTRY</NeonBtn>
                </ChromeCard>
              ) : (
                <ChromeCard style={{ padding:"14px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>CUSTOM FOOD ENTRY</div>
                    <button onClick={() => { setShowSearchManual(false); setManualEntry({ name:"", cal:"", pro:"", carb:"", fat:"" }); }} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:16, lineHeight:1, padding:"4px" }}>✕</button>
                  </div>
                  <input
                    value={manualEntry.name}
                    onChange={e => setManualEntry(p => ({ ...p, name: e.target.value }))}
                    placeholder="FOOD NAME"
                    style={{ ...inp, marginBottom:10, width:"100%", boxSizing:"border-box" }}
                  />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                    {[{f:"cal",l:"CALORIES",u:"kcal"},{f:"pro",l:"PROTEIN",u:"g"},{f:"carb",l:"CARBS",u:"g"},{f:"fat",l:"FAT",u:"g"}].map(({f,l,u}) => (
                      <div key={f}>
                        <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{l} ({u})</div>
                        <input
                          type="number" inputMode="decimal"
                          value={manualEntry[f]}
                          onChange={e => setManualEntry(p => ({ ...p, [f]: e.target.value }))}
                          placeholder="0"
                          style={{ ...inp, width:"100%", boxSizing:"border-box" }}
                        />
                      </div>
                    ))}
                  </div>
                  <NeonBtn onClick={addSearchManual} full>ADD TO {selMeal} ◆</NeonBtn>
                </ChromeCard>
              )}
            </div>
          )}
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

      {view==="log" && (() => {
        // Derive recent foods from nutrition history (last 14 days, excl. today)
        const recentMap = {};
        nutritionHistory.filter(e => e.date !== today).slice(0, 14).forEach(day => {
          (day.items || []).forEach(f => {
            if (!f.name) return;
            const key = f.name.trim().toUpperCase();
            if (!recentMap[key]) recentMap[key] = { food: { name: f.name, cal: f.cal || 0, pro: f.pro || 0, carb: f.carb || 0, fat: f.fat || 0, brand: f.brand }, count: 0 };
            recentMap[key].count++;
            // Keep the most-recent macro snapshot
            recentMap[key].food = { name: f.name, cal: f.cal || 0, pro: f.pro || 0, carb: f.carb || 0, fat: f.fat || 0, brand: f.brand };
          });
        });
        const recentFoods = Object.values(recentMap).sort((a, b) => b.count - a.count).slice(0, 20).map(r => r.food);
        if (!recentFoods.length) return null;
        return (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:3, height:18, background:G.purple, boxShadow:`0 0 8px ${G.purple}88`, borderRadius:1 }}/>
              <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:3, color:G.purpleLight, textTransform:"uppercase" }}>RECENT FOODS</div>
              <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>→ {selMeal}</div>
            </div>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, WebkitOverflowScrolling:"touch" }}>
              {recentFoods.map((f, i) => (
                <div key={i} style={{ flexShrink:0, background:`${G.purple}0C`, border:`1px solid ${G.purple}30`, borderRadius:10, padding:"11px 12px", minWidth:130, maxWidth:160 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, color:"#fff", textTransform:"uppercase", marginBottom:2, lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                  {f.brand && <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textTransform:"uppercase" }}>{f.brand}</div>}
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1, textTransform:"uppercase", marginBottom:9 }}>{f.cal} kcal · P:{f.pro}g</div>
                  <button onClick={() => openFoodAdd(f)} style={{ width:"100%", background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, border:"none", borderRadius:6, padding:"6px 0", color:"#fff", fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>+ ADD</button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

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

      {view==="log" && pastFoodDays.length > 0 && (
        <div style={{ marginTop:8, marginBottom:14 }}>
          <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>PAST DAYS</div>
          {pastFoodDays.map(day => {
            const dayTotals = (day.items||[]).reduce((a,f)=>({cal:a.cal+(f.cal||0),pro:a.pro+(f.pro||0),carb:a.carb+(f.carb||0),fat:a.fat+(f.fat||0)}),{cal:0,pro:0,carb:0,fat:0});
            const isExpanded = expandedFoodDay === day.date;
            const label = (() => {
              const d = new Date(day.date + "T12:00:00");
              return d.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" }).toUpperCase();
            })();
            return (
              <div key={day.date} style={{ marginBottom:6 }}>
                <button onClick={()=>setExpandedFoodDay(isExpanded ? null : day.date)} style={{ width:"100%", background:"rgba(255,255,255,0.03)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left" }}>
                  <div>
                    <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:1.5, color:"#fff", textTransform:"uppercase" }}>{label}</div>
                    <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>
                      {day.items?.length||0} items · {dayTotals.cal} kcal · P:{dayTotals.pro}g
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontFamily:FONT.mono, fontSize:11, color:G.gold }}>{dayTotals.cal}</div>
                      <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1 }}>KCAL</div>
                    </div>
                    <div style={{ color:G.textDim, fontSize:12 }}>{isExpanded ? "▲" : "▼"}</div>
                  </div>
                </button>
                {isExpanded && (day.items||[]).length > 0 && (
                  <div style={{ marginTop:4, paddingLeft:8 }}>
                    {(day.items||[]).map((f,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", background:"rgba(255,255,255,0.02)", borderRadius:5, marginBottom:3, borderLeft:`2px solid ${G.borderB}` }}>
                        <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1, textTransform:"uppercase", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
                        <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, flexShrink:0, marginLeft:8 }}>{f.cal} cal · {f.meal}</div>
                      </div>
                    ))}
                    <div style={{ display:"flex", gap:12, padding:"8px 10px", background:`${G.purple}10`, borderRadius:5, marginTop:4 }}>
                      {[{l:"PROTEIN",v:dayTotals.pro,c:G.purpleLight},{l:"CARBS",v:dayTotals.carb,c:G.gold},{l:"FAT",v:dayTotals.fat,c:"#FF6B35"}].map(m=>(
                        <div key={m.l} style={{ flex:1, textAlign:"center" }}>
                          <div style={{ fontFamily:FONT.display, fontSize:14, color:m.c }}>{m.v}g</div>
                          <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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

    {/* ── FOOD SERVING PICKER SHEET ── */}
    {addingFood && (() => {
      const FRACS = [
        { label:"1/4",  val:0.25  },
        { label:"1/3",  val:0.333 },
        { label:"1/2",  val:0.5   },
        { label:"2/3",  val:0.667 },
        { label:"3/4",  val:0.75  },
        { label:"1",    val:1     },
        { label:"1 1/4",val:1.25  },
        { label:"1 1/2",val:1.5   },
        { label:"2",    val:2     },
        { label:"3",    val:3     },
      ];
      const frac = parseFloat(foodQty) || 1;
      const cnt  = Math.max(1, parseInt(foodCount) || 1);
      const q    = frac * cnt;
      const scaledCal  = Math.round((addingFood.cal  || 0) * q);
      const scaledPro  = Math.round((addingFood.pro  || 0) * q * 10) / 10;
      const scaledCarb = Math.round((addingFood.carb || 0) * q * 10) / 10;
      const scaledFat  = Math.round((addingFood.fat  || 0) * q * 10) / 10;
      return (
        <div style={{ position:"fixed", inset:0, zIndex:1100, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          {/* Backdrop — preventDefault on touchmove stops iOS Safari from scrolling the page behind */}
          <div onClick={()=>setAddingFood(null)} onTouchMove={e=>e.preventDefault()} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)" }}/>
          {/* Sheet panel — flex column so header + scrollable body + sticky button never overflow */}
          <div
            onTouchStart={e=>e.stopPropagation()}
            onTouchMove={e=>e.stopPropagation()}
            style={{ position:"relative", background:"#0F0E22", borderRadius:"18px 18px 0 0", border:`1px solid ${G.borderB}`, borderBottom:"none",
                     display:"flex", flexDirection:"column",
                     maxHeight:"80vh", overflow:"hidden" }}>

            {/* ── Sticky header (never scrolls) ── */}
            <div style={{ flexShrink:0, padding:"18px 18px 0" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:2, color:"#fff", textTransform:"uppercase", marginBottom:2 }}>{addingFood.name}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>Adding to {selMeal}</div>
                </div>
                <button onClick={()=>setAddingFood(null)} style={{ background:"none", border:"none", color:G.textDim, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div onTouchMove={e=>e.stopPropagation()} style={{ flex:1, overflowY:"auto", overflowX:"hidden", overscrollBehavior:"contain", WebkitOverflowScrolling:"touch", padding:"0 18px" }}>

              {/* QUANTITY row */}
              <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>QUANTITY</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <button onClick={()=>setFoodCount(c=>Math.max(1,c-1))} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${G.borderB}`, background:"rgba(0,0,0,0.4)", color:"#fff", fontSize:22, lineHeight:1, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>−</button>
                <div style={{ flex:1, display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
                  {[1,2,3,4,5,6,8,10].map(n => (
                    <button key={n} onClick={()=>setFoodCount(n)}
                      style={{ flexShrink:0, minWidth:38, padding:"7px 4px", borderRadius:8, border:`1px solid ${foodCount===n ? G.purpleLight : G.borderB}`, background: foodCount===n ? `${G.purple}30` : "rgba(0,0,0,0.3)", color: foodCount===n ? G.purpleLight : G.textMid, fontFamily:FONT.display, fontSize:15, letterSpacing:1, cursor:"pointer", textAlign:"center", boxShadow: foodCount===n ? `0 0 8px ${G.purple}55` : "none" }}>
                      {n}
                    </button>
                  ))}
                </div>
                <button onClick={()=>setFoodCount(c=>c+1)} style={{ width:36, height:36, borderRadius:8, border:`1px solid ${G.borderB}`, background:"rgba(0,0,0,0.4)", color:"#fff", fontSize:22, lineHeight:1, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>+</button>
              </div>

              {/* Unit toggle */}
              <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                {["serving","cup"].map(u => (
                  <button key={u} onClick={()=>setFoodUnit(u)} style={{ flex:1, padding:"7px 0", borderRadius:8, border:`1px solid ${foodUnit===u ? G.gold : G.borderB}`, background: foodUnit===u ? `${G.gold}18` : "transparent", color: foodUnit===u ? G.gold : G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>
                    {u === "cup" ? "🥄 CUP" : "📋 SERVING"}
                  </button>
                ))}
              </div>

              {/* Fraction chips */}
              <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginBottom:7 }}>
                {foodUnit === "cup" ? "CUP SIZE" : "SERVING SIZE"}
              </div>
              <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4, marginBottom:14 }}>
                {FRACS.map(f => {
                  const active = Math.abs(foodQty - f.val) < 0.001;
                  return (
                    <button key={f.label} onClick={()=>setFoodQty(f.val)}
                      style={{ flexShrink:0, minWidth:44, padding:"8px 7px", borderRadius:8, border:`1px solid ${active ? G.gold : G.borderB}`, background: active ? `${G.gold}22` : "rgba(0,0,0,0.3)", color: active ? G.gold : G.textMid, fontFamily:FONT.body, fontSize:13, letterSpacing:0.5, cursor:"pointer", textAlign:"center", boxShadow: active ? `0 0 8px ${G.gold}44` : "none", whiteSpace:"nowrap" }}>
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", flexShrink:0 }}>CUSTOM</div>
                <input
                  type="number" inputMode="decimal" min="0.1" step="0.1"
                  value={foodQty} onChange={e=>setFoodQty(parseFloat(e.target.value)||1)}
                  style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"6px 10px", color:"#fff", fontSize:14, fontFamily:FONT.body, letterSpacing:1, width:70, outline:"none", textAlign:"center" }}
                />
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1 }}>{foodUnit}{frac !== 1 ? "s" : ""}</div>
              </div>

              {/* Total summary line */}
              {(cnt > 1 || frac !== 1) && (
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, marginBottom:10, textAlign:"center" }}>
                  {cnt > 1 && frac !== 1 ? `${cnt} × ${frac} ${foodUnit} = ${Math.round(q*100)/100} ${foodUnit}s total` : cnt > 1 ? `${cnt} ${foodUnit}s total` : `${frac} ${foodUnit}`}
                </div>
              )}

              {/* Live macro preview */}
              <div style={{ background:`${G.gold}0C`, border:`1px solid ${G.gold}33`, borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:FONT.display, fontSize:18, color:G.gold, letterSpacing:1 }}>{scaledCal}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>CAL</div>
                </div>
                {[["P", scaledPro, G.purpleLight], ["C", scaledCarb, "#4DA6FF"], ["F", scaledFat, "#FF6B00"]].map(([lbl, val, col]) => (
                  <div key={lbl} style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:FONT.display, fontSize:16, color:col, letterSpacing:1 }}>{val}g</div>
                    <div style={{ fontFamily:FONT.body, fontSize:8, color:G.textDim, letterSpacing:1.5, textTransform:"uppercase" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>{/* end scrollable body */}

            {/* ── Sticky ADD button (never scrolls) ── */}
            <div style={{ flexShrink:0, padding:`12px 18px calc(env(safe-area-inset-bottom,0px) + 100px)`, background:"#0F0E22" }}>
              <button onClick={confirmFoodAdd} style={{ width:"100%", padding:"14px 0", borderRadius:10, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, border:"none", color:"#0A0810", fontFamily:FONT.display, fontSize:15, letterSpacing:3, cursor:"pointer", textTransform:"uppercase", fontWeight:700 }}>
                ADD TO {selMeal} ◆
              </button>
            </div>
          </div>
        </div>
      );
    })()}
    </>
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

function timeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins}M AGO`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}D AGO`;
  return new Date(ts).toLocaleDateString("en-US", { month:"short", day:"numeric" }).toUpperCase();
}

function FollowListModal({ userId, mode, onClose, onViewProfile }) {
  useScrollLock();
  const [users, setUsers] = useState(null);
  const [loadErr, setLoadErr] = useState(false);

  const load = async () => {
    setUsers(null); setLoadErr(false);
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000));
      const col = mode === "following" ? "following_id" : "follower_id";
      const filter = mode === "following" ? "follower_id" : "following_id";
      const { data: rows } = await Promise.race([
        supabase.from("follows").select(col).eq(filter, userId),
        timeout,
      ]);
      if (!rows?.length) { setUsers([]); return; }
      const ids = rows.map(r => r[col]);
      const { data: profs } = await supabase.from("profiles")
        .select("id, username, avatar_initials, avatar_url, points, sessions_count, streak")
        .in("id", ids);
      setUsers(profs || []);
    } catch {
      setLoadErr(true);
    }
  };

  useEffect(() => { load(); }, [userId, mode]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  const P = G.purple;
  const title = mode === "following" ? "FOLLOWING" : "FOLLOWERS";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.98)", zIndex:800, overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 32px)" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"calc(env(safe-area-inset-top,0px) + 16px) 18px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <button onClick={onClose} aria-label="Go back" style={{ background:"none", border:"none", color:G.textMid, fontSize:22, cursor:"pointer", padding:"8px 8px 8px 0", lineHeight:1, flexShrink:0, minHeight:44, display:"flex", alignItems:"center" }}>←</button>
          <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>
            {title} {users !== null && <span style={{ color:P }}>({users.length})</span>}
          </div>
        </div>

        {users === null && !loadErr && <div style={{ textAlign:"center", padding:"48px 0", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2 }}>LOADING...</div>}
        {loadErr && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textDim, letterSpacing:1, marginBottom:16 }}>Failed to load — check connection</div>
            <button onClick={load} style={{ background:`${G.purple}33`, border:`1px solid ${G.purple}`, borderRadius:8, padding:"10px 24px", color:"#fff", fontFamily:FONT.display, fontSize:12, letterSpacing:2, cursor:"pointer" }}>RETRY</button>
          </div>
        )}

        {users?.length === 0 && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:44, marginBottom:14 }}>{mode === "following" ? "👥" : "📣"}</div>
            <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:8 }}>
              {mode === "following" ? "NOT FOLLOWING ANYONE" : "NO FOLLOWERS YET"}
            </div>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textDim, letterSpacing:1, lineHeight:1.6 }}>
              {mode === "following" ? "Search for athletes to follow on the Squad tab." : "Share your fitness journey to gain followers."}
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {users?.map(u => (
            <div key={u.id} onClick={() => onViewProfile(u)} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(20,18,40,0.95)", border:`1px solid ${G.borderB}`, borderRadius:12, padding:"12px 14px", cursor:"pointer" }}>
              <AvatarBadge initials={u.avatar_initials || "?"} url={u.avatar_url} size={46}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.username || "ANONYMOUS"}</div>
                <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, marginTop:2 }}>
                  {(u.points || 0).toLocaleString()} pts · {u.sessions_count || 0} sessions · {u.streak || 0}d streak
                </div>
              </div>
              <span style={{ color:G.textDim, fontSize:16 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserSearchModal({ userId, followingIds, onFollowChange, onViewProfile, onClose }) {
  useScrollLock();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [localFollowing, setLocalFollowing] = useState(new Set(followingIds));

  useEffect(() => { setTimeout(() => { setLocalFollowing(new Set(followingIds)); }, 0); }, [followingIds]);

  useEffect(() => {
    if (!query.trim()) { setTimeout(() => setResults([]), 0); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase.from("profiles")
        .select("id, username, avatar_initials, avatar_url, location, points, sessions_count, streak")
        .ilike("username", `%${query.trim()}%`)
        .neq("id", userId)
        .limit(20);
      setResults(data || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query, userId]);

  const toggleFollow = async (u, e) => {
    e.stopPropagation();
    const isF = localFollowing.has(u.id);
    setLocalFollowing(p => { const n = new Set(p); isF ? n.delete(u.id) : n.add(u.id); return n; });
    if (isF) {
      await supabase.from("follows").delete().eq("follower_id", userId).eq("following_id", u.id);
    } else {
      await supabase.from("follows").insert({ follower_id: userId, following_id: u.id });
    }
    onFollowChange();
  };

  const P = G.purple;
  const hasQuery = query.trim().length > 0;

  let statusMsg = "";
  if (hasQuery && !searching) {
    statusMsg = results.length === 0 ? "No athletes found" : `${results.length} athlete${results.length === 1 ? "" : "s"} found`;
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Search athletes" style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.98)", zIndex:790, overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 32px)" }}>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"calc(env(safe-area-inset-top,0px) + 16px) 18px 0" }}>

        {/* Search bar */}
        <div role="search" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button onClick={onClose} aria-label="Go back" style={{ background:"none", border:"none", color:G.textMid, fontSize:22, cursor:"pointer", padding:"8px 8px 8px 0", lineHeight:1, flexShrink:0, minWidth:36, minHeight:44, display:"flex", alignItems:"center", justifyContent:"flex-start" }}>←</button>
          <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center" }}>
            <span aria-hidden="true" style={{ position:"absolute", left:13, fontSize:16, color:G.textDim, pointerEvents:"none", lineHeight:1 }}>🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search athletes..."
              autoFocus
              inputMode="search"
              aria-label="Search athletes by username"
              aria-controls="search-results"
              style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:`1px solid ${hasQuery ? P : G.borderB}`, borderRadius:10, padding:"11px 40px 11px 40px", color:"#fff", fontSize:15, outline:"none", fontFamily:FONT.body, letterSpacing:1, boxSizing:"border-box", transition:"border-color 0.2s" }}
            />
            {hasQuery && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                style={{ position:"absolute", right:10, background:"none", border:"none", color:G.textMid, fontSize:18, cursor:"pointer", padding:"6px", lineHeight:1, display:"flex", alignItems:"center", justifyContent:"center", minWidth:32, minHeight:32 }}
              >✕</button>
            )}
          </div>
        </div>

        {/* Screen-reader live region */}
        <div aria-live="polite" aria-atomic="true" style={{ position:"absolute", width:1, height:1, overflow:"hidden", clip:"rect(0,0,0,0)", whiteSpace:"nowrap" }}>
          {statusMsg}
        </div>

        {!hasQuery && (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:42, marginBottom:14 }}>🔍</div>
            <div style={{ fontFamily:FONT.display, fontSize:18, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:8 }}>FIND YOUR <span style={{ color:P }}>SQUAD</span></div>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textDim, letterSpacing:1, lineHeight:1.6 }}>Search by username to find and follow athletes</div>
          </div>
        )}

        {searching && <div role="status" aria-label="Searching" style={{ textAlign:"center", padding:"32px 0", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2 }}>SEARCHING...</div>}
        {!searching && hasQuery && results.length === 0 && <div style={{ textAlign:"center", padding:"32px 0", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2 }}>NO ATHLETES FOUND</div>}

        <div id="search-results" role="list" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {results.map(u => {
            const isF = localFollowing.has(u.id);
            return (
              <div
                key={u.id}
                role="listitem"
                onClick={() => onViewProfile(u)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onViewProfile(u); } }}
                tabIndex={0}
                aria-label={`View profile of ${u.username || "Anonymous"}`}
                style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(20,18,40,0.95)", border:`1px solid ${G.borderB}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", outline:"none" }}
              >
                <AvatarBadge initials={u.avatar_initials || "?"} url={u.avatar_url} size={46}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.username || "ANONYMOUS"}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1, marginTop:2 }}>
                    {u.location ? `📍 ${u.location}  ·  ` : ""}{(u.points || 0).toLocaleString()} pts  ·  {u.sessions_count || 0} sessions
                  </div>
                </div>
                <button
                  onClick={e => toggleFollow(u, e)}
                  aria-label={isF ? `Unfollow ${u.username}` : `Follow ${u.username}`}
                  aria-pressed={isF}
                  style={{ flexShrink:0, padding:"9px 16px", borderRadius:20, border:`1px solid ${isF ? G.borderB : P}`, background: isF ? "transparent" : `${P}22`, color: isF ? G.textMid : P, fontFamily:FONT.display, fontSize:10, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", whiteSpace:"nowrap", minHeight:40 }}
                >{isF ? "✓ FOLLOWING" : "FOLLOW +"}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeedScreen({ showToast, profile, sessions = [], userId, sharedSession, onClearSharedSession }) {
  const [feedTab, setFeedTab] = useState("following");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(new Set());
  const [followingIds, setFollowingIds] = useState(new Set());
  const [showCompose, setShowCompose] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [openComments, setOpenComments] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [viewingProfile, setViewingProfile] = useState(null);
  const [newTxt, setNewTxt] = useState("");
  const [newType, setNewType] = useState("post");
  const [newTag, setNewTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [challenges, setChallenges] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sfc_challenges") || "[]"); } catch { return []; }
  });
  const [newChalType, setNewChalType] = useState("pr");
  const [newChalExercise, setNewChalExercise] = useState("");
  const [newChalTarget, setNewChalTarget] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const postImgUrlRef = useRef(null);
  const postFileInputRef = useRef(null);

  useEffect(() => { return () => { if (postImgUrlRef.current) URL.revokeObjectURL(postImgUrlRef.current); }; }, []);

  useEffect(() => {
    if (sharedSession) {
      setTimeout(() => {
        setNewTxt(sharedSession);
        setShowCompose(true);
        onClearSharedSession?.();
      }, 0);
    }
  }, [sharedSession]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { localStorage.setItem("sfc_challenges", JSON.stringify(challenges)); }, [challenges]);

  const loadPosts = async (tab, followSet) => {
    setLoading(true);
    try {
      const fSet = followSet !== undefined ? followSet : followingIds;
      let query = supabase.from("posts")
        .select("*, profiles!posts_user_id_fkey(username, avatar_initials, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(60);
      if (tab === "following") {
        const ids = [...fSet, userId].filter(Boolean);
        if (ids.length > 0) query = query.in("user_id", ids);
      }
      const { data } = await query;
      setPosts(data || []);
      if (userId) {
        const { data: likes } = await supabase.from("post_likes").select("post_id").eq("user_id", userId);
        setLikedIds(new Set(likes?.map(l => l.post_id) || []));
      }
    } catch {
      // network error — keep stale posts visible
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      let ids = new Set();
      if (userId) {
        const { data } = await supabase.from("follows").select("following_id").eq("follower_id", userId);
        ids = new Set(data?.map(f => f.following_id) || []);
        setFollowingIds(ids);
      }
      await loadPosts("following", ids);
    }
    init();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const feedTabMounted = useRef(false);
  useEffect(() => {
    if (!feedTabMounted.current) { feedTabMounted.current = true; return; }
    loadPosts(feedTab);
  }, [feedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const incomplete = challenges.filter(ch => !ch.completed);
    if (!incomplete.length || !userId) return;
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
    setTimeout(async () => {
      setChallenges(updated);
      for (const ch of completions) {
        const txt = ch.type === "pr"
          ? `Challenge complete! Hit a ${ch.target}lb ${ch.exercise} 1RM. 🏆`
          : ch.type === "vol"
          ? `Challenge complete! Moved ${Number(ch.target).toLocaleString()}lbs of volume in 7 days. 💪`
          : `Challenge complete! Logged ${ch.target} sessions in 7 days. 🔥`;
        await supabase.from("posts").insert({ user_id: userId, type: "milestone", txt, tag: "CHALLENGE COMPLETE", likes: 0, comment_count: 0 });
      }
      await loadPosts(feedTab);
      completions.forEach(() => showToast("🏆 CHALLENGE COMPLETE!"));
    }, 0);
  }, [sessions]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLike = async (post) => {
    if (!userId) return;
    const liked = likedIds.has(post.id);
    setLikedIds(p => { const n = new Set(p); liked ? n.delete(post.id) : n.add(post.id); return n; });
    setPosts(p => p.map(x => x.id === post.id ? { ...x, likes: (x.likes || 0) + (liked ? -1 : 1) } : x));
    if (liked) {
      await supabase.from("post_likes").delete().eq("post_id", post.id).eq("user_id", userId);
      await supabase.from("posts").update({ likes: Math.max(0, (post.likes || 0) - 1) }).eq("id", post.id);
    } else {
      await supabase.from("post_likes").upsert({ post_id: post.id, user_id: userId });
      await supabase.from("posts").update({ likes: (post.likes || 0) + 1 }).eq("id", post.id);
    }
  };

  const loadComments = async (postId) => {
    setLoadingComments(p => ({ ...p, [postId]: true }));
    const { data } = await supabase.from("post_comments")
      .select("*, profiles!post_comments_user_id_fkey(username, avatar_initials, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setPostComments(p => ({ ...p, [postId]: data || [] }));
    setLoadingComments(p => ({ ...p, [postId]: false }));
  };

  const toggleComments = async (postId) => {
    if (openComments === postId) { setOpenComments(null); return; }
    setOpenComments(postId);
    if (!postComments[postId]) await loadComments(postId);
  };

  const submitComment = async (postId) => {
    const txt = (commentTexts[postId] || "").trim();
    if (!txt || !userId) return;
    const currentCount = posts.find(p => p.id === postId)?.comment_count || 0;
    const { data, error: commentErr } = await supabase.from("post_comments")
      .insert({ post_id: postId, user_id: userId, txt })
      .select("*, profiles!post_comments_user_id_fkey(username, avatar_initials, avatar_url)")
      .single();
    if (commentErr) {
      showToast("❌ COMMENT FAILED — TRY AGAIN");
      return;
    }
    setCommentTexts(p => ({ ...p, [postId]: "" }));
    if (data) {
      setPostComments(p => ({ ...p, [postId]: [...(p[postId] || []), data] }));
      setPosts(p => p.map(x => x.id === postId ? { ...x, comment_count: (x.comment_count || 0) + 1 } : x));
      await supabase.from("posts").update({ comment_count: currentCount + 1 }).eq("id", postId);
    }
  };

  const submitPost = async () => {
    if ((!newTxt.trim() && !postImage) || !userId || submitting) return;
    setSubmitting(true);
    let image_url = null;
    if (postImage) {
      try {
        const b64 = await compressImage(postImage);
        const base64Data = b64.split(",")[1];
        const byteChars = atob(base64Data);
        const byteArr = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
        const blob = new Blob([byteArr], { type: "image/jpeg" });
        const path = `${userId}/${crypto.randomUUID()}.jpg`;
        const { error: upErr } = await supabase.storage.from("post-images").upload(path, blob, { contentType: "image/jpeg", upsert: false });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(path);
          image_url = urlData.publicUrl;
        }
      } catch { /* upload failed — post without image */ }
    }
    const tag = (newType !== "post" && newTag.trim()) ? newTag.trim().toUpperCase() : null;
    const insertData = { user_id: userId, type: newType, txt: newTxt.trim() || null, tag, likes: 0, comment_count: 0 };
    if (image_url) insertData.image_url = image_url;
    const { error: postErr } = await supabase.from("posts").insert(insertData);
    if (postErr) {
      // If image_url column missing, retry without it
      if (postErr.code === "42703" && image_url) {
        delete insertData.image_url;
        const { error: retryErr } = await supabase.from("posts").insert(insertData);
        if (!retryErr) {
          showToast("🔥 POST SHARED WITH THE SQUAD!");
          setNewTxt(""); setNewTag(""); setNewType("post"); setShowCompose(false); setSubmitting(false);
          clearImage();
          loadPosts(feedTab);
          return;
        }
      }
      showToast("❌ POST FAILED — CHECK YOUR CONNECTION AND TRY AGAIN");
      setSubmitting(false);
      return;
    }
    showToast("🔥 POST SHARED WITH THE SQUAD!");
    setNewTxt(""); setNewTag(""); setNewType("post"); setShowCompose(false); setSubmitting(false);
    clearImage();
    loadPosts(feedTab);
  };

  const submitChallenge = async () => {
    const target = parseFloat(newChalTarget);
    if (!target || target <= 0) return showToast("Enter a valid target");
    if (newChalType === "pr" && !newChalExercise.trim()) return showToast("Enter an exercise name");
    if (!userId) return;
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
    const tag = newChalType === "pr" ? `${newChalExercise.trim().toUpperCase()} PR CHALLENGE` : newChalType === "vol" ? "VOLUME CHALLENGE" : "SESSION CHALLENGE";
    const { data } = await supabase.from("posts")
      .insert({ user_id: userId, type: "challenge", txt, tag, likes: 0, comment_count: 0 })
      .select("*, profiles!posts_user_id_fkey(username, avatar_initials, avatar_url)")
      .single();
    if (data) setPosts(p => [data, ...p]);
    setNewChalExercise(""); setNewChalTarget(""); setNewChalType("pr"); setShowCompose(false);
    showToast("⚔️ CHALLENGE LAUNCHED!");
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (postImgUrlRef.current) URL.revokeObjectURL(postImgUrlRef.current);
    const url = URL.createObjectURL(file);
    postImgUrlRef.current = url;
    setPostImage(file);
    setPostImagePreview(url);
    e.target.value = "";
  };

  const clearImage = () => {
    if (postImgUrlRef.current) URL.revokeObjectURL(postImgUrlRef.current);
    postImgUrlRef.current = null;
    setPostImage(null);
    setPostImagePreview(null);
  };

  const onFollowChange = async () => {
    if (!userId) return;
    const { data } = await supabase.from("follows").select("following_id").eq("follower_id", userId);
    const newIds = new Set(data?.map(f => f.following_id) || []);
    setFollowingIds(newIds);
    await loadPosts(feedTab, newIds);
  };

  const typeConfig = {
    pr:        { color: G.gold,        ico: "🏆", label: "PR ALERT" },
    milestone: { color: G.purpleLight, ico: "⭐", label: "MILESTONE" },
    post:      { color: G.textMid,     ico: null, label: null },
    challenge: { color: "#00D4FF",     ico: "⚔️", label: "CHALLENGE" },
    workout:   { color: G.purple,      ico: "💪", label: "WORKOUT" },
    template:  { color: "#4ADE80",     ico: "📋", label: "TEMPLATE" },
  };

  const inp = { background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"11px 14px", color:"#fff", fontSize:14, outline:"none", fontFamily:FONT.body, letterSpacing:0.5, width:"100%", boxSizing:"border-box" };
  const P = G.purple;

  return (
    <div style={{ padding:"calc(env(safe-area-inset-top, 0px) + 20px) 0 0" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 18px", marginBottom:4 }}>
        <div>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:"#fff", textTransform:"uppercase", lineHeight:1 }}>
            SQUAD <span style={{ color:P, textShadow:`0 0 12px ${P}` }}>FEED</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:P }}/>
            <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Strength in Community</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => setShowSearch(true)} style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.06)", border:`1px solid ${G.borderB}`, color:G.textMid, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>🔍</button>
          <button onClick={() => setShowCompose(true)} style={{ padding:"8px 16px", borderRadius:20, background:`linear-gradient(135deg,${P},${G.purpleBright})`, border:"none", color:"#fff", fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", boxShadow:G.purpleGlow, whiteSpace:"nowrap" }}>+ POST</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, padding:"12px 18px", borderBottom:`1px solid ${G.borderB}` }}>
        {[{id:"following",l:"FOLLOWING"},{id:"discover",l:"DISCOVER"}].map(t => (
          <button key={t.id} onClick={() => setFeedTab(t.id)} style={{ flex:1, padding:"9px 4px", borderRadius:20, border:`1px solid ${feedTab===t.id ? P : G.borderB}`, background: feedTab===t.id ? `linear-gradient(135deg,${P},${G.purpleBright})` : "transparent", color: feedTab===t.id ? "#fff" : G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase", boxShadow: feedTab===t.id ? G.purpleGlow : "none" }}>{t.l}</button>
        ))}
      </div>

      {/* Feed */}
      <div>
        {loading && <div style={{ textAlign:"center", padding:"48px 0", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2 }}>LOADING FEED...</div>}

        {!loading && feedTab === "following" && posts.length === 0 && (
          <div style={{ padding:"40px 24px", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>👥</div>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:10 }}>FIND YOUR <span style={{ color:P }}>SQUAD</span></div>
            <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:0.5, lineHeight:1.7, marginBottom:24 }}>Follow other athletes to see their posts, PRs, and milestones right here.</div>
            <button onClick={() => setShowSearch(true)} style={{ padding:"13px 28px", borderRadius:24, background:`linear-gradient(135deg,${P},${G.purpleBright})`, border:"none", color:"#fff", fontFamily:FONT.display, fontSize:12, letterSpacing:2, cursor:"pointer", boxShadow:G.purpleGlow }}>🔍 SEARCH ATHLETES</button>
          </div>
        )}

        {!loading && feedTab === "discover" && posts.length === 0 && (
          <div style={{ padding:"48px 24px", textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📢</div>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:10 }}>NO POSTS YET</div>
            <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:0.5, lineHeight:1.7 }}>Be the first to share a win with the community.</div>
          </div>
        )}

        {!loading && posts.map(post => {
          const tc = typeConfig[post.type] || typeConfig.post;
          const isLiked = likedIds.has(post.id);
          const isOwn = post.user_id === userId;
          const comments = postComments[post.id] || [];
          const isCommentsOpen = openComments === post.id;
          const authorName = post.profiles?.username || "ATHLETE";
          const authorAv = post.profiles?.avatar_initials || "?";
          const authorUrl = post.profiles?.avatar_url || null;

          return (
            <div key={post.id} style={{ background:"rgba(14,12,28,0.9)", borderBottom:`1px solid rgba(255,255,255,0.06)` }}>

              {/* Post header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 16px 10px" }}>
                <div onClick={() => !isOwn && setViewingProfile({ id: post.user_id, av: authorAv, url: authorUrl, name: authorName, rank: null })} style={{ cursor: isOwn ? "default" : "pointer", flexShrink:0 }}>
                  <AvatarBadge initials={authorAv} url={authorUrl} size={40} gold={isOwn}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:1.5, color: isOwn ? P : "#fff", textTransform:"uppercase", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{authorName}{isOwn ? " (YOU)" : ""}</div>
                  <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:0.5, marginTop:1 }}>{timeAgo(post.created_at)}</div>
                </div>
                {tc.label && (
                  <div style={{ display:"flex", alignItems:"center", gap:4, background:`${tc.color}18`, border:`1px solid ${tc.color}44`, borderRadius:14, padding:"3px 10px", flexShrink:0 }}>
                    {tc.ico && <span style={{ fontSize:11 }}>{tc.ico}</span>}
                    <span style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, color:tc.color }}>{tc.label}</span>
                  </div>
                )}
              </div>

              {/* Tag */}
              {post.tag && (
                <div style={{ margin:"0 16px 10px", background:`${G.gold}12`, border:`1px solid ${G.gold}33`, borderRadius:6, padding:"6px 11px", display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:3, height:14, background:G.gold, boxShadow:G.goldGlow2, borderRadius:1, flexShrink:0 }}/>
                  <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>{post.tag}</div>
                </div>
              )}

              {/* Template card */}
              {post.type === "template" && (() => {
                let tmplData = null;
                try { tmplData = JSON.parse(post.txt); } catch {}
                if (!tmplData) return null;
                const exNames = (tmplData.exs || []).map(e => e.name || e).filter(Boolean);
                const importTemplate = () => {
                  try {
                    const existing = JSON.parse(localStorage.getItem("sfc_templates") || "[]");
                    const newTmpl = { id: Date.now().toString(), name: tmplData.name, exs: tmplData.exs || [], tag: tmplData.tag || null };
                    localStorage.setItem("sfc_templates", JSON.stringify([newTmpl, ...existing]));
                    showToast(`📥 "${tmplData.name}" imported to your templates!`);
                  } catch { showToast("Failed to import template"); }
                };
                return (
                  <div style={{ margin:"0 16px 14px", background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:"#4ADE80", marginBottom:6, textTransform:"uppercase" }}>{tmplData.name}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
                      {exNames.slice(0, 6).map((n, i) => (
                        <div key={i} style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, background:"rgba(255,255,255,0.06)", borderRadius:4, padding:"2px 8px", letterSpacing:1, textTransform:"uppercase" }}>{n}</div>
                      ))}
                      {exNames.length > 6 && <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, padding:"2px 4px", letterSpacing:1 }}>+{exNames.length - 6} more</div>}
                    </div>
                    <button onClick={importTemplate} style={{ background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.35)", borderRadius:7, padding:"7px 14px", color:"#4ADE80", fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>📥 IMPORT TO MY TEMPLATES</button>
                  </div>
                );
              })()}

              {/* Text (non-template posts only) */}
              {post.type !== "template" && post.txt && <div style={{ padding:"0 16px 14px", fontFamily:FONT.body, fontSize:14, color:G.text, lineHeight:1.65, letterSpacing:0.3 }}>{post.txt}</div>}

              {/* Image */}
              {post.image_url && (
                <img src={post.image_url} alt="" style={{ width:"100%", maxHeight:420, objectFit:"cover", display:"block", marginBottom:0 }} loading="lazy"/>
              )}

              {/* Divider */}
              <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"0 16px" }}/>

              {/* Actions */}
              <div style={{ display:"flex", padding:"4px 6px" }}>
                <button onClick={() => toggleLike(post)} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 13px", background:"none", border:"none", cursor:"pointer", borderRadius:8 }}>
                  <span style={{ fontSize:20 }}>{isLiked ? "❤️" : "🤍"}</span>
                  <span style={{ fontFamily:FONT.body, fontSize:13, color: isLiked ? "#E0245E" : G.textMid, letterSpacing:0.5 }}>{post.likes || 0}</span>
                </button>
                <button onClick={() => toggleComments(post.id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 13px", background:"none", border:"none", cursor:"pointer", borderRadius:8 }}>
                  <span style={{ fontSize:20 }}>💬</span>
                  <span style={{ fontFamily:FONT.body, fontSize:13, color: isCommentsOpen ? P : G.textMid, letterSpacing:0.5 }}>{post.comment_count || 0}</span>
                </button>
              </div>

              {/* Comments */}
              {isCommentsOpen && (
                <div style={{ borderTop:`1px solid ${G.borderB}`, padding:"13px 16px 14px", background:"rgba(0,0,0,0.2)" }}>
                  {loadingComments[post.id] && <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textDim, letterSpacing:1.5, marginBottom:10 }}>LOADING...</div>}
                  {comments.map((c, i) => (
                    <div key={c.id || i} style={{ display:"flex", gap:9, marginBottom:10, alignItems:"flex-start" }}>
                      <AvatarBadge initials={c.profiles?.avatar_initials || "?"} url={c.profiles?.avatar_url} size={28}/>
                      <div style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"7px 12px" }}>
                        <div style={{ fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, color:G.gold, marginBottom:2 }}>
                          {c.profiles?.username || "ATHLETE"} <span style={{ color:G.textDim, fontSize:9, fontFamily:FONT.body, letterSpacing:0.5 }}>· {timeAgo(c.created_at)}</span>
                        </div>
                        <div style={{ fontFamily:FONT.body, fontSize:13, color:G.text, letterSpacing:0.3, lineHeight:1.5 }}>{c.txt}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:6 }}>
                    <AvatarBadge initials={profile?.avatar_initials || "ME"} url={profile?.avatar_url} size={28}/>
                    <input
                      value={commentTexts[post.id] || ""}
                      onChange={e => setCommentTexts(p => ({ ...p, [post.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") submitComment(post.id); }}
                      placeholder="Add a comment..."
                      style={{ flex:1, background:"rgba(255,255,255,0.06)", border:`1px solid ${G.borderB}`, borderRadius:20, padding:"8px 14px", color:"#fff", fontSize:13, outline:"none", fontFamily:FONT.body, letterSpacing:0.3 }}
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      style={{ width:34, height:34, borderRadius:"50%", background:(commentTexts[post.id]||"").trim() ? `linear-gradient(135deg,${P},${G.purpleBright})` : "rgba(255,255,255,0.06)", border:"none", color:(commentTexts[post.id]||"").trim() ? "#fff" : G.textDim, cursor:(commentTexts[post.id]||"").trim() ? "pointer" : "default", fontSize:15, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}
                    >↑</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compose sheet */}
      {showCompose && (
        <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.95)", zIndex:300, display:"flex", alignItems:"flex-end" }} onClick={() => { setShowCompose(false); clearImage(); }}>
          <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"16px 16px 0 0", padding:"20px 18px 0", border:`1px solid ${G.border}`, borderBottom:"none", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 100px)", overflowY:"auto", maxHeight:"80vh" }}>
            <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"0 auto 18px" }}/>
            <div style={{ fontFamily:FONT.display, fontSize:20, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:16 }}>SHARE WITH THE SQUAD</div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
              {[{id:"post",l:"📢 POST"},{id:"pr",l:"🏆 PR"},{id:"milestone",l:"⭐ MILESTONE"},{id:"challenge",l:"⚔️ CHALLENGE"}].map(t => (
                <button key={t.id} onClick={() => setNewType(t.id)} style={{ flex:"1 1 calc(50% - 3px)", padding:"9px 4px", borderRadius:8, border:`1px solid ${newType===t.id ? P : G.borderB}`, background: newType===t.id ? `${P}22` : "transparent", color: newType===t.id ? P : G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1.5, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
              ))}
            </div>

            {newType === "challenge" ? (
              <div>
                <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>CHALLENGE TYPE</div>
                <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                  {[{id:"pr",l:"🏋️ PR"},{id:"vol",l:"📦 VOLUME"},{id:"sessions",l:"📅 SESSIONS"}].map(t => (
                    <button key={t.id} onClick={() => setNewChalType(t.id)} style={{ flex:1, padding:"8px 4px", borderRadius:8, border:`1px solid ${newChalType===t.id?"#00D4FF":G.borderB}`, background:newChalType===t.id?"rgba(0,212,255,0.12)":"transparent", color:newChalType===t.id?"#00D4FF":G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>{t.l}</button>
                  ))}
                </div>
                {newChalType === "pr" && (
                  <input value={newChalExercise} onChange={e => setNewChalExercise(e.target.value)} placeholder="Exercise (e.g. Barbell Bench Press)" style={{ ...inp, marginBottom:10 }}/>
                )}
                <input type="number" inputMode="decimal" value={newChalTarget} onChange={e => setNewChalTarget(e.target.value)} placeholder={newChalType==="pr" ? "Target 1RM (lbs)" : newChalType==="vol" ? "Target volume (lbs)" : "Target sessions"} style={{ ...inp, marginBottom:14 }}/>
                <NeonBtn onClick={submitChallenge} full>LAUNCH CHALLENGE ◆</NeonBtn>
              </div>
            ) : (
              <>
                {newType !== "post" && (
                  <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder={newType==="pr" ? "e.g. 315lb Deadlift PR" : "e.g. 100 Sessions"} style={{ ...inp, marginBottom:10 }}/>
                )}
                <textarea
                  value={newTxt}
                  onChange={e => setNewTxt(e.target.value)}
                  placeholder={newType==="pr" ? "What's the PR? How did it feel?" : newType==="milestone" ? "Share your milestone..." : newType==="post" ? "What's on your mind? (or just add a photo)" : "What's on your mind?"}
                  rows={4}
                  style={{ ...inp, resize:"none", lineHeight:1.6, marginBottom:12 }}
                />
                {/* Image picker */}
                <input type="file" accept="image/*" ref={postFileInputRef} onChange={handleImagePick} style={{ display:"none" }}/>
                <div style={{ marginBottom:14 }}>
                  {postImagePreview ? (
                    <div style={{ position:"relative" }}>
                      <img src={postImagePreview} alt="preview" style={{ width:"100%", borderRadius:10, maxHeight:220, objectFit:"cover", display:"block" }}/>
                      <button onClick={clearImage} style={{ position:"absolute", top:8, right:8, width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,0.75)", border:"none", color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => postFileInputRef.current?.click()} style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px dashed ${G.borderB}`, background:"transparent", color:G.textMid, fontFamily:FONT.display, fontSize:11, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>📷 ADD PHOTO</button>
                  )}
                </div>
                <NeonBtn onClick={submitPost} full disabled={submitting || (!newTxt.trim() && !postImage)}>{submitting ? "POSTING..." : "SHARE WITH SQUAD ◆"}</NeonBtn>
              </>
            )}
          </div>
        </div>
      )}

      {showSearch && (
        <UserSearchModal
          userId={userId}
          followingIds={followingIds}
          onFollowChange={onFollowChange}
          onViewProfile={u => { setShowSearch(false); setViewingProfile({ id: u.id, av: u.avatar_initials || "?", url: u.avatar_url || null, name: u.username || "ATHLETE", rank: null }); }}
          onClose={() => setShowSearch(false)}
        />
      )}

      {viewingProfile && (
        <UserProfileModal
          user={viewingProfile}
          currentUserId={userId}
          onClose={() => setViewingProfile(null)}
        />
      )}
    </div>
  );
}


function AiCoachModal({ profile, sessions, muscleScores, onClose }) {
  useScrollLock();
  const [state, setState] = useState("idle"); // idle | loading | result | error
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const buildLocalCoaching = () => {
    const name = profile?.username || "ATHLETE";
    const streak = profile?.streak || 0;
    const totalSessions = profile?.sessions_count || sessions.length || 0;
    const recent = sessions.slice(0, 7);
    const age = profile?.age || null;
    const sex = profile?.sex || null;

    // Determine most and least trained muscles
    const sorted = Object.entries(muscleScores || {}).sort(([,a],[,b]) => b - a);
    const topMuscle = sorted[0]?.[0] || null;

    // Figure out what was trained most recently
    const lastSession = recent[0];
    const daysSinceLast = lastSession
      ? Math.floor((Date.now() - new Date(lastSession.createdAt || lastSession.date).getTime()) / 86400000)
      : 99;

    // Pick today's focus based on muscle fatigue
    const muscleToFocusLabel = {
      chest:"CHEST & TRIS", lat:"BACK & LATS", mid_back:"BACK & ROWS",
      lower_back:"LOWER BACK", quad:"LEGS & QUADS", hamstring:"HAMSTRINGS & GLUTES",
      glute:"GLUTES & HIPS", deltoid:"SHOULDERS", front_delt:"FRONT DELTS",
      mid_delt:"SIDE DELTS", rear_delt:"REAR DELTS", bicep:"BICEPS & ARMS",
      tricep:"TRICEPS & ARMS", trap:"TRAPS & UPPER BACK", ab:"CORE & ABS",
      upper_abs:"CORE & ABS", lower_abs:"CORE & ABS", oblique:"CORE & ABS",
      hip_flexor:"HIPS & CORE", calf:"LOWER LEGS", forearm:"FOREARMS",
    };
    const muscleDisplayName = { ...MUSCLE_LABELS };
    let todayFocus = "FULL BODY";
    if (sorted.length > 0) {
      // Train the least-worked muscle group
      const target = sorted[sorted.length - 1]?.[0];
      todayFocus = muscleToFocusLabel[target] || "FULL BODY";
    }
    if (daysSinceLast === 0) todayFocus = "ACTIVE RECOVERY";

    // Greeting
    let greeting = `Welcome back, ${name}! `;
    if (streak >= 7) greeting += `You're on a 🔥 ${streak}-day streak — that's elite consistency. Keep the chain going!`;
    else if (streak >= 3) greeting += `${streak} days strong and building momentum. Your body is adapting — trust the process.`;
    else if (totalSessions === 0) greeting += `Every legend started somewhere. Log your first session and let's build something great together.`;
    else if (daysSinceLast >= 3) greeting += `It's been ${daysSinceLast} days since your last session. Time to get back at it — your muscles are recovered and ready.`;
    else greeting += `Great work staying consistent. You've put in ${totalSessions} sessions and the results will show.`;

    // Workout recommendation
    const workoutRec = (() => {
      if (daysSinceLast === 0) return { type:"recovery", icon:"🧘", title:"REST DAY PROTOCOL", text:"You already trained today — prioritize sleep and light movement. A 20-min walk or stretch session is perfect." };
      if (topMuscle && (muscleScores[topMuscle] || 0) > 75) return { type:"workout", icon:"🏋️", title:"SMART ROTATION", text:`Your ${muscleDisplayName[topMuscle] || topMuscle} score is high — avoid training it again today. Focus on ${todayFocus} to balance your program and prevent overuse.` };
      return { type:"workout", icon:"🏋️", title:"PROGRESSIVE OVERLOAD", text:`Add 5 lbs or 1 rep to your key lifts this session. Small consistent gains compound into massive results over time.` };
    })();

    // Recovery recommendation — adjusted for age
    const recoveryRec = (() => {
      if ((muscleScores[topMuscle] || 0) > 80) return { type:"recovery", icon:"🧊", title:"PRIORITIZE RECOVERY", text:`Your ${muscleDisplayName[topMuscle] || topMuscle} is heavily loaded. Use contrast therapy (hot/cold), foam rolling, and get 8+ hours of sleep tonight.` };
      if (age >= 40) return { type:"recovery", icon:"🧘", title:"RECOVERY IS TRAINING", text:`At ${age}, recovery IS part of your program — not optional. Prioritize 8+ hours of sleep, mobility work, and at least one full rest day between heavy sessions.` };
      if (streak >= 5) return { type:"recovery", icon:"😴", title:"SLEEP IS YOUR SUPERPOWER", text:`On a ${streak}-day streak, sleep quality becomes critical. Aim for 8 hours — that's when muscle protein synthesis peaks.` };
      return { type:"recovery", icon:"💧", title:"HYDRATION CHECK", text:"Aim for at least 100oz of water on training days. Dehydration reduces strength output by up to 10% — don't leave gains on the table." };
    })();

    // Nutrition recommendation — adjusted for sex and age
    const totalVol = recent.reduce((a, s) => a + (s.vol || 0), 0);
    const nutritionRec = (() => {
      if (sex === "female") return { type:"nutrition", icon:"🥗", title:"FUEL FOR YOUR PHYSIOLOGY", text:"Women often under-eat on training days. Hit 0.8–1g protein per lb of bodyweight, don't skip carbs around workouts, and ensure adequate iron and calcium intake." };
      if (age >= 50) return { type:"nutrition", icon:"🥩", title:"PROTEIN IS NON-NEGOTIABLE", text:`After 50, muscle protein synthesis slows. Aim for 1g+ protein per lb of bodyweight and consider creatine monohydrate — it's the most proven supplement for preserving muscle with age.` };
      if (totalVol > 50000) return { type:"nutrition", icon:"🥩", title:"HIGH OUTPUT — FUEL UP", text:"Your training volume is serious. Hit 1g of protein per lb of bodyweight and keep carbs high on training days to fuel performance." };
      if (daysSinceLast >= 2) return { type:"nutrition", icon:"⚡", title:"PRE-WORKOUT FUEL", text:"Eat a balanced meal with carbs and protein 60–90 min before training. A banana + Greek yogurt is a simple, effective combo." };
      return { type:"nutrition", icon:"🥗", title:"POST-WORKOUT WINDOW", text:"Within 30–60 min of finishing, get 30–40g of protein and fast carbs. This window is when muscle repair starts — don't miss it." };
    })();

    // Motivational
    const motivos = [
      "The only bad workout is the one that didn't happen.",
      "Champions are built in the sessions nobody sees.",
      "Progress, not perfection. Show up again tomorrow.",
      "Your future self is watching. Make them proud.",
      "Discipline is doing it even when the motivation is gone.",
      streak > 0 ? `${streak} days in a row. That streak is your identity now — protect it.` : "Start the streak today. Day 1 is always the hardest.",
    ];
    const motivational = motivos[Math.floor(Date.now() / 86400000) % motivos.length];

    return { greeting, todayFocus, recommendations:[workoutRec, recoveryRec, nutritionRec], motivational };
  };

  const fetchCoach = () => {
    setState("loading");
    setErrMsg("");
    // Simulate brief analysis delay for UX, then generate locally
    setTimeout(() => {
      try {
        setResult(buildLocalCoaching());
        setState("result");
      } catch (e) {
        setErrMsg(e?.message || "Unknown error");
        setState("error");
      }
    }, 1200);
  };

  useEffect(() => { fetchCoach(); }, []); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  const typeColors = { workout: G.gold, recovery: G.blue, nutrition: G.green };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:400, display:"flex", alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.gold}44`, borderBottom:"none", maxHeight:"80vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 72px)" }}>

        {/* Handle bar */}
        <div style={{ width:36, height:3, background:G.border, borderRadius:2, margin:"14px auto 0" }}/>

        {/* Header */}
        <div style={{ padding:"14px 18px 0", display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:G.purpleGlow, flexShrink:0 }}>🤖</div>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>AI COACH</div>
            <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Smart coaching · Personalized for you</div>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontSize:18, padding:"4px 6px", flexShrink:0 }}>✕</button>
        </div>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.gold}44,transparent)`, marginBottom:18 }}/>

        {/* Loading */}
        {state === "loading" && (
          <div style={{ padding:"48px 18px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:14 }}>🤖</div>
            <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:G.gold, textTransform:"uppercase", marginBottom:8 }}>ANALYZING YOUR TRAINING...</div>
            <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>Analyzing your sessions & muscle data</div>
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
            {errMsg ? (
              <div style={{ fontFamily:FONT.mono, fontSize:10, color:G.red+"bb", letterSpacing:0.5, marginBottom:8, padding:"8px 12px", background:"rgba(255,60,60,0.08)", borderRadius:8, border:`1px solid ${G.red}33`, wordBreak:"break-all" }}>{errMsg}</div>
            ) : null}
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
  useScrollLock();
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
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.gold}44`, borderBottom:"none", maxHeight:"80vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 72px)" }}>
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
  useScrollLock();
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
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.purpleLight}44`, borderBottom:"none", maxHeight:"80vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 72px)" }}>
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


function HealthConnectModal({ onClose }) {
  useScrollLock();
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
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:480, margin:"0 auto", background:G.bg2, borderRadius:"18px 18px 0 0", border:`1px solid ${G.blue}44`, borderBottom:"none", maxHeight:"80vh", overflowY:"auto", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 72px)" }}>
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

function useAdminData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out — check connection")), 10000));
    try {
      let profiles, e;
      ({ data: profiles, error: e } = await Promise.race([
        supabase.from("profiles")
          .select("id, username, avatar_initials, points, streak, sessions_count, age, sex, location")
          .order("points", { ascending: false }),
        timeout,
      ]));
      if (e && (e.message?.includes("sessions_count") || e.message?.includes("age") || e.code === "42703")) {
        ({ data: profiles, error: e } = await supabase
          .from("profiles")
          .select("id, username, avatar_initials, points, streak")
          .order("points", { ascending: false }));
      }
      if (e) { setError(e.message); return; }
      setData(profiles || []);
    } catch (err) {
      setError(err?.message || "Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect
  return { data, loading, error, load };
}

function AdminDashboardContent({ data, loading, error, load }) {
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

  if (loading) return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:G.gold, textTransform:"uppercase" }}>LOADING DATA...</div>
    </div>
  );
  if (error) return (
    <div style={{ textAlign:"center", padding:"40px 0" }}>
      <div style={{ fontFamily:FONT.display, fontSize:14, letterSpacing:2, color:G.red, textTransform:"uppercase", marginBottom:12 }}>FAILED TO LOAD</div>
      <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, marginBottom:20 }}>{error}</div>
      <NeonBtn onClick={load} full>RETRY</NeonBtn>
    </div>
  );
  if (!data) return null;
  return (
    <>
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

      {data.some(p => p.sex || p.age) && (() => {
        const withSex = data.filter(p => p.sex);
        const sexCounts = withSex.reduce((acc, p) => { acc[p.sex] = (acc[p.sex]||0)+1; return acc; }, {});
        const withAge = data.filter(p => p.age);
        const ageBrackets = [["13–24",13,24],["25–34",25,34],["35–44",35,44],["45+",45,99]];
        const ageCounts = ageBrackets.map(([l,lo,hi]) => ({ l, n: withAge.filter(p => p.age >= lo && p.age <= hi).length }));
        const locations = data.filter(p => p.location).reduce((acc, p) => { const key = p.location.split(",").pop()?.trim() || p.location; acc[key] = (acc[key]||0)+1; return acc; }, {});
        const topLocs = Object.entries(locations).sort((a,b) => b[1]-a[1]).slice(0,5);
        return (
          <>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>MEMBER DEMOGRAPHICS</div>
            <ChromeCard style={{ padding:"14px", marginBottom:18 }}>
              {withSex.length > 0 && (
                <>
                  <div style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Sex ({withSex.length} reported)</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
                    {Object.entries(sexCounts).map(([s, n]) => (
                      <div key={s} style={{ background:`${G.purple}22`, border:`1px solid ${G.purple}44`, borderRadius:6, padding:"5px 10px", fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1 }}>
                        {s === "prefer_not" ? "Prefer not to say" : s.charAt(0).toUpperCase()+s.slice(1)} <span style={{ color:"#fff", fontFamily:FONT.display }}>{n}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {withAge.length > 0 && (
                <>
                  <div style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Age ({withAge.length} reported)</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
                    {ageCounts.filter(b => b.n > 0).map(b => (
                      <div key={b.l}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid }}>{b.l}</div>
                          <div style={{ fontFamily:FONT.display, fontSize:11, color:G.gold }}>{b.n}</div>
                        </div>
                        <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${Math.round((b.n/withAge.length)*100)}%`, background:G.gold, borderRadius:2 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {topLocs.length > 0 && (
                <>
                  <div style={{ fontFamily:FONT.display, fontSize:10, letterSpacing:2, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Top Locations</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {topLocs.map(([loc, n]) => (
                      <div key={loc} style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${G.borderB}`, borderRadius:6, padding:"4px 10px", fontFamily:FONT.body, fontSize:11, color:G.textMid }}>
                        {loc} <span style={{ color:"#fff", fontFamily:FONT.display }}>{n}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ChromeCard>
          </>
        );
      })()}

      <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:3, textTransform:"uppercase", marginBottom:10 }}>ALL USERS ({totalUsers})</div>
      <ChromeCard style={{ padding:0, overflow:"hidden", marginBottom:18 }}>
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
  );
}

function AdminDashboardModal({ onClose }) {
  useScrollLock();
  const { data, loading, error, load } = useAdminData();
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.98)", zIndex:500, display:"flex", flexDirection:"column" }}>
      <div style={{ background:`linear-gradient(135deg,${G.purple}44,rgba(0,0,0,0.8))`, borderBottom:`1px solid ${G.gold}33`, padding:"16px 18px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:G.goldGlow, flexShrink:0 }}>👑</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:G.gold, textTransform:"uppercase", textShadow:G.goldGlow2 }}>ADMIN DASHBOARD</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>Social Fit Club · Platform Analytics</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:8, color:G.textMid, cursor:"pointer", fontSize:16, padding:"6px 10px" }}>✕</button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"18px 18px 0", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)", maxWidth:480, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
        <AdminDashboardContent data={data} loading={loading} error={error} load={load}/>
      </div>
    </div>
  );
}

function AdminHomeScreen() {
  const { data, loading, error, load } = useAdminData();
  return (
    <div style={{ padding:`calc(env(safe-area-inset-top, 0px) + 20px) 18px 0` }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>
            ADMIN <span style={{ color:G.gold, textShadow:`0 0 12px ${G.gold}` }}>DASHBOARD</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:G.gold }}/>
            <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Platform Analytics</div>
          </div>
        </div>
        <button onClick={load} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:8, color:G.textMid, cursor:"pointer", fontSize:12, padding:"6px 10px", fontFamily:FONT.body, letterSpacing:1 }}>↺ REFRESH</button>
      </div>
      <AdminDashboardContent data={data} loading={loading} error={error} load={load}/>
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
  useScrollLock();
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

        <div style={{ overflowY:"auto", flex:1, padding:"0 18px 0", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 32px)" }}>

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
  useScrollLock();
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
      <div style={{ position:"relative", zIndex:1, padding:"24px 18px 0", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 40px)", maxWidth:480, margin:"0 auto", width:"100%" }}>
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

// ─── Achievement Badges ───────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  // TRAINING
  { id:"first_session",  cat:"TRAINING", ico:"🏋️", name:"First Rep",       desc:"Log your first session",           check:({sc})=>sc>=1 },
  { id:"sessions_10",    cat:"TRAINING", ico:"💪", name:"10 Strong",         desc:"Complete 10 sessions",             check:({sc})=>sc>=10 },
  { id:"sessions_25",    cat:"TRAINING", ico:"🔥", name:"25 Sessions",       desc:"25 sessions logged",               check:({sc})=>sc>=25 },
  { id:"sessions_50",    cat:"TRAINING", ico:"⚡", name:"50 Grind",          desc:"50 sessions in the books",         check:({sc})=>sc>=50 },
  { id:"sessions_100",   cat:"TRAINING", ico:"💯", name:"Century",           desc:"100 sessions — you're elite",      check:({sc})=>sc>=100 },
  { id:"sessions_250",   cat:"TRAINING", ico:"🦁", name:"Iron 250",          desc:"250 sessions logged",              check:({sc})=>sc>=250 },
  // VOLUME
  { id:"vol_10k",        cat:"VOLUME",   ico:"📦", name:"10K Club",          desc:"Lift 10,000 lbs total",            check:({vol})=>vol>=10000 },
  { id:"vol_100k",       cat:"VOLUME",   ico:"🚛", name:"100K Club",         desc:"100,000 lbs lifted",               check:({vol})=>vol>=100000 },
  { id:"vol_1m",         cat:"VOLUME",   ico:"🌍", name:"1M Club",           desc:"1,000,000 lbs — legendary",        check:({vol})=>vol>=1000000 },
  { id:"vol_10m",        cat:"VOLUME",   ico:"🌌", name:"10M Club",          desc:"10 million lbs — immortal",        check:({vol})=>vol>=10000000 },
  // STREAKS
  { id:"streak_7",       cat:"STREAKS",  ico:"🔥", name:"Week Warrior",      desc:"Hit a 7-day streak",               check:({streak})=>streak>=7 },
  { id:"streak_14",      cat:"STREAKS",  ico:"⚡", name:"2 Weeks Strong",    desc:"Maintain a 14-day streak",         check:({streak})=>streak>=14 },
  { id:"streak_30",      cat:"STREAKS",  ico:"🗓️", name:"Monthly Machine",  desc:"30-day streak",                    check:({streak})=>streak>=30 },
  { id:"streak_60",      cat:"STREAKS",  ico:"💎", name:"60-Day Diamond",    desc:"60 consecutive days",              check:({streak})=>streak>=60 },
  { id:"streak_100",     cat:"STREAKS",  ico:"👑", name:"100-Day Legend",    desc:"100-day streak — unstoppable",     check:({streak})=>streak>=100 },
  // STRENGTH
  { id:"first_pr",       cat:"STRENGTH", ico:"🎯", name:"PR Hunter",         desc:"Set your first personal record",   check:({prs})=>prs>=1 },
  { id:"prs_5",          cat:"STRENGTH", ico:"🏅", name:"5 PRs",             desc:"5 personal records logged",        check:({prs})=>prs>=5 },
  { id:"prs_10",         cat:"STRENGTH", ico:"🥇", name:"PR Machine",        desc:"10 personal records",              check:({prs})=>prs>=10 },
  { id:"prs_25",         cat:"STRENGTH", ico:"🏆", name:"PR Royalty",        desc:"25 personal records",              check:({prs})=>prs>=25 },
  // POINTS
  { id:"pts_1k",         cat:"POINTS",   ico:"⭐", name:"Point Scorer",      desc:"Earn 1,000 points",                check:({pts})=>pts>=1000 },
  { id:"pts_5k",         cat:"POINTS",   ico:"💫", name:"High Scorer",       desc:"Earn 5,000 points",                check:({pts})=>pts>=5000 },
  { id:"pts_10k",        cat:"POINTS",   ico:"🌟", name:"Elite Scorer",      desc:"Earn 10,000 points",               check:({pts})=>pts>=10000 },
  { id:"pts_25k",        cat:"POINTS",   ico:"👑", name:"Point Legend",      desc:"Earn 25,000 points",               check:({pts})=>pts>=25000 },
  // BODY
  { id:"first_checkin",  cat:"BODY",     ico:"📏", name:"Check-In",          desc:"Complete your first body check-in",check:({bodyLog})=>bodyLog.length>=1 },
  { id:"checkins_5",     cat:"BODY",     ico:"📈", name:"Transformer",       desc:"5 body check-ins logged",          check:({bodyLog})=>bodyLog.length>=5 },
  { id:"checkins_photo", cat:"BODY",     ico:"📷", name:"Progress Photo",    desc:"Log a check-in with a photo",      check:({bodyLog})=>bodyLog.some(e=>e.photo) },
  // NUTRITION
  { id:"first_food",     cat:"NUTRITION",ico:"🥗", name:"First Log",         desc:"Log your first meal",              check:({foods})=>foods>=1 },
  { id:"first_water",    cat:"NUTRITION",ico:"💧", name:"Hydrated",          desc:"Track your water intake",          check:({water})=>water>=1 },
  { id:"foods_100",      cat:"NUTRITION",ico:"🍱", name:"Meal Prep Pro",     desc:"Log 100 food items total",         check:({foods})=>foods>=100 },
];

function getUnlockedBadges(sessions=[], profile={}, extraData={}) {
  const { bodyLog=[], foods=0, water=0 } = extraData;
  const sc = profile?.sessions_count || sessions.length;
  const streak = profile?.streak || 0;
  const pts = profile?.points || 0;
  const vol = sessions.reduce((sum,s)=>{
    const sv = (s.exs||[]).reduce((a,ex)=>{
      return a + (ex.sets||[]).filter(st=>st.type!=="warmup").reduce((b,st)=>{
        const w=parseFloat(st.w)||0, r=parseFloat(st.r)||0;
        return b + (w>0&&r>0 ? w*r : 0);
      },0);
    },0);
    return sum+sv;
  }, 0);
  // Count unique PRs: best est1rm per exercise across all sessions
  const prMap = {};
  sessions.forEach(s=>{
    (s.exs||[]).forEach(ex=>{
      if (!ex.name) return;
      (ex.sets||[]).filter(st=>st.type!=="warmup").forEach(st=>{
        const w=parseFloat(st.w)||0, r=parseFloat(st.r)||0;
        if (w>0&&r>0) {
          const e1 = w*(1+r/30);
          if (!prMap[ex.name]||e1>prMap[ex.name]) prMap[ex.name]=e1;
        }
      });
    });
  });
  const prs = Object.keys(prMap).length;
  const ctx = { sc, streak, pts, vol, prs, bodyLog, foods, water };
  return new Set(ACHIEVEMENTS.filter(a=>a.check(ctx)).map(a=>a.id));
}

function AchievementsModal({ sessions=[], profile={}, onClose }) {
  useScrollLock();
  const [cat, setCat] = useState("ALL");
  const extraData = (() => {
    try {
      const bodyLog = JSON.parse(localStorage.getItem("sfc_body_log")||"[]");
      const nl = JSON.parse(localStorage.getItem("sfc_nutrition_log")||"[]");
      const foods = Array.isArray(nl) ? nl.reduce((s,d)=>s+(d.items?.length||0),0) : 0;
      const wl = JSON.parse(localStorage.getItem("sfc_water_log")||"null");
      const water = (wl?.entries||[]).length;
      return { bodyLog: Array.isArray(bodyLog)?bodyLog:[], foods, water };
    } catch { return { bodyLog:[], foods:0, water:0 }; }
  })();
  const unlocked = getUnlockedBadges(sessions, profile, extraData);
  const cats = ["ALL", ...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  const filtered = ACHIEVEMENTS.filter(a=>cat==="ALL"||a.cat===cat);
  const unlockedCount = ACHIEVEMENTS.filter(a=>unlocked.has(a.id)).length;
  const CAT_COLOR = { TRAINING:"#a78bfa", VOLUME:"#FDB927", STREAKS:"#F97316", STRENGTH:"#F43F5E", POINTS:"#FDB927", BODY:"#4ADE80", NUTRITION:"#38BDF8" };

  return (
    <div style={{ position:"fixed", inset:0, background:"#06060E", zIndex:900, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"calc(env(safe-area-inset-top,0px) + 16px) 18px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>
              MY <span style={{ color:G.gold, textShadow:`0 0 12px ${G.gold}` }}>BADGES</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:G.gold }}/>
              <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>{unlockedCount} / {ACHIEVEMENTS.length} unlocked</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:20, padding:"6px 14px", color:"#fff", fontFamily:FONT.display, fontSize:12, letterSpacing:1, cursor:"pointer" }}>✕ CLOSE</button>
        </div>
        {/* Category filter */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:10 }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0, background:cat===c?`linear-gradient(135deg,${G.purple},${G.purpleBright})`:"rgba(255,255,255,0.05)", border:"none", borderRadius:20, padding:"5px 12px", fontFamily:FONT.display, fontSize:10, letterSpacing:1.5, color:cat===c?"#fff":G.textMid, cursor:"pointer", textTransform:"uppercase" }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 18px", paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 100px)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, paddingTop:4 }}>
          {filtered.map(a=>{
            const got = unlocked.has(a.id);
            const col = CAT_COLOR[a.cat] || G.purple;
            return (
              <div key={a.id} style={{ background: got ? `linear-gradient(135deg,${col}18,${col}08)` : "rgba(255,255,255,0.03)", border:`1px solid ${got?col+"44":"rgba(255,255,255,0.06)"}`, borderRadius:14, padding:"14px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, textAlign:"center", opacity: got?1:0.45 }}>
                <div style={{ fontSize:30, filter: got?"none":"grayscale(1)" }}>{a.ico}</div>
                <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:1.5, color: got?col:"#fff", textTransform:"uppercase", lineHeight:1.2 }}>{a.name}</div>
                <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, textTransform:"uppercase", lineHeight:1.4 }}>{a.desc}</div>
                {got && <div style={{ background:col+"22", borderRadius:10, padding:"2px 8px", fontFamily:FONT.display, fontSize:9, letterSpacing:1.5, color:col, marginTop:2 }}>✓ UNLOCKED</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MoreScreen({ showToast, profile, onSignOut, onProfileUpdate, sessions, muscleScores, isAdmin, userId, unit = "lbs", onUnitToggle }) {
  const [aiCoachOpen, setAiCoachOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [healthOpen, setHealthOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [macroCoachOpen, setMacroCoachOpen] = useState(false);
  const [formCheckOpen, setFormCheckOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [followOpen, setFollowOpen] = useState(null);
  const [moreViewingUser, setMoreViewingUser] = useState(null);
  const [followerCount, setFollowerCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
    ]).then(([fersRes, fingRes]) => {
      setTimeout(() => {
        setFollowerCount(fersRes.count ?? 0);
        setFollowingCount(fingRes.count ?? 0);
      }, 0);
    });
  }, [userId]);
  const FEATURES = [
    {id:"badges", l:"MY BADGES", ico:"🏆", desc:"Achievements & milestone trophies", col:G.gold, hot:true},
    {id:"merch", l:"SFC MERCH", ico:"👕", desc:"Official gear & member drops", col:G.gold},
    {id:"units", l:"UNITS", ico:"⚖️", desc: unit === "lbs" ? "Switch to kg" : "Switch to lbs", col:G.textMid},
    {id:"reports", l:"WEEKLY REPORTS", ico:"📋", desc:"Personalized coaching notes", col:G.purpleLight, hot:true},
    {id:"macro", l:"MACRO COACH", ico:"⚡", desc:"Adaptive calorie & macro targets", col:G.gold, hot:true},
    {id:"health", l:"HEALTH CONNECT", ico:"⌚", desc:"BLE heart rate & fitness devices", col:G.blue, hot:true},
    {id:"ai", l:"AI COACH", ico:"🤖", desc:"Smart daily recommendations", col:G.gold, hot:true},
    {id:"goals", l:"GOALS", ico:"🎯", desc:"Track your fitness targets", col:G.gold},
    {id:"notif", l:"NOTIFICATIONS", ico:"🔔", desc:"Reminders & streak alerts", col:G.purpleLight, hot:true},
    {id:"form", l:"FORM CHECK", ico:"🏋️", desc:"AI feedback on your lifts", col:G.gold, hot:true},
  ];

  const handleTile = (id) => {
    if (id === "units") { onUnitToggle?.(); return; }
    if (id === "badges") { setAchievementsOpen(true); return; }
    if (id === "ai") setAiCoachOpen(true);
    else if (id === "goals") setGoalsOpen(true);
    else if (id === "reports") setReportsOpen(true);
    else if (id === "health") setHealthOpen(true);
    else if (id === "notif") setNotifOpen(true);
    else if (id === "macro") setMacroCoachOpen(true);
    else if (id === "form") setFormCheckOpen(true);
    else showToast(`${FEATURES.find(f=>f.id===id)?.ico} ${FEATURES.find(f=>f.id===id)?.l} — COMING SOON`);
  };
  const handleEditProfile = () => setProfileOpen(true);

  return (
    <div style={{ padding:"calc(env(safe-area-inset-top, 0px) + 20px) 18px 0" }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:"#fff", textTransform:"uppercase" }}>
          MORE <span style={{ color:G.purple, textShadow:`0 0 12px ${G.purple}` }}>TOOLS</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:4 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:G.purple, boxShadow:`0 0 8px ${G.purple}` }}/>
          <div style={{ fontFamily:FONT.body, fontSize:10, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>All Features</div>
        </div>
      </div>
      {aiCoachOpen && <AiCoachModal profile={profile} sessions={sessions} muscleScores={muscleScores} onClose={()=>setAiCoachOpen(false)}/>}
      {goalsOpen && <GoalsModal sessions={sessions} profile={profile} onClose={()=>setGoalsOpen(false)}/>}
      {reportsOpen && <WeeklyReportModal sessions={sessions} muscleScores={muscleScores} onClose={()=>setReportsOpen(false)}/>}
      {healthOpen && <HealthConnectModal onClose={()=>setHealthOpen(false)}/>}
      {adminOpen && <AdminDashboardModal onClose={()=>setAdminOpen(false)}/>}
      {notifOpen && <NotificationsModal sessions={sessions} onClose={()=>setNotifOpen(false)}/>}
      {macroCoachOpen && <MacroCoachModal onClose={()=>setMacroCoachOpen(false)}/>}
      {formCheckOpen && <FormCheckModal onClose={()=>setFormCheckOpen(false)}/>}
      {profileOpen && <ProfileModal profile={profile} userId={userId} onClose={()=>setProfileOpen(false)} onSave={onProfileUpdate} showToast={showToast}/>}
      {helpOpen && <HelpSupportModal onClose={()=>setHelpOpen(false)}/>}

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
      <ChromeCard gold style={{ padding:"13px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={handleEditProfile}>
        <AvatarBadge initials={profile?.avatar_initials||"ME"} url={profile?.avatar_url||null} size={44} gold/>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:15, letterSpacing:2, color:"#fff", textTransform:"uppercase" }}>{profile?.username||"ATHLETE"}</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:1, marginTop:2 }}>{profile?.points||0} pts · MEMBER</div>
        </div>
        <div style={{ fontFamily:FONT.body, fontSize:9, color:G.gold, letterSpacing:2, textTransform:"uppercase", border:`1px solid ${G.gold}44`, borderRadius:6, padding:"4px 8px" }}>EDIT ✎</div>
      </ChromeCard>

      {/* Follower / Following counts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {[
          { label:"FOLLOWERS", count:followerCount, mode:"followers" },
          { label:"FOLLOWING", count:followingCount, mode:"following" },
        ].map(({ label, count, mode }) => (
          <button key={mode} onClick={() => setFollowOpen(mode)} style={{ background:"rgba(20,18,40,0.95)", border:`1px solid ${G.purple}22`, borderRadius:10, padding:"10px 8px", textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontFamily:FONT.display, fontSize:20, color:G.purple, letterSpacing:1 }}>{count ?? "—"}</div>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:2, textTransform:"uppercase", marginTop:3 }}>{label}</div>
          </button>
        ))}
      </div>
      {isAdmin && (
        <div onClick={()=>setAdminOpen(true)} style={{ background:`linear-gradient(135deg,${G.gold}10,${G.purple}08)`, border:`1px solid ${G.gold}44`, borderRadius:10, padding:"12px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer", boxShadow:G.goldGlow2 }}>
          <span style={{ fontSize:18, flexShrink:0 }}>👑</span>
          <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.gold, textTransform:"uppercase" }}>ADMIN DASHBOARD</div>
          <span style={{ color:G.gold, fontSize:13 }}>›</span>
        </div>
      )}
      <div onClick={()=>setHelpOpen(true)} style={{ background:`linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(10,8,24,0.8) 100%)`, border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>❓</span>
        <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>HELP & SUPPORT</div>
        <span style={{ color:G.textDim, fontSize:13 }}>›</span>
      </div>
      <div onClick={() => {
        try {
          const safeJSON = key => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } };
          const exportData = {
            exportedAt: new Date().toISOString(),
            profile: profile ? { username: profile.username, points: profile.points, streak: profile.streak, sessions_count: profile.sessions_count } : null,
            sessions: sessions || [],
            nutritionLog: safeJSON("sfc_nutrition_log"),
            supplementLog: safeJSON("sfc_supplement_log"),
            bodyLog: safeJSON("sfc_body_log"),
            waterLog: safeJSON("sfc_water_log"),
            goals: safeJSON("sfc_goals"),
            challenges: safeJSON("sfc_challenges"),
            templates: safeJSON("sfc_templates"),
            mealTemplates: safeJSON("sfc_meal_templates"),
            macroCoach: safeJSON("sfc_macro_coach"),
          };
          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `sfc-data-${new Date().toISOString().slice(0,10)}.json`;
          document.body.appendChild(a); a.click();
          document.body.removeChild(a); URL.revokeObjectURL(url);
          showToast("📦 Data exported!");
        } catch { showToast("Export failed — try again"); }
      }} style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"13px 14px", marginTop:4, marginBottom:7, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>📦</span>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textMid, textTransform:"uppercase" }}>EXPORT MY DATA</div>
          <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>Sessions · Nutrition · Body log · Templates</div>
        </div>
        <span style={{ color:G.textDim, fontSize:13 }}>↓</span>
      </div>
      <div onClick={onSignOut} style={{ background:"rgba(255,61,90,0.07)", border:`1px solid ${G.red}33`, borderRadius:10, padding:"13px 14px", marginTop:4, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🚪</span>
        <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.red, textTransform:"uppercase" }}>SIGN OUT</div>
        <span style={{ color:G.red, fontSize:13, opacity:0.6 }}>›</span>
      </div>
      <div onClick={()=>setDeleteOpen(true)} style={{ borderRadius:10, padding:"13px 14px", marginTop:4, display:"flex", alignItems:"center", gap:11, cursor:"pointer" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>🗑️</span>
        <div style={{ flex:1, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.textDim, textTransform:"uppercase" }}>DELETE ACCOUNT</div>
        <span style={{ color:G.textDim, fontSize:13, opacity:0.6 }}>›</span>
      </div>
      {deleteOpen && <DeleteAccountModal onClose={()=>setDeleteOpen(false)} onDeleted={onSignOut}/>}
      {achievementsOpen && <AchievementsModal sessions={sessions} profile={profile} onClose={()=>setAchievementsOpen(false)}/>}

      {followOpen && userId && (
        <FollowListModal
          userId={userId}
          mode={followOpen}
          onClose={() => setFollowOpen(null)}
          onViewProfile={u => { setFollowOpen(null); setMoreViewingUser({ id: u.id, av: u.avatar_initials || "?", url: u.avatar_url || null, name: u.username || "ATHLETE", rank: null }); }}
        />
      )}

      {moreViewingUser && (
        <UserProfileModal
          user={moreViewingUser}
          currentUserId={userId}
          onClose={() => {
            setMoreViewingUser(null);
            if (!userId) return;
            Promise.all([
              supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
              supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
            ]).then(([fersRes, fingRes]) => {
              setFollowerCount(fersRes.count ?? 0);
              setFollowingCount(fingRes.count ?? 0);
            });
          }}
        />
      )}
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

function ProfileSetupModal({ userId, onDone }) {
  useScrollLock();
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  const SEX_OPTIONS = [
    { val:"male",   label:"Male" },
    { val:"female", label:"Female" },
    { val:"other",  label:"Non-binary" },
    { val:"prefer_not", label:"Prefer not to say" },
  ];

  const handleSave = async () => {
    setSaving(true);
    const updates = {};
    const ageNum = parseInt(age, 10);
    if (ageNum >= 13 && ageNum <= 99) updates.age = ageNum;
    if (sex) updates.sex = sex;
    if (location.trim()) updates.location = location.trim();
    if (Object.keys(updates).length > 0 && userId) {
      await supabase.from("profiles").update(updates).eq("id", userId);
    }
    setSaving(false);
    onDone(Object.keys(updates).length > 0 ? updates : null);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.97)", zIndex:820, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px", animation:"motivFadeIn 0.3s ease" }}>
      <div style={{ width:"100%", maxWidth:400, background:G.bg2, borderRadius:20, padding:"28px 22px", border:`1px solid ${G.purple}44` }}>
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>💪</div>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase", marginBottom:6 }}>
            TELL US ABOUT <span style={{ color:G.purple }}>YOU</span>
          </div>
          <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:1, lineHeight:1.6 }}>
            Helps your AI Coach give personalized recommendations
          </div>
        </div>

        {/* Sex */}
        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Biological Sex</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:16 }}>
          {SEX_OPTIONS.map(o => (
            <button key={o.val} onClick={()=>setSex(o.val)}
              style={{ padding:"10px 8px", borderRadius:8, border:`1px solid ${sex===o.val ? G.purple : G.borderB}`, background:sex===o.val ? `${G.purple}22` : "transparent", color:sex===o.val ? "#fff" : G.textMid, fontFamily:FONT.body, fontSize:12, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>
              {o.label}
            </button>
          ))}
        </div>

        {/* Age */}
        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Age</div>
        <input
          type="number" inputMode="numeric" value={age} onChange={e=>setAge(e.target.value)}
          placeholder="e.g. 28" min="13" max="99"
          style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"12px 14px", color:"#fff", fontSize:16, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.body, letterSpacing:1.5, marginBottom:16 }}
        />

        {/* Location */}
        <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase", marginBottom:8 }}>Location <span style={{ color:G.textDim }}>(Optional)</span></div>
        <input
          type="text" value={location} onChange={e=>setLocation(e.target.value)}
          placeholder="City, Country (e.g. Los Angeles, USA)"
          style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${G.borderB}`, borderRadius:8, padding:"12px 14px", color:"#fff", fontSize:13, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.body, letterSpacing:1, marginBottom:20 }}
        />

        <NeonBtn onClick={handleSave} full disabled={saving} style={{ marginBottom:10 }}>
          {saving ? "SAVING..." : "SAVE & CONTINUE ◆"}
        </NeonBtn>
        <button onClick={()=>onDone(null)} style={{ width:"100%", background:"none", border:"none", fontFamily:FONT.body, fontSize:11, color:G.textDim, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", padding:"8px" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState(() => { try { return localStorage.getItem("sfc_remembered_email") || ""; } catch { return ""; } });
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => { try { return !!localStorage.getItem("sfc_remembered_email"); } catch { return true; } });

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
        try {
          if (rememberMe) localStorage.setItem("sfc_remembered_email", email.trim());
          else localStorage.removeItem("sfc_remembered_email");
        } catch { /* ignore */ }
      }
    } catch (e) {
      setError(e.message === "Invalid login credentials" ? "Incorrect email or password." : e.message);
    } finally { setLoading(false); }
  };

  const errMap = { "Email not confirmed": "Please confirm your email first, then sign in." };

  if (awaitingConfirm) return (
    <main style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
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
    </main>
  );

  if (forgotSent) return (
    <main style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
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
    </main>
  );

  return (
    <main style={{ minHeight:"100vh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
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
          <div style={{ position:"relative" }}>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="PASSWORD" type={showPw ? "text" : "password"}
              style={{ ...inp, paddingRight:52 }} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <button type="button" onClick={()=>setShowPw(v=>!v)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:G.textMid, cursor:"pointer", fontFamily:FONT.body, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", padding:4 }}>
              {showPw ? "HIDE" : "SHOW"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ marginTop:10, padding:"10px 14px", background:"rgba(255,61,90,0.1)", border:`1px solid ${G.red}44`, borderRadius:7, fontFamily:FONT.body, fontSize:12, color:G.red, letterSpacing:1 }}>
            {errMap[error]||error}
          </div>
        )}

        {mode==="signin" && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14, cursor:"pointer" }} onClick={()=>setRememberMe(v=>!v)}>
            <div style={{ width:18, height:18, borderRadius:4, border:`1.5px solid ${rememberMe ? G.purple : G.borderB}`, background:rememberMe ? G.purple : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
              {rememberMe && <div style={{ color:"#fff", fontSize:11, lineHeight:1 }}>✓</div>}
            </div>
            <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase" }}>Remember me</div>
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
    </main>
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

function DeleteAccountModal({ onClose, onDeleted }) {
  useScrollLock();
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (confirm.toUpperCase() !== "DELETE") { setError('Type DELETE to confirm.'); return; }
    setLoading(true); setError(null);
    try {
      const { error: e } = await supabase.functions.invoke("delete-account");
      if (e) throw e;
      // Clear all local data
      const keys = ["sfc_nutrition_log","sfc_wip_session","sfc_feed","sfc_streak_freezes","sfc_goals","sfc_body_log","sfc_ble_device","sfc_supplement_log","sfc_notif_prefs","sfc_session_tags","sfc_session_notes","sfc_water_log","sfc_water_goal","sfc_macro_coach","sfc_challenges","sfc_meal_templates","sfc_templates","sfc_daily_motiv","sfc_remembered_email","sfc_onboarded","sfc_profile_setup_done","sfc_tour_done"];
      keys.forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
      onDeleted();
    } catch {
      setError("Deletion failed. Please contact sfcsupport26@gmail.com to request manual deletion.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.97)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
      <div style={{ width:"100%", maxWidth:380, background:G.bg2, borderRadius:16, padding:"28px 22px", border:`1px solid ${G.red}44` }}>
        <div style={{ fontSize:40, textAlign:"center", marginBottom:14 }}>⚠️</div>
        <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:G.red, textAlign:"center", textTransform:"uppercase", marginBottom:10 }}>DELETE ACCOUNT</div>
        <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:0.5, lineHeight:1.7, textAlign:"center", marginBottom:22 }}>
          This permanently deletes your account, all workout history, and profile data. <span style={{ color:"#fff" }}>This cannot be undone.</span>
        </div>
        <div style={{ fontFamily:FONT.body, fontSize:11, color:G.textMid, letterSpacing:1.5, textTransform:"uppercase", marginBottom:7 }}>Type DELETE to confirm</div>
        <input
          value={confirm} onChange={e=>setConfirm(e.target.value)}
          placeholder="DELETE"
          style={{ background:"rgba(0,0,0,0.5)", border:`1px solid ${G.red}55`, borderRadius:8, padding:"12px 14px", color:G.red, fontSize:16, outline:"none", width:"100%", boxSizing:"border-box", fontFamily:FONT.display, letterSpacing:4, textAlign:"center", textTransform:"uppercase", marginBottom:8 }}
        />
        {error && <div style={{ fontFamily:FONT.body, fontSize:11, color:G.red, letterSpacing:1, textAlign:"center", marginBottom:10 }}>{error}</div>}
        <button onClick={handleDelete} disabled={loading} style={{ width:"100%", padding:"13px", background:loading ? "rgba(255,61,90,0.2)" : "rgba(255,61,90,0.15)", border:`1px solid ${G.red}66`, borderRadius:9, color:G.red, fontFamily:FONT.display, fontSize:14, letterSpacing:3, textTransform:"uppercase", cursor:"pointer", marginBottom:10 }}>
          {loading ? "DELETING..." : "PERMANENTLY DELETE ◆"}
        </button>
        <button onClick={onClose} style={{ width:"100%", padding:"12px", background:"transparent", border:`1px solid ${G.borderB}`, borderRadius:9, color:G.textMid, fontFamily:FONT.display, fontSize:13, letterSpacing:3, textTransform:"uppercase", cursor:"pointer" }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}

function HelpSupportModal({ onClose }) {
  useScrollLock();
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(6,6,14,0.96)", zIndex:500, display:"flex", flexDirection:"column" }}>
      <div style={{ background:`linear-gradient(135deg,${G.purple}44,rgba(0,0,0,0.8))`, borderBottom:`1px solid ${G.gold}33`, padding:"16px 18px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:G.goldGlow, flexShrink:0 }}>❓</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:4, color:G.gold, textTransform:"uppercase", textShadow:G.goldGlow2 }}>HELP & SUPPORT</div>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:2, textTransform:"uppercase" }}>We're here to help</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:`1px solid ${G.borderB}`, borderRadius:8, color:G.textMid, cursor:"pointer", fontSize:16, padding:"6px 10px" }}>✕</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"32px 24px 0", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 32px)", maxWidth:480, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
        <ChromeCard style={{ padding:"24px", textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:40, marginBottom:16 }}>📧</div>
          <div style={{ fontFamily:FONT.display, fontSize:16, letterSpacing:3, color:G.gold, textTransform:"uppercase", marginBottom:10 }}>CONTACT US</div>
          <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1, lineHeight:1.6, marginBottom:20 }}>
            Have a question, feedback, or need help with your account? Reach out to our support team and we'll get back to you as soon as possible.
          </div>
          <a href="mailto:sfcsupport26@gmail.com" style={{ display:"block", background:`linear-gradient(135deg,${G.gold},${G.goldDark})`, color:"#0A0810", fontFamily:FONT.display, fontSize:14, letterSpacing:3, textTransform:"uppercase", padding:"14px 20px", borderRadius:10, textDecoration:"none", boxShadow:G.goldGlow }}>
            sfcsupport26@gmail.com ◆
          </a>
        </ChromeCard>

        <ChromeCard style={{ padding:"18px" }}>
          <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:3, color:G.gold, textTransform:"uppercase", marginBottom:12 }}>RESPONSE TIME</div>
          <div style={{ fontFamily:FONT.body, fontSize:12, color:G.textMid, letterSpacing:0.5, lineHeight:1.7 }}>
            We typically respond within <span style={{ color:"#fff" }}>24–48 hours</span>. For the fastest response, include your username and a description of the issue.
          </div>
        </ChromeCard>

        <ChromeCard style={{ padding:"18px", marginTop:16 }}>
          <div style={{ fontFamily:FONT.display, fontSize:12, letterSpacing:3, color:G.textMid, textTransform:"uppercase", marginBottom:12 }}>LEGAL</div>
          <a href="/privacy.html" target="_blank" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", textDecoration:"none", paddingBottom:10, borderBottom:`1px solid ${G.borderB}`, marginBottom:10 }}>
            <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1 }}>Privacy Policy</div>
            <div style={{ color:G.textDim, fontSize:12 }}>›</div>
          </a>
          <a href="/terms.html" target="_blank" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", textDecoration:"none" }}>
            <div style={{ fontFamily:FONT.body, fontSize:13, color:G.textMid, letterSpacing:1 }}>Terms of Service</div>
            <div style={{ color:G.textDim, fontSize:12 }}>›</div>
          </a>
        </ChromeCard>
      </div>
    </div>
  );
}

function ProfileModal({ profile, userId, onClose, onSave, showToast }) {
  useScrollLock();
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "");
  const [sex, setSex] = useState(profile?.sex || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState(null); // null | "checking" | "available" | "taken"
  const fileRef = useRef(null);

  useEffect(() => {
    const trimmed = username.trim().toUpperCase();
    if (!trimmed || trimmed === (profile?.username || "").toUpperCase()) {
      setTimeout(() => setUsernameStatus(null), 0);
      return;
    }
    const t = setTimeout(async () => {
      setUsernameStatus("checking");
      const { data } = await supabase.from("profiles").select("id").ilike("username", trimmed).neq("id", userId).limit(1);
      setUsernameStatus(data?.length > 0 ? "taken" : "available");
    }, 500);
    return () => clearTimeout(t);
  }, [username, userId, profile?.username]);

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
      setErr(`Photo upload failed: ${e2?.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) { setErr("Not logged in — please sign out and sign back in."); return; }
    if (usernameStatus === "taken") { setErr("That username is already taken. Choose a different one."); return; }
    if (usernameStatus === "checking") { setErr("Still checking username availability — please wait a moment."); return; }
    setSaving(true); setErr(null);
    const trimmed = username.trim().toUpperCase().slice(0, 20) || "ATHLETE";
    const initials = trimmed.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2) || "ME";
    const updates = { username: trimmed, avatar_initials: initials };
    if (avatarUrl) updates.avatar_url = avatarUrl;
    const ageNum = parseInt(age, 10);
    if (ageNum >= 13 && ageNum <= 99) updates.age = ageNum;
    if (sex) updates.sex = sex;
    if (location.trim()) updates.location = location.trim();
    let { data: rows, error: e2 } = await supabase.from("profiles").update(updates).eq("id", userId).select("id");
    if (e2 && (e2.message?.includes("avatar_url") || e2.code === "42703")) {
      const { username: u, avatar_initials: ai } = updates;
      ({ data: rows, error: e2 } = await supabase.from("profiles").update({ username: u, avatar_initials: ai }).eq("id", userId).select("id"));
    }
    setSaving(false);
    if (e2?.code === "23505") { setErr("That username is already taken. Choose a different one."); return; }
    if (e2) { setErr(`Save failed: ${e2.message}`); return; }
    if (!rows || rows.length === 0) {
      setErr(`Save blocked — no matching profile row. Your user ID: ${userId?.slice(0,8)}... Please sign out and sign back in, then try again.`);
      return;
    }
    onSave({ ...profile, ...updates });
    showToast?.("PROFILE UPDATED!");
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

      <div style={{ flex:1, overflowY:"auto", padding:"32px 24px 0", paddingBottom:"calc(env(safe-area-inset-bottom, 0px) + 48px)", maxWidth:480, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
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
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>USERNAME</div>
          <input
            value={username}
            onChange={e => setUsername(e.target.value.toUpperCase().slice(0, 20))}
            placeholder="YOUR NAME"
            maxLength={20}
            style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${usernameStatus === "taken" ? "#FF4444" : usernameStatus === "available" ? G.green : G.borderB}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontFamily:FONT.display, fontSize:16, letterSpacing:3, boxSizing:"border-box", outline:"none", transition:"border-color 0.2s" }}
          />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:5 }}>
            <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>{username.length}/20 characters</div>
            {usernameStatus === "checking" && <div style={{ fontFamily:FONT.body, fontSize:9, color:G.textDim, letterSpacing:1 }}>CHECKING...</div>}
            {usernameStatus === "available" && <div style={{ fontFamily:FONT.body, fontSize:9, color:G.green, letterSpacing:1 }}>✓ AVAILABLE</div>}
            {usernameStatus === "taken" && <div style={{ fontFamily:FONT.body, fontSize:9, color:"#FF4444", letterSpacing:1 }}>✗ ALREADY TAKEN</div>}
          </div>
        </div>

        {/* Sex */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Biological Sex</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {[{val:"male",label:"Male"},{val:"female",label:"Female"},{val:"other",label:"Non-binary"},{val:"prefer_not",label:"Prefer not to say"}].map(o => (
              <button key={o.val} onClick={()=>setSex(o.val)}
                style={{ padding:"10px 8px", borderRadius:8, border:`1px solid ${sex===o.val ? G.purple : G.borderB}`, background:sex===o.val ? `${G.purple}22` : "transparent", color:sex===o.val ? "#fff" : G.textMid, fontFamily:FONT.body, fontSize:12, letterSpacing:1, cursor:"pointer", textTransform:"uppercase" }}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Age</div>
          <input
            type="number" inputMode="numeric" value={age} onChange={e=>setAge(e.target.value)}
            placeholder="e.g. 28" min="13" max="99"
            style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontFamily:FONT.body, fontSize:14, letterSpacing:1.5, boxSizing:"border-box", outline:"none" }}
          />
        </div>

        {/* Location */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontFamily:FONT.body, fontSize:10, color:G.textMid, letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Location</div>
          <input
            type="text" value={location} onChange={e=>setLocation(e.target.value)}
            placeholder="City, Country (e.g. Los Angeles, USA)"
            style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${G.borderB}`, borderRadius:10, padding:"12px 14px", color:"#fff", fontFamily:FONT.body, fontSize:13, letterSpacing:1, boxSizing:"border-box", outline:"none" }}
          />
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
  // Fast synchronous check: if no Supabase session exists in localStorage, user is definitely
  // logged out — skip the async getSession() wait and show LoginScreen immediately.
  const [authReady, setAuthReady] = useState(() => {
    if (_D) return true;
    try { return !localStorage.getItem("sb-hcrhoccdgdelmbsmbrba-auth-token"); } catch { return false; }
  });
  const [dataLoadFailed, setDataLoadFailed] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return !localStorage.getItem("sfc_onboarded"); } catch { return true; }
  });
  const [showDailyMotiv, setShowDailyMotiv] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    try { return localStorage.getItem("sfc_daily_motiv") !== today; } catch { return true; }
  });
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [feedShareText, setFeedShareText] = useState(null);
  const [unit, setUnit] = useState(() => localStorage.getItem("sfc_unit") || "lbs");

  const handleShareTemplate = async (tmpl) => {
    if (!user?.id) return;
    const txt = JSON.stringify({ name: tmpl.name, exs: tmpl.exs, tag: tmpl.tag || null });
    const { error } = await supabase.from("posts").insert({ user_id: user.id, type: "template", txt, tag: tmpl.name.toUpperCase(), likes: 0, comment_count: 0 });
    if (error) { showToast("Failed to share — check connection"); return; }
    setTab("feed");
    showToast("📤 Template shared with your squad!");
  };
  const profileSetupChecked = useRef(false);
  const toastTimer = useRef(null);

  const loadProfile = async (userId) => {
    const { data, error } = await supabase.from("profiles").select("id, username, avatar_initials, avatar_url, points, streak, sessions_count, age, sex, location").eq("id", userId).single();
    if (data) { setProfile(data); return data; }
    if (error) {
      if (error.code === "PGRST116") return null; // row not found — new user
      // age/sex/location or avatar_url may not be migrated yet — retry without them
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
      const notesMap = (() => { try { return JSON.parse(localStorage.getItem("sfc_session_notes") || "{}"); } catch { return {}; } })();
      const mapped = data.map(s => ({ id:s.id, name:s.name, exs:s.exercises, sets:s.sets, vol:s.volume, pts:s.points, date:s.date, createdAt:s.created_at, tag: tagMap[s.id] || undefined, notes: notesMap[s.id] || undefined }));
      // Prune stale tag entries for sessions that no longer exist
      const validIds = new Set(data.map(s => String(s.id)));
      const pruned = Object.fromEntries(Object.entries(tagMap).filter(([k]) => validIds.has(k)));
      try { localStorage.setItem("sfc_session_tags", JSON.stringify(pruned)); } catch { /* ignore */ }
      setSessions(mapped);
    }
    else if (error) setDataLoadFailed(true);
  };

  const loadLeaderboard = async (currentUserId) => {
    const { data, error: lbErr } = await supabase
      .from("profiles")
      .select("id, username, avatar_initials, avatar_url, points, sessions_count, streak")
      .order("points", { ascending: false })
      .limit(20);
    if (lbErr) return;
    if (data) {
      setLeaderboard(data.map((p, i) => ({
        rank: i + 1,
        id: p.id,
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
      let { data, error: insErr } = await supabase.from("profiles").insert({ id: u.id, username: base || "ATHLETE", avatar_initials: initials, points: 0, streak: 0, sessions_count: 0 }).select().single();
      if (insErr?.code === "23505") {
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const unique = (base || "ATHLETE").slice(0, 16) + suffix;
        const uInitials = unique.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2) || "ME";
        const { data: retryData } = await supabase.from("profiles").insert({ id: u.id, username: unique, avatar_initials: uInitials, points: 0, streak: 0, sessions_count: 0 }).select().single();
        data = retryData;
      }
      if (data) setProfile(data);
    }
    await loadSessions(u.id);
    await loadLeaderboard(u.id);
  };

  useEffect(() => {
    if (!profile || profileSetupChecked.current) return;
    profileSetupChecked.current = true;
    if (profile.age == null) {
      try { if (!localStorage.getItem("sfc_profile_setup_done")) setTimeout(() => setShowProfileSetup(true), 600); } catch { /* ignore */ }
    }
  }, [profile]);

  useEffect(() => {
    if (_D) return;
    // Safety net: if getSession() hangs (e.g. token refresh on slow/no network), unblock after 3s
    const authTimeout = setTimeout(() => setAuthReady(true), 3000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(authTimeout);
      setUser(session?.user ?? null);
      if (session?.user) { loadProfile(session.user.id); loadSessions(session.user.id); loadLeaderboard(session.user.id); }
      setAuthReady(true);
    }).catch(() => {
      clearTimeout(authTimeout);
      setAuthReady(true); // Show LoginScreen even if session check fails
    });
    // Refresh data when app resumes from background (iOS PWA)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            loadProfile(session.user.id);
            loadSessions(session.user.id);
            loadLeaderboard(session.user.id);
          }
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") { setPasswordRecovery(true); return; }
      setAuthReady(true); // backup: fires on INITIAL_SESSION covering slow getSession() cases
      setUser(session?.user ?? null);
      if (session?.user) await ensureProfile(session.user);
      else { setProfile(null); setSessions([]); }
    });
    return () => { subscription.unsubscribe(); document.removeEventListener("visibilitychange", handleVisibility); };
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
    // Only clear session-ephemeral keys — nutrition logs, macro coach, body log, goals,
    // templates, water, challenges etc. are device-level personal data and must survive sign-out.
    ["sfc_daily_motiv","sfc_wip_session","sfc_session_tags","sfc_feed"].forEach(k => localStorage.removeItem(k));
    setTab("home");
    setSessions([]);
    setProfile(null);
    setUser(null);
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

    // Optimistic local update (tag with timestamp so rollback can find it)
    const optimisticAt = new Date().toISOString();
    const sessWithTs = { ...sess, _optimisticAt: optimisticAt };
    setSessions(p => [{ ...sessWithTs, createdAt: optimisticAt }, ...p]);
    const newPts = (profile?.points || 0) + sess.pts;
    const newSessionsCount = (profile?.sessions_count || 0) + 1;
    setProfile(p => ({ ...p, points: newPts, sessions_count: newSessionsCount, streak: newStreak }));
    setLeaderboard(p =>
      p.map(u => u.isMe ? { ...u, pts: newPts, sessions: u.sessions + 1, streak: newStreak } : u)
       .sort((a,b) => b.pts - a.pts)
       .map((u,i) => ({ ...u, rank: i+1 }))
    );
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
    if (sErr || pErr) {
      // Roll back optimistic update so nothing is lost on reload
      setSessions(p => p.filter(s => s.createdAt !== sessWithTs._optimisticAt));
      setProfile(p => ({ ...p, points: profile?.points || 0, sessions_count: profile?.sessions_count || 0, streak: profile?.streak || 0 }));
      showToast("❌ SAVE FAILED — CHECK YOUR CONNECTION AND TRY AGAIN");
      return false;
    }
    if (sData?.id && sess.tag) {
      try {
        const tagMap = JSON.parse(localStorage.getItem("sfc_session_tags") || "{}");
        tagMap[sData.id] = sess.tag;
        localStorage.setItem("sfc_session_tags", JSON.stringify(tagMap));
      } catch { /* ignore */ }
    }
    if (sData?.id && sess.notes) {
      try {
        const notesMap = JSON.parse(localStorage.getItem("sfc_session_notes") || "{}");
        notesMap[sData.id] = sess.notes;
        localStorage.setItem("sfc_session_notes", JSON.stringify(notesMap));
      } catch { /* ignore */ }
    }
    // Sync from DB — replaces the optimistic entry with the real row (including id).
    // This also guards against the visibility-change handler racing loadSessions
    // during the insert and wiping the optimistic state before the insert completes.
    await loadSessions(user.id);
    // Check for newly unlocked badges
    try {
      const seenKey = "sfc_seen_badges";
      const seen = new Set(JSON.parse(localStorage.getItem(seenKey)||"[]"));
      const extraData = (() => {
        const bodyLog = JSON.parse(localStorage.getItem("sfc_body_log")||"[]");
        const nl = JSON.parse(localStorage.getItem("sfc_nutrition_log")||"[]");
        const foods = Array.isArray(nl)?nl.reduce((s,d)=>s+(d.items?.length||0),0):0;
        const wl = JSON.parse(localStorage.getItem("sfc_water_log")||"null");
        const water = (wl?.entries||[]).length;
        return { bodyLog:Array.isArray(bodyLog)?bodyLog:[], foods, water };
      })();
      const updatedProfile = { points: newPts, sessions_count: newSessionsCount, streak: newStreak };
      const now = getUnlockedBadges([{ ...sess, createdAt: new Date().toISOString() }, ...sessions], updatedProfile, extraData);
      const newBadges = [...now].filter(id=>!seen.has(id));
      if (newBadges.length) {
        const badge = ACHIEVEMENTS.find(a=>a.id===newBadges[0]);
        if (badge) showToast(`${badge.ico} BADGE UNLOCKED: ${badge.name}!`);
        newBadges.forEach(id=>seen.add(id));
        localStorage.setItem(seenKey, JSON.stringify([...seen]));
      } else {
        showToast(`🏆 SESSION SAVED · +${sess.pts} POINTS`);
      }
    } catch { showToast(`🏆 SESSION SAVED · +${sess.pts} POINTS`); }
    return true;
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
    { id:"home",      ico:"⌂",  l:"HOME"  },
    { id:"train",     ico:"⊞",  l:"TRAIN" },
    { id:"progress",  ico:"⤴",  l:"STATS" },
    { id:"nutrition", ico:"◉",  l:"FUEL"  },
    { id:"feed",      ico:"⚇",  l:"SQUAD" },
    { id:"more",      ico:"···", l:"MORE"  },
  ];

  if (!authReady) return (
    <div style={{ height:"100dvh", background:G.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:24 }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${G.purple},${G.purpleBright})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 36px ${G.purple}88` }}>
        <div style={{ fontFamily:FONT.display, fontSize:30, color:"#fff", letterSpacing:3 }}>SFC</div>
      </div>
      <div style={{ fontFamily:FONT.display, fontSize:13, letterSpacing:5, color:G.textMid, textTransform:"uppercase" }}>SOCIAL FIT CLUB</div>
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:G.purple, animation:`sfcDot 1.2s ease-in-out ${i*0.25}s infinite` }}/>)}
      </div>
      <style>{`@keyframes sfcDot{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
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
    <div style={{ height:"100dvh", background:G.bg, color:G.text, fontFamily:FONT.body, maxWidth:480, margin:"0 auto", position:"relative", userSelect:"none", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <GridBg/>

      {toast && (
        <div style={{ position:"fixed", top:"calc(env(safe-area-inset-top, 0px) + 14px)", left:"50%", transform:"translateX(-50%)", background:G.bg3, border:`1px solid ${G.gold}55`, borderRadius:7, padding:"10px 18px", zIndex:9999, fontFamily:FONT.display, fontSize:13, letterSpacing:2, color:G.gold, boxShadow:`${G.goldGlow}, 0 8px 32px rgba(0,0,0,0.6)`, whiteSpace:"nowrap", textTransform:"uppercase", animation:"toastIn 0.25s ease" }}>{toast}</div>
      )}

      {showOnboarding && <OnboardingModal onDone={() => {
        try { localStorage.setItem("sfc_onboarded", "1"); } catch { /* ignore */ }
        setShowOnboarding(false);
      }}/>}
      {!showOnboarding && showProfileSetup && <ProfileSetupModal
        userId={user?.id}
        onDone={(updates) => {
          try { localStorage.setItem("sfc_profile_setup_done", "1"); } catch { /* ignore */ }
          setShowProfileSetup(false);
          if (updates) setProfile(p => ({ ...p, ...updates }));
          try { if (!localStorage.getItem("sfc_tour_done")) setTimeout(() => setShowTour(true), 400); } catch { /* ignore */ }
        }}
      />}
      {!showOnboarding && !showProfileSetup && showDailyMotiv && <DailyMotivModal onClose={() => {
        const today = new Date().toISOString().slice(0, 10);
        try { localStorage.setItem("sfc_daily_motiv", today); } catch { /* ignore */ }
        setShowDailyMotiv(false);
      }}/>}

      {showTour && !showOnboarding && !showProfileSetup && <GuidedTourOverlay onDone={() => setShowTour(false)}/>}

      {viewingUser && <UserProfileModal user={viewingUser} currentUserId={user?.id} onClose={() => setViewingUser(null)}/>}

      <main style={{ flex:1, overflowY:"auto", overflowX:"hidden", WebkitOverflowScrolling:"touch", paddingBottom:24 }}>
        {tab==="home" && (user?.email?.toLowerCase()===ADMIN_EMAIL ? <AdminHomeScreen/> : <HomeScreen sessions={sessions} leaderboard={leaderboard} onQuickStart={handleQuickStart} showToast={showToast} profile={profile} onViewProfile={u => setViewingUser({ ...u, isMe: false })}/>)}
        {tab==="train" && <TrainScreen showToast={showToast} onSave={handleSave} onDelete={handleDeleteSession} onEdit={handleEditSession} quickStart={quickStartWorkout} onClearQuickStart={()=>setQuickStartWorkout(null)} sessions={sessions} onShareSession={(text) => { setFeedShareText(text); setTab("feed"); }} unit={unit} onShareTemplate={handleShareTemplate}/>}
        {tab==="progress" && <ProgressScreen showToast={showToast} sessions={sessions} profile={profile} unit={unit}/>}
        {tab==="nutrition" && <NutritionScreen showToast={showToast} sessions={sessions}/>}
        {tab==="feed" && <FeedScreen showToast={showToast} profile={profile} sessions={sessions} userId={user?.id} sharedSession={feedShareText} onClearSharedSession={() => setFeedShareText(null)}/>}
        {tab==="more" && <MoreScreen showToast={showToast} profile={profile} onSignOut={handleSignOut} onProfileUpdate={p => setProfile(p)} userId={user?.id} sessions={sessions} muscleScores={calcMuscleScores(sessions)} isAdmin={user?.email?.toLowerCase()===ADMIN_EMAIL} unit={unit} onUnitToggle={() => { const u = unit === "lbs" ? "kg" : "lbs"; setUnit(u); localStorage.setItem("sfc_unit", u); }}/>}
      </main>

      <div style={{ flexShrink:0, position:"relative", zIndex:1 }}>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${G.gold}66,${G.gold},${G.gold}66,transparent)`, boxShadow:`0 0 10px ${G.gold}55` }}/>
        <div data-tour="nav" style={{ background:`linear-gradient(180deg,rgba(6,6,14,0.97) 0%,rgba(8,8,16,1) 100%)`, backdropFilter:"blur(20px)", display:"flex", padding:`8px 0 calc(env(safe-area-inset-bottom, 0px) + 12px)` }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button data-tour={`tab-${t.id}`} key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 0", position:"relative" }}>
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
