import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'

const Home = async ({ params }) => {
  const posts = await getPosts({ query: params })
  return <PostList posts={posts} type='home' params={params} />
}

export const metadata = {
  title: 'Home',
}

export default Home
