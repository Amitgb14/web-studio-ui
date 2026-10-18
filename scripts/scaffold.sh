#!/usr/bin/env bash
# Usage: scaffold.sh <target-dir> <app-key> ["App Title"]
#   app-key: lowercase, used for the wordmark, package name and theme storage key (e.g. "acme")
# Copies the Studio UI starter into <target-dir> (which must be empty or absent) and fills in the names.
set -euo pipefail
dir=${1:?target dir}; key=${2:?app key, e.g. acme}; title=${3:-"$key"}
[[ $key =~ ^[a-z][a-z0-9-]*$ ]] || { echo "app-key must be lowercase letters, digits, dashes" >&2; exit 1; }
if [ -e "$dir" ] && [ -n "$(ls -A "$dir" 2>/dev/null)" ]; then echo "$dir is not empty; refusing to overwrite" >&2; exit 1; fi
here=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$dir"
cp -R "$here/assets/template/." "$dir/"
grep -rl -e "__APP_KEY__" -e "__APP_TITLE__" "$dir" | while read -r f; do
  sed -i.bak -e "s/__APP_KEY__/$key/g" -e "s/__APP_TITLE__/${title//\//\\/}/g" "$f" && rm -f "$f.bak"
done
echo "Scaffolded $title in $dir. Next: cd $dir && npm install && npm run dev"
