import comment from '../../svgs/comment.svg'
import like from '../../svgs/heart.svg'
import reply from '../../svgs/reply.svg'
import mention from '../../svgs/share.svg'
import bookmark from '../../svgs/bookmark.svg'
import repost from '../../svgs/repost.svg'

export default [
  {
    id: 'likes',
    key: 'like',
    title: 'Likes',
    icon: like,
  },
  {
    id: 'reposts',
    key: 'repost',
    title: 'Reposts',
    icon: repost,
  },
  {
    id: 'comments',
    key: 'comment',
    title: 'Comments',
    icon: comment,
  },
  {
    id: 'webmentions',
    key: 'webmention',
    title: 'Other Mentions',
    icon: mention,
  },
]
