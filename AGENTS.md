# Agent instructions

Before **all** work in this repo—no matter how small—read **`docs/handbook/README.md`** and the handbook **chapter** that matches the task before you touch any code. This applies to everything: features, refactors, Contentful/CMS changes, App Router pages and API routes, CI or env, analytics, **and** smaller or seemingly mechanical edits (a className, a token, a single line). Use **`docs/handbook/llms.md`** for a compact task→chapter map (helpful for routing or for pasting into other tools). **Cursor** applies **`.cursor/rules/after-avenue-handbook.mdc`** automatically as a project rule.

Follow documented patterns.

**Keep the handbook accurate:** Whenever a change would make the handbook wrong or incomplete—new flows (CI, env, tags), moved files, scaffold or convention changes, Contentful/parser patterns, or anything a future reader would be misled by—update the relevant **`docs/handbook/*.md`** in the **same PR** when practical, or in a small follow-up right away. Do not leave docs stale on purpose.

**Testing (substantive work):** Follow [conventions.md → Non-negotiables](docs/handbook/conventions.md#non-negotiables-substantive-work-and-agents) — **TDD** (a failing spec before the production change, red for the right reason), **factories** for all domain test data, **one flat `describe`** per spec, and **backfill a page object and spec for any untested component you touch**. Do not implement first and backfill specs at the end. Survey what is missing before you start; the backfill is often bigger than the edit.

**Commits:** Use **`scripts/git-commit.sh`** (same flags as `git commit`) so `.githooks/commit-msg` runs. **One commit per PR** — squash before pushing. **No trailers**: `Co-authored-by:` and generated-by lines are rejected, including the ones agents add by default.

There is **no exemption for "small" changes.** A narrow edit (a className, a CSS token, a one-liner) still has to follow the documented conventions, so check the matching chapter first—do not assume you already know the pattern. The only edits that need no handbook pass are ones that touch no code or documented behavior at all (typos in prose, comments).
