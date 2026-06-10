import { Container, Graphics, Sprite, Text } from "pixi.js";
import type { City } from "../../sim/engine";
import { COLORS, fmtK, styles } from "../theme";
import { tex } from "../assets";

const W = 110;
const H = 58;
const BAR_W = W - 10;
const BAR_H = 11;

/** A clickable city marker on the map showing health composition + status. */
export class CityNode extends Container {
  readonly city: City;
  private bg: Graphics;
  private bars: Graphics;
  private selRing: Graphics;
  private nameText: Text;
  private prodText: Text;
  private statusIcon: Sprite;

  constructor(city: City, onSelect: (c: City) => void) {
    super();
    this.city = city;
    this.position.set(city.x, city.y);

    this.selRing = new Graphics();
    this.addChild(this.selRing);

    // Soft drop shadow lifts the node off the busy map.
    const shadow = new Graphics().roundRect(2, 3, W, H, 6).fill({ color: 0x000000, alpha: 0.45 });
    this.addChild(shadow);

    this.bg = new Graphics()
      .roundRect(0, 0, W, H, 6)
      .fill({ color: 0x070b12, alpha: 0.92 })
      .stroke({ color: COLORS.panelEdge, width: 1.5, alpha: 1 });
    this.addChild(this.bg);

    this.bars = new Graphics();
    this.bars.position.set(5, 5);
    this.addChild(this.bars);

    this.nameText = new Text({ text: city.name, style: styles.cityName });
    this.nameText.position.set(6, 19);
    this.addChild(this.nameText);

    this.prodText = new Text({ text: "", style: styles.cityNum });
    this.prodText.position.set(6, 39);
    this.addChild(this.prodText);

    this.statusIcon = new Sprite();
    this.statusIcon.width = 22;
    this.statusIcon.height = 22;
    this.statusIcon.position.set(W - 26, 33);
    this.statusIcon.visible = false;
    this.addChild(this.statusIcon);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = this.bg.getLocalBounds().rectangle;
    this.on("pointertap", () => onSelect(city));
    this.on("pointerover", () => (this.bg.alpha = 1));
    this.on("pointerout", () => (this.bg.alpha = 1));

    this.refresh(false);
  }

  setSelected(selected: boolean): void {
    this.selRing.clear();
    if (selected) {
      this.selRing
        .roundRect(-3, -3, W + 6, H + 6, 8)
        .stroke({ color: COLORS.selected, width: 2.5 });
    }
  }

  refresh(_animate: boolean): void {
    const c = this.city;
    const pop = c.population || 1;
    const healthyW = Math.max(0, (c.healthy / pop) * BAR_W);
    const infectedW = Math.max(0, ((c.healthy + c.infected + c.gettingSick) / pop) * BAR_W);

    this.bars.clear();
    // dead = full red base, then infected (yellow) overlay, then healthy (green) overlay.
    this.bars.rect(0, 0, BAR_W, BAR_H).fill(COLORS.dead);
    this.bars.rect(0, 0, infectedW, BAR_H).fill(COLORS.infected);
    this.bars.rect(0, 0, healthyW, BAR_H).fill(COLORS.healthy);
    this.bars.rect(0, 0, BAR_W, BAR_H).stroke({ color: 0x000000, width: 1, alpha: 0.6 });

    if (c.living <= 0) {
      this.prodText.text = "DEAD";
      this.prodText.style.fill = COLORS.danger;
    } else {
      this.prodText.text = `${fmtK(c.living)} · ${fmtK(c.infected)} ill`;
      this.prodText.style.fill = COLORS.textDim;
    }

    // Status icon priority: quarantine > barricade > house arrest.
    if (c.quarantine) this.showStatus("icons_Quarrantine");
    else if (c.barricade) this.showStatus("icons_Barricade");
    else if (c.houseArrest) this.showStatus("icons_HouseArrest");
    else this.statusIcon.visible = false;
  }

  private showStatus(key: string): void {
    this.statusIcon.texture = tex(key);
    this.statusIcon.visible = true;
  }
}
