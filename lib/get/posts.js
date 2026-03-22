const getPosts = async (ctx) => {
  try {
    const { query = {}, limit = 10, showAll = false } = ctx
    const token = ctx?.previewData?.token ?? null

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
      body: JSON.stringify({ query, limit, showAll }),
      timeout: 15000,
      next: {
        revalidate: 60 * 60 * 12,
      },
    })
    const data = await res.json()
    const posts = Array.isArray(data) ? data : []
    return posts
  } catch (err) {
    console.warn('[Error getting posts]', err)
    return []
  }
}

export default getPosts
