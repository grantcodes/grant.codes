/**
 * @grant.codes/postr — Astro integration for Postr-backed content collections.
 *
 * ## What it provides
 *
 * - **`postrLoader`** — A typed build-time object loader for `defineCollection`
 * - **`postrLiveLoader`** — A typed live loader for `defineLiveCollection`
 * - **`postrIntegration()`** — An Astro integration that registers a dev
 *   toolbar app and a content-refresh retry loop for local development
 * - **`deriveEntryId`** — A utility to derive filesystem-safe entry IDs from
 *   post URLs
 * - Shared filter / error types
 *
 * ## Quick start
 *
 * ```ts
 * // astro.config.ts
 * import { defineConfig } from 'astro/config'
 * import postrIntegration from './src/integrations/postr'
 *
 * export default defineConfig({
 *   integrations: [postrIntegration()],
 * })
 * ```
 *
 * ```ts
 * // src/content.config.ts
 * import { defineCollection } from 'astro:content'
 * import { postrLoader } from './integrations/postr'
 *
 * export const collections = {
 *   posts: defineCollection({
 *     loader: postrLoader({ limit: 10 }),
 *   }),
 * }
 * ```
 *
 * ## Configuration surface
 *
 * All runtime values (`apiUrl`, `siteUrl`, `authorName`, etc.) are resolved
 * from (in order of precedence):
 *   1. Explicit config passed to the integration or loader
 *   2. Environment variables (`NEXT_PUBLIC_*` or `POSTR_*` prefix)
 *   3. Built-in defaults
 *
 * This means both the integration and the loaders can be fully configured
 * without any repo-local env assumptions — a prerequisite for extracting
 * this code to `@postr/astro`.
 *
 * @example
 * ```ts
 * // Fully explicit integration config (no env-var dependency):
 * postrIntegration({
 *   apiUrl: 'http://localhost:4000',
 *   siteUrl: 'https://grant.codes',
 *   authorName: 'Grant Richmond',
 *   devLimit: 200,
 *   buildLimit: 5000,
 * })
 * ```
 *
 * @example
 * ```ts
 * // Per-loader overrides still work:
 * postrLoader({
 *   limit: 100,
 *   typeOrYear: 'note',
 *   apiUrl: 'http://staging:4000',
 * })
 * ```
 *
 * ## Extraction path → `@postr/astro`
 *
 * See `README.md` in this directory for the extraction roadmap.
 */

import type { AstroIntegration } from 'astro'
import { getLastExecution, setSend } from './toolbar/debug-store'
import { isApiReachable, resetApiGateCache } from '../../lib/api-gate'
import type { PostrIntegrationConfig } from './types'
import { resolveIntegrationConfig } from './types'

export { postrLoader } from './loader'
export { postrLiveLoader } from './live-loader'
export { deriveEntryId } from './loader'
export type {
  PostrLoaderOptions,
  PostrLoaderConfig,
  PostrRuntimeConfig,
  PostrIntegrationConfig,
  PostrEntryFilter,
  PostrCollectionFilter,
} from './types'
export {
  resolveRuntimeConfig,
  resolveIntegrationConfig,
  PostrLoaderError,
} from './types'

/**
 * Postr Astro integration.
 *
 * Registers a dev toolbar app for inspecting loader executions and a
 * content-refresh retry loop that periodically re-syncs content collections
 * during local development until the API becomes reachable.
 *
 * @param config — Optional integration config (apiUrl, retry tuning, etc.).
 *                 Falls back to env vars and built-in defaults.
 *
 * **Dev-mode retry:** When the API server starts after Astro's initial content
 * sync (common during local development with `npm run dev:api` + `npm run dev`),
 * a retry loop in `astro:server:setup` periodically clears the API gate cache
 * and calls `refreshContent()` to re-run loaders. Once the API is reachable
 * and the loader produces entries, the retry stops and the data store watcher
 * triggers a full page reload.
 */
export default function postrIntegration(
  config?: PostrIntegrationConfig
): AstroIntegration {
  const cfg = resolveIntegrationConfig(config)

  return {
    name: '@grant.codes/postr',
    hooks: {
      'astro:config:setup': ({ addDevToolbarApp }) => {
        addDevToolbarApp({
          id: 'postr-loader',
          name: 'Postr Loader',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
          entrypoint: 'src/integrations/postr/toolbar/index.ts',
        })
      },
      'astro:server:setup': ({ toolbar, refreshContent }) => {
        // Allow loader to send debug data to toolbar clients
        setSend(toolbar.send.bind(toolbar))

        // When the client requests the last execution, re-send it
        toolbar.on('postr:get-last-data', () => {
          const last = getLastExecution()
          if (last) {
            toolbar.send('postr:loader-data', last)
          }
        })

        // --- Dev-only content refresh retry ---
        //
        // The initial content sync runs before the API server may be ready,
        // leaving the data store empty. This retry loop periodically clears
        // the API gate cache and re-syncs content collections so that once
        // the API becomes reachable the page shows real entries without a
        // manual restart.
        //
        // The runtime Astro `refreshContent()` callback re-runs all content
        // layer loaders. The data-store watcher triggers a full page reload
        // when the store file changes, so the browser updates automatically.

        const doRefresh = refreshContent as Exclude<typeof refreshContent, undefined>
        const { apiUrl, retryMax, retryDelay, retryInterval } = cfg

        let attempts = 0
        let timer: ReturnType<typeof setTimeout> | undefined

        async function attemptRefresh() {
          attempts++

          // Clear the stale reachability cache so the loader performs a
          // fresh health check instead of returning the cached "unreachable"
          // result from the initial sync.
          resetApiGateCache()

          try {
            const reachable = await isApiReachable(apiUrl)

            if (!reachable) {
              throw new Error('API not reachable yet')
            }

            await doRefresh({})

            const last = getLastExecution()
            const lastStatus = last?.status
            const responseCount = Array.isArray(last?.response)
              ? last.response.length
              : 0

            // Only stop retrying once the loader has actually produced
            // a successful execution with data. If the API was reachable
            // but content refresh still ended empty or stale, keep trying.
            if (lastStatus === 'success' && responseCount > 0) {
              return
            }
          } catch {
            // Retry below.
          }

          if (attempts < retryMax) {
            timer = setTimeout(attemptRefresh, retryInterval)
            timer?.unref?.()
          } else {
            console.warn(
              `[postr] Dev content refresh gave up after ${retryMax} attempts. ` +
                'Restart the dev server once the API server is running.'
            )
          }
        }

        // Start the retry loop after a short grace period so the API
        // server has time to start.
        timer = setTimeout(attemptRefresh, retryDelay)
        timer?.unref?.()
      },
    },
  }
}
