import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import PigeonMap from 'pigeon-maps'
import AvatarMarker from './AvatarMarker'
import getLatLngFromMf2 from './lib/getLatLngFromMf2'

const StyledMap = styled.div`
  z-index: 1;
  height: 10em;
  overflow: hidden;

  img[src*='tile'] {
    max-width: none;
    display: block;
    filter: ${props =>
      props.themed && props.theme.palette.hsl[2] < 0.1 ? 'invert(1)' : 'none'};
    mix-blend-mode: ${props =>
      props.themed
        ? props.theme.palette.hsl[2] < 0.1
          ? 'color-dodge'
          : 'multiply'
        : 'unset'};
  }

  > div > div:first-child > div {
    background-color: ${props =>
      props.themed ? props.theme.palette.main : 'transparent'};
  }
`

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
    <StyledMap className={className + ' is map'} style={style} themed={themed}>
      <PigeonMap center={center} {...mapProps} provider={provider}>
        {children ? children : <AvatarMarker anchor={center} />}
      </PigeonMap>
    </StyledMap>
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
