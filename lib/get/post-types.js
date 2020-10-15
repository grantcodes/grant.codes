import pluralize from 'pluralize'
import micropub from 'lib/micropub'

const getPostTypes = async (plural = false) => {
  try {
    const { 'post-types': types = [] } = await micropub.query('post-types')

    if (plural) {
      return types.map((type) => pluralize(type.type))
    }

    return types.map((type) => type.type)
  } catch (err) {
    console.error('Error getting post types', err?.error?.response || err)
    return [
      'notes',
      'articles',
      'likes',
      'photos',
      'likes',
      'replies',
      'bookmarks',
    ]
  }
}

export default getPostTypes
