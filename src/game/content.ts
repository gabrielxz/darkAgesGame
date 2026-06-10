import type { ModeId } from "../sim/types";
import { ACTION_META, ACTION_ORDER } from "../sim/actions";

// All the player-facing explanatory copy lives here so briefing/help stay consistent.

export interface Briefing {
  title: string;
  premise: string;
  /** Short bullet lines explaining the loop + goal. */
  points: string[];
  flavor: string;
}

const COMMON_PREMISE =
  "A plague is sweeping across medieval Europe. From high above, you alone can act — " +
  "shielding cities, confining the sick, and when nothing else will serve, scouring the " +
  "infected from the earth.";

export const BRIEFINGS: Record<ModeId, Briefing> = {
  classic: {
    title: "CLASSIC · 1348",
    premise: COMMON_PREMISE,
    points: [
      "Each turn: click a city, apply any actions, then End Turn.",
      "On End Turn cities produce, then the infection spreads and kills.",
      "Survive 25 turns. Your score is the population left alive.",
      "This is the original 2014 build: every action is free and unlimited —",
      "and the plague is merciless. The orbital strike is your bluntest mercy.",
    ],
    flavor: "The bells have stopped ringing. Do what must be done.",
  },
  modern: {
    title: "MODERN · 1348",
    premise: COMMON_PREMISE,
    points: [
      "Each turn you have 3 Action Points — every action spends them.",
      "Powerful actions also cost Resources, harvested from healthy cities.",
      "The infected can recover, and a true lockdown can save a city.",
      "Spend Resources on Research to unlock lasting upgrades.",
      "Survive 25 turns; you're graded S–F on how much of Europe you save.",
    ],
    flavor: "Hold the line. Spend wisely. Not everyone can be saved.",
  },
};

export const ABOUT = {
  title: "Dark Ages of Titan",
  subtitle: "Athens Game Jam · 2014",
  paragraphs: [
    "Dark Ages of Titan was built over a single weekend at the Athens Game Jam in early " +
      "2014 — and it won Best Game overall.",
    "The team swept every category — Game Design, Art, Implementation, and Sound — with a " +
      "peer score of 13.06, and earned pro passes to the SIEGE 2014 conference that October.",
    "This is a 2026 remake. The original build lives on in Classic mode, with a rebuilt, " +
      "rebalanced Modern mode beside it.",
  ],
  teamHeading: "The 2014 team",
  team: [
    "Gabriel Beal",
    "Clayton Mason",
    "David Pittard",
    "Richard Harris",
    "Louis Romanos",
    "Jenny Brewer",
    "Andrew Majewski",
  ],
};

export interface HelpSection {
  heading: string;
  lines: string[];
}

export function helpSections(mode: ModeId): HelpSection[] {
  const sections: HelpSection[] = [
    {
      heading: "The Goal",
      lines: [
        "Keep as much of Europe's population alive as you can across 25 turns.",
        mode === "modern"
          ? "You're graded S to F on the share of people who survive."
          : "Your score is the number of survivors when the turns run out.",
      ],
    },
    {
      heading: "A Turn",
      lines: [
        "1. Click a city on the map to select it.",
        "2. Use the action buttons to act on that city.",
        "3. Click End Turn to resolve: cities produce, then the plague spreads & kills.",
      ],
    },
    {
      heading: "Reading a City",
      lines: [
        "Each city shows a bar:  green = healthy,  yellow = infected,  red = dead.",
        "An infected city spreads to its neighbours — contain it before it grows.",
      ],
    },
    {
      heading: "Actions",
      lines: ACTION_ORDER.map((id) => `${ACTION_META[id].label} — ${ACTION_META[id].description}`),
    },
  ];

  if (mode === "modern") {
    sections.push({
      heading: "Modern Rules",
      lines: [
        "Action Points (3/turn) and Resources gate what you can do — choose carefully.",
        "Quarantine & Barricade now slow spread WITHIN a city, so lockdowns work.",
        "The infected slowly recover; Vaccinate and Research speed that along.",
        "Open Research to spend Resources on permanent upgrades.",
      ],
    });
  } else {
    sections.push({
      heading: "Classic Notes",
      lines: [
        "Everything is free and unlimited — the challenge is the brutal spread.",
        "Quarantine does NOT stop spread inside a city; only removing the infected does.",
        "Doing nothing dooms everyone. Act decisively.",
      ],
    });
  }
  return sections;
}
