/**
 * Uses https://images.weserv.nl/ to provide a resized image proxy.
 */
export default function imageProxy(
  originalUrl,
  options = { dpr: 1, il: true }
) {
  const url = encodeURIComponent(
    originalUrl.replace('http://', '').replace('https://', '')
  )
  let proxyUrl = `https://images.weserv.nl/?url=${url}&errorredirect=${url}`
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const value = options[key]
      if (value === true) {
        proxyUrl += '&' + key
      } else {
        proxyUrl += `&${key}=${value}`
      }
    }
  }
  return proxyUrl
}

/**
 * Wrapper function for the imageProxy function to be used with next/image
 *
 * @param {object} Params for next image loader function
 * @returns string The weserv.nl url
 */
export function nextImageLoader({ src, width, quality = 80 }) {
  const weserveUrl = imageProxy(src, { w: width, q: quality })
  return weserveUrl
}
