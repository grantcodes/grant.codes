import IndieAuth from 'indieauth-helper'

const auth = new IndieAuth({
  clientId: process.env.NEXT_PUBLIC_URL,
  redirectUri: `${process.env.NEXT_PUBLIC_URL}/api/login`,
  me: process.env.NEXT_PUBLIC_AUTH_ME,
  secret: process.env.INDIEAUTH_SECRET,
  authEndpoint: process.env.NEXT_PUBLIC_INDIEAUTH_ENDPOINT,
  tokenEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/token`,
})

export default auth
