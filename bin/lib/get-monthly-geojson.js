const fetch = require('next/dist/compiled/node-fetch')

/**
 * Get geojson features from owntracks for the given year and month
 * @param {object} options The year and month to search for
 * @returns {object|null} Geojson object on success
 */
const getGeojson = async ({ year, month }) => {
  try {
    const url = process.env.OWNTRACKS_URL
    const username = process.env.OWNTRACKS_USERNAME
    const password = process.env.OWNTRACKS_PASSWORD
    const user = process.env.OWNTRACKS_USER
    const device = process.env.OWNTRACKS_DEVICE
    const auth = Buffer.from(`${username}:${password}`).toString('base64')
    const from = new Date(`${year}-${month}-01`)
    const to = new Date(new Date(from).setMonth(from.getMonth() + 1))

    const response = await fetch(
      `${url}/api/0/locations/?format=linestring&user=${user}&device=${device}&from=${from.toISOString()}&to=${to.toISOString()}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
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

module.exports = getGeojson
