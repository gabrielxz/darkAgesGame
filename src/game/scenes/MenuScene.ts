import { Graphics, Sprite } from "pixi.js";
import { Scene, type Game } from "../app";
import type { ModeId } from "../../sim/types";
import { tex } from "../assets";
import { audio } from "../audio";
import { COLORS, STAGE_H, STAGE_W } from "../theme";
import { TextButton } from "../ui/Button";
import { Tooltip } from "../ui/Tooltip";
import { HelpOverlay } from "../ui/HelpOverlay";
import { BriefingScene } from "./BriefingScene";
import { AboutScene } from "./AboutScene";
import { SoundTestScene } from "./SoundTestScene";

export class MenuScene extends Scene {
  private help: HelpOverlay | null = null;
  private tip = new Tooltip();

  constructor(game: Game) {
    super(game);

    // Full-bleed splash art (it already carries the "Dark Ages of Titan" title).
    const bg = new Sprite(tex("splash"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);

    // A small, translucent panel tucked into the bottom-left corner. Button
    // descriptions live in hover tooltips so almost all of the ship stays visible.
    const pad = 18;
    const innerW = 240;
    const pw = innerW + pad * 2;
    const ph = 196;
    const px = 20;
    const py = STAGE_H - 20 - ph;
    this.addChild(
      new Graphics()
        .roundRect(px, py, pw, ph, 14)
        .fill({ color: 0x060a12, alpha: 0.66 })
        .stroke({ color: COLORS.panelEdge, width: 1.5, alpha: 0.8 }),
    );

    const innerX = px + pad;
    const panelRight = px + pw;

    this.playButton("Play Classic", "The original 2014 build — faithful & brutal", innerX, py + pad, innerW, panelRight, "classic");
    this.playButton("Play Modern", "Rebalanced & expanded with new systems", innerX, py + pad + 58, innerW, panelRight, "modern");

    // Secondary row: How to Play · About · (♪ sound test).
    const rowY = py + pad + 124;
    const help = new TextButton("How to Play", 130, 38, () => this.openHelp("modern"));
    help.position.set(innerX, rowY);
    this.addChild(help);

    const about = new TextButton("About", 62, 38, () => this.game.setScene(new AboutScene(this.game)));
    about.position.set(innerX + 138, rowY);
    this.addChild(about);

    // Small, unlabelled music note — a quiet easter egg for the sound test.
    const soundTest = new TextButton("♪", 34, 38, () => this.game.setScene(new SoundTestScene(this.game)));
    soundTest.position.set(innerX + innerW - 34, rowY);
    this.addChild(soundTest);

    this.addChild(this.tip);

    audio.playMusic("ambient");
  }

  private playButton(
    label: string,
    desc: string,
    x: number,
    y: number,
    w: number,
    panelRight: number,
    mode: ModeId,
  ): void {
    const btn = new TextButton(label, w, 50, () => this.game.setScene(new BriefingScene(this.game, mode)), true);
    btn.position.set(x, y);
    btn.onHover = (hovering) => {
      if (!hovering) {
        this.tip.hide();
        return;
      }
      // Show to the right of the panel, vertically aligned with the button.
      this.tip.show(label, desc, STAGE_W, y);
      this.tip.position.x = panelRight + 14;
    };
    this.addChild(btn);
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
