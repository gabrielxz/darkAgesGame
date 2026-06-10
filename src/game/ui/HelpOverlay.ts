import { Container, Graphics, Text } from "pixi.js";
import type { ModeId } from "../../sim/types";
import { helpSections, type HelpSection } from "../content";
import { COLORS, STAGE_H, STAGE_W, styles, wrapped } from "../theme";
import { TextButton } from "./Button";

const COL_W = 540;

/** Full-screen "How to Play" reference. Openable from the menu and in-game. */
export class HelpOverlay extends Container {
  constructor(mode: ModeId, onClose: () => void) {
    super();

    const backdrop = new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x05080d, alpha: 0.95 });
    backdrop.eventMode = "static";
    this.addChild(backdrop);

    const title = new Text({ text: "HOW TO PLAY", style: styles.title });
    title.anchor.set(0.5, 0);
    title.position.set(STAGE_W / 2, 18);
    this.addChild(title);

    const sections = helpSections(mode);
    // Split at the "Actions" list, which anchors the right column.
    const ai = sections.findIndex((s) => s.heading === "Actions");
    const left = sections.slice(0, ai);
    const right = sections.slice(ai);

    this.renderColumn(left, 90, 96);
    this.renderColumn(right, STAGE_W - 90 - COL_W, 96);

    const close = new TextButton("Got it", 200, 50, onClose);
    close.position.set(STAGE_W / 2 - 100, STAGE_H - 62);
    this.addChild(close);
  }

  private renderColumn(sections: HelpSection[], x: number, startY: number): void {
    let y = startY;
    for (const section of sections) {
      const h = new Text({ text: section.heading, style: { ...styles.heading, fill: COLORS.accent } });
      h.position.set(x, y);
      this.addChild(h);
      y += 32;

      for (const line of section.lines) {
        const t = new Text({ text: line, style: wrapped(styles.hudDim, COL_W, 15) });
        t.position.set(x, y);
        this.addChild(t);
        y += t.height + 7;
      }
      y += 16;
    }
  }
}
