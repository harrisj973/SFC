# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

No test suite is configured. **Smoke tests** can be run against the dev server with Playwright:

```bash
npm run dev          # start dev server first
node test-bugcheck.mjs   # 53-check headless browser sweep (uses ?demo=1 mode)
```

`test-bugcheck.mjs` pre-sets `sfc_onboarded`, `sfc_profile_setup_done`, `sfc_tour_done`, and `sfc_daily_motiv` in localStorage via `ctx.addInitScript()` before navigation. Without `sfc_onboarded`/`sfc_profile_setup_done`, `OnboardingModal` and `ProfileSetupModal` block all interaction in a fresh headless session (they suppress `DailyMotivModal`, which the test expects to appear first). Sub-tab clicks in `ProgressScreen` must use `page.locator("button", { hasText: /^LABEL$/i })` — `page.click("text=LABEL")` hits the screen tagline div first because CSS `text-transform: uppercase` makes it match before the actual button. Exercise picker item clicks require `page.evaluate()` JS dispatch — the picker's scroll-container backdrop intercepts pointer events and causes Playwright's `locator.click()` to time out: `await page.evaluate(() => { const el = [...document.querySelectorAll("div")].find(d => d.textContent.trim() === "Exercise Name"); el?.click(); })`.

**Primary deployment target is Vercel** — production branch is `main`; Vite is auto-detected (`npm run build` → `dist/`). `vercel.json` sets `Service-Worker-Allowed: /` and `Cache-Control: no-cache` on `/sw.js`. The custom domain is `socialfitclub26.com` (purchased on Vercel, auto-configured DNS). After any new Vercel domain is added, update **Supabase → Authentication → URL Configuration** (Site URL + Redirect URLs) or auth email links will redirect to the wrong origin.

A legacy GitHub Actions workflow (`/.github/workflows/deploy.yml`) also exists — it uses `peaceiris/actions-gh-pages@v4` to push `dist/` to the `gh-pages` branch with the custom domain `socialfitclub26.com`. Both can coexist.

## Architecture

The entire app lives in a **single file**: `src/App.jsx` (~7200 lines). There are no separate component files, no routing library, no state management library, and no CSS modules — all styling is inline CSS-in-JS.

`SocialFitClubInner` contains all app logic and is wrapped by an `ErrorBoundary` class component (exported as `SocialFitClub`). Unhandled render errors show a styled "SOMETHING WENT WRONG" screen with a reload button.

### Backend: Supabase

The client is initialised at the top of `App.jsx` with hardcoded public keys (anon key only — safe for client-side use).

**Tables:**

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id`, `username`, `avatar_initials`, `avatar_url`, `points`, `streak`, `sessions_count`, `age`, `sex`, `location` | Read-all, write-own RLS |
| `sessions` | `user_id`, `name`, `exercises` (jsonb), `sets`, `volume`, `points`, `date`, `created_at` | Authenticated users can read any row (for UserProfileModal PRs); write-own RLS |
| `follows` | `follower_id`, `following_id` | Write-own RLS |
| `posts` | `user_id`, `type`, `txt`, `tag`, `image_url`, `likes`, `comment_count`, `created_at` | Public read, write-own RLS |
| `post_likes` | `post_id`, `user_id` | Write-own RLS |
| `post_comments` | `post_id`, `user_id`, `txt`, `created_at` | Public read, write-own RLS |

Real-time is enabled on `profiles` for the live leaderboard. Required migrations:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sessions_count integer NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sex text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Unique username (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx ON profiles (lower(username));

-- Allow any authenticated user to read sessions (for UserProfileModal PRs)
CREATE POLICY "Authenticated users can read any sessions"
ON sessions FOR SELECT TO authenticated USING (true);

ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url text;
```

