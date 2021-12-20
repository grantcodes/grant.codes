import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Lightbox from 'react-image-lightbox'

const FullscreenPhoto = ({
  originalUrl = null,
  permalink,
  onClose,
  photo,
  thumbnail,
  alt,
  name,
  content,
  onPrevious,
  onNext,
  nextPhoto,
  previousPhoto,
}) => {
  const [open, setOpen] = useState(true)
  const [previousUrl, setPreviousUrl] = useState(previousUrl)

  useEffect(() => {
    if (typeof window !== 'undefined' && !previousUrl) {
      setPreviousUrl(window.location.href)
    }
    if (permalink && typeof window !== 'undefined') {
      window.history.replaceState({}, '', permalink)
    }
  }, [])

  const handleClose = (e) => {
    if (previousUrl && typeof window !== 'undefined') {
      setPreviousUrl(false)
      window.history.replaceState({}, '', previousUrl)
    }
    setOpen(false)
    if (onClose) {
      onClose()
    }
  }

  if (!open) {
    return null
  }

  const lightboxProps = {
    mainSrc: photo,
    mainSrcThumbnail: thumbnail,
    imageTitle: name,
    imageCaption: content,
    onCloseRequest: handleClose,
  }

  if (onNext) {
    lightboxProps.onMoveNextRequest = () => {
      if (nextPhoto && nextPhoto.permalink) {
        window.history.replaceState({}, '', nextPhoto.permalink)
      }
      onNext()
    }
  }

  if (onPrevious) {
    lightboxProps.onMovePrevRequest = () => {
      if (previousPhoto && previousPhoto.permalink) {
        window.history.replaceState({}, '', previousPhoto.permalink)
      }
      onPrevious()
    }
  }

  if (nextPhoto && nextPhoto.photo) {
    lightboxProps.nextSrc = nextPhoto.photo
  }

  if (nextPhoto && nextPhoto.thumbnail) {
    lightboxProps.nextSrcThumbnail = nextPhoto.thumbnail
  }

  if (previousPhoto && previousPhoto.photo) {
    lightboxProps.prevSrc = previousPhoto.photo
  }

  if (previousPhoto && previousPhoto.thumbnail) {
    lightboxProps.prevSrcThumbnail = previousPhoto.thumbnail
  }

  return <Lightbox {...lightboxProps} />
}

FullscreenPhoto.propTypes = {
  photo: PropTypes.string.isRequired,
  name: PropTypes.string,
  alt: PropTypes.string,
  content: PropTypes.string,
  permalink: PropTypes.string,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onClose: PropTypes.func,
  nextPhoto: PropTypes.object,
  previousPhoto: PropTypes.object,
}

export default FullscreenPhoto
