'use client'
import React, { useState } from 'react'
import Button from 'components/Button'
import BackfillMap from './BackfillMap'
import twitter from 'eva-icons/fill/svg/twitter.svg'
import x from 'eva-icons/fill/svg/close.svg'
import instagram from 'eva-icons/fill/svg/camera.svg'
import log from 'eva-icons/fill/svg/code.svg'
import database from 'eva-icons/fill/svg/edit.svg'
import refetch from 'eva-icons/fill/svg/external-link.svg'
import location from 'eva-icons/fill/svg/pin.svg'
import Toast from '../Toast'
import {
  syndicatePost,
  deletePost,
  deleteSyndication,
  postAction,
} from '../../lib/admin-api'

const PostAdmin = ({ post, children }) => {
  const [notification, setNotification] = useState('')
  const [backfillLocations, setBackfillLocations] = useState([])

  const syndicate = async (service) => {
    const result = await syndicatePost(post.properties.url[0], service)
    if (result) {
      setNotification('Syndicated to ' + service)
    } else {
      setNotification('Error syndicating to ' + service)
    }
  }

  const unsyndicate = async (service) => {
    const result = await deleteSyndication(post.properties.url[0], service)
    if (result) {
      setNotification('Syndication deleted from ' + service)
    } else {
      setNotification('Error deleting syndication from  ' + service)
    }
  }

  const hasTwitter =
    post.properties.syndication &&
    post.properties.syndication.some((url) => url.includes('twitter.com'))
  const hasInsta =
    post.properties.syndication &&
    post.properties.syndication.some((url) => url.includes('instagram.com'))

  const hasReference =
    post.properties['like-of'] ||
    post.properties['in-reply-to'] ||
    post.properties['repost-of'] ||
    post.properties['bookmark-of']

  return (
    <>
      <div className="card__breakout card__actions">
        {!!post.properties['post-status'] &&
          post.properties['post-status'][0] !== 'published' && (
            <span className="card__actions__text">
              Status: {post.properties['post-status'][0]}
            </span>
          )}
        <Button
          className="card__actions__button"
          icon={log}
          onClick={() => {
            console.log(post)
            setNotification('Check the console')
          }}
          title="Log"
        />
        <Button
          className="card__actions__button"
          icon={twitter}
          onClick={async () => {
            hasTwitter ? unsyndicate('twitter') : syndicate('twitter')
          }}
          title={hasTwitter ? 'Delete from Twitter' : 'Push to Twitter'}
        />
        <Button
          className="card__actions__button"
          icon={instagram}
          onClick={async () =>
            hasInsta ? unsyndicate('instagram') : syndicate('instagram')
          }
          title={hasInsta ? 'Delete from Instagram' : 'Push to Instagram'}
        />
        {!!hasReference && (
          <Button
            className="card__actions__button"
            icon={refetch}
            onClick={async () => {
              const res = await postAction(
                post.properties.url[0],
                'refetch-references'
              )
              if (res) {
                setNotification('Reference data updated')
              }
            }}
            title="Refetch Reference"
          />
        )}
        {post && post.cms && post.cms._id && (
          <Button
            className="card__actions__button"
            icon={database}
            to={`https://d4c206d3-229f-4679-8e85-43414aa29719-bluemix.cloudant.com/dashboard.html#database/grantcodes/${encodeURIComponent(
              post.cms._id
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View in DB"
          />
        )}
        {!post.properties.location && (
          <Button
            className="card__actions__button"
            icon={location}
            onClick={async () => {
              // Get location from owntracks.
              const res = await postAction(
                post.properties.url[0],
                'backfill-location'
              )
              if (res && res.locations) {
                console.log('got locations.')
                setBackfillLocations(res.locations)
                setNotification('Choose location from map')
              }
            }}
            title="Backfill location"
          />
        )}
        <Button
          className="card__actions__button"
          icon={x}
          onClick={async () => {
            const deleted = await deletePost(post.properties.url[0])
            if (deleted) {
              setNotification('Deleted post')
              window.location.reload()
            } else {
              setNotification('Error deleting post')
            }
          }}
          title="Delete"
        />
        {children}
        {!!notification && <Toast notification={notification} />}
      </div>
      {backfillLocations.length > 0 && (
        <BackfillMap locations={backfillLocations} />
      )}
    </>
  )
}

export default PostAdmin
