const PER_PAGE = 10000

/**
 * Get location points from dawarich between the given dates, oldest first
 * @param {object} options The start (inclusive) and end (exclusive) dates
 * @returns {array|null} The points array, or null when dawarich is not configured
 */
const getPoints = async ({ from, to }) => {
  const url = process.env.DAWARICH_URL
  const apiKey = process.env.DAWARICH_API_KEY
  if (!url || !apiKey) {
    console.warn('[Skipping locations: DAWARICH_URL or DAWARICH_API_KEY not set]')
    return null
  }

  // Dawarich's end_at is inclusive
  const endAt = new Date(to.getTime() - 1000)
  const points = []
  for (let page = 1, totalPages = 1; page <= totalPages; page++) {
    const params = new URLSearchParams({
      api_key: apiKey,
      start_at: from.toISOString(),
      end_at: endAt.toISOString(),
      order: 'asc',
      slim: 'true',
      per_page: String(PER_PAGE),
      page: String(page),
    })
    const response = await fetch(`${url}/api/v1/points?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(120_000),
    })
    if (!response.ok) {
      throw new Error(`Dawarich responded ${response.status}`)
    }
    points.push(...(await response.json()))
    totalPages = Number(response.headers.get('X-Total-Pages')) || 1
  }

  return points
}

export default getPoints
