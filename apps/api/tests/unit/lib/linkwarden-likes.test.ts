import { after, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  buildLinkwardenLinkRequest,
  canonicalizeUrl,
  extractLikeTarget,
  isLikePost,
  syndicateLike,
  type Mf2Post,
} from '../../../src/lib/linkwarden/likes.js'
import type { LinkwardenClient } from '../../../src/lib/linkwarden/client.js'
import {
  createFileLikeStore,
  createMemoryLikeStore,
} from '../../../src/lib/linkwarden/store.js'
import { LinkwardenLikesSyndicator } from '../../../src/lib/linkwarden/syndicator.js'

const likeMf2 = (url: string): Mf2Post => ({
  type: ['h-entry'],
  properties: { 'like-of': [url] },
})

const fakePostrImports = () => {
  const store: Record<string, any> = {}
  const plugins: any[] = []
  return {
    config: {
      get: (key: string) => store[key],
      set: (key: string, value: any) => {
        store[key] = value
      },
    },
    RxDB: {
      plugin: (plugin: any) => {
        plugins.push(plugin)
      },
    },
    plugins,
  }
}

const makeDoc = (mf2: Mf2Post) => {
  const properties: Record<string, any> = { ...mf2.properties }
  return {
    toMf2: () => ({ type: ['h-entry'], properties }),
    get: (key: string) => properties[key.replace('properties.', '')],
    update: async (patch: any) => {
      const value = patch?.$set?.['properties.syndication']
      if (value) {
        properties.syndication = value
      }
    },
    syndication: () => properties.syndication,
  }
}

describe('canonicalizeUrl', () => {
  it('lowercases the host, drops fragments and strips tracking params', () => {
    assert.strictEqual(
      canonicalizeUrl(
        'https://Example.COM/Post/?utm_source=newsletter&b=2&a=1#section'
      ),
      'https://example.com/Post?a=1&b=2'
    )
  })

  it('trims trailing slashes but keeps the root path', () => {
    assert.strictEqual(
      canonicalizeUrl('https://example.com/'),
      'https://example.com/'
    )
    assert.strictEqual(
      canonicalizeUrl('https://example.com/post/'),
      'https://example.com/post'
    )
  })

  it('rejects invalid and non-http urls', () => {
    assert.strictEqual(canonicalizeUrl('not a url'), null)
    assert.strictEqual(canonicalizeUrl('mailto:hi@example.com'), null)
    assert.strictEqual(canonicalizeUrl(''), null)
  })
})

describe('like extraction', () => {
  it('extracts string and object like-of values', () => {
    assert.strictEqual(
      extractLikeTarget(likeMf2('https://Example.com/a?utm_source=z')),
      'https://example.com/a'
    )

    const objectLike: Mf2Post = {
      type: ['h-entry'],
      properties: {
        'like-of': [
          {
            type: ['h-cite'],
            properties: { url: ['https://example.com/b/'] },
          },
        ],
      },
    }
    assert.strictEqual(extractLikeTarget(objectLike), 'https://example.com/b')
  })

  it('detects like posts', () => {
    assert.strictEqual(isLikePost(likeMf2('https://example.com/a')), true)
    assert.strictEqual(
      isLikePost({ type: ['h-entry'], properties: { content: ['hello'] } }),
      false
    )
  })
})

describe('buildLinkwardenLinkRequest', () => {
  it('builds a tagless request for the likes collection', () => {
    const request = buildLinkwardenLinkRequest(
      'https://example.com/a',
      { type: ['h-entry'], properties: { name: ['A title'] } },
      12
    )

    assert.deepStrictEqual(request, {
      type: 'url',
      url: 'https://example.com/a',
      name: 'A title',
      collection: { id: 12 },
    })
    assert.ok(!('tags' in request))
  })
})

