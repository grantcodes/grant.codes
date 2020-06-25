import React from 'react'
import { getSingle } from '../../lib/get-posts'
import Post from '../Post'
import Loading from '../Loading'
import Card from '../Card'
import NotFound from '../NotFound'
import SingleMeta from './SingleMeta'
import { isRxDocument } from 'rxdb'

const Single = ({ posts }) => {
  const post =
    posts && posts.length
      ? isRxDocument(posts[0])
        ? posts[0].toMf2()
        : posts[0]
      : null

  if (posts && posts.length === 0) {
    return <NotFound />
  }

  return (
    <>
      <SingleMeta post={post} />
      {posts.map((post, i) => (
        <Post key={`single-post-${i}`} post={post} />
      ))}
    </>
  )
}

Single.getInitialProps = async ({
  req,
  res,
  next,
  match: { params },
  history,
  location,
  ...ctx
}) => {
  try {
    let deleted = false

    const auth = require('../../server/lib/auth')
    if (auth) {
      try {
        await auth.requireAuth(req, res, next)
        // search['properties.post-status.0'] = { $exists: true }
      } catch (err) {
        // User isn't authenticated, but that's fine
      }
    }

    let posts = await getSingle({ ...params, findAll: true })

    posts = posts.filter((post) => {
      if (post.properties['post-status'][0] === 'deleted') {
        deleted = true
        if (res) {
          res.status(410)
        }
        return false
      }
      return true
    })

    if (res && !deleted && posts.length === 0) {
      res.status(404)
    } else if (res && !deleted) {
      res.status(200)
    }

    return { posts }
  } catch (err) {
    console.error('[Error getting single post]', err)
  }
}

export default Single
