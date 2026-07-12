/* ------------------------------------------------------------------ *
 *  C64 disk browser
 *  - Parses .d64 directories client-side (no server needed)
 *  - Launches disks in the embedded vc64web emulator with original ROMs
 * ------------------------------------------------------------------ */

(function () {
  "use strict";

  // Absolute URLs to the original Commodore ROMs (served as static files).
  var base = new URL(".", document.baseURI).href; // .../c64/
  var ROMS = {
    basic:   base + "roms/basic.bin",
    kernal:  base + "roms/kernal.bin",
    chargen: base + "roms/chargen.bin",
    dos1541: base + "roms/dos1541.bin"
  };

  /* ---------------------- D64 geometry ---------------------- */
  // Sectors per track (1-based indexing; slot 0 unused).
  var SPT = [0,
    21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21, // 1-17
    19,19,19,19,19,19,19,                               // 18-24
    18,18,18,18,18,18,                                  // 25-30
    17,17,17,17,17];                                    // 31-35

  function sectorOffset(track, sector) {
    var off = 0;
    for (var t = 1; t < track; t++) off += SPT[t] * 256;
    return off + sector * 256;
  }

  /* ------------------ PETSCII -> display text ------------------ */
  // Convert a PETSCII code to the C64 screen (POKE) code for the same glyph.
  function petsciiToScreen(p) {
    if (p <= 0x1F) return (p + 0x80) & 0xFF;
    if (p <= 0x3F) return p;
    if (p <= 0x5F) return p - 0x40;
    if (p <= 0x7F) return p - 0x20;
    if (p <= 0x9F) return p + 0x40;
    if (p <= 0xBF) return p - 0x40;
    return p - 0x80;                 // 0xC0-0xFF
  }

  // Render a PETSCII byte with the exact C64 uppercase/graphics glyph. PetMe64
  // maps its Private Use Area U+E000 + screencode to those glyphs, so decorated
  // disk names (lines, boxes, suits) display faithfully instead of as ASCII.
  function petscii(c) {
    return String.fromCharCode(0xE000 + petsciiToScreen(c));
  }

  function petsciiStr(bytes, start, len) {
    // Trim trailing 0xA0 padding, then map each remaining byte to its C64 glyph.
    var end = len;
    while (end > 0 && bytes[start + end - 1] === 0xA0) end--;
    var s = "";
    for (var i = 0; i < end; i++) s += petscii(bytes[start + i]);
    return s;
  }

  // ASCII form of a filename, safe to type into a LOAD"..." command. Untypeable
  // characters (graphics, quotes) become "?" single-char wildcards. Lowercased
  // because the emulator types unshifted keys (lowercase ASCII) to produce the
  // C64's uppercase letters.
  function petsciiAscii(bytes, start, len) {
    var end = len;
    while (end > 0 && bytes[start + end - 1] === 0xA0) end--;
    var s = "";
    for (var i = 0; i < end; i++) {
      var b = bytes[start + i];
      if (b >= 0x20 && b <= 0x5F && b !== 0x22 && b !== 0x27) s += String.fromCharCode(b);
      else s += "?";
    }
    return s.toLowerCase();
  }

  var FTYPES = ["DEL", "SEQ", "PRG", "USR", "REL"];

  // Parse a D64 image (Uint8Array) into { title, id, entries: [{name,type,size}] }.
  function parseD64(bytes) {
    var bamOff = sectorOffset(18, 0);
    var title = petsciiStr(bytes, bamOff + 0x90, 16);
    var id    = petsciiStr(bytes, bamOff + 0xA2, 5);

    var entries = [];
    var track = 18, sector = 1, guard = 0;
    while (track !== 0 && guard++ < 64) {
      var off = sectorOffset(track, sector);
      if (off + 256 > bytes.length) break;
      var nextT = bytes[off], nextS = bytes[off + 1];
      for (var e = 0; e < 8; e++) {
        var eo = off + e * 32;
        var typeByte = bytes[eo + 2];
        var ftype = typeByte & 0x0F;
        var closed = (typeByte & 0x80) !== 0;
        if (typeByte === 0 || (!closed && ftype === 0)) continue; // empty / scratched
        var name = petsciiStr(bytes, eo + 5, 16);
        if (!name) continue;
        var size = bytes[eo + 0x1E] | (bytes[eo + 0x1F] << 8);
        entries.push({
          name: name,
          loadName: petsciiAscii(bytes, eo + 5, 16),
          type: FTYPES[ftype] || "???",
          size: size
        });
      }
      track = nextT; sector = nextS;
    }
    return { title: title, id: id, entries: entries };
  }

  /* ------------------------- fetching ------------------------- */
  var cache = {}; // url -> Promise<Uint8Array>
  function fetchDisk(url) {
    if (!cache[url]) {
      cache[url] = fetch(encodeURI(url))
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.arrayBuffer();
        })
        .then(function (buf) { return new Uint8Array(buf); });
    }
    return cache[url];
  }

  /* ------------------- pretty display names ------------------- */
  function prettyName(fname) {
    var n = fname.replace(/\.(d64|crt)$/i, "");
    n = n.replace(/\s*-\s*side\s*([ab])\b/i, function (_, s) {
      return " (Side " + s.toUpperCase() + ")";
    });
    return n.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }

  /* ----------------------- persistent emulator ----------------------- */
  // One emulator lives at the top of the page. We boot it ONCE with the original
  // ROMs, then swap disks into the running machine — no per-selection reload.
  //
  // Key detail learned the hard way: the emulator's built-in disk-insert path
  // (samesite_file url / cmd:"load") attaches to drive index 0 when the disk
  // dialog is suppressed, and drive 0 silently fails to mount. So instead we hand
  // the raw disk bytes to the iframe ourselves and call the core's wasm_loadfile
  // with DEVICE NUMBER 8, which actually inserts the disk into drive 8.
  var emuBooted = false, emuReady = false;

  // Becomes true once the emulator core is up and answering (it posts
  // "render_run_state" in reply to the player's state poller).
  window.addEventListener("message", function (e) {
    if (e && e.data && e.data.msg === "render_run_state") emuReady = true;
  });

  function whenEmuReady(cb) {
    if (emuReady) return cb();
    setTimeout(function () { whenEmuReady(cb); }, 100);
  }

  function bootEmulator() {
    if (emuBooted) return;
    var host = document.getElementById("emu-host");
    if (!host || typeof vc64web_player === "undefined") return;
    host.innerHTML = '<div id="emu-mount"></div>';
    var mount = host.querySelector("#emu-mount");
    var config = {
      dialog_on_missing_roms: false,
      dialog_on_disk: false,
      navbar: false,   // maps to the emulator's auto-hide "hidden" mode
      wide: false,
      border: true
    };
    // Original ROMs only — the disk is injected later, per selection.
    vc64web_player.samesite_file = {
      basic_rom_url:   ROMS.basic,
      kernal_rom_url:  ROMS.kernal,
      charset_rom_url: ROMS.chargen,
      floppy_rom_url:  ROMS.dos1541
    };
    vc64web_player.load(mount, encodeURIComponent(JSON.stringify(config)));
    emuBooted = true;
    // Turn on "warp during disk load" once the core is up.
    whenEmuReady(function () { vc64web_player.send_script("wasm_set_warp(1);"); });
  }

  // Base64-encode a byte array (chunked to avoid call-stack limits).
  function bytesToBase64(bytes) {
    var bin = "", CHUNK = 0x8000;
    for (var i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(bin);
  }

  // program: if given, LOAD"program",8,1 then RUN it after inserting the disk;
  // if null, just insert the disk and reset to a READY prompt (LIST / LOAD"$",8).
  function runDisk(url, fname, program) {
    bootEmulator();
    var isCart = /\.crt$/i.test(fname);

    fetchDisk(url).then(function (bytes) {
      var b64 = bytesToBase64(bytes);
      // A self-contained script executed inside the emulator iframe. It rebuilds
      // the byte array, resets to a clean machine, then attaches the media to
      // device 8 (disks) — the reliable path. Cartridges are flashed the same way
      // and started with a hard reset.
      var script =
        "var __b=atob('" + b64 + "');" +
        "var __d=new Uint8Array(__b.length);" +
        "for(var i=0;i<__b.length;i++)__d[i]=__b.charCodeAt(i);" +
        "await wasm_ready_after_reset();" +
        "wasm_reset();" +
        "await wasm_ready_after_reset();" +
        "wasm_set_warp(1);" +   // vc64web's "warp during disk load" — speeds up loading
        "wasm_loadfile('" + (isCart ? "file.crt" : "disk.d64") + "', __d, __d.length, 8);";

      if (isCart) {
        script += "wasm_hard_reset();";
      } else if (program) {
        script +=
          "await action(\`'load\"" + program + "\",8,1'=>Enter\`);" +
          "await disk_loading_finished();" +
          "await action(\`'run'=>Enter\`);";
      }

      whenEmuReady(function () { vc64web_player.send_script(script); });
    });
  }

  /* --------------------------- render --------------------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderDirectory(container, url) {
    container.innerHTML = '<span class="loading">reading disk…</span>';
    fetchDisk(url).then(function (bytes) {
      var d = parseD64(bytes);
      container.innerHTML = "";
      var head = el("div", "diskname",
        '0 "' + esc(d.title) + '" ' + esc(d.id));
      container.appendChild(head);
      var ul = el("ul");
      d.entries.forEach(function (f) {
        var li = el("li");
        li.appendChild(el("span", null, esc(f.name) + "  " + esc(f.type)));
        li.appendChild(el("span", "sz", f.size + " blk"));
        li.title = "Load & run this file";
        li.addEventListener("click", function () {
          runDisk(url, url.split("/").pop(), f.loadName);
        });
        ul.appendChild(li);
      });
      if (!d.entries.length) ul.appendChild(el("li", null, "(empty or unreadable)"));
      container.appendChild(ul);
    }).catch(function (e) {
      container.innerHTML = '<span class="err">could not read disk: ' + esc(e.message) + "</span>";
    });
  }

  function makeCard(file) {
    var isCart = file.ext.toLowerCase() === ".crt";
    var card = el("div", "disk");
    card.appendChild(el("h2", null,
      esc(prettyName(file.name)) + (isCart ? '<span class="tag">cart</span>' : "")));

    // Optional note, baked into the manifest from the disk's same-named .txt
    // file (see gen-manifest.sh). Shown under the title when non-empty.
    var noteText = (file.note || "").trim();
    if (noteText) {
      var note = el("p", "note");
      note.textContent = noteText;
      card.appendChild(note);
    }

    var row = el("div", "btnrow");
    var dir = null;

    // Files first: reveals the disk's directory (disks only).
    if (!isCart) {
      var dirBtn = el("button", "act ghost", "Files");
      dir = el("div", "dir");
      dir.style.display = "none";
      var loaded = false;
      dirBtn.addEventListener("click", function () {
        var showing = dir.style.display !== "none";
        dir.style.display = showing ? "none" : "block";
        if (!showing && !loaded) { loaded = true; renderDirectory(dir, file.url); }
      });
      row.appendChild(dirBtn);
    }

    // Attach (Boot for cartridges) — neutral styling, no green.
    var play = el("button", "act ghost", isCart ? "Boot" : "Attach");
    play.addEventListener("click", function () { runDisk(file.url, file.name, null); });
    row.appendChild(play);

    // Download the raw disk/cartridge image (last).
    var dl = el("a", "act ghost", "Download");
    dl.setAttribute("href", encodeURI(file.url));
    dl.setAttribute("download", file.name);
    row.appendChild(dl);

    card.appendChild(row);
    if (dir) card.appendChild(dir);
    return card;
  }

  /* ----------------------------- modals ----------------------------- */
  function initModals() {
    var open = null;
    function close() { if (open) { open.classList.remove("on"); open = null; } }
    function show(id) {
      close();
      var m = document.getElementById("modal-" + id);
      if (m) { m.classList.add("on"); open = m; }
    }
    document.querySelectorAll(".navbtn[data-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () { show(btn.getAttribute("data-modal")); });
    });
    document.querySelectorAll(".modal").forEach(function (m) {
      // Close on the × button or when clicking the backdrop (outside the box).
      m.addEventListener("click", function (ev) {
        if (ev.target === m || ev.target.classList.contains("modal-close")) close();
      });
    });
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") close(); });
  }

  /* ----------------------------- init ----------------------------- */
  function build(files) {
    // Disks first (alpha), cartridges last.
    files.sort(function (a, b) {
      var ca = a.ext.toLowerCase() === ".crt", cb = b.ext.toLowerCase() === ".crt";
      if (ca !== cb) return ca ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    var grid = document.getElementById("grid");
    files.forEach(function (f) { grid.appendChild(makeCard(f)); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initModals();

    // Boot the emulator immediately so it's warm before the first selection.
    bootEmulator();

    // The disk list is a static manifest (disks.json), regenerated with gen-manifest.sh.
    fetch("disks.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        // Manifest entries are { name, note } (or bare "name" strings for
        // backwards compat). Derive url/ext from the name; note is baked in.
        var files = data.map(function (item) {
          var name = typeof item === "string" ? item : item.name;
          var dot = name.lastIndexOf(".");
          return {
            name: name,
            url: "disks/" + name,
            ext: dot >= 0 ? name.slice(dot) : "",
            note: typeof item === "string" ? "" : (item.note || "")
          };
        });
        build(files);
      })
      .catch(function (e) {
        document.getElementById("grid").innerHTML =
          '<div class="disk"><h2>Could not load disk list</h2>' +
          '<p class="note">' + esc(e.message) + " — is disks.json present?</p></div>";
      });
  });
})();
