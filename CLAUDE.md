# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

No test suite is configured. **Primary deployment target is Vercel** — connect the repo on vercel.com and point it at the `claude/social-fit-club-ui-XeD03` branch; Vite is auto-detected (`npm run build` → `dist/`). `vercel.json` sets `Service-Worker-Allowed: /` and `Cache-Control: no-cache` on `/sw.js`. After any new Vercel domain is added, update **Supabase → Authentication → URL Configuration** (Site URL + Redirect URLs) or auth email links will redirect to the wrong origin.

A legacy GitHub Actions workflow (`/.github/workflows/deploy.yml`) also exists — it uses `peaceiris/actions-gh-pages@v4` to push `dist/` to the `gh-pages` branch with the custom domain `socialfitclub26.com`. Both can coexist.

## Architecture

The entire app lives in a **single file**: `src/App.jsx` (~5270 lines). There are no separate component files, no routing library, no state management library, and no CSS modules — all styling is inline CSS-in-JS.

`SocialFitClubInner` contains all app logic and is wrapped by an `ErrorBoundary` class component (exported as `SocialFitClub`). Unhandled render errors show a styled "SOMETHING WENT WRONG" screen with a reload button.

### Backend: Supabase

The client is initialised at the top of `App.jsx` with hardcoded public keys (anon key only — safe for client-side use).

