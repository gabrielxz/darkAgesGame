# Dark Ages — Remake Plan

A modern remake of the 2014 game-jam game **Dark Ages** ("Moon Virus"), targeting an
itch.io HTML5 release. Two modes share one engine:

- **Classic** — a faithful reimplementation of the exact 2014 rules (imbalances and all),
  preserved as a relic.
- **Modern** — the same game rebalanced and polished, with new systems that make it feel
  like a complete game.

Stack: **TypeScript + PixiJS + Vite**. Web-native, trivial itch.io upload, and PixiJS is
the spiritual successor to the original StageXL display-list model.

---

## 1. Architecture

The key idea: **one config-driven simulation core**, and the difference between Classic and
Modern is (almost) entirely a data object — `RuleSet` — plus a few feature flags. This keeps
both modes honest and testable.

```
src/
  sim/                      # pure logic, zero rendering deps — unit-testable
    types.ts                # City, Colony, RuleSet, Action, GameState interfaces
    rules.classic.ts        # exact 2014 constants + bug-compatible behaviors
    rules.modern.ts         # rebalanced constants + new-system params
    map.ts                  # the 15 cities, connections, starting data (per ruleset)
    engine.ts               # turn resolution: harvest→spread→die→spread→mature
    actions.ts              # action definitions, costs, eligibility, effects
    events.ts               # (modern) escalating outbreak event system
    score.ts                # scoring per ruleset
  game/                     # PixiJS view + controller
    app.ts                  # bootstrap, mode select, asset loading
    scenes/
      MenuScene.ts          # title, mode select, intro monologue
      GameScene.ts          # map, city nodes, action panel, end-turn
      EndScene.ts           # results + score breakdown + restart
    ui/
      CityNode.ts           # health/infected/dead bar, status icons, selection
      ActionPanel.ts        # buttons, costs, AP/resource display
      Hud.ts                # turn counter, resources, action points, objectives
    audio.ts                # sound manager (reuses original mp3/ogg assets)
    assets.ts               # manifest + Pixi Assets loader
  main.ts
public/
  images/  sounds/          # copied from the original web/ folder
index.html
vite.config.ts
```

**Determinism:** the sim is a pure reducer — `engine.resolveTurn(state, ruleset) -> state`.
No rendering or RNG inside except a seeded PRNG passed in (so Modern events are reproducible
and testable). The view never mutates sim state directly; it dispatches actions.

---

## 2. Simulation core (shared)

Ported 1:1 from the original `City`/`Colony`, but typed and parameterized. A `City` holds
`population, healthy, gettingSick, infected, dead, production`, the per-city modifiers
(`spreadTo/From/Within`, `deathRate`, `workforce`), and the status flags
(`houseArrest, quarantine, barricade, uprooted`). A `RuleSet` supplies every magic number
the original hard-coded:

```ts
interface RuleSet {
  gameTurns: number;
  spreadFromConst: number;      // 2014: 3
  spreadWithinConst: number;    // 2014: 5
  deathConst: number;           // 2014: 0.85
  actions: ActionConfig[];      // costs, magnitudes, per-turn limits
  scoring: ScoringConfig;
  features: {                   // off in Classic, on in Modern
    actionPoints: boolean;
    costedActions: boolean;
    events: boolean;
    research: boolean;
  };
}
```

Turn resolution order is preserved exactly from the original `turn_end()`:
**harvest → spreadWithin → succumb → spreadFrom → metastasize/reconfigure → decrement turn**.

---

## 3. Classic mode — faithful 2014 spec

Reimplemented to match the shipped behavior, **including its flaws**, so it stands as the
authentic original. Pulled directly from the source:

- 15 cities, 25 turns, `deathConst 0.85`, `spreadFrom 3`, `spreadWithin 5`.
- Exact starting populations/production/seed-infection from `city_init()` (incl. Stockholm
  at 500k / production 0, the connection graph, the 0.03–0.05 initial `gettingSick` seeds).
- All 7 actions with their original (mostly free, unlimited) effects.
- Score = surviving population.
- Preserve the known quirks verbatim and document them in code comments:
  - Stockholm dominating ~51% of score.
  - Free/unlimited Orbital Strike, no per-turn action limit.
  - Uproot's penalty being overwritten by `configure()`.
- Original art (`touch_up_map.png`, button sprites) and audio reused as-is.

