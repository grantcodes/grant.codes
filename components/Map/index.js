'use client'

import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Map as PigeonMap } from 'pigeon-maps'
import AvatarMarker from './AvatarMarker'
import getLatLngFromMf2 from './lib/getLatLngFromMf2'
import styles from '../../css/components/map.module.scss'

const Map = ({
  children,
  location,
  className,
  style,
  hideDefaultMarker,
  ...mapProps
}) => {
  // Get the center from the location provided
  const center = getLatLngFromMf2(location) ?? [0, 0]

  const provider = (x, y, z) =>
    `https://api.mapbox.com/styles/v1/grantcodes/ckctekw712q2k1jph87kqekjk/tiles/256/${z}/${x}/${y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`

  return (
    <div className={classnames('map', styles.map, className)} style={style}>
      <PigeonMap center={center} {...mapProps} provider={provider}>
        {children ? children : <AvatarMarker anchor={center} />}
      </PigeonMap>
    </div>
  )
}

Map.propTypes = {
  className: PropTypes.string.isRequired,
  location: PropTypes.any.isRequired,
  defaultWidth: PropTypes.number,
  defaultHeight: PropTypes.number,
  zoom: PropTypes.number.isRequired,
  metaWheelZoom: PropTypes.bool.isRequired,
}

Map.defaultProps = {
  className: '',
  zoom: 14,
  metaWheelZoom: true,
  defaultWidth: 300,
  defaultHeight: 300,
}

export default Map
