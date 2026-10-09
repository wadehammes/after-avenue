#!/usr/bin/env bash
set -euo pipefail

# postToolUse (Write|StrReplace): lightweight handbook/README pointer after substantive edits.
# Only fires for mapped paths (exits 0 silently otherwise).

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"
[ -n "$file" ] || exit 0

# Normalize to repo-relative
root="$(project_dir)"
case "$file" in
  "$root"/*) file="${file#"$root"/}" ;;
esac

chapter_set=""
for chapter in $(handbook_chapters_for_path "$file"); do
  chapter_set="${chapter_set}${chapter} "
done
chapter_set="$(printf '%s' "$chapter_set" | xargs 2>/dev/null || true)"

readme=""
case "$file" in
  package.json | pnpm-workspace.yaml | .tool-versions | Makefile | vercel.json)
    readme="root README.md (setup, scripts, tech stack) and docs/handbook/platform.md"
    ;;
  docs/handbook/platform.md)
    readme="root README.md if install/env/scripts changed for humans"
    ;;
  docs/handbook/*)
    chapter_set=""
    ;;
esac

if [ -z "$chapter_set" ] && [ -z "$readme" ]; then
  exit 0
fi

parts=()
if [ -n "$chapter_set" ]; then
  parts+=("If behavior or conventions shifted, update docs/handbook/ ($(printf '%s' "$chapter_set" | tr ' ' ', ')) in the same change.")
fi
if [ -n "$readme" ]; then
  parts+=("If user-facing setup or scripts changed, sync ${readme}.")
fi

ctx="Handbook sync: edited ${file}. ${parts[*]} High-churn map: docs/handbook/README.md."

advise_context "$ctx"
exit 0
