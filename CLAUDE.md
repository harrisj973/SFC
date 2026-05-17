# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

No test suite is configured. Deployment is via GitHub Actions → GitHub Pages on push to `claude/social-fit-club-ui-XeD03`. The workflow (`/.github/workflows/deploy.yml`) uses `peaceiris/actions-gh-pages@v4` to push the built `dist/` to the `gh-pages` branch. Custom domain: `socialfitclub26.com`.

## Architecture

The entire app lives in a **single file**: `src/App.jsx` (~3070 lines). There are no separate component files, no routing library, no state management library, and no CSS modules — all styling is inline CSS-in-JS.

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

**Edge Functions** (both require `ANTHROPIC_API_KEY` set as a Supabase secret):

| Function | Input | Output |
|---|---|---|
| `analyze-meal` | `{ image: base64jpeg }` | `{ name, cal, pro, carb, fat, confidence }` |
| `ai-coach` | `{ sessions, profile, muscleScores }` | `{ greeting, todayFocus, recommendations[], motivational }` |

### Auth flow

`LoginScreen` handles sign-in, sign-up (with `display_name` passed via `user_metadata`), forgot-password (`supabase.auth.resetPasswordForEmail`), and email confirmation with resend.

`ensureProfile` fires on every `SIGNED_IN` event — reads `user.user_metadata.display_name` for the username, creates the `profiles` row if missing, then loads sessions and leaderboard.

`ResetPasswordScreen` is shown when `onAuthStateChange` fires a `PASSWORD_RECOVERY` event (user clicked reset link in email). It calls `supabase.auth.updateUser({ password })` and returns to the main app on success.

Render guards (in order): blank screen while `authReady` is false → `<LoginScreen/>` when no user → `<ResetPasswordScreen/>` when `passwordRecovery` is true → "CONNECTION ERROR" screen with Retry button when `dataLoadFailed` is true (network errors in `loadProfile`/`loadSessions` set this flag; a missing profile row — Postgres error `PGRST116` — does not) → blank while profile loads → main app.

### Navigation model

`SocialFitClubInner` owns all top-level state and renders one screen at a time based on a `tab` string (`home`, `train`, `progress`, `nutrition`, `feed`, `more`). No router. Tab switching calls `setTab(id)`.

Root state passed as props:

| Prop | Type | Used by |
|---|---|---|
| `sessions` | `{ id, name, exs, sets, vol, pts, date, createdAt }[]` | Home, Train, Progress, More |
| `profile` | Supabase profiles row | Home, Progress, Feed, More |
| `leaderboard` | sorted profiles array with `{ rank, name, pts, sessions, streak, av, isMe }` | Home |

### Screen components and key props

| Component | Key props |
|---|---|
| `HomeScreen` | `sessions`, `leaderboard`, `profile`, `onQuickStart`, `showToast` |
| `TrainScreen` | `sessions`, `onSave`, `onDelete`, `onEdit`, `quickStart`, `onClearQuickStart`, `showToast` |
| `ProgressScreen` | `sessions`, `profile`, `showToast` |
| `NutritionScreen` | `showToast` |
| `FeedScreen` | `profile`, `showToast` |
| `MoreScreen` | `profile`, `sessions`, `muscleScores`, `onSignOut`, `showToast`, `isAdmin` |

`isAdmin` is computed as `user?.email?.toLowerCase() === ADMIN_EMAIL` (module-level constant `"harrisj1025@gmail.com"`) and passed from `SocialFitClubInner`.

### Data flow for saving a workout

`handleSave` in `SocialFitClubInner`:
1. Optimistic update: prepend `{ ...sess, createdAt: new Date().toISOString() }` to `sessions`, bump `profile.points` + `profile.sessions_count`, re-sort leaderboard
2. Parallel Supabase writes: `sessions.insert` + `profiles.update`
3. Real-time subscription on `profiles` triggers `loadLeaderboard` for all connected clients

### localStorage keys

| Key | Content | Expires |
|---|---|---|
| `sfc_nutrition_log` | `{ date: "YYYY-MM-DD", items: [] }` | Auto-cleared when date changes |
| `sfc_wip_session` | `{ name, exs }` in-progress workout | Cleared on save |
| `sfc_feed` | full feed array (posts + like counts + `commentList`) | Never |
| `sfc_streak_freezes` | string-encoded integer | Never |
| `sfc_goals` | `{ weekly, volume, streak }` — user-set numeric targets | Never |
| `sfc_pledge` | string-encoded integer 1–7, weekly session commitment | Never |
| `sfc_body_log` | `[{ date, weight, bf }]` body check-in history, newest first | Never |
| `sfc_ble_device` | last paired Bluetooth device name | Never |
| `sfc_supplement_log` | `{ date: "YYYY-MM-DD", items: [] }` supplement log | Auto-cleared when date changes |
| `sfc_notif_prefs` | `{ enabled, reminderTime, streakAlert }` notification settings | Never |

### Module-level helpers

- **`calcWeeklyVolume(sessions)`** — 7-element array (Mon–Sun) of volume for the current calendar week. Used by `HomeScreen`.
- **`calcBestWeekVolume(sessions)`** — single number: highest total volume in any Mon–Sun week across all sessions. Used by `ProgressScreen` BEST WEEK stat.
- **`calcMuscleScores(sessions)`** → `{ muscleKey: 0–100 }`. Passed to `MoreScreen` as `muscleScores` for AI Coach and heat map.
- **`getHeatColor(score)`** → blue→yellow→red via `lerpColor`. Used by `MuscleHeatMap`.

