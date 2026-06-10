import { GameState } from "./engine";
import { CITY_EDGES, CLASSIC_CITIES, MODERN_CITIES } from "./map";
import { CLASSIC_RULES } from "./rules.classic";
import { MODERN_RULES } from "./rules.modern";
import type { ModeId } from "./types";

/** Create a fresh game for the given mode. The selected city defaults to the capital. */
export function createGame(mode: ModeId): GameState {
  if (mode === "classic") {
    const state = new GameState(CLASSIC_RULES, CLASSIC_CITIES, CITY_EDGES);
    state.select(state.cities[10]); // Stockholm — matches the original startGame()
    return state;
  }
  const state = new GameState(MODERN_RULES, MODERN_CITIES, CITY_EDGES);
  state.select(state.cities[0]);
  return state;
}
