import { Container, Text } from "pixi.js";
import type { GameState } from "../../sim/engine";
import type { ActionId } from "../../sim/types";
import { ACTION_META, ACTION_ORDER } from "../../sim/actions";
import { BOTTOM_PANEL, COLORS, fmtK, styles } from "../theme";
import { ImageButton } from "./Button";
import { tex } from "../assets";

/** Bottom-right panel: selected-city stats + the action buttons. */
export class ActionPanel extends Container {
  private state: GameState;
  private header: Text;
  private stats: Text;
  private hint: Text;
  private buttons = new Map<ActionId, ImageButton>();

  constructor(
    state: GameState,
    onAction: (id: ActionId) => void,
    onHover: (id: ActionId | null, y: number) => void,
  ) {
    super();
    this.state = state;
    const p = BOTTOM_PANEL;
    const pad = 14;

    this.header = new Text({ text: "", style: styles.heading });
    this.header.position.set(p.x + pad, p.y + 8);
    this.addChild(this.header);

    this.stats = new Text({ text: "", style: styles.hudDim });
    this.stats.position.set(p.x + pad, p.y + 38);
    this.addChild(this.stats);

    // Action buttons.
    const bw = p.w - pad * 2;
    const bh = 42;
    const gap = 6;
    const top = p.y + 96;
    ACTION_ORDER.forEach((id, i) => {
      const meta = ACTION_META[id];
      const yPos = top + i * (bh + gap);
      const btn = new ImageButton(tex(meta.icon), {
        width: bw,
        height: bh,
        onClick: () => onAction(id),
        sound: meta.sound,
        onHover: (h) => onHover(h ? id : null, yPos),
      });
      btn.position.set(p.x + pad, yPos);
      this.addChild(btn);
      this.buttons.set(id, btn);
    });

    this.hint = new Text({ text: "", style: styles.cityNum });
    this.hint.position.set(p.x + pad, p.y + p.h - 16);
    this.addChild(this.hint);

    this.refresh();
  }

  refresh(): void {
    const c = this.state.selected;
    this.header.text = c.name;
    this.stats.text =
      `${fmtK(c.healthy)} healthy · ${fmtK(c.infected)} infected\n` +
      `${fmtK(c.dead)} dead · output ${fmtK(c.harvest())}`;

    for (const id of ACTION_ORDER) {
      const btn = this.buttons.get(id)!;
      const rule = this.state.rule.actions[id];
      if (!rule.enabled) {
        btn.visible = false;
        continue;
      }
      btn.visible = true;
      const check = this.state.canApply(id);
      btn.setEnabled(check.ok);

      // Cost badge (Modern only — Classic actions are free). Charges live in the tooltip.
      if (this.state.rule.actionPoints != null) {
        const cost = this.state.actionCost(id);
        const parts: string[] = [`${rule.apCost} AP`];
        if (cost > 0) parts.push(fmtK(cost));
        btn.setCost(parts.join("  "), check.ok || check.reason === "unavailable");
      } else {
        btn.setCost("", true);
      }
    }
  }

  flashHint(text: string): void {
    this.hint.text = text;
    this.hint.style.fill = COLORS.danger;
  }

  clearHint(): void {
    this.hint.text = "";
  }
}
