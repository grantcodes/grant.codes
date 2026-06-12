import type {
  LiveLoader,
  LoadEntryContext,
  LoadCollectionContext,
} from 'astro/loaders'

/** @internal — mirrors `CacheHint` from Astro's content types. */
interface CacheHint {
  tags?: Array<string>
  lastModified?: Date
}
import getPosts from '../../lib/posts'
import normalizeMf2 from '../../lib/normalize-mf2'
import { isApiReachable } from '../../lib/api-gate'
import { deriveEntryId } from './loader'
import type {
  PostrEntryFilter,
  PostrCollectionFilter,
  PostrRuntimeConfig,
} from './types'
import { PostrLoaderError, resolveRuntimeConfig } from './types'

/**
 * Creates a Postr **live loader** compatible with Astro's `defineLiveCollection`.
 *
 * Unlike the build-time `postrLoader`, this loader:
 * - Loads single entries via `loadEntry()` with typed filter (`slug` | `url`)
 * - Loads collections via `loadCollection()` with typed filters
 *   (`type`, `postType`, `startDate`, `endDate`, `limit`, `showAll`)
 * - Returns structured results with `error` objects instead of throwing
 * - Provides `cacheHint` metadata (tags + lastModified) for each result
 *
 * @remarks
 * **Config resolution:** Pass an optional `PostrRuntimeConfig` to set
 * `apiUrl`, `siteUrl`, `authorName`, etc. explicitly. Without it, values
 * are resolved from env vars (`NEXT_PUBLIC_*`, `POSTR_*`) or built-in
 * defaults. See {@link resolveRuntimeConfig} for details.
 *
 * Does **not** mutate or persist to any store — callers receive the data
 * directly and decide how to cache or render it.
 *
 * @example
 * ```ts
 * // src/live.config.ts
 * import { defineLiveCollection } from 'astro:content'
 * import { postrLiveLoader } from './integrations/postr'
 *
 * export const collections = {
 *   posts: defineLiveCollection({
 *     loader: postrLiveLoader({ apiUrl: 'http://localhost:4000' }),
 *   }),
 * }
 * ```
 *
 * @example
 * ```ts
 * // In a route handler:
 * const result = await loader.loadCollection({
 *   filter: { type: 'note', limit: 5 },
 *   collection: 'posts',
 * })
 *
 * if (result.error) {
 *   return new Response(result.error.message, { status: 500 })
 * }
 * for (const entry of result.entries ?? []) { ... }
 * ```
 *
 * @param config — Optional runtime config (apiUrl, siteUrl, etc.).
 *                 Falls back to env vars and built-in defaults.
 */
export function postrLiveLoader(
  config?: PostrRuntimeConfig
): LiveLoader<
  Record<string, any>,
  PostrEntryFilter,
  PostrCollectionFilter,
  PostrLoaderError
> {
  const cfg = resolveRuntimeConfig(config)
  const { apiUrl, siteUrl, authorName, authorPhoto, apiTimeout } = cfg
  const isDev =
    (typeof import.meta !== 'undefined' &&
      (import.meta as any).env?.DEV === true) ??
    process.env.NODE_ENV === 'development'

  return {
    name: 'postr-live-loader',

    async loadEntry(
      context: LoadEntryContext<PostrEntryFilter>
    ): Promise<
      | {
          id: string
          data: Record<string, any>
          cacheHint?: CacheHint
        }
      | { error: PostrLoaderError }
      | undefined
    > {
      const { filter } = context

      if (!filter) {
        return { error: new PostrLoaderError('Entry filter is required') }
      }

      try {
        // Build query from the provided filter
        const query: Record<string, unknown> = {}
        if (filter.slug) query.slug = filter.slug
        if (filter.url) query.url = filter.url

        // No filter fields set
        if (Object.keys(query).length === 0) {
          return {
            error: new PostrLoaderError(
              'At least one of `slug` or `url` is required'
            ),
          }
        }

        const rawPosts = await getPosts({ query, limit: 1 }, { apiUrl, timeout: apiTimeout })

        if (!Array.isArray(rawPosts) || rawPosts.length === 0) {
          return { error: new PostrLoaderError('Entry not found', 404) }
        }

        const normalized = normalizeMf2(rawPosts[0], {
          authorName,
          siteUrl,
          authorPhoto,
          devMode: isDev,
          localUrl: 'http://localhost:4000',
          remoteUrl: siteUrl,
        })

        const rawUrl = normalized?.properties?.url?.[0] ?? ''
        const id = deriveEntryId(rawUrl, 0)

        return {
          id,
          data: normalized,
          cacheHint: {
            tags: ['postr', 'entry'],
            lastModified: new Date(),
          },
        }
      } catch (err) {
        return {
          error: new PostrLoaderError(
            `Failed to load entry: ${
              err instanceof Error ? err.message : String(err)
            }`,
            500,
            err instanceof Error ? err.message : undefined
          ),
        }
      }
    },

    async loadCollection(
      context: LoadCollectionContext<PostrCollectionFilter>
    ): Promise<
      | {
          entries: Array<{
            id: string
            data: Record<string, any>
            cacheHint?: CacheHint
          }>
          cacheHint?: CacheHint
        }
      | { error: PostrLoaderError }
    > {
      const { filter } = context

      try {
        // Gate: skip if API is unreachable
        if (!(await isApiReachable(apiUrl))) {
          return {
            error: new PostrLoaderError('API is unreachable', 503),
          }
        }

        // Build query from the collection filter
        const query: Record<string, unknown> = {}
        const typeValue = filter?.type ?? filter?.postType
        if (typeValue) {
          query.typeOrYear = typeValue
        }
        if (filter?.startDate) {
          query.start = filter.startDate
        }
        if (filter?.endDate) {
          query.end = filter.endDate
        }

        const limit = filter?.limit ?? 10
        const showAll = filter?.showAll ?? false

        const rawPosts = await getPosts({ query, limit, showAll }, { apiUrl, timeout: apiTimeout })

        if (!Array.isArray(rawPosts) || rawPosts.length === 0) {
          return {
            entries: [],
            cacheHint: {
              tags: ['postr', 'empty'],
              lastModified: new Date(),
            },
          }
        }

        // Build cache tags from filters
        const tags: string[] = ['postr']
        if (typeValue) tags.push(`type:${typeValue}`)

        const entries = rawPosts.map((post: any, index: number) => {
          const normalized = normalizeMf2(post, {
            authorName,
            siteUrl,
            authorPhoto,
            devMode: isDev,
            localUrl: 'http://localhost:4000',
            remoteUrl: siteUrl,
          })

          const rawUrl = normalized?.properties?.url?.[0] ?? ''
          const id = deriveEntryId(rawUrl, index)

          return {
            id,
            data: normalized,
            cacheHint: {
              tags: [...tags, 'entry'],
              lastModified: new Date(),
            },
          }
        })

        return {
          entries,
          cacheHint: {
            tags,
            lastModified: new Date(),
          },
        }
      } catch (err) {
        return {
          error: new PostrLoaderError(
            `Failed to load collection: ${
              err instanceof Error ? err.message : String(err)
            }`,
            500,
            err instanceof Error ? err.message : undefined
          ),
        }
      }
    },
  }
}
