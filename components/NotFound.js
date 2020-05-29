import { NextSeo } from 'next-seo'
import PageTitle from './util/PageTitle'

const NotFound = () => (
  <>
    <NextSeo title="Not Found" noIndex />
    <PageTitle>404</PageTitle>
    <p>What you were looking for isn't here anymore</p>
  </>
)

export default NotFound
