import { notFound } from 'next/navigation'
import Timeline from './Timeline'
import Gallery from './Gallery'
import Map from './Map'

const PostList = ({ posts, type = '', title = '', params = {} }) => {
  if (posts && posts.length === 0) {
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

  return <Layout posts={posts} title={title} params={params} />
}

export default PostList
