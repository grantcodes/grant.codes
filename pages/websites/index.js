import { NextSeo } from 'next-seo'
import Websites from 'components/Websites'

const WebsitesPage = () => (
  <>
    <NextSeo title="Projects" />
    <h1 className="page-title">Projects</h1>
    <Websites />
  </>
)

export default WebsitesPage
