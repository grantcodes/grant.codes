import PostList from 'components/PostList'
import getTypes from 'lib/get/post-types'
import getPageCount from 'lib/get/page-count'

const Page = ({ posts = [] }) => (
  <>
    <PostList posts={posts} type="home" />
  </>
)

export async function getStaticPaths() {
  console.log('[typeoryear]/page/[page] get static paths')
  const paths = []
  const ingoredTypes = ['photos', 'journals']
  // Get all types
  let types = await getTypes(true)
  types = types.filter((type) => !ingoredTypes.includes(type))
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
