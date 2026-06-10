import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Scene, type Game } from "../app";
import type { ModeId } from "../../sim/types";
import { tex } from "../assets";
import { audio } from "../audio";
import { COLORS, STAGE_H, STAGE_W, styles } from "../theme";
import { TextButton } from "../ui/Button";
import { HelpOverlay } from "../ui/HelpOverlay";
import { BriefingScene } from "./BriefingScene";

export class MenuScene extends Scene {
  private help: HelpOverlay | null = null;

  constructor(game: Game) {
    super(game);

    const bg = new Sprite(tex("splash"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);

    // Darken for legibility.
    this.addChild(new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x000000, alpha: 0.45 }));

    const title = new Text({ text: "DARK AGES", style: styles.title });
    title.anchor.set(0.5);
    title.position.set(STAGE_W / 2, 130);
    this.addChild(title);

    const tagline = new Text({
      text: "A plague sweeps medieval Europe. From orbit, you decide who lives.",
      style: styles.body,
    });
    tagline.anchor.set(0.5);
    tagline.position.set(STAGE_W / 2, 190);
    this.addChild(tagline);

    this.addModeCard(
      STAGE_W / 2 - 320,
      300,
      "CLASSIC",
      "The original 2014 game jam build, preserved exactly — warts, imbalance, and all.",
      "classic",
    );
    this.addModeCard(
      STAGE_W / 2 + 20,
      300,
      "MODERN",
      "Rebalanced and expanded: action points, real stakes, escalating outbreaks.",
      "modern",
    );

    const howto = new TextButton("How to Play", 200, 46, () => this.openHelp("modern"));
    howto.position.set(STAGE_W / 2 - 100, 580);
    this.addChild(howto);

    audio.playMusic("ambient");
  }

  private addModeCard(x: number, y: number, name: string, desc: string, mode: ModeId): void {
    const w = 300;
    const h = 240;
    const card = new Container();
    card.position.set(x, y);

    card.addChild(
      new Graphics()
        .roundRect(0, 0, w, h, 12)
        .fill({ color: COLORS.panel, alpha: 0.85 })
        .stroke({ color: COLORS.panelEdge, width: 2 }),
    );

    const heading = new Text({ text: name, style: styles.heading });
    heading.anchor.set(0.5, 0);
    heading.position.set(w / 2, 22);
    card.addChild(heading);

    const body = new Text({
      text: desc,
      style: { ...styles.hudDim, wordWrap: true, wordWrapWidth: w - 40, align: "center" },
    });
    body.anchor.set(0.5, 0);
    body.position.set(w / 2, 70);
    card.addChild(body);

    const play = new TextButton(`Play ${name}`, w - 60, 48, () => {
      this.game.setScene(new BriefingScene(this.game, mode));
    });
    play.position.set(30, h - 68);
    card.addChild(play);

    this.addChild(card);
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
