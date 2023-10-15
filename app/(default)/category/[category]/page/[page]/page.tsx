import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import getCategories from 'lib/get/categories'
import getPageCount from 'lib/get/page-count'
import { notFound } from 'next/navigation'

interface PageParams {
  page: string
  category: string
}

const Page = async ({ params }) => {
  const allCategories = await getCategories()
  const category = allCategories.find(cat => cat.slug === params.category)

  if (!category) {
    return notFound()
  }

  const posts = await getPosts({
    query: { category: category.name, type: 'all' },
  })

  return (
    <>
      <PostList
        title={`Category: ${category.name} page ${params.page}`}
        posts={posts}
        type='home'
        params={params}
      />
    </>
  )
}

export async function generateStaticParams (): Promise<PageParams[]> {
  const categoryPages: PageParams[] = []

  // Get all categories
  const categories = await getCategories()

  for (const category of categories) {
    // Get post count for each category
    const pageCount = await getPageCount({ category: category.name })

    for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
      categoryPages.push({ page: `${pageNumber}`, category: category.slug })
    }
  }

  return categoryPages
}

export default Page
