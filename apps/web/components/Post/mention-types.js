import comment from 'eva-icons/fill/svg/message-square.svg'
import like from 'eva-icons/fill/svg/heart.svg'
import reply from 'eva-icons/fill/svg/corner-up-left.svg'
import mention from 'eva-icons/fill/svg/share.svg'
import bookmark from 'eva-icons/fill/svg/bookmark.svg'
import repost from 'eva-icons/fill/svg/repeat.svg'

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
