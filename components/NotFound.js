import { NextSeo } from 'next-seo'

const NotFound = () => (
  <>
    <NextSeo title="Not Found" noIndex />
    <h1 className="page-title">404</h1>
    <p>What you were looking for isn't here anymore</p>
  </>
)

export default NotFound
