import type { CityDef } from "./types";

// City adjacency graph — identical for both modes (taken verbatim from city_init()).
export const CITY_EDGES: [number, number][] = [
  [0, 1], [0, 4], [0, 8],
  [1, 2], [1, 4], [1, 5],
  [2, 3], [2, 5], [2, 6], [2, 10],
  [3, 6], [3, 7],
  [4, 5], [4, 8], [4, 9],
  [5, 9], [5, 10],
  [6, 7], [6, 10], [6, 13], [6, 14],
  [7, 14],
  [8, 9], [8, 11], [8, 12],
  [9, 10], [9, 12],
  [10, 12], [10, 13],
  [11, 12],
  [12, 13],
  [13, 14],
];

// ---------------------------------------------------------------------------
// CLASSIC — the exact 2014 numbers from city_init(). Includes the Stockholm
// imbalance (500k / 0 production) on purpose: it is the authentic original.
// ---------------------------------------------------------------------------
export const CLASSIC_CITIES: CityDef[] = [
  { name: "Constantinople", population: 15000, production: 1.25, gettingSickFraction: 0.04, x: 58, y: 126 },
  { name: "Rome", population: 20000, production: 1.75, gettingSickFraction: 0.04, x: 274, y: 43 },
  { name: "Barcelona", population: 55000, production: 1.75, gettingSickFraction: 0, x: 492, y: 60 },
  { name: "Marsailles", population: 25000, production: 1.25, gettingSickFraction: 0.05, x: 881, y: 134 },
  { name: "Milan", population: 30000, production: 2.0, gettingSickFraction: 0.03, x: 182, y: 218 },
  { name: "Vienna", population: 40000, production: 2.25, gettingSickFraction: 0, x: 379, y: 155 },
  { name: "Paris", population: 40000, production: 2.0, gettingSickFraction: 0, x: 739, y: 290 },
  { name: "Cologne", population: 10000, production: 1.25, gettingSickFraction: 0.04, x: 878, y: 240 },
  { name: "London", population: 35000, production: 1.75, gettingSickFraction: 0, x: 138, y: 318 },
  { name: "Copenhagen", population: 45000, production: 2.25, gettingSickFraction: 0, x: 335, y: 380 },
  { name: "Stockholm", population: 500000, production: 0, gettingSickFraction: 0, x: 464, y: 351 },
  { name: "Moscow", population: 20000, production: 1.25, gettingSickFraction: 0.03, x: 61, y: 490 },
  { name: "Kiev", population: 60000, production: 2.75, gettingSickFraction: 0, x: 361, y: 512 },
  { name: "Cracow", population: 50000, production: 1.75, gettingSickFraction: 0, x: 666, y: 546 },
  { name: "Naples", population: 35000, production: 1.5, gettingSickFraction: 0.04, x: 857, y: 439 },
];

// ---------------------------------------------------------------------------
// MODERN — rebalanced. Populations tightened to a 35k–70k band so no single
// city dominates the score (Stockholm is now a normal city with real output),
// production rescaled down to ~0.3–0.6 so resources are a meaningful constraint.
// Infection is seeded at the historical Black Death entry ports (trade routes).
// All values are playtest-tunable.
// ---------------------------------------------------------------------------
export const MODERN_CITIES: CityDef[] = [
  { name: "Constantinople", population: 45000, production: 0.40, gettingSickFraction: 0.05, x: 58, y: 126 },
  { name: "Rome", population: 60000, production: 0.55, gettingSickFraction: 0, x: 274, y: 43 },
  { name: "Barcelona", population: 55000, production: 0.45, gettingSickFraction: 0, x: 492, y: 60 },
  { name: "Marsailles", population: 40000, production: 0.40, gettingSickFraction: 0.04, x: 881, y: 134 },
  { name: "Milan", population: 50000, production: 0.50, gettingSickFraction: 0, x: 182, y: 218 },
  { name: "Vienna", population: 55000, production: 0.55, gettingSickFraction: 0, x: 379, y: 155 },
  { name: "Paris", population: 65000, production: 0.55, gettingSickFraction: 0, x: 739, y: 290 },
  { name: "Cologne", population: 35000, production: 0.35, gettingSickFraction: 0, x: 878, y: 240 },
  { name: "London", population: 60000, production: 0.50, gettingSickFraction: 0, x: 138, y: 318 },
  { name: "Copenhagen", population: 50000, production: 0.45, gettingSickFraction: 0, x: 335, y: 380 },
  { name: "Stockholm", population: 70000, production: 0.40, gettingSickFraction: 0, x: 464, y: 351 },
  { name: "Moscow", population: 45000, production: 0.35, gettingSickFraction: 0, x: 61, y: 490 },
  { name: "Kiev", population: 60000, production: 0.55, gettingSickFraction: 0, x: 361, y: 512 },
  { name: "Cracow", population: 50000, production: 0.45, gettingSickFraction: 0, x: 666, y: 546 },
  { name: "Naples", population: 45000, production: 0.40, gettingSickFraction: 0.04, x: 857, y: 439 },
];
