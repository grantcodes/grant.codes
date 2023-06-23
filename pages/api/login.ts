import { NextApiRequest, NextApiResponse } from 'next'
import auth from 'lib/auth'

export default async function loginRoute (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req?.query?.code) {
    try {
      const { code } = req.query
      const token = await auth.getToken(code)
      res.setPreviewData({ token }, { maxAge: 14 * 24 * 60 * 60 })
    } catch (err) {
      console.error('[Auth error]', err)
    }
    res.writeHead(302, { Location: '/' })
    return res.end()
  }

  const redirect = await auth.getAuthUrl('code', ['create', 'update', 'delete'])
  if (redirect && res && res.writeHead) {
    res.writeHead(302, { Location: redirect })
    return res.end()
  }

  return res.status(500).send({ error: 'Something not defined' })
}
