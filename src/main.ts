import { Game } from "./game/app";
import { loadImages } from "./game/assets";
import { MenuScene } from "./game/scenes/MenuScene";

async function boot(): Promise<void> {
  const mount = document.getElementById("app");
  if (!mount) throw new Error("missing #app mount");

  // Best-effort: wait for the themed font so text renders correctly first paint.
  try {
    await Promise.race([
      document.fonts.load('1em "Spicy Rice"'),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  } catch {
    /* font is optional */
  }

  await loadImages();

  const game = await Game.create(mount);
  game.setScene(new MenuScene(game));
}

void boot();
