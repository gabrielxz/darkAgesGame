import type { ActionId } from "./types";

export interface ActionMeta {
  id: ActionId;
  label: string;
  /** Image basename in public/images (without extension). */
  icon: string;
  /** Sound key (see audio manifest). */
  sound: string;
  description: string;
}

// Display order in the action panel.
export const ACTION_ORDER: ActionId[] = [
  "barricade",
  "quarantine",
  "houseArrest",
  "uproot",
  "cull",
  "vaccinate",
  "orbitalStrike",
];

export const ACTION_META: Record<ActionId, ActionMeta> = {
  barricade: {
    id: "barricade",
    label: "Barricade",
    icon: "button_Barricade",
    sound: "culling",
    description: "Seal the gates: greatly cuts incoming infection, halves production.",
  },
  quarantine: {
    id: "quarantine",
    label: "Quarantine",
    icon: "button_Quarrantine",
    sound: "quarantine",
    description: "Total lockdown: near-zero spread in or out, but no production.",
  },
  houseArrest: {
    id: "houseArrest",
    label: "House Arrest",
    icon: "button_HouseArrest",
    sound: "houseArrest",
    description: "Confine the sick: halves spread; the infected stop working.",
  },
  uproot: {
    id: "uproot",
    label: "Uproot",
    icon: "button_Uproot",
    sound: "laserBlast",
    description: "Drive them hard: +50% production now, none next turn.",
  },
  cull: {
    id: "cull",
    label: "Cull",
    icon: "button_Cull",
    sound: "culling",
    description: "Purge the infected (and a few healthy), halving this turn's output.",
  },
  vaccinate: {
    id: "vaccinate",
    label: "Vaccinate",
    icon: "button_Vaccinate",
    sound: "culling",
    description: "Spend resources to halve all spread for this settlement, permanently.",
  },
  orbitalStrike: {
    id: "orbitalStrike",
    label: "Orbital Strike",
    icon: "button_OrbitalStrike",
    sound: "orbitalStrike",
    description: "Glass the settlement: everyone dies, the infection with them. Last resort.",
  },
};
