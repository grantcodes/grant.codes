import { getEntry } from 'astro:content'
import { site } from './site'

const sitePrefix = `${site.url}/`

/** Entries of a collection post's children, which postr stores as absolute URLs. */
export async function getChildren(post: { children?: unknown }) {
  if (!Array.isArray(post.children)) return []
  const entries = await Promise.all(
    post.children.map((url) =>
      typeof url === 'string' && url.startsWith(sitePrefix)
        ? getEntry('posts', url.slice(sitePrefix.length))
        : undefined
    )
  )
  return entries.flatMap((entry) => (entry ? [entry.data] : []))
}
