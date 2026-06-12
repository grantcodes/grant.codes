import normalizeSearchQuery from './normalize-search-query'
import { isApiReachable } from './api-gate'

function normalizeLocalApiUrl(apiUrl: string): string {
  return apiUrl.replace('://localhost:', '://127.0.0.1:')
}

export interface PostsConfig {
  apiUrl?: string
  token?: string | null
  /** Fetch timeout in milliseconds. Default: 3000. */
  timeout?: number
}

export interface PostsContext {
  query?: Record<string, unknown>
  limit?: number
  showAll?: boolean
}

const getPosts = async (
  ctx: PostsContext = {},
  config: PostsConfig = {}
): Promise<any[]> => {
  const { query = {}, limit = 10, showAll = false } = ctx
  const {
    apiUrl = 'https://backend.grant.codes',
    token = null,
    timeout: fetchTimeout = 3000,
  } = config
  const normalizedApiUrl = normalizeLocalApiUrl(apiUrl)

  const normalizedQuery = normalizeSearchQuery(query)

  // Skip API calls if the API was previously unreachable
  if (!(await isApiReachable(normalizedApiUrl))) {
    return []
  }

  try {
    const controller = new AbortController()
    const abortTimer = setTimeout(() => controller.abort(), fetchTimeout)

    const url = `${normalizedApiUrl}/api/search`
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query: normalizedQuery, limit, showAll }),
      signal: controller.signal,
    })

    clearTimeout(abortTimer)

    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('[Error getting posts]', err)
    return []
  }
}

export default getPosts
