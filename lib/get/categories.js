import micropub from 'lib/micropub'

const getCategories = async () => {
  const { categories } = await micropub.query('categories')
  return categories
}

export default getCategories
