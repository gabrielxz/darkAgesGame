import type { GameState } from "./engine";

export type Branch = "medicine" | "containment" | "logistics";

export interface Tech {
  id: string;
  name: string;
  branch: Branch;
  tier: number;
  cost: number;
  prereq: string | null;
  description: string;
  /** Mutates the per-game ruleset (and sometimes live state) when unlocked. */
  apply: (state: GameState) => void;
}

export const BRANCHES: { id: Branch; name: string }[] = [
  { id: "medicine", name: "Medicine" },
  { id: "containment", name: "Containment" },
  { id: "logistics", name: "Logistics" },
];

export const TECHS: Tech[] = [
  // --- Medicine: fight the infection itself ---
  {
    id: "med1",
    name: "Herbal Remedies",
    branch: "medicine",
    tier: 1,
    cost: 150_000,
    prereq: null,
    description: "+10% recovery: more of the infected pull through each turn.",
    apply: (s) => {
      s.rule.recoveryRate += 0.1;
    },
  },
  {
    id: "med2",
    name: "Physicians' Guild",
    branch: "medicine",
    tier: 2,
    cost: 350_000,
    prereq: "med1",
    description: "+15% recovery on top of Herbal Remedies.",
    apply: (s) => {
      s.rule.recoveryRate += 0.15;
    },
  },
  {
    id: "med3",
    name: "Inoculation",
    branch: "medicine",
    tier: 3,
    cost: 600_000,
    prereq: "med2",
    description: "Vaccinate now CURES half of a city's infected outright.",
    apply: (s) => {
      s.rule.vaccineCureFraction = 0.5;
    },
  },

  // --- Containment: make the cordon tools stronger/cheaper ---
  {
    id: "con1",
    name: "Sanitation",
    branch: "containment",
    tier: 1,
    cost: 150_000,
    prereq: null,
    description: "Quarantine costs 50% less to impose.",
    apply: (s) => {
      s.rule.actions.quarantine.resourceCost = Math.round(s.rule.actions.quarantine.resourceCost * 0.5);
    },
  },
  {
    id: "con2",
    name: "City Walls",
    branch: "containment",
    tier: 2,
    cost: 300_000,
    prereq: "con1",
    description: "Barricades become far stronger at blocking infection.",
    apply: (s) => {
      s.rule.containment.barricade.spreadTo *= 0.5;
      s.rule.containment.barricade.spreadWithin *= 0.6;
    },
  },
  {
    id: "con3",
    name: "Martial Law",
    branch: "containment",
    tier: 3,
    cost: 500_000,
    prereq: "con2",
    description: "+1 Action Point every turn.",
    apply: (s) => {
      if (s.rule.actionPoints != null) {
        s.rule.actionPoints += 1;
        s.actionPoints += 1;
      }
    },
  },

  // --- Logistics: grow the economy that powers everything else ---
  {
    id: "log1",
    name: "Trade Charters",
    branch: "logistics",
    tier: 1,
    cost: 150_000,
    prereq: null,
    description: "+25% production from every city.",
    apply: (s) => {
      s.rule.productionMul += 0.25;
    },
  },
  {
    id: "log2",
    name: "Granaries",
    branch: "logistics",
    tier: 2,
    cost: 300_000,
    prereq: "log1",
    description: "+60K resources banked at the end of every turn.",
    apply: (s) => {
      s.rule.resourceBonusPerTurn += 60_000;
    },
  },
  {
    id: "log3",
    name: "Orbital Logistics",
    branch: "logistics",
    tier: 3,
    cost: 500_000,
    prereq: "log2",
    description: "Orbital Strike costs 1 less AP, is half price, and gains +2 charges.",
    apply: (s) => {
      const os = s.rule.actions.orbitalStrike;
      os.apCost = Math.max(1, os.apCost - 1);
      os.resourceCost = Math.round(os.resourceCost * 0.5);
      if (os.charges != null) {
        os.charges += 2;
        s.charges["orbitalStrike"] = (s.charges["orbitalStrike"] ?? 0) + 2;
      }
    },
  },
];

export function techById(id: string): Tech | undefined {
  return TECHS.find((t) => t.id === id);
}

export interface UnlockCheck {
  ok: boolean;
  reason?: "owned" | "locked" | "cost";
}

export function canUnlock(state: GameState, tech: Tech): UnlockCheck {
  if (state.unlockedTech.has(tech.id)) return { ok: false, reason: "owned" };
  if (tech.prereq && !state.unlockedTech.has(tech.prereq)) return { ok: false, reason: "locked" };
  if (state.resources < tech.cost) return { ok: false, reason: "cost" };
  return { ok: true };
}

/** Attempt to buy a tech. Returns true on success. */
export function unlock(state: GameState, tech: Tech): boolean {
  if (!canUnlock(state, tech).ok) return false;
  state.resources -= tech.cost;
  state.unlockedTech.add(tech.id);
  tech.apply(state);
  return true;
}
