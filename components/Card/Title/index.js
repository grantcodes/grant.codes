import styled from 'styled-components'
import { mixin } from '../../Theme/helpers'

const CardTitle = styled.h2`
  font-weight: bold;
  font-size: ${mixin.fs( 2)};
  margin-top: 0;
  margin-bottom: ${mixin.space( 1)};
`
export default CardTitle
