// Records dimensions for the photos in the media dir and copies them into their posts.
// Run from apps/api after an import or when media files were added outside Micropub:
//   node scripts/backfill-media.mjs
import fs from 'node:fs'
import path from 'node:path'
import { createPostr } from '@postr/core'

// Same settings as src/lib/postr.ts and scripts/import-legacy.mjs.
const database = path.resolve(process.env.POSTR_DATABASE ?? '.data/postr.db')
if (!fs.existsSync(database)) {
  console.error(`${database} does not exist.`)
  process.exit(1)
}
const mediaDir = path.resolve(import.meta.dirname, '../../../media')
const postr = createPostr({
  siteUrl: 'https://grant.codes',
  endpointUrl: 'https://backend.grant.codes/micropub',
  database,
  auth: {},
  runJobs: false,
  sendWebmentions: false,
  fetchReferences: false,
  media: {
    dir: mediaDir,
    url: 'https://backend.grant.codes/media',
    imageSizes: { '1800': [1800], '700': [700], '200x200': [200, 200] },
  },
})
const result = await postr.media.backfill()
postr.close()
console.log(JSON.stringify({ database, mediaDir, ...result }))
