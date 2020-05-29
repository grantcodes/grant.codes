import React from 'react'
import Loading from '../Loading'
import Pagination from '../Container/Pagination'
import PostsMap from '../PostsMap'

const Map = ({ posts, newerLink, olderLink, title }) => (
  <>
    {posts ? <PostsMap title={title} posts={posts} /> : <Loading />}
    <Pagination
      next={olderLink}
      previous={newerLink}
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 1,
      }}
    />
  </>
)

export default Map
