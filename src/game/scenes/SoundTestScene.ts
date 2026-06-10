import { Graphics, Sprite, Text } from "pixi.js";
import { Scene, type Game } from "../app";
import { audio, SOUND_CATALOG } from "../audio";
import { tex } from "../assets";
import { STAGE_H, STAGE_W, styles } from "../theme";
import { TextButton } from "../ui/Button";
import { MenuScene } from "./MenuScene";

/** A toy sound board — click a name to hear it. Reached via the ♪ on the menu. */
export class SoundTestScene extends Scene {
  constructor(game: Game) {
    super(game);
    audio.stopMusic();

    const bg = new Sprite(tex("splash"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);
    this.addChild(new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x05080d, alpha: 0.86 }));

    const title = new Text({ text: "SOUND TEST", style: styles.title });
    title.anchor.set(0.5, 0);
    title.position.set(STAGE_W / 2, 40);
    this.addChild(title);

    const hint = new Text({
      text: "Click a sound to play it. (Music tracks in gold.)",
      style: { ...styles.hudDim, fontSize: 16 },
    });
    hint.anchor.set(0.5, 0);
    hint.position.set(STAGE_W / 2, 112);
    this.addChild(hint);

    // Two-column grid.
    const cols = 2;
    const bw = 320;
    const bh = 50;
    const gapX = 40;
    const gapY = 14;
    const gridW = cols * bw + (cols - 1) * gapX;
    const startX = (STAGE_W - gridW) / 2;
    const startY = 170;

    SOUND_CATALOG.forEach((s, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const isMusic = s.kind === "music";
      const btn = new TextButton(s.label, bw, bh, () => audio.preview(s.key), isMusic);
      btn.position.set(startX + col * (bw + gapX), startY + row * (bh + gapY));
      this.addChild(btn);
    });

    const stop = new TextButton("Stop", 160, 50, () => audio.stopPreview());
    stop.position.set(STAGE_W / 2 - 180, STAGE_H - 76);
    this.addChild(stop);

    const back = new TextButton("Back", 160, 50, () => this.game.setScene(new MenuScene(this.game)));
    back.position.set(STAGE_W / 2 + 20, STAGE_H - 76);
    this.addChild(back);
  }

  override dispose(): void {
    audio.stopPreview();
  }
}