**Tables:**

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id`, `username`, `avatar_initials`, `points`, `streak`, `sessions_count` | Read-all, write-own RLS |
| `sessions` | `user_id`, `name`, `exercises` (jsonb), `sets`, `volume`, `points`, `date`, `created_at` | Write/read-own RLS |

Real-time is enabled on `profiles` for the live leaderboard. If `sessions_count` is missing:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sessions_count integer NOT NULL DEFAULT 0;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

**Edge Functions** (all require `ANTHROPIC_API_KEY` set as a Supabase secret):

| Function | Input | Output |
|---|---|---|
| `analyze-meal` | `{ image: base64jpeg }` | `{ name, cal, pro, carb, fat, confidence }` |
| `ai-coach` | `{ sessions, profile, muscleScores }` | `{ greeting, todayFocus, recommendations[], motivational }` |
| `form-check` | `{ frames: base64jpeg[], exercise: string }` | `{ score, summary, strengths[], corrections[], cues[], safety }` |

Deploy a new function with `supabase functions deploy <name>`. All three use `supabase.functions.invoke(name, { body })` on the client side.

### Auth flow

`LoginScreen` handles sign-in, sign-up (with `display_name` passed via `user_metadata`), forgot-password (`supabase.auth.resetPasswordForEmail`), and email confirmation with resend.

`ensureProfile` fires on every `SIGNED_IN` event — reads `user.user_metadata.display_name` for the username, creates the `profiles` row if missing, then loads sessions and leaderboard.

`ResetPasswordScreen` is shown when `onAuthStateChange` fires a `PASSWORD_RECOVERY` event (user clicked reset link in email). It calls `supabase.auth.updateUser({ password })` and returns to the main app on success.

Render guards (in order): blank screen while `authReady` is false → `<ResetPasswordScreen/>` when `passwordRecovery` is true → `<LoginScreen/>` when no user → "CONNECTION ERROR" screen with Retry button when `!profile && dataLoadFailed` (network errors in `loadProfile`/`loadSessions` set this flag; a missing profile row — Postgres error `PGRST116` — does not) → blank while profile loads → main app.

### Navigation model

`SocialFitClubInner` owns all top-level state and renders one screen at a time based on a `tab` string (`home`, `train`, `progress`, `nutrition`, `feed`, `more`). No router. Tab switching calls `setTab(id)`. Bottom nav labels: HOME, TRAIN, STATS, FUEL, SQUAD, MORE (not the screen names).

Root state passed as props:

| Prop | Type | Used by |
|---|---|---|
| `sessions` | `{ id, name, exs, sets, vol, pts, date, createdAt, tag? }[]` | Home, Train, Progress, Feed, More |
| `profile` | Supabase profiles row | Home, Progress, Feed, More |
| `leaderboard` | sorted profiles array with `{ rank, name, pts, sessions, streak, av, isMe }` | Home |

`tag` on sessions is a `SESSION_TYPES` id string — not stored in Supabase, persisted in `sfc_session_tags` localStorage and merged in on `loadSessions`.

### Screen components and key props

| Component | Key props |
|---|---|
| `HomeScreen` | `sessions`, `leaderboard`, `profile`, `onQuickStart`, `showToast` |
| `TrainScreen` | `sessions`, `onSave`, `onDelete`, `onEdit`, `quickStart`, `onClearQuickStart`, `showToast` |
| `ProgressScreen` | `sessions`, `profile`, `showToast` |
| `NutritionScreen` | `showToast` |
| `FeedScreen` | `profile`, `sessions`, `showToast` |
| `MoreScreen` | `profile`, `sessions`, `muscleScores`, `onSignOut`, `showToast`, `isAdmin` |

`isAdmin` is computed as `user?.email?.toLowerCase() === ADMIN_EMAIL` (module-level constant `"harrisj1025@gmail.com"`) and passed from `SocialFitClubInner`.

### Data flow for saving / editing / deleting a workout

`handleSave` in `SocialFitClubInner`:
1. Optimistic update: prepend `{ ...sess, createdAt: new Date().toISOString() }` to `sessions`, bump `profile.points` + `profile.sessions_count`, re-sort leaderboard
2. Parallel Supabase writes: `sessions.insert(...).select("id").single()` + `profiles.update`
3. After insert resolves, if `sess.tag` is set, save `{ [supabaseId]: tag }` to `sfc_session_tags` in localStorage
4. Real-time subscription on `profiles` triggers `loadLeaderboard` for all connected clients

`loadSessions` merges tags from `sfc_session_tags` and prunes stale entries for deleted sessions.

`handleDeleteSession(sessId)`: optimistic removal from `sessions` + decrements `profile.points`/`sessions_count`, then `sessions.delete().eq("id", sessId)` + `profiles.update`.

`handleEditSession(sessId, newName)`: optimistic name update locally, then `sessions.update({ name }).eq("id", sessId)`.

### localStorage keys

| Key | Content | Expires |
|---|---|---|
| `sfc_nutrition_log` | `{ date: "YYYY-MM-DD", items: [] }` | Auto-cleared when date changes |
| `sfc_wip_session` | `{ name, exs, tag }` in-progress workout | Cleared on save |
| `sfc_feed` | full feed array (posts + like counts + `commentList`) | Never |
| `sfc_streak_freezes` | string-encoded integer | Never |
| `sfc_goals` | `{ weekly, volume, streak }` — user-set numeric targets | Never |
| `sfc_pledge` | string-encoded integer 1–7, weekly session commitment | Never |
| `sfc_body_log` | `[{ date, weight, bf, photo? }]` body check-in history, newest first | Never |
| `sfc_ble_device` | last paired Bluetooth device name | Never |
| `sfc_supplement_log` | `{ date: "YYYY-MM-DD", items: [] }` supplement log | Auto-cleared when date changes |
| `sfc_notif_prefs` | `{ enabled, reminderTime, streakAlert }` notification settings | Never |
| `sfc_session_tags` | `{ [supabaseSessionId]: typeId }` workout type tag map | Never (pruned on loadSessions) |
| `sfc_water_log` | `{ date: "YYYY-MM-DD", entries: [oz, ...] }` | Auto-cleared when date changes |
| `sfc_water_goal` | number (daily oz target, default 64) | Never |
| `sfc_macro_coach` | MacroCoach setup + history (see MacroCoachModal) | Never |
| `sfc_challenges` | `[{ id, type, exercise?, target, created, deadline, completed, completedAt }]` | Never |
| `sfc_home_widgets` | `{ order: string[], hidden: string[] }` widget display preferences | Never |
| `sfc_meal_templates` | `[{ id, name, items: [{ name, cal, pro, carb, fat, brand? }] }]` | Never |

### Module-level helpers

- **`calcWeeklyVolume(sessions)`** — 7-element array (Mon–Sun) of volume for the current calendar week. Used by `HomeScreen`.
- **`calcBestWeekVolume(sessions)`** — highest total volume in any Mon–Sun week. Used by `ProgressScreen`.
- **`calcMuscleScores(sessions)`** → `{ muscleKey: 0–100 }`. Excludes warmup sets. Passed to `MoreScreen` for AI Coach and heat map. Also used by TrainScreen to derive `overloadedMuscles`.
- **`getHeatColor(score)`** → blue→yellow→red via `lerpColor`. Used by `MuscleHeatMap`.
- **`getLastExercisePerformance(exName, sessions)`** → `{ date, sets }` of the most recent session containing that exercise. Excludes warmup sets. Used by TrainScreen LAST SESSION strip.
- **`progressWeight(w)`** → rounds `w + 5` to nearest 2.5 lbs. Used for progressive overload suggestions.
- **`getExerciseHistory(exName, sessions)`** → chronological array of `{ date, weight, reps, est1rm }` (best non-warmup set per session). Powers the PRs drill-down strength chart.
- **`compressImage(file)`** → Promise resolving to base64 JPEG (max 800px, 65% quality). Rejects on `onerror`. Used by ProgressScreen progress photo capture.
- **`extractFrames(videoFile)`** → Promise resolving to `string[]` — three base64 JPEG frames sampled at 20%, 50%, 80% of video duration (max 640px), extracted via off-screen `<video>` + `<canvas>`. Rejects on video load error. Used by `FormCheckModal`.
- **`calcTDEE(sex, age, heightIn, weightLbs, activity)`** → Mifflin-St Jeor TDEE. Used by `MacroCoachModal`.
- **`calcMacrosFromCalories(calories, weightLbs)`** → `{ protein, fat, carbs }`. Used by `MacroCoachModal`.
- **`getActiveMacroTargets()`** → returns Macro Coach targets if setup complete, else falls back to `MACROS_GOAL`. Used by `NutritionScreen` daily summary.
- **`getChallengeProgress(ch, sessions)`** → `{ current, pct, unit }`. Computes progress for a challenge since its `created` date: `"pr"` type uses best est1rm, `"vol"` uses cumulative volume, `"sessions"` uses session count.

### TrainScreen sub-tabs and set types

Four sub-tabs: `TRACK`, `HISTORY`, `PRs`, `PROGRAMS`.

**Recovery alert** — inside the TRACK sub-tab, `overloadedMuscles` is derived each render: for each exercise in the current session, look up `EXERCISE_MUSCLE_MAP[ex.name]` and collect muscles with `factor >= 0.6`; filter those where `calcMuscleScores(sessions)[muscle] > 80`. If any are found and `restWarnDismissed` is false, an orange banner is shown above the exercise list. Dismissed per-session via local `restWarnDismissed` state.

**Plate calculator** — `PlateCalculatorModal` is opened by the ⚖️ PLATES button in the Training Hub header. Greedy algorithm: for a given target weight and bar weight, iterates `[45, 35, 25, 10, 5, 2.5]` lb plates and assigns as many of each as fit per side. Renders a visual bar diagram and per-side plate list. Bar presets: STANDARD (45 lb), WOMEN'S (35 lb), TRAP/HEX (60 lb), EZ-CURL (25 lb).

**Set types** — every set has a `type` field: `"working"` (default, gold badge), `"warmup"` (blue `W` badge), `"drop"` (red `D` badge). Tapping the badge cycles through types. Warmup sets are excluded from: `totSets`, `totVol`, `pts`, `calcPRs`, live PR detection, `getLastExercisePerformance`, `getExerciseHistory`, `calcMuscleScores`, and `MuscleHeatMap`. Drop sets count as working volume.

**Progressive overload** — when an exercise is selected via `ExercisePicker` or autocomplete (`selectExercise`), the last session's sets are loaded with weights progressed by `+5 lbs`. A LAST SESSION strip shows the previous performance with "+5 LBS ⬆" and "SAME" quick-load buttons.

**Session type tagging** — `SESSION_TYPES` constant (Push, Pull, Legs, Upper, Lower, Full Body, Cardio, Core, Recovery, each with a unique color). `sessTag` state drives chip picker in TRACK tab. Filter chips on HISTORY tab only appear once at least one session is tagged.

**PRs drill-down** — tapping a PR card opens a detail view with: gold PR badge, since-first gain, SVG 1RM trend chart (area fill + polyline + labeled endpoints), session-by-session history list, "TRAIN THIS EXERCISE" button.

### ProgressScreen internal tabs

Three tabs via `activeTab` state:
- **`stats`**: real computed stats + today's water (`sfc_water_log`) + body composition.
- **`streak`**: streak counter, freeze mechanic (`sfc_streak_freezes`), milestone road.
- **`heatmap`**: `MuscleHeatMap` SVG component (`viewBox="0 0 200 440"`).

**Body composition** — `sfc_body_log` entries are `{ date, weight, bf?, photo? }`. The check-in form includes an optional photo capture (`<input type="file" accept="image/*" capture="environment">`), compressed via `compressImage`. Thumbnails shown in history; tap opens a full-screen lightbox. When ≥2 entries have photos, a BEFORE / AFTER comparison card appears.

**Water tracker** — quick-add buttons (8, 12, 16, 20 oz) + custom input. Daily total shown in stats grid. State: `waterEntries` (array of oz values per entry, supports undo via pop), `waterGoal` (from `sfc_water_goal`).

### HomeScreen — swipeable widgets

`SwipeWidget` is a module-level component wrapping each home card. Pointer events detect horizontal swipes: dragging left >90 px triggers a dismissing animation and calls `onDismiss`. Header has ↑/↓ reorder buttons and a ✕ HIDE button. Widget order and hidden IDs are persisted to `sfc_home_widgets`.

`HomeScreen` state:
- `widgetOrder` — `string[]` of widget IDs (`"quickstart"`, `"leaderboard"`), initialized from `sfc_home_widgets`
- `hiddenWidgets` — `string[]` of currently hidden IDs
- Dismissed widgets appear in a HIDDEN WIDGETS restore section at the bottom of the screen

`touchAction: "pan-y"` is set on `SwipeWidget` so vertical scroll is handled natively by the browser while horizontal swipes are captured by pointer events.

### MoreScreen modals

| Modal | Tile | localStorage | Props |
|---|---|---|---|
| `AiCoachModal` | AI COACH | — | `profile`, `sessions`, `muscleScores`, `onClose` |
| `GoalsModal` | GOALS | `sfc_goals` | `sessions`, `profile`, `onClose` |
| `WeeklyReportModal` | WEEKLY REPORTS | — | `sessions`, `muscleScores`, `onClose` |
| `AccountabilityModal` | ACCOUNTABILITY | `sfc_pledge` | `sessions`, `profile`, `onClose` |
| `HealthConnectModal` | HEALTH CONNECT | `sfc_ble_device` | `onClose` |
| `MacroCoachModal` | MACRO COACH | `sfc_macro_coach` | `onClose` |
| `AdminDashboardModal` | ADMIN DASHBOARD (admin only) | — | `onClose` |
| `NotificationsModal` | NOTIFICATIONS | `sfc_notif_prefs` | `sessions`, `onClose` |
| `FormCheckModal` | FORM CHECK | — | `onClose` |

`MacroCoachModal` has a multi-step setup wizard (sex, age, height, weight, activity, goal) that calculates TDEE and macro splits, stores results in `sfc_macro_coach`, and runs a weekly check-in adjustment algorithm. Uses `const [nowMs] = useState(() => Date.now())` to avoid the `react-hooks/purity` ESLint error — do not replace with inline `Date.now()`.

`FormCheckModal` — video file picker (`accept="video/*" capture="environment"`, max 100 MB), calls `extractFrames()` to get 3 frames, shows a thumbnail strip, then calls the `form-check` Edge Function. Results view: colour-coded score ring (green ≥8, gold ≥6, red <6), optional safety warning, strengths list, correction cards (`{ issue, fix }`), and purple coaching-cue chips.

The Merch tile shows a "COMING SOON" toast.

### Health Connect (Web Bluetooth)

`HealthConnectModal` uses `navigator.bluetooth.requestDevice` filtering for the `heart_rate` BLE GATT service. On connect it subscribes to `heart_rate_measurement` characteristic notifications and updates live BPM state. Requires Chrome/Edge; gracefully shows "BROWSER NOT SUPPORTED" for Safari/Firefox. Last paired device name persisted to `sfc_ble_device`.

### Admin Dashboard

`AdminDashboardModal` fetches all rows from `profiles` (read-all RLS) and displays: platform overview stats (total users, active users, total sessions, total points, avg sessions, users on streaks), engagement bars (activation/streak/churn rates), top performer card, and a full ranked user table. Visible only when `isAdmin` is true in `MoreScreen`.

### FeedScreen

Posts stored in `sfc_feed` as:
```js
{ id, user, av, time, txt, likes, liked, commentList: [],
  type, tag, reactions: { "🔥":n, ... }, myReactions: [],
  challengeId? }
