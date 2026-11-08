/**
 * Get location points from dawarich for the given year and month
 * @param {object} options The year and month to search for
 * @returns {array|null} The points array on success
 */
const getPoints = async ({ year, month }) => {
  try {
    const url = process.env.DAWARICH_URL
    const apiKey = process.env.DAWARICH_API_KEY
    const from = new Date(`${year}-${month}-01`)
    const to = new Date(new Date(from).setMonth(from.getMonth() + 1))

    const response = await fetch(
      `${url}/api/v1/points?api_key=${apiKey}&start_at=${from.toISOString()}&end_at=${to.toISOString()}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    )
    const data = await response.json()
    console.log(`[Got locations for ${year}/${month}]`)
    return data
  } catch (err) {
    console.log('[Error getting locations]', err)
    return null
  }
}

export default getPoints
