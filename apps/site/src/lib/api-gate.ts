// API health check gate — caches reachability to avoid repeated timeouts
// during build. Uses a shared file in the system temp directory so the
// cache persists across all Astro page-generation contexts (module-level
// state, globalThis, and process.env are NOT reliably shared).
//
// When the API is unreachable during static build (no server listening),
// fetch rejects with ECONNREFUSED in <100ms when the API is truly down,
// so unreachable checks still fail fast. But a real search-backed health
// check against a live local API can take a few seconds, so the timeout
// must be generous enough not to misclassify a healthy server as offline.

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const CACHE_DIR = '/tmp/opencode/grantcodes-api-gate'
const CACHE_FILE = join(CACHE_DIR, 'reachability.json')
const CHECK_TIMEOUT = 10_000 // ms
const CACHE_TTL = 600_000 // ms — 10 min

interface CacheEntry {
  reachable: boolean
  timestamp: number
}

function normalizeLocalApiUrl(apiUrl: string): string {
  return apiUrl.replace('://localhost:', '://127.0.0.1:')
}

function readCache(): CacheEntry | null {
  try {
    if (!existsSync(CACHE_FILE)) return null
    const raw = readFileSync(CACHE_FILE, 'utf-8')
    return JSON.parse(raw) as CacheEntry
  } catch {
    return null
  }
}

function writeCache(entry: CacheEntry): void {
  try {
    if (!existsSync(CACHE_DIR)) {
      mkdirSync(CACHE_DIR, { recursive: true })
    }
    writeFileSync(CACHE_FILE, JSON.stringify(entry), 'utf-8')
  } catch {
    // Silently fail — the gate still works, just without caching
  }
}

/**
 * Reset the cached reachability state, forcing the next call to
 * `isApiReachable()` to perform a fresh health check.
 *
 * Used by the Postr integration in dev mode when retrying content sync
 * after the API becomes available following an initial failed check.
 */
export function resetApiGateCache(): void {
  try {
    if (existsSync(CACHE_FILE)) {
      unlinkSync(CACHE_FILE)
    }
  } catch {
    // silently ignore — next call will do a fresh check
  }
}

export async function isApiReachable(apiUrl: string): Promise<boolean> {
  const normalizedApiUrl = normalizeLocalApiUrl(apiUrl)

  // Check file cache (persists across all contexts)
  const cached = readCache()
  if (cached !== null) {
    if (cached.reachable) return true
    if (Date.now() - cached.timestamp < CACHE_TTL) return false
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT)

    const res = await fetch(`${normalizedApiUrl}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 1 }),
      signal: controller.signal,
    })

    clearTimeout(timer)
    const reachable = res.ok
    writeCache({ reachable, timestamp: Date.now() })
    return reachable
  } catch {
    writeCache({ reachable: false, timestamp: Date.now() })
    console.warn('[api-gate] API unreachable — skipping API calls for remaining pages')
    return false
  }
}