```
`type` is `"post"` | `"pr"` | `"milestone"` | `"challenge"`. Comments stored in `commentList` as `[{ user, av, txt, time }]`.

**Emoji reactions** — `REACTIONS = ["🔥","💪","👊","⚡","🙌"]`. `toggleReaction(id, emoji)` increments/decrements the count on a post and toggles the emoji in `myReactions`. Reactions with `myReactions` membership are highlighted gold.

**Challenge system** — `challenges` state (from `sfc_challenges`) is an array of `{ id, type, exercise?, target, created, deadline, completed, completedAt }`. `type` is `"pr"` | `"vol"` | `"sessions"`. A `useEffect` on `sessions` auto-completes challenges and posts a MILESTONE to the feed when the target is reached. The compose sheet has a 2×2 type grid (POST / PR / MILESTONE / CHALLENGE); selecting CHALLENGE shows `newChalType` sub-buttons and a target input. `getChallengeProgress()` is used to render the progress bar and countdown on challenge post cards.

`FeedScreen` receives `sessions` as a prop (needed for challenge progress computation and auto-complete detection).

### NutritionScreen — calorie ring and meal templates

**Calorie budget ring** — the summary card is centred on a `RingMeter` (size 140, strokeW 10). Ring color: gold when <85% of daily budget, orange at 85–99%, red when over. Shows calories remaining (or over) inside the ring; "consumed / target KCAL" label below. Uses `getActiveMacroTargets()` for the budget, showing an `⚡ ADAPTIVE` badge when Macro Coach is active.

**Meal templates** — `mealTemplates` state (from `sfc_meal_templates`). A horizontally scrollable MY TEMPLATES strip appears above the meal log sections when at least one template is saved. Each card shows the template name, item count, total kcal, protein, and a LOG ◆ button that adds all items to the currently selected meal. A 💾 button in each meal header opens an inline name-input; pressing Enter saves current meal items as a new template. Templates can be deleted with a ✕ button on the card.

### NutritionScreen — external integrations

- **Barcode scan**: `BarcodeDetector` API (Chrome/Edge only; falls back to manual entry) → Open Food Facts API → UPC Item DB secondary API → `BARCODE_DB` (26-product local fallback). If still not found, `barcode_not_found` state renders a manual macro entry form. `scanTarget` (`"food"` | `"supplement"`) controls which log receives the result.
- **Meal scan**: captures live video to `<canvas>` → JPEG base64 → `analyze-meal` Edge Function → Claude Haiku vision.

### NutritionScreen tabs

Four tabs: `📋 LOG` (food by meal), `📷 SCAN` (camera AI + barcode), `🔍 SEARCH` (food DB with category filter), `💊 SUPPS` (supplement tracker).

The `scanTarget` state (`"food"` | `"supplement"`) controls where scan results are routed. When `"supplement"`, only the barcode button is shown (no meal photo scan), and results go to `suppLog` / `sfc_supplement_log`. `SUPPLEMENTS_DB` has 25 entries.

### PWA / Icons

`public/manifest.json` enables home-screen installation. Key fields: `display: "standalone"`, `orientation: "portrait"`, `background_color`/`theme_color` both `#06060E`.

