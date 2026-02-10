import pluralize from '@theothergothamdev/pluralize-ts'
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

let cachedPostTypes: string[] = []

const getPostTypes = async (plural: boolean = false): Promise<string[]> => {
  try {
    if (cachedPostTypes.length) {
      return cachedPostTypes
    }

    const { 'post-types': types = [] } = await micropub.query('post-types')

    if (plural) {
      return types.map(type => pluralize(type.type))
    }

    cachedPostTypes = types.map(type => type.type)

    return cachedPostTypes
  } catch (err) {
    console.error('Error getting post types', err?.error?.response || err)
    return DEFAULT_POST_TYPES
  }
}

export default getPostTypes
