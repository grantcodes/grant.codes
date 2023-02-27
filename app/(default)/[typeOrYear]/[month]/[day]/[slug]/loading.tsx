import Post from 'components/Post'

const Loading = ({ params }) => {
  return (
    <Post
      post={{
        type: ['h-entry'],
        properties: {
          name: ['Loading...'],
          content: ['This post will be with you shortly'],
        },
      }}
    />
  )
}

export default Loading
