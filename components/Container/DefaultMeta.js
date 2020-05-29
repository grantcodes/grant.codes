import { DefaultSeo } from 'next-seo'

const url = process.env.NEXT_PUBLIC_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const description = process.env.NEXT_PUBLIC_META_DESCRIPTION
const image = JSON.parse(process.env.NEXT_PUBLIC_META_IMAGE)
const twHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE

export default () => (
  <DefaultSeo
    title={name}
    titleTemplate={`%s | ${name}`}
    description={description}
    canonical={url}
    openGraph={{
      type: 'website',
      locale: 'en_GB',
      url: url,
      site_name: name,
      images: [image],
    }}
    twitter={{
      handle: twHandle,
      site: twHandle,
      cardType: 'summary_large_image',
    }}
    additionalMetaTags={[
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', value: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'msapplication-TileImage', content: '/icons/mstile-144x144.png' },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
    ]}
  />
)
