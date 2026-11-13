/**
 * Providers whose oEmbed iframes we render: the liked page's host → the hosts its player may load from.
 * Anything else falls back to the YouTube-from-URL embed or a link preview.
 */
const allowlist: Record<string, string[]> = {
  'youtube.com': ['www.youtube.com', 'www.youtube-nocookie.com'],
  'youtu.be': ['www.youtube.com', 'www.youtube-nocookie.com'],
  'vimeo.com': ['player.vimeo.com'],
  'soundcloud.com': ['w.soundcloud.com'],
  'open.spotify.com': ['open.spotify.com'],
  'codepen.io': ['codepen.io'],
}

export interface OEmbedFrame {
  src: string
  title?: string
  width?: number
  height?: number
}

const hostOf = (url: string) => URL.parse(url)?.hostname.replace(/^(www|m)\./, '')

/**
 * The player iframe from a reference's oEmbed (`properties.oembed[0]`), when both the referenced
 * page and the iframe's src are on the allowlist. Only the src is kept; the provider's HTML is never
 * rendered as-is. YouTube players use the privacy-enhanced domain.
 */
export function getOEmbedFrame(url: string, oembed: unknown): OEmbedFrame | undefined {
  const allowed = allowlist[hostOf(url) ?? '']
  if (!allowed || !oembed || typeof oembed !== 'object') return undefined
  const data = oembed as Record<string, unknown>
  if (typeof data.html !== 'string') return undefined
  const src = data.html.match(/<iframe\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1]?.replaceAll('&amp;', '&')
  const parsed = src ? URL.parse(src) : null
  if (!parsed || parsed.protocol !== 'https:' || !allowed.includes(parsed.hostname)) return undefined
  if (parsed.hostname === 'www.youtube.com') parsed.hostname = 'www.youtube-nocookie.com'
  const number = (value: unknown) => (typeof value === 'number' && value > 0 ? value : undefined)
  return {
    src: parsed.href,
    title: typeof data.title === 'string' ? data.title : undefined,
    width: number(data.width),
    height: number(data.height),
  }
}
