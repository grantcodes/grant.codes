import React from 'react'
import { NextSeo } from 'next-seo'

const ErrorMessage = ({ message = 'Something went wrong' }) => (
  <div className="error-message">
    <NextSeo title="Error 😱" description={message} noIndex />
    <h1>😱</h1>
    <p>{message}</p>
  </div>
)

export default ErrorMessage
