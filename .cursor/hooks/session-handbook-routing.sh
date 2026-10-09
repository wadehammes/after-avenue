#!/usr/bin/env bash
set -euo pipefail

root="$(pwd)"
map_file="$root/docs/handbook/llms.md"

[ -f "$map_file" ] || exit 0

jq -n '{
  additional_context: "Handbook: docs/handbook/ — route all work via docs/handbook/llms.md before editing (AGENTS.md + .cursor/rules/ align). High-churn areas (video, contact mail, CI/types): docs/handbook/README.md. Per-edit: preToolUse handbook-pre-edit-reminder + postToolUse handbook-sync-nudge; end-of-turn: handbook-drift-check.mjs (broken links, stale pnpm refs, code-without-docs)."
}'

exit 0
