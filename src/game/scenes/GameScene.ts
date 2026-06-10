import { Container, Sprite } from "pixi.js";
import { Scene, type Game } from "../app";
import type { GameState, City } from "../../sim/engine";
import { createGame } from "../../sim/game";
import type { ActionId, ModeId } from "../../sim/types";
import { tex } from "../assets";
import { audio } from "../audio";
import { CityNode } from "../ui/CityNode";
import { Hud } from "../ui/Hud";
import { ActionPanel } from "../ui/ActionPanel";
import { ResearchPanel } from "../ui/ResearchPanel";
import { HelpOverlay } from "../ui/HelpOverlay";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Tooltip } from "../ui/Tooltip";
import { TextButton } from "../ui/Button";
import { ACTION_META } from "../../sim/actions";
import { EndScene } from "./EndScene";
import { MenuScene } from "./MenuScene";
import { BOTTOM_PANEL, fmtK, STAGE_H, TOP_PANEL } from "../theme";

export class GameScene extends Scene {
  private state: GameState;
  private nodes: CityNode[] = [];
  private hud: Hud;
  private panel: ActionPanel;
  private ship: Sprite;
  private shipStep: number;
  private busy = false;
  private research: ResearchPanel | null = null;
  private help: HelpOverlay | null = null;
  private dialog: ConfirmDialog | null = null;
  private tooltip: Tooltip;
  private mode: ModeId;

  constructor(game: Game, mode: ModeId) {
    super(game);
    this.mode = mode;
    this.state = createGame(mode);

    // Map background.
    const map = new Sprite(tex("map"));
    map.width = 1280;
    map.height = 720;
    this.addChild(map);

    // City nodes layer.
    const nodeLayer = new Container();
    this.addChild(nodeLayer);
    for (const c of this.state.cities) {
      const node = new CityNode(c, (city) => this.selectCity(city));
      nodeLayer.addChild(node);
      this.nodes.push(node);
    }

    // Roaming ship = visual turn timer.
    this.ship = new Sprite(tex("ship"));
    this.ship.width = 44;
    this.ship.height = 52;
    this.ship.position.set(20, STAGE_H - 64);
    this.shipStep = 920 / this.state.rule.gameTurns;
    this.addChild(this.ship);

    this.hud = new Hud(this.state, () => this.endTurn());
    this.addChild(this.hud);

    this.panel = new ActionPanel(
      this.state,
      (id) => this.doAction(id),
      (id, y) => this.onActionHover(id, y),
    );
    this.addChild(this.panel);

    // Research is a Modern-only strategic layer.
    if (this.state.rule.features.research) {
      const rw = TOP_PANEL.w - 28;
      const researchBtn = new TextButton("⚛ Research", rw, 30, () => this.openResearch());
      researchBtn.position.set(TOP_PANEL.x + 14, TOP_PANEL.y + 120);
      this.addChild(researchBtn);
    }

    // Top-left utility cluster: back to menu, help, mute, fullscreen.
    const menuBtn = new TextButton("Menu", 66, 32, () => this.confirmQuit());
    menuBtn.position.set(12, 12);
    this.addChild(menuBtn);

    const helpBtn = new TextButton("Help", 60, 32, () => this.openHelp());
    helpBtn.position.set(84, 12);
    this.addChild(helpBtn);

    const muteBtn = new TextButton(audio.isMuted() ? "Muted" : "Sound", 68, 32, () => {});
    muteBtn.position.set(150, 12);
    this.addChild(muteBtn);
    muteBtn.removeAllListeners("pointertap");
    muteBtn.on("pointertap", () => muteBtn.setLabel(audio.toggleMute() ? "Muted" : "Sound"));

    const fsBtn = new TextButton("Full", 56, 32, () => this.toggleFullscreen());
    fsBtn.position.set(224, 12);
    this.addChild(fsBtn);

    this.tooltip = new Tooltip();
    this.addChild(this.tooltip);

    // The roaming ship explains itself on hover.
    this.ship.eventMode = "static";
    this.ship.cursor = "help";
    this.ship.on("pointerover", () =>
      this.tooltip.show(
        "Relief Ship",
        "Earth's relief ship, inbound with the cure. It lands on the final turn — hold Titan until then.",
        this.ship.x + 320,
        this.ship.y - 96,
      ),
    );
    this.ship.on("pointerout", () => this.tooltip.hide());

    this.selectCity(this.state.selected);
    audio.playMusic("ambient");
    if (import.meta.env.DEV) (window as unknown as { __state: GameState }).__state = this.state;
  }

