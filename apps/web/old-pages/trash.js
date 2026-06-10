import { NextSeo } from 'next-seo'
import PostList from 'components/PostList'
import ErrorMessage from 'components/ErrorMessage'
import getPosts from 'lib/get/posts'

const Page = ({ posts = [] }) => (
  <>
    <NextSeo title="Trash" noIndex />
    <h1 className="page-title">Trash</h1>
    {posts.length > 0 ? (
      <PostList posts={posts} type="home" />
    ) : (
      <ErrorMessage message="No trash for you to see here" />
    )}
  </>
)

export const getStaticProps = async (ctx) => {
  if (!ctx.preview) {
    return { props: { posts: [] } }
  }

  ctx.query = { postStatus: 'deleted' }
  ctx.limit = 100
  const posts = await getPosts(ctx)
  return { props: { posts } }
}

export default Page
