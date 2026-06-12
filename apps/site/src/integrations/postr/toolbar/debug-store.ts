/**
 * Dev-only debug store for Postr loader executions.
 *
 * Bridges loader executions (server-side) with the dev toolbar app (client-side)
 * via the Astro dev toolbar's messaging system.
 *
 * In dev mode:
 *  1. `push()` is called by the loader after each execution
 *  2. The integration sets `setSend()` in `astro:server:setup` with the toolbar's
 *     `send` function
 *  3. `push()` stores data and sends it to all connected toolbar clients
 *  4. The toolbar app receives data via `server.on('postr:loader-data', ...)`
 *
 * Design note: This store is only imported dynamically from the loader when
 * `import.meta.env.DEV` is true, so it is tree-shaken from production builds.
 *
 * @remarks
 * Persists the last execution to a temp file so it survives Astro's
 * per-page context isolation. Uses `os.tmpdir()` for cross-platform
 * compatibility — critical for extraction to `@postr/astro`.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

type SendFn = (event: string, payload: unknown) => void

// Unique subdirectory under the OS temp dir to avoid collisions with
// other tools or projects using the same debug-store pattern.
const STORE_NS = 'grantcodes-postr-toolbar'
const STORE_DIR = join(tmpdir(), STORE_NS)
const STORE_FILE = join(STORE_DIR, 'last-execution.json')

let _send: SendFn | null = null
let _lastExecution: Record<string, unknown> | null = null

function writeLastExecution(data: Record<string, unknown>): void {
  try {
    if (!existsSync(STORE_DIR)) {
      mkdirSync(STORE_DIR, { recursive: true })
    }
    writeFileSync(STORE_FILE, JSON.stringify(data), 'utf-8')
  } catch {
    // Best-effort only; in-memory still works when contexts are shared.
  }
}

function readLastExecution(): Record<string, unknown> | null {
  try {
    if (!existsSync(STORE_FILE)) return null
    return JSON.parse(readFileSync(STORE_FILE, 'utf-8')) as Record<string, unknown>
  } catch {
    return null
  }
}

/**
 * Set the callback used to send data to toolbar clients.
 * Called by the integration in `astro:server:setup`.
 */
export function setSend(fn: SendFn | null): void {
  _send = fn
}

/**
 * Push a loader execution record.
 * Stores the data and sends it to connected toolbar clients if a send
 * callback is registered.
 */
export function push(data: Record<string, unknown>): void {
  _lastExecution = data
  writeLastExecution(data)
  if (_send) {
    _send('postr:loader-data', data)
  }
}

/**
 * Get the last stored execution record.
 * Used by the integration to re-send data to newly initialized toolbar apps.
 */
export function getLastExecution(): Record<string, unknown> | null {
  return _lastExecution ?? readLastExecution()
}
