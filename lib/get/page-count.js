const getPageCount = async (query = {}, limit = 10) => {
  const url = process.env.NEXT_PUBLIC_API_URL + '/api/page-count'
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify({ query, limit }),
    timeout: 5000,
  })

  const { pageCount } = await res.json()

  return pageCount > 5 ? 5 : pageCount
}

export default getPageCount
