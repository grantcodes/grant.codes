const TYPE_ALIASES: Record<string, string> = {
  article: 'article',
  articles: 'article',
  audio: 'audio',
  audios: 'audio',
  bookmark: 'bookmark',
  bookmarks: 'bookmark',
  checkin: 'checkin',
  checkins: 'checkin',
  collection: 'collection',
  collections: 'collection',
  event: 'event',
  events: 'event',
  journal: 'journal',
  journals: 'journal',
  like: 'like',
  likes: 'like',
  listen: 'listen',
  listens: 'listen',
  note: 'note',
  notes: 'note',
  photo: 'photo',
  photos: 'photo',
  quotation: 'quotation',
  quotations: 'quotation',
  read: 'read',
  reads: 'read',
  reacji: 'reacji',
  reacjis: 'reacji',
  reply: 'reply',
  replies: 'reply',
  repost: 'repost',
  reposts: 'repost',
  rsvp: 'rsvp',
  rsvps: 'rsvp',
  video: 'video',
  videos: 'video',
  watch: 'watch',
  watches: 'watch',
}

const isYear = (value: string) => /^\d{4}$/.test(value)

const normalizeType = (value: string) => TYPE_ALIASES[value] || value

const normalizeSearchQuery = (query: Record<string, unknown> = {}) => {
  const normalizedQuery: Record<string, unknown> = { ...query }
  const typeOrYear = normalizedQuery.typeOrYear

  if (typeof typeOrYear === 'string') {
    if (isYear(typeOrYear)) {
      normalizedQuery.year = typeOrYear
    } else {
      normalizedQuery.type = normalizeType(typeOrYear)
    }

    delete normalizedQuery.typeOrYear
  }

  for (const key of Object.keys(normalizedQuery)) {
    const value = normalizedQuery[key]

    if (value === undefined || value === null || value === '') {
      delete normalizedQuery[key]
    }
  }

  return normalizedQuery
}

export default normalizeSearchQuery
