import NotFound from '../NotFound'
import Timeline from './Timeline'
import Gallery from './Gallery'
import Map from './Map'

const PostList = ({ posts, type = '', title = '' }) => {
  if (posts && posts.length === 0) {
    return <NotFound />
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

  return <Layout posts={posts} title={title} />
}

export default PostList
