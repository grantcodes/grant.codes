import Pagination from '../Container/Pagination'
import PostsGallery from '../PostsGallery'
import PageTitle from '../util/PageTitle'

const Gallery = ({ posts = [], title }) => (
  <>
    <PageTitle as="h2">{title}</PageTitle>
    <PostsGallery posts={posts} type="feed" maxWidth={20} />
    <Pagination noNext={posts.length < 50} />
  </>
)

export default Gallery
