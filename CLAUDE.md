# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run lint      # ESLint check
npm run preview   # preview production build locally
```

No test suite is configured.

## Architecture

The entire app lives in a **single file**: `src/App.jsx` (~1700 lines). There are no separate component files, no routing library, no state management library, and no CSS modules — all styling is inline CSS-in-JS.

### Design tokens

Two global constants at the top of `App.jsx` drive all styling:

- **`G`** — colour palette (gold `#FDB927`, purple `#552583`, backgrounds, text tints, glow shadow strings)
- **`FONT`** — three font stacks (`display` = Bebas Neue, `body` = Barlow Condensed, `mono`)

All components consume `G` and `FONT` directly — never hardcode colours or fonts.

### Navigation model

`SocialFitClub` (the default export) owns all top-level state and renders one screen at a time based on a `tab` string. There is no router. Tab switching is done by calling `setTab(id)`.

Current tabs: `home`, `train`, `progress`, `nutrition`, `feed`, `more`.

State owned at root and passed down as props:
- `sessions` — array of saved workout objects `{ name, exs, sets, vol, pts, date }`
- `leaderboard` — sorted array, mutated on session save
- `quickStartWorkout` — pre-filled workout passed from HomeScreen to TrainScreen

### Screen components

Each screen is a plain function component receiving `showToast` plus any data it needs:

| Component | Key props |
|---|---|
| `HomeScreen` | `sessions`, `leaderboard`, `onStartWorkout`, `onQuickStart` |
| `TrainScreen` | `onSave`, `quickStart`, `onClearQuickStart` |
| `ProgressScreen` | `sessions` |
| `NutritionScreen` | — |
| `FeedScreen` | — |
| `MoreScreen` | — |

### Static data

All fixture/seed data is declared as module-level constants: `EXERCISES`, `LEADERBOARD`, `FOODS`, `FOOD_CATS`, `BARCODE_DB`, `SCAN_MEALS`, `MACROS_GOAL`, `WEEKLY_VOLUME`, `EXERCISE_MUSCLE_MAP`, `MUSCLE_LABELS`, `MUSCLE_SUGGEST`, etc. None of it is fetched from an API.

### Muscle Heat Map

`calcMuscleScores(sessions)` aggregates workout data into a `{ muscleKey: 0–100 }` score map. `getHeatColor(score)` maps scores to a blue→yellow→red gradient via `lerpColor`. `MuscleHeatMap` renders an SVG body (viewBox `0 0 200 440`) with `BodyBase` providing the dark silhouette and individual `<g>` patches per muscle group. Rendered inside `ProgressScreen` under the "HEAT MAP" sub-tab.

### Shared atoms

Reusable primitives (all in `App.jsx`): `ChromeCard`, `NeonBtn`, `SectionLabel`, `StatPill`, `AvatarBadge`, `Chip`, `RingMeter`, `GridBg`, `GlowDot`, `RestTimer`.

### Fonts

Loaded via Google Fonts in `index.html`. The viewport meta uses `viewport-fit=cover` for iPhone safe-area support. Max width is capped at `480px` with `margin: 0 auto` for mobile-first layout.

### Styling conventions

- All styles are inline objects passed to the `style` prop
- Glow effects use `boxShadow` with rgba values from `G` (e.g. `G.goldGlow`, `G.purpleGlow`)
- Animations declared in a `<style>` tag at the bottom of `SocialFitClub`'s render
- No CSS classes are used except for the minimal reset in `src/index.css`
