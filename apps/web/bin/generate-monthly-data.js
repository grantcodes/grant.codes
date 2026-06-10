import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import dotenv from 'dotenv'
import getPoints from './lib/get-monthly-points.js'
import getPosts from './lib/get-monthly-posts.js'
import getWeight from './lib/get-monthly-weight.js'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.production' })

const __dirname = dirname(fileURLToPath(import.meta.url))

const getData = async ({ year, month } = {}) => {
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

  // Get dawarich data
  const points = await getPoints({ year, month })
  if (points?.length) {
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [],
      },
    }

    for (const { latitude, longitude } of points) {
      try {
        const lat = parseFloat(latitude)
        const lon = parseFloat(longitude)
        geojson.geometry.coordinates.push([lat, lon])
      } catch (err) {
        console.error(err)
        continue
      }
    }
    data.geojson = geojson
  }

  // Get body data
  const body = await getWeight({ year, month })
  if (body) {
    data.body = body
  }

  // TODO: Github data
  // TODO: Spotify data
  // TODO: Maybe Trakt tv data

  return data
}

const init = async () => {
  const currentDate = new Date()
  const saveData = process.argv.includes('--save')
  let year = process.argv.find((arg) => arg.startsWith('--year='))
  let month = process.argv.find((arg) => arg.startsWith('--month='))
  if (year) {
    year = parseInt(year.replace('--year=', ''))
  } else {
    year =
      month === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear()
  }
  if (month) {
    month = parseInt(month.replace('--month=', ''))
  } else {
    month = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth()
  }

  if (!month) {
  }

  const data = await getData({ year, month })

  if (data) {
    if (saveData) {
      console.log('[Saving data to disk]')
      const json = JSON.stringify(data, null, 2)
      const dir = join(__dirname, '..', 'data', 'monthly', year.toString())
      mkdirSync(dir, { recursive: true })
      writeFileSync(`${dir}/${month}.json`, json)
    } else {
      console.log('[Got data]')
      console.log(data)
    }
  } else {
    console.warn('[No data found]')
  }
}

init()
