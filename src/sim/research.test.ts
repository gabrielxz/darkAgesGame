import { describe, it, expect } from "vitest";
import { createGame } from "./game";
import { TECHS, techById, canUnlock, unlock } from "./research";

describe("research tree", () => {
  it("gates a tier-2 tech behind its prerequisite", () => {
    const g = createGame("modern");
    g.resources = 10_000_000;
    const med2 = techById("med2")!;
    expect(canUnlock(g, med2).reason).toBe("locked");
    unlock(g, techById("med1")!);
    expect(canUnlock(g, med2).ok).toBe(true);
  });

  it("spends resources and applies the effect (recovery up)", () => {
    const g = createGame("modern");
    g.resources = 200_000;
    const before = g.rule.recoveryRate;
    expect(unlock(g, techById("med1")!)).toBe(true);
    expect(g.resources).toBe(50_000);
    expect(g.rule.recoveryRate).toBeCloseTo(before + 0.1);
  });

  it("blocks unlock when resources are short", () => {
    const g = createGame("modern");
    g.resources = 10_000;
    expect(unlock(g, techById("med1")!)).toBe(false);
    expect(g.unlockedTech.size).toBe(0);
  });

  it("Martial Law grants a permanent extra action point", () => {
    const g = createGame("modern");
    g.resources = 10_000_000;
    unlock(g, techById("con1")!);
    unlock(g, techById("con2")!);
    unlock(g, techById("con3")!);
    expect(g.rule.actionPoints).toBe(4);
    g.endTurn();
    expect(g.actionPoints).toBe(4);
  });

  it("Trade Charters increases harvested resources", () => {
    const base = createGame("modern");
    base.endTurn();
    const baseHarvest = base.resources;

    const boosted = createGame("modern");
    boosted.resources = 10_000_000;
    unlock(boosted, techById("log1")!);
    boosted.resources = base.rule.startingResources; // reset to compare harvest only
    boosted.endTurn();
    expect(boosted.resources).toBeGreaterThan(baseHarvest);
  });

  it("does not mutate the shared ruleset singleton across games", () => {
    const g1 = createGame("modern");
    g1.resources = 10_000_000;
    unlock(g1, techById("med1")!);
    const g2 = createGame("modern");
    // g2 must start from the pristine base recovery rate.
    expect(g2.rule.recoveryRate).toBeLessThan(g1.rule.recoveryRate);
  });

  it("every tier-2/3 tech has a valid prerequisite id", () => {
    for (const t of TECHS) {
      if (t.prereq) expect(techById(t.prereq)).toBeDefined();
    }
  });
});
