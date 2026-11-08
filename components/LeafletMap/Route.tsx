'use client'

import { useEffect } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'

const Route = ({ data }) => {
  const map = useMap()

  useEffect(() => {
    // TODO: Fix types
    const layer: any = Object.values(map._layers).find((l: any) => l.feature)
    if (layer?.getBounds) {
      map.fitBounds(layer.getBounds(), { padding: [10, 10] })
    }
  }, [map])

  return <GeoJSON data={data} />
}

export { Route }
