/**
 * Astro-friendly options for the Postr content loader.
 *
 * These map to the backend search query but provide a typed,
 * Astro-centric interface instead of raw Postr payload passthrough.
 * The loader internally uses `normalizeSearchQuery()` to translate
 * these options into the format expected by the backend.
 *
 * @example
 * ```ts
 * // Load recent posts of type "note"
 * postrLoader({ typeOrYear: 'note', limit: 20 })
 *
 * // Load posts from a specific year
 * postrLoader({ typeOrYear: '2025', limit: 50 })
 * ```
 */
export interface PostrLoaderOptions {
  /**
   * Post type (e.g., "note", "photo", "article", "like")
   * or a 4-digit year (e.g., "2025").
   * Passed to `normalizeSearchQuery()` which converts it to
   * the appropriate `type` or `year` backend parameter.
   */
  typeOrYear?: string

  /** Month filter (1-12) — only meaningful when `typeOrYear` is a year. */
  month?: string

  /** Day filter (1-31) — requires `month` to also be set. */
  day?: string

  /** Slug or URL fragment filter. */
  slug?: string

  /** Maximum entries to return. Default: 10. */
  limit?: number

  /** Include non-public / draft entries. */
  showAll?: boolean
}

/**
 * Runtime configuration shared across all Postr integration surfaces.
 *
 * Resolved from (in order of precedence):
 * 1. Explicit value passed by the caller
 * 2. Environment variable (`NEXT_PUBLIC_*` or `POSTR_*` prefix)
 * 3. Built-in default
 *
 * Once extracted to `@postr/astro`, these will be the primary config surface
 * instead of relying on repo-local env vars.
 */
export interface PostrRuntimeConfig {
  /**
   * URL of the Postr API server.
   * Env: `NEXT_PUBLIC_API_URL` | `POSTR_API_URL`
   * Default: `'http://localhost:4000'`
   */
  apiUrl?: string

  /**
   * Canonical site URL used when normalising entry URLs.
   * Env: `NEXT_PUBLIC_URL` | `POSTR_SITE_URL`
   * Default: `'http://localhost:3000'`
   */
  siteUrl?: string

  /**
   * Default author display name injected into entries without one.
   * Env: `NEXT_PUBLIC_AUTHOR_NAME`
   * Default: `'Grant Richmond'`
   */
  authorName?: string

  /**
   * Default author photo URL injected into entries without one.
   * Env: `NEXT_PUBLIC_AUTHOR_PHOTO`
   * Default: `''`
   */
  authorPhoto?: string

  /**
   * Maximum entries to fetch in dev mode (keeps dev startup fast).
   * Env: `POSTR_DEV_LIMIT`
   * Default: `500`
   */
  devLimit?: number

  /**
   * Fetch timeout in milliseconds for API calls.
   * Env: `POSTR_API_TIMEOUT`
   * Default: `30000`
   */
  apiTimeout?: number
}

/**
 * Extended loader config — combines user-facing query options,
 * runtime config, and an optional custom Loader name.
 */
export interface PostrLoaderConfig extends PostrLoaderOptions, PostrRuntimeConfig {
  /** Custom name for the Loader object (defaults to `'postr-loader'`). */
  name?: string
}

/**
 * Integration-level config for `postrIntegration()`.
 *
 * Adds build- and retry-tuning knobs on top of the shared runtime config.
 */
export interface PostrIntegrationConfig extends PostrRuntimeConfig {
  /**
   * Maximum entries to fetch in production builds.
   * Env: `POSTR_BUILD_LIMIT`
   * Default: `10000`
   */
  buildLimit?: number

  /**
   * Dev retry: max number of attempts before giving up.
   * Default: `10`
   */
  retryMax?: number

  /**
   * Dev retry: initial delay before the first retry (ms).
   * Default: `3000`
   */
  retryDelay?: number

  /**
   * Dev retry: interval between subsequent retries (ms).
   * Default: `3000`
   */
  retryInterval?: number
}

// ─── Config Resolver ────────────────────────────────────────────────────────

