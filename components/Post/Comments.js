import mentionTypes from './mention-types'
import Comment from './Comment'
import Face from './Face'

const Comments = ({ post }) => {
  // Function to loop though properties to make things a little less verbose
  const property = (name, El) => {
    if (post.properties[name] && Array.isArray(post.properties[name])) {
      return post.properties[name].map((value, i) => (
        <El value={value} key={'post-property' + name + i} />
      ))
    }
    return null
  }

  return mentionTypes.map(
    (mentionType) =>
      post.properties[mentionType.key] &&
      post.properties[mentionType.key].length && (
        <div
          key={mentionType.id}
          id={mentionType.id}
          className={mentionType.key === 'comment' ? 'comments' : 'facepile'}
        >
          <h3>{mentionType.title}</h3>
          {property(mentionType.key, ({ value }) =>
            mentionType.key === 'comment' ? (
              <Comment comment={value} />
            ) : (
              <Face post={value} type={mentionType.key} />
            )
          )}
        </div>
      )
  )
}

export default Comments
