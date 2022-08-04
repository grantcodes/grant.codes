const fetch = require('node-fetch')

const sensors = [
  'sensor.grant_basal_metabolism',
  'sensor.grant_bmi',
  'sensor.grant_body_fat',
  'sensor.grant_body_score',
  'sensor.grant_body_type',
  'sensor.grant_bone_mass',
  'sensor.grant_lean_body_mass',
  'sensor.grant_metabolic_age',
  'sensor.grant_muscle_mass',
  'sensor.grant_protein',
  'sensor.grant_visceral_fat',
  'sensor.grant_water',
  'sensor.grant_weight',
]

function isNumeric(str) {
  // if (typeof str != 'string') return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}

const getWeight = async ({ year, month }) => {
  try {
    if (!process.env.HOME_ASSISTANT_KEY) {
      throw new Error('Missing home assistant key')
    }

    const from = new Date(`${year}-${month}-01`)
    const to = new Date(new Date(from).setMonth(from.getMonth() + 1))
    const apiUrl = `${
      process.env.HOME_ASSISTANT_URL
    }/api/history/period/${from.toISOString()}?end_time=${to.toISOString()}&filter_entity_id=${Object.values(
      sensors
    ).join(',')}`

    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HOME_ASSISTANT_KEY}`,
      },
      method: 'GET',
    })
    const data = await response.json()
    const body = {}

    for (const sensorEntries of data) {
      for (const entry of sensorEntries) {
        const time = new Date(entry.last_updated)
        const key = entry.entity_id.replace('sensor.grant_', '')
        if (
          entry.state &&
          entry.state !== 'unknown' &&
          entry.state !== 'unavailable'
        ) {
          const value = isNumeric(entry.state)
            ? parseFloat(entry.state)
            : entry.state

          if (value) {
            if (!body[key]) {
              body[key] = []
            }

            body[key].push({ time, value })
          }
        }
      }
    }

    // Delete unused body keys
    for (const key in body) {
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
