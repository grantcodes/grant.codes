import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import Link from '../../Link'
import FullscreenPhoto from '../../FullscreenPhoto'
import Image from './Image'

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
          const defaultImageProps = { url: value, width: null, height: null }
          const {
            url: src,
            width,
            height,
          } = imageSizes?.[value]?.[700] ?? defaultImageProps

          return (
            <Link
              className="card__breakout"
              key={`post-photo-${photoIndex}`}
              to={permalink}
              onClick={handleClick(value)}
            >
              <Image src={src} alt={alt} width={width} height={height} />
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
