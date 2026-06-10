import { Assets, type Texture } from "pixi.js";

const base = import.meta.env.BASE_URL;
export const img = (file: string) => `${base}images/${file}`;
export const snd = (file: string) => `${base}sounds/${file}`;

// Image keys -> files we actually use from the original asset set.
const IMAGE_MANIFEST: Record<string, string> = {
  map: "touch_up_map.png",
  splash: "BeginningSplashScreen.jpg",
  endScreen: "SplashScreen.jpg",
  ship: "ShipTop.png",
  wheat: "icon_Wheat.png",
  star: "icon_Star.png",
  hazard: "icon_Hazard.png",
  // action icons
  button_Barricade: "button_Barricade.png",
  button_Quarrantine: "button_Quarrantine.png",
  button_HouseArrest: "button_HouseArrest.png",
  button_Uproot: "button_Uproot.png",
  button_Cull: "button_Cull.png",
  button_Vaccinate: "button_Vaccinate.png",
  button_OrbitalStrike: "button_OrbitalStrike.png",
  button_EndTurn: "button_EndTurn.png",
  // status icons drawn on city nodes
  icons_Barricade: "icons_Barricade.png",
  icons_Quarrantine: "icons_Quarrantine.png",
  icons_HouseArrest: "icons_HouseArrest.png",
};

const textures: Partial<Record<string, Texture>> = {};

export async function loadImages(): Promise<void> {
  const entries = Object.entries(IMAGE_MANIFEST);
  await Promise.all(
    entries.map(async ([key, file]) => {
      textures[key] = await Assets.load(img(file));
    }),
  );
}

export function tex(key: string): Texture {
  const t = textures[key];
  if (!t) throw new Error(`Texture not loaded: ${key}`);
  return t;
}
