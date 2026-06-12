/**
 * Postr Loader — Astro dev toolbar app.
 *
 * Dev-only client-side app that displays loader execution data:
 * - Query info (type, filters, limit, API URL)
 * - Fetch status (success, entry count, timing)
 * - Raw response JSON viewer (redacted by default)
 * - Normalized MF2 output viewer
 *
 * @see https://docs.astro.build/en/reference/dev-toolbar-app-reference/
 */

import { defineToolbarApp } from 'astro/toolbar'

type LoaderData = Record<string, unknown>

// Keys whose values are redacted by default in the toolbar view
const SENSITIVE_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'api-key',
  'token',
  'secret',
  'password',
  'auth-token',
  'auth_token',
])

// ─── helpers ───────────────────────────────────────────────────────────────

/** Escape HTML entities for safe innerHTML insertion. */
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Maximum array items to show in the default (truncated) JSON view.
 * When the data exceeds this limit, only the first N items are shown
 * with a placeholder entry indicating how many were truncated.
 * In raw mode (redact=false), truncation is skipped so the full data
 * is visible.
 */
const TRUNCATE_ITEMS = 5

/** Format JSON for display with optional redaction and truncation. */
function formatJSON(value: unknown, redact: boolean): string {
  // Skip truncation in raw mode — user explicitly opted into full data
  const processed = redact ? truncateArrays(redactSensitive(value), TRUNCATE_ITEMS) : value
  return esc(JSON.stringify(processed, null, 2))
}

/**
 * Recursively walk data and truncate large arrays.
 *
 * Arrays with more than `maxItems` entries are sliced to show only
 * the first `maxItems`. A descriptive string placeholder is appended
 * noting how many entries were hidden from the default view.
 */
function truncateArrays(value: unknown, maxItems: number): unknown {
  if (maxItems <= 0) return value

  if (Array.isArray(value)) {
    if (value.length <= maxItems) {
      return value.map((v) => truncateArrays(v, maxItems))
    }
    const total = value.length
    const sliced = value.slice(0, maxItems).map((v) => truncateArrays(v, maxItems))
    sliced.push(
      `[⋯ truncated ${total - maxItems} of ${total} entries — toggle raw mode to see all]`
    )
    return sliced
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = truncateArrays(val, maxItems)
    }
    return result
  }

  return value
}

/** Recursively walk data and redact sensitive field values. */
function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitive)
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        result[key] = '[REDACTED]'
      } else {
        result[key] = redactSensitive(val)
      }
    }
    return result
  }
  return value
}

/** Build a summary string from query options. */
function querySummary(data: LoaderData): string {
  const q = data.request as Record<string, unknown> | undefined
  if (!q) return '—'
  const parts: string[] = []
  if (q.typeOrYear) parts.push(String(q.typeOrYear))
  if (q.month) parts.push(`month:${q.month}`)
  if (q.day) parts.push(`day:${q.day}`)
  if (q.slug) parts.push(`slug:${q.slug}`)
  if (q.limit) parts.push(`limit:${q.limit}`)
  return parts.join(', ') || '(default)'
}

/** Human-readable elapsed time. */
function fmtMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// ─── toolbar app export ───────────────────────────────────────────────────

export default defineToolbarApp({
  init(canvas, _eventTarget, server): void {
    let data: LoaderData | null = null
    let rawMode = false

    // Listen for incoming data from server
    server.on('postr:loader-data', (d) => {
      data = d as LoaderData
      render()
    })

    // Render immediately so the app is never blank while waiting for data.
    render()

    // Request any existing last data
    server.send('postr:get-last-data', {})

    // ─── render ───────────────────────────────────────────────────────

    function render(): void {
      // Clear previous content
      canvas.innerHTML = ''

      const win = document.createElement('astro-dev-toolbar-window')
      win.innerHTML = buildUI(data, rawMode)

      // Wire raw mode toggle
      const toggle = win.querySelector('#postr-raw-toggle') as
        | (HTMLElement & { input?: HTMLInputElement })
        | null
      const toggleInput = toggle?.input ?? null

      if (toggleInput) {
        toggleInput.checked = rawMode
        toggleInput.addEventListener('change', () => {
          rawMode = toggleInput.checked
          render()
        })
      }

      canvas.append(win)
    }
  },
})

// ─── UI builder ───────────────────────────────────────────────────────────

