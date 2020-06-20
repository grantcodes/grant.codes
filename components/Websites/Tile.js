import Link from '../Link'
import styles from 'css/components/website-tile.module.scss'

const Preview = ({ slug, title, thumbnail }) => (
  <Link className={styles.tile} to={`/websites/${slug}`}>
    <span className="screen-reader-text">{title}</span>
    <img className={styles.image} src={thumbnail} />
  </Link>
)

export default Preview
