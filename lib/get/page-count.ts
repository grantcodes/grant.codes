const getPageCount = async (query = {}, limit = 10): Promise<number> => {
  const url = process.env.NEXT_PUBLIC_API_URL + '/api/page-count'
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.MICROPUB_TOKEN,
  }

  try {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 15000)

    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query, limit }),
      signal: controller.signal,
    })

    const { pageCount = 0 } = await res.json()

    return pageCount > 10 ? 10 : pageCount
  } catch (err) {
    console.error('Error getting page count', query, err)
    return 0
  }
}

export default getPageCount
