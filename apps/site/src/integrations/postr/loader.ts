import type { Loader, LoaderContext } from 'astro/loaders'
import getPosts from '../../lib/posts'
import normalizeMf2 from '../../lib/normalize-mf2'
import { buildPostrMeta } from '../../lib/post-date'
import { isApiReachable } from '../../lib/api-gate'
import type { PostrLoaderConfig } from './types'
import { resolveRuntimeConfig } from './types'

/**
 * Creates a Postr content loader for Astro content collections.
 *
 * Uses the **object loader API** (`name` + `load({ store, logger, ... })`)
 * which is the recommended pattern for Astro 6 loaders. Each entry is stored
 * via `store.set({ id, data })` with the full normalised MF2 object as the
 * entry data.
 *
 * @remarks
 * **Config resolution:** Runtime values (`apiUrl`, `siteUrl`, etc.) are
 * resolved from (in order of precedence):
 *   1. Explicit fields in the `PostrLoaderConfig` argument
 *   2. Environment variables (`NEXT_PUBLIC_*` or `POSTR_*` prefix)
 *   3. Built-in defaults
 *
 * This means you can configure the loader entirely via the options object
 * without relying on any env vars — critical for future extraction to
 * `@postr/astro`.
 *
 * **Offline / unreachable behaviour:** When the API is unreachable (checked
 * via the shared `isApiReachable` gate), the loader logs a warning and
 * returns an empty collection. It does **not** fail the build.
 *
 * @example
 * ```ts
 * // src/content.config.ts — minimal setup (relies on env/defaults)
 * import { defineCollection } from 'astro:content'
 * import { postrLoader } from './integrations/postr'
 *
 * export const collections = {
 *   posts: defineCollection({
 *     loader: postrLoader({ limit: 10 }),
 *   }),
 * }
 * ```
 *
 * @example
 * ```ts
 * // Fully explicit — no env-var dependency
 * import { defineCollection } from 'astro:content'
 * import { postrLoader } from './integrations/postr'
 *
 * export const collections = {
 *   posts: defineCollection({
 *     loader: postrLoader({
 *       limit: 10,
 *       apiUrl: 'http://localhost:4000',
 *       siteUrl: 'https://example.com',
 *       authorName: 'Grace Hopper',
 *     }),
 *   }),
 * }
 * ```
 */
export function postrLoader(options: PostrLoaderConfig = {}): Loader {
  const { name: loaderName, ...loaderOptions } = options
  const cfg = resolveRuntimeConfig(options)

  return {
    name: loaderName ?? 'postr-loader',

    load: async (context: LoaderContext): Promise<void> => {
      const { store, logger } = context

      const { apiUrl, siteUrl, authorName, authorPhoto, devLimit, apiTimeout } = cfg
      const isDev =
        (typeof import.meta !== 'undefined' &&
          (import.meta as any).env?.DEV === true) ??
        process.env.NODE_ENV === 'development'

      // Gate: skip API call if backend is unreachable
      if (!(await isApiReachable(apiUrl))) {
        logger.warn('API unreachable — returning empty collection')
        return
      }

      try {
        const { limit = 10, showAll = false, ...queryRest } = loaderOptions

        // Dev mode: cap at devLimit to keep dev server startup fast.
        // Production uses the full configured limit.
        const effectiveLimit = isDev ? Math.min(limit, devLimit) : limit

        const timing = { start: performance.now(), end: 0 }

        // Use the configured apiTimeout for the full-corpus collection fetch.
        const rawPosts = await getPosts(
          { query: queryRest as Record<string, unknown>, limit: effectiveLimit, showAll },
          { apiUrl, timeout: apiTimeout }
        )

        timing.end = performance.now()

        if (!Array.isArray(rawPosts) || rawPosts.length === 0) {
          logger.info('No posts returned from API')

          if (isDev) {
            await pushDebug({
              request: { ...loaderOptions, apiUrl },
              response: [],
              normalized: [],
              status: 'empty',
              timing,
              apiUrl,
            })
          }
          return
        }

        // Normalise all posts first, attaching canonical _postr metadata.
        const normalizedPosts: Array<{ id: string; data: any; _sortDate: string }> = []
        for (const [index, rawPost] of rawPosts.entries()) {
          const normalized = normalizeMf2(rawPost, {
            authorName,
            siteUrl,
            authorPhoto,
            devMode: isDev,
            localUrl: 'http://localhost:4000',
            remoteUrl: siteUrl,
          })

          // Bake canonical post date metadata into the entry at load time
          // so routes don't each re-invent `created ?? published`.
          const postrMeta = buildPostrMeta(normalized)
          if (postrMeta) {
            normalized._postr = postrMeta
          }

          const rawUrl = normalized?.properties?.url?.[0] ?? ''
          const id = deriveEntryId(rawUrl, index)

          normalizedPosts.push({
            id,
            data: normalized,
            _sortDate: postrMeta?.date ?? '',
          })
        }

        // Sort by canonical date descending (newest first) so route-layer
        // iteration is deterministic. ISO 8601 strings sort lexicographically,
        // so localeCompare works. Entries missing a date sort to the end.
        normalizedPosts.sort((a, b) => {
          return b._sortDate.localeCompare(a._sortDate)
        })

        // Store entries via the DataStore API in sorted order
        for (const entry of normalizedPosts) {
          store.set({ id: entry.id, data: entry.data })
        }

        logger.info(`Loaded ${rawPosts.length} posts`)

        // Dev debug: push execution data to toolbar
        if (isDev) {
          await pushDebug({
            request: { ...loaderOptions, apiUrl },
            response: rawPosts,
            normalized: rawPosts.map((_: unknown, i: number) => ({
              id: deriveEntryId(
                normalizeMf2(rawPosts[i], {
                  authorName,
                  siteUrl,
                  authorPhoto,
                  devMode: isDev,
                  localUrl: 'http://localhost:4000',
                  remoteUrl: siteUrl,
                })?.properties?.url?.[0] ?? '',
                i
              ),
            })),
            status: 'success',
            timing,
            apiUrl,
          })
        }
      } catch (err) {
        logger.warn(
          `Failed to load posts: ${
            err instanceof Error ? err.message : String(err)
          }`
        )

        if (isDev) {
          await pushDebug({
            request: { ...loaderOptions, apiUrl },
            response: [],
            normalized: [],
            status: 'error',
            apiUrl,
            error: String(err),
          })
        }
      }
    },
  }
}

/**
 * Push debug data to the toolbar store — only called when `isDev` is true.
 * Dynamically imported so the toolbar module is tree-shaken from production builds.
 */
async function pushDebug(data: Record<string, unknown>): Promise<void> {
  try {
    const { push } = await import('./toolbar/debug-store')
    push(data)
  } catch {
    // Store not available (e.g. during early boot) — swallow silently
  }
}

/**
 * Derive a content-entry-safe ID from a post URL.
 *
 * Converts e.g. `https://grant.codes/notes/2025/03/15/1`
 * into `grant-codes-notes-2025-03-15-1`.
 *
 * Falls back to `post-<index>` when the URL is empty or unparseable.
 *
 * @param url — The post URL (from MF2 `properties.url`).
 * @param fallbackIndex — Numeric index used to generate a fallback ID.
 * @returns A filesystem-safe string suitable as a content entry ID.
 */
export function deriveEntryId(url: string, fallbackIndex: number): string {
  if (!url) return `post-${fallbackIndex}`

  try {
    // Strip protocol, collapse slashes and dots to hyphens
    return url
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '')
      .replace(/[./]/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  } catch {
    return `post-${fallbackIndex}`
  }
}
