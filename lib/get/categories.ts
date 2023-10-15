import slugify from 'slugify'
import micropub from 'lib/micropub'

interface CategoryInfo {
  name: string
  slug: string
}

let categoriesCache: CategoryInfo[] = []

const getCategories = async (): Promise<CategoryInfo[]> => {
  try {
    if (categoriesCache.length) {
      return categoriesCache
    }

    const { categories } = await micropub.query('categories')

    categoriesCache = categories.map((category: string) => ({
      name: category,
      slug: slugify(category, { lower: true }),
    }))

    return categoriesCache
  } catch (err) {
    console.warn('Error getting categories', err)
    return []
  }
}

export default getCategories
