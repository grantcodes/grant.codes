export interface LocationResult {
  _type: string
  BSSID: string
  SSID: string
  acc: number
  alt: number
  batt: number
  bs: number
  conn: string
  created_at: number
  lat: number
  lon: number
  m: number
  t: string
  tid: string
  tst: number
  vac: number
  vel: number
  topic: string
  username: string
  device: string
  ghash: string
  isotst: string
  disptst: string
  addr?: string
}

export default async function getLastLocation(): Promise<LocationResult | null> {
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
