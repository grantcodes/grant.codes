import { useState } from 'react'
import ReactMapGL, { Source, Layer } from 'react-map-gl'
import styles from 'css/components/map.module.scss'

export default ({
  geojson,
  width = '100%',
  height = 400,
  ...viewportProps
}) => {
  const [viewport, setViewport] = useState({
    width,
    height,
    ...viewportProps,
  })

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/grantcodes/ckctekw712q2k1jph87kqekjk"
      onViewportChange={setViewport}
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      className={styles.map}
    >
      <Source type="geojson" data={geojson}>
        <Layer
          id="route"
          //   type="line"
          //   type="symbol"
          type="cicle"
          //   source="composite"
          paint={{
            'circle-radius': 4,
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 1,
            'line-color': '#7c86fd',
            'line-width': 3,
            'line-opacity': 0.7,
            // 'fill-color': {
            //   property: 'percentile',
            //   stops: [
            //     [0, '#3288bd'],
            //     [1, '#66c2a5'],
            //     [2, '#abdda4'],
            //     [3, '#e6f598'],
            //     [4, '#ffffbf'],
            //     [5, '#fee08b'],
            //     [6, '#fdae61'],
            //     [7, '#f46d43'],
            //     [8, '#d53e4f'],
            //   ],
            // },
            // 'fill-opacity': 0.8,
            // 'circle-radius': 10,
            // 'circle-color': '#007cbf',
          }}
        />
      </Source>
    </ReactMapGL>
  )
}
