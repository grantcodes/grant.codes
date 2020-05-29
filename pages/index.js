import Head from 'next/head'
import PostList from 'components/PostList'

const Home = ({ posts = [] }) => (
  <>
    <Head>
      <title>grant.codes</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <PostList posts={posts} type="home" />
  </>
)

export { getStaticProps } from 'lib/get/posts'

export default Home
