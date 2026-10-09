#!/usr/bin/env bash

hook_input() {
  INPUT="$(cat)"
}

project_dir() {
  local from_input
  from_input="$(printf '%s' "$INPUT" | jq -r '.cwd // empty')"
  if [ -n "$from_input" ]; then
    printf '%s' "$from_input"
  else
    pwd
  fi
}

tool_file_path() {
  printf '%s' "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""'
}

tool_added_text() {
  printf '%s' "$INPUT" | jq -r '
    [
      .tool_input.new_string?,
      .tool_input.content?,
      .tool_input.contents?,
      .tool_input.string?,
      (.tool_input.edits[]?.new_string)
    ]
    | map(select(. != null))
    | join("\n")
  '
}

abs_path() {
  local file="$1"
  local root
  root="$(project_dir)"
  case "$file" in
    /*) printf '%s' "$file" ;;
    *) printf '%s' "$root/$file" ;;
  esac
}

deny_tool() {
  local reason="$1"
  jq -n --arg r "$reason" '{
    permission: "deny",
    user_message: $r,
    agent_message: $r
  }'
}

advise_context() {
  local ctx="$1"
  jq -n --arg c "$ctx" '{ additional_context: $c }'
}

run_pnpm() {
  if [ -x "${HOME}/.local/bin/mise" ]; then
    "${HOME}/.local/bin/mise" exec -- pnpm "$@"
  elif command -v mise >/dev/null 2>&1; then
    mise exec -- pnpm "$@"
  elif command -v pnpm >/dev/null 2>&1; then
    command pnpm "$@"
  else
    return 127
  fi
}

# Map a changed repo-relative path to handbook chapter filenames (space-separated, unique).
handbook_chapters_for_path() {
  local file="$1"
  local chapters=()

  case "$file" in
    docs/handbook/*)
      return 0
      ;;
    .cursor/hooks/* | .cursor/hooks.json | AGENTS.md)
      chapters+=("platform.md" "README.md")
      ;;
    vercel.json)
      chapters+=("platform.md")
      ;;
    .jest/*)
      chapters+=("conventions.md" "platform.md")
      ;;
    jest.config.ts | jest.config.js | jest.config.mjs)
      chapters+=("platform.md" "conventions.md")
      ;;
    next.config.ts | next.config.js | next.config.mjs)
      chapters+=("platform.md")
      ;;
    src/tests/factories/*)
      chapters+=("conventions.md")
      ;;
    src/tests/utils/handbookTestRules.ts)
      chapters+=("conventions.md" "platform.md")
      ;;
    *.spec.ts | *.spec.tsx | *.test.ts | *.test.tsx)
      chapters+=("conventions.md")
      ;;
    *.module.css)
      chapters+=("conventions.md")
      ;;
    src/@types/*)
      chapters+=("conventions.md" "platform.md")
      ;;
    src/contentful/*)
      chapters+=("contentful.md")
      ;;
    src/app/api/*)
      chapters+=("patterns.md" "platform.md" "integrations.md")
      ;;
    src/app/*)
      chapters+=("patterns.md")
      ;;
    src/components/LazyReactPlayer/* | src/components/FeaturedWork/* | src/components/WorkCard/* | src/components/WorkHeroVideo/* | src/components/EditorsBackgroundVideo/* | src/components/WorkPage/*)
      chapters+=("patterns.md" "components.md")
      ;;
    src/components/ContactForm/* | src/components/forms/* | src/components/Input/* | src/components/TextArea/* | src/components/Checkbox/*)
      chapters+=("components.md" "patterns.md")
      ;;
    src/components/*)
      chapters+=("components.md")
      ;;
    src/hooks/* | src/context/*)
      chapters+=("patterns.md" "source-layout.md")
      ;;
    src/emails/*)
      chapters+=("patterns.md" "source-layout.md")
      ;;
    src/api/*)
      chapters+=("patterns.md" "source-layout.md")
      ;;
    src/utils/videoPlayerConfig.ts | src/utils/emailHelpers.ts | src/utils/helpers.ts | src/utils/recaptcha.ts | src/utils/spamDetection.ts | src/utils/rateLimit.ts)
      chapters+=("patterns.md" "platform.md" "source-layout.md")
      ;;
    src/utils/*)
      chapters+=("source-layout.md" "conventions.md")
      ;;
    src/lib/forms/*)
      chapters+=("patterns.md" "source-layout.md")
      ;;
    src/lib/*)
      chapters+=("source-layout.md" "integrations.md" "distribution.md")
      ;;
    src/ui/*)
      chapters+=("source-layout.md" "components.md")
      ;;
  esac

  if [ "${#chapters[@]}" -eq 0 ]; then
    chapters+=("conventions.md")
  fi

  printf '%s\n' "${chapters[@]}" | awk '!seen[$0]++' | tr '\n' ' '
}
