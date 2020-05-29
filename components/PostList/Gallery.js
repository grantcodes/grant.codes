import React from 'react'
import Loading from '../Loading'
import Pagination from '../Container/Pagination'
import PostsGallery from '../PostsGallery'
import PageTitle from '../util/PageTitle'

const Gallery = ({ posts = [], olderLink, newerLink, title }) => (
  <>
    <PageTitle as="h2">{title}</PageTitle>
    <PostsGallery posts={posts} type="feed" maxWidth={20} />
    <Pagination next={olderLink} previous={newerLink} />
  </>
)

export default Gallery
