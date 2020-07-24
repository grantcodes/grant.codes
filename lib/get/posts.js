const getPosts = async (ctx) => {
  try {
    const { query = {}, limit = 10, showAll = false } = ctx
    const token = ctx?.previewData?.token ?? null

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

    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query, limit, showAll }),
      timeout: 15000,
    })
    const data = await res.json()
    const posts = Array.isArray(data) ? data : []
    return posts
  } catch (err) {
    console.warn('[Error getting posts]', err)
    return []
  }
}

const getStaticProps = async (ctx) => {
  let containerClass = ''
  let pageTitle = ''
  let posts = []
  if (!ctx.params) {
    ctx.params = {}
  }
  try {
    posts = await getPosts({ query: ctx.params, ...ctx }, true)
  } catch (err) {
    console.warn('[Error getting posts for static props]', err)
  }
  // TODO: I should smartly set revalidate time.

  // Figure out any container classes / layouts needed
  if (posts.length === 1) {
    containerClass = 'single-' + posts[0].cms.postType
  }
  if (ctx.params.typeOrYear && ctx.params.typeOrYear === 'photos') {
    containerClass = 'gallery'
  }

  // Get page titles
  if (ctx.params.typeOrYear) {
    pageTitle = ctx.params.typeOrYear
  }

  if (ctx.params.page) {
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

  // Check if preview mode / admin
  const previewMode = !!ctx?.preview
  const isAdmin = !!ctx?.previewData?.token

  // Return data
  return {
    props: { posts, containerClass, pageTitle, previewMode, isAdmin },
    revalidate: 60, // Regenerate pages after 60 seconds
  }
}

const getServerSideProps = async (ctx) => {
  const posts = await getPosts({ query: ctx.params, ...ctx })
  // Check if preview mode / admin
  const previewMode = !!ctx?.preview
  const isAdmin = !!ctx?.previewData?.token
  return {
    props: { posts, previewMode, isAdmin },
  }
}

export { getStaticProps, getServerSideProps }
export default getPosts
