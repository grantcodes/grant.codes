import styled from 'styled-components'
import CardBreakout from './Breakout'
import Button from '../Button'
import { palette, theme } from '../Theme/helpers'

const CardActions = styled(CardBreakout)`
  display: flex !important;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: ${palette('mainAlt')};
  transition: background-color ${theme('themeTransitionTime')};

  ${CardBreakout} + & {
    margin-top: -${theme('cardPadding')};
  }
`
export default CardActions

export const CardActionButton = styled(Button)`
  font-size: 0.8em;
  box-shadow: none;
  border-radius: 0;
`

export const CardActionText = styled.span`
  display: inline-block;
  font-size: 0.7em;
  margin-right: 1em;
  vertical-align: middle;
`
