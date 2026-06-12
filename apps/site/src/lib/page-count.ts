import normalizeSearchQuery from './normalize-search-query'
import { isApiReachable } from './api-gate'

export interface PageCountConfig {
  apiUrl?: string
  token?: string | null
}

const getPageCount = async (
  query: Record<string, unknown> = {},
  limit: number = 10,
  config: PageCountConfig = {}
): Promise<number> => {
  const { apiUrl = 'https://backend.grant.codes', token = null } = config

  // Skip API calls if the API was previously unreachable
  if (!(await isApiReachable(apiUrl))) {
    return 1 // default to 1 page for graceful fallback
  }

  const normalizedQuery = normalizeSearchQuery(query)
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const res = await fetch(`${apiUrl}/api/page-count`, {
      signal: controller.signal,
      headers,
      method: 'POST',
      body: JSON.stringify({ query: normalizedQuery, limit }),
    })

    clearTimeout(timeout)

    const { pageCount = 0 } = await res.json()
    return pageCount > 10 ? 10 : pageCount
  } catch (err) {
    console.error('Error getting page count', query, err)
    return 0
  }
}

export default getPageCount
