const devMode = process.env.NODE_ENV === 'development'

export default function (mf2) {
  // De duplicate name & content if they are equal
  if (mf2.properties.name && mf2.properties.content) {
    let tmpContent = mf2.properties.content[0]
    if (tmpContent.value) {
      tmpContent = tmpContent.value
    } else if (tmpContent.html) {
      tmpContent = tmpContent.html
    }
    if (
      typeof tmpContent === 'string' &&
      typeof mf2.properties.name[0] === 'string' &&
      mf2.properties.name[0].trim().toLowerCase() ===
        tmpContent.trim().toLowerCase()
    ) {
      delete mf2.properties.name
    }
  }

  // Add myself as the default author
  if (!mf2.properties.author) {
    mf2.properties.author = [
      {
        type: ['h-card'],
        properties: {
          name: [process.env.NEXT_PUBLIC_AUTHOR_NAME],
          url: [process.env.NEXT_PUBLIC_URL],
          photo: [process.env.NEXT_PUBLIC_AUTHOR_PHOTO],
        },
      },
    ]
  }

  // Remove person tag categories
  if (mf2.properties.category) {
    mf2.properties.category = mf2.properties.category.filter((cat) => {
      if (cat.type && cat.type[0] === 'h-card') {
        return false
      }
      return true
    })
  }

  // Fix multiple reply urls from brid.gy
  const replyProperties = [
    'in-reply-to',
    'like-of',
    'quotation-of',
    'repost-of',
  ]
  for (const property of replyProperties) {
    if (mf2.properties[property] && mf2.properties[property].length > 1) {
      const onSiteReply = mf2.properties[property].find((reply) => {
        if (
          typeof reply === 'string' &&
          reply.startsWith(process.env.NEXT_PUBLIC_URL)
        ) {
          return true
        }
        return false
      })
      if (onSiteReply) {
        mf2.properties[property] = [onSiteReply]
      }
    }
  }

  // Remove empty & non array properties
  for (const property in mf2.properties) {
    if (mf2.properties.hasOwnProperty(property)) {
      const value = mf2.properties[property]
      if (!Array.isArray(value) || value.length === 0) {
        delete mf2.properties[property]
      }
    }
  }

  // Use remote photos if working locally
  if (devMode && mf2.properties.photo) {
    mf2.properties.photo = mf2.properties.photo.map((photo) => {
      if (typeof photo === 'string') {
        return photo.replace('http://localhost:3000', 'https://grant.codes')
      } else if (photo.value) {
        photo.value = photo.value.replace(
          'http://localhost:3000',
          'https://grant.codes'
        )
        return photo
      }
    })
  }

  return mf2
}
