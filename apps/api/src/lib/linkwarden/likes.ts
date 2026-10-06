import type { LinkwardenClient } from './client.js'
import type { LikeSyndicationStore } from './store.js'

export interface Mf2Post {
  type?: string[]
  properties?: Record<string, any[]>
  [key: string]: any
}

export interface LinkwardenLinkRequest {
  type: 'url'
  url: string
  name?: string
  collection: { id: number }
}

export type LikeSyndicationStatus =
  | 'not-a-like'
  | 'skipped-not-published'
  | 'invalid-url'
  | 'already-syndicated'
  | 'dry-run'
  | 'syndicated'
  | 'error'

export interface LikeSyndicationResult {
  status: LikeSyndicationStatus
  canonicalUrl?: string
  request?: LinkwardenLinkRequest
  syndicationUrl?: string
  error?: string
}

export interface SyndicateLikeOptions {
  mf2: Mf2Post | null | undefined
  collectionId?: number
  client?: LinkwardenClient
  store?: LikeSyndicationStore
  dryRun?: boolean
  log?: (message: string, meta?: unknown) => void
}

const TRACKING_PARAM_PREFIXES = ['utm_', 'pk_', 'mtm_', 'hsa_', 'vero_']
const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'dclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'twclid',
  'ttclid',
  'yclid',
  'igshid',
  'mc_cid',
  'mc_eid',
  'mkt_tok',
  '_hsenc',
  '_hsmi',
  'wickedid',
  'oly_anon_id',
  'oly_enc_id',
  'ref_src',
  'ref_url',
])

export function isTrackingParam(name: string): boolean {
  const key = name.toLowerCase()
  return (
    TRACKING_PARAMS.has(key) ||
    TRACKING_PARAM_PREFIXES.some((prefix) => key.startsWith(prefix))
  )
}

/**
 * Normalises a liked URL so the same target is not bookmarked twice. Drops the
 * fragment and common tracking parameters, lowercases the host, sorts the
 * remaining query parameters and trims a trailing slash.
 */
export function canonicalizeUrl(input: unknown): string | null {
  if (typeof input !== 'string' || input.trim() === '') {
    return null
  }

  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return null
  }

  url.hash = ''
  url.hostname = url.hostname.toLowerCase()

  const params = Array.from(url.searchParams.entries())
    .filter(([key]) => !isTrackingParam(key))
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

  url.search = ''
  for (const [key, value] of params) {
    url.searchParams.append(key, value)
  }

  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '')
  }

  return url.toString()
}

export function getLikeOfValues(mf2: Mf2Post | null | undefined): string[] {
  const raw = mf2?.properties?.['like-of']
  if (!Array.isArray(raw)) {
    return []
  }

  const values: string[] = []
  for (const value of raw) {
    if (typeof value === 'string') {
      values.push(value)
      continue
    }
    if (value && typeof value === 'object') {
      const candidate = value.value ?? value.properties?.url?.[0]
      if (typeof candidate === 'string') {
        values.push(candidate)
      }
    }
  }

  return values
}

export function isLikePost(mf2: Mf2Post | null | undefined): boolean {
  return getLikeOfValues(mf2).length > 0
}

export function extractLikeTarget(
  mf2: Mf2Post | null | undefined
): string | null {
  for (const value of getLikeOfValues(mf2)) {
    const canonical = canonicalizeUrl(value)
    if (canonical) {
      return canonical
    }
  }
  return null
}

export function isPublished(mf2: Mf2Post | null | undefined): boolean {
  const status = mf2?.properties?.['post-status']?.[0]
  const visibility = mf2?.properties?.visibility?.[0]
  return (
    (status === undefined || status === 'published') &&
    (visibility === undefined || visibility === 'visible')
  )
}

/**
 * Builds the Linkwarden `/api/v1/links` request body. Likes intentionally carry
 * no tags: the dedicated likes collection is the only grouping.
 */
export function buildLinkwardenLinkRequest(
  canonicalUrl: string,
  mf2: Mf2Post | null | undefined,
  collectionId: number
): LinkwardenLinkRequest {
  const request: LinkwardenLinkRequest = {
    type: 'url',
    url: canonicalUrl,
    collection: { id: collectionId },
  }

  const name = mf2?.properties?.name?.[0]
  if (typeof name === 'string' && name.trim() !== '') {
    request.name = name.trim()
  }

  return request
}

/**
 * Syndicates a single new like post. Never throws: any failure is reported as
 * an `error` result so publishing is never blocked by Linkwarden.
 */
export async function syndicateLike(
  options: SyndicateLikeOptions
): Promise<LikeSyndicationResult> {
  const { mf2, collectionId, client, store, dryRun = true, log } = options

  try {
    if (!isLikePost(mf2)) {
      return { status: 'not-a-like' }
    }

    if (!isPublished(mf2)) {
      return { status: 'skipped-not-published' }
    }

    const canonicalUrl = extractLikeTarget(mf2)
    if (!canonicalUrl) {
      return { status: 'invalid-url' }
    }

    if (typeof collectionId !== 'number' || !Number.isInteger(collectionId)) {
      return {
        status: 'error',
        canonicalUrl,
        error: 'Missing Linkwarden likes collection id',
      }
    }

    const request = buildLinkwardenLinkRequest(canonicalUrl, mf2, collectionId)

    if (store && (await store.has(canonicalUrl))) {
      return { status: 'already-syndicated', canonicalUrl, request }
    }

    if (dryRun) {
      log?.(`[linkwarden-likes] dry-run: would bookmark ${canonicalUrl}`, {
        request,
      })
      return { status: 'dry-run', canonicalUrl, request }
    }

    if (!client || !store) {
      return {
        status: 'error',
        canonicalUrl,
        request,
        error: 'Linkwarden client or store not configured',
      }
    }

    const created = await client.createLink(request)
    const syndicationUrl = created?.url
    await store.add(canonicalUrl, syndicationUrl)

    return {
      status: 'syndicated',
      canonicalUrl,
      request,
      syndicationUrl,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    log?.(`[linkwarden-likes] syndication failed: ${message}`)
    return { status: 'error', error: message }
  }
}
