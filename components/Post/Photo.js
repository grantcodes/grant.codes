import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import Link from '../Link'
import CardBreakout from '../Card/Breakout'
import FullscreenPhoto from '../FullscreenPhoto'

const PostPhoto = ({ photos, imageSizes, permalink }) => {
  const [fullscreen, setFullscreen] = useState(null)

  const handleClick = photo => e => {
    e.preventDefault()
    setFullscreen(photo)
  }

  return (
    <Fragment>
      {photos.map((value, photoIndex) => {
        let alt = ''
        if (typeof value === 'object' && value.value) {
          alt = value.alt
          value = value.value
        }
        if (typeof value === 'string') {
          let smallSrc = value
          if (imageSizes && imageSizes[value] && imageSizes[value][700]) {
            smallSrc = imageSizes[value][700]
          }

          return (
            <CardBreakout
              as={Link}
              key={`post-photo-${photoIndex}`}
              to={permalink}
              onClick={handleClick(value)}
            >
              <img src={smallSrc} alt={alt} />
              <data className="u-photo" value={value} />
            </CardBreakout>
          )
        }
      })}
      {fullscreen !== null && (
        <FullscreenPhoto
          photo={fullscreen}
          onClose={() => setFullscreen(null)}
        />
      )}
    </Fragment>
  )
}

PostPhoto.propTypes = {
  photos: PropTypes.array.isRequired,
  imageSizes: PropTypes.object.isRequired,
  permalink: PropTypes.string,
}

PostPhoto.defaultProps = {
  imageSizes: {},
}

export default PostPhoto
