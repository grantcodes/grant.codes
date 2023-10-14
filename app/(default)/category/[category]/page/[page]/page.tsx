import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import getCategories from 'lib/get/categories'
import getPageCount from 'lib/get/page-count'

interface PageParams {
  page: string
  category: string
}

const Page = async ({ params }) => {
  const posts = await getPosts({ query: params })

  return (
    <>
      <PostList posts={posts} type='home' params={params} />
    </>
  )
}

export async function generateStaticParams (): Promise<PageParams[]> {
  const categoryPages: PageParams[] = []

  // Get all categories
  const categories = await getCategories()

  for (const category of categories) {
    // Get post count for each category
    const pageCount = await getPageCount({ category })

    for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
      categoryPages.push({ page: `${pageNumber}`, category })
    }
  }

  return categoryPages
}

export default Page
