import { parseCookies } from 'nookies'

const requireLogin = (ctx) => {
  const { token } = parseCookies(ctx)
  if (!token && ctx.res) {
    ctx.res.statusCode = 404
    ctx.res.status = 404
  }
  if (!token) {
    throw new Error('Not logged in')
  }
  return ctx
}

export default requireLogin
