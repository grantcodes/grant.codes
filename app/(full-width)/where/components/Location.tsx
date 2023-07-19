'use client'

import { useState, useEffect } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import Map from 'components/Map'
import getLastLocation, { LocationResult } from 'lib/get/last-location'
import styles from 'css/pages/where.module.scss'

const WhereLocation = () => {
  const [location, setLocation] = useState<LocationResult | null | false>(null)

  // Get location on mount
  useEffect(() => {
    getLastLocation()
      .then(setLocation)
      .catch((err) => {
        console.error('Error getting location', err)
        setLocation(false)
      })
  }, [])

  return (
    <>
      {location === null && (
        <p>Finding {process.env.NEXT_PUBLIC_AUTHOR_NAME}...</p>
      )}

      {location === false && (
        <p>{process.env.NEXT_PUBLIC_AUTHOR_NAME} not found 🕵️‍</p>
      )}

      {!!location && (
        <>
          <p>
            {process.env.NEXT_PUBLIC_AUTHOR_NAME} was last spotted{' '}
            {moment(location.isotst).fromNow()}
            {!!location.addr && `at ${location.addr}`}
          </p>
          <dl className={styles['device-info']}>
            {!!location.batt && (
              <>
                <dt>🔋 Battery %</dt>
                <dd>{location.batt}</dd>
              </>
            )}
          </dl>
        </>
      )}

      {/* <Map
        themed
        className={styles.map}
        location={location ? `geo:${location.lat},${location.lon}` : 'geo:0,0'}
        zoom={location ? 12 : 3}
        defaultWidth={1200}
        defaultHeight={1200}
      /> */}
    </>
  )
}

export { WhereLocation }
