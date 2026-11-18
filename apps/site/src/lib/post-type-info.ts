/** Archive label and URL for each post type. */
export const postTypeInfo: Record<string, { label: string; href: string }> = {
  article: { label: 'Articles', href: '/articles' },
  note: { label: 'Notes', href: '/notes' },
  photo: { label: 'Photos', href: '/photos' },
  collection: { label: 'Galleries', href: '/collections' },
  like: { label: 'Likes', href: '/likes' },
  reply: { label: 'Replies', href: '/replies' },
  repost: { label: 'Reposts', href: '/reposts' },
  bookmark: { label: 'Bookmarks', href: '/bookmarks' },
  checkin: { label: 'Check-ins', href: '/checkins' },
  watch: { label: 'Watches', href: '/watches' },
  listen: { label: 'Listens', href: '/listens' },
  read: { label: 'Reads', href: '/reads' },
  rsvp: { label: 'RSVPs', href: '/rsvps' },
  event: { label: 'Events', href: '/events' },
  quotation: { label: 'Quotes', href: '/quotes' },
  video: { label: 'Videos', href: '/videos' },
  audio: { label: 'Audio', href: '/audio' },
  journal: { label: 'Journals', href: '/journals' },
}

export const typeLabel = (type: string) =>
  postTypeInfo[type] ?? { label: type, href: '' }

/** Types shown in the updates timeline and feeds, as 1.x's home page did. */
export const defaultFeedTypes = ['note', 'photo', 'article', 'repost', 'quotation', 'video', 'audio', 'collection']
