import { Container, Graphics, Text } from "pixi.js";
import { COLORS, STAGE_H, STAGE_W, styles, wrapped } from "../theme";
import { TextButton } from "./Button";

/** A modal yes/no confirmation. The backdrop swallows clicks to the game beneath. */
export class ConfirmDialog extends Container {
  constructor(message: string, confirmLabel: string, onConfirm: () => void, onCancel: () => void) {
    super();

    const backdrop = new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x05080d, alpha: 0.75 });
    backdrop.eventMode = "static";
    this.addChild(backdrop);

    const w = 520;
    const h = 220;
    const x = (STAGE_W - w) / 2;
    const y = (STAGE_H - h) / 2;

    this.addChild(
      new Graphics()
        .roundRect(x, y, w, h, 14)
        .fill({ color: COLORS.panel, alpha: 0.98 })
        .stroke({ color: COLORS.accent, width: 2 }),
    );

    const text = new Text({ text: message, style: wrapped(styles.heading, w - 60, 22, "center") });
    text.anchor.set(0.5, 0);
    text.position.set(STAGE_W / 2, y + 40);
    this.addChild(text);

    const confirm = new TextButton(confirmLabel, 200, 52, onConfirm);
    confirm.position.set(STAGE_W / 2 - 210, y + h - 76);
    this.addChild(confirm);

    const cancel = new TextButton("Cancel", 200, 52, onCancel, true);
    cancel.position.set(STAGE_W / 2 + 10, y + h - 76);
    this.addChild(cancel);
  }
}
