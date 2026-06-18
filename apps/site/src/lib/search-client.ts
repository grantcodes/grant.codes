/**
 * Client-side search renderer for the search page.
 *
 * Imports shared helpers for URL normalization, content sanitization,
 * and photo extraction to avoid duplicating that logic inline.
 *
 * Keeps its own `escapeHtml()` and absolute date formatter since those
 * are specific to the client-side DOM-injection context.
 */

import { normalizeInternalUrl } from './url'
import { renderContentHtml } from './post-content'
import { getPhotoUrl } from './post-media'

/* ── Types ── */

export interface SearchPost {
  properties: Record<string, any>
}

/* ── Helpers ── */

/**
 * Escape a string for safe innerHTML assignment.
 */
export function escapeHtml(str: string): string {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}

/**
 * Format an ISO date string as a short absolute date
 * (e.g. "17 Jun 2026") for search result cards.
 */
export function formatSearchDate(published: string): string {
  try {
    const d = new Date(published)
    return d.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return published
  }
}

/* ── Search result card renderer ── */

export function renderPostCard(post: SearchPost, siteUrl: string): string {
  const props = post?.properties || {}
  const name = props.name?.[0] || null
  const content = props.content?.[0] || null
  const published = props.published?.[0] || null
  const url = normalizeInternalUrl(props.url?.[0], siteUrl)
  const photo = props.photo?.[0] || null
  const categories = props.category || []

  // Content HTML — reuse shared helper for script stripping + URL rewriting
  let contentHtml = ''
  if (content) {
    let innerHtml = ''
    if (content.html) {
      // Already HTML — delegate to shared helper for script stripping & URL rewriting
      innerHtml = renderContentHtml(content)
    } else {
      // Plain text — escape then wrap in <p> to prevent HTML injection
      const text =
        typeof content === 'string'
          ? content
          : content.value ?? ''
      innerHtml = '<p>' + escapeHtml(text) + '</p>'
    }
    contentHtml =
      '<div class="e-content" style="margin-top: 0.5rem;">' +
      innerHtml +
      '</div>'
  }

  // Photo — reuse shared helper for MF2 value extraction
  let photoHtml = ''
  if (photo) {
    const photoUrl = getPhotoUrl(photo)
    if (photoUrl) {
      photoHtml =
        '<img src="' +
        escapeHtml(photoUrl) +
        '" alt="" class="u-photo" ' +
        'style="max-width: 100%; border-radius: 0.4rem; margin-top: 0.5rem;" loading="lazy" />'
    }
  }

  // Categories
  let categoryHtml = ''
  if (categories.length > 0) {
    categoryHtml =
      '<div style="margin-top: 0.5rem; font-size: 0.7rem; opacity: 0.5;">'
    for (let ci = 0; ci < categories.length; ci++) {
      categoryHtml +=
        '<span class="p-category" style="margin-right: 0.3rem;">' +
        escapeHtml(categories[ci]) +
        '</span>'
    }
    categoryHtml += '</div>'
  }

  // Date
  let dateHtml = ''
  if (published) {
    dateHtml =
      '<time class="dt-published" datetime="' +
      published +
      '" ' +
      'style="font-size: 0.7rem; opacity: 0.5;">' +
      formatSearchDate(published) +
      '</time>'
  }

  // Assemble card with grantcodes-card
  let card =
    '<article class="h-entry"><grantcodes-card>'

  if (name) {
    card +=
      '<h3 class="p-name" style="margin: 0 0 0.25rem;">' +
      '<a href="' +
      escapeHtml(url) +
      '" class="u-url">' +
      escapeHtml(name) +
      '</a></h3>'
  } else {
    card +=
      '<a href="' +
      escapeHtml(url) +
      '" class="u-url" style="display:none;">permalink</a>'
  }

  card += photoHtml + contentHtml + categoryHtml

  if (dateHtml) {
    card += '<div style="margin-top: 0.5rem;">' + dateHtml + '</div>'
  }

  // Hidden author h-card for MF2 parsers
  card +=
    '<div class="p-author h-card screen-reader-text">' +
    '<span class="p-name">Grant Richmond</span></div>'

  card += '</grantcodes-card></article>'
  return card
}

/* ── Main search entry point ── */

export async function performSearch(): Promise<void> {
  const container = document.getElementById('search-results')
  if (!container) return

  const urlParams = new URLSearchParams(window.location.search)
  const query = urlParams.get('q')
  if (!query || !query.trim()) return

  const apiUrl =
    container.getAttribute('data-api-url') || 'https://backend.grant.codes'
  const siteUrl =
    container.getAttribute('data-site-url') || 'https://grant.codes'

  // Loading state
  container.innerHTML =
    '<grantcodes-card><p>Searching...</p></grantcodes-card>'

  try {
    const res = await fetch(apiUrl + '/api/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { search: query.trim() },
        limit: 50,
        showAll: true,
      }),
    })

    if (!res.ok) throw new Error('API returned ' + res.status)

    const posts = await res.json()

    if (!Array.isArray(posts) || posts.length === 0) {
      container.innerHTML =
        '<grantcodes-card>' +
        '<p>No results found for "<strong>' +
        escapeHtml(query) +
        '</strong>".</p></grantcodes-card>'
      return
    }

    let html =
      '<p class="text-muted" style="margin-bottom: 1rem;">' +
      posts.length +
      ' result' +
      (posts.length !== 1 ? 's' : '') +
      ' for "<strong>' +
      escapeHtml(query) +
      '</strong>"</p>'

    for (let i = 0; i < posts.length; i++) {
      html += renderPostCard(posts[i], siteUrl)
    }

    container.innerHTML = html
  } catch (err: any) {
    console.error('[search] fetch failed:', err)
    container.innerHTML =
      '<grantcodes-card>' +
      '<p>Search failed. Please try again later.</p>' +
      '<p style="font-size: 0.7rem; opacity: 0.5;">' +
      escapeHtml(String(err)) +
      '</p></grantcodes-card>'
  }
}
