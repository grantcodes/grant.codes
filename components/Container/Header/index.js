import React from 'react'
// import { asyncComponent } from '@jaredpalmer/after'
import styled from 'styled-components'
import Link from '../../Link'
import PageTitle from '../../util/PageTitle'
import { theme, palette, mixin } from '../../Theme/helpers'

// const Logo = asyncComponent({
//   loader: () =>
//     typeof window !== 'undefined'
//       ? import('./LogoCanvas')
//       : Promise.resolve(null),
// })

const Header = styled.header`
  grid-area: header;
  justify-self: center;
  margin-top: 4rem;
  margin-bottom: 3rem;
  @media (min-width: ${theme('midBreak')}) {
    position: sticky;
    z-index: 1;
    justify-self: start;
    align-self: start;
    margin: 0;
    padding-top: 0.3em;
    height: ${theme('headerHeight')};
    top: 1rem;
    .container.right-aligned & {
      justify-self: end;
    }
  }
  .container.single-article & {
    display: none;
  }
`
const Title = styled(PageTitle)`
  display: inline-block;
  margin: 0;
  text-decoration: overline wavy;
  color: ${palette('contrast')};
  letter-spacing: 0.1em;
  text-shadow: ${mixin.shadow()};
`

const TitleLink = styled(Link)`
  text-decoration: none !important;
  color: inherit;
`

export default () => (
  <Header>
    <Title
    // className={typeof window !== 'undefined' ? 'screen-reader-text' : ''}
    >
      <TitleLink to="/">{process.env.NEXT_PUBLIC_SITE_NAME}</TitleLink>
    </Title>
    {/* <TitleLink to="/">
      <Logo />
    </TitleLink> */}
  </Header>
)