function buildUI(data: LoaderData | null, rawMode: boolean): string {
  if (!data) {
    return `
<style>
  .app {
    max-block-size: min(72dvh, 46rem);
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding-inline-end: 0.25rem;
  }
  .waiting { padding: 2rem; text-align: center; color: rgba(255,255,255,0.6); }
</style>
<div class="app">
  <div class="waiting">
    <p>Waiting for a Postr loader execution…</p>
    <p class="hint">Load a page that uses a postrLoader-backed collection.</p>
  </div>
</div>`
  }

  const request = data.request as Record<string, unknown> | undefined
  const response = data.response as unknown[] | undefined
  const normalized = data.normalized as unknown[] | undefined
  const status = String(data.status ?? '—')
  const apiUrl = String(data.apiUrl ?? '—')
  const entryCount = response?.length ?? 0
  const normCount = normalized?.length ?? 0
  const timing = data.timing as Record<string, number> | undefined
  const elapsed = timing ? fmtMs(timing.end - timing.start) : '—'
  const summary = querySummary(data)

  const rawJSON = formatJSON(response ?? [], !rawMode)
  const normJSON = formatJSON(normalized ?? [], !rawMode)

  const isSuccess = status === 'success'
  const badgeStyle = isSuccess ? 'green' : status === 'empty' ? 'gray' : 'red'
  const badgeLabel = isSuccess
    ? `✓ ${entryCount} entries`
    : status === 'empty'
      ? '∅ empty'
      : `✗ ${status}`

  return `
<style>
  .app {
    max-block-size: min(72dvh, 46rem);
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding-inline-end: 0.25rem;
  }

  :host {
    --postr-bg: #1a1b1e;
    --postr-border: rgba(255,255,255,0.08);
    --postr-text: rgba(255,255,255,0.85);
    --postr-muted: rgba(255,255,255,0.5);
    --postr-accent: #5f9ea0;
    --postr-warning: #e8a838;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  header h1 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  header h1 svg {
    width: 20px;
    height: 20px;
  }

  .section {
    margin-bottom: 16px;
  }

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 600;
    color: var(--postr-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--postr-border);
  }

  .stat-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stat-label {
    font-size: 11px;
    color: var(--postr-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 14px;
    color: var(--postr-text);
    font-family: monospace;
  }

  .stat-value.url {
    word-break: break-all;
    font-size: 12px;
  }

  pre {
    background: rgba(0,0,0,0.3);
    border-radius: 6px;
    padding: 12px;
    overflow-x: auto;
    max-block-size: min(28dvh, 18rem);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    font-size: 12px;
    line-height: 1.5;
    color: var(--postr-text);
    margin: 0;
    white-space: pre;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .toggle-row label {
    font-size: 12px;
    color: var(--postr-muted);
    cursor: pointer;
  }

  .warning-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--postr-warning);
    background: rgba(232,168,56,0.1);
    border: 1px solid rgba(232,168,56,0.3);
    border-radius: 4px;
    padding: 2px 8px;
  }

  .no-data {
    color: var(--postr-muted);
    font-size: 13px;
    font-style: italic;
  }

  .hint {
    font-size: 12px;
    color: var(--postr-muted);
    margin-top: 4px;
  }

  .json-block {
    min-inline-size: 0;
  }
</style>

<div class="app">
<header>
  <h1>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
    Postr Loader
  </h1>
  <astro-dev-toolbar-badge badge-style="${badgeStyle}">${badgeLabel}</astro-dev-toolbar-badge>
</header>

<!-- Query Info -->
<div class="section">
  <div class="section-title">Query</div>
  <div class="stat-row">
    <div class="stat">
      <span class="stat-label">Type / filters</span>
      <span class="stat-value">${esc(summary)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">API URL</span>
      <span class="stat-value url">${esc(apiUrl)}</span>
    </div>
  </div>
</div>

<!-- Fetch Status -->
<div class="section">
  <div class="section-title">Status</div>
  <div class="stat-row">
    <div class="stat">
      <span class="stat-label">Timing</span>
      <span class="stat-value">${esc(elapsed)}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Raw entries</span>
      <span class="stat-value">${entryCount}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Normalized</span>
      <span class="stat-value">${normCount}</span>
    </div>
    <div class="stat" style="flex-basis:100%;margin-top:4px;">
      <span class="stat-label">Request options</span>
      <pre class="json-block"><code>${formatJSON(request ?? {}, !rawMode)}</code></pre>
    </div>
  </div>
</div>

<!-- Raw Response -->
<div class="section">
  <div class="section-title">
    <span>Raw Response</span>
    <div class="toggle-row">
      <astro-dev-toolbar-toggle id="postr-raw-toggle"${rawMode ? ' checked' : ''}></astro-dev-toolbar-toggle>
      <label for="postr-raw-toggle">Raw mode</label>
      ${rawMode ? '<span class="warning-badge">⚠ Sensitive data visible</span>' : ''}
    </div>
  </div>
  ${rawMode ? '<p class="hint" style="margin-top:-8px;margin-bottom:8px;color:var(--postr-warning);">Raw mode shows unredacted data including potential auth tokens, headers, and internal URLs.</p>' : ''}
  <pre class="json-block"><code>${rawJSON}</code></pre>
</div>

<!-- Normalized Output -->
<div class="section">
  <div class="section-title">Normalized Output</div>
  <pre class="json-block"><code>${normJSON}</code></pre>
</div>
</div>
`
}
