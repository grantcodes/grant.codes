import { parseCookies } from 'nookies'

const { token } = parseCookies({})

const isAdmin = !!token

export default isAdmin
