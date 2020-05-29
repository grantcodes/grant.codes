import PostList from 'components/PostList'
import PageTitle from 'components/util/PageTitle'
import getPosts from 'lib/get/posts'

const Page = ({ posts = [], ...props }) => (
  <>
    <PageTitle>Drafts</PageTitle>
    <PostList posts={posts} type="home" />
  </>
)

export const getServerSideProps = async (ctx) => {
  ctx.query.postStatus = 'draft'
  ctx = requireLogin(ctx)
  const posts = await getPosts(ctx)
  return { props: { posts } }
}

export default Page
