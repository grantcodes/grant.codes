const { singular } = require('pluralize')

const generateSearch = ({
  query = {},
  limit = 10,
  showAll = false,
  isAdmin = false,
}) => {
  let search = {}
  let skip = 0

  if (!query) {
    throw new Error('Missing query, cannot generate search')
  }

  // First param can be post type string or year number
  if (query.typeOrYear) {
    if (parseInt(query.typeOrYear)) {
      query.year = parseInt(query.typeOrYear)
    } else {
      query.type = query.typeOrYear
    }
    delete query.typeOrYear
  }

  // Only show visible, published items, unless show all is set
  if (!showAll) {
    search['properties.visibility.0'] = 'visible'
    search['properties.post-status.0'] = 'published'
  }

  // Set posts per page.
  limit = query.type && query.type === 'photos' ? 50 : limit

  // Use pagination
  if (query.page) {
    skip = (parseInt(query.page) - 1) * limit
  }

  // Set post type
  search['cms.postType'] = {
    $in: [
      'note',
      'photo',
      'article',
      'repost',
      'quotation',
      'video',
      'audio',
      'collection',
    ],
  }
  if (query.type) {
    search['cms.postType'] = singular(query.type)
    // TODO: Unsure if I should show unlisted posts in the post type archives or not
    search['properties.visibility.0'] = { $ne: 'private' }
  }

  // Search category
  if (query.category) {
    search['properties.category'] = {
      $in: [query.category],
    }
    if (!query.type) {
      delete search['cms.postType']
    }
  }

  // If a slug or year, month & day is set then we are looking for a single item.
  if (query.slug || (query.day && query.month && query.year)) {
    search['properties.visibility.0'] = {
      $ne: 'private',
    }
    delete search['cms.postType']
    if (showAll) {
      delete search['properties.post-status.0']
    }
  }

  // Query post status
  if (query.postStatus) {
    search['properties.post-status.0'] = query.postStatus
    if (
      (query.postStatus === 'deleted' || query.postStatus === 'draft') &&
      !isAdmin
    ) {
      throw new Error(
        `You need to be an admin to see ${query.postStatus} posts`
      )
    }
  }

  // Query slug
  if (query.slug) {
    if (Array.isArray(query.slug)) {
      query.slug = query.slug[0]
    }
    search['properties.mp-slug.0'] = query.slug
  }

  // Query by date
  if (query.year && query.month && query.day) {
    const startDate = new Date(`${query.year}-${query.month}-${query.day}`)
    // Need to do this so that time zones dont mess stuff up
    startDate.setDate(startDate.getDate() - 1)
    const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000)
    search.$or = [
      {
        'properties.created.0': {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString(),
        },
      },
      {
        'properties.published.0': {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString(),
        },
      },
    ]
  }

  // Search with text
  if (query.search) {
    delete search['cms.postType']
    const searchRegex = new RegExp(
      query.search.toLowerCase().trim().replace('+', ' '),
      'i'
    )
    search.$or = [
      { 'properties.name.0': { $regex: searchRegex } },
      { 'properties.summary.0': { $regex: searchRegex } },
      { 'properties.content.0.value': { $regex: searchRegex } },
    ]
  }

  return { search, skip, limit }
}

module.exports = generateSearch
