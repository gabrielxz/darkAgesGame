import type { ActionId, ActionRule, RuleSet } from "./types";

// Classic actions: every action is free and unlimited, exactly as shipped in 2014.
// (Vaccinate is the lone exception — it costs resources equal to the city's healthy count.)
const free = (overrides: Partial<ActionRule> = {}): ActionRule => ({
  enabled: true,
  apCost: 0,
  resourceCost: 0,
  charges: null,
  ...overrides,
});

const actions: Record<ActionId, ActionRule> = {
  barricade: free(),
  orbitalStrike: free(),
  quarantine: free(),
  houseArrest: free(),
  uproot: free(),
  cull: free(),
  // Original vaccinate cost = healthy population of the target city.
  vaccinate: free({ dynamicResourceFactor: 1.0 }),
};

export const CLASSIC_RULES: RuleSet = {
  id: "classic",
  name: "Classic (2014)",
  gameTurns: 25,
  spreadFromConst: 3,
  spreadWithinConst: 5,
  deathConst: 0.85,
  recoveryRate: 0, // no recovery in 2014 — infected only die
  // Exactly the original hard-coded modifiers. Note quarantine/barricade do NOT
  // reduce *within*-city spread (spreadWithin: 1.0) — a key part of the brutal feel.
  containment: {
    houseArrest: { spreadWithin: 0.5, spreadFrom: 0.5 },
    quarantine: { spreadTo: 0.01, spreadFrom: 0.01, spreadWithin: 1.0 },
    barricade: { spreadTo: 0.15, spreadWithin: 1.0, workforceMul: 0.5 },
  },
  productionMul: 1,
  resourceBonusPerTurn: 0,
  vaccineCureFraction: 0,
  startingResources: 0,
  actionPoints: null, // unlimited
  actions,
  scoring: "population",
  features: { events: false, research: false },
};
