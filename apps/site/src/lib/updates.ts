import { getListedPosts } from './archive'
import { defaultFeedTypes } from './post-type-info'

export const UPDATES_PER_PAGE = 10

/** Posts in the updates timeline, newest first. */
export async function getUpdates() {
  return (await getListedPosts()).filter((post) => defaultFeedTypes.includes(post.postType))
}
