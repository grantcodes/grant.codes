export default async function getLastLocation() {
  try {
    const url = '/api/last-location'
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const { location } = await res.json()
    return location
  } catch (err) {
    console.error('[Error getting user location]', err)
  }
  return null
}
