import PostList from 'components/PostList'
import getPageCount from 'lib/get/page-count'

const Page = ({ posts = [] }) => (
  <>
    <PostList posts={posts} type="home" />
  </>
)

export async function getStaticPaths() {
  // Count how many pages are needed
  const pageCount = getPageCount()
  const paths = []
  for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
    paths.push({ params: { page: `${pageNumber}` } })
  }

  // Return the paths, with a fallback to dynamically render older posts
  return {
    paths,
    fallback: true,
  }
}

export { getStaticProps } from 'lib/get/posts'
export default Page
