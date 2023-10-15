import slugify from 'slugify'
import micropub from 'lib/micropub'

interface CategoryInfo {
  name: string
  slug: string
}

const getCategories = async (): Promise<CategoryInfo[]> => {
  try {
    const { categories } = await micropub.query('categories')

    return categories.map((category: string) => ({
      name: category,
      slug: slugify(category, { lower: true }),
    }))
  } catch (err) {
    console.warn('Error getting categories', err)
    return []
  }
}

export default getCategories
