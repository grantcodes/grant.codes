'use client'

import { useState, useEffect } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import Map from 'components/Map'
import getLastLocation from 'lib/get/last-location'
import styles from 'css/pages/where.module.scss'

const Where = () => {
  const [location, setLocation] = useState(null)

  // Get location on mount
  useEffect(() => {
    getLastLocation()
      .then(loc => {
        setLocation(loc)
      })
      .catch(err => {
        console.error('Error getting location', err)
        setLocation(false)
      })
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <h2 className='page-title'>Where am I?</h2>

        <div className={classnames('card card--glass', styles.card)}>
          <noscript>Sorry, you need JS enabled to find out where I am</noscript>

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
        </div>
      </div>

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

export default Where

export const metadata = {
  title: 'Where am I?',
  robots: {
    index: false,
  },
}
