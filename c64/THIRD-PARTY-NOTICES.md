# Third-party notices — /c64

This page (a browser-based Commodore 64 disk browser) bundles third-party
software and assets. Each is listed below with its author, license and source.

---

## Emulator

### VirtualC64 / vc64web — **GPL-3.0**
- Cycle-accurate C64 emulator (the WebAssembly core and its web UI), vendored
  under [`emu/`](emu/).
- © Dirk Hoffmann and contributors.
- License text: [`emu/LICENSE`](emu/LICENSE). Vendoring notes and the corresponding
  source location: [`emu/NOTICE.md`](emu/NOTICE.md).
- Source: https://github.com/vc64web/virtualc64web and
  https://github.com/dirkwhoffmann/virtualc64

The GPL-3.0 covers the emulator in `emu/` only.

---

## JavaScript libraries bundled inside the emulator (`emu/js/`)

All MIT-licensed unless noted. The MIT permission notice text is reproduced at
the bottom of this file; the per-project copyright holders are:

| Library | Copyright | License | Source |
|---|---|---|---|
| jQuery 3.7.1 | OpenJS Foundation & contributors | MIT | https://jquery.com |
| Bootstrap 5 | The Bootstrap Authors; Twitter, Inc. | MIT | https://getbootstrap.com |
| Popper.js (in Bootstrap bundle) | Federico Zivolo | MIT | https://popper.js.org |
| CodeMirror 6 | Marijn Haverbeke & contributors | MIT | https://codemirror.net |
| JSHint | JSHint contributors; portions © Douglas Crockford, Jeremy Ashkenas, OpenJS Foundation | MIT | https://jshint.com |
| JSZip | Stuart Knightley & contributors | MIT (dual MIT/GPL-3.0; used here under MIT) | https://stuk.github.io/jszip |
| virtualjoystick.js | Jerome Etienne | MIT | https://github.com/jeromeetienne/virtualjoystick.js |

---

## Font

### PetMe64 — Kreative Software Relay Fonts *Free Use License*
- The authentic C64 typeface used across the page, © Kreative Software
  (Rebecca G. Bettencourt).
- Full license: [`fonts/FreeLicense.txt`](fonts/FreeLicense.txt) (included verbatim
  as the license requires). Used unmodified.
- Source: https://www.kreativekorp.com/software/fonts/c64/

---

## MIT License (applies to the MIT-licensed libraries above)

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
