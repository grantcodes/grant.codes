import WebMercatorViewport from 'viewport-mercator-project'

export default function ({ width, height, markers }) {
  let maxLat = markers[0][0]
  let maxLng = markers[0][1]
  let minLat = markers[0][0]
  let minLng = markers[0][1]
  markers.forEach((marker) => {
    const lat = marker[0]
    const lng = marker[1]
    if (lat > maxLat) {
      maxLat = lat
    }
    if (lng > maxLng) {
      maxLng = lng
    }
    if (lng < minLng) {
      minLng = lng
    }
    if (lat < minLat) {
      minLat = lat
    }
  })
  if (maxLat !== minLat && maxLng !== minLng) {
    const bounds = [
      [maxLng, maxLat],
      [minLng, minLat],
    ]
    const viewport = new WebMercatorViewport({
      width,
      height,
      latitude: 0,
      longitude: 0,
      zoom: 3,
    })
    const boundedViewport = viewport.fitBounds(bounds)
    return {
      latitude: boundedViewport.latitude,
      longitude: boundedViewport.longitude,
      zoom: boundedViewport.zoom,
    }
  } else if (markers.length === 1) {
    return {
      latitude: markers[0][0],
      longitude: markers[0][1],
      zoom: 12,
    }
  }
}
