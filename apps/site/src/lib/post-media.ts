/**
 * Photo/media extraction helpers for MF2 post data.
 *
 * MF2 photo values can be a plain URL string or an object with
 * `value` (URL) and optional `alt` properties. These helpers
 * normalize both forms into simple strings.
 */

/**
 * Extract a photo URL from an MF2 photo value.
 *
 * - If the value is an object with a `.value` property, returns that.
 * - If the value is a plain string, returns it as-is.
 * - Otherwise returns an empty string.
 */
export function getPhotoUrl(value: any): string {
  const url = typeof value === 'object' && value?.value ? value.value : value
  if (typeof url !== 'string') return ''
  return url.replace('{{mediaBaseUrl}}', 'https://backend.grant.codes/media')
}

const MEDIA_URL = 'https://backend.grant.codes/media/'

/**
 * A resized copy of a locally stored photo ('200x200' crop, or '700' / '1800' wide), or the photo itself.
 * postr 1.x and 2 both write resized copies next to an upload as `name-<size>.ext`.
 */
export function getThumbnailUrl(url: string, size: '200x200' | '700' | '1800' = '200x200'): string {
  if (!url.startsWith(MEDIA_URL)) return url
  return url.replace(/(\.[^./]+)$/, `-${size}$1`)
}

/**
 * Extract an alt-text from an MF2 photo value.
 *
 * - If the value is an object with an `.alt` property, returns that.
 * - Otherwise returns an empty string.
 */
export function getPhotoAlt(value: any): string {
  if (typeof value === 'object' && value?.alt) return value.alt
  return ''
}

/**
 * Normalise a media (video/audio) URL from an MF2 value.
 *
 * Same semantics as `getPhotoUrl` — handles string or object-with-value.
 */
export function getMediaUrl(value: any): string {
  if (typeof value === 'object' && value?.value) return value.value
  if (typeof value === 'string') return value
  return ''
}
