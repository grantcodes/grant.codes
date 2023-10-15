import classnames from 'classnames'
import pluralize from 'pluralize'
import Card from 'components/Card'
import { LeafletMap } from 'components/LeafletMap'
import { Button, ButtonProps } from 'components/Button'
import BodyGraph from './BodyGraph'
import styles from 'css/pages/monthly-summary.module.scss'

interface DataSummaryPostTypes {
  [postTypeKey: string]: number
}

interface DataSummaryPagination {
  next?: Pick<ButtonProps, 'to' | 'as'>
  previous?: Pick<ButtonProps, 'to' | 'as'>
}

interface DataSummaryProps {
  title: string
  postTypes?: DataSummaryPostTypes
  geojson?: any
  body?: any
  pagination?: DataSummaryPagination
}

// TODO: SEO Title
const DataSummary = ({
  title,
  postTypes,
  geojson,
  body,
  pagination,
}: DataSummaryProps) => (
  <>
    <h1 className='page-title'>{title}</h1>

    {!!postTypes && (
      <Card title='Posts'>
        <ul className={classnames('card__breakout', styles.counts)}>
          {Object.keys(postTypes).map(type => (
            <li className={styles.counts__count} key={`type-${type}`}>
              <span className={styles.counts__count__number}>
                {postTypes[type].toString()}
              </span>
              <h3 className={styles.counts__count__type}>
                {postTypes[type] > 1 ? pluralize(type) : type}
              </h3>
            </li>
          ))}
        </ul>
      </Card>
    )}

    {/* TODO: Get map working again */}
    {!!geojson && (
      <Card title='Map'>
        <div className='card__breakout'>
          <LeafletMap geojson={geojson} />
        </div>
      </Card>
    )}

    {!!body && (
      <Card title='Body'>
        <BodyGraph {...body} />
      </Card>
    )}

    {!!pagination && (
      <nav className='pagination'>
        {!!pagination.previous && (
          <Button to={pagination.previous.to} as={pagination.previous.as}>
            Previous
          </Button>
        )}
        <span />
        {!!pagination.next && (
          <Button to={pagination.next.to} as={pagination.next.as}>
            Next
          </Button>
        )}
      </nav>
    )}
  </>
)

export { DataSummary }
