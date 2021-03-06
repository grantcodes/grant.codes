import { NextSeo } from 'next-seo'
import classnames from 'classnames'
import pluralize from 'pluralize'
import Card from 'components/Card'
import LeafletMap from 'components/LeafletMap'
import Button from 'components/Button'
import BodyGraph from './BodyGraph'
import styles from 'css/pages/monthly-summary.module.scss'

const DataSummary = ({
  title,
  postTypes,
  geojson,
  body,
  pagination = null,
}) => (
  <>
    <NextSeo title={title} />
    <h1 className="page-title">{title}</h1>

    {!!postTypes && (
      <Card title="Posts">
        <ul className={classnames('card__breakout', styles.counts)}>
          {Object.keys(postTypes).map((type) => (
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

    {!!geojson && (
      <Card title="Map">
        <div className="card__breakout">
          <LeafletMap geojson={geojson} />
        </div>
      </Card>
    )}

    {!!body && (
      <Card title="Body">
        <BodyGraph {...body} />
      </Card>
    )}

    {!!pagination && (
      <nav className="pagination">
        {!!pagination.previous && (
          <Button
            to={pagination.previous.to}
            linkAs={pagination.previous.linkAs}
          >
            Previous
          </Button>
        )}
        <span />
        {!!pagination.next && (
          <Button to={pagination.next.to} linkAs={pagination.next.linkAs}>
            Next
          </Button>
        )}
      </nav>
    )}
  </>
)

export default DataSummary
