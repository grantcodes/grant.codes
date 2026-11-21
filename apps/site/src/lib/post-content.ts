/**
 * Post content rendering helpers.
 *
 * Extracts HTML from an MF2 content object, strips script tags for safety,
 * and rewrites internal grant.codes URLs to relative paths.
 *
 * This is markup-agnostic — it returns a sanitized HTML string.
 * Callers are responsible for rendering it with `set:html` and
 * applying the `e-content` MF2 class as appropriate.
 */

import { rewriteContentHtml } from './url'
import { categorySlug } from './category-slug'

/**
 * Strip <script> tags (and their content) from an HTML string.
 * Uses a regex approach that handles self-closing and nested-script edge
 * cases that the MF2 backend may produce.
 */
export function stripScriptTags(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

/**
 * Links `#tag` in the text to its category page when `tag` is one of the post's categories.
 * Skips text inside links, `code` and `pre`, and `#` that isn't at the start or after a space.
 */
function linkHashtags(html: string, categories: string[] = []): string {
  const known = new Map(categories.map((name) => [name.toLowerCase(), name]))
  if (!known.size) return html
  let skip = 0
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith('<')) {
        if (/^<(a|code|pre)\b/i.test(part)) skip++
        else if (/^<\/(a|code|pre)>/i.test(part)) skip = Math.max(0, skip - 1)
        return part
      }
      if (skip) return part
      return part.replace(/(^|[\s(])#(\w+)/g, (match, before, tag) => {
        const name = known.get(tag.toLowerCase())
        return name ? `${before}<a href="/category/${categorySlug(name)}" rel="tag">#${tag}</a>` : match
      })
    })
    .join('')
}

/**
 * Safely extract and sanitize HTML from an MF2 content value.
 *
 * Accepts:
 * - `{ html: '...' }` — the preferred MF2 form; scripts are stripped,
 *   internal URLs are rewritten.
 * - `{ value: '...' }` — plain-text fallback; wrapped in `<p>`.
 * - A plain string — treated as plain text; wrapped in `<p>`.
 *
 * Always returns a sanitized HTML string safe for `set:html`.
 */
export function renderContentHtml(content: any, categories: string[] = []): string {
  let html = ''

  if (content?.html) {
    html = stripScriptTags(content.html)
  } else if (content?.value) {
    html = `<p>${content.value}</p>`
  } else if (typeof content === 'string') {
    html = `<p>${content}</p>`
  }

  // Rewrite internal grant.codes URLs to be relative
  return linkHashtags(rewriteContentHtml(html), categories)
}
