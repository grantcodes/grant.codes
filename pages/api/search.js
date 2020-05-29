export default async (req, res) => {
  let posts = []

  try {
    console.log('Forwarding request. ', req.headers)
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/api/search',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization || '',
        },
        method: 'POST',
        body: JSON.stringify(req.body),
        timeout: 3000,
      }
    )
    posts = await response.json()
  } catch (err) {
    console.error('[Error getting posts]', err)
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify(posts))
}
