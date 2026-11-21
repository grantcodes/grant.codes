import { getThumbnailUrl } from './post-media'

/** A photo as @postr/astro projects it; dimensions and copies come from postr's media library. */
export interface Photo {
  url: string
  alt?: string
  width?: number
  height?: number
  sizes?: Record<string, { url: string; width: number; height: number }>
}

/** Attributes for an <img>. `fallback` is the URL to retry with when `src` (a guessed copy) fails. */
export interface PhotoImage {
  src: string
  fallback?: string
  width?: number
  height?: number
  srcset?: string
  sizes?: string
}

/** The square 200x200 crop for grid tiles. */
export function thumbnailImage(photo: Photo): PhotoImage {
  const crop = photo.sizes?.['200x200']
  if (crop) return { src: crop.url, width: crop.width, height: crop.height }
  return { src: getThumbnailUrl(photo.url, '200x200'), fallback: photo.url }
}

/**
 * A photo at its own aspect ratio: the recorded size and every wide copy as a srcset when
 * postr knows them, else the guessed `size` copy with the original as fallback.
 */
export function photoImage(photo: Photo, size: '700' | '1800', sizes = '100vw'): PhotoImage {
  const copies = Object.entries(photo.sizes ?? {}).filter(([name]) => !name.includes('x'))
  if (photo.width && photo.height) {
    const candidates = [...copies.map(([, copy]) => copy), { url: photo.url, width: photo.width }]
    return {
      src: photo.sizes?.[size]?.url ?? photo.url,
      width: photo.width,
      height: photo.height,
      srcset: candidates.map((c) => `${c.url} ${c.width}w`).join(', '),
      sizes,
    }
  }
  return { src: getThumbnailUrl(photo.url, size), fallback: photo.url }
}

/**
 * `onerror` for images: retry a guessed copy with the original (data-fallback), then hide the
 * closest `selector` (tile, figure) when the original is missing too.
 */
export const onImageError = (selector: string) =>
  `if (this.dataset.fallback && this.src !== this.dataset.fallback) { this.removeAttribute('srcset'); this.src = this.dataset.fallback } else { this.onerror = null; this.closest('${selector}').hidden = true }`
