import classnames from 'classnames'
import Link from '../Link'
import getAuthor from 'lib/get/author'
import imageProxy from '../../lib/image-proxy'
import styles from 'css/components/avatar.module.scss'

const Avatar = ({
  author,
  alt = '',
  noLink = false,
  noName = false,
  size = 20,
  noProxy = false,
}) => {
  if (!author) {
    return null
  }
  if (!author.url) {
    author = getAuthor(author)
  }
  if (!author.url) {
    return null
  }

  const photoUrl = author.photo
    ? noProxy
      ? author.photo
      : imageProxy(author.photo, { w: size, h: size, fit: 'contain', dpr: 2 })
    : null

  return (
    <div className={classnames(styles.author, 'h-card p-author')}>
      <Link className="u-url" to={author.url} as={noLink ? 'span' : null}>
        <img
          className={classnames(styles.thumbnail, 'u-photo')}
          src={photoUrl}
          alt={alt}
          width={size}
          title={alt + author.name}
          loading="lazy"
        />
        <span
          className={classnames(styles.author__name, 'p-name', {
            'screen-reader-text': !!noName,
          })}
        >
          {author.name}
        </span>
      </Link>
    </div>
  )
}

export default Avatar
