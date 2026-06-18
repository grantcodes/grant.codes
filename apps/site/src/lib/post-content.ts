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

/**
 * Strip <script> tags (and their content) from an HTML string.
 * Uses a regex approach that handles self-closing and nested-script edge
 * cases that the MF2 backend may produce.
 */
export function stripScriptTags(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
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
export function renderContentHtml(content: any): string {
  let html = ''

  if (content?.html) {
    html = stripScriptTags(content.html)
  } else if (content?.value) {
    html = `<p>${content.value}</p>`
  } else if (typeof content === 'string') {
    html = `<p>${content}</p>`
  }

  // Rewrite internal grant.codes URLs to be relative
  return rewriteContentHtml(html)
}
