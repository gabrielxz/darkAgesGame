import { Container, Graphics, Text } from "pixi.js";
import { COLORS, styles } from "../theme";

const MAX_W = 300;
const PAD = 10;

/** A floating tooltip. Anchored by its top-RIGHT corner so it sits left of the action panel. */
export class Tooltip extends Container {
  private bg: Graphics;
  private titleText: Text;
  private bodyText: Text;

  constructor() {
    super();
    this.visible = false;
    this.bg = new Graphics();
    this.addChild(this.bg);

    this.titleText = new Text({ text: "", style: { ...styles.button, fill: COLORS.accent } });
    this.titleText.position.set(PAD, PAD);
    this.addChild(this.titleText);

    this.bodyText = new Text({
      text: "",
      style: { ...styles.hudDim, fontSize: 14, wordWrap: true, wordWrapWidth: MAX_W - PAD * 2 },
    });
    this.addChild(this.bodyText);
  }

  /** Show with content, with the top-right corner at (rightX, topY). */
  show(title: string, body: string, rightX: number, topY: number): void {
    this.titleText.text = title;
    this.bodyText.text = body;
    this.bodyText.position.set(PAD, PAD + this.titleText.height + 6);

    const w = Math.max(this.titleText.width, this.bodyText.width) + PAD * 2;
    const h = this.bodyText.y + this.bodyText.height + PAD;

    this.bg
      .clear()
      .roundRect(0, 0, w, h, 8)
      .fill({ color: 0x0a1018, alpha: 0.97 })
      .stroke({ color: COLORS.panelEdge, width: 1.5 });

    this.position.set(rightX - w, topY);
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }
}