  private selectCity(city: City): void {
    this.state.select(city);
    for (const n of this.nodes) n.setSelected(n.city === city);
    this.panel.refresh();
  }

  private doAction(id: ActionId): void {
    if (this.busy || this.state.gameOver) return;
    const check = this.state.canApply(id);
    if (!check.ok) {
      this.panel.flashHint(check.reason ?? "can't do that");
      return;
    }
    this.panel.clearHint();
    this.state.apply(id);
    this.refreshAll();
  }

  private endTurn(): void {
    if (this.busy || this.state.gameOver) return;
    this.panel.clearHint();
    this.state.endTurn();

    // Advance the ship across the map as the turn counter.
    this.ship.x += this.shipStep;

    // Ramp tension music in the final stretch.
    if (this.state.remainingTurns <= 5 && this.state.remainingTurns > 0) {
      audio.playMusic("tension");
    }

    this.refreshAll();

    if (this.state.gameOver) {
      audio.play(this.state.victory ? "victory" : "death");
      audio.stopMusic();
      // Brief beat before the results screen.
      this.busy = true;
      window.setTimeout(() => {
        this.game.setScene(new EndScene(this.game, this.state));
      }, 900);
    }
  }

  private onActionHover(id: ActionId | null, y: number): void {
    if (!id || this.state.gameOver) {
      this.tooltip.hide();
      return;
    }
    const meta = ACTION_META[id];
    let body = meta.description;
    if (this.state.rule.actionPoints != null) {
      const rule = this.state.rule.actions[id];
      const cost = this.state.actionCost(id);
      const bits: string[] = [`${rule.apCost} AP`];
      if (cost > 0) bits.push(`${fmtK(cost)} res`);
      if (rule.charges != null) bits.push(`${this.state.charges[id] ?? 0} left`);
      body += `\n\nCost: ${bits.join("  ·  ")}`;
    }
    // Tooltip sits just left of the action panel, vertically aligned to the button.
    this.tooltip.show(meta.label, body, BOTTOM_PANEL.x - 8, y);
  }

  private confirmQuit(): void {
    if (this.dialog || this.state.gameOver) return;
    this.tooltip.hide();
    const close = () => {
      if (this.dialog) {
        this.removeChild(this.dialog);
        this.dialog.destroy({ children: true });
        this.dialog = null;
      }
    };
    this.dialog = new ConfirmDialog(
      "Leave this game and return to the menu? This run will be lost.",
      "Quit to Menu",
      () => this.game.setScene(new MenuScene(this.game)),
      close,
    );
    this.addChild(this.dialog);
  }

  private toggleFullscreen(): void {
    const el = document.getElementById("app") ?? document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  private openHelp(): void {
    if (this.help || this.state.gameOver) return;
    this.tooltip.hide();
    this.help = new HelpOverlay(this.mode, () => this.closeHelp());
    this.addChild(this.help);
  }

  private closeHelp(): void {
    if (!this.help) return;
    this.removeChild(this.help);
    this.help.destroy({ children: true });
    this.help = null;
  }

  private openResearch(): void {
    if (this.research || this.state.gameOver) return;
    this.research = new ResearchPanel(
      this.state,
      () => this.refreshAll(),
      () => this.closeResearch(),
    );
    this.addChild(this.research);
  }

  private closeResearch(): void {
    if (!this.research) return;
    this.removeChild(this.research);
    this.research.destroy({ children: true });
    this.research = null;
    this.refreshAll();
  }

  private refreshAll(): void {
    for (const n of this.nodes) n.refresh(true);
    this.hud.refresh(this.state);
    this.panel.refresh();
    if (import.meta.env.DEV) (window as unknown as { __state: GameState }).__state = this.state;
  }
}
