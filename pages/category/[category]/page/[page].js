import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import getCategories from 'lib/get/categories'
import getPageCount from 'lib/get/page-count'

const Page = ({ posts = [] }) => (
  <>
    <PostList posts={posts} type="home" />
  </>
)

export async function getStaticPaths() {
  const paths = []
  // Get all categories
  const categories = await getCategories()
  for (const category of categories) {
    // Get post count for each category
    const pageCount = await getPageCount({ category })

    for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
      paths.push({ params: { page: `${pageNumber}`, category } })
    }
  }
  console.log('category/page get static path', paths.length)

  // Return the paths, with a fallback to dynamically new / old categories
  return {
    paths,
    fallback: true,
  }
}

export { getStaticProps } from 'lib/get/posts'

export default Page
