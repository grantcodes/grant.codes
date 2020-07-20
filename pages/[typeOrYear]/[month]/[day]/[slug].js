import { useRouter } from 'next/router'
import ErrorPage from 'pages/404'
import Post from 'components/Post'
import getPosts from 'lib/get/posts'

const Page = ({ posts = [] }) => {
  const router = useRouter()

  if (!router.isFallback && !posts.length) {
    return <ErrorPage statusCode={404} />
  }

  return router.isFallback ? (
    <Post
      post={{
        type: ['h-entry'],
        properties: {
          name: ['Loading...'],
          content: ['This post will be with you shortly'],
        },
      }}
    />
  ) : (
      posts.map((post, i) => <Post post={post} key={`post-single-${i}`} />)
    )
}

export async function getStaticPaths() {
  // Get a max of the 500 last posts
  const posts = await getPosts({ limit: 500 }, true)

  // Helper function to add 0 to the start of numbers
  const leadingZero = (num) =>
    parseInt(num) < 10 && parseInt(num) > 0 ? `0${num}` : `${num}`

  // Get the url params for each
  const params = posts.map((post) => {
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
  return {
    paths: params.map((p) => ({ params: p })),
    fallback: true,
  }
}

export { getStaticProps } from 'lib/get/posts'

export default Page
