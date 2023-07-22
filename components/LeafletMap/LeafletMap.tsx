'use client'

import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  GeoJSONProps,
} from 'react-leaflet'
import { Route } from './Route'

interface LeafletMapProps extends MapContainerProps {
  geojson?: GeoJSONProps['data']
}

const LeafletMap = ({ geojson, ...props }: LeafletMapProps) => {
  const defaultProps = {
    center: [0, 0],
    className: 'map',
    zoom: 4,
  }
  const mapProps = { ...defaultProps, ...props }

  return (
    <MapContainer {...mapProps}>
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/grantcodes/ckctekw712q2k1jph87kqekjk/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
      />

      {!!geojson && <Route data={geojson} />}
    </MapContainer>
  )
}

export { LeafletMap }
