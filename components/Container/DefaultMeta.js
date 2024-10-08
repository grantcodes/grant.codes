import { DefaultSeo } from 'next-seo'

const url = process.env.NEXT_PUBLIC_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const description = process.env.NEXT_PUBLIC_META_DESCRIPTION
const image = JSON.parse(process.env.NEXT_PUBLIC_META_IMAGE)
const twHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE

const DefaultMeta = () => (
  <>
    <DefaultSeo
      title={name}
      titleTemplate={`%s – ${name}`}
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
        { charSet: 'utf-8', key: 'meta-charset' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
          key: 'meta-viewport',
        },
        {
          name: 'mobile-web-app-capable',
          value: 'yes',
          key: 'meta-mobile-web-app-capable',
        },
        {
          name: 'apple-mobile-web-app-capable',
          content: 'yes',
          key: 'meta-apple-mobile-web-app-capable',
        },
        {
          name: 'msapplication-TileImage',
          content: '/icons/mstile-144x144.png',
          key: 'meta-msapptile',
        },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent',
          key: 'meta-apple-status-bar',
        },
      ]}
    />
    {/* Script to load theme without flash */}
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var theme = localStorage.getItem('theme');
          if (theme) {
            theme = JSON.parse(theme);
            if (theme) {
              Object.keys(theme).forEach(function(key) {
                var color = theme[key];
                if (typeof color !== 'string' && color._rgb) {
                  color = 'rgba(' + color._rgb.join(',') + ')';
                } 
                if (Array.isArray(color)) {
                  color.forEach(function(c, i) {
                    window.document.documentElement.style.setProperty('--theme-' + key + '-' + i, c.toString());
                  });
                } else {
                  window.document.documentElement.style.setProperty('--theme-' + key, color.toString());
                }
              }) 
            }
          } 
        `,
      }}
    />
  </>
)

export default DefaultMeta
