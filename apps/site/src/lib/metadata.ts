export interface MetadataParams {
  typeOrYear?: string
  search?: string
  page?: string
  month?: string
  day?: string
  slug?: string
  category?: string
}

export interface PageMetadata {
  title?: string
  description?: string
}

export async function getMetadata({
  params,
  post,
}: {
  params: MetadataParams
  post?: any
}): Promise<PageMetadata> {
  const metadata: PageMetadata = {}

  // If a post object is provided, extract title/description from it
  if (post) {
    if (post.name) {
      metadata.title = post.name
    }
    if (post.summary) {
      metadata.description = post.summary
    } else if (post.content?.text) {
      metadata.description = post.content.text.slice(0, 200)
    }
    return metadata
  }

  let title = ''

  if (params?.typeOrYear) {
    title = params.typeOrYear
  }

  if (params?.category) {
    title = `Category: ${params.category}`
  }

  if (params?.month) {
    if (params?.typeOrYear) {
      title = `${params.typeOrYear}/${params.month}`
    }
  }

  if (params?.search) {
    title = `Search: "${params.search}"`
  }

  if (params?.page) {
    title += ` page ${params.page}`
  }

  if (title) {
    title = `${title[0].toUpperCase()}${title.slice(1)}`
    metadata.title = title
  }

  return metadata
}
