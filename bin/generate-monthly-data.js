const fs = require('fs')
const path = require('path')
const dotenv = require('next/dist/compiled/dotenv')
import getGeojson from './lib/get-monthly-geojson'
import getPosts from './lib/get-monthly-posts'
import getWeight from './lib/get-monthly-weight'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.production' })

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
  const geojson = await getGeojson({ year, month })
  if (geojson?.geometry?.coordinates?.length) {
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
