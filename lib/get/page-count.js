const queryCache = []

const getPageCount = async (query = {}, limit = 10) => {
  const queryJson = JSON.stringify({ query, limit })

  // Check cache first
  const cachedResult = queryCache.find((cache) => cache.queryJson === queryJson)
  if (cachedResult) {
    return cachedResult.pageCount
  }

  // Now get from API
  const url = process.env.NEXT_PUBLIC_API_URL + '/api/page-count'
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: queryJson,
    timeout: 5000,
  })
  const { pageCount } = await res.json()

  // Save to cache
  queryCache.push({ queryJson, pageCount })

  return pageCount
}

export default getPageCount