Social tables (create once):
```sql
CREATE TABLE IF NOT EXISTS follows (
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, following_id)
);
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'post',
  txt text,
  tag text,
  image_url text,
  likes integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS post_likes (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  txt text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

**Supabase Storage** — two public buckets:

`avatars` — profile photos, stored as `{userId}.jpg` (upserted). Required RLS:
```sql
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND name = auth.uid() || '.jpg');
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND name = auth.uid() || '.jpg');
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');
```

`post-images` — Squad Feed photo posts, stored as `{userId}/{uuid}.jpg`. Must be set to **Public** in the dashboard. Required RLS:
```sql
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'post-images');
CREATE POLICY "Public can read post images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'post-images');
```

**Edge Functions** (`analyze-meal` and `form-check` require `ANTHROPIC_API_KEY` set as a Supabase secret):

| Function | Auth | Input | Output |
|---|---|---|---|
| `analyze-meal` | anon JWT | `{ image: base64jpeg }` | `{ name, cal, pro, carb, fat, confidence }` |
| `form-check` | anon JWT | `{ frames: base64jpeg[], exercise: string }` | `{ score, summary, strengths[], corrections[], cues[], safety }` |
| `delete-account` | user JWT | (none) | `{ success: true }` |

All three functions are deployed. Deploy with `supabase functions deploy <name>` or paste the source into **Supabase → Edge Functions → New Function** in the dashboard. `analyze-meal` and `form-check` use `supabase.functions.invoke(name, { body })`. `delete-account` uses the service role key internally to delete `sessions` rows, `profiles` row, avatar from `avatars` storage, and then `admin.auth.admin.deleteUser()`; the client only needs to pass the user JWT.

**Transactional email** — configured via Resend SMTP (`smtp.resend.com:465`, username `resend`). Domain `socialfitclub26.com` is verified in Resend. Supabase sends auth emails (confirm signup, reset password) from `support@socialfitclub26.com` via custom SMTP in **Supabase → Project Settings → Authentication → SMTP**. Support contact in the app is `sfcsupport26@gmail.com`.

**AI Coach is local-only** — `AiCoachModal` does not call the `ai-coach` Edge Function. Instead `buildLocalCoaching()` generates personalized recommendations entirely client-side from `muscleScores`, `sessions`, and `profile` (streak, session count, `age`, `sex`). Age 40+ gets age-specific recovery advice; female sex gets female-specific fueling advice; age 50+ gets protein/creatine advice. The Edge Function source remains in `supabase/functions/ai-coach/` but is not called. Do not revert to the Edge Function call without verifying it is deployed and the API key is set.

### Auth flow

`LoginScreen` handles sign-in, sign-up (with `display_name` passed via `user_metadata`), forgot-password (`supabase.auth.resetPasswordForEmail`), and email confirmation with resend. Sign-in has a **show/hide password toggle** (`showPw` state) and a **Remember Me checkbox** (`rememberMe` state) — when checked, the email is persisted to `sfc_remembered_email` in localStorage and pre-filled on next visit.

`ensureProfile` fires on every `SIGNED_IN` event — reads `user.user_metadata.display_name` for the username, creates the `profiles` row if missing, then loads sessions and leaderboard. On a `23505` unique constraint violation (duplicate username), it retries with a 4-digit numeric suffix.

`ResetPasswordScreen` is shown when `onAuthStateChange` fires a `PASSWORD_RECOVERY` event (user clicked reset link in email). It calls `supabase.auth.updateUser({ password })` and returns to the main app on success.

Render guards (in order): blank screen while `authReady` is false → `<ResetPasswordScreen/>` when `passwordRecovery` is true → `<LoginScreen/>` when no user → "CONNECTION ERROR" screen with Retry button when `!profile && dataLoadFailed` (network errors in `loadProfile`/`loadSessions` set this flag; a missing profile row — Postgres error `PGRST116` — does not) → blank while profile loads → main app with overlay stack: `OnboardingModal` (zIndex 850) → `ProfileSetupModal` (zIndex 820) → `DailyMotivModal` (zIndex 800). `DailyMotivModal` is suppressed while onboarding or profile setup is active.

`loadProfile` uses a **cascading fallback** SELECT: tries the full column set first (`avatar_url`, `sessions_count`, `age`, `sex`, `location`, etc.), then retries with progressively simpler queries if a column doesn't exist yet. This prevents CONNECTION ERROR when the database schema is behind the code. Only sets `dataLoadFailed` if the minimal baseline query also fails.

**Demo mode** — appending `?demo=1` to the URL bypasses Supabase auth entirely and seeds the app with hardcoded sessions, profile, and leaderboard. Controlled by the module-level `_D` constant. The auth useEffect and real-time leaderboard subscription both guard with `if (_D) return`. Used by `test-bugcheck.mjs` to run headless tests without a live backend.

### Navigation model

`SocialFitClubInner` owns all top-level state and renders one screen at a time based on a `tab` string (`home`, `train`, `progress`, `nutrition`, `feed`, `more`). No router. Tab switching calls `setTab(id)`. Bottom nav labels: HOME, TRAIN, STATS, FUEL, SQUAD, MORE (not the screen names).

Root state passed as props:

| Prop | Type | Used by |
|---|---|---|
| `sessions` | `{ id, name, exs, sets, vol, pts, date, createdAt, tag? }[]` | Home, Train, Progress, Feed, More |
| `profile` | Supabase profiles row | Home, Progress, Feed, More |
| `leaderboard` | sorted profiles array with `{ rank, id, name, pts, sessions, streak, av, url, isMe }` | Home |

`tag` on sessions is a `SESSION_TYPES` id string — not stored in Supabase, persisted in `sfc_session_tags` localStorage and merged in on `loadSessions`.

`leaderboard` items include `id` (the profile UUID) so tapping a leaderboard row can open `UserProfileModal`. The `id` is included in `loadLeaderboard`.

### Screen components and key props

| Component | Key props |
|---|---|
| `HomeScreen` | `sessions`, `leaderboard`, `profile`, `onQuickStart`, `showToast`, `onViewProfile` |
| `TrainScreen` | `sessions`, `onSave`, `onDelete`, `onEdit`, `quickStart`, `onClearQuickStart`, `showToast` |
| `ProgressScreen` | `sessions`, `profile`, `showToast` |
| `NutritionScreen` | `showToast` |
| `FeedScreen` | `profile`, `sessions`, `showToast`, `userId` |
| `MoreScreen` | `profile`, `sessions`, `muscleScores`, `onSignOut`, `onProfileUpdate`, `userId`, `showToast`, `isAdmin` |

`isAdmin` is computed as `user?.email?.toLowerCase() === ADMIN_EMAIL` (module-level constant `"harrisj1025@gmail.com"`) and passed from `SocialFitClubInner`.

**Admin home screen** — when `isAdmin` is true, the `home` tab renders `AdminHomeScreen` instead of `HomeScreen`. Regular users are completely unaffected. `AdminHomeScreen` is a full-screen version of the admin dashboard (no modal chrome, no close button, has a REFRESH button). The data fetching and content rendering are extracted into two shared pieces:
- `useAdminData()` — custom hook that fetches all profiles with cascading fallback for missing `sessions_count` column
- `AdminDashboardContent({ data, loading, error, load })` — pure render component shared by both `AdminHomeScreen` and `AdminDashboardModal`

`AdminDashboardModal` in MoreScreen still works unchanged — it now uses `useAdminData()` + `AdminDashboardContent` internally.

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
| `sfc_nutrition_log` | `[{ date: "YYYY-MM-DD", items: [] }, ...]` — rolling 30-day history array, newest first. Migrates old single-day object format automatically on load. | Never (30-day rolling) |
| `sfc_wip_session` | `{ name, exs, tag }` in-progress workout | Cleared on save |
| `sfc_streak_freezes` | string-encoded integer | Never |
| `sfc_goals` | `{ weekly, volume, streak }` — user-set numeric targets | Never |
| `sfc_body_log` | `[{ date, weight, bf, photo? }]` body check-in history, newest first | Never |
| `sfc_ble_device` | last paired Bluetooth device name | Never |
| `sfc_supplement_log` | `[{ date: "YYYY-MM-DD", items: [] }, ...]` — same rolling 30-day format as `sfc_nutrition_log`. | Never (30-day rolling) |
| `sfc_notif_prefs` | `{ enabled, reminderTime, streakAlert }` notification settings | Never |
| `sfc_session_tags` | `{ [supabaseSessionId]: typeId }` workout type tag map | Never (pruned on loadSessions) |
| `sfc_water_log` | `{ date: "YYYY-MM-DD", entries: [oz, ...] }` | Auto-cleared when date changes |
| `sfc_water_goal` | number (daily oz target, default 64) | Never |
| `sfc_macro_coach` | MacroCoach setup + history (see MacroCoachModal) | Never |
| `sfc_challenges` | `[{ id, type, exercise?, target, created, deadline, completed, completedAt }]` | Never |
| `sfc_home_widgets` | `{ order: string[], hidden: string[] }` widget display preferences | Never |
| `sfc_meal_templates` | `[{ id, name, items: [{ name, cal, pro, carb, fat, brand? }] }]` | Never |
| `sfc_daily_motiv` | `"YYYY-MM-DD"` — date the daily motivational popup was last shown | Auto-cleared on sign-out |
| `sfc_onboarded` | `"1"` — set after user completes or skips the onboarding flow | Never (persists across sign-outs) |
| `sfc_profile_setup_done` | `"1"` — set after user completes or skips the profile setup modal | Never (persists across sign-outs) |
| `sfc_tour_done` | `"1"` — set after user completes or skips the guided feature tour | Never (persists across sign-outs) |
| `sfc_remembered_email` | email string — pre-fills sign-in when Remember Me was checked | Cleared on delete-account; persists across sign-outs |

Note: `sfc_feed` is a legacy key from the old localStorage-backed feed. The current `FeedScreen` is fully Supabase-backed and does not use this key.

### Module-level helpers

- **`calcWeeklyVolume(sessions)`** — 7-element array (Mon–Sun) of volume for the current calendar week. Used by `HomeScreen`.
- **`calcBestWeekVolume(sessions)`** — highest total volume in any Mon–Sun week. Used by `ProgressScreen`.
- **`calcMuscleScores(sessions)`** → `{ muscleKey: 0–100 }`. Excludes warmup sets. Passed to `MoreScreen` for AI Coach and heat map. Also used by TrainScreen to derive `overloadedMuscles`.
- **`getHeatColor(score)`** → blue→yellow→red via `lerpColor`. Used by `MuscleHeatMap`.
- **`getLastExercisePerformance(exName, sessions)`** → `{ date, sets }` of the most recent session containing that exercise. Excludes warmup sets. Used by TrainScreen LAST SESSION strip.
- **`progressWeight(w)`** → rounds `w + 5` to nearest 2.5 lbs. Used for progressive overload suggestions.
- **`getExerciseHistory(exName, sessions)`** → chronological array of `{ date, weight, reps, est1rm }` (best non-warmup set per session). Powers the PRs drill-down strength chart.
- **`compressImage(file)`** → Promise resolving to base64 JPEG (max 800px, 65% quality). Rejects on `onerror`. Used by ProgressScreen progress photo capture and FeedScreen post image upload.
- **`extractFrames(videoFile)`** → Promise resolving to `string[]` — three base64 JPEG frames sampled at 20%, 50%, 80% of video duration (max 640px), extracted via off-screen `<video>` + `<canvas>`. Rejects on video load error. Used by `FormCheckModal`.
- **`calcTDEE(sex, age, heightIn, weightLbs, activity)`** → Mifflin-St Jeor TDEE. Used by `MacroCoachModal`.
- **`calcMacrosFromCalories(calories, weightLbs)`** → `{ protein, fat, carbs }`. Used by `MacroCoachModal`.
- **`getActiveMacroTargets()`** → returns Macro Coach targets if setup complete, else falls back to `MACROS_GOAL`. Used by `NutritionScreen` daily summary.
- **`getChallengeProgress(ch, sessions)`** → `{ current, pct, unit }`. Computes progress for a challenge since its `created` date: `"pr"` type uses best est1rm, `"vol"` uses cumulative volume, `"sessions"` uses session count.
- **`timeAgo(ts)`** → Instagram-style relative timestamp string (e.g. `"3H AGO"`, `"2D AGO"`). Used by FeedScreen post cards and comment threads.

### TrainScreen sub-tabs and set types

Four sub-tabs: `TRACK`, `HISTORY`, `PRs`, `PROGRAMS`.

**Programs** — `PROGRAMS_DATA` is a module-level constant with 4 complete workout programs (each has `id`, `name`, `goal`, `days`, `duration`, `level`, `color`, and `schedule: [{ day, name, exercises: [{ name, sets, reps }] }]`). Tapping a program card opens `ProgramDetailModal` (full-screen, not a bottom sheet): shows goal, a 3-stat grid (days/duration/level), a weekly schedule strip with day selector, an exercise list for the selected day, and a "LOG DAY X WORKOUT" button. That button pre-loads exercise names into `exs`, sets `sessName`, and switches the `subTab` to `"track"` via `onStartDay` prop. `TrainScreen` owns `selectedProgram` state.

`ProgramDetailModal` is `position:fixed, inset:0` and renders over the bottom nav bar. Its header uses `paddingTop:"calc(env(safe-area-inset-top, 0px) + 16px)"` to push the ✕ close button below the iOS status bar/notch. The scrollable content area uses `paddingBottom:"calc(env(safe-area-inset-bottom,0px) + 100px)"` — the 100px (not 32px) clears both the fixed bottom nav bar (~82px) and the iOS home indicator.

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

### HomeScreen layout

The HomeScreen was redesigned with a purple-dominant theme. Layout (top to bottom):

1. **Header bar** — small SFC logo (46px circle) + "SOCIAL / FIT CLUB" text branding on the left; bell icon + avatar circle on the right.
2. **Tagline** — purple dot + "Strength in Community".
3. **Stats card** — avatar, "YOUR STATS", session count, points (purple); three mini stat tiles: RANK, DAY STREAK, THIS WEEK.
4. **Weekly volume** — SVG line chart with dots (purple), day labels below. Today's dot is highlighted and larger.
5. **Leaderboard row** — tappable, expands (`lbExpanded` state) to show top-5 ranked users inline. Non-self rows are tappable and call `onViewProfile(u)` to open `UserProfileModal` via `SocialFitClubInner`.
6. **Quick Start row** — tappable, expands (`qsExpanded` state, default open) to reveal a 2×2 grid of workout cards.

`sfc_home_widgets` is a localStorage key written by a legacy widget system; the current HomeScreen ignores it and does not clear it on sign-out.

### Onboarding Flow

`OnboardingModal` is a 3-slide full-screen overlay (zIndex 850) shown to first-time users. Controlled by `showOnboarding` state, initialised via `useState(() => !localStorage.getItem("sfc_onboarded"))`. On complete or skip, sets `sfc_onboarded = "1"` in localStorage (intentionally not cleared on sign-out — it's device-level state).

Slides: (1) Welcome + brand identity, (2) 2×2 feature grid (Train, Nutrition, Progress, Squad), (3) Points/leaderboard pitch with gold CTA. Dot indicators show progress; active dot expands to a pill. Navigation: SKIP top-right, ← BACK / NEXT → bottom, final slide shows gold "LET'S GET STARTED ◆" button.

### Profile Setup Modal

`ProfileSetupModal` (zIndex 820) fires after onboarding for users who haven't completed it yet. Controlled by `showProfileSetup` state; `profileSetupChecked` ref prevents re-triggering on subsequent profile updates. Prompts for sex (4-option grid: Male/Female/Non-binary/Prefer not to say), age (number input), and location (text input). Saves to `profiles` table and writes `sfc_profile_setup_done = "1"` to localStorage on save or skip. Suppressed while onboarding is active.

`DailyMotivModal` is suppressed while onboarding or profile setup is active, so new users see onboarding → profile setup → daily quote on their first visits.

### Daily Motivational Popup

`DailyMotivModal` renders as a fixed overlay (zIndex 800) on first app open each day. `showDailyMotiv` state is initialised via `useState(() => localStorage.getItem("sfc_daily_motiv") !== today)` — true if today's date hasn't been stored yet. Dismissing writes today's ISO date to `sfc_daily_motiv` and sets state to false.

`DAILY_MESSAGES` is a module-level array of 44 `{ msg, sub }` objects. The message is selected by `dayOfYear % DAILY_MESSAGES.length` so all users see the same quote on a given calendar day. Uses `const [nowMs] = useState(() => Date.now())` inside the component to avoid the `react-hooks/purity` ESLint error.

The `motivFadeIn` CSS animation (`opacity 0 → 1`, `scale 0.96 → 1`) is declared in the `<style>` block at the bottom of `SocialFitClubInner`'s render.

### MoreScreen modals

| Modal | Tile | localStorage | Props |
|---|---|---|---|
| `AiCoachModal` | AI COACH | — | `profile`, `sessions`, `muscleScores`, `onClose` |
| `GoalsModal` | GOALS | `sfc_goals` | `sessions`, `profile`, `onClose` |
| `WeeklyReportModal` | WEEKLY REPORTS | — | `sessions`, `muscleScores`, `onClose` |
| `HealthConnectModal` | HEALTH CONNECT | `sfc_ble_device` | `onClose` |
| `MacroCoachModal` | MACRO COACH | `sfc_macro_coach` | `onClose` |
| `AdminDashboardModal` | ADMIN DASHBOARD (admin only) | — | `onClose` |
| `NotificationsModal` | NOTIFICATIONS | `sfc_notif_prefs` | `sessions`, `onClose` |
| `FormCheckModal` | FORM CHECK | — | `onClose` |
| `ProfileModal` | EDIT PROFILE (via profile card) | — | `profile`, `userId`, `onClose`, `onSave`, `showToast` |
| `DeleteAccountModal` | DELETE ACCOUNT (below Sign Out) | — | `userId`, `onDeleted`, `onClose` |
| `HelpSupportModal` | HELP & SUPPORT | — | `onClose` |

`MacroCoachModal` has a multi-step setup wizard (sex, age, height, weight, activity, goal) that calculates TDEE and macro splits, stores results in `sfc_macro_coach`, and runs a weekly check-in adjustment algorithm. Uses `const [nowMs] = useState(() => Date.now())` to avoid the `react-hooks/purity` ESLint error — do not replace with inline `Date.now()`.

`FormCheckModal` — video file picker (`accept="video/*" capture="environment"`, max 100 MB), calls `extractFrames()` to get 3 frames, shows a thumbnail strip, then calls the `form-check` Edge Function. Results view: colour-coded score ring (green ≥8, gold ≥6, red <6), optional safety warning, strengths list, correction cards (`{ issue, fix }`), and purple coaching-cue chips.

`HelpSupportModal` — includes a LEGAL section (`ChromeCard`) with links to `/privacy.html` (Privacy Policy) and `/terms.html` (Terms of Service).

The SFC MERCH tile shows a "COMING SOON" toast. The profile card at the top of MoreScreen is tappable and opens `ProfileModal` directly (bypassing the tile grid). Below the profile card, two tappable purple pills show the logged-in user's **FOLLOWERS** and **FOLLOWING** counts — tapping either opens `FollowListModal`. A **DELETE ACCOUNT** button lives below the Sign Out button; it opens `DeleteAccountModal` which requires the user to type "DELETE" to confirm, then calls the `delete-account` Edge Function and clears all `sfc_*` localStorage keys (including `sfc_remembered_email`).

**Profile editing** — `ProfileModal` allows username change, profile photo upload, and updating age, sex, and location fields. Photo is compressed via `compressImage()`, uploaded to `storage.avatars/{userId}.jpg` (upserted), and the public URL is stored in `profiles.avatar_url`. After save, `onProfileUpdate(updatedProfile)` is called to sync the parent state in `SocialFitClubInner`.

`handleSave` uses `.update(updates).eq("id", userId).select("id")` — the `.select("id")` is intentional to detect silent RLS failures. Supabase returns HTTP 200 with 0 rows (not an error) when an UPDATE is blocked by RLS; checking `rows.length === 0` catches this and shows an informative error. Do not remove the `.select("id")` or revert to a bare `.update()` with no return check. The `avatars` storage bucket must be set to **Public** in the Supabase dashboard or photo URLs will fail to load.

**Username availability check** — `ProfileModal` has a `usernameStatus` state (`null | "checking" | "available" | "taken"`). A 500ms debounced `useEffect` runs `.ilike("username", trimmed).neq("id", userId)` to check uniqueness; the input border and status text update in real time. `handleSave` blocks early if status is `"taken"` or `"checking"`. Error code `23505` from the DB is caught as a safety net.

### Health Connect (Web Bluetooth)

`HealthConnectModal` uses `navigator.bluetooth.requestDevice` filtering for the `heart_rate` BLE GATT service. On connect it subscribes to `heart_rate_measurement` characteristic notifications and updates live BPM state. Requires Chrome/Edge; gracefully shows "BROWSER NOT SUPPORTED" for Safari/Firefox. Last paired device name persisted to `sfc_ble_device`.

### Admin Dashboard

`AdminDashboardModal` fetches all rows from `profiles` (read-all RLS) and displays: platform overview stats (total users, active users, total sessions, total points, avg sessions, users on streaks), engagement bars (activation/streak/churn rates), top performer card, a full ranked user table, and a **MEMBER DEMOGRAPHICS** panel (sex breakdown pills, age bracket bars, top locations). The demographics panel is only shown when at least one user has `sex` or `age` set. Visible only when `isAdmin` is true in `MoreScreen`.

Uses a **cascading fallback query**: tries `sessions_count, age, sex, location` first; if a column doesn't exist yet (Postgres error code `42703`), retries with simpler queries. Stats gracefully fall back to `|| 0`. This prevents the dashboard from getting stuck on "LOADING DATA..." when the DB migration hasn't been run.

### FeedScreen

The feed is fully **Supabase-backed** — posts, likes, and comments are all stored in database tables, not localStorage. `sfc_feed` is a legacy key that is no longer written or read by `FeedScreen`.

`FeedScreen` receives `userId` as a prop (in addition to `profile`, `sessions`, `showToast`).

**Tabs** — FOLLOWING (posts from followed users + own posts) and DISCOVER (all posts). `loadPosts(tab, followSet)` queries the `posts` table with a profiles join and filters by `followingIds` set for the following tab.

**Post cards** — each card shows avatar (tappable → `UserProfileModal`), username, `timeAgo` timestamp, type badge, tag bar, caption text, and full-width image when `post.image_url` is present. Action row: ❤️ like button (optimistic + `post_likes` upsert/delete) and 💬 comment button (loads `post_comments` inline).

**Photo posts** — compose sheet has a 📷 ADD PHOTO button that opens a hidden `<input type="file" accept="image/*" capture="environment">`. Selected file is previewed via `URL.createObjectURL`; object URL is managed by `postImgUrlRef` and revoked on new selection, compose close, and successful submit. On submit, `compressImage(file)` → base64 → `Uint8Array` blob → upload to `post-images/{userId}/{uuid}.jpg` → `getPublicUrl` → stored as `image_url` on the post. Uses `crypto.randomUUID()` for the path (not `Date.now()`, which triggers the `react-hooks/purity` lint rule). Image is optional — text-only or image-only posts are both allowed.

**Compose sheet** — `newType` state (`"post"` | `"pr"` | `"milestone"` | `"challenge"`). Challenge type has its own flow via `submitChallenge()`. All other types go through `submitPost()`. Backdrop `onClick` clears the image state via `clearImage()`.

**`submitPost` error handling** — captures `error` from the Supabase `.insert()` call. On failure: shows an error toast and returns early without clearing the compose form (user can retry). On success: optimistically prepends the returned row to `posts`, shows the success toast, clears the compose, then calls `loadPosts(feedTab)` as a safety net to ensure the feed stays in sync with the DB. The toast must not fire before checking for errors — do not move `showToast` above the error check.

**Challenge system** — `challenges` state (from `sfc_challenges`) is an array of `{ id, type, exercise?, target, created, deadline, completed, completedAt }`. `type` is `"pr"` | `"vol"` | `"sessions"`. A `useEffect` on `sessions` auto-completes challenges and inserts a `milestone` post when the target is reached. `getChallengeProgress()` renders the progress bar and countdown on challenge post cards.

**User search** — `UserSearchModal` (zIndex 790) debounces 300ms and queries `profiles` with `.ilike("username", ...)`. Has full ARIA accessibility: `role="dialog"`, `role="search"`, `role="list"`, `aria-live` region announces result counts, result cards are keyboard-focusable (`tabIndex=0`, Enter/Space). Input has a 🔍 icon on the left and a ✕ clear button on the right when text is present. Follow/unfollow is optimistic via `localFollowing` Set.

### UserProfileModal and FollowListModal

`UserProfileModal` (zIndex 780) shows a full-screen profile for any user. It loads profile data, sessions, follow status, follower count, and following count in a single `Promise.all`. Stats grid shows POINTS / STREAK / SESSIONS. Below it, two tappable purple pills show **FOLLOWERS** and **FOLLOWING** counts — tapping opens `FollowListModal`. Tapping a person in the follow list closes it and sets `subUser` state, rendering a nested `UserProfileModal` for that person (allowing drill-down navigation).

`FollowListModal` (zIndex 800) is a reusable full-screen list. Props: `{ userId, mode ("followers"|"following"), onClose, onViewProfile }`. For "following" mode it fetches `following_id` values where `follower_id = userId`; for "followers" mode it fetches `follower_id` values where `following_id = userId`. Both then do a second query to fetch the profile rows for those IDs. Each row shows avatar, username, stats, and a `›` chevron.

`MoreScreen` also renders `FollowListModal` and a local `UserProfileModal` for viewing profiles from the follow list without leaving the More tab.

### NutritionScreen — calorie ring and meal templates

**Calorie budget ring** — the summary card is centred on a `RingMeter` (size 140, strokeW 10). Ring color: gold when <85% of daily budget, orange at 85–99%, red when over. Shows calories remaining (or over) inside the ring; "consumed / target KCAL" label below. Uses `getActiveMacroTargets()` for the budget, showing an `⚡ ADAPTIVE` badge when Macro Coach is active.

**Meal templates** — `mealTemplates` state (from `sfc_meal_templates`). A horizontally scrollable MY TEMPLATES strip appears above the meal log sections when at least one template is saved. Each card shows the template name, item count, total kcal, protein, and a LOG ◆ button that adds all items to the currently selected meal. A 💾 button in each meal header opens an inline name-input; pressing Enter saves current meal items as a new template. Templates can be deleted with a ✕ button on the card.

### NutritionScreen — external integrations

- **Barcode scan**: `BarcodeDetector` API (Chrome/Edge only; falls back to manual entry) → Open Food Facts API → UPC Item DB secondary API → `BARCODE_DB` (26-product local fallback). If still not found, `barcode_not_found` state renders a manual macro entry form. `scanTarget` (`"food"` | `"supplement"`) controls which log receives the result.
- **Meal scan**: captures live video to `<canvas>` → JPEG base64 → `analyze-meal` Edge Function → Claude Haiku vision.
- **Online food search**: when the SEARCH tab returns 0 local results, a "🌐 SEARCH ONLINE DATABASE" button triggers `searchOnline()` which queries `https://world.openfoodfacts.org/cgi/search.pl?...` (no API key needed, 10s timeout via `AbortSignal.timeout`). Returns up to 12 per-100g results. If online search also finds nothing, a "LOG MANUALLY" form lets the user enter name + macros directly.

