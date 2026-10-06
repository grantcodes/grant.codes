import { createLinkwardenClient, type LinkwardenClient } from './client.js'
import {
  isPublished,
  syndicateLike,
  type LikeSyndicationResult,
  type Mf2Post,
} from './likes.js'
import { createMemoryLikeStore, type LikeSyndicationStore } from './store.js'

export interface LinkwardenLikesSyndicatorOptions {
  id?: string
  name?: string
  default?: boolean
  dryRun?: boolean
  baseUrl?: string
  token?: string
  collectionId?: number
  client?: LinkwardenClient
  store?: LikeSyndicationStore
  log?: (message: string, meta?: unknown) => void
}

interface PostrPluginArgs {
  options?: LinkwardenLikesSyndicatorOptions
  imports?: {
    config?: { get(key: string): any; set(key: string, value: any): void }
    RxDB?: { plugin(plugin: any): void }
    [key: string]: any
  }
}

interface ResolvedOptions {
  id: string
  name: string
  default: boolean
  dryRun: boolean
  baseUrl?: string
  token?: string
  collectionId?: number
  client?: LinkwardenClient
  store?: LikeSyndicationStore
  log?: (message: string, meta?: unknown) => void
}

/**
 * Postr syndicator for likes. Dry-run by default: it plans the Linkwarden
 * bookmark and logs it without touching the network. Live calls only happen
 * when `dryRun` is explicitly disabled and both a client and a collection id
 * are configured.
 */
export class LinkwardenLikesSyndicator {
  options: ResolvedOptions
  imports: PostrPluginArgs['imports']
  store: LikeSyndicationStore

  constructor({ options = {}, imports = {} }: PostrPluginArgs = {}) {
    this.options = {
      id: options.id ?? 'linkwarden',
      name: options.name ?? 'Linkwarden',
      default: options.default ?? false,
      dryRun: options.dryRun ?? true,
      baseUrl: options.baseUrl,
      token: options.token,
      collectionId: options.collectionId,
      client: options.client,
      store: options.store,
      log: options.log,
    }
    this.imports = imports
    this.store = options.store ?? createMemoryLikeStore()
    this.checkShouldSyndicate = this.checkShouldSyndicate.bind(this)
    this.syndicate = this.syndicate.bind(this)
    this.setup()
  }

  setup() {
    const config = this.imports?.config
    if (config) {
      const targets = config.get('syndication') ?? []
      config.set('syndication', [
        ...targets,
        {
          uid: this.options.id,
          name: this.options.name,
          checked: this.options.default,
        },
      ])
    }

    this.imports?.RxDB?.plugin({
      rxdb: true,
      hooks: {
        createRxCollection: (collection: any) => {
          collection.postInsert(this.checkShouldSyndicate, true)
          collection.postSave(this.checkShouldSyndicate, true)
        },
      },
    })
  }

  getClient(): LinkwardenClient | undefined {
    if (this.options.client) {
      return this.options.client
    }
    if (this.options.baseUrl && this.options.token) {
      return createLinkwardenClient({
        baseUrl: this.options.baseUrl,
        token: this.options.token,
      })
    }
    return undefined
  }

  async syndicate(mf2: Mf2Post): Promise<LikeSyndicationResult> {
    return syndicateLike({
      mf2,
      collectionId: this.options.collectionId,
      client: this.getClient(),
      store: this.store,
      dryRun: this.options.dryRun,
      log: this.options.log ?? console.log,
    })
  }

  async checkShouldSyndicate(post: any, doc?: any): Promise<any> {
    const document = doc ?? post

    try {
      const mf2: Mf2Post =
        typeof document?.toMf2 === 'function' ? document.toMf2() : document

      if (!isPublished(mf2)) {
        return document
      }

      const result = await this.syndicate(mf2)

      if (result.status === 'syndicated' && result.syndicationUrl) {
        const existing = document.get?.('properties.syndication') ?? []
        await document.update?.({
          $set: {
            'properties.syndication': [...existing, result.syndicationUrl],
          },
        })
      }
    } catch (err) {
      // Syndication must never break publishing.
      console.log('[linkwarden-likes] non-blocking syndication error', err)
    }

    return document
  }
}
