import React from 'react'
import styled from 'styled-components'
import CardTitle from './Title'
import { palette, theme, mixin } from '../Theme/helpers'

const Card = styled.div`
  background-color: ${palette('main')};
  padding: ${theme('cardPadding')};
  margin-bottom: ${theme('cardPadding')};
  transition: background ${theme('themeTransitionTime')};
  border-radius: ${theme('borderRadius')};
  overflow: hidden;
  border-bottom: 1px solid ${palette('mainBorder')};
  box-shadow: ${mixin.shadow()};

  ${({ highlighted }) =>
    !!highlighted &&
    `
box-shadow: 2px 0px 0 ${palette('contrast')}, 2px -2px 0 ${palette('contrast')},
  -2px 0px 0 ${palette('contrast')}, -2px -2px 0 ${palette('contrast')};
  `}
`

// TODO: Convert this stuff to components
// .card__action-name {
//   font-size: 0.7em;
//   background-color: ${palette('main')};
//   padding: 0.7em $card-padding;
// }

// .content-container__title {
//   // color: #fff;
//   font-size: ${mixin.fs( 1)};
//   @media (min-width:${({theme}) => theme.midBreak}) {
//     // color: #5c5c5c;
//     font-size: ${mixin.fs( 2)};
//   }
// }

// .h-entry .h-cite .is-long-content {
//   @include scut-hide-visually();
// }

export default ({ children, title }) => (
  <Card>
    {!!title && <CardTitle>{title}</CardTitle>}
    {children}
  </Card>
)
