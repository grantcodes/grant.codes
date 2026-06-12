export interface NormalizeMf2Config {
  authorName?: string
  siteUrl?: string
  authorPhoto?: string
  devMode?: boolean
  localUrl?: string
  remoteUrl?: string
}

export default function normalizeMf2(
  mf2: any,
  config: NormalizeMf2Config = {}
): any {
  const {
    authorName = '',
    siteUrl = '',
    authorPhoto = '',
    devMode = false,
    localUrl = 'http://localhost:3000',
    remoteUrl = 'https://grant.codes',
  } = config

  // De-duplicate name & content if they are equal
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

  // Add default author if absent
  if (!mf2.properties.author) {
    mf2.properties.author = [
      {
        type: ['h-card'],
        properties: {
          name: [authorName],
          url: [siteUrl],
          photo: [authorPhoto],
        },
      },
    ]
  }

  // Remove person-tag categories (h-card entries)
  if (mf2.properties.category) {
    mf2.properties.category = mf2.properties.category.filter((cat: any) => {
      if (cat.type && cat.type[0] === 'h-card') {
        return false
      }
      return true
    })
  }

  // Fix multiple reply URLs from brid.gy
  const replyProperties = [
    'in-reply-to',
    'like-of',
    'quotation-of',
    'repost-of',
  ]
  for (const property of replyProperties) {
    if (mf2.properties[property] && mf2.properties[property].length > 1) {
      const onSiteReply = mf2.properties[property].find((reply: any) => {
        if (typeof reply === 'string' && reply.startsWith(siteUrl)) {
          return true
        }
        return false
      })
      if (onSiteReply) {
        mf2.properties[property] = [onSiteReply]
      }
    }
  }

  // Remove empty & non-array properties
  for (const property in mf2.properties) {
    if (Object.prototype.hasOwnProperty.call(mf2.properties, property)) {
      const value = mf2.properties[property]
      if (!Array.isArray(value) || value.length === 0) {
        delete mf2.properties[property]
      }
    }
  }

  // Replace localhost URLs with remote URLs in dev mode
  if (devMode && mf2.properties.photo) {
    const devLocal = localUrl
    const devRemote = remoteUrl
    mf2.properties.photo = mf2.properties.photo.map((photo: any) => {
      if (typeof photo === 'string') {
        return photo.replace(devLocal, devRemote)
      } else if (photo.value) {
        photo.value = photo.value.replace(devLocal, devRemote)
        return photo
      }
      return photo
    })
  }

  return mf2
}
