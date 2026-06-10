// Core shared types for the Dark Ages simulation.
// The same engine runs both Classic (faithful 2014 rules) and Modern (rebalanced)
// — the only difference is the RuleSet data object and a few feature flags.

export type ModeId = "classic" | "modern";

export type ActionId =
  | "barricade"
  | "orbitalStrike"
  | "quarantine"
  | "houseArrest"
  | "uproot"
  | "vaccinate"
  | "cull";

/** Static definition of a city on the map (per ruleset). */
export interface CityDef {
  name: string;
  population: number;
  /** Resources produced per worker per turn. */
  production: number;
  /** Fraction of population that starts "getting sick" (becomes infected turn 0). */
  gettingSickFraction: number;
  x: number;
  y: number;
}

/** Per-action economy rules. Effects live in the City methods; this is just cost/availability. */
export interface ActionRule {
  enabled: boolean;
  /** Action points consumed. 0 in Classic (no AP economy). */
  apCost: number;
  /** Flat resource cost. */
  resourceCost: number;
  /** If set, resource cost is computed from the target city's healthy count × this factor. */
  dynamicResourceFactor?: number;
  /** Total uses allowed per game. null = unlimited. */
  charges: number | null;
}

/** How each containment measure modifies a city's spread/workforce. */
export interface ContainmentRule {
  houseArrest: { spreadWithin: number; spreadFrom: number };
  quarantine: { spreadTo: number; spreadFrom: number; spreadWithin: number };
  barricade: { spreadTo: number; spreadWithin: number; workforceMul: number };
}

export interface RuleSet {
  id: ModeId;
  name: string;
  gameTurns: number;

  // Spread/lethality constants (originally hard-coded in city.dart).
  spreadFromConst: number;
  spreadWithinConst: number;
  deathConst: number;
  /** Fraction of a city's infected who recover to healthy each turn. 0 = no recovery (Classic). */
  recoveryRate: number;
  containment: ContainmentRule;

  // --- Global modifiers (mutated per-game by the research tree; neutral by default) ---
  /** Multiplier on every city's harvest output. */
  productionMul: number;
  /** Flat resources granted at the end of each turn. */
  resourceBonusPerTurn: number;
  /** Fraction of a city's infected that Vaccinate also cures (0 = spread-only, like the original). */
  vaccineCureFraction: number;

  startingResources: number;
  /** Action points granted each turn. null = unlimited (Classic). */
  actionPoints: number | null;

  actions: Record<ActionId, ActionRule>;

  /** "population" = raw survivors (Classic). "percentage" = % of population saved (Modern). */
  scoring: "population" | "percentage";

  features: {
    events: boolean;
    research: boolean;
  };
}
