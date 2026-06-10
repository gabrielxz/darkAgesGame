import { TextStyle } from "pixi.js";

export const STAGE_W = 1280;
export const STAGE_H = 720;

// Right-hand UI panels baked into the map art.
export const TOP_PANEL = { x: 1024, y: 16, w: 244, h: 228 };
export const BOTTOM_PANEL = { x: 1024, y: 262, w: 242, h: 450 };

export const COLORS = {
  healthy: 0x4caf50,
  infected: 0xffd54f,
  dead: 0xc62828,
  text: 0xf3e9d2,
  textDim: 0xb9a98a,
  accent: 0xffcc66,
  panel: 0x0c1420,
  panelEdge: 0x2d4a63,
  selected: 0xffcc66,
  danger: 0xff5252,
};

const FONT = '"Spicy Rice", "Open Sans", sans-serif';

export const styles = {
  title: new TextStyle({ fontFamily: FONT, fontSize: 64, fill: COLORS.accent, stroke: { color: 0x000000, width: 4 } }),
  heading: new TextStyle({ fontFamily: FONT, fontSize: 24, fill: COLORS.text }),
  hud: new TextStyle({ fontFamily: FONT, fontSize: 18, fill: COLORS.text }),
  hudDim: new TextStyle({ fontFamily: FONT, fontSize: 15, fill: COLORS.textDim }),
  button: new TextStyle({ fontFamily: FONT, fontSize: 16, fill: COLORS.text }),
  buttonSmall: new TextStyle({ fontFamily: FONT, fontSize: 13, fill: COLORS.text }),
  cityName: new TextStyle({ fontFamily: FONT, fontSize: 11, fill: COLORS.text }),
  cityNum: new TextStyle({ fontFamily: FONT, fontSize: 10, fill: COLORS.textDim }),
  body: new TextStyle({ fontFamily: FONT, fontSize: 16, fill: COLORS.text, wordWrap: true, wordWrapWidth: 520 }),
  scoreBig: new TextStyle({ fontFamily: FONT, fontSize: 48, fill: COLORS.accent, stroke: { color: 0x000000, width: 4 } }),
};

export function fmtK(n: number): string {
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}K`;
  return `${Math.round(n)}`;
}
