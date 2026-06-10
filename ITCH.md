# Publishing to itch.io

## The build

```bash
npm run pack      # builds dist/ and writes darkages-itch.zip (index.html at the root)
```

Upload **`darkages-itch.zip`** (~12 MB). The zip already has `index.html` at the top level,
which is what itch requires for HTML games.

## Recommended itch.io settings

On the game's **Edit game** page:

| Setting | Value | Why |
|---|---|---|
| **Kind of project** | HTML | It's a browser game. |
| Uploaded file | `darkages-itch.zip` → check **"This file will be played in the browser"** | Serves it in an iframe. |
| **Viewport dimensions** | **1280 × 720** | The game renders at a fixed 1280×720 and scales to fit. |
| **Fullscreen button** | **Enabled** | Best way to play; itch's button is more reliable than the in-game one inside the iframe. |
| **"Automatically start on page load"** | **Off** (use the click-to-run frame) | The click to launch is a user gesture, which lets the browser start the music (autoplay is otherwise blocked until the player interacts). |
| Mobile friendly | **Off** | It's mouse/pointer-driven with small text — designed for desktop, not touch. |
| Enable scrollbars | Off | The canvas fits the frame exactly. |
| Orientation | Landscape | 16:9. |
| Frame background color | `#08080c` | Matches the letterbox so bars are invisible. |

### Notes

- **Audio + autoplay:** browsers block sound until the player interacts. With "automatically
  start on page load" off, the itch "Run game" click provides that gesture and music starts on
  the menu. (If you turn autostart on, audio simply begins after the first in-game click — no
  errors either way.)
- **No special headers needed.** The game doesn't use SharedArrayBuffer/threads, so you do *not*
  need itch's "SharedArrayBuffer support" (COOP/COEP) toggle.
- **Self-contained.** Fonts/art/audio are bundled and loaded with relative paths, so it works
  from itch's sandboxed CDN with no external requests.
- **Suggested page art:** `legacy/web/images/SplashScreen.jpg` or `BeginningSplashScreen.jpg`
  make good cover/screenshot images. Genre: Strategy. Tags: turn-based, plague, medieval,
  singleplayer.