Icons live in `public/`: `favicon.svg` (vector badge logo, also the browser tab icon), `icon-192.png` (home screen), `icon-512.png` (splash / maskable). `index.html` wires them up via `<link rel="manifest">`, `<link rel="apple-touch-icon">`, and the iOS-specific meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`).

**Regenerating PNG icons** — if `favicon.svg` or `public/logo-source.png` changes, run a one-off Node script using Playwright (already a dev dependency) to render at 192×192 and 512×512 and write back to `public/icon-{size}.png`. Pattern:
```js
import { chromium } from "playwright";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
// load SVG via data URI into a full-bleed <img> on a #06060E page, screenshot, writeFileSync
```

### Service Worker

`public/sw.js` is registered in `src/main.jsx` on every app load. It listens for `postMessage` events:
- `SCHEDULE_NOTIFICATION` — schedules a `setTimeout` and calls `self.registration.showNotification()`
- `CANCEL_NOTIFICATION` — clears the pending timer and closes any existing notification with that tag

### Design tokens

- **`G`** — full colour palette (gold `#FDB927`, purple `#552583`, backgrounds, text tints, glow shadow strings)
- **`FONT`** — three stacks (`display` = Bebas Neue, `body` = Barlow Condensed, `mono`)

Never hardcode colours or fonts — always reference `G` and `FONT`.

