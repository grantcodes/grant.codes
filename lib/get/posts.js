import { parseCookies } from 'nookies'
import curriedTransparentize from 'polished/lib/color/transparentize'

const postsCache = []

const getPosts = async (ctx) => {
  const { query = {}, limit = 10, showAll = false } = ctx
  const { token } = parseCookies(ctx)
  const queryJson = JSON.stringify({ query, limit, showAll })

  // Chack cache for posts first
  const cacheHit = postsCache.find((item) => item.queryJson === queryJson)
  if (cacheHit) {
    return cacheHit.posts
  }

  // const url = process.env.NEXT_PUBLIC_URL + '/api/search'
  const url = process.env.NEXT_PUBLIC_API_URL + '/api/search'
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (token) {
    headers.Authorization = token
  } else if (process.env.MICROPUB_TOKEN) {
    headers.Authorization = process.env.MICROPUB_TOKEN
  }
  const res = await fetch(url, {
    headers,
    method: 'POST',
    body: queryJson,
    timeout: 5000,
  })
  const data = await res.json()
  const posts = Array.isArray(data) ? data : []

  postsCache.push({ queryJson, posts })

  return posts
}

const getStaticProps = async (ctx) => {
  let containerClass = ''
  let pageTitle = ''
  const posts = await getPosts({ query: ctx.params, ...ctx })
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
