import { setCookie } from 'nookies'
import auth from 'lib/auth'

const Auth = () => {
  return null
}

export const getServerSideProps = async (ctx) => {
  try {
    const { code } = ctx.query
    const me = await auth.verifyCode(code)

    if (me.startsWith(process.env.NEXT_PUBLIC_URL)) {
      const token = await auth.getToken(code)

      setCookie(ctx, 'token', token, {
        maxAge: 14 * 24 * 60 * 60,
        path: '/',
      })
    }
  } catch (err) {
    console.error('[Auth error]', err)
  }
  ctx.res.writeHead(302, { Location: '/' })
  ctx.res.end()
}

export default Auth
