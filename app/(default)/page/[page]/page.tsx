import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import getPageCount from 'lib/get/page-count'

export interface PageParams {
  page: string
}

const Home = async ({ params }) => {
  const posts = await getPosts({ query: params })
  return <PostList posts={posts} type='home' params={params} />
}

// export const metadata = {
//   title: 'Home', // TODO: Home page 2
// }

// export async function generateStaticParams(): Promise<PageParams[]> {
//   // Count how many pages are needed
//   const pageCount = await getPageCount()
//   const pages: PageParams[] = []
//   for (let pageNumber = 1; pageNumber < pageCount; pageNumber++) {
//     pages.push({ page: `${pageNumber}` })
//   }

//   return pages
// }

export { generateMetadata } from 'lib/get/metadata'

export default Home
