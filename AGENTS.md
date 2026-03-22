# AGENTS.md — grant.codes

Instructions for AI agents and coding assistants working in this repository.

---

## Project Overview

This is the frontend for **grant.codes**, a personal IndieWeb website. It is built with Next.js (App Router) and communicates with a separate backend service for content storage and retrieval.

The site is **IndieWeb-first**: all content is stored as [Microformats2 (MF2)](https://microformats.org/wiki/microformats2) JSON, posted via [Micropub](https://micropub.spec.indieweb.org/), authenticated via [IndieAuth](https://indieauth.spec.indieweb.org/), and federated via [Webmention](https://webmention.net/).

---

## Architecture

Two separate services run the site:

| Service | Location | Description |
|---|---|---|
| **Frontend** | This repo (root) | Next.js 16 App Router, port 3000 |
| **Backend** | `backend/` | Express + Hono API server, port 4000 |

`backend/` is a **separate git repository** that lives alongside this one. It is listed in `.gitignore` and is not part of this repo's git history. Do not treat it as part of this package.

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
grant.codes/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root HTML shell; injects theme, IndieWeb <link> tags, PWA metadata
│   ├── (default)/              # Standard pages wrapped in <Container> (header + nav + footer)
│   │   ├── page.tsx            # Home page
│   │   ├── [typeOrYear]/       # Post-type archive (/notes) or year summary (/2023)
│   │   │   └── [month]/[day]/  # Full date-based archive routing
│   │   ├── category/
│   │   ├── search/[search]/
│   │   ├── feeds/
│   │   ├── contact/
│   │   ├── uses/
│   │   ├── websites/
│   │   └── pay/
│   ├── (article)/new/          # New post composer (Micropub write UI)
│   ├── (full-width)/           # Pages without Container wrapper
│   │   ├── about/              # Profile / CV
│   │   ├── where/              # Live location (fetches from Dawarich)
│   │   └── photos/             # Photo gallery
│   ├── api/
│   │   ├── last-location/      # Proxies Dawarich location API
│   │   ├── revalidate/         # On-demand ISR revalidation
│   │   └── pay/                # Stripe payment intent
│   ├── slides/                 # Reveal.js presentations
│   └── not-found.tsx
├── backend/                    # Separate git repo — Express + Hono API (port 4000)
├── background-generator/       # Standalone Vite app for generating site backgrounds
├── bin/                        # CLI scripts
│   ├── generate-monthly-data.js  # Pulls posts / GPS / body data → data/monthly/
│   └── dawarich-to-immich.js
├── components/
│   ├── Post/                   # Core post renderer — handles all MF2 post types
│   ├── PostList/               # List, gallery, timeline, map views
│   ├── Container/              # Site shell: Header, Footer, Nav, Pagination
│   ├── About/                  # Profile, skills, presence sections
│   ├── DataSummary/            # Year-in-review charts and visualisations
│   └── ...                     # UI primitives: Card, Button, Icon, Toast, Tooltip
├── css/
│   ├── base/                   # Reset, fonts, typography, forms, layout
│   ├── components/             # Per-component styles
│   ├── pages/                  # Per-page styles (some CSS Modules)
│   └── util/                   # Mixins and utilities
├── data/
│   └── monthly/                # Auto-generated JSON — DO NOT edit manually
├── lib/
│   ├── get/                    # Data-fetching helpers (posts, categories, years, metadata)
│   ├── hooks/                  # Custom React hooks
│   ├── normalize-mf2.js        # Cleans and deduplicates MF2 post data
│   ├── auth.js                 # IndieAuth client instance
│   └── micropub.js             # Micropub client instance
└── public/                     # Static assets
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
npm run dev      # Start Next.js dev server (port 3000)
npm run build    # Production build
npm start        # Start production server
```

The backend is a separate service. To run the full stack locally, start the backend independently from `backend/`.

Environment variables are read from `.env.local`. Key variables:
- `NEXT_PUBLIC_API_URL` — URL of the backend API (e.g. `http://localhost:4000`)

---

## Gotchas

- **`data/monthly/`** is auto-generated by the GitHub Actions workflow (`.github/workflows/montly-data.yml`) on the 1st of each month. Do not edit these files manually.
- **`backend/`** is a separate git repository and separate Node service. It is gitignored from this repo. Do not assume changes here are reflected there or vice versa.
- **`moment`** is the date library in use. Do not introduce `dayjs`, `date-fns`, or `luxon`.
- **`strict: false`** in `tsconfig.json` is deliberate. The codebase predates strict mode adoption; turning it on will generate hundreds of errors.
- **SVGs** are inlined via `svg-inline-loader` — import them as React components, not as image URLs.
- **`background-generator/`** is a standalone Vite app with its own `package.json`. Run it independently; it is not part of the Next.js build.
- The `.well-known/` path is redirected to `fed.brid.gy` for ActivityPub federation — do not add local handlers under that path.
