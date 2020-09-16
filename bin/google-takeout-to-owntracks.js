const fs = require('fs')
const path = require('path')
const dotenv = require('next/dist/compiled/dotenv')
const fetch = require('next/dist/compiled/node-fetch')
const { chain } = require('stream-chain')
const { parser } = require('stream-json')
const { pick } = require('stream-json/filters/Pick')
const { streamArray } = require('stream-json/streamers/StreamArray')

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.production' })
/**

 */
const url = process.env.OWNTRACKS_URL
const username = process.env.OWNTRACKS_USERNAME
const password = process.env.OWNTRACKS_PASSWORD
const user = process.env.OWNTRACKS_USER
const device = process.env.OWNTRACKS_DEVICE

const postLocation = async (data) => {
  try {
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(`${url}/pub?u=${user}&d=${device}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
    const res = await response.json()
    return res
  } catch (err) {
    console.warn('[Error posting location]', err)
    return null
  }
}

const googleToOwntracks = ({ value }) => {
  const defaults = {
    _type: 'location',
    tid: 'me',
    topic: `owntracks/${user}/${device}`,
    // tst: UNIX epoch timestamp in seconds
    // lat: Latitude
    // lon: Longitude
    // acc: Accuracy
    // alt:Altitude
    // batt: Battery%
    // vel: Velocity kph
  }
  if (value.placeVisit && value.placeVisit.location) {
    const place = value.placeVisit
    // const loc = value.placeVisit.location
    const data = {
      lat: place.centerLatE7 / 10000000,
      lon: place.centerLonE7 / 10000000,
      tst: Math.round(parseInt(place.duration.startTimestampMs) / 1000),
    }

    // console.log(value.placeVisit)
    return { ...defaults, ...data }
  } else if (value.activitySegment) {
    const seg = value.activitySegment
    const start = {
      lat: seg.startLocation.latitudeE7 / 10000000,
      lon: seg.startLocation.longitudeE7 / 10000000,
      tst: Math.round(parseInt(seg.duration.startTimestampMs) / 1000),
    }
    const end = {
      lat: seg.endLocation.latitudeE7 / 10000000,
      lon: seg.endLocation.longitudeE7 / 10000000,
      tst: Math.round(parseInt(seg.duration.endTimestampMs) / 1000),
    }
    // TODO: Could also figure out the route from seg.waypointPath.waypoints - but they dont have timestamps
    return [
      { ...defaults, ...start },
      { ...defaults, ...end },
    ]
  } else if (
    value.timestampMs &&
    typeof value.latitudeE7 !== 'undefined' &&
    typeof value.longitudeE7 !== 'undefined' &&
    typeof value.accuracy !== 'undefined'
  ) {
    // Only pick accurate locations
    if (value.accuracy > 25) {
      return null
    }

    //   Default data
    let data = {
      lat: value.latitudeE7 / 10000000,
      lon: value.longitudeE7 / 10000000,
      tst: Math.round(parseInt(value.timestampMs) / 1000),
      acc: value.accuracy,
    }

    //   Add altidude
    if (
      typeof value.altitude !== 'undefined' &&
      typeof value.verticalAccuracy !== 'undefined' &&
      value.verticalAccuracy < 10
    ) {
      data.alt = value.altitude
    }

    //   Add velocity - converting meters per second to kph
    if (typeof value.velocity !== 'undefined') {
      data.vel = value.velocity * 3.6
    }

    return { ...defaults, ...data }
  }

  console.warn('[Unable to parse location]', value)

  return null
}

const init = async () => {
  const fileString = process.argv
    .find((arg) => arg.startsWith('--file='))
    .replace('--file=', '')
  const file = path.normalize(fileString)
  console.log('[Reading file]', file)

  const pipeline = chain([
    fs.createReadStream(file),
    parser(),
    pick({ filter: 'locations' }),
    streamArray(),
    googleToOwntracks,
  ])

  let counter = 0
  pipeline.on('data', async (data) => {
    if (!data) {
      return
    }

    if (Array.isArray(data)) {
      for (const item of data) {
        counter++
        await postLocation(item)
      }
    } else if (typeof data === 'object') {
      counter++
      await postLocation(data)
    }
  })

  pipeline.on('end', () => console.log(`[Parsed ${counter} items]`))
}

init()
