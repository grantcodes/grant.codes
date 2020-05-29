import React from 'react'
import { asyncComponent } from '@jaredpalmer/after'
import styled from 'styled-components'
import { theme, palette, mixin } from '../../Theme/helpers'

const Logo = asyncComponent({
  loader: () =>
    typeof window !== 'undefined'
      ? import('./LogoCanvas')
      : Promise.resolve(null),
})

const LogoWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 100;

  html body & div canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: none !important;
    @media (min-width: ${theme('midBreak')}) {
      max-height: none !important;
    }
  }
`

export default () => (
  <LogoWrapper>
    <Logo width={3000} height={1000} />
  </LogoWrapper>
)
