import { defineConfig } from 'astro/config'
import grantcodes from '@grantcodes/astro'

export default defineConfig({
  integrations: [grantcodes()],
  site: 'https://grant.codes',
  output: 'static',
  // The timeline moved from / to /updates when the home page became an intro.
  redirects: {
    '/page/[page]': '/updates/page/[page]',
  },
  server: {
    host: '127.0.0.1',
  },
  // Astro renders static routes serially by default. The post archive contains
  // a published page per permalink, so use bounded parallel rendering rather
  // than dropping older routes from the static build.
  build: {
    concurrency: 4,
  },
  vite: {
    server: {
      allowedHosts: [
        'grantcodes.munchkin-beaver.ts.net',
        'devbox.munchkin-beaver.ts.net',
      ],
    },
    resolve: {
      noExternal: ['@grantcodes/ui'],
    },
  },
})
