import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import grantcodes from '@grantcodes/astro'

export default defineConfig({
  integrations: [grantcodes()],
  site: 'https://grant.codes',
  // Pages render per request from the postr database; apps/api mounts the handler.
  output: 'server',
  adapter: node({ mode: 'middleware' }),
  // The timeline moved from / to /updates when the home page became an intro.
  redirects: {
    '/page/[page]': '/updates/page/[page]',
  },
  server: {
    host: '127.0.0.1',
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
