# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

There is no test suite configured.

## Architecture

This is a single-page React app (Vite + React 19) called **Social Fit Club (SFC)** — a mobile-first fitness tracker UI. The entire application lives in one file: `src/App.jsx` (~1268 lines).

### Structure within App.jsx

**Design tokens** — two top-level objects set the visual language for the whole app:
- `G` — all colors (Lakers gold/purple theme, background layers, glows, text shades)
- `FONT` — three font families (`display`, `body`, `mono`)

**Static data** — hardcoded at module level (no backend, no persistence):
- `EXERCISES` — master exercise list for workout logging
- `LEADERBOARD` — mock user rankings; `isMe: true` marks the current user's entry
- `FEED_DATA` — mock social feed posts
- `FOODS` / `FOOD_CATS` / `BARCODE_DB` — nutrition database for the fuel tracker
- `SCAN_MEALS` — mock AI meal-scan results
- `REST_OPTIONS` / `WEEKLY_VOLUME` / `DAYS_SHORT` — workout stats data

**Shared UI primitives** (pure presentational, no state):
- `GlowDot`, `SectionLabel`, `ChromeCard`, `NeonBtn`, `NeonOutlineBtn`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`

**Feature screens** (each is a self-contained function component):
- `HomeScreen` — dashboard: stats card, weekly volume bar chart, quick-start presets, leaderboard podium
- `TrainScreen` — workout logger with set/rep tracking, rest timer, exercise search, program browser
- `ProgressScreen` — body metrics, PRs, historical charts
- `NutritionScreen` — food diary with macro ring meters, barcode scanner simulation, AI meal scan
- `FeedScreen` — social feed with likes
- `MoreScreen` — settings, challenges, accountability features

**Root component** — `SocialFitClub` (default export) owns all cross-screen state:
- `tab` — active screen (drives conditional rendering, no router)
- `sessions` — workout history array, updated by `handleSave`
- `leaderboard` — re-sorted on each save to reflect updated user points
- `quickStartWorkout` — passed from HomeScreen to TrainScreen to pre-populate a workout
- `toast` — transient notification shown via `showToast(msg)`

### Styling approach

All styles are inline (`style={{}}`), using the `G` and `FONT` constants directly. There is no CSS framework. `src/index.css` only sets global resets and font smoothing. A small `<style>` block inside `SocialFitClub` handles the toast animation and a few global overrides (scrollbar hiding, tap highlight removal).

### Layout constraints

The app is capped at `maxWidth: 480px` (mobile-first). The fixed bottom nav bar has 82px height, so all screen content uses `paddingBottom: 82` to avoid being obscured.
