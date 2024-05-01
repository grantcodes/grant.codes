import PostList from 'components/PostList'
import getCategories from 'lib/get/categories'
import getPosts from 'lib/get/posts'
import { notFound } from 'next/navigation'

const Page = async ({ params }) => {
  const categorySlug = params.category

  const allCategories = await getCategories()
  const category = allCategories.find(cat => cat.slug === categorySlug)

  if (!category) {
    return notFound()
  }

  const posts = await getPosts({
    query: { category: category.name, type: 'all' },
  })

  return (
    <PostList
      title={`Category: ${category.name ?? category.slug}`}
      posts={posts}
      type="home"
      params={params}
    />
  )
}

// export async function generateStaticParams () {
//   // Get all categories
//   const categories = await getCategories()

//   return categories.map(({ slug }) => ({ category: slug }))
// }

export default Page
