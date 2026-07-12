#!/usr/bin/env bash
# Regenerate disks.json from whatever is in c64/disks/.
# Each entry is { "name": "<image>", "note": "<contents of same-named .txt>" }.
# The note is baked in here so the page doesn't fetch a .txt per disk at runtime.
# Run this after adding/editing disks or their notes:  bash gen-manifest.sh
set -euo pipefail
cd "$(dirname "$0")"

# Escape a string for inclusion inside a JSON "..." literal (from stdin).
json_escape() {
  local s
  s=$(cat)                    # trailing newlines dropped (notes are trimmed anyway)
  s=${s//\\/\\\\}             # backslash
  s=${s//\"/\\\"}             # double quote
  s=${s//$'\r'/}             # strip CR
  s=${s//$'\t'/\\t}          # tab
  s=${s//$'\n'/\\n}          # newline -> \n
  printf '%s' "$s"
}

{
  echo "["
  first=1
  find disks -maxdepth 1 -type f \( -iname '*.d64' -o -iname '*.crt' \) -printf '%f\n' \
    | LC_ALL=C sort \
    | while IFS= read -r f; do
        name_esc=$(printf '%s' "$f" | json_escape)
        txt="disks/${f%.*}.txt"
        if [ -f "$txt" ]; then
          note_esc=$(json_escape < "$txt")
        else
          note_esc=""
        fi
        if [ $first -eq 1 ]; then first=0; else echo ","; fi
        printf '  { "name": "%s", "note": "%s" }' "$name_esc" "$note_esc"
      done
  echo
  echo "]"
} > disks.json

echo "Wrote disks.json ($(grep -c '"name"' disks.json) entries)"
