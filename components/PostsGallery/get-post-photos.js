import React from 'react'

const getPostPhotos = (post) => {
  const { properties, cms } = post
  const photos = []
  const data = {}

  if (!properties) {
    return photos
  }

  if (properties.name && properties.name[0]) {
    data.name = properties.name[0]
  }

  if (properties.content && properties.content[0]) {
    let content = properties.content[0]
    if (typeof content === 'string') {
      data.content = <p dangerouslySetInnerHTML={{ __html: content }} />
    } else if (content.html) {
      data.content = <div dangerouslySetInnerHTML={{ __html: content.html }} />
    } else if (content.value) {
      data.content = <p dangerouslySetInnerHTML={{ __html: content.value }} />
    }
  }

  if (properties.url && properties.url[0]) {
    data.permalink = properties.url[0]
  }

  if (properties.photo) {
    for (const photo of properties.photo) {
      const photoData = { ...data }
      if (photo && typeof photo === 'string') {
        photoData.photo = photo
        if (
          cms &&
          cms.imageSizes &&
          cms.imageSizes[photo] &&
          cms.imageSizes[photo]['200x200'] &&
          cms.imageSizes[photo]['200x200'] !== photo
        ) {
          photoData.thumbnail = cms.imageSizes[photo]['200x200']
        } else {
          try {
            const { hostname, pathname } = new URL(photo)
            const encodedUrl = encodeURIComponent(hostname + pathname)
            photoData.thumbnail = `https://images.weserv.nl/?url=${encodedUrl}&w=200&h=200&t=square`
          } catch (err) {
            console.warn('[Error with photo url]', err)
          }
        }
        photos.push(photoData)
      } else if (typeof photo === 'object' && photo.value) {
        photoData.photo = photo.value
        photoData.alt = photo.alt
        if (
          cms &&
          cms.imageSizes &&
          cms.imageSizes[photo.value] &&
          cms.imageSizes[photo.value]['200x200'] &&
          cms.imageSizes[photo.value]['200x200'] !== photo.value
        ) {
          photoData.thumbnail = cms.imageSizes[photo.value]['200x200']
        } else {
          try {
            const { hostname, pathname } = new URL(photo.value)
            const encodedUrl = encodeURIComponent(hostname + pathname)
            photoData.thumbnail = `https://images.weserv.nl/?url=${encodedUrl}&w=200&h=200&t=square`
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
