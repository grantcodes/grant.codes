import PostList from 'components/PostList'
import { getStaticProps as getPosts } from 'lib/get/posts'

const Page = ({ posts = [] }) => (
  <PostList posts={posts} type="photos" title="Photos" />
)

Page.containerClass = 'right-aligned right-aligned--wide-content'

export const getStaticProps = async (ctx) => {
  ctx.params = { typeOrYear: 'photos' }
  ctx.limit = 50
  return await getPosts(ctx, true)
}

export default Page
