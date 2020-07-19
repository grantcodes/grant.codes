/**
 * Gets lat and lon coordinates of a geo uri or mf2 object
 * @param {string|object} location Geouri or mf2 object to use
 * @returns {array} Array with lat + lon
 */
export default function (mf2 = null) {
  if (!mf2) {
    return null
  }
  let coords = null
  if (typeof mf2 === 'string' && mf2.startsWith('geo:')) {
    const semiIndex = mf2.indexOf(';')
    if (semiIndex > -1) {
      mf2 = mf2.substring(0, semiIndex)
    }
    coords = mf2.replace('geo:', '').split(',')
  } else if (
    mf2 &&
    mf2.properties &&
    mf2.properties.latitude &&
    mf2.properties.longitude
  ) {
    coords = [mf2.properties.latitude[0], mf2.properties.longitude[0]]
  }
  if (coords === null || !Array.isArray(coords) || coords.length !== 2) {
    return null
  }
  coords[0] = parseFloat(coords[0])
  coords[1] = parseFloat(coords[1])
  return coords
}
