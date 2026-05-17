# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

No test suite is configured. Deployment is via GitHub Actions → GitHub Pages on push to `claude/social-fit-club-ui-XeD03`.

## Architecture

The entire app lives in a **single file**: `src/App.jsx` (~1900 lines). There are no separate component files, no routing library, no state management library, and no CSS modules — all styling is inline CSS-in-JS.

### Backend: Supabase

The app uses Supabase (PostgreSQL + Auth + real-time) as its backend. The client is initialised at the top of `App.jsx`:

```js
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

**Tables:**

| Table | Key columns | RLS |
|---|---|---|
| `profiles` | `id`, `username`, `avatar_initials`, `points`, `streak`, `sessions_count` | Users can read all rows; users can only update their own row |
| `sessions` | `user_id`, `name`, `exercises` (jsonb), `sets`, `volume`, `points`, `date` | Users can only read/insert their own rows |

Real-time is enabled on `profiles` for the live leaderboard. If either table is missing `sessions_count`, run:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sessions_count integer NOT NULL DEFAULT 0;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

### Auth flow

`LoginScreen` (defined just before the default export) handles sign-in / sign-up with an email-confirmation branch (`awaitingConfirm` state). The root `SocialFitClub` component gates rendering: blank while `authReady` is false, `<LoginScreen/>` when no authenticated user.

`ensureProfile` is called on every `SIGNED_IN` event — it creates a `profiles` row on first login and then calls `loadSessions` + `loadLeaderboard`.

### Navigation model

`SocialFitClub` owns all top-level state and renders one screen at a time based on a `tab` string. There is no router. Tab switching is done by calling `setTab(id)`.

Tabs: `home`, `train`, `progress`, `nutrition`, `feed`, `more`.

Root state passed down as props:
- `user` / `profile` — Supabase auth user and profiles row
- `sessions` — array of saved workout objects `{ name, exs, sets, vol, pts, date }`
- `leaderboard` — sorted array built from live `profiles` query; real-time subscription refreshes it on any profile change

### Screen components

| Component | Key props |
|---|---|
| `HomeScreen` | `sessions`, `leaderboard`, `profile`, `onStartWorkout`, `onQuickStart` |
| `TrainScreen` | `onSave`, `quickStart`, `onClearQuickStart` |
| `ProgressScreen` | `sessions` |
| `NutritionScreen` | — (real camera via `getUserMedia` + `BarcodeDetector`) |
| `FeedScreen` | `profile` |
| `MoreScreen` | `profile`, `onSignOut` |

### Data flow for saving a workout

`handleSave` in `SocialFitClub`:
1. Optimistic local update: prepend to `sessions`, update `profile.points` + `profile.sessions_count`, re-sort leaderboard
2. Parallel Supabase writes: `sessions.insert` + `profiles.update` (points + sessions_count)
3. Real-time subscription on `profiles` fires for all connected clients, triggering `loadLeaderboard`

### Design tokens

Two global constants at the top of `App.jsx` drive all styling:

- **`G`** — colour palette (gold `#FDB927`, purple `#552583`, backgrounds, text tints, glow shadow strings)
- **`FONT`** — three font stacks (`display` = Bebas Neue, `body` = Barlow Condensed, `mono`)

Never hardcode colours or fonts — always use `G` and `FONT`.

### Static / fixture data

Module-level constants: `EXERCISES`, `LEADERBOARD` (kept as fallback reference but not used at runtime), `FOODS`, `FOOD_CATS`, `BARCODE_DB`, `SCAN_MEALS`, `MACROS_GOAL`, `WEEKLY_VOLUME`, `EXERCISE_MUSCLE_MAP`, `MUSCLE_LABELS`, `MUSCLE_SUGGEST`.

### Muscle Heat Map

`calcMuscleScores(sessions)` → `{ muscleKey: 0–100 }`. `getHeatColor(score)` → blue→yellow→red via `lerpColor`. `MuscleHeatMap` renders an SVG body (`viewBox="0 0 200 440"`). AI alerts use raw (unfactored) scores; the period factor only scales the display colours.

### Shared atoms

`ChromeCard`, `NeonBtn`, `SectionLabel`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`, `GlowDot`, `RestTimer` — all defined in `App.jsx`.

### Styling conventions

- All styles are inline objects on the `style` prop
- Glow effects use `boxShadow` with values from `G` (e.g. `G.goldGlow`, `G.purpleGlow`)
- Animations declared in a `<style>` tag at the bottom of `SocialFitClub`'s render
- No CSS classes except the minimal reset in `src/index.css`
- Max width `480px`, `margin: 0 auto`, mobile-first; `viewport-fit=cover` in `index.html`
