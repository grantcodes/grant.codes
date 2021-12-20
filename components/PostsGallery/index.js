import React, { Fragment, useState } from 'react'
import Image from 'next/image'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import FullscreenPhoto from '../FullscreenPhoto'
import Post from '../Post'
import Link from '../Link'
import getPostPhotos from './get-post-photos'
import { nextImageLoader } from 'lib/image-proxy'
import styles from 'css/components/posts-gallery.module.scss'

const imageLoader =
  process.env.NODE_ENV === 'production' ? undefined : nextImageLoader

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
      <div className={styles.gallery}>
        {photos.map((photo, i) =>
          type === 'feed' ? (
            <Link
              className={styles.item}
              key={'posts-gallery-photo-' + i}
              to={photo.permalink}
              onClick={(e) => {
                e.preventDefault()
                setSelectedPhotoIndex(i)
              }}
              maxWidth={maxWidth}
            >
              <Image
                className={styles.photo}
                src={photo.photo}
                width={200}
                height={200}
                layout="responsive"
                sizes="(min-width: 1135px) 172px, (min-width: 468px) 20vw, 33vw"
                loader={imageLoader}
              />
            </Link>
          ) : (
            <Fragment key={'posts-gallery-photo-' + i}>
              <div
                className={classnames('h-cite', styles.item)}
                maxWidth={maxWidth}
              >
                <Link to={photo.permalink} className="u-url">
                  <Image
                    className={styles.photo}
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedPhotoIndex(i)
                    }}
                    src={photo.photo}
                    alt={photo.alt}
                    width={200}
                    height={200}
                    layout="responsive"
                    sizes="(min-width: 1135px) 172px, (min-width: 468px) 20vw, 33vw"
                    loader={imageLoader}
                  />
                  <data className="u-photo" value={photo.photo} />
                </Link>
              </div>
              <data className="u-photo" value={photo.photo} />
            </Fragment>
          )
        )}
      </div>

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
