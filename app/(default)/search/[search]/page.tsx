import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'

// TODO: Title & Metadata

const Page = async ({ params }) => {
  const posts = await getPosts({ query: params })
  return <PostList posts={posts} type='home' />
}

export default Page