### NutritionScreen tabs

Four tabs: `📋 LOG` (food by meal), `📷 SCAN` (camera AI + barcode), `🔍 SEARCH` (food DB with category filter), `💊 SUPPS` (supplement tracker).

The LOG tab shows today's meals and a **PAST DAYS** collapsible section below them. Each past day row displays date, item count, and daily kcal; tapping expands it to show per-item rows and a macro breakdown footer. `pastFoodDays` is derived from the `nutritionHistory` IIFE on mount (last 7 days excluding today). `expandedFoodDay` state tracks which day is open.

The `scanTarget` state (`"food"` | `"supplement"`) controls where scan results are routed. When `"supplement"`, only the barcode button is shown (no meal photo scan), and results go to `suppLog` / `sfc_supplement_log`. `SUPPLEMENTS_DB` has 25 entries.

### PWA / Icons

`public/manifest.json` enables home-screen installation and app-store submission. Key fields: `id: "/"` (required for Android TWA identity), `display: "standalone"`, `orientation: "portrait"`, `background_color`/`theme_color` both `#06060E`, `lang: "en"`, `dir: "ltr"`.

Icons live in `public/`: `favicon.svg` (vector badge logo, also the browser tab icon), `icon-192.png` (home screen), `icon-512.png` (splash / maskable). The 512px icon has **two separate manifest entries** — one `"purpose": "any"` and one `"purpose": "maskable"` — because combining them as `"any maskable"` fails some validators. The 512px icon has a solid purple background so it satisfies the maskable safe-zone requirement without needing a separate file. `index.html` wires them up via `<link rel="manifest">`, `<link rel="apple-touch-icon">`, and the iOS-specific meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`).

Six app screenshots live in `public/screenshots/` (390×844 PNG, one per main screen). They are referenced in `manifest.json` with `"form_factor": "narrow"` and shown by PWABuilder / Play Store during installation. Regenerate by running the Playwright screenshot loop in `sweep_final.mjs` or a similar script.

**SEO** — `index.html` has a `<meta name="description">` tag and `public/robots.txt` (`Allow: /`) is present. Lighthouse production scores: Performance 97, Accessibility 100, Best Practices 96, SEO 100.

**Regenerating PNG icons** — the source logo is `public/sfcc.jpg`. To regenerate at 192×192 and 512×512, run a one-off Node script using Playwright:
```js
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
// read sfcc.jpg → base64 data URI → render in headless page → screenshot → writeFileSync icon-{size}.png
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

