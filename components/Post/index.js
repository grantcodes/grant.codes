import React, { Fragment } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import Link from '../Link'
import Card from '../Card'
import PostContent from './Content'
import Map from '../Map'
import Photo from './Photo'
import Comments from './Comments'
import Children from './Children'
import Admin from './Admin'
import Footer from './Footer'
import Button from '../Button'
import Icon from '../Icon'
import reply from 'eva-icons/fill/svg/corner-up-left.svg'
import bookmark from 'eva-icons/fill/svg/bookmark.svg'
import repost from 'eva-icons/fill/svg/repeat.svg'
import like from 'eva-icons/fill/svg/heart.svg'
import isAdmin from '../../lib/is-admin'
import { palette, mixin, theme } from '../Theme/helpers'

const eventTimeDisplayOptions = {
  sameDay: '[Today] at HH:mm',
  nextDay: '[Tomorrow] at HH:mm',
  nextWeek: 'dddd at HH:mm',
  lastDay: '[Yesterday] at HH:mm',
  lastWeek: '[Last] dddd at HH:mm',
  sameElse: 'DD/MM/YYYY - HH:mm',
}

// .post {
//   .has-replies & {
//     margin-bottom: ${mixin.space( 1)};
//   }
// }

// TODO: Post title styles.
// const PostTitle = styled(CardTitle)`
//   .post--like-of &,
//   .post--bookmark & {
//     font-size: ${mixin.fs(0)};
//   }
//   .container.single-article & {
//     font-size: ${mixin.fs(4)};
//     @media (min-width: ${theme('midBreak')}) {
//       font-size: ${mixin.fs(5)};
//     }
//     margin-left: auto;
//     margin-right: auto;
//     margin-top: ${mixin.space(1)};
//     margin-bottom: ${mixin.space(3)};
//     text-align: center;
//   }
// `
const PostTitle = styled.h1``

const PostHeader = styled.header`
  ${({ background, theme }) =>
    !!background
      ? `
    overflow: hidden;
    margin-top: ${0 - theme.cardPadding};
    margin-left: ${0 - theme.cardPadding};
    margin-right: ${0 - theme.cardPadding};
    padding: ${theme.cardPadding};
    background-size: cover;
    background-position: center;
    background-image: url(${background});
    display: flex;
    align-items: center;
    min-height: 13rem;

    ${PostTitle} {
      text-decoration: overline wavy;
      background-color: ${theme.palette.main};
    }
    `
      : ''}
`

// TODO: Exends card__breakout
const PostAction = styled.div`
  padding: var(--card-padding);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${mixin.fs(-1)};
  ${Footer} + & {
    margin-top: -var(--card-padding);
  }
`

const PostReadFull = styled(Button)`
  display: block !important;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${mixin.space()};
  margin-bottom: ${mixin.space()};
`

