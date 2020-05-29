import PostList from 'components/PostList'
import getTypes from 'lib/get/post-types'
import getPageCount from 'lib/get/page-count'

const Page = ({ posts = [] }) => (
  <>
    <PostList posts={posts} type="home" />
  </>
)

export async function getStaticPaths() {
  const paths = []
  // Get all categories
  const types = await getTypes(true)
  for (const type of types) {
    // Get post count for each post type
    const pageCount = await getPageCount({ type })
    for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
      paths.push({ params: { page: `${pageNumber}`, typeOrYear: type } })
    }
  }

  // Return the paths, with a fallback to dynamically new / old categories
  return {
    paths,
    fallback: true,
  }
}

export { getStaticProps } from 'lib/get/posts'

export default Page
