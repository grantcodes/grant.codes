import { getArchivePosts } from './archive'
import { categorySlug } from './category-slug'

export interface CategoryInfo {
  name: string
  slug: string
}

/** Every category used by a post, one per slug, named by its most common spelling. */
const getCategories = async (): Promise<CategoryInfo[]> => {
  const spellings = new Map<string, Map<string, number>>()
  for (const post of await getArchivePosts()) {
    for (const name of post.categories) {
      const slug = categorySlug(name)
      if (!slug) continue
      const counts = spellings.get(slug) ?? new Map<string, number>()
      counts.set(name, (counts.get(name) ?? 0) + 1)
      spellings.set(slug, counts)
    }
  }

  return [...spellings]
    .map(([slug, counts]) => ({ slug, name: [...counts].sort((a, b) => b[1] - a[1])[0][0] }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export default getCategories
