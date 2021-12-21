import React from 'react'
import imageProxy from 'lib/image-proxy'

const getPostPhotos = (post) => {
  const { properties, cms } = post
  const photos = []
  const data = {}

  if (!properties) {
    return photos
  }

  if (properties?.name?.[0]) {
    data.name = properties.name[0]
  }

  if (properties?.content?.[0]) {
    let content = properties.content[0]
    if (typeof content === 'string') {
      data.content = <p dangerouslySetInnerHTML={{ __html: content }} />
    } else if (content.html) {
      data.content = <div dangerouslySetInnerHTML={{ __html: content.html }} />
    } else if (content.value) {
      data.content = <p dangerouslySetInnerHTML={{ __html: content.value }} />
    }
  }

  if (properties?.url?.[0]) {
    data.permalink = properties.url[0]
  }

  if (process.env.NODE_ENV !== 'production' && data.permalink) {
    data.permalink = data.permalink
      .replace(process.env.NEXT_PUBLIC_URL, '')
      .replace('https://grant.codes', '')
  }

  if (properties.photo) {
    for (const photo of properties.photo) {
      const photoData = { ...data }
      if (photo && typeof photo === 'string') {
        photoData.photo = photo
        if (
          cms?.imageSizes?.[photo]?.['200x200']?.url &&
          cms.imageSizes[photo]['200x200']?.url !== photo
        ) {
          photoData.thumbnail = cms.imageSizes[photo]['200x200'].url
        } else {
          try {
            const { hostname, pathname } = new URL(photo)
            photoData.thumbnail = imageProxy(hostname + pathname, {
              w: 200,
              h: 200,
              t: 'square',
            })
          } catch (err) {
            console.warn('[Error with photo url]', err)
          }
        }
        photos.push(photoData)
      } else if (typeof photo === 'object' && photo.value) {
        photoData.photo = photo.value
        photoData.alt = photo.alt
        if (
          cms?.imageSizes?.[photo.value]?.['200x200']?.url &&
          cms.imageSizes[photo.value]['200x200']?.url !== photo.value
        ) {
          photoData.thumbnail = cms.imageSizes[photo.value]['200x200'].url
        } else {
          try {
            const { hostname, pathname } = new URL(photo.value)
            photoData.thumbnail = imageProxy(hostname + pathname, {
              w: 200,
              h: 200,
              t: 'square',
            })
          } catch (err) {
            console.warn('[Error with photo url]', err)
          }
        }
        photos.push(photoData)
      }
    }
  }
  return photos
}

export default getPostPhotos