### Screen header pattern

Every screen uses a **consistent header block** immediately inside the root padding div:

```jsx
<div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
  <div>
    <div style={{ fontFamily:FONT.display, fontSize:22, letterSpacing:3, color:"#fff", textTransform:"uppercase" }}>
      SCREEN <span style={{ color:G.purple, textShadow:`0 0 12px ${G.purple}` }}>WORD</span>
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
      <div style={{ width:7, height:7, borderRadius:"50%", background:G.purple }}/>
      <div style={{ fontFamily:FONT.body, fontSize:9, letterSpacing:2.5, color:G.textMid, textTransform:"uppercase" }}>Tagline here</div>
    </div>
  </div>
  {/* optional right-side button */}
</div>
```

- Title is 22px `FONT.display`, white base + **purple** highlighted word (not gold)
- Purple dot (7px circle) + short tagline below
- Gold is reserved for points, PR badges, achievements, and the calorie ring — not for screen chrome

### Sub-tab pill pattern

All sub-tab selectors (Train, Progress, Nutrition) use **purple** for the active state:

```jsx
background: active ? `linear-gradient(135deg,${G.purple},${G.purpleBright})` : "transparent"
color: active ? "#fff" : G.textMid
```

Never use the gold gradient (`G.gold → G.goldDark`) for tab selectors.

