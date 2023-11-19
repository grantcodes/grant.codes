interface ReferenceSummaryProps {
  post: any
  referenceUrl: string
  className?: string
}

import PostContent from 'components/Post/Content'

const MAX_TEXT_LENGTH = 200

const ReferenceSummary = ({
  referenceUrl,
  post,
  className,
}: ReferenceSummaryProps) => {
  let reference = post?.references?.[referenceUrl]

  if (!reference) {
    // Maybe the reference is using the path instead of the URL
    const url = new URL(referenceUrl)
    const pathname = url.pathname
    reference = post?.references?.[pathname]
  }

  if (!reference) {
    reference = post
  }

  let title = reference?.properties?.name?.[0]
  let content =
    reference?.properties?.summary?.[0] ?? reference?.properties?.content?.[0]

  if (title && content) {
    if (content?.value) {
      content = content.value
    }

    const titleShort =
      title?.substring?.(0, MAX_TEXT_LENGTH).toLowerCase().trim() ?? ''
    const contentShort =
      content?.substring?.(0, MAX_TEXT_LENGTH).toLowerCase().trim() ?? ''

    if (titleShort === contentShort || titleShort.includes(contentShort)) {
      // Title and content are the same, so don't show the title
      title = null
    }

    // If there is a title, then don't show the content
    if (title) {
      content = null
    }
  }

  if (title && title.length > MAX_TEXT_LENGTH) {
    title = title.substring(0, MAX_TEXT_LENGTH).trim() + '…'
  }
  if (content && content.length > MAX_TEXT_LENGTH) {
    content = content.substring(0, MAX_TEXT_LENGTH).trim() + '…'
  }

  // Remove content if it's just an iframe. Hopefully will be handled with a custom component.
  if (
    content?.html &&
    content.html.startsWith('<iframe') &&
    content.html.endsWith('</iframe>')
  ) {
    content = null
  }

  return (
    <div className={className}>
      {title && <h3 className='card__title'>{title}</h3>}
      <PostContent content={content} />
      {/* <details>
        <summary>Code</summary>
        <pre>
          <code>{JSON.stringify(post, null, 2)}</code>
        </pre>
      </details> */}
    </div>
  )
}

export { ReferenceSummary }
