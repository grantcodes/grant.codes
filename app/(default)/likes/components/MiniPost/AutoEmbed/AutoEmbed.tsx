'use client'

import ReactPlayer from 'react-player/lazy'
import { ReferenceSummary } from '../ReferenceSummary'
import { getEmbedType } from './get-embed-type'
import styles from './AutoEmbed.module.scss'

interface AutoEmbedProps {
  url: string
  post?: any
}

const VideoPlayer = ({ url }: AutoEmbedProps) => (
  <div className={styles.video}>
    <ReactPlayer
      url={url}
      light
      controls
      width='100%'
      height='100%'
      config={{
        youtube: {
          embedOptions: {},
          playerVars: {
            autoplay: 1,
          },
          //   onUnstarted: null,
        },
      }}
    />
  </div>
)

const AutoEmbed = ({ url, post }: AutoEmbedProps) => {
  const reference = post?.references?.[url]
  const embedType = getEmbedType(url)

  if (embedType === 'react-player') {
    return <VideoPlayer url={url} />
  }

  if (embedType === 'image') {
    return (
      <>
        <figure className={styles.image}>
          <img src={url} alt='' aria-hidden='true' loading='lazy' />
          {/* <figcaption>
            <ReferenceSummary post={post} referenceUrl={url} />
          </figcaption> */}
        </figure>
      </>
    )
  }

  if (embedType === 'twitter') {
  }

  // return (
  //   <div className={styles.summary}>
  //     <ReferenceSummary post={post} referenceUrl={url} />
  //   </div>
  // )

  return null
}

export { AutoEmbed }
