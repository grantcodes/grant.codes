import React, { Fragment, useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import Link from '../Link'
import FullscreenPhoto from '../FullscreenPhoto'

const PostPhoto = ({ photos, imageSizes, permalink }) => {
  const [fullscreen, setFullscreen] = useState(null)

  const handleClick = (photo) => (e) => {
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
            <Link
              className="card__breakout"
              key={`post-photo-${photoIndex}`}
              to={permalink}
              onClick={handleClick(value)}
            >
              <img src={smallSrc} alt={alt} loading="lazy" />
              <data className="u-photo" value={value} />
            </Link>
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
