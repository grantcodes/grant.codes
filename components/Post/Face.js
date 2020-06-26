import Avatar from '../Avatar'

const Author = ({ post, type }) => {
  if (!post.properties) {
    return null
  }

  let url = ''
  let actionText = ''
  if (type === 'like') {
    actionText = 'Liked'
  } else if (type === 'repost') {
    actionText = 'Reposted'
  }
  actionText += ' by '
  const properties = post.properties
  const author = properties.author ? properties.author[0] : null

  // Get the url for the post
  if (properties.url) {
    url = properties.url[0]
  } else if (properties[`${type}-of`]) {
    url = properties[`${type}-of`][0]
  } else if (author) {
    if (typeof author === 'string' && author.indexOf('http') === 0) {
      url = author
    } else if (author.properties && author.properties.url) {
      url = author.properties.url[0]
    }
  }

  if (typeof author === 'undefined' || !author) {
    return null
  }

  return (
    <div className={`p-${type} h-cite`}>
      <a href={url} className="u-url">
        <Avatar author={author} noLink noName alt={actionText} size={40} />
      </a>
    </div>
  )
}

export default Author
