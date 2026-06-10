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
  private costText: Text;
  private _enabled = true;

  constructor(texture: Texture, opts: ButtonOpts) {
    super();
    const { width, height, onClick } = opts;

    this.sprite = new Sprite(texture);
    this.sprite.width = width;
    this.sprite.height = height;
    this.addChild(this.sprite);

    this.dimLayer = new Graphics().rect(0, 0, width, height).fill({ color: 0x000000, alpha: 0.55 });
    this.dimLayer.visible = false;
    this.addChild(this.dimLayer);

    this.costText = new Text({ text: "", style: styles.buttonSmall });
    this.costText.anchor.set(1, 0);
    this.costText.position.set(width - 4, 3);
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

  /** Show a small cost badge (e.g. AP/resource cost) in the corner. */
  setCost(text: string, affordable: boolean): void {
    this.costText.text = text;
    this.costText.style.fill = affordable ? COLORS.text : COLORS.danger;
  }
}

/** A simple drawn button with a text label, for menus/end screens. */
export class TextButton extends Container {
  private bg: Graphics;
  private labelText: Text;

  constructor(text: string, w: number, h: number, onClick: () => void) {
    super();
    this.bg = new Graphics();
    this.addChild(this.bg);
    this.draw(w, h, false);

    this.labelText = new Text({ text, style: styles.button });
    this.labelText.anchor.set(0.5);
    this.labelText.position.set(w / 2, h / 2);
    this.addChild(this.labelText);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = this.bg.getLocalBounds().rectangle;
    this.on("pointerover", () => this.draw(w, h, true));
    this.on("pointerout", () => this.draw(w, h, false));
    this.on("pointertap", () => {
      audio.play("button");
      onClick();
    });
  }

  private draw(w: number, h: number, hover: boolean): void {
    this.bg
      .clear()
      .roundRect(0, 0, w, h, 8)
      .fill({ color: hover ? 0x1c3046 : COLORS.panel, alpha: 0.92 })
      .stroke({ color: hover ? COLORS.accent : COLORS.panelEdge, width: 2 });
  }

  setLabel(text: string): void {
    this.labelText.text = text;
  }
}
