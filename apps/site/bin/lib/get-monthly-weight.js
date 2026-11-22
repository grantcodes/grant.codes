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
  return !isNaN(str) && !isNaN(parseFloat(str))
}

/**
 * Get body sensor history from Home Assistant between the given dates
 * @param {object} options The start and end dates
 * @returns {object|null} Readings by sensor, or null when there are none or Home Assistant is not configured
 */
const getWeight = async ({ from, to }) => {
  if (!process.env.HOME_ASSISTANT_URL || !process.env.HOME_ASSISTANT_KEY) {
    console.warn('[Skipping body data: HOME_ASSISTANT_URL or HOME_ASSISTANT_KEY not set]')
    return null
  }

  const apiUrl = `${
    process.env.HOME_ASSISTANT_URL
  }/api/history/period/${from.toISOString()}?end_time=${to.toISOString()}&filter_entity_id=${sensors.join(',')}`

  const response = await fetch(apiUrl, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.HOME_ASSISTANT_KEY}`,
    },
    signal: AbortSignal.timeout(60_000),
  })
  if (!response.ok) {
    throw new Error(`Home Assistant responded ${response.status}`)
  }
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

  return Object.keys(body).length ? body : null
}

export default getWeight
