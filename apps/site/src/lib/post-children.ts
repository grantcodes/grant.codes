import { getLiveEntry } from 'astro:content'
import { site } from './site'

const sitePrefix = `${site.url}/`

/** Posts in a collection post, which postr stores as absolute URLs in `children`. */
export async function getChildren(post: { children?: unknown }) {
  if (!Array.isArray(post.children)) return []
  const results = await Promise.all(
    post.children.map((url) =>
      typeof url === 'string' && url.startsWith(sitePrefix)
        ? getLiveEntry('posts', { id: url.slice(sitePrefix.length) })
        : undefined
    )
  )
  return results.flatMap((result) => (result?.entry ? [result.entry.data] : []))
}
