import { NextSeo } from 'next-seo'
import PostList from 'components/PostList'
import ErrorMessage from 'components/ErrorMessage'
import getPosts from 'lib/get/posts'

const Page = ({ posts = [] }) => (
  <>
    <NextSeo title="Drafts" noIndex />
    <h1 className="page-title">Drafts</h1>
    {posts.length > 0 ? (
      <PostList posts={posts} type="home" />
    ) : (
      <ErrorMessage message="No drafts for you to see here" />
    )}
  </>
)

export const getStaticProps = async (ctx) => {
  if (!ctx.preview) {
    return { props: { posts: [] } }
  }

  ctx.query = { postStatus: 'draft' }
  ctx.limit = 100
  const posts = await getPosts(ctx)
  return { props: { posts } }
}

export default Page
