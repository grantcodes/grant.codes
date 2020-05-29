import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Link from '../Link'
import Card from '../Card'
import CardTitle from '../Card/Title'
import CardBreakout from '../Card/Breakout'
import Photo from '../Post/Photo'
import Comments from '../Post/Comments'
import Admin from '../Post/Admin'
import Footer from '../Post/Footer'
import Button from '../Button'
import Icon from '../Icon'
import { palette, theme, mixin } from '../Theme/helpers'

// const Banner = styled(Card)`
// const Banner = styled.div`
const Banner = styled(CardBreakout)`
  background-color: #222;
  background-size: cover;
  background-position: center;
  background-image: url(${props => props.background});
  margin-bottom: -${theme('cardPadding')};
  padding: ${theme('cardPadding')};
  color: ${palette('white')};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9), -1px 1px 2px rgba(0, 0, 0, 0.9),
    1px -1px 2px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.9);
`

const Poster = styled.img`
  display: block;
  max-height: 12em;
  max-width: 100%;
  width: auto !important;
  height: auto;
  float: left;
  margin-right: ${theme('cardPadding')};
  /* margin-bottom: ${theme('cardPadding')}; */
  overflow: hidden;
  border-radius: ${theme('borderRadius')};
  border: 1px solid ${palette('mainBorder')};
  box-shadow: ${mixin.shadow()};
`

const Trakt = ({ plays, last_watched_at: lastWatch, movie, ...props }) => (
  <>
    {!!movie && (
      <CardTitle>
        {movie.title} ({movie.year})
      </CardTitle>
    )}
    <p>Watched {plays} times</p>
    <p>Last watched {moment(lastWatch).fromNow()}</p>
  </>
)

export default function Watch({ post, compact }) {
  return (
    <Card>
      <Banner
        background={
          !!post.properties.featured ? post.properties.featured[0] : null
        }
      >
        {!!post.properties.photo && post.properties.photo[0] && (
          <Poster src={post.properties.photo[0].value} alt="" />
        )}

        {!!post.properties.trakt && (
          <Trakt
            {...post.properties.trakt[0]}
            url={post.properties['watch-of'][0]}
          />
        )}
      </Banner>
      <Footer post={post} />
      <Admin post={post} />
      {!compact && <Comments post={post} />}
    </Card>
  )
}
