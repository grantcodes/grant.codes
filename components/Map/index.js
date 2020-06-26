import classnames from 'classnames'
import PropTypes from 'prop-types'
import PigeonMap from 'pigeon-maps'
import AvatarMarker from './AvatarMarker'
import getLatLngFromMf2 from './lib/getLatLngFromMf2'
import styles from 'css/components/map.module.scss'

const Map = ({
  children,
  location,
  className,
  themed,
  style,
  hideDefaultMarker,
  ...mapProps
}) => {
  // Get the center from the location provided
  const center = getLatLngFromMf2(location)
  if (center === null) {
    return null
  }

  // Set different map providers based on the theme
  const provider = (x, y, z) =>
    !!themed
      ? `https://stamen-tiles-a.a.ssl.fastly.net/toner-lite/${z}/${x}/${y}@2x.png`
      : `https://a.tile.openstreetmap.se/hydda/full/${z}/${x}/${y}.png`

  return (
    <div
      className={classnames('map', className, styles.map, {
        [styles['map--plain']]: !themed,
      })}
      style={style}
      themed={themed}
    >
      <PigeonMap center={center} {...mapProps} provider={provider}>
        {children ? children : <AvatarMarker anchor={center} />}
      </PigeonMap>
    </div>
  )
}

Map.propTypes = {
  className: PropTypes.string.isRequired,
  location: PropTypes.any.isRequired,
  themed: PropTypes.bool.isRequired,
  defaultWidth: PropTypes.number,
  defaultHeight: PropTypes.number,
  zoom: PropTypes.number.isRequired,
  metaWheelZoom: PropTypes.bool.isRequired,
}

Map.defaultProps = {
  className: '',
  themed: false,
  zoom: 14,
  metaWheelZoom: true,
}

export default Map
