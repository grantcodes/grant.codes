export interface LocationResult {
  id: number
  battery_status?: string
  ping?: number
  battery: number
  tracker_id: string
  topic: string
  altitude: number
  longitude: number | string
  velocity: number | string
  trigger: string
  bssid?: string
  ssid?: string
  connection: string
  vertical_accuracy: number
  accuracy: number
  timestamp: number
  latitude: number | string
  mode?: number
  raw_data?: string
  import_id?: string
  city?: string
  country?: string
  created_at?: string
  updated_at?: string
  user_id?: number
  geodata: any
  visit_id?: string
  reverse_geocoded_at?: string
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
      cache: 'no-store',
    })
    const { location } = await res.json()
    return location
  } catch (err) {
    console.error('[Error getting user location]', err)
  }
  return null
}
