import type { GameState } from "./engine";

export type Grade = "S" | "A" | "B" | "C" | "D" | "F";

export interface ScoreResult {
  /** Primary number shown on the end screen. */
  value: number;
  /** Human label for the primary number. */
  label: string;
  survivors: number;
  deaths: number;
  resources: number;
  /** Percentage of the population that survived (0–100). */
  survivalPct: number;
  grade: Grade;
  /** Flavor verdict for the end screen. */
  verdict: string;
}

function gradeFor(pct: number): Grade {
  if (pct >= 90) return "S";
  if (pct >= 75) return "A";
  if (pct >= 55) return "B";
  if (pct >= 35) return "C";
  if (pct >= 15) return "D";
  return "F";
}

const VERDICTS: Record<Grade, string> = {
  S: "A golden age. Europe barely felt the plague's touch.",
  A: "A hard-won triumph. The continent endures, scarred but whole.",
  B: "Survival, at a cost. The bells toll for many.",
  C: "A pyrrhic vigil. Whole regions lie silent.",
  D: "Catastrophe. A broken remnant clings to life.",
  F: "The Dark Ages claim Europe. Almost nothing remains.",
};

export function computeScore(state: GameState): ScoreResult {
  const survivors = state.remaining;
  const total = state.totalPopulation();
  const deaths = state.deathToll();
  const survivalPct = total > 0 ? (survivors / total) * 100 : 0;
  const grade = gradeFor(survivalPct);

  if (state.rule.scoring === "percentage") {
    // Modern: reward both survival rate and resources harvested.
    // Score = survival% × 100, plus a small bonus for banked resources.
    const value = Math.round(survivalPct * 100 + state.resources / 10_000);
    return {
      value,
      label: "Score",
      survivors,
      deaths,
      resources: state.resources,
      survivalPct,
      grade,
      verdict: VERDICTS[grade],
    };
  }

  // Classic: raw surviving population, exactly like the 2014 end screen.
  return {
    value: survivors,
    label: "Score",
    survivors,
    deaths,
    resources: state.resources,
    survivalPct,
    grade,
    verdict: state.victory ? "The plague passes. Tally the cost." : "Europe is a graveyard.",
  };
}
