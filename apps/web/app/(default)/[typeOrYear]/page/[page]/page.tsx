import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'

interface PageParams {
  page: string
  typeOrYear: string
}

const Page = async props => {
  const params = await props.params;
  const posts = await getPosts({ query: params })
  return <PostList posts={posts} type='home' params={params} />
}

export default Page
