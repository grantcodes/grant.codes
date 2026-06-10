import React from 'react'
import Post from './index'
import normalizeMf2 from '../../lib/normalize-mf2'

const Comment = ({ comment }) => {
  if (typeof comment === 'string') {
    return <p>{comment}</p>
  } else if (comment.properties) {
    comment = normalizeMf2(comment)
    return <Post className="p-comment" post={comment} compact />
  } else {
    return null
  }
}

export default Comment
