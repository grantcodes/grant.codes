import Micropub from 'micropub-helper'

const micropub = new Micropub({
  clientId: process.env.NEXT_PUBLIC_URL,
  redirectUri: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
  me: process.env.NEXT_PUBLIC_URL,
  secret: process.env.INDIEAUTH_SECRET,
  authEndpoint: process.env.NEXT_PUBLIC_INDIEAUTH_ENDPOINT,
  tokenEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/token`,
  micropubEndpoint: process.env.NEXT_PUBLIC_MICROPUB_URL,
  mediaEndpoint: `${process.env.NEXT_PUBLIC_MICROPUB_URL}/media`,
  token: process.env.MICROPUB_TOKEN,
})

export default micropub
