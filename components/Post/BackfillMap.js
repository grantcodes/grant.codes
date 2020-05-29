import React from 'react'
import PropTypes from 'prop-types'
import Map from '../Map'

const BackfillMap = ({ locations }) => (
  <div>
    {locations.map(location => (
      <p>
        {location.isotst} {location.lat} {location.lon}
      </p>
    ))}
    <Map>
      {locations.map(location => (
        <span
          style={{ position: 'absolute' }}
          anchor={[location.lat, location.lng]}
        ></span>
      ))}
    </Map>
  </div>
)

BackfillMap.propTypes = {
  locations: PropTypes.array.isRequired,
}

export default BackfillMap
