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
    subtitle.position.set(STAGE_W / 2, 124);
    this.addChild(subtitle);

    let y = 178;
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

    // Names on two balanced lines (4 + 3) so no single surname wraps awkwardly.
    const half = Math.ceil(ABOUT.team.length / 2);
    const rows = [ABOUT.team.slice(0, half), ABOUT.team.slice(half)];
    rows.forEach((row, i) => {
      const line = new Text({ text: row.join("    ·    "), style: { ...styles.hud, align: "center" } });
      line.anchor.set(0.5, 0);
      line.position.set(STAGE_W / 2, y + 46 + i * 30);
      this.addChild(line);
    });

    const back = new TextButton("Back", 180, 50, () => this.game.setScene(new MenuScene(this.game)));
    back.position.set(STAGE_W / 2 - 90, STAGE_H - 70);
    this.addChild(back);
  }
}
