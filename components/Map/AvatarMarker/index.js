import classnames from 'classnames'
import PropTypes from 'prop-types'
import Overlay from 'pigeon-overlay'
import styles from 'css/components/map.module.scss'

const AvatarMarker = ({ image, alt, highlight, ...props }) => (
  <Overlay
    {...props}
    className={classnames(styles['avatar-marker'], {
      'is-highlighted': highlight,
    })}
  >
    <img src={image} alt={alt} loading="lazy" />
  </Overlay>
)

AvatarMarker.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  highlight: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

AvatarMarker.defaultProps = {
  image: process.env.NEXT_PUBLIC_AUTHOR_PHOTO,
  alt: 'A marker showing ' + process.env.NEXT_PUBLIC_AUTHOR_NAME,
  highlight: false,
}

export default AvatarMarker
