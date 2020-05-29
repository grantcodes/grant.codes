import React from 'react'
import Post from '../Post'
import Loading from '../Loading'
import Pagination from '../Container/Pagination'
import Card from '../Card'

const Timeline = ({ posts, olderLink, newerLink, title }) => (
  <>
    {posts ? (
      posts.map((post, i) => (
        <Post post={post} key={`post-list-${i}`} compact />
      ))
    ) : (
      <>
        <Card>
          <p className="post__title">Loading...</p>
        </Card>
        <Loading />
      </>
    )}

    <Pagination next={olderLink} previous={newerLink} />
  </>
)

export default Timeline
