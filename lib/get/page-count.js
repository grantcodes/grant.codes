const getPageCount = async (query = {}, limit = 10) => {
  const url = process.env.NEXT_PUBLIC_API_URL + '/api/page-count'
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.MICROPUB_TOKEN,
  }

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify({ query, limit }),
    timeout: 5000,
  })

  const { pageCount = 0 } = await res.json()

  return pageCount > 10 ? 10 : pageCount
}

export default getPageCount
