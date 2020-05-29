import { useRouter } from 'next/router'
import NotFound from '../NotFound'
import Timeline from './Timeline'
import Gallery from './Gallery'
import Map from './Map'

let perPage = 10

const PostList = ({ posts, type = '', title = '' }) => {
  const {
    asPath: pathname,
    query: { page = 1 },
  } = useRouter()

  // TODO: Convert to hooks
  const oldLink = () => {
    const olderPage = (parseInt(page) || 1) + 1
    if ((posts && posts.length < perPage) || olderPage < 1) {
      return null
    }
    const pathParts = pathname ? pathname.split('/').filter((part) => part) : []
    if (pathParts.find((part) => part === 'page')) {
      // This is a paged url
      pathParts.pop()
      pathParts.push(olderPage)
    } else {
      pathParts.push('page', olderPage)
    }
    return '/' + pathParts.join('/')
  }

  const newLink = () => {
    const newerPage = (parseInt(page) || 1) - 1
    if (newerPage < 1) {
      return null
    }
    const pathParts = pathname ? pathname.split('/').filter((part) => part) : []
    if (pathParts.find((part) => part === 'page')) {
      // This is a paged url
      pathParts.pop()
      pathParts.push(newerPage)
    } else {
      pathParts.push('page', newerPage)
    }
    return '/' + pathParts.join('/')
  }

  const olderLink = oldLink()
  const newerLink = newLink()

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

  return (
    <Layout
      posts={posts}
      olderLink={olderLink}
      newerLink={newerLink}
      title={title}
    />
  )
}

export default PostList
