import getPosts from 'lib/get/posts'
import Pagination from 'components/Container/Pagination'
import { MiniPost } from '../components/MiniPost'

const LIMIT = 9999

const LikesPage = async ({}) => {
  const posts = await getPosts({
    query: {
      typeOrYear: 'like',
      likeOfDomains: [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'twitch.tv',
        'tiktok.com',
      ],
    },
    limit: LIMIT,
  })

  return (
    <>
      <h2 className='page-title'>Likes</h2>
      {posts.map(post => (
        <MiniPost key={post?.properties?.url?.[0]} post={post} />
      ))}
      <Pagination noNext={posts.length < LIMIT} />
    </>
  )
}

export { generateMetadata } from 'lib/get/metadata'

export default LikesPage
