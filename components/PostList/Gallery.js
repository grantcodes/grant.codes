import Pagination from '../Container/Pagination'
import PostsGallery from '../PostsGallery'

const Gallery = ({ posts = [], title }) => (
  <>
    <h2 className="page-title">{title}</h2>
    <PostsGallery posts={posts} type="feed" maxWidth={20} />
    <Pagination noNext={posts.length < 50} />
  </>
)

export default Gallery
