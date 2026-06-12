/**
 * Canonical post date helpers.
 *
 * Provides a single source of truth for extracting and formatting dates
 * from normalized MF2 post objects. The canonical date prefers
 * `properties.created` over `properties.published`.
 *
 * The result is baked into each collection entry at load time as
 * `entry.data._postr`, so routes never need to trawl MF2 properties
 * for date logic.
 */

/**
 * Postr metadata attached to each normalized collection entry at load time.
 *
 * Namespaced under `_postr` to avoid colliding with MF2 properties
 * (which live under `properties`).
 */
export interface PostrMeta {
  /** ISO 8601 date string of the canonical post date (UTC). */
  date: string
  /** 4-digit year. */
  year: number
  /** Month number (1-12). */
  month: number
  /** Day number (1-31). */
  day: number
}

/**
 * Extract the canonical date from a normalized MF2 post object.
 *
 * Resolution order:
 * 1. `properties.created[0]`
 * 2. `properties.published[0]`
 *
 * Returns `null` when neither property exists or neither is parseable.
 *
 * @param post - A normalized MF2 post object (as returned by normalizeMf2).
 * @returns A Date object, or `null` if no valid date is found.
 */
export function getCanonicalDate(post: any): Date | null {
  if (!post?.properties) return null

  const dateStr =
    post.properties.created?.[0] ??
    post.properties.published?.[0] ??
    null

  if (!dateStr) return null

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return null

  return date
}

/**
 * Build a `PostrMeta` object from a normalized MF2 post.
 *
 * Returns `null` when no valid date can be resolved (callers should
 * handle that case gracefully — e.g. exclude the entry from date-based
 * filters or fall back to a sentinel value).
 *
 * @param post - A normalized MF2 post object.
 * @returns A `PostrMeta` object, or `null`.
 */
export function buildPostrMeta(post: any): PostrMeta | null {
  const date = getCanonicalDate(post)
  if (!date) return null

  return {
    date: date.toISOString(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}
