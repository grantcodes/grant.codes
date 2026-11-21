// Imports a postr 1.x dump (from scripts/dump-legacy.cjs) into a new postr 2 database, then
// records photo dimensions from the media dir. Run from apps/api with TZ=UTC, since 1.x
// permalinks use UTC dates:
//   TZ=UTC node scripts/import-legacy.mjs /tmp/dump.json
// Writes to POSTR_DATABASE (default .data/postr.db) and refuses a database that already has
// posts; the empty one a freshly started api creates is fine.
import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { createPostr, importLegacyPosts } from '@postr/core'

const [dumpPath] = process.argv.slice(2)
if (!dumpPath) {
  console.error('usage: TZ=UTC node scripts/import-legacy.mjs <dump.json>')
  process.exit(1)
}
if (process.env.TZ !== 'UTC') {
  console.error('Run with TZ=UTC so permalinks match the 1.x URLs.')
  process.exit(1)
}

const database = path.resolve(process.env.POSTR_DATABASE ?? '.data/postr.db')
if (fs.existsSync(database)) {
  const db = new DatabaseSync(database, { readOnly: true })
  const hasPosts = db.prepare("select 1 from sqlite_master where name = 'posts'").get()
  const { n } = hasPosts ? db.prepare('select count(*) n from posts').get() : { n: 0 }
  db.close()
  if (n > 0) {
    console.error(`${database} already has ${n} posts; move it aside to re-import.`)
    process.exit(1)
  }
}
fs.mkdirSync(path.dirname(database), { recursive: true })

// Same settings as src/lib/postr.ts.
const siteUrl = 'https://grant.codes'
const mediaUrl = 'https://backend.grant.codes/media'
const mediaDir = path.resolve(import.meta.dirname, '../../../media')
const journal = {
  type: 'journal',
  name: 'Journal',
  discovery: (mf2) => Boolean(mf2.properties.category?.includes('journal')),
}

const { docs } = JSON.parse(fs.readFileSync(dumpPath, 'utf8'))
const postr = createPostr({
  siteUrl,
  endpointUrl: 'https://backend.grant.codes/micropub',
  database,
  auth: {},
  runJobs: false,
  formatContent: false,
  downloadExternalMedia: false,
  media: {
    dir: mediaDir,
    url: mediaUrl,
    imageSizes: { '1800': [1800], '700': [700], '200x200': [200, 200] },
  },
  plugins: [{ id: 'grant-codes', postTypes: [journal] }],
})
const report = await importLegacyPosts(postr, docs, {
  siteBaseUrl: siteUrl,
  mediaBaseUrl: mediaUrl,
  createdDateInPermalinks: true,
})
const backfill = await postr.media.backfill()
postr.close()
console.log(
  JSON.stringify(
    { database, mediaDir, mediaDirExists: fs.existsSync(mediaDir), ...report, backfill },
    null,
    2
  )
)
