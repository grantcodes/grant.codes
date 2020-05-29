import PropTypes from 'prop-types'
import styled from 'styled-components'
import PostMarker from './PostMarker'
import Map from '../Map'
import PageTitle from '../util/PageTitle'
import getLatLngFromMf2 from '../Map/lib/getLatLngFromMf2'
import boundaries from '../Map/lib/getBoundaries'

const StyledMap = styled(Map)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`

const PostsMap = ({ title, posts }) => {
  const getBoundaries = () => {
    const markers = posts
      .filter(
        (post) =>
          post &&
          post.properties &&
          (post.properties.location || post.properties.checkin)
      )
      .map((post) => {
        let location = null
        if (post.properties.checkin) {
          location = post.properties.checkin[0]
        } else {
          location = post.properties.location[0]
        }
        return getLatLngFromMf2(location)
      })
    const width =
      typeof document !== 'undefined' ? document.body.clientWidth : 1200
    const height =
      typeof document !== 'undefined' ? document.body.clientHeight : 1200
    return boundaries({
      markers,
      width,
      height,
    })
  }

  const viewport = getBoundaries()

  return (
    <>
      <PageTitle as="h2" style={{ position: 'relative', zIndex: 1 }}>
        {title}
      </PageTitle>

      <StyledMap
        location={`geo:${viewport.latitude},${viewport.longitude}`}
        zoom={viewport.zoom}
        defaultWidth={1200}
        defaultHeight={1200}
      >
        {posts.map((post) => {
          let center = null
          if (post.properties.location) {
            center = getLatLngFromMf2(post.properties.location[0])
          }
          if (post.properties.checkin) {
            center = getLatLngFromMf2(post.properties.checkin[0])
          }
          if (center === null) {
            return null
          }
          return (
            <PostMarker
              key={`post-marker-${post.properties.url[0]}`}
              post={post}
              anchor={center}
            />
          )
        })}
      </StyledMap>
    </>
  )
}

PostsMap.propTypes = {
  posts: PropTypes.array.isRequired,
}

export default PostsMap
