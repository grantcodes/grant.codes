'use client'

import { useState, useEffect } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import Map from 'components/Map'
import getLastLocation, { LocationResult } from 'lib/get/last-location'
import styles from 'css/pages/where.module.scss'

const FoundLocation = (props: LocationResult) => {
  const { city, country, battery, geodata } = props
  const time = moment(props.timestamp * 1000).fromNow()
  const region = city || country
  const place = geodata?.properties?.name
  const person = process.env.NEXT_PUBLIC_AUTHOR_NAME

  let locationString = `${person} was last spotted ${time}`
  if (region) locationString += ` in ${region}`
  if (place) locationString += ` at ${place}`

  return (
    <>
      <p>{locationString}</p>
      <dl className={styles['device-info']}>
        {!!battery && (
          <>
            <dt>🔋 Battery %</dt>
            <dd>{battery}</dd>
          </>
        )}
      </dl>
    </>
  )
}

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
      <div className={classnames('card card--glass', styles.card)}>
        {location === null && (
          <p>Finding {process.env.NEXT_PUBLIC_AUTHOR_NAME}...</p>
        )}

        {location === false && (
          <p>{process.env.NEXT_PUBLIC_AUTHOR_NAME} not found 🕵️‍</p>
        )}

        {!!location && <FoundLocation {...location} />}
      </div>

      {/* @ts-ignore */}
      <Map
        themed
        className={styles.map}
        location={
          location
            ? `geo:${location.latitude},${location.longitude}`
            : 'geo:0,0'
        }
        zoom={location ? 12 : 3}
        defaultWidth={1200}
        defaultHeight={1200}
      />
    </>
  )
}

export { WhereLocation }
