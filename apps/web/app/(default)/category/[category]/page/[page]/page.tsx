import PostList from 'components/PostList'
import getPosts from 'lib/get/posts'
import getCategories from 'lib/get/categories'
import { notFound } from 'next/navigation'

interface PageParams {
  page: string
  category: string
}

const Page = async props => {
  const params = await props.params;
  const allCategories = await getCategories()
  const category = allCategories.find(cat => cat.slug === params.category)

  if (!category) {
    return notFound()
  }

  const posts = await getPosts({
    query: { category: category.name, type: 'all', page: params.page },
  })

  return (
    <>
      <PostList
        title={`Category: ${category.name} page ${params.page}`}
        posts={posts}
        type='home'
        params={params}
      />
    </>
  )
}

export default Page
