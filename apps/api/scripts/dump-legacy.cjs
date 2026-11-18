// Dumps a postr 1.x database to JSON for scripts/import-legacy.mjs.
// Run it inside the old backend.grant.codes app (it needs @postr/core 1.x) on a copy of its
// .data, since the running server holds the LevelDB lock:
//   cp -r .data /tmp/postr1-data
//   MICROPUB_ENDPOINT_PASSWORD_SERVER=… node dump-legacy.cjs /tmp/postr1-data/posts /tmp/dump.json
// The dump includes private posts: keep it private and delete it after importing.
const path = require('node:path')
const fs = require('node:fs')
const config = require('@postr/core/lib/config')

const [dbName, out] = process.argv.slice(2)
if (!dbName || !out) {
  console.error('usage: node dump-legacy.cjs <path/to/.data/posts> <dump.json>')
  process.exit(1)
}

config.set('siteBaseUrl', 'https://grant.codes')
config.set('dbName', path.resolve(dbName))
config.set('sendWebmentions', false)
config.set('getRefs', false)
config.set('downloadExternalMedia', false)
config.set('formatContent', false)
if (process.env.MICROPUB_ENDPOINT_PASSWORD_SERVER) {
  config.set('dbPassword', process.env.MICROPUB_ENDPOINT_PASSWORD_SERVER)
}

require('@postr/core/lib/db')
  .get()
  .then(async (collection) => {
    const dump = await collection.dump()
    fs.writeFileSync(out, JSON.stringify(dump))
    const visibility = {}
    for (const doc of dump.docs) {
      const value = doc.properties?.visibility?.[0] ?? 'public'
      visibility[value] = (visibility[value] ?? 0) + 1
    }
    console.log(JSON.stringify({ docs: dump.docs.length, visibility }))
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
