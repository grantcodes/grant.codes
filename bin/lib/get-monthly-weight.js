const fetch = require('node-fetch')

const ignoredAttributes = [
  'friendly_name',
  'icon',
  'weight_unit',
  'timestamp',
  'restored',
  'supported_features',
  'unit_of_measurement',
]

const getWeight = async ({ year, month }) => {
  try {
    if (!process.env.HOME_ASSISTANT_KEY) {
      throw new Error('Missing home assistant key')
    }

    const from = new Date(`${year}-${month}-01`)
    const to = new Date(new Date(from).setMonth(from.getMonth() + 1))
    const sensors = ['sensor.grant_weight', 'sensor.grant_weight_2']
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
    const body = {
      weight: [],
    }

    for (const change of data) {
      for (const item of change) {
        const time = new Date(item.last_updated)
        if (item.state && item.state !== 'unknown') {
          const weightVal = parseFloat(item.state)
          if (weightVal) {
            body.weight.push({
              time,
              value: weightVal,
            })
          }
        }
        if (item.attributes && typeof item.attributes === 'object') {
          for (const attributeKey in item.attributes) {
            if (!ignoredAttributes.includes(attributeKey)) {
              const attributeValue = item.attributes[attributeKey]
              if (!body[attributeKey]) {
                body[attributeKey] = []
              }

              body[attributeKey].push({
                time,
                value: attributeValue,
              })
            }
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
