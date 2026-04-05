# After Avenue

Site powered by Next.js / TypeScript / CSS Modules using Contentful CMS.

## Prerequisites / recommendations

- Install ZSH — https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH#how-to-install-zsh-on-many-platforms
- A nice framework with themes for ZSH — https://ohmyz.sh/

## Development setup

- Install asdf — https://asdf-vm.com/guide/getting-started.html (see `.tool-versions` for which plugins to add)

Run asdf:

```bash
asdf install
```

Run pnpm:

```bash
pnpm install
```

### Download env vars

Install the Vercel CLI — https://vercel.com/cli

```bash
pnpm add -g vercel
```

Run:

```text
vercel link
```

Follow the setup steps (authenticate your Vercel user and link this repo to the **After Avenue** Vercel project). If you do not have access to the team on Vercel, contact the project maintainers.

Pull env vars after you are linked:

```text
vercel env pull
```

Run the dev server:

```bash
pnpm dev
```

The dev server listens on **http://localhost:3005** (see `package.json`).

## Development and deployment

Deployment is handled via **Vercel**. Each PR typically gets a preview deployment that updates with new commits. Exact project URL and access policies are configured in your Vercel team settings.

### Default branch is `staging`

To develop, create a feature / chore / bug branch off of `staging`. Merge work via PR into `staging` for integration; staging is served at **https://staging.afteravenue.com** (see `envUrl()` in `src/utils/helpers.ts` for how environments map).

To create a production release, create a tag sequential to the latest. Tags should be named `vX.X.X` — check **Releases** on this GitHub repo for the latest version or run `git tag`. That kicks off the release workflow, deploys production, and can attach changelog notes between tags.

Steps:

1. Check out `staging` and pull the latest changes.
2. Run `make release` with the tag name:

```bash
make release tag=vX.X.X
```

Releases are only available to Vercel users with appropriate roles on the project.

### Component creation

We have a script to scaffold a new component under `src/components/`, with the files we use for UI, tests, and factories (see **`docs/handbook/components.md`**).

```bash
pnpm scaffold <ComponentName>
```

`<ComponentName>` must be **PascalCase** (e.g. `pnpm scaffold PromoBanner`). For **Contentful-backed** components, treat the output as a starting point only—replace stub interfaces with parser types and wire **ContentRenderer** per **`docs/handbook/contentful.md`**.

### Adding new environment keys

**Vercel first:** Add every new variable in the Vercel project’s **Environment variables** for each target that needs it (Preview, Production, Development if you use it). Preview and production builds read from Vercel; they do not get values from committed `.env` files.

Then update the repo and local setup:

1. **[`next.config.ts`](./next.config.ts)** — add the key to the `env` block when it should be exposed to the client or wired like existing entries.
2. **`.env.local`** — your local value (not committed).
3. **`.env.sample`** (if maintained) — key name only, no secrets, so others know what to define.
4. Run **`vercel env pull`** when you want your local file to match Vercel after the dashboard was updated.

### Managing package updates

Instead of cherry-picking each Dependabot PR when you want a broad upgrade:

1. Open a new branch, e.g. `git checkout -b package-updates-<date>` (use today’s date).
2. Run `pnpm up --L --i`.
3. Select packages to upgrade (space to toggle, arrows to move).
4. Commit and open a PR.
5. After CI and preview look good, request review.

### Testing

We use Jest and the **page object** pattern described in **`docs/handbook/conventions.md`**. Utility modules often have colocated `*.spec.ts` files (e.g. under `src/utils/`).

The custom `render` wrapper lives in [`src/tests/testUtils.tsx`](./src/tests/testUtils.tsx).

## Linting and formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

- To lint the codebase:

  ```sh
  pnpm lint
  ```

- To auto-format the codebase:

  ```sh
  pnpm format
  ```

## After Avenue handbook

The handbook lives under [`docs/handbook/`](./docs/handbook/). It is the canonical place for how this repo is structured, how we write code and tests, and how Contentful and the app fit together. Read it when onboarding, touching an unfamiliar area, or opening a PR and you want to match existing patterns.

The handbook is **markdown only** and is meant for humans and tooling alike. It should stay **in sync with the codebase**: when architecture or conventions change, update the relevant file under `docs/handbook/` in the same change (or a follow-up) so the next person is not misled.

