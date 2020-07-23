const fs = require('fs')
const path = require('path')
const dotenv = require('next/dist/compiled/dotenv')
const fetch = require('next/dist/compiled/node-fetch')

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.production' })

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

/**
 * Get geojson features from owntracks for the given year and month
 * @param {object} options The year and month to search for
 * @returns {object|null} Geojson object on success
 */
const getLocations = async ({ year, month }) => {
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

const getBody = async ({ year, month }) => {
  try {
    if (!process.env.HOME_ASSISTANT_KEY) {
      throw new Error('Missing home assistant key')
    }

    const from = new Date(`${year}-${month}-01`)
    const to = new Date(new Date(from).setMonth(from.getMonth() + 1))
    const sensors = {
      weight: 'sensor.grant_weight',
      bmi: 'sensor.grant_bmi',
      water: 'sensor.grant_body_water',
      muscle: 'sensor.grant_body_muscle',
      fat: 'sensor.grant_body_fat',
    }

    const response = await fetch(
      `${
        process.env.HOME_ASSISTANT_URL
      }/api/history/period/${from.toISOString()}?end_time=${to.toISOString()}&filter_entity_id=${Object.values(
        sensors
      ).join(',')}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HOME_ASSISTANT_KEY}`,
        },
        method: 'GET',
      }
    )
    const data = await response.json()
    const body = {}
    for (const key in sensors) {
      body[key] = []
    }

    for (const change of data) {
      for (const item of change) {
        if (item.state && item.state !== 'unknown') {
          const itemKey = Object.keys(sensors).find(
            (key) => sensors[key] === item.entity_id
          )
          body[itemKey].push({
            time: new Date(item.last_updated),
            value: parseFloat(item.state),
          })
        }
      }
    }

    // Delete unused body keys
    for (const key in sensors) {
      if (body[key].length === 0) {
        delete body[key]
      }
    }

    // If there is no data return null
    if (Object.keys(body).length === 0) {
      return null
    }

    return body
  } catch (err) {
    console.log('[Error getting weight]', err)
    return null
  }
}

const getData = async ({ year, month } = {}) => {
  const currentDate = new Date()
  if (!month) {
    month = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth()
  }
  if (!year) {
    year =
      month === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()
  }
  console.log(`[Getting data for ${year}/${month}]`)

  const data = {
    postTypes: {},
  }

  // Get post data
  const posts = await getPosts({ year, month })
  for (const post of posts) {
    const { postType } = post.cms
    if (postType) {
      if (!data.postTypes[postType]) {
        data.postTypes[postType] = 0
      }
      data.postTypes[postType]++
    }
  }

  // Get owntracks data
  const geojson = await getLocations({ year, month })
  if (geojson?.geometry?.coordinates?.length) {
    data.geojson = geojson
  }

  // Get body data
  const body = await getBody({ year, month })
  if (body) {
    data.body = body
  }

  // TODO: Github data
  // TODO: Spotify data
  // TODO: Maybe Trakt tv data

  return data
}

const init = async () => {
  const saveData = process.argv.includes('--save')
  let year = process.argv.find((arg) => arg.startsWith('--year='))
  let month = process.argv.find((arg) => arg.startsWith('--month='))
  if (year) {
    year = parseInt(year.replace('--year=', ''))
  }
  if (month) {
    month = parseInt(month.replace('--month=', ''))
  }

  const data = await getData({ year, month })

  if (data) {
    if (saveData) {
      console.log('[Saving data to disk]')
      const json = JSON.stringify(data, null, 2)
      const dir = path.join(__dirname, '..', 'data', 'monthly', year.toString())
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(`${dir}/${month}.json`, json)
    } else {
      console.log('[Got data]')
      console.log(data)
    }
  } else {
    console.warn('[No data found]')
  }
}

init()
