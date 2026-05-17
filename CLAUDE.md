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

The entire app lives in a **single file**: `src/App.jsx` (~2500 lines). There are no separate component files, no routing library, no state management library, and no CSS modules — all styling is inline CSS-in-JS.

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

Render guards (in order): blank screen while `authReady` is false → `<LoginScreen/>` when no user → "CONNECTION ERROR" screen with Retry button when `dataLoadFailed` is true (network errors in `loadProfile`/`loadSessions` set this flag; a missing profile row — Postgres error `PGRST116` — does not) → blank while profile loads → main app.

### Navigation model

`SocialFitClub` owns all top-level state and renders one screen at a time based on a `tab` string (`home`, `train`, `progress`, `nutrition`, `feed`, `more`). No router. Tab switching calls `setTab(id)`.

Root state passed as props:

| Prop | Type | Used by |
|---|---|---|
| `sessions` | `{ name, exs, sets, vol, pts, date, createdAt }[]` | Home, Train, Progress, More |
| `profile` | Supabase profiles row | Home, Progress, Feed, More |
| `leaderboard` | sorted profiles array with `{ rank, name, pts, sessions, streak, av, isMe }` | Home |

### Screen components and key props

| Component | Key props |
|---|---|
| `HomeScreen` | `sessions`, `leaderboard`, `profile`, `onQuickStart`, `showToast` |
| `TrainScreen` | `sessions`, `onSave`, `quickStart`, `onClearQuickStart`, `showToast` |
| `ProgressScreen` | `sessions`, `profile`, `showToast` |
| `NutritionScreen` | `showToast` |
| `FeedScreen` | `profile`, `showToast` |
| `MoreScreen` | `profile`, `sessions`, `muscleScores`, `onSignOut`, `showToast` |

### Data flow for saving a workout

`handleSave` in `SocialFitClub`:
1. Optimistic update: prepend `{ ...sess, createdAt: new Date().toISOString() }` to `sessions`, bump `profile.points` + `profile.sessions_count`, re-sort leaderboard
2. Parallel Supabase writes: `sessions.insert` + `profiles.update`
3. Real-time subscription on `profiles` triggers `loadLeaderboard` for all connected clients

### localStorage keys

Several features persist locally (no extra Supabase tables needed):

| Key | Content | Expires |
|---|---|---|
| `sfc_nutrition_log` | `{ date: "YYYY-MM-DD", items: [] }` | Auto-cleared when date changes |
| `sfc_wip_session` | `{ name, exs }` in-progress workout | Cleared on save |
| `sfc_feed` | full feed array (posts + like counts) | Never (persists across refreshes) |
| `sfc_streak_freezes` | number | Never |
| `sfc_goals` | `{ weekly, volume, streak }` — user-set numeric targets | Never |
| `sfc_pledge` | integer 1–7, weekly session commitment | Never |

### Weekly volume chart

`calcWeeklyVolume(sessions)` returns a 7-element array (Mon–Sun) by summing `sess.vol` for sessions whose `createdAt` falls within the current calendar week. `HomeScreen` uses this instead of any hardcoded constant.

### Muscle Heat Map

`calcMuscleScores(sessions)` → `{ muscleKey: 0–100 }`. `getHeatColor(score)` → blue→yellow→red via `lerpColor`. `MuscleHeatMap` renders an SVG body (`viewBox="0 0 200 440"`). Raw (unfactored) scores drive AI alerts; the period toggle only scales display colours. `calcMuscleScores` output is also passed to `MoreScreen` as `muscleScores` for the AI Coach.

### ProgressScreen internal tabs

Three tabs rendered via `activeTab` state: `stats` (session count, volume stats, body composition placeholders), `streak` (streak counter, freeze mechanic, milestone road), `heatmap` (`MuscleHeatMap` component). The `transform` (body photo) tab was removed.

### MoreScreen modals

Four modals can open from the tile grid, all defined just before `MoreScreen`:

| Modal | Tile | localStorage | Props |
|---|---|---|---|
| `AiCoachModal` | AI COACH | — | `profile`, `sessions`, `muscleScores`, `onClose` |
| `GoalsModal` | GOALS | `sfc_goals` | `sessions`, `profile`, `onClose` |
| `WeeklyReportModal` | WEEKLY REPORTS | — | `sessions`, `muscleScores`, `onClose` |
| `AccountabilityModal` | ACCOUNTABILITY | `sfc_pledge` | `sessions`, `profile`, `onClose` |

The remaining 5 tiles (Live Training, Merch, Form Check, Health Connect, Book Session) show a "COMING SOON" toast.

### NutritionScreen — external integrations

- **Barcode scan**: `BarcodeDetector` API + Open Food Facts (`world.openfoodfacts.org/api/v0/product/{code}.json`). `BARCODE_DB` is a 8-product local fallback only.
- **Meal scan**: captures live video to `<canvas>` → JPEG base64 → `analyze-meal` Edge Function → Claude Haiku vision.

### Design tokens

- **`G`** — full colour palette (gold `#FDB927`, purple `#552583`, backgrounds, text tints, glow shadow strings)
- **`FONT`** — three stacks (`display` = Bebas Neue, `body` = Barlow Condensed, `mono`)

Never hardcode colours or fonts — always reference `G` and `FONT`.

### Styling conventions

- All styles are inline objects on the `style` prop
- Glow effects use `boxShadow` with values from `G` (e.g. `G.goldGlow`, `G.purpleGlow`)
- Animations declared in a `<style>` tag at the bottom of `SocialFitClub`'s render
- No CSS classes except the minimal reset in `src/index.css`
- Max width `480px`, `margin: 0 auto`, mobile-first; `viewport-fit=cover` in `index.html`

### Shared UI atoms

`ChromeCard`, `NeonBtn`, `NeonOutlineBtn`, `SectionLabel`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`, `RestTimer` — all defined in `App.jsx`. `GlowDot` was removed (unused).

### Module-level constants

`EXERCISES`, `FOODS`, `FOOD_CATS`, `BARCODE_DB`, `MACROS_GOAL`, `DAYS_SHORT`, `EXERCISE_MUSCLE_MAP`, `MUSCLE_LABELS`, `MUSCLE_SUGGEST`, `FEED_DATA` (default feed seed), `REST_OPTIONS`.

Removed constants (no longer in file): `LEADERBOARD`, `SCAN_MEALS`, `WEEKLY_VOLUME`.
