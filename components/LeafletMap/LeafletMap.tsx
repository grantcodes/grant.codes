'use client'

import { useEffect } from 'react'
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  GeoJSON,
  GeoJSONProps,
  useMap,
} from 'react-leaflet'

const Route = ({ data }) => {
  const map = useMap()

  useEffect(() => {
    const layer = Object.values(map._layers).find(l => l.feature)
    if (layer && layer.getBounds) {
      map.fitBounds(layer.getBounds(), { padding: [10, 10] })
    }
  }, [map])

  return <GeoJSON data={data} />
}

interface LeafletMapProps extends MapContainerProps {
  geojson?: GeoJSONProps['data']
}

const LeafletMap = ({ geojson, ...props }: LeafletMapProps) => {
  return (
    <MapContainer center={[0, 0]} zoom={4} className='map' {...props}>
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/grantcodes/ckctekw712q2k1jph87kqekjk/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
      />

      {!!geojson && <Route data={geojson} />}
    </MapContainer>
  )
}

export { LeafletMap }
