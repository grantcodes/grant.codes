import React from 'react'
import styled from 'styled-components'

const Icon = styled.span`
  display: inline-block;
  max-width: 100%;
  width: 1em;
  height: 1em;
  fill: currentColor;
  stroke: currentColor;
  vertical-align: middle;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export default ({ icon }) => (
  <Icon
    dangerouslySetInnerHTML={{
      __html: icon.replace('<svg ', '<svg width="24" height="24" '),
    }}
  />
)