describe('syndicateLike', () => {
  it('ignores non-like posts', async () => {
    const result = await syndicateLike({
      mf2: { type: ['h-entry'], properties: { content: ['hello'] } },
      collectionId: 5,
    })
    assert.strictEqual(result.status, 'not-a-like')
  })

  it('skips posts that are not published', async () => {
    const mf2 = likeMf2('https://example.com/a')
    mf2.properties!['post-status'] = ['draft']
    mf2.properties!.visibility = ['private']

    const result = await syndicateLike({ mf2, collectionId: 5, dryRun: true })
    assert.strictEqual(result.status, 'skipped-not-published')
  })

  it('reports invalid like targets', async () => {
    const result = await syndicateLike({
      mf2: likeMf2('not-a-url'),
      collectionId: 5,
    })
    assert.strictEqual(result.status, 'invalid-url')
  })

  it('requires a collection id', async () => {
    const result = await syndicateLike({
      mf2: likeMf2('https://example.com/a'),
    })
    assert.strictEqual(result.status, 'error')
  })

  it('plans the bookmark without calling Linkwarden in dry-run', async () => {
    let called = 0
    const client: LinkwardenClient = {
      createLink: async () => {
        called++
        return null
      },
    }

    const result = await syndicateLike({
      mf2: likeMf2('https://Example.com/a/?utm_source=x'),
      collectionId: 5,
      client,
      dryRun: true,
    })

    assert.strictEqual(result.status, 'dry-run')
    assert.strictEqual(result.canonicalUrl, 'https://example.com/a')
    assert.deepStrictEqual(result.request, {
      type: 'url',
      url: 'https://example.com/a',
      collection: { id: 5 },
    })
    assert.strictEqual(called, 0)
  })

  it('skips targets already recorded in the idempotency store', async () => {
    const store = createMemoryLikeStore({
      'https://example.com/a': 'https://links.example.com/9',
    })
    let called = 0
    const client: LinkwardenClient = {
      createLink: async () => {
        called++
        return null
      },
    }

    const result = await syndicateLike({
      mf2: likeMf2('https://example.com/a'),
      collectionId: 5,
      client,
      store,
      dryRun: false,
    })

    assert.strictEqual(result.status, 'already-syndicated')
    assert.strictEqual(called, 0)
  })

  it('creates the bookmark and records idempotency when live', async () => {
    const store = createMemoryLikeStore()
    const requests: any[] = []
    const client: LinkwardenClient = {
      createLink: async (request) => {
        requests.push(request)
        return { id: 9, url: 'https://links.example.com/9' }
      },
    }

    const result = await syndicateLike({
      mf2: likeMf2('https://example.com/a'),
      collectionId: 5,
      client,
      store,
      dryRun: false,
    })

    assert.strictEqual(result.status, 'syndicated')
    assert.strictEqual(result.syndicationUrl, 'https://links.example.com/9')
    assert.strictEqual(requests.length, 1)
    assert.ok(!('tags' in requests[0]))

    const second = await syndicateLike({
      mf2: likeMf2('https://example.com/a/'),
      collectionId: 5,
      client,
      store,
      dryRun: false,
    })
    assert.strictEqual(second.status, 'already-syndicated')
    assert.strictEqual(requests.length, 1)
  })

  it('never throws when Linkwarden fails', async () => {
    const client: LinkwardenClient = {
      createLink: async () => {
        throw new Error('network down')
      },
    }

    const result = await syndicateLike({
      mf2: likeMf2('https://example.com/a'),
      collectionId: 5,
      client,
      store: createMemoryLikeStore(),
      dryRun: false,
    })

    assert.strictEqual(result.status, 'error')
    assert.match(result.error ?? '', /network down/)
  })
})

describe('file idempotency store', () => {
  let dir: string

  after(async () => {
    if (dir) {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('persists canonical urls across store instances', async () => {
    dir = await mkdtemp(join(tmpdir(), 'linkwarden-likes-'))
    const file = join(dir, 'nested', 'likes.json')
    const store = createFileLikeStore(file)

    assert.strictEqual(await store.has('https://example.com/a'), false)
    await store.add('https://example.com/a', 'https://links.example.com/9')

    const reopened = createFileLikeStore(file)
    assert.strictEqual(await reopened.has('https://example.com/a'), true)

    const saved = JSON.parse(await readFile(file, 'utf8'))
    assert.strictEqual(
      saved['https://example.com/a'],
      'https://links.example.com/9'
    )
  })
})

describe('LinkwardenLikesSyndicator', () => {
  it('registers a syndication target and hooks into RxDB', () => {
    const imports = fakePostrImports()
    const plugin = new LinkwardenLikesSyndicator({
      options: { collectionId: 5 },
      imports: imports as any,
    })

    assert.strictEqual(
      imports.config.get('syndication')[0].uid,
      plugin.options.id
    )
    assert.strictEqual(imports.config.get('syndication')[0].checked, false)
    assert.strictEqual(imports.plugins.length, 1)

    let inserted = 0
    let saved = 0
    imports.plugins[0].hooks.createRxCollection({
      postInsert: () => {
        inserted++
      },
      postSave: () => {
        saved++
      },
    })

    assert.strictEqual(inserted, 1)
    assert.strictEqual(saved, 1)
  })

  it('dry-runs the Postr hook without side effects', async () => {
    const logs: string[] = []
    let called = 0
    const plugin = new LinkwardenLikesSyndicator({
      options: {
        collectionId: 5,
        dryRun: true,
        client: {
          createLink: async () => {
            called++
            return null
          },
        },
        log: (message) => logs.push(message),
      },
      imports: fakePostrImports() as any,
    })

    const doc = makeDoc(likeMf2('https://example.com/a'))
    const returned = await plugin.checkShouldSyndicate(doc)

    assert.strictEqual(returned, doc)
    assert.strictEqual(called, 0)
    assert.strictEqual(doc.syndication(), undefined)
    assert.match(logs[0] ?? '', /dry-run/)
  })

  it('records the syndication url when live', async () => {
    const plugin = new LinkwardenLikesSyndicator({
      options: {
        collectionId: 5,
        dryRun: false,
        client: {
          createLink: async () => ({
            id: 9,
            url: 'https://links.example.com/9',
          }),
        },
      },
      imports: fakePostrImports() as any,
    })

    const doc = makeDoc(likeMf2('https://example.com/a'))
    await plugin.checkShouldSyndicate(doc)

    assert.deepStrictEqual(doc.syndication(), ['https://links.example.com/9'])
  })

  it('swallows Linkwarden errors so publishing is never blocked', async () => {
    const plugin = new LinkwardenLikesSyndicator({
      options: {
        collectionId: 5,
        dryRun: false,
        client: {
          createLink: async () => {
            throw new Error('boom')
          },
        },
      },
      imports: fakePostrImports() as any,
    })

    const doc = makeDoc(likeMf2('https://example.com/a'))
    await assert.doesNotReject(() => plugin.checkShouldSyndicate(doc))
    assert.strictEqual(doc.syndication(), undefined)
  })
})
