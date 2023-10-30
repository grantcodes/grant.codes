import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'

const Page = async ({ params }) => {
  const posts = await getPosts({
    query: { ...params, typeOrYear: 'photo' },
    limit: 50,
  })
  return <PostList posts={posts} type='photos' title='Photos' params={params} />
}

export default Page

export const metadata = {
  title: 'Photos',
}
