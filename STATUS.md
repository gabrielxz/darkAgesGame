# Build Status

A running tally of the remake (see `PLAN.md` for the full design). Run with `npm run dev`,
test with `npm test`, build with `npm run build`.

## Done & verified

- **Scaffold** — Vite + TypeScript + PixiJS 8 + Vitest. Original art/audio copied to `public/`.
- **Simulation core** (`src/sim/`) — faithful TS port of the 2014 `City`/`Colony` math,
  ruleset-driven. 17 passing tests, including hand-traced parity values that lock Classic to
  the original numbers.
- **Classic mode** — the exact 2014 rules (Stockholm 500k imbalance, free/unlimited orbital
  strikes, 0.85 death rate, no within-city containment). Fully playable; preserved on purpose.
- **Modern mode — rebalanced & playable.** Action-point economy (3/turn), costed + charge-
  limited Orbital Strike, resource costs, tighter populations, percentage scoring with letter
  grades (S–F). Two new mechanics make it a real game:
  - **Recovery** — a fraction of the infected return to healthy each turn.
  - **Working containment** — quarantine/barricade now cut *within*-city spread.
  - Result: doing nothing ≈ 0.5% survival (F), smart quarantine ≈ 95% (S). A genuine skill
    gradient instead of "nuke everything."
- **Full UI** — menu + mode select, map with clickable city nodes (health/infected/dead bars,
  status icons), HUD (turn/resources/AP/dead), action panel with cost badges + affordability
  gating, roaming-ship turn timer, end screen with grade + verdict + score breakdown.
- **Audio** — original music/SFX wired (ambient → tension ramp, per-action SFX, victory/death).
- Verified end-to-end through the real UI with headless Chromium (no console errors).

- **Research / tech tree (M5 — done).** A 9-tech tree in 3 branches (Medicine / Containment /
  Logistics), 3 tiers each with prerequisites and resource costs. Effects wire into the engine:
  +recovery, +production, +1 action point, vaccine-cures-infected, cheaper quarantine, stronger
  barricades, per-turn resource income, and an orbital-strike upgrade. Per-game ruleset clone
  keeps unlocks from leaking between games. Full-screen overlay UI (opened from a Research
  button, Modern only). 7 tests + UI verification.

- **Onboarding (done).** Per-mode **Briefing** screen (premise, goal, turn loop), an openable
  **How to Play** overlay (from the menu, the briefing, and an in-game `?` button), and **hover
  tooltips** on every action showing its effect and cost. Copy lives in `src/game/content.ts`.
- **Polish (done).** City nodes redrawn for legibility (dark backing, drop shadow, outlined
  bars) so they pop off the busy map; in-game **mute** and **fullscreen** buttons; the themed
  **font is self-hosted** (no external requests on itch).
- **Shippable build (done).** `npm run pack` → `darkages-itch.zip` (~12 MB, `index.html` at
  root). `public/` pruned to only the 18 images + 11 sounds actually used (was 27 MB → 12 MB).
  Production build verified end-to-end in a headless browser (no errors, no failed requests).
  itch.io settings documented in `ITCH.md`.

## Remaining / optional

- **Optional gameplay extras (not built):** escalating outbreak events (seeded RNG) and an
  objectives HUD. Deferred — research was the prioritized M5 system.
- **Balance tuning:** Modern constants in `rules.modern.ts` are first-pass; playtest and adjust.
- Not yet committed to git (cloned via gh; `.git` present). Commit when ready.

## How to ship

```bash
npm run pack          # build + zip → darkages-itch.zip
```
Then follow `ITCH.md` (viewport 1280×720, fullscreen on, autostart off).

## Tuning notes (playtest-tunable, in `rules.modern.ts`)

Current Modern constants: deathConst 0.22, recoveryRate 0.35, spreadWithin 1.6, spreadFrom 1.0,
3 AP/turn, Orbital Strike 250k + 3 charges, starting resources 100k.
