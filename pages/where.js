import classnames from 'classnames'
import moment from 'moment'
import Map from 'components/Map'
import { NextSeo } from 'next-seo'
import getLastLocation from 'lib/get/last-location'
import styles from 'css/pages/where.module.scss'

const Where = ({ location }) => (
  <>
    <NextSeo title="Where am I?" noIndex />
    <div className={styles.wrapper}>
      <h2 className="page-title">Where am I?</h2>

      <div className={classnames('card', styles.card)}>
        {location ? (
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
        ) : (
          <p>{process.env.NEXT_PUBLIC_AUTHOR_NAME} not found 🕵️‍</p>
        )}
      </div>
    </div>

    <Map
      themed
      className={styles.map}
      location={location ? `geo:${location.lat},${location.lon}` : 'geo:0,0'}
      zoom={location ? 12 : 6}
      defaultWidth={1200}
      defaultHeight={1200}
    />
  </>
)

Where.containerClass = 'right-aligned'

export const getServerSideProps = async () => {
  const location = await getLastLocation()
  return { props: { location } }
}

export default Where
