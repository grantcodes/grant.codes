'use client'

import { useEffect } from 'react'
import { Map, TileLayer, GeoJSON, useLeaflet } from 'react-leaflet'

const Route = ({ data }) => {
  const { map } = useLeaflet()

  useEffect(() => {
    const layer = Object.values(map._layers).find((l) => l.feature)
    if (layer && layer.getBounds) {
      map.fitBounds(layer.getBounds(), { padding: [10, 10] })
    }
  }, [map])

  return <GeoJSON data={data} />
}

const LeafletMap = ({ geojson, ...props }) => {
  return (
    <Map center={[0, 0]} zoom={4} className="map" {...props}>
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/grantcodes/ckctekw712q2k1jph87kqekjk/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
      />

      {!!geojson && <Route data={geojson} />}
    </Map>
  )
}

export default LeafletMap
