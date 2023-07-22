import micropub from 'lib/micropub'

const getCategories = async () => {
  try {
    const { categories } = await micropub.query('categories')
    return categories
  } catch (err) {
    console.warn('Error getting categories', err)
    return []
  }
}

export default getCategories
