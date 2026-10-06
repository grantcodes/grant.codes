#!/usr/bin/env node
import { syndicateLike, type Mf2Post } from '../src/lib/linkwarden/likes.js'

const args = process.argv.slice(2)

const flag = (name: string): string | undefined => {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}

const likeOf = flag('--like-of')

if (!likeOf) {
  console.error(
    [
      'Usage: pnpm linkwarden:dry-run -- --like-of <url> [options]',
      '',
      'Options:',
      '  --like-of <url>     URL being liked (required)',
      '  --collection <id>   Linkwarden likes collection id',
      '  --name <title>      Optional bookmark title',
      '  --post <url>        Optional permalink of the like post',
      '  --json              Print the full plan as JSON',
    ].join('\n')
  )
  process.exit(1)
}

const collectionIdRaw =
  flag('--collection') ?? process.env.LINKWARDEN_LIKES_COLLECTION_ID
const collectionId = collectionIdRaw ? Number(collectionIdRaw) : undefined

const mf2: Mf2Post = {
  type: ['h-entry'],
  properties: {
    'like-of': [likeOf],
    ...(flag('--name') ? { name: [flag('--name') as string] } : {}),
    ...(flag('--post') ? { url: [flag('--post') as string] } : {}),
  },
}

const result = await syndicateLike({
  mf2,
  collectionId,
  dryRun: true,
})

if (result.status === 'dry-run') {
  if (args.includes('--json')) {
    console.log(
      JSON.stringify(
        {
          likeOf,
          canonicalUrl: result.canonicalUrl,
          collectionId,
          request: result.request,
        },
        null,
        2
      )
    )
  } else {
    console.log(`Like target:       ${likeOf}`)
    console.log(`Canonical URL:     ${result.canonicalUrl}`)
    console.log(`Likes collection:  ${collectionId}`)
    console.log(`Would POST /api/v1/links: ${JSON.stringify(result.request)}`)
  }
  console.log('Dry run only — no request sent to Linkwarden.')
} else {
  console.error(
    `Cannot plan syndication: ${result.status}${
      result.error ? ` (${result.error})` : ''
    }`
  )
  process.exitCode = 1
}
