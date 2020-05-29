import styled from 'styled-components'
import { mixin } from '../Theme/helpers'

const PageTitle = styled.h1`
  font-weight: bold;
  font-size: ${mixin.fs( 4)};
  margin-top: 0;
  margin-bottom: ${mixin.space( 1)};
`

export default PageTitle
