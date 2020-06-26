import PropTypes from 'prop-types'
import PostsGallery from '../PostsGallery'

const Children = ({ children }) => (
  <div className="card__breakout">
    <PostsGallery posts={children} />
  </div>
)

Children.propTypes = {
  children: PropTypes.array.isRequired,
}

export default Children
