#!/usr/bin/env bash
# Usage: scaffold.sh <target-dir> <app-key> ["App Title"]
#   target-dir: a new folder, or one holding only repo basics (.git, .gitignore,
#               README, LICENSE, .github, .DS_Store), so "." works in a fresh repo
#   app-key:    lowercase; used for the wordmark, package name and theme storage key (e.g. "acme")
# Copies the Studio UI starter into <target-dir> and fills in the names. Never
# overwrites a file that's already there; an existing .gitignore gets the
# starter's missing lines appended. Works with the stock bash and BSD tools on macOS.
set -euo pipefail

usage() { sed -n '2,5p' "$0" | sed 's/^# \{0,1\}//' >&2; exit 1; }
[ $# -ge 2 ] || usage
dir=$1; key=$2; title=${3:-$2}
[[ $key =~ ^[a-z][a-z0-9-]*$ ]] || { echo "app-key must start with a letter and use only lowercase letters, digits and dashes (got: $key)" >&2; exit 1; }

here=$(cd "$(dirname "$0")/.." && pwd)
src="$here/assets/template"
[ -d "$src" ] || { echo "starter not found at $src" >&2; exit 1; }

# Refuse a folder that already has a project in it.
if [ -e "$dir" ]; then
  [ -d "$dir" ] || { echo "$dir exists and is not a folder" >&2; exit 1; }
  blockers=()
  for f in "$dir"/* "$dir"/.[!.]* "$dir"/..?*; do
    [ -e "$f" ] || continue
    case $(basename "$f") in
      .git|.gitignore|.gitattributes|.github|.DS_Store|README|README.*|readme.*|LICENSE|LICENSE.*|LICENCE|LICENCE.*) ;;
      *) blockers+=("$(basename "$f")") ;;
    esac
  done
  if [ ${#blockers[@]} -gt 0 ]; then
    echo "$dir already has files: ${blockers[*]}" >&2
    echo "Pick a new folder (for example $dir/web), or empty this one first." >&2
    exit 1
  fi
fi
mkdir -p "$dir"

# Copy file by file so nothing that's already there is overwritten.
(cd "$src" && find . -type f) | while IFS= read -r rel; do
  rel=${rel#./}
  out="$dir/$rel"
  if [ "$rel" = ".gitignore" ] && [ -e "$out" ]; then
    while IFS= read -r line; do
      grep -qxF -- "$line" "$out" || printf '%s\n' "$line" >> "$out"
    done < "$src/$rel"
  elif [ ! -e "$out" ]; then
    mkdir -p "$(dirname "$out")"
    cp "$src/$rel" "$out"
  fi
done

# Fill in the names, escaping sed's special characters in the title.
esc_title=$(printf '%s' "$title" | sed -e 's/[\/&|\\]/\\&/g')
grep -rl --exclude-dir=.git --exclude-dir=node_modules -e "__APP_KEY__" -e "__APP_TITLE__" "$dir" | while IFS= read -r f; do
  sed -i.bak -e "s|__APP_KEY__|$key|g" -e "s|__APP_TITLE__|$esc_title|g" "$f" && rm -f "$f.bak"
done

echo "Scaffolded $title in $dir"
if [ "$dir" = "." ]; then echo "Next: npm install && npm run dev"; else echo "Next: cd $dir && npm install && npm run dev"; fi
