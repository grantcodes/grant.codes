import pluralize from 'pluralize'
import micropub from 'lib/micropub'

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

const getPostTypes = async (plural: boolean = false): Promise<string[]> => {
  try {
    const { 'post-types': types = [] } = await micropub.query('post-types')

    if (plural) {
      return types.map(type => pluralize(type.type))
    }

    return types.map(type => type.type)
  } catch (err) {
    console.error('Error getting post types', err?.error?.response || err)
    return DEFAULT_POST_TYPES
  }
}

export default getPostTypes
