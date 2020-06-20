import Loading from '../Loading'
import Pagination from '../Container/Pagination'
import PostsMap from '../PostsMap'

const Map = ({ posts, title }) => (
  <>
    {posts ? <PostsMap title={title} posts={posts} /> : <Loading />}
    <Pagination
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 1,
      }}
      noNext={posts.length < 10}
    />
  </>
)

export default Map
