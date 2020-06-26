import Document, { Html, Head, Main, NextScript } from 'next/document'

const url = process.env.NEXT_PUBLIC_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const description = process.env.NEXT_PUBLIC_META_DESCRIPTION
const image = JSON.parse(process.env.NEXT_PUBLIC_META_IMAGE)
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME
const authorPhoto = process.env.NEXT_PUBLIC_AUTHOR_PHOTO
const authorEmail = process.env.NEXT_PUBLIC_AUTHOR_EMAIL
const fb = process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK
const tw = process.env.NEXT_PUBLIC_AUTHOR_TWITTER
const ig = process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM
const gh = process.env.NEXT_PUBLIC_AUTHOR_GITHUB
const micropub = process.env.NEXT_PUBLIC_MICROPUB_URL
const hub = process.env.NEXT_PUBLIC_HUB
const indieauth = process.env.NEXT_PUBLIC_INDIEAUTH_ENDPOINT
const microsub = process.env.NEXT_PUBLIC_MICROSUB_ENDPOINT
const twHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE
const api = process.env.NEXT_PUBLIC_API_URL

const links = [
  {
    rel: 'apple-touch-icon',
    sizes: '114x114',
    href: '/icons/apple-touch-icon-114x114.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: '/icons/apple-touch-icon-120x120.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '144x144',
    href: '/icons/apple-touch-icon-144x144.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: '/icons/apple-touch-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/icons/apple-touch-icon-180x180.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '57x57',
    href: '/icons/apple-touch-icon-57x57.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '60x60',
    href: '/icons/apple-touch-icon-60x60.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '72x72',
    href: '/icons/apple-touch-icon-72x72.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '76x76',
    href: '/icons/apple-touch-icon-76x76.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)',
    href: '/icons/apple-touch-startup-image-320x460.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)',
    href: '/icons/apple-touch-startup-image-640x920.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
    href: '/icons/apple-touch-startup-image-640x1096.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
    href: '/icons/apple-touch-startup-image-750x1294.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)',
    href: '/icons/apple-touch-startup-image-1182x2208.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)',
    href: '/icons/apple-touch-startup-image-1242x2148.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)',
    href: '/icons/apple-touch-startup-image-748x1024.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)',
    href: '/icons/apple-touch-startup-image-1496x2048.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)',
    href: '/icons/apple-touch-startup-image-768x1004.png',
  },
  {
    rel: 'apple-touch-startup-image',
    media:
      '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
    href: '/icons/apple-touch-startup-image-1536x2008.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/icons/favicon-16x16.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '228x228',
    href: '/icons/coast-228x228.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/icons/favicon-32x32.png',
  },
  { rel: 'shortcut icon', href: '/icons/favicon.ico' },
  { rel: 'manifest', href: '/manifest.json' },

  { rel: 'self', href: url },
  { rel: 'canonical', href: url },
  {
    rel: 'authorization_endpoint',
    href: process.env.NEXT_PUBLIC_INDIEAUTH_ENDPOINT,
  },
  { rel: 'token_endpoint', href: url + '/token' },
  { rel: 'hub', href: process.env.NEXT_PUBLIC_HUB },
  { rel: 'microsub', href: process.env.NEXT_PUBLIC_MICROSUB_ENDPOINT },
  { rel: 'micropub', href: micropub },
  { rel: 'webmention', href: micropub + '/plugin/webmention' },
  {
    rel: 'alternate',
    type: 'application/jf2feed+json',
    title: `${name} | jf2 feed`,
    href: `${micropub}/plugin/feeds/jf2`,
  },
  {
    rel: 'alternate',
    type: 'application/json',
    title: `${name} | json feed`,
    href: `${micropub}/plugin/feeds/json`,
  },
  {
    rel: 'alternate',
    type: 'application/atom+xml',
    title: `${name} | atom feed`,
    href: `${micropub}/plugin/feeds/atom`,
  },
  {
    rel: 'alternate',
    type: 'application/rss+xml',
    title: `${name} | rss feed`,
    href: `${micropub}/plugin/feeds/rss`,
  },
  {
    rel: 'alternate',
    type: 'application/mf2+json',
    title: `${name} | microformats2 json feed`,
    href: `${micropub}/plugin/feeds/mf2json`,
  },
]

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {links.map((props, i) => (
            <link key={`link-${i}`} {...props} />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
