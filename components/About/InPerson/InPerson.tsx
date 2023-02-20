import styles from './InPerson.module.scss'
import Icon from 'components/Icon'
import Map from 'components/Map'

import pinIcon from 'eva-icons/fill/svg/pin.svg'
import homeIcon from 'eva-icons/fill/svg/home.svg'
import workIcon from 'eva-icons/fill/svg/briefcase.svg'

const InPerson = ({ location }) => (
  <dl>
    <dt>
      <Icon icon={homeIcon} /> Home Address
    </dt>
    <dd>Gràcia, Barcelona, Spain</dd>

    <dt>
      <Icon icon={workIcon} /> Work Address
    </dt>
    <dd>
      I work in a lovely coworking space called{' '}
      <a href="https://www.gardencoworkingatelier.com">Garden</a>
    </dd>

    {!!location && (
      <div className="hide-print">
        <dt>
          <Icon icon={pinIcon} />
          Last Seen
        </dt>
        <dd>
          {!!location.addr && <p>{location.addr}</p>}
          {/* @ts-ignore */}
          <Map
            location={`geo:${location.lat},${location.lon}`}
            defaultWidth={500}
            defaultHeight={250}
            style={{ width: '25em', maxWidth: '100%', height: '12.5em' }}
            themed
          />
        </dd>
      </div>
    )}
  </dl>
)

export default InPerson
