# AGENTS.md — grant.codes

Instructions for AI agents and coding assistants working in this repository.

---

## Project Overview

This is the **grant.codes** monorepo. It contains both the frontend and backend services for the grant.codes IndieWeb website, managed as a pnpm workspace.

The site is **IndieWeb-first**: all content is stored as [Microformats2 (MF2)](https://microformats.org/wiki/microformats2) JSON, posted via [Micropub](https://micropub.spec.indieweb.org/), authenticated via [IndieAuth](https://indieauth.spec.indieweb.org/), and federated via [Webmention](https://webmention.net/).

---

## Architecture

Two separate services run the site, both in this repo:

| Service | Location | Description |
|---|---|---|
| **Frontend** | `apps/web` | Next.js 16 App Router, port 3000 |
| **Backend** | `apps/api` | Express + Hono API server, port 4000 |

The backend was imported into `apps/api` as a one-time snapshot from the previously standalone `backend.grant.codes` repository.

**Data flow:**

```
Page component
  → lib/get/posts.js
  → POST NEXT_PUBLIC_API_URL/api/search  (backend, port 4000)
  → PouchDB / CouchDB via @postr/core
  → MF2 JSON response
  → lib/normalize-mf2.js  (clean / deduplicate)
  → components/Post  (render by post type)
```

**ISR:** Pages use `revalidate: 60 * 60 * 12` (12h). On-demand revalidation is triggered via `POST /api/revalidate`.

**Subdomain routing** is handled in `next.config.js` rewrites:

| Subdomain | Resolves to |
|---|---|
| `where.is.grant.codes` | `/where` |
| `who.is.grant.codes` | `/about` |
| `pay.grant.codes` | `/pay` |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Language:** TypeScript + JavaScript (mixed; `allowJs: true`, `strict: false`, `strictNullChecks: true`)
- **Styling:** SCSS + CSS Modules
- **Node:** 22 (see `.nvmrc`)
- **Module format:** ESM (`"type": "module"`)
- **Date library:** `moment` (do not introduce dayjs or date-fns)
- **Theming:** `@grantcodes/themer` — generates daily CSS variable themes injected in the root layout

---

## Project Structure

```
grant.codes/                         # pnpm workspace root
├── apps/
│   ├── api/                         # Express + Hono backend (port 4000)
│   │   ├── src/                     #   TypeScript source
│   │   ├── tests/                   #   Node test runner tests
│   │   ├── static/                  #   Static assets served by the API
│   │   ├── dist/                    #   Compiled JS output
│   │   ├── .env.example             #   Backend-only env template
│   │   ├── nixpacks.toml            #   Deploy config (Nixpacks)
│   │   ├── tsconfig.json            #   strict TS config
│   │   └── package.json             #   `@grant.codes/api`
│   └── web/                         # Next.js 16 frontend (port 3000)
│       ├── app/                     #   App Router pages/layouts/API routes
│       │   ├── layout.tsx           #   Root HTML shell; theme, IndieWeb <link> tags, PWA metadata
│       │   ├── (default)/           #   Standard pages (home, archive, categories, search, etc.)
│       │   │   ├── page.tsx         #   Home page
│       │   │   ├── [typeOrYear]/    #   Post-type archive (/notes) or year summary (/2023)
│       │   │   │   └── [month]/[day]/
│       │   │   ├── category/
│       │   │   ├── search/[search]/
│       │   │   ├── feeds/
│       │   │   ├── contact/
│       │   │   ├── uses/
│       │   │   ├── websites/
│       │   │   └── pay/
│       │   ├── (article)/new/       #   New post composer (Micropub write UI)
│       │   ├── (full-width)/        #   Pages without Container wrapper
│       │   │   ├── about/
│       │   │   ├── where/
│       │   │   └── photos/
│       │   ├── api/                 #   Next route handlers (revalidate, pay, last-location)
│       │   ├── slides/              #   Reveal.js presentations
│       │   └── not-found.tsx
│       ├── components/              #   React components (Post, PostList, Container, About, etc.)
│       ├── css/                     #   SCSS base, components, pages, utilities
│       ├── lib/                     #   Data fetching, auth, Micropub client, MF2 normalizer
│       ├── public/                  #   Static assets served by Next.js
│       ├── data/monthly/            #   Auto-generated JSON — DO NOT edit manually
│       ├── bin/                     #   CLI scripts (generate-monthly-data, dawarich-to-immich)
│       ├── next.config.js           #   Subdomain rewrites, image config, SVG loader
│       ├── tsconfig.json            #   Next.js TS config (strict: false)
│       ├── nixpacks.toml            #   Deploy config (Nixpacks)
│       └── package.json             #   `@grant.codes/web`
├── background-generator/            # Standalone Vite app for generating site backgrounds
├── .github/workflows/
│   └── montly-data.yml              # Monthly data generation workflow
├── pnpm-workspace.yaml              # Workspace package config + native-module allowlist
├── nixpacks.toml                    # Root deploy config (orchestrates entire monorepo build)
├── AGENTS.md                        # This file
└── package.json                     # Root workspace orchestration scripts
```

---

## Key Concepts

### MF2 Post Types

All posts are MF2 JSON with a `type` of `h-entry`. The post *type* is derived from which properties are present:

| Post type | Key property |
|---|---|
| article | `name` + `content` |
| note | `content` (no name) |
| photo | `photo` |
| video | `video` |
| like | `like-of` |
| reply | `in-reply-to` |
| repost | `repost-of` |
| bookmark | `bookmark-of` |
| checkin | `checkin` |
| event | `start` / `end` |
| rsvp | `rsvp` |

Post type detection and rendering lives in `components/Post/`.

### normalize-mf2.js

Raw MF2 from the backend goes through `lib/normalize-mf2.js` before rendering. This handles:
- Deduplication of array properties
- Author injection
- Reply/syndication cleanup

Always pass posts through this before rendering.

### Daily Theming

`@grantcodes/themer` generates CSS custom properties based on the day of the week. The theme is injected inline in `app/layout.tsx` (server-side) and a `beforeInteractive` script prevents flash-of-wrong-theme on the client.

### Static Params

Year/type archive pages use `generateStaticParams()` to pre-render routes at build time. `lib/get/years.ts` and `lib/get/post-types.ts` provide the param values.

### Image Optimization

Images from `backend.grant.codes` are optimized by Next.js automatically. The `images.remotePatterns` config in `next.config.js` is locked to `backend.grant.codes` only. Cached images expire after 7 days (`minimumCacheTTL: 604800`). Do not add external image proxy services.

---

## Coding Conventions

### TypeScript / JavaScript

- New files should use TypeScript (`.ts` / `.tsx`)
- `strict: false` is intentional — do not enable it
- `strictNullChecks: true` is enabled — handle nulls explicitly
- Absolute imports from the project root are supported: `import getPosts from 'lib/get/posts'`

### React

- Components are React Server Components by default
- Only add `'use client'` when the component requires browser APIs, event handlers, or React hooks that don't work server-side
- Keep client boundaries as far down the tree as possible

### Formatting (Prettier)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

### CSS

- Use **BEM naming**: `block`, `block--modifier`, `block__element`
- SCSS files live in `css/` and are imported globally or per-component
- Use CSS Modules (`.module.scss`) for page-level styles that should be scoped
- Do not use inline styles or CSS-in-JS

### Naming

- Components: PascalCase
- Files/directories: kebab-case (except component directories which match the component name)
- Hooks: `use-kebab-case.js`

---

## Coding Preferences

- **KISS over cleverness** — prefer the simplest solution that works
- **YAGNI** — don't add abstractions or features that aren't needed yet
- **DRY** — but don't abstract prematurely; duplication is better than the wrong abstraction
- **Readability over performance** — until profiling proves a bottleneck
- **Semantic HTML** — use the right element for the job; avoid unnecessary `<div>` wrappers
- **Accessibility** — correct roles, labels, and keyboard navigation are not optional
- Comments only for non-obvious logic — do not restate what the code already says
- Avoid introducing new dependencies for things achievable with what's already installed

---

## Dev Commands

Run from the repo root:

```bash
npm run dev       # Start Next.js dev server (port 3000)
npm run dev:api   # Start API server (port 4000)
npm run build     # Build both apps (web then api)
npm run build:web # Build only the frontend
npm run build:api # Build only the backend
npm start         # Start production Next.js server
npm run start:api # Start production API server
npm test          # Run API tests
```

The backend is a separate service. To run the full stack locally in separate terminals:

```bash
# Terminal 1: API server
npm run dev:api

# Terminal 2: Frontend dev server
npm run dev
```

Environment variables:
- **Root `.env`** — shared/public vars loaded by both apps (Next.js public env vars, API URL)
- **`apps/web/.env`** — frontend-specific env (overrides root `.env`)
- **`apps/api/.env.local`** — backend-specific secrets (not tracked; copy from `apps/api/.env.example`)
- The API dev script loads `../../.env` (root) and `.env.local` (app-local) via `--env-file` flags.

Key variables:
- `NEXT_PUBLIC_API_URL` — URL of the backend API (defaults to `https://backend.grant.codes` in production, `http://localhost:4000` locally)

---

## Gotchas

- **`data/monthly/`** is auto-generated by the GitHub Actions workflow (`.github/workflows/montly-data.yml`) on the 1st of each month. Do not edit these files manually.
- **`apps/api`** was imported as a one-time snapshot from the previously standalone `backend.grant.codes` repo. No git history was preserved.
- **`moment`** is the date library in use. Do not introduce `dayjs`, `date-fns`, or `luxon`.
- **pnpm workspace** is the monorepo manager. The root does not have a `package-lock.json`; only `pnpm-lock.yaml` is tracked. Use `pnpm install` or `npm install` (which pnpm intercepts) — never `npm ci`.
- **Native modules** (`canvas`, `sharp`) are allowed to build via `pnpm-workspace.yaml` `allowBuilds`. The root and per-app `nixpacks.toml` files supply required system packages (`cairo`, `pango`, `python312`, etc.). If a new native dep is added, it must be listed in both `pnpm-workspace.yaml` `allowBuilds` and the relevant `nixpacks.toml` `aptPkgs`/`nixPkgs`.
- **`strict: false`** in `apps/web/tsconfig.json` is deliberate. The frontend predates strict mode adoption; turning it on will generate hundreds of errors. The backend (`apps/api/tsconfig.json`) uses `strict: true` — keep it that way.
- **SVGs** are inlined via `svg-inline-loader` — import them as React components, not as image URLs.
- **`background-generator/`** is a standalone Vite app with its own `package.json`. Run it independently; it is not part of the Next.js build.
- The `.well-known/` path is redirected to `fed.brid.gy` for ActivityPub federation — do not add local handlers under that path.
