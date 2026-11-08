export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  let location = false
  try {
    const url = process.env.DAWARICH_URL
    const apiKey = process.env.DAWARICH_API_KEY

    const response = await fetch(
      `${url}/api/v1/points?api_key=${apiKey}&per_page=1`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
        cache: 'no-store',
      }
    )
    const data = await response.json()
    if (Array.isArray(data) && data.length === 1) {
      location = data[0]
    }
  } catch (err) {
    console.error('[Error getting dawarich location]', err)
    return Response.json(
      { error: 'Error getting dawarich location' },
      { status: 500 }
    )
  }

  return Response.json({ location }, { status: 200 })
}
