import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import getTypes from 'lib/get/post-types'
import getPageCount from 'lib/get/page-count'

interface PageParams {
  page: string
  typeOrYear: string
}

const Page = async ({ params }) => {
  const posts = await getPosts({ query: params })
  return <PostList posts={posts} type="home" params={params} />
}

// export async function generateStaticParams (): Promise<PageParams[]> {
//   const params: PageParams[] = []
//   const ingoredTypes = ['photos', 'journals']
//   // Get all types
//   let types = await getTypes(true)
//   types = types.filter(type => !ingoredTypes.includes(type))
//   for (const type of types) {
//     // Get post count for each post type
//     const pageCount = await getPageCount({ type })
//     for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
//       params.push({ page: `${pageNumber}`, typeOrYear: type })
//     }
//   }

//   return params
// }

export default Page
