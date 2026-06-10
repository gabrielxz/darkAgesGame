import { Container, Graphics, Text } from "pixi.js";
import type { GameState } from "../../sim/engine";
import { BRANCHES, TECHS, canUnlock, techById, unlock, type Tech } from "../../sim/research";
import { COLORS, fmtK, STAGE_H, STAGE_W, styles } from "../theme";
import { audio } from "../audio";
import { TextButton } from "./Button";

const CARD_W = 360;
const CARD_H = 150;

/** Full-screen modal: the research tree. Resource-gated, prereq-chained. */
export class ResearchPanel extends Container {
  private state: GameState;
  private onChange: () => void;
  private resourceText: Text;
  private cards: TechCard[] = [];

  constructor(state: GameState, onChange: () => void, onClose: () => void) {
    super();
    this.state = state;
    this.onChange = onChange;

    const backdrop = new Graphics().rect(0, 0, STAGE_W, STAGE_H).fill({ color: 0x05080d, alpha: 0.92 });
    backdrop.eventMode = "static"; // swallow clicks so the game beneath isn't triggered
    this.addChild(backdrop);

    const title = new Text({ text: "RESEARCH", style: styles.title });
    title.anchor.set(0.5, 0);
    title.position.set(STAGE_W / 2, 24);
    this.addChild(title);

    this.resourceText = new Text({ text: "", style: styles.heading });
    this.resourceText.anchor.set(0.5, 0);
    this.resourceText.position.set(STAGE_W / 2, 92);
    this.addChild(this.resourceText);

    const colGap = 20;
    const totalW = BRANCHES.length * CARD_W + (BRANCHES.length - 1) * colGap;
    const startX = (STAGE_W - totalW) / 2;

    BRANCHES.forEach((branch, ci) => {
      const x = startX + ci * (CARD_W + colGap);
      const header = new Text({ text: branch.name, style: styles.heading });
      header.anchor.set(0.5, 0);
      header.position.set(x + CARD_W / 2, 130);
      this.addChild(header);

      const branchTechs = TECHS.filter((t) => t.branch === branch.id).sort((a, b) => a.tier - b.tier);
      branchTechs.forEach((tech, ti) => {
        const card = new TechCard(tech, () => this.tryUnlock(tech));
        card.position.set(x, 170 + ti * (CARD_H + 14));
        this.addChild(card);
        this.cards.push(card);
      });
    });

    const close = new TextButton("Close", 200, 50, onClose);
    close.position.set(STAGE_W / 2 - 100, STAGE_H - 64);
    this.addChild(close);

    this.refresh();
  }

  private tryUnlock(tech: Tech): void {
    if (unlock(this.state, tech)) {
      audio.play("button");
      this.onChange();
      this.refresh();
    }
  }

  private refresh(): void {
    this.resourceText.text = `Resources: ${fmtK(this.state.resources)}`;
    for (const card of this.cards) card.refresh(this.state);
  }
}

class TechCard extends Container {
  private tech: Tech;
  private bg: Graphics;
  private nameText: Text;
  private descText: Text;
  private statusText: Text;
  private clickable = false;

  constructor(tech: Tech, onClick: () => void) {
    super();
    this.tech = tech;

    this.bg = new Graphics();
    this.addChild(this.bg);

    this.nameText = new Text({ text: `${tech.name}`, style: styles.button });
    this.nameText.position.set(14, 12);
    this.addChild(this.nameText);

    this.descText = new Text({
      text: tech.description,
      style: { ...styles.hudDim, wordWrap: true, wordWrapWidth: CARD_W - 28 },
    });
    this.descText.position.set(14, 42);
    this.addChild(this.descText);

    this.statusText = new Text({ text: "", style: styles.buttonSmall });
    this.statusText.position.set(14, CARD_H - 26);
    this.addChild(this.statusText);

    this.eventMode = "static";
    this.hitArea = { contains: (x: number, y: number) => x >= 0 && x <= CARD_W && y >= 0 && y <= CARD_H };
    this.on("pointertap", () => {
      if (this.clickable) onClick();
    });
    this.on("pointerover", () => {
      if (this.clickable) this.draw(0x1c3046, COLORS.accent);
    });
    this.on("pointerout", () => this.redrawForState());
  }

  private currentState: GameState | null = null;

  refresh(state: GameState): void {
    this.currentState = state;
    this.redrawForState();
  }

  private redrawForState(): void {
    const s = this.currentState;
    if (!s) return;
    const owned = s.unlockedTech.has(this.tech.id);
    const check = canUnlock(s, this.tech);

    if (owned) {
      this.clickable = false;
      this.cursor = "default";
      this.draw(0x10261a, COLORS.healthy);
      this.statusText.text = "✓ Researched";
      this.statusText.style.fill = COLORS.healthy;
    } else if (check.reason === "locked") {
      this.clickable = false;
      this.cursor = "default";
      this.draw(COLORS.panel, COLORS.panelEdge, 0.6);
      const pre = techById(this.tech.prereq!);
      this.statusText.text = `Requires ${pre?.name ?? "prerequisite"}`;
      this.statusText.style.fill = COLORS.textDim;
    } else if (check.reason === "cost") {
      this.clickable = false;
      this.cursor = "default";
      this.draw(COLORS.panel, COLORS.panelEdge);
      this.statusText.text = `Cost ${fmtK(this.tech.cost)}`;
      this.statusText.style.fill = COLORS.danger;
    } else {
      this.clickable = true;
      this.cursor = "pointer";
      this.draw(COLORS.panel, COLORS.accent);
      this.statusText.text = `Research — ${fmtK(this.tech.cost)}`;
      this.statusText.style.fill = COLORS.accent;
    }
  }

  private draw(fill: number, edge: number, alpha = 1): void {
    this.bg
      .clear()
      .roundRect(0, 0, CARD_W, CARD_H, 10)
      .fill({ color: fill, alpha: 0.95 })
      .stroke({ color: edge, width: 2 });
    this.alpha = alpha;
  }
}
