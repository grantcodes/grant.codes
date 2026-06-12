const DEFAULT_POST_TYPES: string[] = [
  'note',
  'article',
  'photo',
  'video',
  'audio',
  'reply',
  'like',
  'repost',
  'rsvp',
  'bookmark',
  'reacji',
  'listen',
  'read',
  'watch',
  'event',
  'checkin',
  'quotation',
  'collection',
  'journal',
]

let cachedPostTypes: string[] | null = null

const getPostTypes = async (
  _plural: boolean = false
): Promise<string[]> => {
  // For now, return default post types without the micropub-helper dependency.
  // The original code fetches from the Micropub `post-types` query and falls
  // back to DEFAULT_POST_TYPES.  In a future wave, if dynamic post-type
  // fetching is needed, add a configurable API endpoint parameter.
  if (cachedPostTypes) {
    return cachedPostTypes
  }

  cachedPostTypes = [...DEFAULT_POST_TYPES]
  return cachedPostTypes
}

export default getPostTypes
