import { getCollection } from 'astro:content'
import { postDate } from './post-date'
import getMonthData from './month-data'
import getMonthDataFiles from './month-data-files'

export type ArchivePost = Awaited<ReturnType<typeof getArchivePosts>>[number]

/** Every post, newest first by the date 1.x archived it under. */
export async function getArchivePosts() {
  return (await getCollection('posts'))
    .map((entry) => entry.data)
    .sort((a, b) => postDate(b).getTime() - postDate(a).getTime())
}

/** Posts for the timeline, home page and date archives: unlisted posts only appear on their type's page. */
export async function getListedPosts() {
  return (await getArchivePosts()).filter((post) => post.visibility === 'public')
}

export const inMonth = (post: ArchivePost, year: number, month?: number) => {
  const date = postDate(post)
  return date.getFullYear() === year && (month === undefined || date.getMonth() + 1 === month)
}

/** Post counts by type, most common first. */
export function countByType(posts: ArchivePost[]) {
  const counts = new Map<string, number>()
  for (const post of posts) counts.set(post.postType, (counts.get(post.postType) ?? 0) + 1)
  return [...counts].sort(([, a], [, b]) => b - a)
}

/** Years and months that have posts or a monthly data file, oldest first. */
export async function getArchiveMonths() {
  const months = new Set(getMonthDataFiles())
  for (const post of await getListedPosts()) {
    const date = postDate(post)
    months.add(`${date.getFullYear()}/${date.getMonth() + 1}`)
  }
  return [...months]
    .map((key) => key.split('/').map(Number) as [number, number])
    .sort(([ay, am], [by, bm]) => ay - by || am - bm)
}

export type Track = Array<[lat: number, lng: number]>

/** The month's location track as [lat, lng] points, thinned to at most `maxPoints`. */
export function getMonthTrack(year: number, month: number, maxPoints = 1500): Track {
  const coordinates: Array<[number, number]> =
    getMonthData(year, month)?.geojson?.geometry?.coordinates ?? []
  const step = Math.max(1, Math.ceil(coordinates.length / maxPoints))
  return coordinates
    .filter((_, i) => i % step === 0 || i === coordinates.length - 1)
    .map(([lng, lat]) => [lat, lng])
}

/** Distance along a track in kilometres, ignoring sub-50 m GPS jitter. */
export function trackDistanceKm(track: Track) {
  const rad = Math.PI / 180
  let km = 0
  for (let i = 1; i < track.length; i++) {
    const [lat1, lng1] = track[i - 1]
    const [lat2, lng2] = track[i]
    const a =
      Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2
    const step = 12742 * Math.asin(Math.sqrt(a))
    if (step >= 0.05) km += step
  }
  return Math.round(km)
}

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
