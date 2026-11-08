import PostList from 'components/PostList'
import Profile from 'components/About/Profile'
import getPosts from 'lib/get/posts'

const Home = async props => {
  const params = await props.params;
  const posts = await getPosts({ query: params })

  if (!posts || !posts.length) {
    return <Profile vertical />
  }

  return <PostList posts={posts} type="home" params={params} />
}

export const metadata = {
  title: 'Home',
}

export const revalidate = 1800

export default Home
