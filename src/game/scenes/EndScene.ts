import { Graphics, Sprite, Text } from "pixi.js";
import { Scene, type Game } from "../app";
import type { GameState } from "../../sim/engine";
import { computeScore } from "../../sim/score";
import { tex } from "../assets";
import { COLORS, fmtK, STAGE_H, STAGE_W, styles } from "../theme";
import { TextButton } from "../ui/Button";
import { MenuScene } from "./MenuScene";
import { GameScene } from "./GameScene";

export class EndScene extends Scene {
  constructor(game: Game, state: GameState) {
    super(game);
    const score = computeScore(state);

    const bg = new Sprite(tex("endScreen"));
    bg.width = STAGE_W;
    bg.height = STAGE_H;
    this.addChild(bg);
    this.addChild(new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x000000, alpha: 0.55 }));

    const good = score.grade === "S" || score.grade === "A" || score.grade === "B";

    // Big letter grade.
    const gradeText = new Text({
      text: score.grade,
      style: { ...styles.title, fontSize: 110, fill: good ? COLORS.accent : COLORS.danger },
    });
    gradeText.anchor.set(0.5);
    gradeText.position.set(STAGE_W / 2, 130);
    this.addChild(gradeText);

    const verdict = new Text({
      text: score.verdict,
      style: { ...styles.body, align: "center", wordWrapWidth: 700 },
    });
    verdict.anchor.set(0.5);
    verdict.position.set(STAGE_W / 2, 215);
    this.addChild(verdict);

    const scoreText = new Text({
      text: `${score.label}: ${score.value.toLocaleString("en-US")}`,
      style: styles.scoreBig,
    });
    scoreText.anchor.set(0.5);
    scoreText.position.set(STAGE_W / 2, 280);
    this.addChild(scoreText);

    const breakdown = new Text({
      text:
        `Survivors:  ${fmtK(score.survivors)}  (${score.survivalPct.toFixed(1)}%)\n` +
        `Dead:       ${fmtK(score.deaths)}\n` +
        `Resources:  ${fmtK(score.resources)}`,
      style: { ...styles.hud, align: "center" },
    });
    breakdown.anchor.set(0.5, 0);
    breakdown.position.set(STAGE_W / 2, 330);
    this.addChild(breakdown);

    const again = new TextButton("Play Again", 200, 52, () => {
      game.setScene(new GameScene(game, state.rule.id));
    });
    again.position.set(STAGE_W / 2 - 220, STAGE_H - 160);
    this.addChild(again);

    const menu = new TextButton("Main Menu", 200, 52, () => {
      game.setScene(new MenuScene(game));
    });
    menu.position.set(STAGE_W / 2 + 20, STAGE_H - 160);
    this.addChild(menu);
  }
}