A small `classic.golden.test.ts` will lock in turn-by-turn outputs for a fixed action script,
so we can prove the port matches the original math.

---

## 4. Modern mode — balance, polish, new systems

Same bones, retuned so decisions matter. Concrete proposals (all tunable in
`rules.modern.ts`, all open to playtest revision):

### Balance fixes
- **Kill the Stockholm problem.** Either scale populations into a tighter band (e.g.
  20k–80k) *or* switch scoring to **% of population saved** (weighted, not raw headcount) so
  no single city can carry the game. Recommendation: do both — tighter populations *and*
  percentage-based score.
- **Action economy.** Each turn grants **Action Points** (e.g. 3). Every action costs AP, so
  you can't blanket the map. This is the single biggest fun lever.
- **Costed Orbital Strike.** Make it expensive (limited charges and/or a large resource cost)
  so it's a desperate last resort, not a default.
- **Make resources matter.** Resources become the real currency: they pay for the costly
  actions, vaccination, and research. The "harvester" framing now has teeth — you're
  genuinely torn between keeping cities productive and containing the plague.
- **Retune lethality/spread.** Lower `deathConst` (e.g. ~0.4–0.5) so infections *persist* and
  the containment tools (quarantine, house arrest, barricade) actually get to do their job
  across multiple turns instead of cities flashing to dead in one tick.
- **Fix Uproot** so its tradeoff (productivity now, penalty next turn) actually lands.

### New systems
- **Escalating outbreak events** (seeded RNG): periodic events that ramp tension — new
  infection seeds (refugees), a **mutation** that raises virulence/spread mid-game, trade
  routes temporarily opening connections. Drives a difficulty curve the original lacks.
- **Research / tech** (light): spend resources over turns to unlock upgrades — a true vaccine,
  cheaper quarantine, an extra Action Point, reduced strike cost. Gives long-term goals.
- **Dual objective + clear framing.** Surface the goal explicitly: maximize **survivors** and
  **resources harvested** under escalating pressure, with the intro monologue and an
  objectives HUD so the player always knows what they're optimizing.

### Polish
- Proper win/lose end states that actually halt the loop, a results screen with a score
  breakdown, and restart/back-to-menu.
- Hover/selection feedback, action cost/eligibility shown on buttons (greyed when
  unaffordable), turn-resolution animation (the spaceship sweep), status-icon clarity.
- Audio mixing fixed (the original's overlapping music timers and tension fade reworked).

---

## 5. Assets & audio

Everything needed already exists in `web/images` and `web/sounds` — map render, all
button/icon sprites, the full FX set, ambient + tension tracks, victory/death stings, and the
opening monologue VO. We copy these into `public/` and load via Pixi's `Assets`. No new art is
strictly required to ship, though Modern mode may want a few new icons (AP, research, events).

---

## 6. Build & itch.io deployment

- **Vite** for dev server + production build → static `dist/` (HTML/JS/assets).
- itch.io: zip `dist/`, upload as an HTML5 project, set the canvas size, enable fullscreen.
  No server needed; plays in-browser. (Optional later: wrap with Electron/Tauri for a native
  desktop build on itch too.)
- A `butler` (itch CLI) push script can automate releases.

---

## 7. Milestones

1. **Scaffold** — Vite + TS + PixiJS project, asset pipeline, empty scenes, mode select.
2. **Sim core + Classic** — port `City`/`Colony`/`engine`, `rules.classic.ts`, golden tests
   proving parity with the 2014 math. Headless-playable via tests.
3. **Classic playable** — GameScene wired to the sim: map, city nodes, action panel, end
   screen. This is a shippable "Classic mode" on its own.
4. **Modern ruleset** — `rules.modern.ts` with rebalanced numbers + AP/costed actions +
   percentage scoring. Playtest and tune.
5. **Modern systems** — events, research, objectives HUD, win/lose polish.
6. **Polish & ship** — audio mix, animations, menu/intro, build, itch.io upload.

Each milestone is independently playable, so we can playtest balance early and often.

---

## 8. Open tuning questions (for playtest, not blocking)

- Exact Action Point budget per turn (3? scaling?).
- Orbital Strike cost model: charges vs. pure resource cost vs. both.
- Whether Modern keeps 25 turns or shortens for a tighter arc.
- Scoring formula weighting survivors vs. resources.
