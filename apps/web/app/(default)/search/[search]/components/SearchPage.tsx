import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import { getMetadata } from 'lib/get/metadata'

const SearchPage = async ({ params }) => {
  const posts = await getPosts({ query: params })
  const metadata = await getMetadata({ params })

  return (
    <>
      {metadata.title && <h1 className='page-title'>{metadata.title}</h1>}
      <PostList posts={posts} type='home' params={params} />
    </>
  )
}

export { SearchPage }
