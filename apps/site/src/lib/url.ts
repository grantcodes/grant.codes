/**
 * URL normalization utility for the Astro site.
 *
 * Problem: The backend returns permalink URLs as absolute (https://grant.codes/...).
 * In local dev or on Tailscale, these links point to production instead of the
 * current environment. This utility strips the site URL prefix to make internal
 * links relative, matching the behavior of apps/web/components/Link.tsx in Next.js.
 *
 * Also rewrites href attributes in post content HTML so internal links inside
 * e-content work correctly on any domain.
 */

const PRODUCTION_URL = 'https://grant.codes'

/**
 * Get the current site URL from environment, falling back to production.
 */
export function getSiteUrl(): string {
  return import.meta.env.NEXT_PUBLIC_URL ?? PRODUCTION_URL
}

/**
 * Normalize an internal URL to be relative.
 * - If the URL starts with the site URL (or production URL), strip that prefix.
 * - If the stripped result is empty, return "/".
 * - If the URL starts with "http" (external), return unchanged.
 *
 * Examples:
 *   normalizeInternalUrl('https://grant.codes/notes/2025/...') → '/notes/2025/...'
 *   normalizeInternalUrl('https://grant.codes') → '/'
 *   normalizeInternalUrl('https://other.domain/page') → 'https://other.domain/page'
 *   normalizeInternalUrl('/about') → '/about'
 *   normalizeInternalUrl(null) → '#'
 */
export function normalizeInternalUrl(url: string | null | undefined, siteUrl?: string): string {
  if (!url) return '#'

  const baseUrl = siteUrl ?? getSiteUrl()

  // Strip production URL as well, since backend data always uses it
  let stripped = url
  if (stripped.startsWith(baseUrl)) {
    stripped = stripped.slice(baseUrl.length)
  } else if (stripped.startsWith(PRODUCTION_URL)) {
    stripped = stripped.slice(PRODUCTION_URL.length)
  }

  if (stripped === '' || stripped === '/') {
    return '/'
  }

  // If it was an absolute URL, return the relative path
  if (stripped.startsWith('/') && url.startsWith('http')) {
    return stripped
  }

  // It's already relative or external — return as-is
  return url
}

/**
 * Rewrite internal grant.codes links inside HTML content to be relative.
 * Targets href attributes pointing to production or the current site URL.
 *
 * Does NOT touch src attributes (images are served from backend.grant.codes).
 * Does NOT touch links to external domains.
 */
export function rewriteContentHtml(html: string, siteUrl?: string): string {
  if (!html) return html

  const baseUrl = siteUrl ?? getSiteUrl()

  // Build a regex that matches href pointing to the site URL or production URL
  // Pattern: href="URL" or href='URL' (case-insensitive for href)
  const escapedBase = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const escapedProd = PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Only match the URL patterns we know are ours — be conservative
  let result = html
    .replace(
      new RegExp(`href="${escapedBase}/`, 'g'),
      'href="/'
    )
    .replace(
      new RegExp(`href="${escapedProd}/`, 'g'),
      'href="/'
    )
    .replace(
      new RegExp(`href='${escapedBase}/`, 'g'),
      "href='/"
    )
    .replace(
      new RegExp(`href='${escapedProd}/`, 'g'),
      "href='/"
    )

  return result
}
