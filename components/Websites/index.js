import Tile from 'components/Websites/Tile'
import { Button } from 'components/Button'
import websites from 'data/websites'
import styles from 'css/pages/websites.module.scss'

const Websites = ({ limit = 0 }) => {
  const items = limit ? websites.slice(0, limit) : websites
  const showMore = limit && websites.length > limit

  return (
    <>
      <div className={styles.list}>
        {items.map((website) => (
          <Tile key={`website-tile-${website.slug}`} {...website} />
        ))}
      </div>
      {showMore === true && (
        <Button small to="/websites">
          View All
        </Button>
      )}
    </>
  )
}

export default Websites