### ProgressScreen internal tabs

Three tabs via `activeTab` state:
- **`stats`**: real computed stats (sessions, total vol, best week vol, avg sets/session, avg vol/session, this-month sessions, top exercise, today's calories/protein from nutrition log) + user-input body composition (`sfc_body_log`).
- **`streak`**: streak counter, freeze mechanic (`sfc_streak_freezes`), milestone road.
- **`heatmap`**: `MuscleHeatMap` SVG component (`viewBox="0 0 200 440"`).

Body composition section reads/writes `sfc_body_log`. Each entry: `{ date: "YYYY-MM-DD", weight: number, bf: number|null }`. Progress rings use actual latest values; delta shown vs. first entry.

### MoreScreen modals

Seven modals can open from `MoreScreen`, all defined just before it:

| Modal | Tile | localStorage | Props |
|---|---|---|---|
| `AiCoachModal` | AI COACH | — | `profile`, `sessions`, `muscleScores`, `onClose` |
| `GoalsModal` | GOALS | `sfc_goals` | `sessions`, `profile`, `onClose` |
| `WeeklyReportModal` | WEEKLY REPORTS | — | `sessions`, `muscleScores`, `onClose` |
| `AccountabilityModal` | ACCOUNTABILITY | `sfc_pledge` | `sessions`, `profile`, `onClose` |
| `HealthConnectModal` | HEALTH CONNECT | `sfc_ble_device` | `onClose` |
| `AdminDashboardModal` | ADMIN DASHBOARD (admin only) | — | `onClose` |
| `NotificationsModal` | NOTIFICATIONS | `sfc_notif_prefs` | `sessions`, `onClose` |

The remaining 2 tiles (Merch, Form Check) show a "COMING SOON" toast.

### Health Connect (Web Bluetooth)

`HealthConnectModal` uses `navigator.bluetooth.requestDevice` filtering for the `heart_rate` BLE GATT service. On connect it subscribes to `heart_rate_measurement` characteristic notifications and updates live BPM state. Requires Chrome/Edge; gracefully shows "BROWSER NOT SUPPORTED" for Safari/Firefox. Last paired device name persisted to `sfc_ble_device`.

### Admin Dashboard

`AdminDashboardModal` fetches all rows from `profiles` (read-all RLS) and displays: platform overview stats (total users, active users, total sessions, total points, avg sessions, users on streaks), engagement bars (activation/streak/churn rates), top performer card, and a full ranked user table. Visible only when `isAdmin` is true in `MoreScreen`.

### FeedScreen

Posts stored in `sfc_feed` as `[{ id, user, av, time, txt, likes, liked, commentList: [], type, tag }]`. `type` is `"post"` | `"pr"` | `"milestone"`. Compose sheet has a type selector; PR and MILESTONE types show a tag input that populates the gold banner. Comments are stored in `commentList` as `[{ user, av, txt, time }]` and displayed when the comment section is expanded.

### NutritionScreen — external integrations

- **Barcode scan**: `BarcodeDetector` API (Chrome/Edge only; falls back to manual entry) → Open Food Facts API → UPC Item DB secondary API → `BARCODE_DB` (26-product local fallback). If still not found, `barcode_not_found` state renders a manual macro entry form. `scanTarget` (`"food"` | `"supplement"`) controls which log receives the result.
- **Meal scan**: captures live video to `<canvas>` → JPEG base64 → `analyze-meal` Edge Function → Claude Haiku vision.

### Service Worker

`public/sw.js` is registered in `src/main.jsx` on every app load. It listens for `postMessage` events:
- `SCHEDULE_NOTIFICATION` — schedules a `setTimeout` and calls `self.registration.showNotification()`
- `CANCEL_NOTIFICATION` — clears the pending timer and closes any existing notification with that tag

`NotificationsModal` posts to the SW via `navigator.serviceWorker.ready`. Notification click focuses an existing window or opens `/`.

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

`ChromeCard`, `NeonBtn`, `NeonOutlineBtn`, `SectionLabel`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`, `RestTimer`, `TogglePill` — all defined in `App.jsx`.

### Module-level constants

`ADMIN_EMAIL`, `EXERCISES`, `EXERCISE_CATS`, `EX_CAT_LOOKUP`, `FOODS`, `FOOD_CATS`, `BARCODE_DB`, `SUPPLEMENTS_DB`, `SUPP_TYPES`, `SUPP_TYPE_COLOR`, `MACROS_GOAL`, `DAYS_SHORT`, `EXERCISE_MUSCLE_MAP`, `MUSCLE_LABELS`, `MUSCLE_SUGGEST`, `FEED_DATA` (default feed seed), `REST_OPTIONS`.

### NutritionScreen tabs

Four tabs: `📋 LOG` (food by meal), `📷 SCAN` (camera AI + barcode), `🔍 SEARCH` (food DB with category filter), `💊 SUPPS` (supplement tracker).

The `scanTarget` state (`"food"` | `"supplement"`) controls where scan results are routed. When `"supplement"`, only the barcode button is shown (no meal photo scan), and results go to `suppLog` / `sfc_supplement_log`. `SUPPLEMENTS_DB` has 25 entries. Each supplement has `{ name, type, serving, cal, pro, carb, fat, brand }`. `SUPP_TYPE_COLOR` maps type → color token.

Removed constants (no longer in file): `LEADERBOARD`, `SCAN_MEALS`, `WEEKLY_VOLUME`.
