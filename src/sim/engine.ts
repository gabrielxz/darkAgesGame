// Faithful TypeScript port of the 2014 Dart City/Colony simulation.
//
// Integer semantics matter: the original Dart used `.toInt()` (truncate toward zero)
// and `.ceil().toInt()`. We replicate those with Math.trunc / Math.ceil so Classic mode
// reproduces the original turn-by-turn math exactly (locked in by classic parity tests).

import type { ActionId, CityDef, RuleSet } from "./types";

export class City {
  name: string;
  population: number;
  production: number;
  x: number;
  y: number;

  dead = 0;
  infected = 0;
  gettingSick = 0;
  healthy = 0;

  // Modifiers, recomputed by configure() each turn.
  spreadFromFactor = 1.0;
  spreadToFactor = 1.0;
  spreadWithinFactor = 1.0;
  deathRate = 1.0;
  workforce = 0;

  // Status flags (mutually exclusive containment measures + uprooted).
  houseArrest = false;
  quarantine = false;
  barricade = false;
  uprooted = false;

  neighbors: City[] = [];
  private rule: RuleSet;

  constructor(def: CityDef, rule: RuleSet) {
    this.rule = rule;
    this.name = def.name;
    this.production = def.production;
    this.x = def.x;
    this.y = def.y;
    this.population = def.population;
    // Seed initial "getting sick" count, truncated like the original.
    this.gettingSick = Math.trunc(def.gettingSickFraction * def.population);
    this.healthy = def.population - this.gettingSick;
  }

  configure(): void {
    this.spreadToFactor = 1.0;
    this.spreadFromFactor = 1.0;
    this.spreadWithinFactor = 1.0;
    this.deathRate = 1.0;
    this.workforce = this.population - this.dead;

    const c = this.rule.containment;
    if (this.houseArrest) {
      this.spreadWithinFactor *= c.houseArrest.spreadWithin;
      this.spreadFromFactor *= c.houseArrest.spreadFrom;
      this.workforce -= this.infected;
    }
    if (this.quarantine) {
      this.spreadToFactor *= c.quarantine.spreadTo;
      this.spreadFromFactor *= c.quarantine.spreadFrom;
      this.spreadWithinFactor *= c.quarantine.spreadWithin;
      this.workforce = 0;
    }
    if (this.barricade) {
      this.spreadToFactor *= c.barricade.spreadTo;
      this.spreadWithinFactor *= c.barricade.spreadWithin;
      this.workforce *= c.barricade.workforceMul;
    }
    if (this.uprooted) {
      this.workforce = 0;
    }
  }

  private kill(infectedCnt: number, healthyCnt: number): void {
    infectedCnt = Math.ceil(infectedCnt); // .ceil().toInt() — ceil is already integral
    healthyCnt = Math.trunc(healthyCnt);
    this.dead += infectedCnt;
    this.infected -= infectedCnt;
    this.dead += healthyCnt;
    this.healthy -= healthyCnt;
  }

  infect(spreadFactor: number, adjust: number): void {
    let infection = spreadFactor * adjust;
    if (infection > this.healthy) infection = this.healthy;
    infection = Math.trunc(infection);
    this.gettingSick += infection;
    this.healthy -= infection;
  }

  spreadWithin(): void {
    this.infect(this.rule.spreadWithinConst, this.infected * this.spreadWithinFactor);
  }

  spreadFrom(): void {
    const fromRate = this.infected * this.spreadFromFactor * this.rule.spreadFromConst;
    for (const to of this.neighbors) {
      to.infect(fromRate, to.spreadToFactor);
    }
  }

  succumb(): void {
    let deaths = this.infected * this.rule.deathConst * this.deathRate;
    if (deaths > this.infected) deaths = this.infected;
    this.kill(deaths, 0);
  }

  /** Modern recovery: a fraction of the infected return to healthy each turn. */
  recover(): void {
    if (this.rule.recoveryRate <= 0) return;
    const recovered = Math.trunc(this.infected * this.rule.recoveryRate);
    this.infected -= recovered;
    this.healthy += recovered;
  }

  metastasize(): void {
    this.infected += this.gettingSick;
    this.gettingSick = 0;
  }

  harvest(): number {
    return Math.trunc(this.workforce * this.production * this.rule.productionMul);
  }

  /** Vaccinate cure (Modern research): clear a fraction of the infected outright. */
  cure(fraction: number): void {
    if (fraction <= 0) return;
    const cured = Math.trunc(this.infected * fraction);
    this.infected -= cured;
    this.healthy += cured;
  }

  // --- Containment toggles (mutually exclusive) ---

  setQuarantine(): void {
    if (!this.quarantine) {
      this.houseArrest = false;
      this.barricade = false;
      this.quarantine = true;
    } else {
      this.quarantine = false;
    }
    this.configure();
  }

  setHouseArrest(): void {
    if (!this.houseArrest) {
      this.houseArrest = true;
      this.barricade = false;
      this.quarantine = false;
    } else {
      this.houseArrest = false;
    }
    this.configure();
  }

  setBarricade(): void {
    if (!this.barricade) {
      this.houseArrest = false;
      this.barricade = true;
      this.quarantine = false;
    } else {
      this.barricade = false;
    }
    this.configure();
  }

  // --- One-shot actions ---

  wipeout(): void {
    this.kill(this.infected, this.healthy);
    this.houseArrest = false;
    this.quarantine = false;
  }

  cull(): void {
    this.kill(this.infected * 0.85, this.healthy * 0.05);
    this.workforce *= 0.5;
  }

