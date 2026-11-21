# AGENTS.md — grant.codes

Instructions for AI agents and coding assistants working in this repository.

---

## Project Overview

This is the **grant.codes** monorepo. It contains both the frontend and backend services for the grant.codes IndieWeb website, managed as a pnpm workspace.

The site is **IndieWeb-first**: all content is stored as [Microformats2 (MF2)](https://microformats.org/wiki/microformats2) JSON, posted via [Micropub](https://micropub.spec.indieweb.org/), authenticated via [IndieAuth](https://indieauth.spec.indieweb.org/), and federated via [Webmention](https://webmention.net/).

---

## Architecture

Two packages exist in this repo, both run as services:

| Service | Location | Description |
|---|---|---|
| **Frontend** | `apps/site` | Astro on-demand site (dev server port 3000; rendered by the API in production) |
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

**Deployment:** one container, built by Railpack from the root `railpack.json`. The image builds only the API. `pnpm start` builds the site (`@astrojs/node` middleware mode), so its `NEXT_PUBLIC_*` values come from the runtime environment, then starts the API. After its own routes and the site's static files (`apps/site/dist/client`), the API hands every other request to the site's handler, which renders it from the postr SQLite database through the `postrLiveLoader` collection in `apps/site/src/live.config.ts`. New posts appear without a rebuild: `lib/archive.ts` caches the post list until the database file changes. The API also implements the rules the Next site had in `next.config.js` (`apps/api/src/index.ts`):

| Rule | Type |
|---|---|
| `where.is.grant.codes /` → `/where/` | Host-based rewrite |
| `who.is.grant.codes /` → `/about/` | Host-based rewrite |
| `pay.grant.codes /` → `/pay/` | Host-based rewrite |
| `/.well-known/(.*)` → `https://fed.brid.gy/.well-known/$1` | Redirect (307) |
| `Access-Control-Allow-Origin: *`, including `/fonts/` | CORS header (global `cors()`) |

**API route status:**

| Route | Decision |
|---|---|
| `POST /api/revalidate`, `POST /api/deploy-webhook` | Retired. Pages render per request, so publishing needs no revalidation or rebuild. |
| `GET /api/last-location` | Active in `apps/api`. Returns live location from Dawarich proxy, or `{ location: false }` if unavailable. |
| `POST /api/pay` | Retired for now. Payments are disabled and Astro pay pages are static. If payments return later, implement a new route in `apps/api`. |

---

## Tech Stack

- **Framework:** Astro 5
- **UI:** Astro components
- **Language:** TypeScript + JavaScript (mixed; `allowJs: true`, `strict: false`, `strictNullChecks: true`)
- **Styling:** SCSS + CSS Modules
- **Node:** 22 (see `.nvmrc`)
- **Module format:** ESM (`"type": "module"`)
- **Date library:** `moment` (do not introduce dayjs or date-fns)
- **Theming:** `@grantcodes/ui/styles/themes/grantcodes.css` — daily CSS variable themes imported in the root layout

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
│   │   ├── tsconfig.json            #   strict TS config
│   │   └── package.json             #   `@grant.codes/api`
│   ├── site/                        # Astro 5 frontend (port 3000) — primary
│   │   ├── src/                     #   Astro components, pages, layouts
│   │   ├── public/                  #   Static assets
│   │   ├── data/                    #   Generated monthly JSON, static data
│   │   ├── bin/                     #   CLI scripts (generate-monthly-data)
│   │   ├── astro.config.ts         #   Astro config
│   │   ├── tsconfig.json           #   TS config
│   │   └── package.json            #   `@grant.codes/site`

├── background-generator/            # Standalone Vite app for generating site backgrounds
├── .github/workflows/
│   └── montly-data.yml              # Monthly data generation workflow
├── pnpm-workspace.yaml              # Workspace package config + native-module allowlist
├── railpack.json                    # Deploy config (Railpack on Coolify)
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

CSS theming is provided by `@grantcodes/ui/styles/themes/grantcodes.css`, imported in the root layout (`src/layouts/Layout.astro`).

### Rendering

Pages that read posts render on demand and validate their own params, returning a 404 for an unknown type, year, category or page number. Pages that don't read posts (`about`, `contact`, `uses`, `websites`, `pay`, `slides`, `new`, `where`) opt into prerendering. Keep the subdomain rewrite targets (`/where/`, `/about/`, `/pay/`) prerendered, because the API serves them as static files.

### Image Optimization

Images from `backend.grant.codes` are served directly as static references from Astro. Image caching (7-day minimum, `minimumCacheTTL: 604800`) is configured at the deployment/CDN layer. Do not add external image proxy services.

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
npm run dev       # Start Astro + API dev servers
npm run dev:api   # Start API server (port 4000)
npm run dev:site  # Start Astro dev server (port 3000)
npm run build     # Build both apps (site then api)
npm run build:api # Build only the backend
npm start         # Build the site, then serve it and the API (production)
npm run start:api # Start production API server
npm test          # Run API tests
```

The backend is a separate service. To run the full stack locally in separate terminals:

```bash
# Terminal 1: API server
npm run dev:api

# Terminal 2: Frontend dev server (Astro)
npm run dev
```

Environment variables:
- **Root `.env`** — shared/public vars loaded by both apps (API URL, public env vars)
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
- **Native modules** (`canvas`, `sharp`) are allowed to build via `pnpm-workspace.yaml` `allowBuilds`. Both install prebuilt binaries with their libraries bundled, so the image needs no apt packages. If a new native dep is added, list it in `pnpm-workspace.yaml` `allowBuilds`; if it compiles from source, add its packages to `railpack.json` (`buildAptPackages`, and `deploy.aptPackages` for runtime libraries).
- **`strict: false`** in `apps/site/tsconfig.json` is intentional — do not enable it. The backend (`apps/api/tsconfig.json`) uses `strict: true` — keep it that way.
- **`background-generator/`** is a standalone Vite app with its own `package.json`. Run it independently; it is not part of the Astro or API build.
- The `.well-known/` path is redirected to `fed.brid.gy` for ActivityPub federation — do not add local handlers under that path.
