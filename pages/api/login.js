import auth from 'lib/auth'

export default async function loginRoute(req, res) {
  if (req?.query?.code) {
    try {
      const { code } = req.query
      const me = await auth.verifyCode(code)

      if (me.startsWith(process.env.NEXT_PUBLIC_AUTH_ME)) {
        const token = await auth.getToken(code)
        res.setPreviewData({ token }, { maxAge: 14 * 24 * 60 * 60 })
      } else {
        console.warn("[Some ne'er-do-well attempted to log in]", me)
      }
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

  return res.error({ error: 'Something not defined' })
}