  uproot(): void {
    this.workforce = Math.trunc(this.workforce * 1.5);
    this.uprooted = true;
  }

  medicate(): void {
    this.spreadToFactor *= 0.5;
    this.spreadFromFactor *= 0.5;
    this.spreadWithinFactor *= 0.5;
  }

  get living(): number {
    return this.population - this.dead;
  }
}

export interface CityConnections {
  /** Pairs of city indices that are adjacent. */
  edges: [number, number][];
}

export class GameState {
  /** Per-game copy of the ruleset — the research tree mutates these values. */
  readonly rule: RuleSet;
  readonly cities: City[];
  /** Unlocked research tech ids (Modern). */
  readonly unlockedTech = new Set<string>();

  resources: number;
  remainingTurns: number;
  /** Total living population across all cities (updated each turn). */
  remaining: number;
  selected: City;

  /** Action points left this turn (Modern). Infinity in Classic. */
  actionPoints: number;
  /** Remaining charges per limited action (Modern). */
  charges: Record<string, number>;

  gameOver = false;
  victory = false;

  constructor(rule: RuleSet, defs: CityDef[], edges: [number, number][]) {
    // Clone so research mutations stay local to this game (the singletons are shared).
    this.rule = structuredClone(rule);
    this.cities = defs.map((d) => new City(d, this.rule));

    for (const [a, b] of edges) {
      this.cities[a].neighbors.push(this.cities[b]);
      this.cities[b].neighbors.push(this.cities[a]);
    }

    this.resources = rule.startingResources;
    this.remainingTurns = rule.gameTurns;
    this.remaining = 0;

    // Mirror the original Colony constructor: mature seeded infections, configure, tally.
    for (const c of this.cities) {
      c.metastasize();
      c.configure();
      this.remaining += c.population;
    }

    this.selected = this.cities[0];
    this.actionPoints = rule.actionPoints ?? Infinity;
    this.charges = {};
    for (const [id, r] of Object.entries(rule.actions)) {
      if (r.charges != null) this.charges[id] = r.charges;
    }
  }

  select(city: City): void {
    this.selected = city;
  }

  /** Resource cost of an action against the currently selected city. */
  actionCost(id: ActionId): number {
    const r = this.rule.actions[id];
    if (r.dynamicResourceFactor != null) {
      return Math.ceil(this.selected.healthy * r.dynamicResourceFactor);
    }
    return r.resourceCost;
  }

  /** Whether the selected action can currently be afforded/used. */
  canApply(id: ActionId): { ok: boolean; reason?: string } {
    const r = this.rule.actions[id];
    if (!r.enabled) return { ok: false, reason: "unavailable" };
    if (this.gameOver) return { ok: false, reason: "game over" };
    if (this.actionPoints < r.apCost) return { ok: false, reason: "not enough action points" };
    if (r.charges != null && (this.charges[id] ?? 0) <= 0) {
      return { ok: false, reason: "no charges left" };
    }
    const cost = this.actionCost(id);
    if (this.resources < cost) return { ok: false, reason: "not enough resources" };
    return { ok: true };
  }

  /**
   * Apply an action to the selected city. Returns true if it was applied.
   * Pays AP/resource/charge costs (Modern); in Classic these are all free/unlimited.
   */
  apply(id: ActionId): boolean {
    const check = this.canApply(id);
    if (!check.ok) return false;

    const r = this.rule.actions[id];
    const city = this.selected;

    // Vaccinate has its own pay-and-effect contract in the original; preserve it.
    if (id === "vaccinate") {
      const cost = this.actionCost(id);
      if (this.resources < cost) return false;
      this.resources -= cost;
      city.medicate();
      city.cure(this.rule.vaccineCureFraction);
    } else {
      this.resources -= this.actionCost(id);
      switch (id) {
        case "barricade":
          city.setBarricade();
          break;
        case "quarantine":
          city.setQuarantine();
          break;
        case "houseArrest":
          city.setHouseArrest();
          break;
        case "orbitalStrike":
          city.wipeout();
          break;
        case "cull":
          city.cull();
          break;
        case "uproot":
          city.uproot();
          break;
      }
    }

    this.actionPoints -= r.apCost;
    if (r.charges != null) this.charges[id] = (this.charges[id] ?? 0) - 1;
    return true;
  }

  /** Resolve a turn. Mirrors the original Colony.turn_end() ordering exactly. */
  endTurn(): void {
    if (this.gameOver) return;

    for (const c of this.cities) this.resources += c.harvest();
    this.resources += this.rule.resourceBonusPerTurn;
    for (const c of this.cities) c.spreadWithin();
    for (const c of this.cities) c.succumb();
    for (const c of this.cities) c.recover();
    for (const c of this.cities) c.spreadFrom();

    this.remaining = 0;
    for (const c of this.cities) {
      c.metastasize();
      c.configure();
      if (c.uprooted) c.uprooted = false;
      this.remaining += c.population - c.dead;
    }
    this.remainingTurns--;

    // Refill action points for the new turn.
    this.actionPoints = this.rule.actionPoints ?? Infinity;

    this.checkEnd();
  }

  private checkEnd(): void {
    if (this.remaining <= 0) {
      this.gameOver = true;
      this.victory = false;
    } else if (this.remainingTurns <= 0) {
      this.gameOver = true;
      this.victory = true;
    }
  }

  deathToll(): number {
    let toll = 0;
    for (const c of this.cities) toll += c.dead;
    return toll;
  }

  /** Total starting population. */
  totalPopulation(): number {
    let total = 0;
    for (const c of this.cities) total += c.population;
    return total;
  }
}