### Styling conventions

- All styles are inline objects on the `style` prop
- Glow effects use `boxShadow` with values from `G` (e.g. `G.goldGlow`, `G.purpleGlow`)
- Animations declared in a `<style>` tag at the bottom of `SocialFitClubInner`'s render
- No CSS classes except the minimal reset in `src/index.css`
- Max width `480px`, `margin: 0 auto`, mobile-first; `viewport-fit=cover` in `index.html`

### Shared UI atoms

`ChromeCard`, `NeonBtn`, `NeonOutlineBtn`, `SectionLabel`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`, `RestTimer`, `TogglePill`, `ExercisePicker`, `SwipeWidget`, `PlateCalculatorModal` — all defined in `App.jsx`.

`ExercisePicker` is a bottom-sheet modal used in `TrainScreen`. It receives `{ onSelect, onClose }` and renders a search bar + category chips (from `EXERCISE_CATS`) + a filtered list of `EXERCISES` with primary muscle label and category badge. Opens via the ⊞ button next to each exercise name input.

`SwipeWidget` wraps each dismissible home tile. Uses pointer events for horizontal swipe detection; `touchAction: "pan-y"` lets the browser handle vertical scroll. See HomeScreen section above.

`PlateCalculatorModal` is a standalone modal (not a MoreScreen tile). Opened from the TrainScreen header ⚖️ PLATES button. Accepts `{ onClose, initialWeight }`.

### Module-level constants

`ADMIN_EMAIL`, `REACTIONS`, `EXERCISES`, `EXERCISE_CATS`, `EX_CAT_LOOKUP`, `FOODS`, `FOOD_CATS`, `BARCODE_DB`, `SUPPLEMENTS_DB`, `SUPP_TYPES`, `SUPP_TYPE_COLOR`, `MACROS_GOAL`, `SESSION_TYPES`, `DAYS_SHORT`, `EXERCISE_MUSCLE_MAP`, `MUSCLE_LABELS`, `MUSCLE_SUGGEST`, `FEED_DATA` (default feed seed), `REST_OPTIONS`, `MACRO_COACH_KEY`.

`SESSION_TYPES` is `[{ id, label, color }]` — 9 workout categories each with a hex color used for chip backgrounds and history badges.

### ESLint rules to watch

- `react-hooks/purity` — prohibits `Date.now()` / `Math.random()` directly in render. Use `useState(() => Date.now())` to capture a stable value at mount.
- `react-hooks/static-components` — component definitions must not be inside another component's render function.
- `react-hooks/exhaustive-deps` — all state variables referenced inside `useEffect` must be in the dependency array.
- `react-hooks/refs` — prohibits `ref.current = value` directly in render; wrap in `useEffect`.
- `no-unused-vars` — unused destructured parameters (e.g. `(s, i)` where `i` is unused) must be removed.
- `react-hooks/set-state-in-effect` — calling `setState` synchronously inside a `useEffect` body triggers cascading renders. Wrap in `setTimeout(..., 0)` to defer out of the effect body.

### Known implementation invariants

- **Stable callback refs**: `RestTimer` uses `useRef` + `useEffect(() => { ref.current = onDone; })` (no deps) to keep the `onDone` callback current without restarting the interval on every parent re-render. Do not replace with a direct dependency.
- **Streak calculation in `handleSave`**: compares the most recent existing session's `createdAt` date against today/yesterday to decide whether to extend or reset the streak. This must remain before the optimistic state update.
- **Sign-out cleanup**: `handleSignOut` clears 16 `sfc_*` localStorage keys. `sfc_home_widgets` is intentionally excluded (it's a device-level UI preference, not user data).
- **Blob URL lifecycle in `FormCheckModal`**: uses `previewUrlRef` to revoke the previous object URL both when a new file is picked and on unmount, preventing memory leaks.
- **Challenge auto-complete**: the `useEffect` in `FeedScreen` that watches `sessions` compares current progress against targets and only fires the completion logic once (checks `!ch.completed` before updating). Do not add `challenges` to the dependency array or it will loop.
