import React, { Fragment } from 'react'
import { runQuery } from 'lib/get/posts'
import Post from './Post'
import { NextSeo } from 'next-seo'
import NotFound from './NotFound'
import isAdmin from '../lib/is-admin'
import { isRxDocument } from 'rxdb'

const AuthedPostList = ({ posts, auth, title }) => {
  if (!isAdmin || !auth || posts.length === 0) {
    return <NotFound />
  }

  return (
    <Fragment>
      <NextSeo title={title} noIndex />

      {posts.map((post, i) => (
        <Post
          doc={isRxDocument(post) ? post : null}
          post={isRxDocument(post) ? null : post}
          key={`post-list-${i}`}
          compact
        />
      ))}
    </Fragment>
  )
}

AuthedPostList.getInitialProps = async ({ req, res, next, match }) => {
  const auth = require('../server/lib/auth')
  if (auth) {
    await auth.requireAuth(req, res, next)

    let search = {}
    let title = 'Uh oh'

    if (req && match && match.path) {
      if (match.params.page) {
        const pageNumber = parseInt(match.params.page)
        title = 'Journal Page ' + pageNumber
        search = {
          skip: (pageNumber - 1) * 10,
          'properties.category': {
            $in: ['journal'],
          },
          'properties.visibility': { $exists: 'true' },
        }
      } else {
        switch (match.path) {
          case '/drafts':
            title = 'Drafts'
            search = {
              limit: 999,
              'properties.post-status.0': 'draft',
              'properties.visibility': { $exists: 'true' },
            }
            break
          case '/trash':
            title = 'Trash'
            search = {
              limit: 999,
              'properties.post-status.0': 'deleted',
              'properties.visibility': { $exists: 'true' },
            }
            break
          case '/journal':
            title = 'Journal'
            search = {
              'properties.category': {
                $in: ['journal'],
              },
              'properties.visibility': { $exists: 'true' },
            }
            break
          default:
            break
        }
      }
    }

    const posts = await runQuery(search)

    if (posts.length === 0) {
      res.status(404)
    }
    return { title, posts, auth: true }
  } else {
    res.status(401)
  }
  return { auth: false, posts: [] }
}

export default AuthedPostList
