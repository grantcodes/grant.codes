import { Fragment } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import Link from '../Link'
import Icon from '../Icon'
import Avatar from '../Avatar'
import UrlIcon from '../UrlIcon'
import mentionTypes from './mention-types'

const separator = ' ● '

const Footer = ({ post, compact = true }) => {
  if (!post) {
    // TODO: This is bit of a hack for some other issue
    return null
  }
  // Set the post classes
  const postType =
    post && post.cms && post.cms.postType ? post.cms.postType : null

  // Get action text
  let actionText = 'Posted'
  if (post && post.cms && postType) {
    switch (postType) {
      case 'like':
        actionText = 'Liked'
        break
      case 'repost':
        actionText = 'Reposted'
        break
      case 'quotation':
        actionText = 'Quoted'
        break
      case 'reply':
        actionText = 'Replied'
        break
      case 'rsvp':
        actionText = 'RSVPed'
      default:
        break
    }
  } else if (post.properties['like-of']) {
    actionText = 'Liked'
  } else if (post.properties['repost-of']) {
    actionText = 'Reposted'
  } else if (post.properties['quotation-of']) {
    actionText = 'Quoted'
  } else if (post.properties['in-reply-to']) {
    actionText = 'Replied'
  } else if (post.properties['rsvp']) {
    actionText = 'RSVPed'
  }

  // Function to loop though properties to make things a little less verbose
  const property = (name, El) => {
    if (post.properties[name] && Array.isArray(post.properties[name])) {
      return post.properties[name].map((value, i) => (
        <El value={value} key={'post-property' + name + i} />
      ))
    }
    return null
  }

  return (
    <footer className="card__breakout post__footer">
      {actionText + ' '}
      {!!post.properties.url && (
        <Link className="u-url" to={post.properties.url[0]}>
          {post.properties.published ? (
            <time
              className="dt-published"
              dateTime={post.properties.published[0]}
            >
              {moment(post.properties.published[0]).fromNow()}
            </time>
          ) : (
            'Permalink'
          )}
        </Link>
      )}
      {!!post.properties.author && ' by '}
      {property('author', ({ value }) => (
        <Avatar author={value} />
      ))}
      {compact &&
        mentionTypes.map(
          (mentionType) =>
            post.properties[mentionType.key] &&
            post.properties[mentionType.key].length && (
              <Fragment key={`mention-icn-${mentionType.key}`}>
                {separator}
                <Link to={post.properties.url[0] + '#' + mentionType.id}>
                  <Icon icon={mentionType.icon} />{' '}
                  {post.properties[mentionType.key].length}
                </Link>
              </Fragment>
            )
        )}

      {!!post.properties.category && separator + 'Categories: '}
      {property('category', ({ value }) => {
        if (typeof value === 'object' && value.value) {
          value = value.value
        }
        if (typeof value !== 'string') {
          return null
        }
        return (
          <Fragment key={`category-${value}`}>
            <Link as={`/category/${value}`} to="/category/[category]">
              #<span className="p-category">{value}</span>
            </Link>{' '}
          </Fragment>
        )
      })}

      {!!post.properties.syndication && (
        <span>
          {separator + 'Also on: '}
          {property(
            'syndication',
            ({ value }) =>
              typeof value === 'string' && (
                <a href={value} className="u-syndication">
                  <UrlIcon url={value} />{' '}
                </a>
              )
          )}
        </span>
      )}
    </footer>
  )
}

export default Footer
