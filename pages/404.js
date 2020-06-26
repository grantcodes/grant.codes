import { NextSeo } from 'next-seo'

const ErrorPage = ({ statusCode = 404 }) => (
  <>
    <NextSeo title="Not Found" noIndex />
    <h1 className="page-title">{statusCode}</h1>
    <p>What you were looking for isn't here anymore</p>
  </>
)

export default ErrorPage