function getEnvVar(key: string): string | undefined {
  // Vite / Astro provides import.meta.env at build time
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const val = (import.meta.env as Record<string, string | undefined>)[key]
      if (val !== undefined) return val
    }
  } catch {
    // Not in a Vite context — fall through to process.env
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env[key]
  }

  return undefined
}

function numEnv(key: string): number | undefined {
  const v = getEnvVar(key)
  if (v === undefined) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Resolve runtime config by merging explicit user values with env vars
 * and built-in defaults.
 *
 * Precedence (highest first):
 *   explicit arg → env var → built-in default
 *
 * @example
 * ```ts
 * const cfg = resolveRuntimeConfig({ apiUrl: 'http://custom:4000' })
 * // cfg.apiUrl === 'http://custom:4000'  (explicit wins)
 * // cfg.devLimit === 500                 (default)
 * ```
 */
export function resolveRuntimeConfig(user?: Partial<PostrRuntimeConfig>): Required<PostrRuntimeConfig> {
  const envApiUrl = getEnvVar('NEXT_PUBLIC_API_URL') ?? getEnvVar('POSTR_API_URL')
  const envSiteUrl = getEnvVar('NEXT_PUBLIC_URL') ?? getEnvVar('POSTR_SITE_URL')

  return {
    apiUrl: user?.apiUrl ?? envApiUrl ?? 'http://localhost:4000',
    siteUrl: user?.siteUrl ?? envSiteUrl ?? 'http://localhost:3000',
    authorName: user?.authorName ?? getEnvVar('NEXT_PUBLIC_AUTHOR_NAME') ?? 'Grant Richmond',
    authorPhoto: user?.authorPhoto ?? getEnvVar('NEXT_PUBLIC_AUTHOR_PHOTO') ?? '',
    devLimit: user?.devLimit ?? numEnv('POSTR_DEV_LIMIT') ?? 500,
    apiTimeout: user?.apiTimeout ?? numEnv('POSTR_API_TIMEOUT') ?? 30_000,
  }
}

/**
 * Resolve integration-level config, merging runtime config with
 * build- and retry-tuning defaults.
 */
export function resolveIntegrationConfig(
  user?: Partial<PostrIntegrationConfig>
): Required<PostrIntegrationConfig> {
  const runtime = resolveRuntimeConfig(user)

  return {
    ...runtime,
    buildLimit: user?.buildLimit ?? numEnv('POSTR_BUILD_LIMIT') ?? 10_000,
    retryMax: user?.retryMax ?? numEnv('POSTR_RETRY_MAX') ?? 10,
    retryDelay: user?.retryDelay ?? numEnv('POSTR_RETRY_DELAY_MS') ?? 3_000,
    retryInterval: user?.retryInterval ?? numEnv('POSTR_RETRY_INTERVAL_MS') ?? 3_000,
  }
}

// ─── Live Loader Types ─────────────────────────────────────────────────────

/**
 * Filter for loading a single entry via the live loader.
 *
 * At least one of `slug` or `url` should be provided.
 */
export interface PostrEntryFilter {
  /** Slug or URL fragment to look up. */
  slug?: string

  /** Full entry URL (e.g. `https://grant.codes/notes/2025/03/15/1`). */
  url?: string
}

/**
 * Filter for loading a collection of entries via the live loader.
 *
 * All fields are optional — omit all to load the default recent set.
 */
export interface PostrCollectionFilter {
  /** Post type alias (e.g. `"note"`, `"photo"`, `"article"`). */
  type?: string

  /** Alias for `type`, kept for convenience. */
  postType?: string

  /** Only include entries on or after this date (ISO 8601). */
  startDate?: string

  /** Only include entries on or before this date (ISO 8601). */
  endDate?: string

  /** Maximum entries to return. Default: 10. */
  limit?: number

  /** Include non-public / draft entries. */
  showAll?: boolean
}

/**
 * Typed error returned by live loader methods instead of throwing.
 *
 * Extends `Error` to satisfy the `LiveLoader` generic constraint.
 */
export class PostrLoaderError extends Error {
  /** HTTP status code, if applicable. */
  statusCode: number

  constructor(message: string, statusCode = 500, cause?: string) {
    super(message)
    this.name = 'PostrLoaderError'
    this.statusCode = statusCode
    if (cause) {
      this.cause = cause
    }
  }
}
