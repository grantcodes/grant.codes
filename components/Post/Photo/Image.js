import React from 'react'
import Image from "next/image"
import PropTypes from 'prop-types'

const PostPhotoImage = ({
  src,
  alt = '',
  width = null,
  height = null,
  className = '',
}) => {
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto"
        }} />
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />
}

PostPhotoImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default PostPhotoImage
