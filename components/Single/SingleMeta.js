import { NextSeo } from 'next-seo'

const SingleMeta = ({ post }) => {
  if (!post) {
    return null
  }

  let title = ''
  let description = ''

  if (post.properties.name) {
    title = post.properties.name[0]
  }
  if (post.properties.summary) {
    description = post.properties.summary[0]
  } else if (post.properties.content && post.properties.content[0].value) {
    description = post.properties.content[0].value.slice(0, 200)
  }

  return <NextSeo title={title} description={description} />
}

export default SingleMeta
