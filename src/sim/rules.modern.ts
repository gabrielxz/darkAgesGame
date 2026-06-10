import type { ActionId, ActionRule, RuleSet } from "./types";

// Modern actions carry a real economy: each costs Action Points (you get 3/turn),
// and the powerful ones cost resources and/or have limited charges. This is what
// turns "do everything to every city" into actual decisions.
// All numbers are starting points for playtest tuning (see PLAN.md §8).
const actions: Record<ActionId, ActionRule> = {
  // Containment toggles — cheap, the bread-and-butter tools.
  barricade: { enabled: true, apCost: 1, resourceCost: 0, charges: null },
  houseArrest: { enabled: true, apCost: 1, resourceCost: 0, charges: null },
  // Quarantine fully halts a city's output, so it carries an upkeep cost too.
  quarantine: { enabled: true, apCost: 1, resourceCost: 40_000, charges: null },
  // Uproot: productivity burst now, dead turn next — a tempo gamble.
  uproot: { enabled: true, apCost: 1, resourceCost: 0, charges: null },
  // Cull: kill most of the infected at a civilian cost. Mid-cost.
  cull: { enabled: true, apCost: 2, resourceCost: 120_000, charges: null },
  // Vaccinate: protective, scales with the city size you're saving (discounted vs Classic).
  vaccinate: { enabled: true, apCost: 2, resourceCost: 0, dynamicResourceFactor: 1.5, charges: null },
  // Orbital Strike: the nuclear option. Expensive AND only 3 charges all game.
  orbitalStrike: { enabled: true, apCost: 3, resourceCost: 250_000, charges: 3 },
};

export const MODERN_RULES: RuleSet = {
  id: "modern",
  name: "Modern",
  gameTurns: 25,
  // Tuned so the plague is survivable through containment, not just nukes.
  // Lower spread, modest lethality, and — critically — a recovery rate so an
  // infected city isn't automatically doomed.
  spreadFromConst: 1.0,
  spreadWithinConst: 1.6,
  deathConst: 0.22,
  recoveryRate: 0.35,
  // Modern containment actually works: quarantine/barricade cut *within*-city
  // spread too, so locking a city down can save it.
  containment: {
    houseArrest: { spreadWithin: 0.4, spreadFrom: 0.5 },
    quarantine: { spreadTo: 0.02, spreadFrom: 0.02, spreadWithin: 0.1 },
    barricade: { spreadTo: 0.2, spreadWithin: 0.55, workforceMul: 0.5 },
  },
  productionMul: 1,
  resourceBonusPerTurn: 0,
  vaccineCureFraction: 0,
  startingResources: 100_000,
  actionPoints: 3,
  actions,
  scoring: "percentage",
  features: { events: true, research: true },
};
