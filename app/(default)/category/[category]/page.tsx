import PostList from 'components/PostList'
import getCategories from 'lib/get/categories'
import getPosts from 'lib/get/posts'

// TODO: Add titles to category pages.

const Page = async ({ params }) => {
  const posts = await getPosts({ query: params })

  return (
    <>
      <PostList posts={posts} type='home' />
    </>
  )
}

export async function generateStaticParams () {
  // Get all categories
  const categories = await getCategories()

  // Return the paths, with a fallback to dynamically new / old categories
  return categories.map(category => ({ category }))
}

export default Page
