#!/usr/bin/env bash
set -euo pipefail

# preToolUse (Write|StrReplace): inject handbook routing before every edit (rhythm .claude PreToolUse pattern).

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"
case "$file" in
  docs/handbook/* | *.md) exit 0 ;;
esac

ctx="Handbook check: before this edit, confirm you have read the docs/handbook chapter matching this change (see docs/handbook/llms.md). CSS/React/tests → conventions.md; component layout, links, icons, video → components.md; Contentful content model/parsers/renderer → contentful.md; App Router pages/API/hooks/forms/email → patterns.md; package scripts, CI, next.config, env, CSP, proxy, Cursor hooks → platform.md; analytics → integrations.md; sitemaps/OG → distribution.md; where a file lives (utils, api, lib, tests) → source-layout.md; machine setup, env pull, first run → root README.md. If this change shifts documented behavior or conventions, update that chapter in the same change. If you move, rename, or delete a file, grep docs/handbook/ and README.md for its old path in the same change — a stale path is a broken link and a wrong instruction. When you add a content type, field, validation value, script, workflow step, env var, or renderer branch, add it to the table that enumerates them rather than leaving the table short."

advise_context "$ctx"
exit 0
