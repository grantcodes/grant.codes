export default async function () {
  try {
    const url = '/api/last-location'
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      method: 'GET',
      timeout: 5000,
    })
    const { location } = await res.json()
    return location
  } catch (err) {
    console.error('[Error getting user location]', err)
  }
  return null
}