### Shared UI atoms

`ChromeCard`, `NeonBtn`, `NeonOutlineBtn`, `SectionLabel`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`, `RestTimer`, `TogglePill`, `ExercisePicker`, `PlateCalculatorModal` — all defined in `App.jsx`.

`AvatarBadge` accepts an optional `url` prop. When provided it renders an `<img>` (circular, `object-fit: cover`) instead of the initials gradient. Has an `imgErr` state + `onError` handler — falls back to the initials gradient if the image URL fails to load. Both `leaderboard` items and the `profile` object carry `url`/`avatar_url` respectively and should be passed through.

`ChromeCard` accepts an optional `onClick` prop which is forwarded to the root div. Always pass `onClick` directly to `ChromeCard` — do not wrap it in another div to handle clicks, as `ChromeCard` now supports this natively.

`ExercisePicker` is a bottom-sheet modal used in `TrainScreen`. It receives `{ onSelect, onClose }` and renders: a search bar, two chip rows (gold muscle-group chips from `EXERCISE_CATS` + purple equipment chips from `EQUIPMENT_CATS`), an optional FOCUS sub-row when LEGS is selected (QUADS / HAMSTRINGS from `EXERCISE_SUBCATS`), and a filtered exercise list with muscle label and category badge. Opens via the purple **⊞ BROWSE** pill button next to each exercise name input.

`PlateCalculatorModal` is a standalone modal (not a MoreScreen tile). Opened from the TrainScreen header ⚖️ PLATES button. Accepts `{ onClose, initialWeight }`.

### Module-level constants

`ADMIN_EMAIL`, `EXERCISES`, `EXERCISE_CATS`, `EX_CAT_LOOKUP`, `EXERCISE_SUBCATS`, `EQUIPMENT_CATS`, `CARDIO_SET_CONFIG`, `FOODS`, `FOOD_CATS`, `BARCODE_DB`, `SUPPLEMENTS_DB`, `SUPP_TYPES`, `SUPP_TYPE_COLOR`, `MACROS_GOAL`, `SESSION_TYPES`, `DAYS_SHORT`, `EXERCISE_MUSCLE_MAP`, `MUSCLE_LABELS`, `MUSCLE_SUGGEST`, `REST_OPTIONS`, `MACRO_COACH_KEY`, `DAILY_MESSAGES`, `PROGRAMS_DATA`.

`EXERCISE_CATS` is an object keyed by muscle group (`CHEST`, `BACK`, `ARMS`, `LEGS`, `SHOULDERS`, `CORE`, `CARDIO`, `KETTLEBELL`) with 145 exercises total. `EXERCISES = Object.values(EXERCISE_CATS).flat()`. `EX_CAT_LOOKUP` maps each exercise name → its muscle-group category (auto-built from `EXERCISE_CATS`). Adding a new exercise: put it in the right `EXERCISE_CATS` array — `EX_CAT_LOOKUP` and `EXERCISES` are derived automatically.

`EXERCISE_SUBCATS` provides sub-filters within a category: `{ LEGS: { QUADS: [...], HAMSTRINGS: [...] } }`. Used by `ExercisePicker` to show a FOCUS chip row when LEGS is selected.

`EQUIPMENT_CATS` is a parallel cross-category lookup for equipment filters: `{ CABLES: [...23 exercises...], DUMBBELLS: [...29 exercises...] }`. `ExercisePicker` checks `EQUIPMENT_CATS[cat]` first before falling back to `EX_CAT_LOOKUP` — this lets equipment chips filter across muscle groups without moving exercises out of their canonical category.

`CARDIO_SET_CONFIG` maps 13 cardio exercise names to their two input field configs: `{ a: { label, unit, mode }, b: { label, unit, mode } }`. The `a` field maps to the set's `r` property (primary, e.g. TIME MIN), `b` maps to `w` (secondary, e.g. INCLINE %). When `CARDIO_SET_CONFIG[ex.name]` is truthy: column headers change from REPS/WEIGHT to the configured labels, inputs render purple, and `w` placeholder changes to `0` instead of a progressed weight. Cardio exercises are excluded from `totVol` and `pts`; a `totCardioMin` accumulates their minutes for display.

`FOODS` has 250+ entries across categories: BREAKFAST, PROTEIN, CARBS, DAIRY, FRUIT, VEG, NUTS, FAT, SUPPLEMENT, FAST FOOD, RESTAURANT, SNACK, BRAND, BEVERAGE. `FOOD_CATS` lists all these including "ALL" at the start.

`SESSION_TYPES` is `[{ id, label, color }]` — 9 workout categories each with a hex color used for chip backgrounds and history badges.

### ESLint rules to watch

- `react-hooks/purity` — prohibits `Date.now()` / `Math.random()` directly in render or async handlers inside components. Use `useState(() => Date.now())` at mount, or `crypto.randomUUID()` when a unique ID is needed inside an event handler (e.g. storage paths).
- `react-hooks/static-components` — component definitions must not be inside another component's render function.
- `react-hooks/exhaustive-deps` — all state variables referenced inside `useEffect` must be in the dependency array.
- `react-hooks/refs` — prohibits `ref.current = value` directly in render; wrap in `useEffect`.
- `no-unused-vars` — unused destructured parameters (e.g. `(s, i)` where `i` is unused) must be removed. Unused catch variables must be omitted entirely (`catch {` not `catch (e) {`).
- `react-hooks/set-state-in-effect` — calling `setState` synchronously inside a `useEffect` body triggers cascading renders. Wrap in `setTimeout(..., 0)` to defer out of the effect body.

### Known implementation invariants

- **Stable callback refs**: `RestTimer` uses `useRef` + `useEffect(() => { ref.current = onDone; })` (no deps) to keep the `onDone` callback current without restarting the interval on every parent re-render. Do not replace with a direct dependency.
- **Streak calculation in `handleSave`**: compares the most recent existing session's `createdAt` date against today/yesterday to decide whether to extend or reset the streak. This must remain before the optimistic state update.
- **Sign-out cleanup**: `handleSignOut` calls `supabase.auth.signOut()`, then immediately sets `setUser(null)` directly (in addition to the async `onAuthStateChange` callback) so the LoginScreen renders without waiting for the auth event. Only four session-ephemeral keys are cleared: `sfc_daily_motiv`, `sfc_wip_session`, `sfc_session_tags`, `sfc_feed`. All personal data keys (`sfc_nutrition_log`, `sfc_supplement_log`, `sfc_macro_coach`, `sfc_body_log`, `sfc_water_log`, `sfc_water_goal`, `sfc_goals`, `sfc_meal_templates`, `sfc_challenges`, `sfc_notif_prefs`, `sfc_streak_freezes`) are intentionally preserved across sign-out so users don't lose history when logging back in. `sfc_onboarded`, `sfc_profile_setup_done`, `sfc_tour_done`, `sfc_home_widgets` are also preserved (device-level state). `sfc_remembered_email` persists by design but is cleared by `DeleteAccountModal`. `DeleteAccountModal` clears everything (all `sfc_*` keys) since the account is being permanently deleted.
- **Body scroll lock**: `useScrollLock()` is a module-level hook called at the top of every modal component. It sets `document.body.style.overflow = "hidden"` on mount and restores the previous value on unmount, preventing iOS Safari background scroll bleed-through.
- **Screen top padding**: Every screen root div uses `padding: "calc(env(safe-area-inset-top, 0px) + Xpx) 18px 0"` to clear the iOS status bar. Never use a fixed pixel top padding on screen containers.
- **Bottom sheet modals**: All bottom sheet containers use `maxHeight: "80vh"` and `paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)"` with `overflowY: "auto"`. The 80vh (not 93vh) is intentional — mobile Safari measures `vh` against the full screen including its own chrome, so 80vh gives enough clearance when running as a website (not a PWA).
- **Main content bottom padding**: The main scrollable content wrapper (a `<main>` element) uses `paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 82px)"` to clear the fixed bottom nav bar plus iOS home indicator. `LoginScreen` and all its conditional render paths (`awaitingConfirm`, `forgotSent`) also use `<main>` as their root element for accessibility landmark compliance.
- **Blob URL lifecycle in `FormCheckModal`**: uses `previewUrlRef` to revoke the previous object URL both when a new file is picked and on unmount, preventing memory leaks.
- **Blob URL lifecycle in FeedScreen compose**: `postImgUrlRef` tracks the current post image object URL. `clearImage()` revokes it. The backdrop `onClick` calls `clearImage()` before closing the compose sheet. The URL is also revoked when a new file replaces the previous one in `handleImagePick`, and a `useEffect` cleanup revokes it when `FeedScreen` unmounts (prevents leak when user navigates away mid-compose).
- **Challenge auto-complete**: the `useEffect` in `FeedScreen` that watches `sessions` compares current progress against targets and only fires the completion logic once (checks `!ch.completed` before updating). Do not add `challenges` to the dependency array or it will loop.
- **UserProfileModal fragment wrapper**: the component's `return` wraps everything in `<>...</>` because it renders the main modal div, `FollowListModal`, and a nested `UserProfileModal` for `subUser` as siblings. Do not remove the fragment.
- **Optimistic follower count in `UserProfileModal`**: `toggleFollow` updates `followersCount` state immediately (`+1` on follow, `-1` on unfollow, floored at 0) without waiting for the DB round-trip. Do not remove this — without it the count stays stale until the modal is reopened.
- **MoreScreen follow count refresh**: when the `moreViewingUser` `UserProfileModal` closes (via `onClose`), the `followerCount`/`followingCount` state is re-fetched from Supabase. This is intentional — the current user may have followed/unfollowed someone inside that modal, making the displayed pills stale.
- **`doSave` is async**: `doSave` in `TrainScreen` `await`s `onSave()` (which is `handleSave` in `SocialFitClubInner`). `handleSave` returns `true` on success and `false` on Supabase error (after rolling back the optimistic state update). `doSave` only clears the form and navigates to history if the return value is not `false`. Do not make `doSave` fire-and-forget — the form must not clear before the DB insert resolves.
- **Full-screen modals over the bottom nav**: `ProgramDetailModal` (and any future `position:fixed, inset:0` modal) renders on top of the bottom nav bar. Its header must use `paddingTop: "calc(env(safe-area-inset-top, 0px) + Xpx)"` to clear the iOS notch, and its scroll container must use `paddingBottom` large enough to clear the bottom nav (~82px) plus the iOS home indicator. Use 100px minimum for the bottom padding.
