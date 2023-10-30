import classnames from 'classnames'
import styles from 'css/pages/where.module.scss'
import { WhereLocation } from './components/Location'
import type { Metadata } from 'next'

const Where = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <h2 className='page-title'>Where am I?</h2>

        <div className={classnames('card card--glass', styles.card)}>
          <noscript>Sorry, you need JS enabled to find out where I am</noscript>

          <WhereLocation />
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

export const metadata: Metadata = {
  title: 'Where am I?',
  robots: {
    index: false,
  },
}

export default Where
