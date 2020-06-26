import React, { useState } from 'react'
import PropTypes from 'prop-types'
import AvatarMarker from '../Map/AvatarMarker'
import Post from '../Post'
import styles from 'css/components/posts-map.module.scss'

const PostMarker = ({ post, ...markerProps }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AvatarMarker
        {...markerProps}
        onClick={(e) => setOpen(true)}
        highlight={open}
      />
      <div
        className={styles['post-container']}
        open={open}
        onClick={(e) => setOpen(false)}
      >
        <div className={styles.posts}>
          <Post post={post} compact />
        </div>
      </div>
    </>
  )
}

PostMarker.propTypes = {
  post: PropTypes.object.isRequired,
  // center: PropTypes.array.isRequired
}

export default PostMarker
