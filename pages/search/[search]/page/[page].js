import PostList from 'components/PostList'

const Page = ({ posts = [] }) => (
  <>
    <PostList posts={posts} type="home" />
  </>
)

export { getServerSideProps } from 'lib/get/posts'

export default Page
