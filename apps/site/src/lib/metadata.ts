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
    const properties = post.properties ?? {}
    if (properties.name?.[0]) {
      metadata.title = properties.name[0]
    }
    if (properties.summary?.[0]) {
      metadata.description = typeof properties.summary[0] === 'string'
        ? properties.summary[0]
        : properties.summary[0].value ?? ''
    } else if (properties.content?.[0]?.value) {
      metadata.description = properties.content[0].value.slice(0, 200)
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
