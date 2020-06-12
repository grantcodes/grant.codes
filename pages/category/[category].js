import PostList from 'components/PostList'
import getCategories from 'lib/get/categories'

const Page = ({ posts = [] }) => (
  <>
    <PostList posts={posts} type="home" />
  </>
)

export async function getStaticPaths() {
  // Get all categories
  const categories = await getCategories()

  // Return the paths, with a fallback to dynamically new / old categories
  return {
    paths: categories.map((category) => ({ params: { category } })),
    fallback: true,
  }
}

export { getStaticProps } from 'lib/get/posts'

export default Page
