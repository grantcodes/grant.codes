import styled from 'styled-components'
import Link from 'components/Link'
import Icon from 'components/Icon'
import Card from 'components/Card'
import { NextSeo } from 'next-seo'
import arrowLeft from 'eva-icons/fill/svg/arrow-back.svg'
import externalLink from 'eva-icons/fill/svg/external-link.svg'
import websites from '../../data/websites'

// TODO: extends card__breakout
const WebsiteFooter = styled.div`
  padding: var(--card-padding);
`

export default ({ title, screenshot, url, content, ...props }) => (
  <Card>
    <NextSeo title={title} />
    <article>
      {!!screenshot && (
        <div className="card__breakout">
          <img src={screenshot} alt={title + ' Screenshot'} />
        </div>
      )}

      <header>
        <h1 className="p-name post__title">{title}</h1>
      </header>

      <main dangerouslySetInnerHTML={{ __html: content }}></main>

      <WebsiteFooter as="footer" className="card__breakout">
        <Link to="/websites">
          <Icon icon={arrowLeft} /> All Projects
        </Link>{' '}
        <Link to={url} style={{ float: 'right' }}>
          View Project <Icon icon={externalLink} />
        </Link>
      </WebsiteFooter>
    </article>
  </Card>
)

export const getStaticProps = ({ params }) => {
  const slug = params.website
  return {
    props: websites.find((website) => website.slug === slug),
  }
}

/**
 * Get all websites as static paths
 */
export const getStaticPaths = () => ({
  paths: websites.map((website) => ({ params: { website: website.slug } })),
  fallback: false,
})
