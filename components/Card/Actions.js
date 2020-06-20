import styled from 'styled-components'
import Button from '../Button'
import { palette, theme } from '../Theme/helpers'

// TODO: Extends card__breakout
const CardActions = styled.div`
  display: flex !important;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: var(--color-main--alt);
  transition: background-color var(--theme-transition-time);

  .card__breakout + & {
    margin-top: -var(--card-padding);
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
