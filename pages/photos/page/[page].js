import PostList from 'components/PostList'
import { getStaticProps as getPosts } from 'lib/get/posts'
import getPageCount from 'lib/get/page-count'

const Page = ({ posts = [] }) => <PostList posts={posts} type="photos" />

Page.containerClass = 'right-aligned right-aligned--wide-content'

export async function getStaticPaths() {
  console.log('photos/page get static path')

  const paths = []
  const pageCount = await getPageCount({ type: 'photos', limit: 50 })
  for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
    paths.push({ params: { page: `${pageNumber}`, typeOrYear: 'photos' } })
  }

  // Return the paths, with a fallback to dynamically new / old pages
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async (ctx) => {
  console.log('photos/page static props')
  ctx.params.typeOrYear = 'photos'
  ctx.limit = 50
  return await getPosts(ctx, true)
}

export default Page
