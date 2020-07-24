import { NextSeo } from 'next-seo'
import Container from 'components/Container'
import { Provider } from 'lib/hooks/use-context'

// TODO: Improve this?
import '../css/base/index.scss'
import '../css/components/index.scss'
import '../css/pages/index.scss'
import 'react-image-lightbox/style.css'
import 'leaflet/dist/leaflet.css'

const MyApp = ({ Component, pageProps }) => {
  let containerClass = ''
  if (Component.containerClass) {
    containerClass += ' ' + Component.containerClass
  }
  if (pageProps.containerClass) {
    containerClass += ' ' + pageProps.containerClass
  }

  const contextData = {
    isAdmin: pageProps?.isAdmin ?? false,
    previewMode: pageProps?.previewMode ?? false,
  }

  return (
    <Provider data={contextData}>
      <Container className={containerClass}>
        {!!pageProps.pageTitle && <NextSeo title={pageProps.pageTitle} />}
        <Component {...pageProps} />
      </Container>
    </Provider>
  )
}
export default MyApp
