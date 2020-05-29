import pluralize from 'pluralize'
import micropub from 'lib/micropub'

const getPostTypes = async (plural = false) => {
  const { 'post-types': types } = await micropub.query('post-types')

  if (plural) {
    return types.map((type) => pluralize(type.type))
  }

  return types.map((type) => type.type)
}

export default getPostTypes
