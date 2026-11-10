import { getEntry } from 'astro:content'

/**
 * Entries of a collection post's children, which postr stores as permalinks.
 * Empty until `@postr/astro` exposes `data.children`.
 */
export async function getChildren(post: { children?: unknown }) {
  if (!Array.isArray(post.children)) return []
  const entries = await Promise.all(
    post.children.map((url) =>
      typeof url === 'string'
        ? getEntry('posts', url.replace(/^https?:\/\/[^/]+\//, ''))
        : undefined
    )
  )
  return entries.flatMap((entry) => (entry ? [entry.data] : []))
}
