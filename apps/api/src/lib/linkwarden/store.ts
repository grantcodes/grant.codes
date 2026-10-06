import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface LikeSyndicationStore {
  has(canonicalUrl: string): boolean | Promise<boolean>
  add(canonicalUrl: string, syndicationUrl?: string): void | Promise<void>
}

export function createMemoryLikeStore(
  initial: Record<string, string | null> = {}
): LikeSyndicationStore {
  const entries = new Map<string, string | null>(Object.entries(initial))

  return {
    has: (canonicalUrl) => entries.has(canonicalUrl),
    add: (canonicalUrl, syndicationUrl) => {
      entries.set(canonicalUrl, syndicationUrl ?? null)
    },
  }
}

/**
 * JSON-file backed idempotency store. Reads on every check so multiple
 * processes/restarts observe the same canonical URLs.
 */
export function createFileLikeStore(filePath: string): LikeSyndicationStore {
  const read = async (): Promise<Record<string, string | null>> => {
    try {
      const raw = await readFile(filePath, 'utf8')
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return {}
      }
      throw err
    }
  }

  return {
    has: async (canonicalUrl) => {
      const entries = await read()
      return Object.prototype.hasOwnProperty.call(entries, canonicalUrl)
    },
    add: async (canonicalUrl, syndicationUrl) => {
      const entries = await read()
      entries[canonicalUrl] = syndicationUrl ?? null
      await mkdir(dirname(filePath), { recursive: true })
      await writeFile(filePath, JSON.stringify(entries, null, 2) + '\n', 'utf8')
    },
  }
}
