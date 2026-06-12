import { defineConfig } from 'astro/config'
import grantcodes from '@grantcodes/astro'
import postrIntegration from './src/integrations/postr'

export default defineConfig({
  integrations: [grantcodes(), postrIntegration()],
  site: 'https://grant.codes',
  output: 'static',
  vite: {
    server: {
      allowedHosts: ['grantcodes.munchkin-beaver.ts.net'],
    },
    resolve: {
      noExternal: ['@grantcodes/ui'],
    },
  },
})
