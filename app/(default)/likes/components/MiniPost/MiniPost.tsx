import { AutoEmbed } from './AutoEmbed'
import { ReferenceSummary } from './ReferenceSummary'
import Card from 'components/Card'
import Footer from 'components/Post/Footer'
import Icon from 'components/Icon'
import like from 'eva-icons/fill/svg/heart.svg'

interface MiniPostProps {
  post: any
}

const MiniPost = ({ post }: MiniPostProps) => {
  const { properties } = post
  const likeOf = properties?.['like-of']?.[0]
  const reference = post?.references?.[likeOf]

  return (
    <Card className='post post--like'>
      <div className='card__breakout'>
        <AutoEmbed url={likeOf} post={post} />
      </div>
      <ReferenceSummary post={post} referenceUrl={likeOf} />
      <Footer post={reference ?? post} compact>
        <span className=''>
          <Icon icon={like} />{' '}
          <a className='u-like-of' href={likeOf}>
            {likeOf}
          </a>
        </span>
      </Footer>
    </Card>
  )
}

export { MiniPost }
