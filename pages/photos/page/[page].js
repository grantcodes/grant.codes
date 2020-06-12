import PostList from 'components/PostList'
import getTypes from 'lib/get/post-types'
import getPageCount from 'lib/get/page-count'
import { getStaticProps as getPosts } from 'lib/get/posts'

const Page = ({ posts = [] }) => <PostList posts={posts} type="photos" />

Page.containerClass = 'right-aligned right-aligned--wide-content'

export async function getStaticPaths() {
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

export const getStaticProps = async (ctx) => {
  ctx.params.typeOrYear = 'photos'
  ctx.limit = 50
  return await getPosts(ctx, true)
}

export default Page
