import Link from '../../Link'
import Image from './Image'

interface PostPhotoProps {
  photos: any[]
  imageSizes: any
  permalink?: string
}

const Photo = ({ photos, imageSizes = {}, permalink }: PostPhotoProps) => (
  <>
    {photos.map((value, photoIndex) => {
      let alt = ''
      if (typeof value === 'object' && value.value) {
        alt = value.alt
        value = value.value
      }

      if (typeof value === 'string') {
        const defaultImageProps = { url: value, width: null, height: null }
        const {
          url: src,
          width,
          height,
        } = imageSizes?.[value]?.[700] ?? defaultImageProps

        return (
          <Link
            className="card__breakout"
            key={`post-photo-${photoIndex}`}
            to={permalink}
          >
            <Image src={src} alt={alt} width={width} height={height} />
            <data className="u-photo" value={value} />
          </Link>
        )
      }
    })}
  </>
)

export { Photo }
