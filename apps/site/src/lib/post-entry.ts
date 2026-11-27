import { formatRelativeDate, type Mf2Item, type PostOptions } from '@grantcodes/ui/mf2'
import type { PostData } from '@postr/astro'
import { categorySlug } from './category-slug'
import { renderContentHtml } from './post-content'
import { site } from './site'
import { normalizeInternalUrl } from './url'

const RESPONSES = ['in-reply-to', 'like-of', 'repost-of', 'bookmark-of', 'quotation-of']

/**
 * First value of a response property (`in-reply-to`, `like-of`, ...). brid.gy can store
 * several URLs; like the legacy normalizeMf2, prefer the one on this site.
 */
function getResponseValue(values: unknown[], siteUrl: string) {
  return values.find((value) => typeof value === 'string' && value.startsWith(siteUrl)) ?? values[0]
}

/** A postr post as the mf2 entry the shared `Post` renders: one response URL per kind, a local permalink. */
export function toEntry(post: PostData): Mf2Item {
  const properties: Mf2Item['properties'] = { ...post.properties, url: [normalizeInternalUrl(post.url)] }
  for (const key of RESPONSES) {
    const values = post.properties[key]
    if (values?.length) properties[key] = [getResponseValue(values, site.url)] as Mf2Item['properties'][string]
  }
  // Plain-text content still goes through `sanitize`, which links its #tags and local URLs.
  const content = post.properties.content?.[0]
  if (content !== undefined && !(typeof content === 'object' && 'html' in content)) {
    const value = typeof content === 'string' ? content : String((content as { value?: string }).value ?? '')
    properties.content = [{ html: `<p>${value}</p>`, value }]
  }
  return { type: ['h-entry'], properties }
}

/** Options for a post on this site: its own content cleaner, category pages and author. */
export const postOptions = (post: PostData, options: PostOptions = {}): PostOptions => ({
  sanitize: (html) => renderContentHtml({ html }, post.categories),
  formatDate: (iso) => formatRelativeDate(iso, new Date(), 'en-GB'),
  categoryHref: (name) => `/category/${categorySlug(name)}`,
  author: { name: site.author.name },
  ...options,
})
