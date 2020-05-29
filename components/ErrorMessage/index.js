import React from 'react'
import styled from 'styled-components'
import { NextSeo } from 'next-seo'

const ErrorMessage = styled.div`
  max-width: 20em;
`
const ErrorMessageTitle = styled.h1`
  font-size: 4rem;
`
export default ({ message = 'Something went wrong' }) => (
  <ErrorMessage>
    <NextSeo title="Error 😱" description={message} noIndex />
    <ErrorMessageTitle>😱</ErrorMessageTitle>
    <p>{message}</p>
  </ErrorMessage>
)
