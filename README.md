# Dark Ages

A turn-based plague-management strategy game, set in a stylized medieval Europe. A plague
sweeps 15 connected cities over 25 turns; from above, you contain it — quarantining, culling,
vaccinating, and (when nothing else will serve) calling down orbital strikes — and try to keep
as much of Europe alive as you can.

Originally a 2014 game-jam game (Dart + StageXL), rebuilt in 2026 as a TypeScript + PixiJS
HTML5 game for the browser / itch.io.

## Two modes

- **Classic** — a faithful reimplementation of the exact 2014 rules, imbalances and all.
- **Modern** — rebalanced and expanded: an action-point economy, costed/charge-limited orbital
  strikes, an infection-recovery mechanic, containment that actually works, percentage-based
  S–F grading, and a research/tech tree.

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # simulation unit tests (Vitest)
npm run build      # type-check + production build to dist/
npm run pack       # build + zip → darkages-itch.zip (ready for itch.io)
```

## Layout

```
src/sim/     Pure simulation core (engine, rulesets, map, research, scoring) — unit-tested.
src/game/    PixiJS presentation: scenes, UI, audio, assets.
public/      Art & audio (the subset the game uses).
legacy/      The original 2014 Dart/StageXL build, preserved for reference.
PLAN.md      Design plan.   STATUS.md  Build status.   ITCH.md  Publishing settings.
```

## Publishing

See [`ITCH.md`](ITCH.md). In short: `npm run pack`, upload `darkages-itch.zip`, set the itch
viewport to **1280×720** with the fullscreen button on.
