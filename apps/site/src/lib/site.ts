/**
 * Public site and author details. Values match the live grant.codes; the legacy
 * NEXT_PUBLIC_* env vars still override them so deploy-time config keeps working.
 */
const env = import.meta.env

const url = env.NEXT_PUBLIC_URL ?? 'https://grant.codes'
const apiUrl = env.NEXT_PUBLIC_API_URL ?? 'https://backend.grant.codes'
const micropubUrl = env.NEXT_PUBLIC_MICROPUB_URL ?? `${apiUrl}/micropub`

export const site = {
  url,
  name: env.NEXT_PUBLIC_SITE_NAME ?? 'grant.codes',
  description:
    env.NEXT_PUBLIC_META_DESCRIPTION ??
    'Grant Richmond is a Scottish freelance web developer specializing in WordPress, front end and other dumb stuff.',
  metaImage: env.NEXT_PUBLIC_META_IMAGE ?? '',
  apiUrl,
  micropubUrl,
  hub: env.NEXT_PUBLIC_HUB ?? 'https://grantcodes.superfeedr.com/',
  microsubEndpoint: env.NEXT_PUBLIC_MICROSUB_ENDPOINT ?? 'https://aperture.p3k.io/microsub/2',
  // IndieKey, not env: the api verifies Micropub tokens against indiekey.id only.
  indieauthEndpoint: 'https://indiekey.id/s/fj2eb0bxsgcsgfm0/auth',
  indieauthMetadata:
    'https://indiekey.id/.well-known/oauth-authorization-server/s/fj2eb0bxsgcsgfm0',
  tokenEndpoint: 'https://indiekey.id/token',
  twitterHandle: env.NEXT_PUBLIC_TWITTER_HANDLE ?? 'grantcodes',
  author: {
    name: env.NEXT_PUBLIC_AUTHOR_NAME ?? 'Grant Richmond',
    email: env.NEXT_PUBLIC_AUTHOR_EMAIL ?? 'mail@grant.codes',
    photo: env.NEXT_PUBLIC_AUTHOR_PHOTO ?? `${apiUrl}/background/me.jpg`,
    featured: env.NEXT_PUBLIC_AUTHOR_FEATURED ?? '',
    github: env.NEXT_PUBLIC_AUTHOR_GITHUB ?? 'https://www.github.com/grantcodes',
    instagram: env.NEXT_PUBLIC_AUTHOR_INSTAGRAM ?? 'https://www.instagram.com/grantcodes',
  },
}
