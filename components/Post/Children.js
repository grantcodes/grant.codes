import React from 'react'
import PropTypes from 'prop-types'
import CardBreakout from '../Card/Breakout'
import PostsGallery from '../PostsGallery'

const Children = ({ children }) => (
  <CardBreakout>
    <PostsGallery posts={children} />
  </CardBreakout>
)

Children.propTypes = {
  children: PropTypes.array.isRequired,
}

export default Children
