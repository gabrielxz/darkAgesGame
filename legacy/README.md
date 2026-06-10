# Legacy — the original 2014 build

This folder is the **original Dark Ages game-jam game** as it shipped in 2014, preserved
unchanged for reference. It is a [Dart](https://dart.dev) 1.x + [StageXL](http://www.stagexl.org)
0.9 web app — neither of which is current, so it will not build on a modern Dart toolchain.

- `web/` — the game source (`darkages.dart`, `city.dart`, `menu.dart`, …) plus art, audio, and
  the committed `darkages.dart.js` that `dart2js` produced back then.
- `packages/` — the vendored Dart packages from that era.
- `pubspec.yaml` / `pubspec.lock` — the original Dart project manifest.

The 2026 remake at the repository root reimplements this game (both a faithful "Classic" mode
and a rebalanced "Modern" mode) in TypeScript + PixiJS. See the top-level `README.md`.
