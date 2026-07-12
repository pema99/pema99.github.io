# VirtualC64 / vc64web — vendored copy

This `emu/` directory contains a locally hosted ("vendored") copy of **vc64web**,
the web port of **VirtualC64**, a cycle-accurate Commodore 64 emulator.

- **Author / copyright:** Dirk Hoffmann and contributors
- **License:** GNU General Public License, version 3 (see [`LICENSE`](LICENSE))
- **Upstream source (corresponding source for the compiled `vc64.wasm`):**
  - Web port: https://github.com/vc64web/virtualc64web
  - Core emulator: https://github.com/dirkwhoffmann/virtualc64
- **Vendored on:** 2026-07-12, from https://vc64web.github.io/

Per GPLv3 §6, the complete corresponding source for the `vc64.wasm` binary is
available from the upstream repositories linked above.

## Modifications made to the upstream files

This copy is unmodified **except** for the following changes, made only to let
the emulator run self-contained from this domain (no third-party requests):

1. `index.html`
   - Removed the third-party analytics `<script>` (`cloud.umami.is`).
   - Disabled the service-worker registration (`sw.js`), which is not vendored.
   - Replaced the off-site "legacy browser" redirect with a local console message.
2. `js/vc64web_player.js`
   - Changed `vc64web_url` from `https://vc64web.github.io/` to the relative
     path `emu/`, so the player loads this local copy.
3. `js/vc64_browser.js`
   - Changed a hard-coded `https://vc64web.github.io/` share-link base to a
     relative path (defensive; that feature is not used here).

No changes were made to the emulator core (`vc64.wasm`) or its behavior.
