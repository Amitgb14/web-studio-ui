#!/usr/bin/env bash
# Shortcut for running the scaffold from a clone of this repo:
#   bash scaffold.sh <target-dir> <app-key> ["App Title"]
# The real script lives with the skill, at plugins/studio-ui/skills/build/scripts/scaffold.sh.
exec bash "$(cd "$(dirname "$0")" && pwd)/plugins/studio-ui/skills/build/scripts/scaffold.sh" "$@"
