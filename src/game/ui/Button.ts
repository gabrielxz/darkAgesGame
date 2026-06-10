import { Container, Graphics, Sprite, Text, type Texture } from "pixi.js";
import { COLORS, styles } from "../theme";
import { audio } from "../audio";

interface ButtonOpts {
  width: number;
  height: number;
  onClick: () => void;
  /** Play this SFX key on click (default "button"). */
  sound?: string | null;
  /** Notified when the pointer enters/leaves (for tooltips). */
  onHover?: (hovering: boolean) => void;
}

/** A clickable button backed by one of the original button images. */
export class ImageButton extends Container {
  private sprite: Sprite;
  private dimLayer: Graphics;
  private costBg: Graphics;
  private costText: Text;
  private btnW: number;
  private _enabled = true;

  constructor(texture: Texture, opts: ButtonOpts) {
    super();
    const { width, height, onClick } = opts;
    this.btnW = width;

    this.sprite = new Sprite(texture);
    this.sprite.width = width;
    this.sprite.height = height;
    this.addChild(this.sprite);

    this.dimLayer = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.55 });
    this.dimLayer.visible = false;
    this.addChild(this.dimLayer);

    // Cost badge: a dark pill in the top-right corner with readable text.
    this.costBg = new Graphics();
    this.addChild(this.costBg);
    this.costText = new Text({ text: "", style: { ...styles.button, fontSize: 15 } });
    this.costText.anchor.set(1, 0);
    this.addChild(this.costText);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = this.sprite.getLocalBounds().rectangle;

    this.on("pointerover", () => {
      if (this._enabled) this.sprite.tint = 0xffe9b0;
      opts.onHover?.(true);
    });
    this.on("pointerout", () => {
      this.sprite.tint = 0xffffff;
      opts.onHover?.(false);
    });
    this.on("pointerdown", () => {
      if (this._enabled) this.sprite.alpha = 0.7;
    });
    this.on("pointerup", () => {
      this.sprite.alpha = 1;
    });
    this.on("pointerupoutside", () => {
      this.sprite.alpha = 1;
    });
    this.on("pointertap", () => {
      if (!this._enabled) return;
      if (opts.sound !== null) audio.play(opts.sound ?? "button");
      onClick();
    });
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
    this.dimLayer.visible = !enabled;
    this.cursor = enabled ? "pointer" : "default";
    if (!enabled) this.sprite.tint = 0xffffff;
  }

  /** Show a cost badge (e.g. AP/resource cost) as a readable pill in the corner. */
  setCost(text: string, affordable: boolean): void {
    this.costText.text = text;
    this.costText.style.fill = affordable ? 0xffffff : COLORS.danger;
    this.costBg.clear();
    if (!text) return;
    const pad = 5;
    const w = this.costText.width + pad * 2;
    const h = this.costText.height + pad;
    const x = this.btnW - w - 3;
    this.costBg.roundRect(x, 2, w, h, 5).fill({ color: 0x05080d, alpha: 0.82 });
    this.costText.position.set(this.btnW - 3 - pad, 2 + pad / 2);
  }
}

/** A simple drawn button with a text label, for menus/end screens. */
export class TextButton extends Container {
  private bg: Graphics;
  private labelText: Text;
  private primary: boolean;

  /** Optional hover callback (for tooltips). */
  onHover?: (hovering: boolean) => void;

  constructor(text: string, w: number, h: number, onClick: () => void, primary = false, clickSound = true) {
    super();
    this.primary = primary;
    this.bg = new Graphics();
    this.addChild(this.bg);
    this.draw(w, h, false);

    this.labelText = new Text({ text, style: primary ? styles.heading : styles.button });
    this.labelText.anchor.set(0.5);
    this.labelText.position.set(w / 2, h / 2);
    this.addChild(this.labelText);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = this.bg.getLocalBounds().rectangle;
    this.on("pointerover", () => {
      this.draw(w, h, true);
      this.onHover?.(true);
    });
    this.on("pointerout", () => {
      this.draw(w, h, false);
      this.onHover?.(false);
    });
    this.on("pointertap", () => {
      if (clickSound) audio.play("button");
      onClick();
    });
  }

  private draw(w: number, h: number, hover: boolean): void {
    const edge = hover || this.primary ? COLORS.accent : COLORS.panelEdge;
    this.bg
      .clear()
      .roundRect(0, 0, w, h, 8)
      .fill({ color: hover ? 0x1c3046 : COLORS.panel, alpha: 0.95 })
      .stroke({ color: edge, width: this.primary ? 2.5 : 2 });
  }

  setLabel(text: string): void {
    this.labelText.text = text;
  }
}
