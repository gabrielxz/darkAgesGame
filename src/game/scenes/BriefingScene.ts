import { Graphics, Sprite, Text } from "pixi.js";
import { Scene, type Game } from "../app";
import type { ModeId } from "../../sim/types";
import { BRIEFINGS } from "../content";
import { tex } from "../assets";
import { COLORS, STAGE_H, STAGE_W, styles } from "../theme";
import { TextButton } from "../ui/Button";
import { HelpOverlay } from "../ui/HelpOverlay";
import { GameScene } from "./GameScene";
import { MenuScene } from "./MenuScene";

/** Per-mode intro: premise, goal, and the turn loop — shown before a game starts. */
export class BriefingScene extends Scene {
  private help: HelpOverlay | null = null;

  constructor(game: Game, private mode: ModeId) {
    super(game);
    const b = BRIEFINGS[mode];

    const bg = new Sprite(tex("splash"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);
    this.addChild(new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x05080d, alpha: 0.7 }));

    const title = new Text({ text: b.title, style: styles.title });
    title.anchor.set(0.5, 0);
    title.position.set(STAGE_W / 2, 50);
    this.addChild(title);

    const premise = new Text({
      text: b.premise,
      style: { ...styles.body, align: "center", wordWrapWidth: 820 },
    });
    premise.anchor.set(0.5, 0);
    premise.position.set(STAGE_W / 2, 140);
    this.addChild(premise);

    // Numbered/explanatory lines, centered block.
    let y = 250;
    for (const line of b.points) {
      const t = new Text({ text: line, style: { ...styles.hud, align: "center" } });
      t.anchor.set(0.5, 0);
      t.position.set(STAGE_W / 2, y);
      this.addChild(t);
      y += 34;
    }

    const flavor = new Text({
      text: b.flavor,
      style: { ...styles.body, fill: COLORS.accent, fontStyle: "italic", align: "center" },
    });
    flavor.anchor.set(0.5, 0);
    flavor.position.set(STAGE_W / 2, y + 14);
    this.addChild(flavor);

    const begin = new TextButton("Begin", 220, 56, () => {
      this.game.setScene(new GameScene(this.game, this.mode));
    });
    begin.position.set(STAGE_W / 2 - 110, STAGE_H - 92);
    this.addChild(begin);

    const howto = new TextButton("How to Play", 180, 48, () => this.openHelp());
    howto.position.set(STAGE_W / 2 - 110 - 200, STAGE_H - 88);
    this.addChild(howto);

    const back = new TextButton("Back", 140, 48, () => {
      this.game.setScene(new MenuScene(this.game));
    });
    back.position.set(STAGE_W / 2 + 130, STAGE_H - 88);
    this.addChild(back);
  }

  private openHelp(): void {
    if (this.help) return;
    this.help = new HelpOverlay(this.mode, () => {
      if (this.help) {
        this.removeChild(this.help);
        this.help.destroy({ children: true });
        this.help = null;
      }
    });
    this.addChild(this.help);
  }
}
