import { notFound } from 'next/navigation'
import Timeline from './Timeline'
import Gallery from './Gallery'
import Map from './Map'

interface PostListProps {
  posts: any[]
  type?: string
  title?: string
  params?: any
  ignoreNotFound?: boolean
}

const PostList = ({
  posts,
  type = '',
  title = '',
  params = {},
  ignoreNotFound = false,
}: PostListProps) => {
  if (posts && posts.length === 0 && !ignoreNotFound) {
    return notFound()
  }

  let Layout = Timeline
  switch (type) {
    case 'checkins':
      Layout = Map
      break
    case 'photos':
      Layout = Gallery
      break
  }

  // @ts-ignore
  return <Layout posts={posts} title={title} params={params} />
}

export { PostList }
