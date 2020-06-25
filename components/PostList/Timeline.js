import React from 'react'
import Post from '../Post'
import Pagination from '../Container/Pagination'

const Timeline = ({ posts = [] }) => (
  <>
    {posts.map((post, i) => (
      <Post post={post} key={`post-list-${i}`} compact />
    ))}

    <Pagination noNext={posts.length < 10} />
  </>
)

export default Timeline
