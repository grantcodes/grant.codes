import { notFound } from 'next/navigation'
import Post from 'components/Post'
import getPosts from 'lib/get/posts'

const Page = async ({ params }) => {
  const posts = await getPosts({ query: params })

  if (!posts || !posts.length) {
    return notFound()
  }

  return posts.map((post, i) => <Post post={post} key={`post-single-${i}`} />)
}

export async function generateStaticParams () {
  // Get a max of the 250 last posts
  const posts = await getPosts({ limit: 25 })

  // Helper function to add 0 to the start of numbers
  const leadingZero = num =>
    parseInt(num) < 10 && parseInt(num) > 0 ? `0${num}` : `${num}`

  // Get the url params for each
  const params = posts.map(post => {
    const date = new Date(
      post.properties.created
        ? post.properties.created[0]
        : post.properties.published[0]
    )
    const year = date.getFullYear()
    const month = leadingZero(date.getMonth() + 1)
    const day = leadingZero(date.getDate())
    const slug = post.properties['mp-slug'][0]

    // typeOrYear needs to be a string
    return { year, month, day, slug, typeOrYear: `${year}` }
  })

  // Return the paths, with a fallback to dynamically render older posts
  return params
}

export default Page
