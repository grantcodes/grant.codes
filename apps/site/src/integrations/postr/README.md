# @grant.codes/postr → Extraction to `@postr/astro`

This directory holds the Astro content-collection integration for the Postr
MF2 API. It is designed to be extracted into a standalone npm package.

## Status

| Concern | Wave 3 (current) |
|---|---|
| Config surface | ✅ Explicit `PostrRuntimeConfig` / `PostrIntegrationConfig` types |
| Env-var decoupling | ✅ `resolveRuntimeConfig()` checks `process.env` + `import.meta.env` |
| Cross-platform temp | ✅ `os.tmpdir()` instead of `/tmp/opencode` |
| Public API JSDoc | ✅ All exports documented |
| Repo-local imports | ⏳ Still imports from `src/lib/{posts,normalize-mf2,api-gate,post-date}` |

## Extraction checklist

Before publishing as `@postr/astro`, the following must happen:

### 1. Extract the MF2 helpers

The four modules imported from `../../lib/` need to become either:

- Part of a shared `@postr/core` package (recommended — they are useful beyond
  Astro), or
- Inlined / re-exported within the package.

| Import | Role |
|---|---|
| `getPosts()` | Fetches/search from the Postr API |
| `normalizeMf2()` | Cleans & deduplicates raw MF2 responses |
| `isApiReachable()` / `resetApiGateCache()` | Cached health-check gate |
| `buildPostrMeta()` | Extracts canonical post-date metadata |

**Suggested approach:** Extract these into `@postr/core` (or co-locate them in
the future `@postr/astro` package under `src/lib/`). Each helper has zero or
trivial Astro-specific dependencies.

### 2. Publish cycle

1. Create `packages/postr-astro/` at monorepo root
2. Copy these files into it
3. Rewrite `../../lib/*` imports to `@postr/core` (or local `./lib/*`)
4. Add `package.json` with `name: "@postr/astro"`, Astro peer dep
5. Update workspace references in the site
6. Publish

### 3. Config migration

Once extracted, the `NEXT_PUBLIC_*` env-var fallbacks should be deprecated in
favour of `POSTR_*` prefixes only (already supported as a fallback). The
`resolveRuntimeConfig()` helper already checks both — the NEXT_PUBLIC checks
can be dropped in a future major.

### 4. Toolbar file store

The `debug-store.ts` temp-file path uses `os.tmpdir()` + a static namespace.
For the extracted package, consider making the temp namespace configurable or
using an in-memory store with Astro's new shared-state APIs once available.

## Current file map

```
postr/
├── index.ts          # Integration entry point + re-exports
├── types.ts          # All public types + config resolvers
├── loader.ts         # Build-time object loader (postrLoader)
├── live-loader.ts    # Live loader (postrLiveLoader)
├── toolbar/
│   ├── index.ts      # Dev toolbar app UI
│   └── debug-store.ts # Server-side execution store
└── README.md         # This file
```
