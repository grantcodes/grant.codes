const PostContent = ({ content }) => {
  if (content && content.html) {
    return (
      <div
        className="post__content e-content"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    )
  } else if (content && content.value) {
    return <p className="post__content e-content">{content.value}</p>
  } else if (typeof content === 'string') {
    return <p className="post__content e-content">{content}</p>
  }
  return null
}

export default PostContent
