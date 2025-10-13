import React from 'react'
import moment from 'moment'
import Link from '../Link'
import Card from '../Card'
// import CardTitle from '../Card/Title'
import Photo from '../Post/Photo'
import Comments from '../Post/Comments'
import Admin from '../Post/Admin'
import Footer from '../Post/Footer'
import Button from '../Button'
import Icon from '../Icon'

// TODO: Rework this whole thing.
// // TODO: Extends card__breakout
// const Banner = styled.div`
//   background-color: #222;
//   background-size: cover;
//   background-position: center;
//   background-image: url(${(props) => props.background});
//   margin-bottom: -var(--card-padding);
//   padding: var(--card-padding);
//   color: ${palette('white')};
//   text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9), -1px 1px 2px rgba(0, 0, 0, 0.9),
//     1px -1px 2px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.9);
// `

// const Poster = styled.img`
//   display: block;
//   max-height: 12em;
//   max-width: 100%;
//   width: auto !important;
//   height: auto;
//   float: left;
//   margin-right: var(--card-padding);
//   /* margin-bottom: var(--card-padding); */
//   overflow: hidden;
//   border-radius: var(--border-radius);
//   border: 1px solid var(--theme-border);
//   box-shadow: ${mixin.shadow()};
// `

const Trakt = ({ plays, last_watched_at: lastWatch, movie, ...props }) => (
  <>
    {!!movie && (
      // <CardTitle>
      //   {movie.title} ({movie.year})
      // </CardTitle>
    )}
    <p>Watched {plays} times</p>
    <p>Last watched {moment(lastWatch).fromNow()}</p>
  </>
)

export default function Watch({ post, compact }) {
  return (
    <Card>
      {!!post.properties.photo && post.properties.photo[0] && (
        <img
          src={post.properties.photo[0].value}
          alt=""
          style={{
            display: 'block',
            maxHeight: '12em',
            maxWidth: '100%',
            width: 'auto',
            height: 'auto',
            float: 'left',
            marginRight: 'var(--card-padding)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--theme-border)'
          }}
        />
      )}

      {!!post.properties.trakt && (
        <Trakt
          {...post.properties.trakt[0]}
          url={post.properties['watch-of'][0]}
        />
      )}
      <Footer post={post} />
      <Admin post={post} />
      {!compact && <Comments post={post} />}
    </Card>
  )
}
