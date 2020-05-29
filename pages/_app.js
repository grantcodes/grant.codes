import { NextSeo } from 'next-seo'
import Container from 'components/Container'

// TODO: Improve this?
import 'react-image-lightbox/style.css'

const MyApp = ({ Component, pageProps }) => {
  let containerClass = ''
  if (Component.containerClass) {
    containerClass += ' ' + Component.containerClass
  }
  if (pageProps.containerClass) {
    containerClass += ' ' + pageProps.containerClass
  }

  return (
    <Container className={containerClass}>
      {!!pageProps.pageTitle && <NextSeo title={pageProps.pageTitle} />}
      <Component {...pageProps} />
    </Container>
  )
}
export default MyApp
