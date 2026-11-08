import normalizeSearchQuery from 'lib/get/normalize-search-query'

const getPosts = async (ctx) => {
  let timeout

  try {
    const { query = {}, limit = 10, showAll = false } = ctx
    const token = ctx?.previewData?.token ?? null
    const normalizedQuery = normalizeSearchQuery(query)
    const controller = new AbortController()
    timeout = setTimeout(() => controller.abort(), 15000)

    const url = process.env.NEXT_PUBLIC_API_URL + '/api/search'
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (token) {
      headers.Authorization = 'Bearer ' + token
    } else if (process.env.MICROPUB_TOKEN) {
      headers.Authorization = 'Bearer ' + process.env.MICROPUB_TOKEN
    }

    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query: normalizedQuery, limit, showAll }),
      signal: controller.signal,
      next: {
        revalidate: 60 * 30,
      },
    })
    const data = await res.json()
    const posts = Array.isArray(data) ? data : []
    return posts
  } catch (err) {
    console.warn('[Error getting posts]', err)
    return []
  } finally {
    clearTimeout(timeout)
  }
}

export default getPosts
