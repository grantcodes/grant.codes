import { NextSeo } from 'next-seo'
import PageTitle from 'components/util/PageTitle'

const ErrorPage = ({ statusCode = 404 }) => (
  <>
    <NextSeo title="Not Found" noIndex />
    <PageTitle>{statusCode}</PageTitle>
    <p>What you were looking for isn't here anymore</p>
  </>
)

export default ErrorPage
