import React from 'react'
import { NextSeo } from 'next-seo'
import Card from 'components/Card'

const PaymentThanks = () => (
  <>
    <NextSeo title="Thank You!" noIndex />
    <h1 className="page-title">I'm Rich! 🎉💰</h1>
    <Card>
      <p>Thank you very much for paying me. It is much appreciated</p>
    </Card>
  </>
)

export default PaymentThanks
