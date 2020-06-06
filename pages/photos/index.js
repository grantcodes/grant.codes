import PostList from 'components/PostList'
import { getStaticProps as getPosts } from 'lib/get/posts'

const Page = ({ posts = [] }) => <PostList posts={posts} type="photos" />

Page.containerClass = 'right-aligned right-aligned--wide-content'

export const getStaticProps = async (ctx) => {
  console.log('photos get static props')
  ctx.params = { typeOrYear: 'photos' }
  ctx.limit = 50
  return await getPosts(ctx, true)
}

export default Page
