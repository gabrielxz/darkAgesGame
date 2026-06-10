import { Graphics, Sprite, Text } from "pixi.js";
import { Scene, type Game } from "../app";
import { ABOUT } from "../content";
import { tex } from "../assets";
import { COLORS, STAGE_H, STAGE_W, styles, wrapped } from "../theme";
import { TextButton } from "../ui/Button";
import { MenuScene } from "./MenuScene";

/** "About / History" — written for the original team's nostalgia, not as a museum piece. */
export class AboutScene extends Scene {
  constructor(game: Game) {
    super(game);

    const bg = new Sprite(tex("splash"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);
    this.addChild(new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x05080d, alpha: 0.82 }));

    const title = new Text({ text: ABOUT.title, style: styles.title });
    title.anchor.set(0.5, 0);
    title.position.set(STAGE_W / 2, 36);
    this.addChild(title);

    const subtitle = new Text({ text: ABOUT.subtitle, style: { ...styles.heading, fill: COLORS.accent } });
    subtitle.anchor.set(0.5, 0);
    subtitle.position.set(STAGE_W / 2, 104);
    this.addChild(subtitle);

    let y = 158;
    for (const para of ABOUT.paragraphs) {
      const t = new Text({ text: para, style: wrapped(styles.body, 760, 17, "center") });
      t.anchor.set(0.5, 0);
      t.position.set(STAGE_W / 2, y);
      this.addChild(t);
      y += t.height + 16;
    }

    const teamHeading = new Text({ text: ABOUT.teamHeading, style: { ...styles.heading, fill: COLORS.accent } });
    teamHeading.anchor.set(0.5, 0);
    teamHeading.position.set(STAGE_W / 2, y + 8);
    this.addChild(teamHeading);

    const names = new Text({ text: ABOUT.team.join("      "), style: wrapped(styles.hud, 820, undefined, "center") });
    names.anchor.set(0.5, 0);
    names.position.set(STAGE_W / 2, y + 46);
    this.addChild(names);

    const back = new TextButton("Back", 180, 50, () => this.game.setScene(new MenuScene(this.game)));
    back.position.set(STAGE_W / 2 - 90, STAGE_H - 70);
    this.addChild(back);
  }
}
