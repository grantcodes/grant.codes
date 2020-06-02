import { parseCookies } from 'nookies'
import getCollection from '../postr'
import generateSearch from '../../backend/lib/generate-search'

const getPosts = async (ctx, localDatabase = false) => {
  const { query = {}, limit = 10, showAll = false } = ctx
  const { token } = parseCookies(ctx)

  if (localDatabase) {
    const collection = await getCollection()
    const { limit: newLimit = 10, skip = 0, search } = generateSearch({
      query,
      limit,
    })
    // search = postr.generateSearch(search, req.isAdmin)

    const docs = await collection
      .find(search)
      .sort({ indexDate: 'desc' })
      .limit(newLimit)
      .skip(skip)
      .exec()

    const postPromises = docs.map(async (doc) => {
      const mf2 = doc.toMf2()
      if (doc.get('cms.children')) {
        try {
          const children = await doc.populate('cms.children')
          if (children && Array.isArray(children)) {
            mf2.children = children
              .filter((child) => !!child)
              .map((child) => child.toMf2())
          } else {
            throw new Error('children not valid')
          }
        } catch (err) {
          console.warn('[Error populating children]', err)
        }
      }
      return mf2
    })

    const posts = await Promise.all(postPromises)
    return posts
  }

  const url = process.env.NEXT_PUBLIC_API_URL + '/api/search'
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = 'Bearer ' + token
  } else if (process.env.MICROPUB_TOKEN) {
    headers.Authorization = 'Bearer ' + process.env.MICROPUB_TOKEN
  }

  try {
    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query, limit, showAll }),
      timeout: 20000,
    })
    const data = await res.json()
    const posts = Array.isArray(data) ? data : []
    return posts
  } catch (err) {
    console.error('[Error fetching posts]', err)
    return []
  }
}

const getStaticProps = async (ctx) => {
  let containerClass = ''
  let pageTitle = ''
  const posts = await getPosts({ query: ctx.params, ...ctx }, true)
  // TODO: I should smartly set revalidate time.

  // Figure out any container classes / layouts needed
  if (posts.length === 1) {
    containerClass = 'single-' + posts[0].cms.postType
  }
  if (
    ctx.params &&
    ctx.params.typeOrYear &&
    ctx.params.typeOrYear === 'photos'
  ) {
    containerClass = 'gallery'
  }

  // Get page titles
  if (ctx.params && ctx.params.typeOrYear) {
    pageTitle = ctx.params.typeOrYear
  }

  if (ctx.params && ctx.params.page) {
    pageTitle += ` page ${ctx.params.page}`
  }

  if (posts.length === 1) {
    pageTitle =
      'Single ' + pageTitle + ' on ' + process.env.NEXT_PUBLIC_SITE_NAME
    if (posts[0] && posts[0].properties && posts[0].properties.name) {
      pageTitle = posts[0].properties.name[0]
    }
  }

  // Uppercase first letter
  if (pageTitle) {
    pageTitle = `${pageTitle[0].toUpperCase()}${pageTitle.slice(1)}`
  }

  // Return data
  return {
    props: { posts, containerClass, pageTitle },
    unstable_revalidate: 60, // Regenerate pages after 60 seconds
  }
}

const getServerSideProps = async (ctx) => {
  const posts = await getPosts({ query: ctx.params, ...ctx })
  return {
    props: { posts },
  }
}

export { getStaticProps, getServerSideProps }
export default getPosts
