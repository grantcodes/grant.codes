import styled from 'styled-components'
import Link from 'components/Link'
import Icon from 'components/Icon'
import Card from 'components/Card'
import CardBreakout from 'components/Card/Breakout'
import { NextSeo } from 'next-seo'
import arrowLeft from '../../svgs/arrow-left.svg'
import externalLink from '../../svgs/external-link.svg'
import { theme } from 'components/Theme/helpers'
import websites from '../../data/websites'

const WebsiteFooter = styled(CardBreakout)`
  padding: ${theme('cardPadding')};
`

export default ({ title, screenshot, url, content, ...props }) => (
  <Card>
    <NextSeo title={title} />
    <article>
      {!!screenshot && (
        <CardBreakout>
          <img src={screenshot} alt={title + ' Screenshot'} />
        </CardBreakout>
      )}

      <header>
        <h1 className="p-name post__title">{title}</h1>
      </header>

      <main dangerouslySetInnerHTML={{ __html: content }}></main>

      <WebsiteFooter as="footer">
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
  console.log('website static props')
  const slug = params.website
  return {
    props: websites.find((website) => website.slug === slug),
  }
}

/**
 * Get all websites as static paths
 */
export const getStaticPaths = () => {
  console.log('website static path')
  return {
    paths: websites.map((website) => ({ params: { website: website.slug } })),
    fallback: false,
  }
}
