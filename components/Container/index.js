import React, { Fragment } from 'react'
import Theme from '../Theme'
import TopographyClipPaths from '../Topography/ClipPaths'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import styled from 'styled-components'
import Meta from './DefaultMeta'
import { theme } from '../Theme/helpers'

// const Topography = asyncComponent({
//   loader: () =>
//     typeof window !== 'undefined'
//       ? import('../Topography')
//       : Promise.resolve(() => null),
// })

const Grid = styled.div`
  display: grid;
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto auto auto;
  grid-template-areas:
    'header'
    'main'
    'footer';
  @media (min-width: ${theme('midBreak')}) {
    grid-template-columns: ${theme('contentWidth')} auto;
    grid-template-rows: ${theme('headerHeight')} auto auto;
    grid-template-areas:
      'main header'
      'main nav'
      'main footer';

    &.right-aligned--wide-content {
      grid-template-columns: auto ${theme('sideWidth')};
    }
  }

  &.single-article {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    @media (min-width: ${theme('midBreak')}) {
      grid-template-columns: auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        'main'
        'footer';
    }
  }
`

const Content = styled.main`
  grid-area: main;
  max-width: 100%;
`

const BackgroundLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -5;
`

const Container = ({ children, className = '' }) => {
  return (
    <Theme>
      <Fragment>
        <Meta />
        <Grid className={'container ' + className}>
          <Header />
          <Nav />
          <Content>{children}</Content>
          <Footer />
        </Grid>
        <BackgroundLayer>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            {/* <Topography /> */}
          </div>
        </BackgroundLayer>
        <TopographyClipPaths />
      </Fragment>
    </Theme>
  )
}

export default Container
