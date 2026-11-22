import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import getPoints from './lib/get-monthly-points.js'
import getPosts from './lib/get-monthly-posts.js'
import getWeight from './lib/get-monthly-weight.js'

// Local runs read secrets from the repo root env file; CI passes them as env vars.
const envFile = new URL('../../../.env', import.meta.url)
if (existsSync(envFile)) process.loadEnvFile(envFile)

// Matches the jitter threshold the site uses when measuring track distance.
const MIN_POINT_DISTANCE_M = 50

const distanceM = ([lng1, lat1], [lng2, lat2]) => {
  const rad = Math.PI / 180
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) *
      Math.cos(lat2 * rad) *
      Math.sin(((lng2 - lng1) * rad) / 2) ** 2
  return 12742000 * Math.asin(Math.sqrt(a))
}

/** GeoJSON [lng, lat] coordinates, dropping points within MIN_POINT_DISTANCE_M of the last one kept. */
const toCoordinates = (points) => {
  const coordinates = []
  for (const { latitude, longitude } of points) {
    const point = [Number.parseFloat(longitude), Number.parseFloat(latitude)]
    if (!point.every(Number.isFinite)) continue
    const last = coordinates.at(-1)
    if (!last || distanceM(last, point) >= MIN_POINT_DISTANCE_M) {
      coordinates.push(point)
    }
  }
  return coordinates
}

const getData = async ({ year, month }) => {
  const from = new Date(Date.UTC(year, month - 1, 1))
  const to = new Date(Date.UTC(year, month, 1))
  const data = { postTypes: {} }

  const posts = await getPosts({ year, month })
  for (const post of posts) {
    const postType = post.cms?.postType
    if (postType) {
      data.postTypes[postType] = (data.postTypes[postType] ?? 0) + 1
    }
  }

  const points = await getPoints({ from, to })
  const coordinates = toCoordinates(points ?? [])
  if (coordinates.length) {
    data.geojson = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates },
    }
  }

  const body = await getWeight({ from, to })
  if (body) {
    data.body = body
  }

  console.log(
    `[${year}/${month}] ${posts.length} posts, ${points?.length ?? 0} points (${coordinates.length} kept), ${Object.keys(body ?? {}).length} body sensors`
  )

  const hasData = posts.length || coordinates.length || body
  return hasData ? data : null
}

const parseMonth = (value) => {
  const match = /^(\d{4})-(\d{1,2})$/.exec(value)
  const year = Number(match?.[1])
  const month = Number(match?.[2])
  if (!match || month < 1 || month > 12) {
    throw new Error(`Invalid month "${value}", expected YYYY-MM`)
  }
  return { year, month }
}

/** Expands `YYYY-MM` and `YYYY-MM..YYYY-MM` arguments; defaults to the previous month. */
const getMonths = (args) => {
  if (!args.length) {
    const now = new Date()
    const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
    return [{ year: previous.getUTCFullYear(), month: previous.getUTCMonth() + 1 }]
  }

  const months = []
  for (const arg of args) {
    const [start, end = start] = arg.split('..').map(parseMonth)
    for (
      let { year, month } = start;
      year * 12 + month <= end.year * 12 + end.month;
      month === 12 ? ((year += 1), (month = 1)) : (month += 1)
    ) {
      months.push({ year, month })
    }
  }
  return months
}

const save = process.argv.includes('--save')
const months = getMonths(process.argv.slice(2).filter((arg) => !arg.startsWith('--')))
let failed = false

for (const { year, month } of months) {
  try {
    const data = await getData({ year, month })
    if (!data) {
      console.warn(`[${year}/${month}] No data found, nothing to save`)
    } else if (save) {
      const dir = new URL(`../data/monthly/${year}/`, import.meta.url)
      mkdirSync(dir, { recursive: true })
      writeFileSync(new URL(`${month}.json`, dir), JSON.stringify(data, null, 2) + '\n')
    } else {
      console.log(JSON.stringify(data).slice(0, 500))
    }
  } catch (err) {
    failed = true
    console.error(`[${year}/${month}] Failed:`, err)
  }
}

if (failed) process.exitCode = 1
