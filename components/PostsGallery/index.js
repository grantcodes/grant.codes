import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FullscreenPhoto from '../FullscreenPhoto'
import Post from '../Post'
import Link from '../Link'
import getPostPhotos from './get-post-photos'

const Gallery = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
`

const GalleryItem = styled.div`
  display: block;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  cursor: zoom;
  width: ${(props) => props.maxWidth}%;
  max-width: ${(props) => props.maxWidth}%;
  @media (max-width: 30rem) {
    width: 33.333%;
    max-width: 33.333%;
  }

  &::before {
    content: '';
    display: block;
    width: 100%;
    padding-bottom: 100%;
    pointer-events: none;
  }
`

const GalleryPhoto = styled.img`
  display: block;
  width: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
`

const PostsGallery = ({ posts = [], type, maxWidth = 33.333 }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(false)
  const [originalUrl, setOriginalUrl] = useState(
    typeof window !== 'undefined' ? window.location.href : null
  )

  const getPhotos = (posts) => {
    let photos = []
    for (const post of posts) {
      photos = [...photos, ...getPostPhotos(post)]
    }
    return photos
  }

  const getSelectedPhotos = () => {
    const photos = getPhotos(posts)
    if (selectedPhotoIndex !== false) {
      return {
        current: photos[selectedPhotoIndex],
        next:
          selectedPhotoIndex < photos.length
            ? photos[selectedPhotoIndex + 1]
            : null,
        previous:
          selectedPhotoIndex > 0 ? photos[selectedPhotoIndex - 1] : null,
      }
    }
    return {
      current: null,
      next: null,
      previous: null,
    }
  }

  const photos = getPhotos(posts)
  const selectedPhotos = getSelectedPhotos()

  return (
    <Fragment>
      <Gallery>
        {photos.map((photo, i) =>
          type === 'feed' ? (
            <GalleryItem
              as={Link}
              key={'posts-gallery-photo-' + i}
              to={photo.permalink}
              onClick={(e) => {
                e.preventDefault()
                setSelectedPhotoIndex(i)
              }}
              maxWidth={maxWidth}
            >
              <GalleryPhoto src={photo.thumbnail} width={200} height={200} />
            </GalleryItem>
          ) : (
            <Fragment key={'posts-gallery-photo-' + i}>
              <GalleryItem className="h-cite" maxWidth={maxWidth}>
                <Link to={photo.permalink} className="u-url">
                  <GalleryPhoto
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedPhotoIndex(i)
                    }}
                    src={photo.thumbnail}
                    alt={photo.alt}
                    width={200}
                    height={200}
                  />
                  <data className="u-photo" value={photo.photo} />
                </Link>
              </GalleryItem>
              <data className="u-photo" value={photo.photo} />
            </Fragment>
          )
        )}
      </Gallery>

      {/* If this is a feed page, output valid mf2 as hidden html */}
      {type === 'feed' && (
        <div className="screen-reader-text">
          {posts.map((post) => (
            <Post
              post={post}
              key={`hidden-photo-posts-${post.properties.url[0]}`}
            />
          ))}
        </div>
      )}

      {!!selectedPhotos.current && (
        <FullscreenPhoto
          originalUrl={originalUrl}
          {...selectedPhotos.current}
          nextPhoto={selectedPhotos.next}
          previousPhoto={selectedPhotos.previous}
          onClose={() => setSelectedPhotoIndex(false)}
          onNext={() => {
            if (selectedPhotos.next) {
              setSelectedPhotoIndex(selectedPhotoIndex + 1)
            }
          }}
          onPrevious={() => {
            if (selectedPhotos.previous) {
              setSelectedPhotoIndex(selectedPhotoIndex - 1)
            }
          }}
        />
      )}
    </Fragment>
  )
}

PostsGallery.propTypes = {
  posts: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['collection', 'feed']),
}

PostsGallery.defaultProps = {
  posts: [],
  type: 'collection',
}

export default PostsGallery
