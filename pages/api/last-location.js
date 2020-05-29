export default async (req, res) => {
  let location = false
  try {
    const url = process.env.OWNTRACKS_URL
    const username = process.env.OWNTRACKS_USERNAME
    const password = process.env.OWNTRACKS_PASSWORD
    const user = process.env.OWNTRACKS_USER
    const device = process.env.OWNTRACKS_DEVICE
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(
      `${url}/api/0/last/?user=${user}&device=${device}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        method: 'GET',
        timeout: 3000,
      }
    )
    const data = await response.json()
    if (data.location) {
      location = data.location
    }
  } catch (err) {
    console.error('[Error getting posts]', err)
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ location }))
}
