/**
 * MF2 mention URL extraction helpers.
 *
 * MF2 mention properties (`like-of`, `repost-of`, `in-reply-to`,
 * `bookmark-of`, `quotation-of`) can be either:
 *
 * 1. A plain URL string
 * 2. An embedded h-cite or h-entry object with `properties.url[0]`
 * 3. An object with a `.value` property containing the URL
 *
 * These two helpers handle the same input semantics but have subtly
 * different resolution order. Keep both exported so call sites are
 * explicit about which behavior they expect.
 */

/**
 * Simple URL extraction — the original behavior from `Post.astro`.
 *
 * Resolution order:
 * 1. If value is a string, return it as-is.
 * 2. If value is an object with `.value`, return that.
 * 3. Otherwise return empty string.
 *
 * Does NOT resolve embedded h-cite/h-entry MF2 objects.
 */
export function getUrl(value: any): string {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value?.value) return value.value
  return ''
}

/**
 * MF2-aware mention URL extraction — the original behavior from `PostCard.astro`.
 *
 * Resolution order:
 * 1. If value is falsy, return null.
 * 2. If value is a string, return it as-is.
 * 3. If value is an object with `properties.url[0]` (embedded h-cite/h-entry), return that.
 * 4. If value is an object with `.value`, return that.
 * 5. Otherwise return null.
 *
 * Handles the full MF2 mention spectrum including embedded citations.
 */
export function getMentionUrl(val: any): string | null {
  if (!val) return null
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val.properties?.url?.[0]) return val.properties.url[0]
  if (typeof val === 'object' && val.value) return val.value
  return null
}
