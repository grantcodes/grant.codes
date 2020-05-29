import React from 'react'
import styled from 'styled-components'
import Title from '../Title'
import { theme, palette } from '../../Theme/helpers'

const Breakout = styled.div`
  display: block;
  overflow: hidden;
  clear: both;
  background-color: ${palette('mainAlt')};
  margin: ${theme('cardPadding')} -${theme('cardPadding')};

  ${Title} + & {
    margin-top: 0;
  }

  & + & {
    margin-top: -${theme('cardPadding')};
  }

  :first-child {
    margin-top: -${theme('cardPadding')};
  }
  :last-child {
    margin-bottom: -${theme('cardPadding')};
  }

  > img {
    display: block;
    width: 100%;
  }
`

export default Breakout
