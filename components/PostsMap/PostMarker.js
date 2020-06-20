import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AvatarMarker from '../Map/AvatarMarker'
import Post from '../Post'
import { palette } from '../Theme/helpers'

const MapPostContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 5;
  &.is-hidden {
    visibility: hidden;
    pointer-events: none;
  }
`

const MapPost = styled.div`
  position: relative;
  max-width: 20em;
  margin: auto;
  background: var(--color-main);

  /* TODO: THis won't work */
  > .post > .card {
    margin: 0;
  }
`

const PostMarker = ({ post, ...markerProps }) => {
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <AvatarMarker
        {...markerProps}
        onClick={(e) => setOpen(true)}
        highlight={open}
      />
      <MapPostContainer open={open} onClick={(e) => setOpen(false)}>
        <MapPost>
          <Post post={post} compact />
        </MapPost>
      </MapPostContainer>
    </Fragment>
  )
}

PostMarker.propTypes = {
  post: PropTypes.object.isRequired,
  // center: PropTypes.array.isRequired
}

export default PostMarker
