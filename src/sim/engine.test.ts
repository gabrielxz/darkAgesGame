import { describe, it, expect } from "vitest";
import { createGame } from "./game";
import { GameState } from "./engine";
import { CLASSIC_RULES } from "./rules.classic";
import { CLASSIC_CITIES, CITY_EDGES } from "./map";

// Index reference for the classic map (order matches city_init()).
const CONSTANTINOPLE = 0;
const BARCELONA = 2;
const STOCKHOLM = 10;

describe("classic: initial state matches city_init() exactly", () => {
  const g = createGame("classic");

  it("seeds infections via metastasize (gettingSick -> infected)", () => {
    // Constantinople: trunc(0.04 * 15000) = 600 seeded, matured to infected.
    expect(g.cities[CONSTANTINOPLE].infected).toBe(600);
    expect(g.cities[CONSTANTINOPLE].gettingSick).toBe(0);
    expect(g.cities[CONSTANTINOPLE].healthy).toBe(14400);
    expect(g.cities[CONSTANTINOPLE].workforce).toBe(15000);
  });

  it("leaves un-seeded cities fully healthy", () => {
    expect(g.cities[BARCELONA].infected).toBe(0);
    expect(g.cities[BARCELONA].healthy).toBe(55000);
  });

  it("keeps Stockholm as the 500k / 0-production reservoir (the classic imbalance)", () => {
    expect(g.cities[STOCKHOLM].population).toBe(500000);
    expect(g.cities[STOCKHOLM].production).toBe(0);
    expect(g.cities[STOCKHOLM].infected).toBe(0);
  });

  it("totals the full starting population", () => {
    expect(g.totalPopulation()).toBe(980000);
    expect(g.remaining).toBe(980000);
  });
});

describe("classic: turn resolution math", () => {
  it("harvests exactly the hand-computed resource total on turn 1 (no actions)", () => {
    const g = createGame("classic");
    g.endTurn();
    // Sum of trunc(workforce * production) over all 15 cities at full population.
    expect(g.resources).toBe(916250);
  });

  it("wipes out everyone if the player does nothing (brutal 2014 lethality)", () => {
    // 0.85 death rate + spread-of-3, and quarantine never reduces *within*-city
    // spread, so passivity is fatal — exactly as the original played.
    const g = createGame("classic");
    for (let i = 0; i < 25; i++) g.endTurn();
    expect(g.gameOver).toBe(true);
    expect(g.victory).toBe(false);
    expect(g.remaining).toBe(0);
  });

  it("documents the dominant free-orbital-strike strategy (Classic flaw preserved)", () => {
    // Nuking every infected city is free and unlimited, and saves the most people
    // (Stockholm's 500k survives) — the imbalance Classic intentionally keeps.
    const g = createGame("classic");
    for (let i = 0; i < 25; i++) {
      for (const c of g.cities) {
        g.select(c);
        if (c.infected > 100 && c.living > 0) g.apply("orbitalStrike");
      }
      g.endTurn();
    }
    expect(g.victory).toBe(true);
    expect(g.remaining).toBeGreaterThan(500000);
    expect(g.cities[STOCKHOLM].living).toBeGreaterThan(0);
  });
});

describe("classic: action effects match the original City methods", () => {
  function fresh(): GameState {
    return new GameState(CLASSIC_RULES, CLASSIC_CITIES, CITY_EDGES);
  }

  it("orbital strike (wipeout) kills everyone in the city", () => {
    const g = fresh();
    g.select(g.cities[CONSTANTINOPLE]); // infected 600, healthy 14400
    g.apply("orbitalStrike");
    const c = g.cities[CONSTANTINOPLE];
    expect(c.infected).toBe(0);
    expect(c.healthy).toBe(0);
    expect(c.dead).toBe(15000);
    expect(c.living).toBe(0);
  });

  it("cull kills 85% infected + 5% healthy and halves workforce", () => {
    const g = fresh();
    g.select(g.cities[CONSTANTINOPLE]);
    g.apply("cull");
    const c = g.cities[CONSTANTINOPLE];
    // ceil(600*0.85)=510 infected killed -> 90 remain; trunc(14400*0.05)=720 healthy killed.
    expect(c.infected).toBe(90);
    expect(c.healthy).toBe(13680);
    expect(c.dead).toBe(1230);
    expect(c.workforce).toBe(7500);
  });

  it("containment toggles are mutually exclusive", () => {
    const g = fresh();
    g.select(g.cities[BARCELONA]);
    g.apply("quarantine");
    expect(g.cities[BARCELONA].quarantine).toBe(true);
    g.apply("barricade");
    expect(g.cities[BARCELONA].quarantine).toBe(false);
    expect(g.cities[BARCELONA].barricade).toBe(true);
  });

  it("vaccinate costs the city's healthy count in resources", () => {
    const g = fresh();
    g.resources = 100000;
    g.select(g.cities[BARCELONA]); // healthy 55000
    const ok = g.apply("vaccinate");
    expect(ok).toBe(true);
    expect(g.resources).toBe(45000);
    expect(g.cities[BARCELONA].spreadWithinFactor).toBe(0.5);
  });
});

describe("modern: economy gates actions", () => {
  it("starts with 3 action points and starting resources", () => {
    const g = createGame("modern");
    expect(g.actionPoints).toBe(3);
    expect(g.resources).toBe(100000);
  });

  it("spends action points and refills them at end of turn", () => {
    const g = createGame("modern");
    g.select(g.cities[1]);
    g.apply("barricade"); // apCost 1
    expect(g.actionPoints).toBe(2);
    g.endTurn();
    expect(g.actionPoints).toBe(3);
  });

  it("blocks actions when resources are insufficient", () => {
    const g = createGame("modern");
    g.resources = 0;
    g.select(g.cities[1]);
    expect(g.canApply("cull").ok).toBe(false); // costs 120k
    expect(g.apply("cull")).toBe(false);
  });

  it("recovers a fraction of the infected each turn (Modern only)", () => {
    const g = createGame("modern");
    const c = g.cities[0];
    // Force a known infected count, isolate from spread by quarantining.
    c.infected = 1000;
    c.healthy = 0;
    g.select(c);
    g.apply("quarantine");
    const before = c.infected;
    g.endTurn();
    // recoveryRate 0.35 + deathConst 0.22 should shrink the infected pool,
    // and recovered people return to healthy.
    expect(c.infected).toBeLessThan(before);
    expect(c.healthy).toBeGreaterThan(0);
  });

  it("makes smart containment a winning strategy (rebalanced)", () => {
    const g = createGame("modern");
    for (let t = 0; t < 25; t++) {
      for (const c of g.cities) {
        if (c.infected > 30 && !c.quarantine) {
          g.select(c);
          g.apply("quarantine");
        }
      }
      g.endTurn();
    }
    // Good play should save the large majority of the population.
    const pct = (g.remaining / g.totalPopulation()) * 100;
    expect(pct).toBeGreaterThan(60);
  });

  it("limits orbital strike to its charges", () => {
    const g = createGame("modern");
    g.resources = 10_000_000;
    expect(g.charges["orbitalStrike"]).toBe(3);
    for (let i = 0; i < 3; i++) {
      g.select(g.cities[i]);
      expect(g.apply("orbitalStrike")).toBe(true);
      g.actionPoints = 3; // refund AP so we isolate the charge limit
    }
    g.select(g.cities[5]);
    expect(g.canApply("orbitalStrike").ok).toBe(false);
  });
});
