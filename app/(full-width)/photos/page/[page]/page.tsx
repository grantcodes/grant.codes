import PostList from 'components/PostList'
import getTypes from 'lib/get/post-types'
import getPageCount from 'lib/get/page-count'
import getPosts from 'lib/get/posts'

const Page = async ({ params }) => {
  const posts = await getPosts({
    query: { ...params, typeOrYear: 'photos' },
    limit: 50,
  })
  return (
    <PostList posts={posts} type="photos" title={`Photos`} params={params} />
  )
}

export async function generateStaticParams() {
  const params: any[] = []
  const ingoredTypes = ['photos', 'journals']
  // Get all types
  let types = await getTypes(true)
  types = types.filter((type) => !ingoredTypes.includes(type))
  for (const type of types) {
    // Get post count for each post type
    const pageCount = await getPageCount({ type })
    for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
      params.push({ page: `${pageNumber}`, typeOrYear: type })
    }
  }

  // Return the paths, with a fallback to dynamically new / old categories
  return params
}

export default Page
