import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
      }
    )
    const data = await response.json()
    if (Array.isArray(data) && data.length === 1) {
      location = data[0]
    }
  } catch (err) {
    console.error('[Error getting owntracks location]', err)
    return res.status(500).send({ error: 'Error getting owntracks location' })
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ location }))
}