const Post = ({ compact, post, className = '' }) => {
  if (!post) {
    return null
  }

  // Fix up some mf2 stuff (mainly for external stuff like comments)
  // post = normalizeMf2(post)

  // Function to loop though properties to make things a little less verbose
  const property = (name, El) => {
    if (post.properties[name] && Array.isArray(post.properties[name])) {
      return post.properties[name].map((value, i) => (
        <El value={value} key={'post-property' + name + i} />
      ))
    }
    return null
  }

  // Set the post classes
  const postType =
    post && post.cms && post.cms.postType ? post.cms.postType : null

  const postName = !!post.properties.name ? post.properties.name[0] : null
  const postFeatured = !!post.properties.featured
    ? post.properties.featured[0]
    : null

  // if (postType === 'watch') {
  //   return (
  //     <div
  //       className={
  //         className + ' ' + (post.type ? post.type[0] : null) + ' ' + postType
  //       }
  //     >
  //       <Watch post={post} compact={compact} />
  //     </div>
  //   )
  // }

  return (
    <div
      className={classnames(
        className,
        postType,
        post.type ? post.type[0] : false
      )}
    >
      <Card>
        {(postFeatured || postName) && (
          <PostHeader background={postFeatured}>
            {!!postFeatured && (
              <data className="u-featured" value={postFeatured} />
            )}
            {!!postName && <PostTitle className="p-name">{postName}</PostTitle>}
          </PostHeader>
        )}

        {property(
          'like-of',
          ({ value }) =>
            typeof value === 'string' && (
              <Fragment>
                <PostAction as="p">
                  <Icon icon={like} /> Liked{' '}
                  <a className="u-like-of" href={value}>
                    {value}
                  </a>
                </PostAction>
                {post.references && post.references[value] && (
                  <Post post={post.references[value]} />
                )}
              </Fragment>
            )
        )}
        {property(
          'bookmark-of',
          ({ value }) =>
            typeof value === 'string' && (
              <Fragment>
                <PostAction as="p">
                  <Icon icon={bookmark} /> Bookmarked{' '}
                  <a className="u-bookmark-of" href={value}>
                    {value}
                  </a>
                </PostAction>
                {post.references && post.references[value] && (
                  <Post post={post.references[value]} />
                )}
              </Fragment>
            )
        )}
        {property(
          'repost-of',
          ({ value }) =>
            typeof value === 'string' && (
              <Fragment>
                <PostAction as="p">
                  <Icon icon={repost} /> Reposted{' '}
                  <a className="u-repost-of" href={value}>
                    {value}
                  </a>
                </PostAction>
                {post.references && post.references[value] && (
                  <Post post={post.references[value]} />
                )}
              </Fragment>
            )
        )}
        {property(
          'in-reply-to',
          ({ value }) =>
            typeof value === 'string' && (
              <Fragment>
                <PostAction as="p">
                  {post.properties.rsvp ? (
                    <Fragment>
                      <Icon icon={reply} /> RSVPed{' '}
                      <span className="p-rsvp">{post.properties.rsvp[0]}</span>{' '}
                      to{' '}
                    </Fragment>
                  ) : (
                    <Fragment>
                      <Icon icon={reply} /> Replied to{' '}
                    </Fragment>
                  )}
                  <a className="u-in-reply-to" href={value}>
                    {value}
                  </a>
                </PostAction>
                {post.references && post.references[value] && (
                  <Post post={post.references[value]} />
                )}
              </Fragment>
            )
        )}

        {!!post.properties.photo && (
          <Photo
            photos={post.properties.photo}
            imageSizes={post.cms ? post.cms.imageSizes : {}}
            permalink={post.properties.url[0]}
          />
        )}

        {property(
          'video',
          ({ value }) =>
            typeof value === 'string' && (
              <video className="u-video" src={value} controls />
            )
        )}

        {property(
          'audio',
          ({ value }) =>
            typeof value === 'string' && (
              <audio className="u-audio" src={value} controls />
            )
        )}

        {!!post.properties.summary &&
          (!post.properties.content || (postType === 'article' && compact)) &&
          property(
            'summary',
            ({ value }) =>
              typeof value === 'string' && <p className="p-summary">{value}</p>
          )}

        {property('content', ({ value }) => {
          const content = <PostContent content={value} />
          // Show a read button and hide the text for full articles
          if (compact && postType === 'article' && post.properties.url[0]) {
            return (
              <Fragment>
                <div className="screen-reader-text">{content}</div>
                <PostReadFull to={post.properties.url[0]} aria-hidden="true">
                  Read full post
                </PostReadFull>
              </Fragment>
            )
          }
          return content
        })}

        {property('start', ({ value }) => (
          <Fragment>
            <h6 style={{ marginBottom: 0 }}>Start</h6>
            <time className="dt-start" dateTime={value}>
              {moment(value).calendar(null, eventTimeDisplayOptions)}
            </time>
          </Fragment>
        ))}

        {property('end', ({ value }) => (
          <Fragment>
            <h6 style={{ marginBottom: 0 }}>End</h6>
            <time className="dt-end" dateTime={value}>
              {moment(value).calendar(null, eventTimeDisplayOptions)}
            </time>
          </Fragment>
        ))}

        {post.children && Array.isArray(post.children) && (
          <Children children={post.children} />
        )}

        {property('checkin', ({ value }) => (
          <div className="card__breakout">
            <Map
              location={value}
              defaultWidth={528}
              defaultHeight={224}
              theme="basic"
            />
          </div>
        ))}

        {property('location', ({ value }) => (
          <Fragment>
            {value.properties && value.properties.name && value.properties.url && (
              <h6 className="p-location h-card">
                At{' '}
                <Link
                  className="u-url p-name p-org"
                  to={value.properties.url[0]}
                >
                  {value.properties.name[0]}
                </Link>
              </h6>
            )}
            <div className="card__breakout">
              <Map
                location={value}
                defaultWidth={528}
                defaultHeight={224}
                theme="basic"
              />
            </div>
          </Fragment>
        ))}

        <Footer post={post} compact={compact} />
        {isAdmin && <Admin post={post} />}
      </Card>

      {!compact && <Comments post={post} />}
    </div>
  )
}

Post.defaultProps = {
  compact: false,
}

Post.propTypes = {
  compact: PropTypes.bool.isRequired,
}

export default Post
