import Tile from 'components/Websites/Tile'
import websites from 'data/websites'
import styles from 'css/pages/websites.module.scss'

const Websites = () => (
  <div className={styles.list}>
    {websites.map((website) => (
      <Tile key={`website-tile-${website.slug}`} {...website} />
    ))}
  </div>
)

export default Websites
