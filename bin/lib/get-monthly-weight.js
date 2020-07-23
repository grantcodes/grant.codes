const fetch = require('next/dist/compiled/node-fetch')

const getWeight = async ({ year, month }) => {
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

module.exports = getWeight
