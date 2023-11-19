const reactPlayerHosthames: string[] = [
  'dailymotion.com',
  'mixcloud.com',
  'soundcloud.com',
  'streamable.com',
  'twitch.tv',
  'vidyard.com',
  'vimeo.com',
  'wistia.com',
  'youtu.be',
  'youtube.com',
]

const imageFileExtensions: string[] = [
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
  'avif',
]

const getEmbedType = (originalUrl: string): string | null => {
  const url = new URL(originalUrl)

  if (reactPlayerHosthames.find(host => url.hostname.includes(host))) {
    return 'react-player'
  }

  if (imageFileExtensions.find(ext => url.pathname.endsWith(`.${ext}`))) {
    return 'image'
  }

  if (url.hostname === 'twitter.com') {
    return 'twitter'
  }

  return null
}

export { getEmbedType }
