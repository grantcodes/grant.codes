/**
 * Gets all posts for the given year and month
 * @param {object} options Year and month to search for
 * @returns {array} Array of posts
 */
const getPosts = async ({ year, month }) => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL not set')
  }

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (process.env.MICROPUB_TOKEN) {
    headers.Authorization = 'Bearer ' + process.env.MICROPUB_TOKEN
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/search', {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query: { year, month, type: 'all' },
      limit: 99999,
      showAll: true,
    }),
    signal: AbortSignal.timeout(60_000),
  })
  if (!res.ok) {
    throw new Error(`Post search responded ${res.status}`)
  }
  const posts = await res.json()
  if (!Array.isArray(posts)) {
    throw new Error('Post search did not return an array')
  }
  return posts
}

export default getPosts
