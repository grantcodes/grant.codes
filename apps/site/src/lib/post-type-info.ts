/** Archive label, URL and emoji for each post type. */
export const postTypeInfo: Record<string, { label: string; href: string; emoji: string }> = {
  article: { label: 'Articles', href: '/articles', emoji: '📝' },
  note: { label: 'Notes', href: '/notes', emoji: '💬' },
  photo: { label: 'Photos', href: '/photos', emoji: '📷' },
  collection: { label: 'Galleries', href: '/collections', emoji: '🖼️' },
  like: { label: 'Likes', href: '/likes', emoji: '❤️' },
  reply: { label: 'Replies', href: '/replies', emoji: '↩️' },
  repost: { label: 'Reposts', href: '/reposts', emoji: '🔁' },
  bookmark: { label: 'Bookmarks', href: '/bookmarks', emoji: '🔖' },
  checkin: { label: 'Check-ins', href: '/checkins', emoji: '📍' },
  watch: { label: 'Watches', href: '/watches', emoji: '🎬' },
  listen: { label: 'Listens', href: '/listens', emoji: '🎧' },
  read: { label: 'Reads', href: '/reads', emoji: '📚' },
  rsvp: { label: 'RSVPs', href: '/rsvps', emoji: '📅' },
  event: { label: 'Events', href: '/events', emoji: '🎉' },
  quotation: { label: 'Quotes', href: '/quotes', emoji: '❝' },
  video: { label: 'Videos', href: '/videos', emoji: '🎥' },
  audio: { label: 'Audio', href: '/audio', emoji: '🔊' },
  journal: { label: 'Journals', href: '/journals', emoji: '📓' },
}

export const typeLabel = (type: string) =>
  postTypeInfo[type] ?? { label: type, href: '', emoji: '•' }
