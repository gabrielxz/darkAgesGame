import { Application, Container } from "pixi.js";
import { STAGE_H, STAGE_W } from "./theme";

/** A scene is just a container with optional lifecycle hooks. */
export abstract class Scene extends Container {
  constructor(protected game: Game) {
    super();
  }
  /** Called once per frame with delta in ms. */
  update(_dtMs: number): void {}
  /** Called when the scene is removed. */
  dispose(): void {}
}

export class Game {
  app: Application;
  private current: Scene | null = null;

  private constructor(app: Application) {
    this.app = app;
  }

  static async create(mount: HTMLElement): Promise<Game> {
    const app = new Application();
    await app.init({
      width: STAGE_W,
      height: STAGE_H,
      background: "#08080c",
      antialias: true,
      // CSS in index.html scales the fixed 1280x720 canvas to fit the window.
      autoDensity: false,
    });
    mount.appendChild(app.canvas);

    const game = new Game(app);
    app.ticker.add((ticker) => {
      game.current?.update(ticker.deltaMS);
    });
    return game;
  }

  setScene(scene: Scene): void {
    if (this.current) {
      this.app.stage.removeChild(this.current);
      this.current.dispose();
      this.current.destroy({ children: true });
    }
    this.current = scene;
    this.app.stage.addChild(scene);
  }
}
