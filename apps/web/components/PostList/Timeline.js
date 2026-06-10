import Post from '../Post'
import Pagination from '../Container/Pagination'
import * as styles from './Timeline.module.scss'

const Timeline = ({ posts = [], title = '' }) => (
  <>
    {!!title && <h2 className="page-title">{title}</h2>}

    <div className={styles.postList}>
      {posts.map((post, i) => (
        <Post post={post} key={`post-list-${i}`} compact />
      ))}
    </div>

    <Pagination noNext={posts.length < 10} />
  </>
)

export default Timeline
