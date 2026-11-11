import { toPostView, type Mf2Item } from '@postr/core'

// Strip stray control characters some fetched pages carried.
const clean = (text?: string) => text?.replace(/[\u0000-\u001f]+/g, ' ').trim() || undefined

/** Title, excerpt and image of a page a post responds to, or undefined when there's nothing worth showing. */
export function getReference(url: string, entry?: Mf2Item) {
  if (!entry) return undefined
  const view = toPostView(entry)
  // Twitter served this instead of the tweet; it is no preview at all.
  const name = view.name === 'JavaScript is not available.' ? undefined : clean(view.name)
  const text = clean(view.summary ?? view.content?.text)
  const excerpt = text && text.length > 180 ? `${text.slice(0, 180).replace(/\s+\S*$/, '')}…` : text
  if (!name && !excerpt) return undefined
  return {
    url,
    name,
    excerpt: excerpt === name ? undefined : excerpt,
    image: view.featured ?? view.photos[0]?.url,
    host: URL.parse(url)?.hostname.replace(/^www\./, '') ?? url,
  }
}

export type Reference = NonNullable<ReturnType<typeof getReference>>

/** The video id of a YouTube watch, short, embed or youtu.be URL. */
export function getYouTubeId(url: string): string | undefined {
  const parsed = URL.parse(url.replaceAll('&amp;', '&'))
  if (!parsed) return undefined
  const host = parsed.hostname.replace(/^(www|m)\./, '')
  let id: string | undefined
  if (host === 'youtu.be') id = parsed.pathname.slice(1)
  if (host === 'youtube.com') {
    id = parsed.searchParams.get('v') ?? parsed.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]
  }
  return id && /^[\w-]{11}$/.test(id) ? id : undefined
}

/** Whether ResponseTarget will show an embed or preview for this URL (so the bare link can be hidden). */
export const hasResponseTarget = (url: string, entry?: Mf2Item) =>
  Boolean(getYouTubeId(url) || getReference(url, entry))
