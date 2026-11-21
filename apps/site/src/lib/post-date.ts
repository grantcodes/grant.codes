/** The date 1.x archived and ordered a post by: `created` when it has one, else `published`. */
export function postDate(post: { published: Date; properties: Record<string, unknown[]> }): Date {
  const created = post.properties.created?.[0]
  return typeof created === 'string' ? new Date(created) : post.published
}
