import PostList from 'components/PostList'
import PageTitle from 'components/util/PageTitle'
import requireLogin from 'lib/require-login'
import getPosts from 'lib/get/posts'

const Page = ({ posts = [], ...props }) => (
  <>
    <PageTitle>Trash</PageTitle>
    <PostList posts={posts} type="home" />
  </>
)

export const getServerSideProps = async (ctx) => {
  ctx = requireLogin(ctx)
  ctx.limit = 50
  ctx.query.postStatus = 'deleted'
  const posts = await getPosts(ctx)
  console.log('trash posts', posts)
  return { props: { posts } }
}

export default Page
