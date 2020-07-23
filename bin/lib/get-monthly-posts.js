const fetch = require('next/dist/compiled/node-fetch')

/**
 * Gets all posts for the given year and month
 * @param {object} options Year and month to search for
 * @returns {array} Array of posts
 */
const getPosts = async ({ year, month }) => {
  try {
    const query = { year, month, type: 'all' }
    const url = process.env.NEXT_PUBLIC_API_URL + '/api/search'
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (process.env.MICROPUB_TOKEN) {
      headers.Authorization = 'Bearer ' + process.env.MICROPUB_TOKEN
    }

    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query, limit: 99999, showAll: true }),
      timeout: 15000,
    })
    const data = await res.json()
    const posts = Array.isArray(data) ? data : []
    console.log(`[Got ${posts.length} posts for ${year}/${month}]`)
    return posts
  } catch (err) {
    console.warn('[Error getting posts]', err)
    return []
  }
}

module.exports = getPosts
