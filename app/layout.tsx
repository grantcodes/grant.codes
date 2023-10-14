import type { Metadata } from 'next'
import Script from 'next/script'
import { daily as dailyTheme } from '@grantcodes/themer'

// TODO: Improve this?
import 'css/base/index.scss'
import 'css/components/index.scss'
import 'css/pages/index.scss'
import 'leaflet/dist/leaflet.css'

const url = process.env.NEXT_PUBLIC_URL ?? ''
const name = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const description = process.env.NEXT_PUBLIC_META_DESCRIPTION ?? ''
const image = JSON.parse(process.env.NEXT_PUBLIC_META_IMAGE ?? '')
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME ?? ''
const authorPhoto = process.env.NEXT_PUBLIC_AUTHOR_PHOTO
const authorEmail = process.env.NEXT_PUBLIC_AUTHOR_EMAIL ?? ''
const fb = process.env.NEXT_PUBLIC_AUTHOR_FACEBOOK
const tw = process.env.NEXT_PUBLIC_AUTHOR_TWITTER
const ig = process.env.NEXT_PUBLIC_AUTHOR_INSTAGRAM
const gh = process.env.NEXT_PUBLIC_AUTHOR_GITHUB
const micropub = process.env.NEXT_PUBLIC_MICROPUB_URL
const hub = process.env.NEXT_PUBLIC_HUB
const indieauth = process.env.NEXT_PUBLIC_INDIEAUTH_ENDPOINT
const microsub = process.env.NEXT_PUBLIC_MICROSUB_ENDPOINT
const twHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? ''
const api = process.env.NEXT_PUBLIC_API_URL

const theme = dailyTheme()

let themeCss = ':root {'
for (const key in theme) {
  if (theme.hasOwnProperty(key)) {
    const value = theme[key]
    if (typeof value === 'string') {
      themeCss += `--theme-${key}: ${value};`
    } else if (Array.isArray(value)) {
      value.forEach((c, i) => {
        themeCss += `--theme-${key}-${i}: ${c};`
      })
    }
  }
}
themeCss += '}'

const links = [
  { key: 'self', rel: 'self', href: url },
  { key: 'canonical', rel: 'canonical', href: url },
  {
    key: 'authorization_endpoint',
    rel: 'authorization_endpoint',
    href: process.env.NEXT_PUBLIC_INDIEAUTH_ENDPOINT,
  },
  { key: 'token_endpoint', rel: 'token_endpoint', href: api + '/token' },
  { key: 'hub', rel: 'hub', href: process.env.NEXT_PUBLIC_HUB },
  {
    key: 'microsub',
    rel: 'microsub',
    href: process.env.NEXT_PUBLIC_MICROSUB_ENDPOINT,
  },
  { key: 'micropub', rel: 'micropub', href: micropub },
  {
    key: 'webmention',
    rel: 'webmention',
    href: micropub + '/plugin/webmention',
  },
  {
    key: 'alternate-jf2',
    rel: 'alternate',
    type: 'application/jf2feed+json',
    title: `${name} | jf2 feed`,
    href: `${micropub}/plugin/feeds/jf2`,
  },
  {
    key: 'alternate-json',
    rel: 'alternate',
    type: 'application/json',
    title: `${name} | json feed`,
    href: `${micropub}/plugin/feeds/json`,
  },
  {
    key: 'alternate-atom',
    rel: 'alternate',
    type: 'application/atom+xml',
    title: `${name} | atom feed`,
    href: `${micropub}/plugin/feeds/atom`,
  },
  {
    key: 'alternate-rss',
    rel: 'alternate',
    type: 'application/rss+xml',
    title: `${name} | rss feed`,
    href: `${micropub}/plugin/feeds/rss`,
  },
  {
    key: 'alternate-mf2',
    rel: 'alternate',
    type: 'application/mf2+json',
    title: `${name} | microformats2 json feed`,
    href: `${micropub}/plugin/feeds/mf2json`,
  },
]

export default function RootLayout ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        {/* Just stuff that doesn't work in the default metadata for now */}
        {links.map(({ key, ...props }) => (
          <link key={key} {...props} />
        ))}
        <style>{themeCss}</style>
      </head>
      <body>{children}</body>
      {/* Script to load theme without flash */}
      <Script strategy='beforeInteractive' src='/load-theme.js' />
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: name,
    template: `%s ⁂ ${name}`,
  },
  applicationName: name,
  description: description,
  authors: [{ name: authorName, url: url }],
  creator: authorName,
  publisher: authorName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  themeColor: theme.main,
  manifest: '/manifest.json',

  verification: {
    other: {
      me: [url, authorEmail],
    },
  },

  icons: {
    icon: [
      {
        sizes: '16x16',
        url: '/icons/favicon-16x16.png',
      },
      {
        sizes: '228x228',
        url: '/icons/coast-228x228.png',
      },
      {
        sizes: '32x32',
        url: '/icons/favicon-32x32.png',
      },
    ],
    shortcut: ['/icons/favicon.ico'],
    apple: [
      {
        sizes: '114x114',
        url: '/icons/apple-touch-icon-114x114.png',
      },
      {
        sizes: '120x120',
        url: '/icons/apple-touch-icon-120x120.png',
      },
      {
        sizes: '144x144',
        url: '/icons/apple-touch-icon-144x144.png',
      },
      {
        sizes: '152x152',
        url: '/icons/apple-touch-icon-152x152.png',
      },
      {
        sizes: '180x180',
        url: '/icons/apple-touch-icon-180x180.png',
      },
      {
        sizes: '57x57',
        url: '/icons/apple-touch-icon-57x57.png',
      },
      {
        sizes: '60x60',
        url: '/icons/apple-touch-icon-60x60.png',
      },
      {
        sizes: '72x72',
        url: '/icons/apple-touch-icon-72x72.png',
      },
      {
        sizes: '76x76',
        url: '/icons/apple-touch-icon-76x76.png',
      },
    ],
  },
  appleWebApp: {
    title: name,
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        media:
          '(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)',
        url: '/icons/apple-touch-startup-image-320x460.png',
      },
      {
        media:
          '(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-touch-startup-image-640x920.png',
      },
      {
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-touch-startup-image-640x1096.png',
      },
      {
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-touch-startup-image-750x1294.png',
      },
      {
        media:
          '(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)',
        url: '/icons/apple-touch-startup-image-1182x2208.png',
      },
      {
        media:
          '(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)',
        url: '/icons/apple-touch-startup-image-1242x2148.png',
      },
      {
        media:
          '(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)',
        url: '/icons/apple-touch-startup-image-748x1024.png',
      },
      {
        media:
          '(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-touch-startup-image-1496x2048.png',
      },
      {
        media:
          '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)',
        url: '/icons/apple-touch-startup-image-768x1004.png',
      },
      {
        media:
          '(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)',
        url: '/icons/apple-touch-startup-image-1536x2008.png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    title: name,
    description,
    locale: 'en_GB',
    url: url,
    siteName: name,
    images: [image],
  },
  twitter: {
    creator: `@${twHandle}`,
    site: twHandle,
    card: 'summary_large_image',
  },
}
