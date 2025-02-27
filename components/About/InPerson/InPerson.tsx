import styles from './InPerson.module.scss'
import Icon from 'components/Icon'
import Map from 'components/Map'
import Card from 'components/Card'

import pinIcon from 'eva-icons/fill/svg/pin.svg'
import homeIcon from 'eva-icons/fill/svg/home.svg'
import workIcon from 'eva-icons/fill/svg/briefcase.svg'

const InPerson = ({ location }) => (
  <dl className={styles.list}>
    <div>
      <dt>
        <Icon icon={homeIcon} /> Home Address
      </dt>
      <dd>
        <address style={{ fontStyle: 'normal' }}>
          El Clot, Barcelona, Spain
        </address>
      </dd>
    </div>

    <div>
      <dt>
        <Icon icon={workIcon} /> Work Address
      </dt>
      <dd>
        I work in a lovely coworking space called{' '}
        <a href="https://www.gardencoworkingatelier.com">Garden</a>
      </dd>
    </div>

    {!!location && (
      <div className="hide-print">
        <dt>
          <Icon icon={pinIcon} />
          Last Seen
        </dt>
        <dd>
          {!!location.addr && <p>{location.addr}</p>}
          <Card className={styles.map}>
            {/* @ts-ignore */}
            <Map
              location={`geo:${location.lat},${location.lon}`}
              defaultWidth={500}
              defaultHeight={250}
              themed
            />
          </Card>
        </dd>
      </div>
    )}
  </dl>
)

export default InPerson
