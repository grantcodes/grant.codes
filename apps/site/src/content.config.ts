import { defineCollection } from 'astro:content'
import { postrLoader } from './integrations/postr'

/**
 * Content collection for Postr-backed posts.
 *
 * Uses the shared `postrLoader` which wraps `getPosts()` and
 * `normalizeMf2()` from `src/lib/`. During static build, the loader
 * fetches and normalises all public posts. If the API is unreachable,
 * the collection is empty and a warning is logged — the build does not fail.
 *
 * The loader fetches all public content (all post types) with a generous
 * limit. Route-layer filtering (`getCollection('posts', filterFn)`) is the
 * intended pattern for selecting subsets.
 *
 * Query the collection from any `.astro` page:
 * ```astro
 * ---
 * import { getCollection } from 'astro:content'
 * const posts = await getCollection('posts')
 * ---
 * ```
 *
 * @note If the full-corpus build proves too heavy, consider reducing the
 *       limit or adding API-side pagination in the loader.
 */
export const collections = {
  posts: defineCollection({
    loader: postrLoader({
      limit: 10000,
      typeOrYear: 'all',
    }),
  }),
}
