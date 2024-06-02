import PostList from 'components/PostList'
import Profile from 'components/About/Profile'
import getPosts from 'lib/get/posts'

const Home = async ({ params }) => {
  const posts = await getPosts({ query: params })

  if (!posts) {
    return <Profile vertical />
  }

  return <PostList posts={posts} type="home" params={params} />
}

export const metadata = {
  title: 'Home',
}

export default Home
