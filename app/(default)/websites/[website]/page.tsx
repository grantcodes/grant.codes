import { notFound } from 'next/navigation'
import Link from 'components/Link'
import Icon from 'components/Icon'
import Card from 'components/Card'
import arrowLeft from 'eva-icons/fill/svg/arrow-back.svg'
import externalLink from 'eva-icons/fill/svg/external-link.svg'
import websites from 'data/websites'

const Website = ({ title, screenshot, url, content = '' }) => (
  <Card>
    <article>
      {!!screenshot && (
        <div className='card__breakout'>
          <img src={screenshot} alt={title + ' Screenshot'} loading='lazy' />
        </div>
      )}

      <header>
        <h1 className='p-name post__title'>{title}</h1>
      </header>

      <main dangerouslySetInnerHTML={{ __html: content }}></main>

      <footer className='card__breakout card__breakout--padded'>
        <Link to='/websites'>
          <Icon icon={arrowLeft} /> All Projects
        </Link>{' '}
        <Link to={url} style={{ float: 'right' }}>
          View Project <Icon icon={externalLink} />
        </Link>
      </footer>
    </article>
  </Card>
)

// export const getStaticProps = ({ params }) => {
//   const slug = params.website
//   return {
//     props: websites.find(website => website.slug === slug),
//   }
// }

// /**
//  * Get all websites as static paths
//  */
// export const getStaticPaths = () => ({
//   paths: websites.map(website => ({ params: { website: website.slug } })),
//   fallback: false,
// })

export async function generateStaticParams () {
  return websites.map(website => ({ website: website.slug }))
}

export default function WebsitePage ({ params }) {
  const website = websites.find(w => w.slug === params?.website)

  if (!website) {
    return notFound()
  }

  return <Website {...website} />
}

// TODO: Not working for some reason.
export async function generateMetadata ({ params }) {
  const website = websites.find(w => w.slug === params?.website)
  return {
    title: website?.title ?? 'Project',
  }
}