**Entry point:** [`docs/handbook/README.md`](./docs/handbook/README.md) — short overview and an index table linking to every chapter.

**Agents and automation:** [AGENTS.md](./AGENTS.md) (defaults for AI assistants). In Cursor, project rules live under [`.cursor/rules/`](./.cursor/rules/). For custom GPTs or other tools without Cursor, use the task map in [`docs/handbook/llms.md`](./docs/handbook/llms.md).

### Suggested reading order

- **New to the project:** [architecture.md](./docs/handbook/architecture.md) (stack and data flow), then [conventions.md](./docs/handbook/conventions.md) (TypeScript, React, CSS, tests), then skim [patterns.md](./docs/handbook/patterns.md) for the App Router, API routes, and metadata.
- **Adding or changing UI:** [components.md](./docs/handbook/components.md) (folder layout, **`pnpm scaffold`**, test IDs), plus [conventions.md](./docs/handbook/conventions.md) (CSS Modules, React rules).
- **CMS work (Contentful):** [contentful.md](./docs/handbook/contentful.md) end to end — generated types, getters, parsers, sections vs content blocks, **ContentRenderer**, and the checklist for a new CMS-driven block.
- **Pages, data fetching, or SEO:** [patterns.md](./docs/handbook/patterns.md) (Server Components, React Query, Route Handlers, JSON-LD) and the architecture doc’s data-flow section.
- **CI, env, draft preview, or `proxy.ts`:** [platform.md](./docs/handbook/platform.md).
- **Google Analytics and the data layer:** [integrations.md](./docs/handbook/integrations.md).
- **Sitemaps and public XML output:** [distribution.md](./docs/handbook/distribution.md).
- **Interfaces and navigating `src/utils` / `src/lib`:** [source-layout.md](./docs/handbook/source-layout.md).

### What each document covers

| Document | Purpose |
|----------|---------|
| [**architecture.md**](./docs/handbook/architecture.md) | Tech stack, **directory map**, **App Router** (`src/app`), data flow (Contentful → parsers → SectionRenderer / ContentRenderer), **Next.js / Biome / branching**. |
| [**conventions.md**](./docs/handbook/conventions.md) | **TypeScript**, **React**, **Biome**, **CSS** (CSS Modules, tokens, mobile-first), **testing**, **test IDs**, **accessibility**, **comments**, **editorconfig**, **React Query** hook rules. |
| [**contentful.md**](./docs/handbook/contentful.md) | **Generated types** (`pnpm types:contentful`), **getters** vs **parsers**, **sections vs content blocks**, **ContentRenderer**, **Rich Text**, **Contentful client**. |
| [**components.md**](./docs/handbook/components.md) | Component folders, **`pnpm scaffold`**, **test IDs**, exports, **dynamic imports**, links. |
| [**patterns.md**](./docs/handbook/patterns.md) | **Server Components**, **React Query** (mutations / queries), **`src/api`**, **forms**, **metadata / JSON-LD**, **`next/dynamic`**. |
| [**platform.md**](./docs/handbook/platform.md) | **GitHub CI** (`tsc`, Biome, Jest), **`pnpm` scripts**, **`next.config` env** and redirects, **draft / disable-draft APIs**, **`src/proxy.ts`**. |
| [**integrations.md**](./docs/handbook/integrations.md) | **Google Analytics** (`@next/third-parties`), **`dataLayer`** helpers in `src/lib/analytics.ts`. |
| [**distribution.md**](./docs/handbook/distribution.md) | **Sitemap** generation (`make sitemap`, `public/sitemap.xml`), **robots** and related App Router metadata. |
| [**source-layout.md**](./docs/handbook/source-layout.md) | **`src/interfaces`**, **`src/utils`** module map, **`src/lib`**. |
| [**llms.md**](./docs/handbook/llms.md) | **Task → chapter** map and copy-paste blurb for custom GPTs and other tools. |

### Relationship to this README

This README stays focused on **machine setup**, **deploy / release**, env keys, package upgrades, and **Biome commands**. Deeper rules (serialization, parsers, hook structure) belong in the handbook. If you add a recurring workflow everyone should follow, add a short pointer here and the full explanation under `docs/handbook/`.

## Other resources / documentation

- Next.js — https://nextjs.org/docs/getting-started
- Contentful — https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
- pnpm — https://pnpm.io/
- Vercel — https://vercel.com/docs
