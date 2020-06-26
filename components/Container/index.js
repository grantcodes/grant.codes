import classnames from 'classnames'
import TopographyClipPaths from '../Topography/ClipPaths'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import Meta from './DefaultMeta'

// const Topography = asyncComponent({
//   loader: () =>
//     typeof window !== 'undefined'
//       ? import('../Topography')
//       : Promise.resolve(() => null),
// })

const Container = ({ children, className }) => (
  <>
    <Meta />
    <div className={classnames('grid', 'container', className)}>
      <Header />
      <Nav />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
    <div className="background-layer">
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        {/* <Topography /> */}
      </div>
    </div>
    <TopographyClipPaths />
  </>
)

export default Container
