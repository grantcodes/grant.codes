import PostList from 'components/PostList'
import getTypes from 'lib/get/post-types'

const Page = ({ posts = [] }) => <PostList posts={posts} type="home" />

// TODO: Change container class based on type
// Page.containerClass = 'right-aligned right-aligned--wide-content'

export { getStaticProps } from 'lib/get/posts'

// Staticly generate so many pages
export async function getStaticPaths() {
  // TODO: Year pages are going to 404 - but that is probably good for now.
  // TODO: Get dynamic list of post types from micropub endpoint
  // Maybe I can create year overview pages
  const types = await getTypes(true)
  return {
    paths: types.map((t) => ({ params: { typeOrYear: t } })),
    fallback: false, // Don't really need to generate these pages dynamically - apart from year pages
  }
}

export default Page
