import { NextSeo } from 'next-seo'
import PostList from 'components/PostList'

const Home = ({ posts = [] }) => (
  <>
    <NextSeo title="Home" />
    <PostList posts={posts} type="home" />
  </>
)

export { getStaticProps } from 'lib/get/posts'

export default Home
