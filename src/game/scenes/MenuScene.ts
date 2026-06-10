import { Graphics, Sprite, Text } from "pixi.js";
import { Scene, type Game } from "../app";
import type { ModeId } from "../../sim/types";
import { tex } from "../assets";
import { audio } from "../audio";
import { COLORS, STAGE_H, STAGE_W, styles, wrapped } from "../theme";
import { TextButton } from "../ui/Button";
import { HelpOverlay } from "../ui/HelpOverlay";
import { BriefingScene } from "./BriefingScene";
import { AboutScene } from "./AboutScene";
import { SoundTestScene } from "./SoundTestScene";

export class MenuScene extends Scene {
  private help: HelpOverlay | null = null;

  constructor(game: Game) {
    super(game);

    // Full-bleed splash art (it already carries the "Dark Ages of Titan" title).
    const bg = new Sprite(tex("splash"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);

    // A compact, translucent panel in the dark lower-left keeps the menu readable
    // while leaving most of the artwork (and its title) on show.
    const px = 36;
    const py = 322;
    const pw = 372;
    const ph = 312;
    this.addChild(
      new Graphics()
        .roundRect(px, py, pw, ph, 14)
        .fill({ color: 0x060a12, alpha: 0.66 })
        .stroke({ color: COLORS.panelEdge, width: 1.5, alpha: 0.8 }),
    );

    const innerX = px + 24;
    const innerW = pw - 48;

    this.playButton("Play Classic", "The original 2014 build — faithful & brutal", innerX, py + 24, innerW, "classic");
    this.playButton("Play Modern", "Rebalanced & expanded with new systems", innerX, py + 122, innerW, "modern");

    // Secondary row: How to Play · About · (♪ sound test).
    const rowY = py + 224;
    const help = new TextButton("How to Play", 158, 42, () => this.openHelp("modern"));
    help.position.set(innerX, rowY);
    this.addChild(help);

    const about = new TextButton("About", 100, 42, () => this.game.setScene(new AboutScene(this.game)));
    about.position.set(innerX + 166, rowY);
    this.addChild(about);

    // Small, unlabelled music note — a quiet easter egg for the sound test.
    const soundTest = new TextButton("♪", 42, 42, () => this.game.setScene(new SoundTestScene(this.game)));
    soundTest.position.set(innerX + innerW - 42, rowY);
    this.addChild(soundTest);

    audio.playMusic("ambient");
  }

  private playButton(label: string, desc: string, x: number, y: number, w: number, mode: ModeId): void {
    const btn = new TextButton(label, w, 54, () => this.game.setScene(new BriefingScene(this.game, mode)), true);
    btn.position.set(x, y);
    this.addChild(btn);

    const sub = new Text({ text: desc, style: wrapped(styles.hudDim, w, 14) });
    sub.position.set(x + 2, y + 58);
    this.addChild(sub);
  }

  private openHelp(mode: ModeId): void {
    if (this.help) return;
    this.help = new HelpOverlay(mode, () => {
      if (this.help) {
        this.removeChild(this.help);
        this.help.destroy({ children: true });
        this.help = null;
      }
    });
    this.addChild(this.help);
  }
}
