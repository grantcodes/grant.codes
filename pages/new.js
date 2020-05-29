import { NextSeo } from 'next-seo'
import Post from 'components/Post'

const NewPostTemplate = () => (
  <>
    <NextSeo
      title={'New Post'}
      description={'The new post page for grant.codes'}
      noIndex
    />
    <Post
      className="postrchild-template"
      post={{
        type: ['h-entry'],
        properties: {
          name: ['New Post'],
          content: [
            {
              html: [
                '<p>This is my new post page. I use it with my postrchild extension to write new posts.</p>',
              ],
            },
          ],
          photo: [''],
          url: [
            typeof window !== 'undefined'
              ? window.location.href
              : process.env.NEXT_PUBLIC_URL,
          ],
        },
        cms: { postType: 'article' },
      }}
    />
  </>
)

NewPostTemplate.containerClass = 'single-article'

export default NewPostTemplate
