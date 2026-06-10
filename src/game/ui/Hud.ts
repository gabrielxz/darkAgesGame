import { Container, Sprite, Text } from "pixi.js";
import type { GameState } from "../../sim/engine";
import { COLORS, fmtK, styles, TOP_PANEL } from "../theme";
import { ImageButton } from "./Button";
import { tex } from "../assets";

/** Top-right panel: global status + End Turn. */
export class Hud extends Container {
  private turns: Text;
  private resources: Text;
  private ap: Text;
  private dead: Text;
  readonly endTurnButton: ImageButton;

  constructor(state: GameState, onEndTurn: () => void) {
    super();
    const p = TOP_PANEL;
    const pad = 14;

    const wheat = new Sprite(tex("wheat"));
    wheat.width = 18;
    wheat.height = 18;
    wheat.position.set(p.x + pad, p.y + 12);
    this.addChild(wheat);

    this.resources = this.line(p.x + pad + 24, p.y + 12, styles.hud);
    this.turns = this.line(p.x + pad, p.y + 40, styles.hud);
    this.ap = this.line(p.x + pad, p.y + 64, styles.hud);
    this.dead = this.line(p.x + pad, p.y + 88, styles.hudDim);

    const bw = 150;
    const bh = 50;
    this.endTurnButton = new ImageButton(tex("button_EndTurn"), {
      width: bw,
      height: bh,
      onClick: onEndTurn,
      sound: "endTurn",
    });
    this.endTurnButton.position.set(p.x + (p.w - bw) / 2, p.y + p.h - bh - 8);
    this.addChild(this.endTurnButton);

    this.refresh(state);
  }

  private line(x: number, y: number, style: typeof styles.hud): Text {
    const t = new Text({ text: "", style });
    t.position.set(x, y);
    this.addChild(t);
    return t;
  }

  refresh(state: GameState): void {
    this.resources.text = fmtK(state.resources);
    this.turns.text = `Turn ${state.rule.gameTurns - state.remainingTurns + 1} / ${state.rule.gameTurns}`;
    this.turns.style.fill = state.remainingTurns <= 5 ? COLORS.danger : COLORS.text;
    if (state.rule.actionPoints != null) {
      this.ap.text = `Action Pts: ${state.actionPoints} / ${state.rule.actionPoints}`;
      this.ap.visible = true;
    } else {
      this.ap.visible = false;
    }
    this.dead.text = `Total dead: ${fmtK(state.deathToll())}`;
  }
}
